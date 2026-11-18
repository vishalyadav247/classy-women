# Specs

Every theme customisation goes through these phases. Each one ends with the user's approval before the next starts.

| Phase | Skill | Agent | Output |
|---|---|---|---|
| 1. Specify | `/spec-new <scope>` | design-analyst | `NNN-slug/spec.md`: what and why, acceptance criteria |
| 2. Plan + Tasks | `/spec-plan <NNN>` | theme-architect | `plan.md` (reuse decisions, files) and `tasks.md` |
| 3. Implement | `/spec-implement <NNN>` | theme-builder | theme code; tasks ticked |
| 4. Review | (part of 3) | theme-reviewer | acceptance criteria verified, theme check clean |

- `design-map.md`: every section in the mockups mapped to existing Horizon sections, with build status. Start here.
- `_templates/`: templates for spec, plan and tasks.

Status values are `Draft`, `Approved` and `Done`.
