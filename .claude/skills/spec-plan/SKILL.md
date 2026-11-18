---
name: spec-plan
description: Produce plan.md and tasks.md for an approved spec using the theme-architect agent (reuse existing Horizon sections first, new sections only when justified). Use after /spec-new is approved.
argument-hint: <NNN or spec folder>
---

# Plan a spec

1. Find `.claude/specs/$ARGUMENTS*/spec.md`. Refuse to continue unless `Status: Approved` and no `[NEEDS CLARIFICATION]` remains.
2. Copy `.claude/specs/_templates/plan.md` and `.claude/specs/_templates/tasks.md` into the folder.
3. Delegate to the **theme-architect** agent with the spec path. It fills `plan.md` (each requirement mapped onto the reuse ladder: configure → extend → compose block → new section) and `tasks.md`.
4. Review the plan yourself:
   - Is every acceptance criterion covered by at least one task?
   - Is every new section justified against the existing ones?
   - Does it keep backwards compatibility?
5. Show the user the decision table from `plan.md` (requirement → existing/extended/new → files) and ask them to approve it. Set `Status: Approved` in `plan.md` once they do.

Never open a browser.

At the end, update `.claude/progress.md` (the spec status table, current phase and log).
