# Product Cabinet

Product Cabinet is a portable skill pack that gives an AI agent the operating model of an accountable product executive. A `product-ceo` orchestrator selects the minimum sufficient set of product, customer, design, engineering, quality, launch, and governance capabilities for each request.

Product Cabinet is packaged for GitHub Copilot and Claude Code and remains a portable collection of skills rather than a standalone agent runtime. The host decides whether specialist work runs in the current context or in isolated agents.

## Requirements

Choose one installation option:

- GitHub Copilot CLI or VS Code with agent-plugin support
- Claude Code with plugin support
- a compatible Agent Skills host that loads skills from a local directory

Product Cabinet works best when the host:

- discovers skills from `SKILL.md` files
- makes sibling skills available in the same session
- lets a skill read referenced Markdown files in the installed pack
- can delegate bounded work to isolated agents or contexts

Delegation is optional. When isolated agents are unavailable, the Product CEO can apply specialist skills sequentially in the current context, but it must disclose that board and reviewer independence was not available.

## Installation

### Option 1: GitHub Copilot marketplace

Register the marketplace and install Product Cabinet:

```bash
copilot plugin marketplace add willtsai/agentic-skills
copilot plugin install product-cabinet@willtsai-agentic-skills
```

To browse the marketplace from an interactive Copilot CLI session:

```text
/plugin marketplace browse willtsai-agentic-skills
```

In VS Code, open the Extensions view and search for `@agentPlugins`, or run **Chat: Plugins** from the Command Palette. Product Cabinet appears there after the marketplace is registered.

Restart the Copilot CLI session or reload the VS Code window if the newly installed skills do not appear immediately.

Verify the installation by asking:

```text
Use the product-ceo skill to list the Product Cabinet capabilities and explain
which ones you would use to define a new developer-facing API feature.
```

Copilot discovers installed skills by their descriptions. Specialist skills can also be requested directly, such as `product-specification` or `quality-review`.

### Option 2: Claude Code marketplace

Register the marketplace in Claude Code:

```text
/plugin marketplace add willtsai/agentic-skills
```

Open `/plugin`, select **Browse and install plugins**, choose the `willtsai-agentic-skills` marketplace, select `product-cabinet`, and confirm the installation scope.

Alternatively, install it directly:

```text
/plugin install product-cabinet@willtsai-agentic-skills
```

If the installation summary asks you to reload:

```text
/reload-plugins
```

Verify the installation by running:

```text
/product-cabinet:product-ceo
```

Then provide a request:

```text
Write a feature specification for organization-level API keys. Select the minimum
sufficient Product Cabinet capabilities, explain the staffing plan, and return one
synthesized recommendation.
```

You can also invoke specialist skills with the same plugin namespace, such as `/product-cabinet:product-specification` or `/product-cabinet:quality-review`.

### Option 3: Manual installation

Clone the repository and run the installer for your platform:

```bash
git clone https://github.com/willtsai/agentic-skills.git
cd agentic-skills/product-cabinet
```

On macOS, Linux, or Git Bash:

```bash
./install.sh
```

On Windows PowerShell:

```powershell
./install.ps1
```

Both scripts:

- install all ten skills by default
- copy each complete skill directory, including its references and templates
- install to `~/.copilot/skills` by default
- refuse to overwrite an existing skill unless explicitly forced
- accept one or more skill names for a partial installation

Install selected skills:

```bash
./install.sh product-ceo product-specification quality-review
```

```powershell
./install.ps1 product-ceo product-specification quality-review
```

Replace existing copies during an update:

```bash
./install.sh --force
```

```powershell
./install.ps1 -Force
```

Override the destination when your host uses another Agent Skills directory:

```bash
COPILOT_SKILLS_DIR="$HOME/custom-skills" ./install.sh
```

```powershell
$env:COPILOT_SKILLS_DIR = "$HOME/custom-skills"
./install.ps1
```

Restart Copilot CLI or reload the agent host after installation.

### Updating or uninstalling

For a marketplace installation, use the host's plugin manager to refresh, update, disable, or uninstall Product Cabinet.

For a manual installation, pull the latest repository changes and rerun the appropriate installer with `--force` or `-Force`. To uninstall manually, remove only the Product Cabinet skill directories that were installed under your configured skills directory.

### Compatibility notes

Marketplace manifests are host-specific distribution adapters. The skills themselves use portable `SKILL.md` files, and every skill keeps its required references and templates inside its own directory so manual installation remains self-contained.

## Initial skills

| Skill | Purpose |
|---|---|
| `product-ceo` | Frame product work, staff it with the right capabilities, synthesize results, and own the final recommendation |
| `customer-discovery` | Develop evidence-based understanding of users, problems, alternatives, and demand |
| `product-specification` | Turn validated product intent into a user-centered feature specification |
| `product-design-review` | Review flows, information architecture, interaction behavior, accessibility, and usability |
| `architecture-review` | Evaluate technical feasibility, system boundaries, contracts, dependencies, and architectural risk |
| `engineering-planning` | Convert approved product and architecture inputs into a sequenced, testable delivery plan |
| `quality-review` | Review specifications, plans, implementations, or releases against explicit quality criteria |
| `go-to-market` | Develop positioning, launch strategy, channels, enablement, readiness, and measurement |
| `developer-experience-review` | Review developer-facing products for usability, consistency, documentation, and adoption friction |
| `board-review` | Independently challenge material proposals and record decisions, conditions, risks, and dissent |

## Operating model

