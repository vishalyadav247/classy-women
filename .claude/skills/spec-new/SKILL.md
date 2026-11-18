---
name: spec-new
description: Start a new spec-driven theme customisation. Creates .claude/specs/<NNN-slug>/ and has the design-analyst write spec.md from a mockup in .claude/design/. Use when the user asks to build or change a page or section of the theme.
argument-hint: <page-or-section> e.g. "home hero slideshow" or "product page"
---

# Start a new spec

Phase 1 of the workflow in `.claude/specs/README.md`: **Specify → Plan → Tasks → Implement → Review.**

1. Read `.claude/specs/design-map.md` and find the rows that cover `$ARGUMENTS`. If the request spans more than one page, or more than about 4 sections, propose splitting it into several specs.
2. Pick the next number: look at the existing `.claude/specs/NNN-*` folders and use the highest number + 1, zero-padded to 3 digits. Create `.claude/specs/<NNN-slug>/` with a kebab-case slug.
3. Copy `.claude/specs/_templates/spec.md` into it.
4. Delegate to the **design-analyst** agent. Give it the mockup path(s), the design-map rows in scope, and the spec path. Tell it which sections are in scope and which are out.
5. When it returns, read the spec yourself. Show the user a short summary plus every `[NEEDS CLARIFICATION]` and `[ASSUMPTION]` item, and ask them to answer the clarifications and approve the spec.
6. Record the answers in the spec, set `Status: Approved`, and update the design-map status column. **Do not start planning or coding until the user approves.**

Never open a browser at any step.

At the end, update `.claude/progress.md` (the spec status table, current phase and log).
