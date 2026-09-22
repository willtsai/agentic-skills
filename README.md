# agentic-skills

A curated collection of custom agentic skills, reusable instructions, and workflows for AI coding agents.

## Skill packs

| Skill pack | Description | Installation |
|---|---|---|
| [Product Cabinet](./product-cabinet/README.md) | An accountable product-executive orchestrator with on-demand cross-functional capabilities and independent governance | [Copilot, Claude Code, or manual](./product-cabinet/README.md#installation) |

## Marketplace installation

### GitHub Copilot

Register this repository and install a skill pack with Copilot CLI:

```bash
copilot plugin marketplace add willtsai/agentic-skills
copilot plugin install product-cabinet@willtsai-agentic-skills
```

Installed plugins also appear in VS Code under the Extensions search `@agentPlugins` and the **Chat: Plugins** command.

### Claude Code

Register this repository as a Claude Code plugin marketplace and install a skill pack:

```text
/plugin marketplace add willtsai/agentic-skills
/plugin install product-cabinet@willtsai-agentic-skills
```

If Claude Code asks you to reload plugins, run:

```text
/reload-plugins
```

## Manual installation

Each pack may provide scripts for installing its skills without a marketplace. See the pack's installation guide for supported operating systems, target directories, and update behavior.

See each pack's README for detailed installation, skills, workflows, and examples.
