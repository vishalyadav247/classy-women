---
name: spec-implement
description: Implement an approved spec's tasks.md with the theme-builder agent, then verify with the theme-reviewer agent. Use after /spec-plan is approved.
argument-hint: <NNN or spec folder>
---

# Implement a spec

1. Find `.claude/specs/$ARGUMENTS*/`. Refuse to continue unless both `spec.md` and `plan.md` say `Status: Approved`.
2. Work through `tasks.md` in order. Hand each task, or each group of related tasks, to the **theme-builder** agent with the spec folder path and the task ids. You can run `[P]` tasks in parallel only when their files don't overlap. Otherwise run them one after another.
3. If a builder reports that the plan is wrong, update `plan.md`/`tasks.md` (and tell the user if the change is material) before continuing.
4. When all tasks are ticked, run the **theme-reviewer** agent. Fix anything that is "not met" or that theme check reports, using theme-builder again, then re-review.
5. Set `Status: Done` in `spec.md`, and update `.claude/specs/design-map.md`.
6. Report to the user: what changed (files), the acceptance criteria met, and a "needs visual check" list they can confirm themselves in the theme editor or with `shopify theme dev`.

**Never open a browser**, never run `shopify theme open`, and never pass `--open`. Visual checking is the user's job. Only commit if the user asks.

At the end, update `.claude/progress.md` (the spec status table, current phase and log).
