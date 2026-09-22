---
name: engineering-planning
description: Convert approved product requirements and architecture into a sequenced, dependency-aware, testable delivery plan with vertical work items, ownership, risks, estimates or sizing assumptions, and release gates. Use when planning implementation, decomposing a feature, sequencing delivery, or assessing execution readiness.
---

# Engineering Planning

Create the execution blueprint from approved product and architecture inputs. Do not invent missing requirements or architecture.

## Required inputs

- approved or explicitly provisional feature specification
- architecture assessment or an explicit statement that no architecture change is needed
- repository and delivery constraints
- team, environment, release, and dependency context
- expected validation evidence

If a material input is missing, identify it as a blocker or assumption before planning. Do not hide ambiguity inside implementation tasks.

## Workflow

1. Build a requirement traceability list from scenarios and acceptance criteria.
2. Identify affected components, contracts, data, environments, and external dependencies from architecture evidence.
3. Define vertical delivery slices that produce observable value or verifiable behavior.
4. Sequence slices by prerequisite, risk reduction, integration value, and reversibility.
5. Give each task one primary owner, bounded scope, required inputs, expected outputs, and acceptance checks.
6. Separate parallelizable work from true dependencies.
7. Plan tests and evidence alongside implementation, not as a final cleanup phase.
8. Include migration, rollout, observability, documentation, enablement, and rollback work when relevant.
9. Record estimation assumptions and confidence; do not manufacture dates or precision.
10. Define entry and exit criteria for each release gate.

## Output

### Planning basis

List approved inputs, unresolved assumptions, and planning constraints.

### Requirement traceability

Map every acceptance criterion to one or more work items and validation steps.

### Delivery slices

For each slice include:

- user or system outcome
- scope and non-scope
- dependencies
- implementation tasks
- validation tasks and required evidence
- owner capability
- risks
- completion criteria

### Dependency order and parallel work

### Test and validation strategy

### Rollout, migration, observability, and rollback

### Estimates or sizing assumptions

### Risks, blockers, and decisions needed

## Quality bar

- Every requirement maps to implementation and validation work.
- Tasks are vertically coherent rather than split only by technical layer.
- Dependencies are explicit and acyclic or include a plan to break the cycle.
- Critical-path assumptions and estimates include confidence.
- Documentation, operations, and adoption work are not omitted when required for the outcome.
- The plan can be executed without rediscovering major product or architecture decisions.

## Boundaries

- Own delivery decomposition and sequencing, not product scope or architecture.
- Return product ambiguity to `product-specification`.
- Return design and contract ambiguity to `architecture-review`.
- Do not promise dates, staffing, or scope changes without accountable approval.
- Use `quality-review` as an independent plan gate for consequential work.
