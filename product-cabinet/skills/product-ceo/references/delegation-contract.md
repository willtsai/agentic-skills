# Delegation contract

Every specialist assignment must be bounded by a delegation contract. The Product CEO may present it as YAML, JSON, a table, or equivalent structured text.

```yaml
assignment:
  capability: <skill or specialist>
  objective: <one outcome owned by this assignment>
  decision_supported: <decision or artifact this work informs>

context:
  known_facts: []
  assumptions: []
  relevant_artifacts: []

questions:
  - <specific question to answer>

constraints:
  in_scope: []
  out_of_scope: []
  tool_permissions: []
  time_or_iteration_limit: <limit or not specified>

evidence:
  required_sources: []
  distinguish_fact_inference_assumption: true

output:
  format: <expected structure>
  acceptance_checks: []

escalation:
  - <condition requiring Product CEO or human input>
```

## Contract rules

- Give one assignment one primary objective.
- Include only context relevant to the assignment.
- Do not expose another specialist's conclusion when independent judgment is required.
- Require evidence proportional to the consequence of the decision.
- State what the specialist must not decide.
- Do not treat a time or tool limitation as evidence that no issue exists.
- Require specialists to return unresolved questions and confidence, not false certainty.

## Specialist response contract

Every specialist response should contain:

1. **Executive finding** — the answer in direct terms.
2. **Evidence** — verified facts and their sources.
3. **Analysis** — reasoning derived from the evidence.
4. **Risks and tradeoffs** — including severity or impact where useful.
5. **Recommendation** — action and rationale.
6. **Open questions** — evidence still needed.
7. **Confidence** — high, medium, or low with a reason.
