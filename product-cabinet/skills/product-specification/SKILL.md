---
name: product-specification
description: Create or review a user-centered feature specification with goals, non-goals, personas, challenges, scenarios, dependencies, assumptions, desired experience, investments, acceptance criteria, success measures, and rollout learning. Use when defining a feature, writing a feature spec or PRD, clarifying scope, or assessing specification completeness.
---

# Product Specification

Define WHAT outcome and behavior the product must provide. Do not prescribe implementation unless a technical constraint is itself a product requirement.

## Inputs

- product opportunity or requested change
- customer and market evidence
- current product behavior and relevant metrics
- constraints and stakeholder decisions
- technical concerns supplied by `architecture-review`
- target decision and audience for the specification

## Workflow

1. Read `references/feature-spec-template.md`.
2. Confirm the primary user, problem, desired outcome, and decision the specification enables.
3. Distinguish verified evidence, inferences, and assumptions.
4. Define top-level goals and explicit non-goals.
5. Describe 3-7 end-to-end scenarios, including meaningful failure or recovery behavior.
6. Record dependencies, risks, and questions without inventing resolutions.
7. Express the detailed user problem and desired experience in first person.
8. Decompose the experience into coherent investments without prescribing class, module, or infrastructure design.
9. Add observable acceptance criteria mapped to scenarios or investments.
10. Define outcome and guardrail measures with baselines and targets when known.
11. Define rollout, feedback, stop, and revisit conditions.
12. Leave unknown content as an explicit TODO with an owner or validation plan. Do not fill gaps with plausible fiction.

When creating a feature specification, use the template's headings and order unless the user requests another format. When reviewing a specification, report gaps by heading and severity rather than silently rewriting product decisions.

## Output requirements

- concise topic summary
- top-level goals and non-goals
- user personas, challenges, and positive outcome
- key scenarios
- dependencies and risks
- assumptions and validation questions
- current state
- first-person user problem and desired outcome
- detailed user experience
- key investments
- testable acceptance criteria
- success and guardrail measures
- rollout and learning plan
- open decisions with owners

## Quality bar

- Every requirement supports a stated user or business outcome.
- Acceptance criteria are observable and testable.
- Scope boundaries are explicit.
- Success measures assess outcomes, not only shipping activity.
- Risks and assumptions include a validation or mitigation path when known.
- Technical feasibility input is attributed to `architecture-review`.
- The document does not disguise unresolved decisions as requirements.

## Boundaries

- Own product scope and observable behavior, not architecture or implementation.
- Do not fabricate customer evidence, dates, estimates, or stakeholder decisions.
- Invoke `customer-discovery` when the problem or demand lacks evidence.
- Invoke `product-design-review` when interaction behavior needs definition.
- Invoke `architecture-review` for feasibility, data, contract, security-boundary, or dependency questions.
- Use `quality-review` for an independent completeness gate on consequential specifications.
