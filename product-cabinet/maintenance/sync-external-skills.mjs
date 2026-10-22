#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = fileURLToPath(new URL("../", import.meta.url));
const vendoredName = "classic-style";

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
    console.log("Usage: node maintenance/sync-external-skills.mjs --skillpacker /path/to/skillpacker/dist/src/cli.js [--refresh | --check]");
    return;
  }
  if (!values.skillpacker) throw new Error("--skillpacker must name the locally built Skillpacker CLI");
  if (values.refresh && values.check) throw new Error("--refresh and --check cannot be combined");
  const cli = path.resolve(values.skillpacker);
  const manifest = JSON.parse(await readFile(path.join(root, "skillpacker.json"), "utf8"));
  if (manifest.skills.length || Object.keys(manifest.dependencies).join() !== vendoredName) {
    throw new Error("This sync script manages only the classic-style dependency, not authored Cabinet skills");
  }
  const run = (...args) => execFileSync(process.execPath, [cli, ...args, "--cwd", root], { stdio: "inherit" });
  if (values.refresh) run("resolve");
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
    if (values.check) {
      if (JSON.stringify(await snapshot(generated)) !== JSON.stringify(await snapshot(destination)) ||
          !dependencyProvenance.equals(await readFile(provenance))) {
        throw new Error("Vendored content differs from the frozen Skillpacker build; run sync and review the changes");
      }
      console.log("PASS: vendored classic-style and provenance match the locked build.");
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
