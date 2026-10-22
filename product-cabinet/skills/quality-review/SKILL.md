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

When authoring or revising a document, draft its substance, then invoke the bundled `classic-style` skill before final validation. Request **keep my structure; output only**. Preserve the required template, claims, citations, uncertainty, decisions, and code examples; polish prose only. Keep style notes in chat, outside the document. If skill invocation is unavailable, read `../classic-style/SKILL.md` and its reference and apply them directly. If those files are unavailable, report the missing dependency and ask to repair the installation rather than silently skipping it. This applies to the review report, not permission to rewrite the artifact under review.

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

## Feature specification gate

For a feature specification, read the authoritative template from `product-specification` (or the user's explicitly requested replacement) before reviewing.

- Compare heading names, levels, and order against the template. Allow filled placeholders and repeated numbered scenario/feature entries, but no other extra sections, metadata, preambles, or appendices.
- Check content as well as structure: cabinet deliberations, staffing, votes, confidence scores, decision logs, review verdicts, or technical evaluations must not appear even under valid template headings.
- Require user stories, journeys, and observable behavior for relevant GUI, CLI, declarative, or API surfaces. Do not demand internal architecture, exhaustive schemas, implementation tasks, or separate acceptance-criteria and rollout sections.
- Keep material product dependencies, risks, and unknowns in their existing template sections; do not mistake removing cabinet reporting for permission to hide product blockers.
- Check that the writing pass preserved headings, evidence qualifications, code examples, and product meaning, with no "What changed" section added to the spec. Readable prose alone is not evidence that the pass ran; report any unverified execution.
- Treat violations of the document contract as High findings requiring correction before PASS. If the template cannot be read, report UNVERIFIED rather than assuming conformance.

Keep this review's findings, traceability, and verdict in chat or a separately requested review artifact, never appended to the specification.

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
