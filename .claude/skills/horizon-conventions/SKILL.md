---
name: horizon-conventions
description: Reference for writing code in this Shopify Horizon theme - section/block schema patterns, theme blocks, locales, CSS, Component-based JS, section rendering. Load before creating or modifying any section, block, snippet, or asset in the theme.
user-invocable: false
---

# Horizon theme conventions

Look at a close existing example before writing anything, and copy its structure.

| Building… | Copy patterns from |
|---|---|
| Generic content section | `sections/section.liquid` + `snippets/section.liquid` |
| Product grid or carousel | `sections/product-list.liquid`, `blocks/_product-card.liquid`, `snippets/product-card.liquid` |
| Carousel / slider UI | `sections/carousel.liquid`, `sections/slideshow.liquid`, `assets/slideshow.js` |
| Collection tiles | `sections/collection-list.liquid`, `blocks/_collection-card.liquid` |
| Image or video banner | `sections/hero.liquid`, `snippets/background-media.liquid`, `blocks/video.liquid` |
| PDP blocks | `sections/product-information.liquid`, `blocks/buy-buttons.liquid`, `blocks/disclosures.liquid` |
| Collection page | `sections/main-collection.liquid`, `snippets/editorial-product-grid.liquid`, `blocks/filters.liquid` |
| Interactive component | `assets/component.js` (base), `assets/accordion-custom.js` (small example) |

## Liquid and schema
- Sections that hold blocks use `{% content_for 'blocks' %}`. To render a fixed child block, use `{% content_for 'block', type: '…', id: '…' %}`.
- `blocks/_name.liquid` is private: the parent schema must list it explicitly. `blocks/name.liquid` is public and works anywhere that allows `@theme`.
- Every snippet or block starts with `{% doc %}` listing its `@param`s.
- Schema labels are `t:` keys. Add them to `locales/en.default.schema.json` under the matching group (`names`, `settings`, `options`, `content`, `info`). Storefront text uses `{{ 'key' | t }}` with keys in `locales/en.default.json`.
- Reuse the shared setting groups that you see in other schemas: colour scheme, padding (`padding-block-start`/`end`), gap, width, alignment, and typography presets (`type_preset`).
- Give every section a `presets` entry so merchants can add it in the editor.

## CSS
- Put component CSS in `{% stylesheet %}` inside the section or block. Use CSS custom properties from `theme-styles-variables` and the colour scheme (`var(--color-foreground)` etc.), not literal colours.
- Pass settings to CSS as inline `style="--var: …"` variables, following the `*-styles.liquid` snippets.

## JavaScript
- A new module goes in `assets/<name>.js` as an ES module. Add it to the import map in `snippets/scripts.liquid` if other modules import it, and load it with `<script type="module" src="{{ '<name>.js' | asset_url }}">` from the section that needs it.
- Build components as `class X extends Component` and register them with `customElements.define` (guard with `if (!customElements.get(...))`). Use `ref="…"` / `this.refs` and `on:click="/method"`. Don't use querySelector sprawl or inline handlers.
- Type it with JSDoc. `assets/jsconfig.json` is strict (`noImplicitAny`, `strictNullChecks`).
- Use the events in `assets/events.js` (for example cart-update events) for cross-component communication. Use `section-renderer.js` + `morph.js` for partial re-renders.

## Templates
- `templates/*.json`, `sections/*-group.json` and `config/settings_data.json` are editor-owned. Keep edits minimal, and keep the auto-generated header comment.

## Verification (no browser)
- Run `shopify theme check` from the repo root.
- Never run `shopify theme open`, `shopify theme dev --open`, or anything else that launches a browser. The user does the visual checks.
