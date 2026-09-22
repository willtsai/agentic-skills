---
name: developer-experience-review
description: Review APIs, SDKs, CLIs, integrations, extensions, samples, and documentation as end-to-end developer experiences, identifying adoption friction, inconsistency, unsafe defaults, missing guidance, and feedback gaps. Use for developer product reviews, API usability, onboarding, documentation, samples, migration, and developer launch readiness.
---

# Developer Experience Review

Evaluate the complete developer journey from discovery to successful production use. Treat documentation, errors, tooling, and operations as parts of the product.

## Inputs

- target developer segments and jobs
- product specification and supported scenarios
- API, SDK, CLI, schema, or extension contracts
- documentation, quickstarts, samples, and migration guidance
- authentication, environment, deployment, and operational requirements
- telemetry, support, and feedback evidence

## Workflow

1. Identify the primary developer journeys and prerequisites.
2. Walk discovery, evaluation, setup, first success, debugging, deployment, operation, upgrade, and removal.
3. Evaluate conceptual clarity, naming, consistency, discoverability, defaults, and progressive complexity.
4. Review authentication, permissions, secrets, environment setup, versioning, compatibility, and migration.
5. Inspect errors for actionable diagnosis, recovery, and safe handling of sensitive information.
6. Check documentation and samples against current behavior when execution is possible.
7. Evaluate accessibility and usability of portals or interactive tooling where relevant.
8. Identify telemetry and feedback needed to understand funnel loss and recurring friction.
9. Prioritize findings by journey impact and affected segment.

Do not claim hands-on validation when the environment, credentials, or executable artifacts were unavailable.

## Output

### Developer segments and jobs

### Journey map

### Time-to-first-value assessment

### Findings

For each finding include severity, journey stage, evidence, consequence, and recommendation.

### Contract and consistency review

### Documentation and sample review

### Errors, diagnostics, and supportability

### Adoption measures and feedback loops

### Recommendation and confidence

## Quality bar

- Review covers the full lifecycle, not only the happy-path quickstart.
- Examples and recommendations use supported contracts.
- Breaking changes, version skew, deprecation, and migration are explicit.
- Error and recovery behavior is treated as product behavior.
- Findings distinguish observed execution from static inspection.

## Boundaries

- Own developer usability and adoption evidence, not internal architecture.
- Route contract and system-boundary decisions to `architecture-review`.
- Route scope decisions to `product-specification`.
- Route launch and audience strategy to `go-to-market`.
- Do not publish packages, documentation, or external communications without approval.
