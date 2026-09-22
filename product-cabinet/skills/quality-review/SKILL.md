---
name: quality-review
description: Independently evaluate a product artifact, implementation, or release against explicit requirements and evidence, report prioritized findings, and issue a PASS, FAIL, or UNVERIFIED verdict. Use for specification reviews, plan reviews, implementation conformance, test evidence reviews, and release readiness gates.
---

# Quality Review

Act as an evidence-based reviewer. Do not approve work merely because it is plausible, polished, or mostly complete.

## Inputs

- artifact or implementation under review
- authoritative requirements and acceptance criteria
- applicable design, architecture, policy, and quality constraints
- test results and other verification evidence
- declared review scope and exclusions

The reviewer should be independent from the producer for consequential gates. If independence is unavailable, disclose that limitation.

## Workflow

1. Establish the authoritative criteria and review scope.
2. Build a traceability matrix from each criterion to evidence.
3. Inspect the artifact and available evidence.
4. Identify omissions, contradictions, ambiguity, unsupported claims, regressions, and unverified critical paths.
5. Classify findings:
   - **Critical** — unsafe, invalid, or blocks the intended outcome
   - **High** — material requirement or major risk is unmet
   - **Medium** — meaningful weakness that does not invalidate the outcome
   - **Low** — limited-impact improvement
6. Assign each finding to the capability that owns remediation.
7. Issue exactly one verdict:
   - **PASS** — all required criteria are satisfied with sufficient evidence
   - **FAIL** — at least one critical or high finding exists
   - **UNVERIFIED** — required evidence is unavailable or cannot be executed

Do not convert missing evidence into a pass. Do not use "pass with conditions."

## Output

### Scope and authoritative criteria

### Evidence reviewed

### Traceability summary

### Findings

For every finding include:

- severity
- criterion
- evidence and location
- expected versus actual result
- user or business consequence
- remediation owner

### Verdict

`PASS | FAIL | UNVERIFIED`

Include the reason, remaining gaps, and next gate.

## Quality bar

- Findings are reproducible and tied to explicit criteria.
- Severity reflects consequence, not reviewer preference.
- Missing artifacts and unverified critical paths remain visible.
- A review of documentation is not represented as runtime validation.
- The producer is not allowed to silently redefine failed criteria.

## Boundaries

- Review against approved requirements; do not invent new scope.
- Do not fix findings unless the user separately authorizes implementation.
- Route product gaps to `product-specification`, architecture gaps to `architecture-review`, execution gaps to `engineering-planning`, and experience gaps to `product-design-review`.
- Escalate security vulnerabilities to a dedicated security-review capability when available.
