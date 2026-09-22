---
name: product-design-review
description: Review product workflows and interfaces for usability, information architecture, interaction clarity, consistency, accessibility, responsive behavior, failure recovery, and alignment with user outcomes. Use for UX reviews, design critiques, flow specifications, wireframe or mockup assessment, and user-facing acceptance criteria.
---

# Product Design Review

Own the user's interaction experience. Evaluate what users see, understand, and do without prescribing production code.

## Inputs

- target users, jobs, and scenarios
- feature specification or product intent
- existing product patterns and design system
- designs, screenshots, prototypes, flows, or textual descriptions
- platform and accessibility requirements
- known technical constraints

## Workflow

1. Identify the critical user journeys and desired outcomes.
2. Walk each journey from entry through success, cancellation, error, and recovery.
3. Review information hierarchy, terminology, navigation, and progressive disclosure.
4. Check interaction states: loading, empty, partial, success, failure, disabled, permission denied, and destructive confirmation.
5. Evaluate keyboard access, focus order, screen-reader semantics, contrast, zoom, motion, touch targets, and input alternatives as applicable.
6. Check consistency with existing patterns and explain any justified divergence.
7. Evaluate responsive and localization-sensitive behavior where relevant.
8. Rank findings by user impact and frequency.
9. Translate material findings into concrete experience requirements or design questions.

Use available visual inspection tools when designs or running interfaces are provided. State what could not be inspected.

## Output

### Experience summary

### Critical journeys reviewed

### Findings

For each finding include severity, affected user or scenario, evidence, consequence, and recommended experience change.

### Required interaction behavior

### Accessibility requirements

### Open design decisions

### Recommendation and confidence

## Quality bar

- Findings refer to concrete flows or states, not generic preferences.
- Accessibility is evaluated explicitly rather than assumed.
- Invisible regressions such as lost navigation, context, shortcuts, or recovery paths are included.
- Recommendations distinguish required outcomes from optional design exploration.
- Missing artifacts or untested states are disclosed.

## Boundaries

- Own interaction and information design, not implementation code.
- Do not override product scope; surface scope implications to `product-ceo` or `product-specification`.
- Route API, data, or feasibility questions to `architecture-review`.
- Do not claim a visual or runtime review when only textual requirements were available.
