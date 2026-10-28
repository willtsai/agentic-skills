import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { test } from "node:test";

const exec = promisify(execFile);
const root = fileURLToPath(new URL("../../", import.meta.url));
const read = relative => readFile(path.join(root, relative), "utf8");

test("frozen sync is checkout-independent, detects drift, and restores the dependency", async t => {
  const temporary = await mkdtemp(path.join(tmpdir(), "cabinet-sync-test-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const checkout = path.join(temporary, "product-cabinet");
  await cp(root, checkout, { recursive: true });
  const authored = (await readdir(path.join(root, "skills"))).filter(name => name !== "classic-style");
  const authoredBefore = await Promise.all(authored.map(name => read(`skills/${name}/SKILL.md`)));
  const lockBefore = await read("skillpacker.lock.json");
  const noticesBefore = await read("THIRD-PARTY-NOTICES.md");
  const override = process.env.SKILLPACKER_CLI
    ? ["--skillpacker", path.resolve(process.env.SKILLPACKER_CLI)]
    : [];
  const run = (...args) => exec(process.execPath, [
    path.join(checkout, "maintenance/sync-external-skills.mjs"),
    ...override, ...args
  ], { cwd: temporary });
  await run("--check");
  const file = path.join(checkout, "skills/classic-style/SKILL.md");
  await writeFile(file, "Edited vendor content");
  await assert.rejects(run("--check"), /Vendored content differs/);
  await run();
  assert.equal(await readFile(file, "utf8"), await read("skills/classic-style/SKILL.md"));
  const noticesFile = path.join(checkout, "THIRD-PARTY-NOTICES.md");
  const revision = JSON.parse(lockBefore).packages["classic-style"].revision;
  await writeFile(noticesFile, noticesBefore.replace(revision, "0".repeat(40)));
  await assert.rejects(run("--check"), /Root content changed/);
  await run("--refresh");
  assert.equal(await readFile(noticesFile, "utf8"), noticesBefore);
  await run("--check");
  assert.equal(await readFile(path.join(checkout, "skillpacker.lock.json"), "utf8"), lockBefore);
  const manifestFile = path.join(checkout, "skillpacker.json");
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
  manifest.version = "0.2.0";
  await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
  await assert.rejects(run("--check"), /manifest changed/i);
  await run("--refresh");
  await run("--check");
  const refreshed = JSON.parse(await readFile(path.join(checkout, "skillpacker.lock.json"), "utf8"));
  assert.equal(refreshed.root.manifest.version, manifest.version);
  assert.equal(refreshed.packages["classic-style"].revision, manifest.dependencies["classic-style"].source.ref);
  assert.deepEqual(await Promise.all(authored.map(name =>
    readFile(path.join(checkout, "skills", name, "SKILL.md"), "utf8"))), authoredBefore);
});
