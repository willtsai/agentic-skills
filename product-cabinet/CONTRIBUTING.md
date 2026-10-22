# Contributing to Product Cabinet

User installation and usage are documented in [README.md](./README.md).
Maintainer tooling lives in [maintenance/](./maintenance/). Dependency manifests,
lockfiles, provenance, licenses, and runtime skills remain at the plugin boundary.

## Maintaining the bundled dependency

[skillpacker.json](./skillpacker.json) declares the upstream source, pinned commit,
selected skill directory, and license. It uses consumer-owned packaging metadata,
so the upstream repository needs no Skillpacker manifest or fork.
[skillpacker.lock.json](./skillpacker.lock.json) locks the commit and content hashes.

This manifest bundles **external skills only**; it does not export authored cabinet
skills. The [sync script](./maintenance/sync-external-skills.mjs) copies only the
generated `classic-style` directory into the plugin, leaving authored skills,
templates, and marketplace adapters intact.
The generated files and [provenance](./skillpacker.provenance.json) are checked in
so marketplace and manual installations need neither Node.js nor Skillpacker.
Do not edit the vendored skill or its reference by hand.

### Setup

Maintainers need Node.js 20.19+, Git, and the locally built Skillpacker CLI with
plain-source support. Skillpacker is not yet published; the examples below assume
its checkout is a sibling of this repository.

Starting at the `agentic-skills` repository root, build Skillpacker and enter the
Product Cabinet directory:

```bash
cd ../skillpacker
npm ci
npm run build
cd ../agentic-skills/product-cabinet
```

Run the remaining commands from the Product Cabinet directory.

### Rebuild or check

Rebuild from the existing lockfile:

```bash
node maintenance/sync-external-skills.mjs \
  --skillpacker ../../skillpacker/dist/src/cli.js
```

Check that checked-in files match a frozen build without changing them:

```bash
node maintenance/sync-external-skills.mjs \
  --skillpacker ../../skillpacker/dist/src/cli.js --check
```

### Update upstream

Choose a reviewed commit, change `source.ref` in the manifest, update the attribution
in [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md), and run:

```bash
node maintenance/sync-external-skills.mjs \
  --skillpacker ../../skillpacker/dist/src/cli.js --refresh
```

## Validation

Run the offline distribution tests:

```bash
node --test maintenance/tests/distribution.test.mjs
```

To also test frozen bundling, drift detection, and repair in a separate checkout
(requires network access):

```bash
SKILLPACKER_CLI=../../skillpacker/dist/src/cli.js \
  node --test maintenance/tests/distribution.test.mjs
```

The installer tests exercise Bash and PowerShell when available, and skip a platform
whose shell is not installed. The tests check packaging and instruction wiring,
not whether a model follows the writing procedure in a live host session.

## Release

Review the imported instructions and license, lockfile, provenance, and bundle
diff before release. A refresh also updates the root notice hash after attribution
changes. Bump the Product Cabinet version in both plugin manifests and the Copilot
marketplace entry. The external-dependency manifest has its own version; it is not
the marketplace plugin version. Commit the generated files with the declarations.

These commands can run in CI once the pipeline installs a pinned Skillpacker build.
No pipeline or end-user install executes scripts from the downloaded skill during
bundling.

The marketplace installs the whole plugin directory, including maintenance files.
Separating these files improves navigation; it does not introduce a separate release
artifact or change skill discovery.
