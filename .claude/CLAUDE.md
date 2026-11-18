# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

- **Theme at the repo root** (`assets/`, `blocks/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`): a Shopify Online Store 2.0 theme based on Shopify's **Horizon** theme (v4.5.0, see `config/settings_schema.json`). It must stay at the root, because Shopify's GitHub integration only accepts branches whose top level is a theme. Never move it into a subfolder. Non-theme folders such as `.claude/` are ignored by Shopify.
- `.claude/design/` — full-page desktop PNG mockups (`home.png`, `collection.png`, `product.png`, `shopByVideo.png`). These are the visual target for all customisations. The brand name, logos and press logos in them are placeholder content that merchants enter through settings. Never hard-code them.
- `.claude/specs/` — spec-driven development artifacts (see below). `.claude/specs/design-map.md` maps every mockup section to its Horizon starting point.
- `.claude/agents/`, `.claude/skills/` — the agents and skills that drive the spec workflow.

There is no build step, bundler, package manager, or test suite. Theme files are uploaded to Shopify as-is.

## Hard rules

- **Never open a browser for any work.** Don't use browser, Chrome or computer-use tools. Don't run `shopify theme open`, `shopify theme dev --open`, or `start`/`explorer`/`Start-Process` on a URL. `.claude/settings.json` denies these. Verify through code and `shopify theme check`, and give the user a list of things to check visually themselves.
- **Spec-driven.** Write no theme code without an approved spec and plan. Flow: `/spec-new <scope>` (design-analyst → `spec.md`) → `/spec-plan <NNN>` (theme-architect → `plan.md` + `tasks.md`) → `/spec-implement <NNN>` (theme-builder, then theme-reviewer). Each phase waits for the user's approval. Details are in `.claude/specs/README.md`.
- **Reuse ladder.** Prefer, in this order: configure an existing section/block → extend it (backwards compatible, defaults unchanged) → add a new theme block inside an existing section → build a new section only when nothing fits, and justify it in `plan.md`.
- **Theme vs app.** Build a feature in the theme only when it is easy and works effectively there (no secret keys, no backend, no third-party data). Otherwise leave it for a Shopify app and provide at most an `@app` block slot. Decisions are recorded in `.claude/specs/decisions.md`.
- **Progress tracking.** `.claude/progress.md` is the status board for every spec. Update it whenever a spec changes phase, a task completes, or a decision is made.
- Load the `horizon-conventions` skill before writing theme code.

## Commands

Run from the repo root using the Shopify CLI (installed globally):

```sh
shopify theme dev --store <store>.myshopify.com   # local preview with hot reload
shopify theme check                               # lint Liquid/JSON (Theme Check)
shopify theme push --unpublished                  # upload as a new unpublished theme
shopify theme pull                                # pull editor changes (templates/*.json, config/settings_data.json)
```

JS type-checking: `assets/jsconfig.json` enables `checkJs` with strict options, so the editor/TS server type-checks the plain JS via JSDoc annotations. Type declarations live in `assets/global.d.ts` and `assets/*.d.ts`.

## Architecture

**Sections, blocks, and theme blocks.** Horizon uses theme blocks heavily. Most sections (e.g. `sections/section.liquid`) accept `"@theme"` blocks and render them with `{% content_for 'blocks' %}`, passing the output to a shared snippet (`snippets/section.liquid`) for layout/background. Blocks in `blocks/` prefixed with `_` (e.g. `_product-card.liquid`) are private — only usable where a parent schema names them explicitly; un-prefixed blocks are available anywhere `@theme` is allowed. New UI is usually a new block (or a block nested in a generic section), not a new section.

**Templates are JSON and editor-owned.** `templates/*.json`, `sections/*-group.json`, and `config/settings_data.json` are rewritten by the Shopify theme editor. Edits there can be overwritten by a later `theme pull`/editor save — coordinate rather than hand-editing them heavily.

**Translations.** Schema labels use `t:` keys (e.g. `"t:names.section"`) resolved from `locales/*.schema.json`; storefront strings use `locales/*.json` with `en.default.json` / `en.default.schema.json` as the source. Add new keys to the English default files at minimum.

**CSS.** Global styles are in `assets/base.css`. Component styles are mostly colocated in Liquid via `{% stylesheet %}` in sections/blocks, or in `*-styles.liquid` snippets that output CSS custom properties from settings. Theme-wide CSS variables come from `snippets/theme-styles-variables.liquid` and `snippets/color-palette.liquid` (rendered in `layout/theme.liquid`).

**JavaScript.** Native ES modules, no build. `snippets/scripts.liquid` defines an import map aliasing `@theme/<name>` → `assets/<name>.js`; a new shared module must be added there to be importable. Interactive UI is built as custom elements extending `Component` from `assets/component.js`, which provides:
- `ref="name"` attributes → `this.refs.name` (arrays via `ref="items[]"`), with `requiredRefs` validation.
- Declarative events: `on:click="/methodName"` in Liquid calls `methodName` on the closest component (see `snippets/add-to-cart-button.liquid`).
- Declarative shadow DOM hydration.

Cross-component communication uses custom events from `assets/events.js` (e.g. cart updates). Partial page updates use the Section Rendering API through `assets/section-renderer.js` and DOM morphing in `assets/morph.js`, rather than full re-renders.

**Snippet docs.** Snippets and blocks start with `{% doc %}` blocks documenting their `@param`s — keep these in sync when changing a snippet's inputs.
