#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = fileURLToPath(new URL("../", import.meta.url));
const vendoredName = "classic-style";

function updateAttribution(notices, source, revision, skills) {
  const url = new URL(source.url);
  const repository = url.pathname.replace(/^\//, "").replace(/\.git$/, "");
  if (source.type !== "git" || url.protocol !== "https:" || url.hostname !== "github.com" ||
      url.username || url.password || url.search || url.hash ||
      !/^[\w.-]+\/[\w.-]+$/.test(repository)) {
    throw new Error("Automatic Classic Style attribution requires a GitHub HTTPS repository URL");
  }
  if (!/^[a-f0-9]{40}$/.test(revision ?? "") || !Array.isArray(skills) || skills.length !== 1) {
    throw new Error("Classic Style requires a full commit SHA and exactly one consumer-declared skill path");
  }
  const sourcePath = path.posix.join(source.subdir ?? "", skills[0])
    .split("/").map(encodeURIComponent).join("/");
  const pattern = /^The bundled \[classic-style skill\].+$/gm;
  if ([...notices.matchAll(pattern)].length !== 1) {
    throw new Error("Expected exactly one Classic Style attribution paragraph");
  }
  const attribution = `The bundled [classic-style skill](./skills/classic-style/SKILL.md) and its reference are copied unchanged from [${repository}](https://github.com/${repository}/tree/${revision}/${sourcePath}), pinned to commit \`${revision}\`.`;
  return notices.replace(pattern, () => attribution);
}

async function snapshot(directory, relative = "") {
  const entries = [];
  for (const name of (await readdir(path.join(directory, relative))).sort()) {
    const file = path.join(relative, name);
    const stat = await lstat(path.join(directory, file));
    if (stat.isSymbolicLink()) throw new Error(`Unexpected symlink: ${file}`);
    if (stat.isDirectory()) entries.push(...await snapshot(directory, file));
    else if (stat.isFile()) entries.push([file, (await readFile(path.join(directory, file))).toString("base64")]);
    else throw new Error(`Unsupported file type: ${file}`);
  }
  return entries;
}

async function main() {
  const { values } = parseArgs({
    options: {
      skillpacker: { type: "string" },
      refresh: { type: "boolean" },
      check: { type: "boolean" },
      help: { type: "boolean" }
    }
  });
  if (values.help) {
    console.log("Usage: node maintenance/sync-external-skills.mjs [--skillpacker /path/to/cli.js] [--refresh | --check]");
    console.log("Uses the installed @willtsai/skillpacker package by default. Run npm ci --include=dev --ignore-scripts in maintenance/ first.");
    return;
  }
  if (values.refresh && values.check) throw new Error("--refresh and --check cannot be combined");
  let cli;
  if (values.skillpacker) {
    cli = path.resolve(values.skillpacker);
  } else {
    try {
      cli = fileURLToPath(new URL("./cli.js", import.meta.resolve("@willtsai/skillpacker")));
    } catch (error) {
      if (error.code !== "ERR_MODULE_NOT_FOUND") throw error;
      throw new Error("Skillpacker is not installed. Run npm ci --include=dev --ignore-scripts in maintenance/ first.", { cause: error });
    }
  }
  const manifest = JSON.parse(await readFile(path.join(root, "skillpacker.json"), "utf8"));
  if (manifest.skills.length || Object.keys(manifest.dependencies).join() !== vendoredName) {
    throw new Error("This sync script manages only the classic-style dependency, not authored Cabinet skills");
  }
  const run = (...args) => execFileSync(process.execPath, [cli, ...args, "--cwd", root], { stdio: "inherit" });
  const noticesFile = path.join(root, "THIRD-PARTY-NOTICES.md");
  let notices = await readFile(noticesFile, "utf8");
  if (values.refresh) {
    const dependency = manifest.dependencies[vendoredName];
    notices = updateAttribution(notices, dependency.source, dependency.source.ref, dependency.package?.skills);
    // Skillpacker includes root notices in the lock's content hash.
    await writeFile(noticesFile, notices);
    run("resolve");
  }
  const temporary = await mkdtemp(path.join(tmpdir(), "product-cabinet-bundle-"));
  try {
    const output = path.join(temporary, "bundle");
    run("build", "--target", "portable", "--out", output);
    const exported = await readdir(path.join(output, "skills"));
    if (exported.length !== 1 || exported[0] !== vendoredName) {
      throw new Error("Unexpected exported skills; refusing to modify Cabinet skills");
    }
    const generated = path.join(output, "skills", vendoredName);
    const destination = path.join(root, "skills", vendoredName);
    const provenance = path.join(root, "skillpacker.provenance.json");
    // Keep dependency provenance, not the build machine's local root path.
    const records = JSON.parse(await readFile(path.join(output, "skillpacker.provenance.json"), "utf8"))
      .filter(record => record.package === vendoredName);
    if (records.length !== 1) throw new Error("Expected exactly one classic-style provenance record");
    const dependencyProvenance = Buffer.from(JSON.stringify(records, null, 2) + "\n");
    const record = records[0];
    if (updateAttribution(notices, record.source, record.revision, record.packaging.skills) !== notices) {
      throw new Error("Classic Style attribution differs from the locked revision; run sync with --refresh");
    }
    if (values.check) {
      if (JSON.stringify(await snapshot(generated)) !== JSON.stringify(await snapshot(destination)) ||
          !dependencyProvenance.equals(await readFile(provenance))) {
        throw new Error("Vendored content differs from the frozen Skillpacker build; run sync and review the changes");
      }
      console.log("PASS: vendored classic-style, provenance, and attribution match the locked build.");
      return;
    }
    await mkdir(path.join(root, "skills"), { recursive: true });
    const staging = await mkdtemp(path.join(root, "skills", ".external-"));
    try {
      const next = path.join(staging, vendoredName);
      await cp(generated, next, { recursive: true });
      let exists = false;
      try {
        const stat = await lstat(destination);
        if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Refusing non-directory destination: ${destination}`);
        exists = true;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
      const backup = path.join(staging, "previous");
      if (exists) await rename(destination, backup);
      try {
        await rename(next, destination);
      } catch (error) {
        if (exists) await rename(backup, destination);
        throw error;
      }
      await writeFile(provenance, dependencyProvenance);
    } finally {
      await rm(staging, { recursive: true, force: true });
    }
    console.log("Synced classic-style from the Skillpacker lockfile.");
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(`sync-external-skills: ${error.message}`);
  process.exitCode = 1;
});
