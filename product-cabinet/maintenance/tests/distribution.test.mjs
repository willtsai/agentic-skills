import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { test } from "node:test";

const exec = promisify(execFile);
const root = fileURLToPath(new URL("../../", import.meta.url));
const authored = [
  "architecture-review", "board-review", "customer-discovery",
  "developer-experience-review", "engineering-planning", "go-to-market",
  "product-ceo", "product-design-review", "product-specification", "quality-review"
];
const expected = [...authored, "classic-style"].sort();
const read = relative => readFile(path.join(root, relative), "utf8");
const json = async relative => JSON.parse(await read(relative));

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

test("every authoring skill requires classic-style without relaxing document contracts", async () => {
  assert.deepEqual((await readdir(path.join(root, "skills"))).sort(), expected);
  for (const name of authored) {
    const skill = await read(`skills/${name}/SKILL.md`);
    assert.match(skill, /invoke the bundled `classic-style` skill before final validation/);
    assert.match(skill, /keep my structure; output only/);
    assert.match(skill, /claims, citations, uncertainty, decisions, and code examples/);
    assert.match(skill, /Keep style notes in chat, outside the document/);
    assert.match(skill, /report the missing dependency/);
  }
  assert.match(await read("skills/product-specification/SKILL.md"), /Do not add other headings/);
  assert.match(await read("skills/quality-review/SKILL.md"), /not permission to rewrite the artifact under review/);
});

test("vendored content and license match Skillpacker's pinned integrity", async () => {
  const manifest = await json("skillpacker.json");
  const lock = await json("skillpacker.lock.json");
  const entry = lock.packages["classic-style"];
  assert.equal(entry.revision, manifest.dependencies["classic-style"].source.ref);
  assert.match(entry.revision, /^[a-f0-9]{40}$/);
  assert.deepEqual(entry.manifest.skills, ["classic-style"]);
  const hash = createHash("sha256").update(canonical(entry.manifest));
  for (const [source, local] of [
    ["LICENSE", "skills/classic-style/.skillpacker/notices/LICENSE"],
    ["classic-style/SKILL.md", "skills/classic-style/SKILL.md"],
    ["classic-style/references/classic-style.md", "skills/classic-style/references/classic-style.md"]
  ]) {
    const bytes = await readFile(path.join(root, local));
    hash.update(canonical([source, false, bytes.length]));
    hash.update(bytes);
  }
  assert.equal(`sha256:${hash.digest("hex")}`, entry.integrity);
  const records = await json("skillpacker.provenance.json");
  assert.equal(records.length, 1);
  const provenance = records[0];
  assert.equal(provenance.package, "classic-style");
  assert.equal(provenance.source.type, "git");
  assert.equal(provenance.integrity, entry.integrity);
  assert.equal(provenance.revision, entry.revision);
  assert.equal(provenance.metadataOrigin, "consumer");
  assert.match(await read("skills/classic-style/.skillpacker/notices/LICENSE"), /Copyright \(c\) 2026 Ryan Waite/);
});

test("frozen sync is checkout-independent, detects drift, and restores the dependency", {
  skip: !process.env.SKILLPACKER_CLI && "Set SKILLPACKER_CLI to run the networked bundling test"
}, async t => {
  const temporary = await mkdtemp(path.join(tmpdir(), "cabinet-sync-test-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const checkout = path.join(temporary, "product-cabinet");
  await cp(root, checkout, { recursive: true });
  const run = (...args) => exec(process.execPath, [
    path.join(checkout, "maintenance/sync-external-skills.mjs"),
    "--skillpacker", path.resolve(process.env.SKILLPACKER_CLI), ...args
  ]);
  await run("--check");
  const file = path.join(checkout, "skills/classic-style/SKILL.md");
  await writeFile(file, "Edited vendor content");
  await assert.rejects(run("--check"), /Vendored content differs/);
  await run();
  assert.equal(await readFile(file, "utf8"), await read("skills/classic-style/SKILL.md"));
  await run("--check");
});

test("marketplace sources include the dependency and plugin versions agree", async () => {
  const plugin = await json("plugin.json");
  assert.equal(plugin.version, "0.1.3");
  assert.equal((await json(".claude-plugin/plugin.json")).version, plugin.version);
  for (const host of [".github/plugin", ".claude-plugin"]) {
    const marketplace = await json(`../${host}/marketplace.json`);
    const entry = marketplace.plugins.find(p => p.name === "product-cabinet");
    assert.equal(path.resolve(root, "..", entry.source), path.resolve(root));
    if (entry.version) assert.equal(entry.version, plugin.version);
  }
});

for (const [label, command, prefix, installer, force] of [
  ["Bash", "bash", [], "install.sh", "--force"],
  ["PowerShell", "pwsh", ["-NoProfile", "-File"], "install.ps1", "-Force"]
]) {
  test(`${label}: full, selective and standalone installs include the right skills and notices`, async t => {
    try {
      await exec(command, command === "bash" ? ["--version"] : ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"]);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      t.skip(`${command} is not installed`);
      return;
    }
    const temporary = await mkdtemp(path.join(tmpdir(), "cabinet-install-test-"));
    t.after(() => rm(temporary, { recursive: true, force: true }));
    const run = (destination, args = []) => exec(command, [...prefix, path.join(root, installer), ...args], {
      env: { ...process.env, COPILOT_SKILLS_DIR: destination }
    });
    const partial = path.join(temporary, "partial");
    await run(partial, ["product-specification"]);
    assert.deepEqual((await readdir(partial)).sort(), ["classic-style", "product-specification"]);
    assert.match(await readFile(path.join(partial, "classic-style/.skillpacker/notices/LICENSE"), "utf8"), /Ryan Waite/);
    assert.equal(await readFile(path.join(partial, "classic-style/references/classic-style.md"), "utf8"),
      await read("skills/classic-style/references/classic-style.md"));
    const marker = path.join(partial, "classic-style/custom.txt");
    await writeFile(marker, "Keep my customization");
    await run(partial, ["product-specification"]);
    assert.equal(await readFile(marker, "utf8"), "Keep my customization");
    await run(partial, [force, "product-specification"]);
    await assert.rejects(readFile(marker), { code: "ENOENT" });
    const all = path.join(temporary, "all");
    await run(all);
    assert.deepEqual((await readdir(all)).sort(), expected);
    const standalone = path.join(temporary, "standalone");
    await run(standalone, ["classic-style"]);
    assert.deepEqual(await readdir(standalone), ["classic-style"]);
    await assert.rejects(run(path.join(temporary, "invalid"), ["not-a-skill"]));
  });
}
