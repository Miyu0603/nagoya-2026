---
paths:
  - "**/*.tsx"
  - "**/*.css"
---

# UI / UX & Tailwind Rules

## UI / UX

**UX-01 · SHOULD** — Interfaces are understandable without explanation. If users need instructions, the UI likely needs work.

**UX-02 · MUST** — Every feature supports four states: Loading (skeletons/indicators), Empty (no data), Error (actionable recovery), Success (confirmation).

**UX-03 · MUST** — Forms validate, explain errors, and prevent accidental submission.

**UX-04 · SHOULD** — Mobile first. Design for 375px before desktop.

**UX-05 · SHOULD** — Consistency beats creativity. Reuse patterns, spacing, components.

## Tailwind

**TW-01 · SHOULD** — Prefer reusable components. Avoid 100-line class strings.

**TW-02 · SHOULD** — Extract patterns repeated 3+ times.

**TW-03 · SHOULD** — Use design tokens. Avoid arbitrary values unless necessary (`w-44`, not `w-[173px]`).
