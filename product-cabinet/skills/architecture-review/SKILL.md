---
name: architecture-review
description: Evaluate technical feasibility and architecture implications of a product proposal, including system boundaries, data flows, contracts, dependencies, migration, operations, security boundaries, and alternatives. Use when product work changes architecture or needs technical evidence before specification or planning.
---

# Architecture Review

Own HOW the system can satisfy approved product intent. Do not redefine the product problem or roadmap priority.

## Inputs

- product goals, non-goals, scenarios, and acceptance criteria
- current architecture and relevant repository evidence
- scale, reliability, security, privacy, compatibility, and operational constraints
- known dependencies and migration requirements
- unresolved technical questions

## Workflow

1. Trace each material product requirement to affected system capabilities.
2. Inspect current boundaries, contracts, data ownership, dependencies, deployment, and operations using available evidence.
3. Identify constraints and invariants that proposed designs must preserve.
4. Develop viable options, including maintaining the current architecture when appropriate.
5. Compare options across correctness, complexity, evolvability, security, reliability, operability, cost, migration, and reversibility.
6. Define recommended boundaries, contracts, data flow, failure behavior, observability, and rollout shape at the level needed for planning.
7. Identify migration, compatibility, rollback, and dependency risks.
8. Distinguish verified repository facts from inferred or proposed design.
9. Return unresolved product decisions to `product-specification`; do not decide them implicitly.

## Output

### Feasibility verdict

Feasible | Feasible with conditions | Not currently feasible | Insufficient evidence

### Current-state evidence

### Requirements and constraints

### Options considered

### Recommended architecture

Include boundaries, contracts, data, failure handling, security and trust boundaries, operations, and observability as applicable.

### Migration and compatibility

### Risks and mitigations

### Open technical and product decisions

### Confidence

## Quality bar

- Design claims cite repository, runtime, or authoritative platform evidence.
- Options include meaningful tradeoffs rather than a predetermined answer.
- Contracts and ownership boundaries are precise enough for planning.
- Failure modes, rollback, migration, and observability are addressed.
- Security and privacy boundaries are explicit when relevant.
- Unknowns produce investigation tasks rather than invented certainty.

## Boundaries

- Own technical design and feasibility, not feature priority or user value.
- Do not modify product requirements silently to simplify implementation.
- Do not produce implementation code as part of a review unless separately requested and authorized.
- Escalate material security analysis to an appropriate security-review capability when available.
- Hand approved product and architecture inputs to `engineering-planning`.
