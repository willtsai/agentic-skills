---
name: product-specification
description: Create or review a concise, user- and product-focused feature specification that strictly follows the supplied template. Describe user stories, journeys, and observable experiences without cabinet deliberations or implementation details. Use when defining a feature, writing a feature spec or PRD, clarifying scope, or assessing specification completeness.
---

# Product Specification

Define WHAT outcome and behavior the product must provide. Do not prescribe implementation unless a technical constraint is itself a product requirement.

## Document contract

When authoring or revising a document, draft its substance, then invoke the bundled `classic-style` skill before final validation. Request **keep my structure; output only**. Preserve the required template, claims, citations, uncertainty, decisions, and code examples; polish prose only. Keep style notes in chat, outside the document. If skill invocation is unavailable, read `../classic-style/SKILL.md` and its reference and apply them directly. If those files are unavailable, report the missing dependency and ask to repair the installation rather than silently skipping it.

The specification is a product artifact, not a report of the cabinet's work. This contract applies both when invoked directly and when delegated by `product-ceo`.

- Use `references/feature-spec-template.md` as the authoritative structure unless the user explicitly supplies or requests another template.
- Preserve its heading names, levels, and order. Replace the topic, author, scenario, and feature placeholders; repeat or remove numbered scenario and feature entries as needed. Do not add other headings, metadata fields, appendices, executive preambles, or closing reports.
- Populate the existing sections with concise prose, bullets, and short user-facing examples. Remove instructional placeholder comments from the completed spec; retain source attribution.
- Do not add standalone acceptance-criteria, success-measures, rollout-plan, or open-decisions sections. Put relevant measurable outcomes in goals or positive user outcome, observable completion behavior in scenarios or detailed user experience, and unresolved product questions in the template's assumptions/questions section.
- Exclude cabinet staffing, assignments, deliberations, votes, dissent, approvals, confidence scores, review verdicts, evidence inventories, technical option comparisons, and decision logs from the document. Do not hide them under existing headings.
- Return a brief summary of material cabinet findings, unresolved blockers, and review limitations in agent chat outside the specification. If the spec is delivered inline, clearly separate that summary from the copyable document. Do not create extra reports unless requested.

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
5. Describe approximately 3-7 distinct user stories or journeys: actor, trigger, goal, actions, and observable outcome. Include meaningful failure or recovery behavior without exhaustively cataloging every test case.
6. Record only dependencies, risks, and questions that affect user value, scope, availability, or experience. Translate technical findings into product implications without copying their evaluations.
7. Express the detailed user problem and desired experience in first person.
8. Decompose the experience into coherent investments without prescribing class, module, or infrastructure design.
9. Make success and completion behavior observable within the existing scenario, outcome, and experience sections; include metrics only when supported and useful.
10. Include rollout constraints only when they change the user's experience or access. Leave execution plans and release gates outside the spec.
11. Leave unknown product content as an explicit TODO or question in the appropriate template section, with a validation approach when known. Do not fill gaps with plausible fiction.
12. Compare the finished document against the template heading by heading. Remove extra sections, repeated content, cabinet reporting, and implementation analysis before delivering.

When reviewing a specification, report gaps by template heading and severity in chat rather than appending the review to the spec or silently rewriting product decisions.

## Experience detail

Cover only the product surfaces relevant to the scenario:

- **GUI:** entry point, user choices, visible state, feedback, and recovery.
- **CLI:** representative commands, inputs/flags, expected output, and actionable errors.
- **Declarative artifacts:** what users author, a minimal illustrative configuration, and the observable effect of applying or updating it.
- **API:** general resource/operation shape, meaningful inputs and outputs, permissions, and user-visible error behavior; not exhaustive schemas or internal service contracts.

Label proposed interface examples as illustrative when names or syntax are unsettled. Do not invent supported commands or contracts. Describe how relevant surfaces express the same capability without forcing every feature to have all four surfaces.

Prefer "An administrator revokes a key and subsequent requests are denied" over descriptions of cache invalidation, database tables, controller wiring, or request-processing algorithms. Technical terms are appropriate for developer-facing experiences; internal design is not.

## Quality bar

- Every requirement supports a stated user or business outcome.
- User journeys and completion behavior are observable and testable within the template.
- Scope boundaries are explicit.
- Success measures assess outcomes, not only shipping activity.
- Risks and assumptions include a validation or mitigation path when known.
- Technical feasibility informs scope and constraints; specialist attribution and technical evaluations stay in chat, not the spec.
- Each section adds distinct product information rather than repeating the same rationale.
- The document follows the template exactly, subject only to its placeholder and repeated-entry rules.
- The document does not disguise unresolved decisions as requirements.

## Boundaries

- Own product scope and observable behavior, not architecture or implementation.
- Do not fabricate customer evidence, dates, estimates, or stakeholder decisions.
- Invoke `customer-discovery` when the problem or demand lacks evidence.
- Invoke `product-design-review` when interaction behavior needs definition.
- Invoke `architecture-review` for feasibility, data, contract, security-boundary, or dependency questions.
- Use `quality-review` for an independent completeness gate on consequential specifications.
