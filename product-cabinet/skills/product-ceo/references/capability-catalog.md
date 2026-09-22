# Capability catalog

Use this catalog to select the minimum sufficient team for a request. Do not invoke every capability by default.

| Capability | Invoke when | Typical output | Prefer an isolated agent when |
|---|---|---|---|
| `customer-discovery` | The user, problem, demand, alternatives, or evidence is uncertain | Research brief, evidence map, assumptions, learning plan | Research spans many sources or independence from the proposal matters |
| `product-specification` | Product intent must become scoped, testable requirements | Feature specification | The specification is large enough to require a separate context |
| `product-design-review` | A workflow, interface, information architecture, or user interaction changes | Design review and interaction requirements | Visual evidence is extensive or an independent critique is needed |
| `architecture-review` | A proposal changes contracts, data, boundaries, infrastructure, security posture, or technical feasibility | Architecture assessment | Repository-wide analysis or a distinct technical context is required |
| `engineering-planning` | Approved requirements and architecture must become executable work | Delivery plan, dependency graph, validation strategy | Planning spans several components or teams |
| `quality-review` | An artifact or implementation needs an evidence-based gate | Findings and PASS/FAIL/UNVERIFIED verdict | The reviewer must be independent from the producer |
| `go-to-market` | Adoption, positioning, launch, pricing, enablement, or market communication is in scope | GTM plan and readiness checklist | Market research or independent launch readiness is substantial |
| `developer-experience-review` | Developers are users of an API, SDK, CLI, integration, extension, or documentation | Developer journey and friction review | Hands-on testing requires separate tools or context |
| `board-review` | A decision is material, risky, expensive, irreversible, regulated, or cross-portfolio | Independent opinions, decision, conditions, dissent | Always prefer independent board agents for material decisions |

## Common staffing patterns

### Feature specification

Required:

- `product-specification`

Add as needed:

- `customer-discovery` when the problem or demand is uncertain
- `product-design-review` for user-facing interaction changes
- `architecture-review` for feasibility, contract, data, or dependency questions
- `developer-experience-review` for developer-facing experiences
- `quality-review` to gate a mature draft

### Delivery planning

Required:

- `product-specification`
- `architecture-review`
- `engineering-planning`

Add `quality-review` as an independent plan gate.

### Launch planning

Required:

- `go-to-market`

Add:

- `customer-discovery` for audience and message evidence
- `developer-experience-review` for developer products
- `quality-review` for readiness
- `board-review` for material public commitments

### Strategic decision

Usually include:

- `customer-discovery`
- `architecture-review` when technology is material
- `go-to-market`
- `board-review`

## Selection rules

1. Start with the requested outcome, not role titles.
2. Add a capability only when it resolves a material uncertainty, produces a required artifact, or provides necessary independent challenge.
3. Prefer parallel work only when assignments do not depend on each other's outputs.
4. Keep producer and reviewer separate for consequential quality gates.
5. Explain omissions when a normally relevant capability is intentionally not invoked.
