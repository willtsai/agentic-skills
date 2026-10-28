import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { commitDependencyUpdate } from "../commit-dependency-update.mjs";

const repository = "example/skills";
const branch = "update-classic-style";
const lockPath = "product-cabinet/skillpacker.lock.json";

async function fixture(t) {
  const temporary = await mkdtemp(path.join(tmpdir(), "cabinet-pr-sync-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const cwd = path.join(temporary, "checkout");
  const remote = path.join(temporary, "remote.git");
  await mkdir(cwd);
  const git = (...args) => execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "--initial-branch=main");
  git("config", "user.name", "Test");
  git("config", "user.email", "test@example.com");
  for (const [file, contents] of [
    [lockPath, "{}\n"],
    ["product-cabinet/skillpacker.provenance.json", "[]\n"],
    ["product-cabinet/THIRD-PARTY-NOTICES.md", "Attribution\n"],
    ["product-cabinet/skills/classic-style/SKILL.md", "Original skill\n"],
    ["README.md", "Authored documentation\n"]
  ]) {
    await mkdir(path.dirname(path.join(cwd, file)), { recursive: true });
    await writeFile(path.join(cwd, file), contents);
  }
  git("add", ".");
  git("commit", "-m", "Test fixture\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>");
  git("init", "--bare", remote);
  git("remote", "add", "origin", remote);
  git("push", "origin", "main");
  git("checkout", "-b", branch);
  git("push", "origin", branch);
  const head = git("rev-parse", "HEAD");
  const pr = {
    state: "open", base: { ref: "main" },
    head: { sha: head, ref: branch, repo: { full_name: repository } }
  };
  const calls = [];
  const gh = (...args) => {
    calls.push(args);
    if (args[0] === "api") return JSON.stringify(pr);
    if (args.join(" ") === "auth setup-git") return "";
    if (args.join(" ") === `workflow run product-cabinet.yml --repo ${repository} --ref ${branch}`) return "";
    throw new Error(`Unexpected gh call: ${args.join(" ")}`);
  };
  const run = overrides => commitDependencyUpdate({ cwd, repository, number: 42, branch, gh, ...overrides });
  const change = () => writeFile(path.join(cwd, lockPath), '{"refreshed":true}\n');
  return { cwd, remote, git, head, pr, calls, gh, run, change };
}

test("PR sync pushes scoped files to the existing branch and dispatches CI; retries avoid empty commits", async t => {
  const f = await fixture(t);
  await f.change();
  f.run();
  const next = f.git("rev-parse", "HEAD");
  assert.notEqual(next, f.head);
  assert.equal(f.git("--git-dir", f.remote, "rev-parse", `refs/heads/${branch}`), next);
  assert.equal(f.git("--git-dir", f.remote, "rev-parse", "refs/heads/main"), f.head);
  assert.equal(f.git("diff", "--name-only", f.head, next), lockPath);
  assert.match(f.git("log", "-1", "--format=%B"), /Co-authored-by: Copilot/);
  assert.equal(await readFile(path.join(f.cwd, "README.md"), "utf8"), "Authored documentation\n");
  assert.equal(f.calls.filter(call => call[0] === "workflow").length, 1);
  f.pr.head.sha = next;
  f.run();
  assert.equal(f.git("rev-parse", "HEAD"), next);
  assert.equal(f.calls.filter(call => call[0] === "auth").length, 1);
  assert.equal(f.calls.filter(call => call[0] === "workflow").length, 2);
});

test("PR sync reports dispatch failures and can retry checks without another commit", async t => {
  const f = await fixture(t);
  await f.change();
  assert.throws(() => f.run({
    gh: (...args) => {
      if (args[0] === "workflow") throw new Error("Dispatch denied");
      return f.gh(...args);
    }
  }), /Dispatch denied/);
  const pushed = f.git("--git-dir", f.remote, "rev-parse", `refs/heads/${branch}`);
  assert.notEqual(pushed, f.head);
  f.pr.head.sha = pushed;
  f.run();
  assert.equal(f.git("rev-parse", "HEAD"), pushed);
  assert.equal(f.calls.filter(call => call[0] === "auth").length, 1);
  assert.equal(f.calls.filter(call => call[0] === "workflow").length, 1);
});

for (const scenario of ["fork", "closed", "stale", "main", "unrelated", "staged"]) {
  test(`PR sync refuses ${scenario} updates without pushing or dispatching`, async t => {
    const f = await fixture(t);
    await f.change();
    if (scenario === "fork") f.pr.head.repo.full_name = "someone/skills";
    if (scenario === "closed") f.pr.state = "closed";
    if (scenario === "stale") f.pr.head.sha = "0".repeat(40);
    if (scenario === "unrelated") await writeFile(path.join(f.cwd, "README.md"), "Unexpected edit\n");
    if (scenario === "staged") f.git("add", lockPath);
    const expected = {
      fork: /closed, forked, or mismatched/, closed: /closed, forked, or mismatched/,
      stale: /branch moved/, main: /non-main PR branch/,
      unrelated: /non-generated file/, staged: /pre-staged changes/
    };
    assert.throws(() => f.run(scenario === "main" ? { branch: "main" } : {}), expected[scenario]);
    assert.equal(f.git("--git-dir", f.remote, "rev-parse", `refs/heads/${branch}`), f.head);
    assert.equal(f.calls.filter(call => call[0] === "workflow").length, 0);
  });
}

test("PR sync does not force-push over a branch that changes after the API check", async t => {
  const f = await fixture(t);
  await f.change();
  let concurrent;
  assert.throws(() => f.run({
    gh: (...args) => {
      if (args[0] === "auth") {
        concurrent = f.git("--git-dir", f.remote, "-c", "user.name=Test", "-c", "user.email=test@example.com",
          "commit-tree", `${f.head}^{tree}`, "-p", f.head, "-m",
          "Concurrent change\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>");
        f.git("--git-dir", f.remote, "update-ref", `refs/heads/${branch}`, concurrent);
      }
      return f.gh(...args);
    }
  }), /rejected|fetch first|non-fast-forward/);
  assert.equal(f.git("--git-dir", f.remote, "rev-parse", `refs/heads/${branch}`), concurrent);
  assert.equal(f.calls.filter(call => call[0] === "workflow").length, 0);
});