1. Invoke `product-ceo` with a product request.
2. The Product CEO frames the decision or deliverable and evaluates uncertainty, impact, and risk.
3. It selects the minimum sufficient capabilities from the [capability catalog](./skills/product-ceo/references/capability-catalog.md).
4. Each specialist receives a bounded [delegation contract](./skills/product-ceo/references/delegation-contract.md).
5. The Product CEO reconciles evidence and disagreements into one accountable recommendation.
6. Material decisions receive an independent `board-review`.
7. The final response identifies evidence, assumptions, decisions, dissent, and next actions.

The Product CEO should apply a skill directly for bounded procedural work and use an isolated agent when work needs substantial separate context, parallel execution, distinct tools, or independent judgment.

## Usage

### Start with the Product CEO

For cross-functional work, invoke `product-ceo` and describe the outcome, available context, constraints, and desired artifact. You do not need to select the specialists yourself.

```text
Use the product-ceo skill to define a feature for organization-level API keys.

Our target users are platform administrators at enterprise customers. Produce a
feature specification, identify the minimum sufficient Product Cabinet capabilities,
and call out assumptions that require customer validation. Do not make implementation
decisions that belong in architecture review.
```

The Product CEO should:

1. frame the decision and completion criteria
2. assess impact, uncertainty, risk, and reversibility
3. present a minimum-sufficient staffing plan
4. invoke or delegate the selected specialist skills
5. reconcile findings and disagreements
6. request quality or board review when warranted
7. return one accountable artifact or recommendation

### Provide existing artifacts

Point the Product CEO to specifications, research, designs, repositories, plans, or launch material that should be treated as evidence:

```text
Use the product-ceo skill to assess whether this feature is ready for implementation.

Inputs:
- Feature specification: docs/features/api-keys.md
- Design prototype: <design URL>
- Relevant code: src/auth and src/organizations

Use architecture-review, product-design-review, and quality-review as needed.
Return the decision, blocking findings, owners, and next gate.
```

The Product CEO must distinguish supplied evidence from assumptions and should not claim to have inspected an artifact the host could not access.

### Invoke a specialist directly

Use a specialist without the Product CEO when the task is bounded and does not require cross-functional synthesis:

```text
Use product-specification to turn these discovery findings into a feature spec.
Use the Product Cabinet feature specification template and leave unsupported details
as explicit open decisions.
```

```text
Use developer-experience-review to evaluate this CLI quickstart from installation
through first successful deployment. Identify observed friction separately from
issues inferred through static review.
```

```text
Use quality-review to assess this implementation plan against the approved feature
specification and architecture. Return PASS, FAIL, or UNVERIFIED with evidence.
```

### Request a board review

Board review is intended for material decisions, not routine product work:

```text
Use product-ceo to prepare a decision on deprecating v1 of our public API.
After the operating review, invoke board-review with independent customer, strategy,
financial, technology, and trust perspectives. Preserve dissent and identify every
condition requiring human approval.
```

When the host supports isolated agents, each board perspective should be evaluated independently against the same evidence packet. When it does not, the output must be labeled as a structured challenge rather than an independent board review.

### Control orchestration explicitly

You can constrain how the cabinet operates:

```text
Use product-ceo for this request.

Constraints:
- Limit the cabinet to customer-discovery, architecture-review, and product-specification.
- Run discovery and architecture independently.
- Do not invoke board-review.
- Stop and ask before making external calls or modifying repository files.
```

The Product CEO follows explicit user constraints unless they conflict with required safety, policy, or authority boundaries.

## Expected output

A Product CEO response should make the operating process visible without exposing private reasoning:

- decision or completed artifact
- selected capabilities and why they were needed
- evidence examined
- assumptions and missing evidence
- tradeoffs and rejected alternatives
- material specialist disagreements
- board decision and dissent, when applicable
- required human approvals
- next actions, owners, success measures, and revisit conditions

## Recommended first run

Test the pack with a bounded feature specification before using it for a portfolio or launch decision:

```text
Use the product-ceo skill to write a feature specification for saved dashboard views.

Before drafting:
1. State the decision and known assumptions.
2. Select the minimum sufficient Product Cabinet skills.
3. Explain which skills you will apply directly and which need isolated agents.

Use the Product Cabinet feature specification template. Include measurable acceptance
criteria, success measures, rollout learning, and open decisions. Finish with a
quality-review of the specification.
```

## Skill format

Each skill is stored at `skills/<skill-name>/SKILL.md` and contains:

- YAML frontmatter with a stable name and discovery description
- skill-local references and templates when needed
- purpose and invocation criteria
- required inputs and outputs
- an execution workflow
- quality requirements
- role boundaries and escalation rules

The instructions avoid runtime-specific APIs. Hosts can map phrases such as "invoke a skill" and "delegate to an isolated agent" to their own orchestration primitives.

## Templates

- [Feature specification](./skills/product-specification/references/feature-spec-template.md), adapted from the Radius project template
- [Board review](./skills/board-review/references/board-review-template.md)
- [Decision record](./skills/product-ceo/references/decision-record-template.md)

## Principles

- **Accountability over role-play.** The Product CEO owns synthesis and decisions rather than concatenating specialist responses.
- **Capabilities over org charts.** Select expertise required by the work instead of convening every role.
- **Evidence over confidence.** Distinguish verified facts, inferences, and assumptions.
- **WHAT before HOW.** Product intent and user outcomes precede architecture and delivery planning.
- **Independent challenge.** Reviewers must form opinions before seeing the proposed synthesis when practical.
- **Visible uncertainty.** Missing evidence and unresolved disagreements remain explicit.
- **Human authority.** The host's user retains control over consequential, irreversible, regulated, or externally visible actions.
