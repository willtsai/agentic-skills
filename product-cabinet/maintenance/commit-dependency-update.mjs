#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const generatedPaths = [
  "product-cabinet/skillpacker.lock.json",
  "product-cabinet/skillpacker.provenance.json",
  "product-cabinet/skills/classic-style",
  "product-cabinet/THIRD-PARTY-NOTICES.md"
];

export function commitDependencyUpdate({
  repository, number, branch, cwd = process.cwd(),
  gh = (...args) => execFileSync("gh", args, { encoding: "utf8" })
}) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? "") || !/^[1-9]\d*$/.test(String(number ?? ""))) {
    throw new Error("GITHUB_REPOSITORY and a positive PR_NUMBER are required");
  }
  if (!branch || branch === "main") throw new Error("PR_BRANCH must name a non-main PR branch");
  const git = (...args) => execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8" });
  cwd = git("rev-parse", "--show-toplevel").trim();
  git("check-ref-format", "--branch", branch);
  const head = git("rev-parse", "HEAD").trim();
  const pr = JSON.parse(gh("api", `repos/${repository}/pulls/${number}`));
  if (pr.state !== "open" || pr.base?.ref !== "main" ||
      pr.head?.repo?.full_name !== repository || pr.head?.ref !== branch) {
    throw new Error("Refusing to update a closed, forked, or mismatched pull request");
  }
  if (pr.head.sha !== head) throw new Error("PR branch moved during the build; rerun the sync workflow");
  if (git("diff", "--cached", "--name-only").trim()) {
    throw new Error("Refusing to commit pre-staged changes");
  }
  const changed = [
    ...git("diff", "--name-only", "--no-renames", "-z", "HEAD").split("\0"),
    ...git("ls-files", "--others", "--exclude-standard", "-z").split("\0")
  ].filter(Boolean);
  for (const file of changed) {
    if (!generatedPaths.includes(file) && !file.startsWith("product-cabinet/skills/classic-style/")) {
      throw new Error(`Refusing to commit a non-generated file: ${file}`);
    }
  }
  if (changed.length) {
    git("add", "--", ...generatedPaths);
    git("-c", "user.name=github-actions[bot]",
      "-c", "user.email=41898282+github-actions[bot]@users.noreply.github.com",
      "commit", "-m", "chore(product-cabinet): sync bundled skill dependencies",
      "-m", "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>");
    gh("auth", "setup-git");
    git("push", "origin", `HEAD:refs/heads/${branch}`);
    console.log("Committed generated dependency files to the existing PR branch.");
  } else {
    console.log("Generated dependency files are already current; no commit needed.");
  }
  // Dispatch explicitly because bot-generated events do not run CI automatically.
  gh("workflow", "run", "product-cabinet.yml", "--repo", repository, "--ref", branch);
  console.log("Dispatched Product Cabinet validation for the PR branch.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    commitDependencyUpdate({
      repository: process.env.GITHUB_REPOSITORY,
      number: process.env.PR_NUMBER,
      branch: process.env.PR_BRANCH
    });
  } catch (error) {
    console.error(`commit-dependency-update: ${error.message}`);
    process.exitCode = 1;
  }
}
