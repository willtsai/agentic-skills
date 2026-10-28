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

Maintainers need Node.js 20.19+, npm, and Git. Use Node.js 24 for new environments,
matching CI. The published
[`@willtsai/skillpacker`](https://www.npmjs.com/package/@willtsai/skillpacker)
package contains the compiled CLI; no sibling checkout or TypeScript build is needed.

Starting at the `agentic-skills` repository root:

```bash
cd product-cabinet/maintenance
npm ci --include=dev --ignore-scripts
npm run skills:version
```

Run the remaining commands from `product-cabinet/maintenance`.
[package.json](./maintenance/package.json) pins Skillpacker to `0.1.4`;
[package-lock.json](./maintenance/package-lock.json) locks the CLI and its npm
dependencies. Keep this npm lockfile and [skillpacker.lock.json](./skillpacker.lock.json):
the former pins the build tooling, while the latter pins the bundled skills.
Do not substitute a global installation or an unpinned `npx` command in CI.

### Rebuild or check

Rebuild from the existing lockfile:

```bash
npm run build
```

Check that checked-in files match a frozen build without changing them:

```bash
npm run build:check
```

Both commands perform a frozen portable build in a temporary directory, then sync
or compare only the bundled dependency and its provenance. They do not regenerate
the whole plugin or refresh the skill lockfile. Builds need network access to the
locked Git source.

### Update upstream

Choose a reviewed commit and change `source.ref` in [the manifest](./skillpacker.json).
For a same-repository PR targeting `main`, the
[dependency sync workflow](../.github/workflows/product-cabinet-sync.yml) regenerates
the distribution and commits the results to that PR branch automatically.

To regenerate locally instead (including for fork PRs), run:

```bash
npm run build:refresh
```

Refresh updates the commit link in [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md)
before resolving the skill lockfile, since Skillpacker hashes root notices.
It then rebuilds the dependency and provenance. Review the instructions, resources,
license, and attribution before merging; copyright and license prose still require
human review. For local updates, commit the generated files with the manifest.

The current sync tooling manages only `classic-style`, using a full commit SHA,
one consumer-declared skill path, and a GitHub HTTPS source. Adding other dependencies
or source formats requires extending the sync tooling and its tests first.

### Update Skillpacker

Choose a reviewed release from [Skillpacker](https://github.com/willtsai/skillpacker)
and install its exact version (replace `X.Y.Z`):

```bash
npm install --save-dev --save-exact --ignore-scripts @willtsai/skillpacker@X.Y.Z
npm run skills:version
npm run build:check
npm test
```

Commit the npm manifest and lockfile, and update the documented version above. A CLI upgrade
does not intentionally update the skill source. If frozen output changes, review
the difference before running `npm run build` and committing regenerated files.

To test an unpublished CLI, the optional development override remains available:

```bash
npm run build:check -- --skillpacker /path/to/skillpacker/dist/src/cli.js
```

The full test suite also accepts `SKILLPACKER_CLI` as a development override.

## Validation

Run all distribution tests, including frozen bundling, drift detection, and repair
in a temporary checkout (requires the installed CLI and network access):

```bash
npm test
```

For offline checks without installing Skillpacker:

```bash
npm run test:offline
```

The offline command runs only the distribution suite. `npm test` also runs the
networked frozen-sync suite and fails if tooling is missing. Installer tests exercise Bash
and PowerShell when available, and skip a shell that is not installed locally.
The tests check packaging and instruction wiring, not whether a model follows
the writing procedure in a live host session.

## Continuous integration

The [Product Cabinet workflow](../.github/workflows/product-cabinet.yml) runs for
pull requests and pushes to `main` that change the plugin, marketplace metadata,
or workflow. It can also be started manually with `workflow_dispatch`.

On Ubuntu with Node.js 24, it installs the locked npm tooling, checks that the
vendored files and provenance match a frozen build, and runs all distribution
tests. It requires both Bash and PowerShell so neither installer test is skipped.
It has read-only repository permissions and never refreshes dependencies, commits
generated files, or publishes a release. Fix drift locally with `npm run build`,
review it, and commit the generated changes.

### Automatic updates on manifest-change PRs

The separate [dependency sync workflow](../.github/workflows/product-cabinet-sync.yml)
runs when a PR targeting `main` is opened, updated, or reopened and its diff includes
[skillpacker.json](./skillpacker.json). It does not run on direct pushes to `main`,
on a schedule, or merely because an upstream repository changes.

For PR branches in this repository, it:

1. Checks out the current PR branch and installs the pinned build tooling.
2. Runs `npm run build:refresh` using the source revisions declared in the manifest.
   It does not select newer upstream commits.
3. Checks the refreshed build and runs the full test suite.
4. Commits only the skill lockfile, provenance, vendored `classic-style` directory,
   and third-party attribution to the same PR branch.
5. Explicitly dispatches the read-only Product Cabinet validation workflow on that
   branch, so the bot commit receives checks without relying on bot-generated events.

No new PR is opened, and nothing is pushed to `main` or merged automatically.
If the generated files are already current, no commit is created, but validation
is still dispatched. The publisher rejects unrelated file changes, closed or forked
PRs, and a branch that has moved during the build. Pushes never force-update a branch.
Rerun the sync workflow if a concurrent edit or a dispatch failure interrupts it.

The sync job is for trusted same-repository contributors. Fork PRs and events from
`github-actions[bot]` skip it; fork contributors must regenerate locally. It uses `GITHUB_TOKEN`
with `contents: write`, `pull-requests: read`, and `actions: write` for committing
and dispatching checks; no PAT is required. Checkout credentials are not persisted,
and `GH_TOKEN` is set only for the publishing step.

Merge the workflow setup into `main` before relying on this automation, since
GitHub requires the dispatched validation workflow to exist on the default branch.
The original frozen-build check may fail on a manifest-only commit while sync is
running; review the regenerated commit and its validation results before merging.

## Release

Review the imported instructions and license, lockfile, provenance, and bundle
diff before release. Bump the Product Cabinet version in both plugin manifests and the Copilot
marketplace entry. The external-dependency manifest has its own version; it is not
the marketplace plugin version. Commit the generated files with the declarations.

CI installs npm tooling with lifecycle scripts disabled. Skillpacker copies
downloaded skill scripts without executing them during bundling.

The marketplace installs the whole plugin directory, including maintenance files.
Separating these files improves navigation; it does not introduce a separate release
artifact or change skill discovery.
