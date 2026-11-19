# Plan 002: Product card (badge, image carousel and position line, photo swatches, title, price / compare-at / % off)

- **Status:** Approved (2026-11-19, auto mode per user; Q1–Q7 take the recommended defaults)
- **Spec:** `./spec.md` (Approved 2026-11-19; the Clarifications log overrides inline text)
- **Scope:** S1–S4 (G4). S5 Wishlist (G5) is **deferred to an app (A1/A2)**. The only S5 work is an `@app` block slot in the card media area. The header heart link (001) and the PDP buy-area slot (006) are owned by other specs.
- **Baseline:** `shopify theme check` reports 0 errors and 7 warnings (`sections/header.liquid` ExcessiveSettingsCount, `snippets/divider.liquid` 5x UnusedDocParam, `snippets/product-media-gallery-content.liquid` LiquidComplexity). Done means no new offences.
- **Context kept intact:** specs 004 and 001 are implemented and uncommitted. Nothing here reverts their changes: `assets/slideshow.js` reduced-motion/focus handling, `sections/product-list.liquid` tabs mode, `templates/index.json`, `snippets/theme-styles-variables.liquid` typography roles, the locale-sync rule.

## Summary

**No new section and no new block.** Every listing in the theme already renders cards through one path: the private static `_product-card` block → `snippets/product-card.liquid`, with children `_product-card-gallery` → `snippets/card-gallery.liquid`, `swatches` → `snippets/variant-swatches.liquid`, `product-title`, and `price` → `snippets/price.liquid`. Swatch clicks already do a partial update through the Section Rendering API: `swatches-variant-picker-component` fetches `sections/section-rendering-product-card.liquid` and `assets/product-card.js` morphs the price, swaps the variant image and rewrites the links. The 002 card is built by **extending these pieces**. Templates then turn the new options on for every card instance, so the card appears on home (004), collection, search, product recommendations, cart and 404 with no per-section markup.

What's new:
1. **`snippets/product-badge.liquid`** (new, reusable by 006). It holds the A3 badge rules and the priority, for both card style and filled (PDP) style.
2. **Theme settings** (`config/settings_schema.json`) for anything that the Section Rendering response must reproduce: the badge threshold and style, the card price options (From / compare-at / % off), the sale and compare-at colours, the swatch limit and the colour option names. These can't be block settings, because `section-rendering-product-card` has no access to block settings, and a mismatch would be morphed away on the first swatch click.
3. **Block extensions** with defaults that keep today's output: `_product-card-gallery` (3:4 ratio, fit, media background, show badges, image position line, `@app` slot, plain placeholder, swipe in carousels), `swatches` (photo-thumbnail style), `product-title` (single line with ellipsis).
4. **Small JS extensions**: `product-card.js` (morph the badge on variant change, drive the position line, fix the price morph target), `overflow-list.js` (optional `maximum-items`), `slideshow.js` (optional `allow-nested`).
5. **Configuration**: 7 card instances in 6 templates, plus 11 keys in `config/settings_data.json` `current`.
6. **Duplicate-id fix** (004 reviewer follow-up) in `snippets/product-card.liquid`, with an id suffix passed from the product-list tab loop.

## Decision table
Reuse ladder: 1 Configure → 2 Extend → 3 New block in existing section → 4 New section

| Spec section / AC | Ladder step | Existing base | Files to create/modify | Justification (why not a lower step) |
|---|---|---|---|---|
| S1 badge rules: SOLD OUT, ONLY FEW LEFT (threshold), custom metafield, NEW/BESTSELLER tags, priority (AC1.3–1.7) | 2 Extend (new **snippet**, not a block) | Inline badge markup in `_product-card-gallery`, `product-badges-styles`, `color-custom-badge-*` | **new** `snippets/product-badge.liquid`; `snippets/product-badges-styles.liquid`; `blocks/_product-card-gallery.liquid`; `config/settings_schema.json` (Badges group) | Horizon only knows Sold out / Sale and has no threshold, tags or metafield. A snippet (rather than block) lets 006's PDP gallery and the Section Rendering response share the same logic. |
| S1 badge style: plain uppercase text, no fill, top-left (Clarifications: "Badge styling") | 1 Configure + 2 Extend | Theme settings `badge_position`, `badge_text_transform` | `config/settings_data.json` (`badge_position: top-left`, `badge_text_transform: uppercase`); new theme setting `badge_card_style` (filled / text), `badge_card_font_size`, `badge_card_text_color` | Position and case exist (configure). Horizon has no "text only" badge, and the PDP must keep a filled badge, so the card style is a separate opt-in setting (default `filled` = today). |
| S1 hide "Sale" badge (% OFF replaces it) | 2 Extend + 1 Configure | Horizon Sale badge | `badge_show_sale` theme setting (default true = today); `settings_data.json` sets false | Without a setting, the "Sale" badge would compete with the A3 priority list. |
| S1 media: background colour, 3:4 ratio, fit, 0 radius, no dimming (AC1.1, AC1.2) | 2 Extend + 1 Configure | `_product-card-gallery` `image_ratio`, border radius (already 0) | `blocks/_product-card-gallery.liquid` (new option `tall` = 3/4, `image_fit`, `media_background_color`); `snippets/card-gallery.liquid` (map `tall` → `3 / 4`, apply fit and background); templates | The ratio options lack 3:4, and the gallery has no background or fit setting. Radius 0 and no dimming are already Horizon behaviour. |
| S1 show/hide badge (AC1.9 badge half) | 2 Extend | – | `_product-card-gallery` `show_badges` (default true) | No per-card badge toggle exists. |
| S1 wishlist heart (AC1.9 heart half, AC1.10 heart, S5) | 2 Extend: `@app` slot only | `_product-card` already accepts `@app`, but renders it in the content flow, not on the media | `_product-card-gallery` schema `"blocks": [{"type": "@app"}]`, rendered top-right in `.card-gallery__app-slot` | Decision A1: the app provides the heart, its 44 px target and its toggle. The merchant shows or hides it by adding or removing the app block. |
| S1 no image (AC1.11) | 2 Extend | Horizon's title-text placeholder box | `_product-card-gallery` `neutral_placeholder` (default false); `card-gallery.liquid` renders `placeholder_svg_tag` on the media background at the gallery ratio | Horizon prints the product title in big type, which doesn't match "neutral placeholder". |
| S1/S2 in-card image carousel, arrows on hover (Clarifications) | 1 Configure + 2 Extend | Theme settings `product_card_carousel` (on), `show_second_image_on_hover` (on); `slideshow` arrows | `settings_data.json` `show_second_image_on_hover: false`; `card-gallery.liquid` shows arrows when `visible_slide_count > 1` **if** hover-swap is off (today: `media.size > 2`); `assets/slideshow.js` opt-in `allow-nested`; gallery `swipe_in_carousels` (default false) | Hover-swap conflicts with arrows and the indicator. Horizon disables nested slideshows (cards inside the 004/006 carousels), which would break AC4.7, so carousels need an opt-in. |
| S2 position line (AC2.1–2.3) | 2 Extend | `SlideshowSelectEvent`, which `ProductCard` already listens to | `card-gallery.liquid` (new `show_indicator` + style params); `_product-card-gallery` settings; `assets/product-card.js` | Nothing in Horizon renders a 1/N progress line. CSS vars + the existing event keep it small. Hidden when there is 1 visible slide or the card carousel is off. |
| S3 photo thumbnails, image priority (AC3.1, AC3.7) | 1 Configure + 2 Extend | Theme setting `show_variant_image`; `swatch.liquid` already prefers variant image → swatch image → swatch colour | `settings_data.json` `show_variant_image: true`; `snippets/swatch.liquid` new `fallback_image` param (4th priority); `snippets/variant-swatches.liquid` passes `product_resource.featured_media` | Priorities 1–3 exist. Only priority 4 is missing. |
| S3 colour option without admin swatches | 2 Extend | `variant-swatches` renders only options whose values have `swatch` data | `variant-swatches.liquid` also accepts the first option whose name is in theme setting `swatch_option_names` (blank = today) | Otherwise AC3.1 fails for stores with a plain-text "Color" option. It's a theme setting because the Section Rendering response must render the same option. |
| S3 thumbnail look: square, size, gap, selected border, hidden for 0–1 colours (AC3.2, AC3.5) | 2 Extend + 1 Configure | `swatches` block (alignment/padding only); strike-through for unavailable values already exists | `blocks/swatches.liquid` `swatch_style` (default / photos), `thumbnail_size`, `thumbnail_radius`, `thumbnail_gap`, `hide_single_value`; photos mode pre-selects the default colour (`has_option_selected: true`) | Global swatch size/radius also drive PDP and filter swatches, so card-only overrides are scoped to the block. AC3.5 = add/remove the block (Horizon way). |
| S3 max 5 then "+N", no wrap (AC3.4) | 2 Extend | `overflow-list` already shows "+N" for width overflow | `assets/overflow-list.js` + `snippets/overflow-list.liquid` optional `maximum-items`; theme setting `card_swatch_limit` (0 = today's width-only behaviour) | Width-only overflow can't cap at 5. |
| S3 click updates image, price, % off, badge, link (AC3.3) | 2 Extend | Image, link and price updates exist (`product-card.js` `#handleProductSelect`) | `sections/section-rendering-product-card.liquid` (+ badge, card price context, sale-price-first); `assets/product-card.js` (`#updateBadge`, price-target fix) | The badge isn't in the response, and the response price lacks the card options, so morphing would drop % off. |
| S3 keyboard and accessible name (AC3.6) | 1 Configure | Radio inputs with `aria-label="{{ value }}"` | none (verify only) | Already satisfied. |
| S4 title, 1 line with ellipsis (AC4.1) | 2 Extend + 1 Configure | `product-title` (wrap options only under the custom preset, no ellipsis) | `blocks/product-title.liquid` `single_line` (default false) | No truncation option exists. |
| S4 price order, compare-at, % OFF, rounding, From (AC4.2–4.6) | 2 Extend + 1 Configure | `price.liquid` (`show_sale_price_first`, `content.price_from`), `price-styles` | `snippets/price.liquid` (new `context`, `show_discount` params); `snippets/price-styles.liquid`; `blocks/price.liquid` (passes `context: 'card'` when inside a card); theme settings `card_show_from_price`, `card_show_compare_at`, `card_show_discount_label`, `card_sale_color`, `card_compare_at_color` | The discount label and "From" are missing. Gating on `context == 'card'` keeps the PDP, quick-add, predictive search and hotspots unchanged. |
| AC4.5 two decimals | 1 Configure (store admin) | `money` filter | none | The store's money format controls decimals (B4). Listed in the visual checklist. |
| AC4.7 same card everywhere | 1 Configure | Static `_product-card` in product-list, main-collection, search-results, product-recommendations (section and block) | 7 card instances in `templates/index.json` (x2), `collection.json`, `search.json`, `product.json`, `cart.json`, `404.json`; presets in `sections/product-list.liquid`, `sections/product-recommendations.liquid`, `blocks/product-recommendations.liquid` | Configuration only. Presets make carousels added later (006 "New arrivals", "You may also like") start as the 002 card. |
| 004 follow-up: duplicate DOM ids | 2 Extend | `snippets/product-card.liquid` ids `product-card-{{ block.id }}` and md5(`product-card-link-<block.id>-<product.id>`) | `snippets/product-card.liquid`, `blocks/_product-card.liquid` (new `card_id_suffix` param), `sections/product-list.liquid` (tab loop passes `card_id_suffix`) | The link id is used by `navigateToProduct` / main-collection scroll restore, so it must stay stable without a suffix. See "Duplicate ids". |
| S5 (all AC5.x) | – (deferred, A1) | – | `@app` slot only (above) | Out of scope. |

Rejected: a new `blocks/product-badge.liquid` theme block (the badge must also render inside the Section Rendering response and the PDP gallery, which a snippet does better), and a new card section (every host section already renders the shared static card).

## Schema changes

### `config/settings_schema.json` (theme settings)
All new. "Default" is the schema default; "Configured" is the value set in `settings_data.json` (see Template JSON changes).

**Badges group (`t:names.badges`), appended after `badge_text_transform`:**
| id | type | default | notes |
|---|---|---|---|
| (paragraph) | paragraph | – | `content`: `t:content.badge_sources` |
| `badge_low_stock_threshold` | range 0–20, step 1 | **5** (spec A3) | label `t:settings.inventory_threshold` (existing "Low stock threshold"); info `t:info.badge_low_stock_threshold`. 0 turns the badge off. |
| `badge_show_sale` | checkbox | true | label `t:settings.badge_show_sale`. Configured false. |
| (header) | header | – | `t:content.card_badges` |
| `badge_card_style` | select `filled` / `text` | `filled` | label `t:settings.badge_card_style`; options `t:options.badge_filled`, `t:options.badge_text_only`. Configured `text`. |
| `badge_card_font_size` | range 10–16 px | 12 | label `t:settings.badge_card_font_size`; `visible_if` style == text. 12 px = today's `--font-size--xs`. |
| `badge_card_text_color` | color (no default) | – | label `t:settings.badge_card_text_color`; `visible_if` style == text; blank → `var(--color-foreground)` |

**Product cards group (`t:names.product_cards`), appended after `product_card_carousel`:**
| id | type | default | notes |
|---|---|---|---|
| (header) | header | – | `t:content.card_prices` |
| `card_show_from_price` | checkbox | false | `t:settings.card_show_from_price`. Configured true. |
| `card_show_compare_at` | checkbox | true | `t:settings.card_show_compare_at` |
| `card_show_discount_label` | checkbox | false | `t:settings.card_show_discount_label`. Configured true. |
| `card_sale_color` | color | `#D0021B` | `t:settings.card_sale_color` (only used by the label, which is new) |
| `card_compare_at_color` | color (no default) | – | `t:settings.card_compare_at_color`; blank = today's subdued foreground. Configured `#8A8A8A`. |

**Swatches group (`t:names.swatches`), appended:**
| id | type | default | notes |
|---|---|---|---|
| `card_swatch_limit` | range 0–12 | 0 | `t:settings.card_swatch_limit`; info `t:info.card_swatch_limit`. 0 = width-based (today). Configured 5. |
| `swatch_option_names` | text (no default) | – | `t:settings.swatch_option_names`; info `t:info.swatch_option_names`. Configured `Color,Colour`. Compared case-insensitively after trimming. |

### `snippets/theme-styles-variables.liquid`
Add to `:root`: `--color-price-sale: {{ settings.card_sale_color | default: '#D0021B' }};`, and `--color-price-compare-at` only when `card_compare_at_color` is set. Add `--badge-card-font-size` and `--badge-card-color`. The `| default:` fallbacks follow 004's pattern. Don't touch the 004 typography-role block.

### `blocks/_product-card-gallery.liquid`
| id | type | default | notes |
|---|---|---|---|
| `image_ratio` | select (existing) | `portrait` (unchanged) | **add option** `{ "value": "tall", "label": "t:options.portrait_tall" }` → ratio `3 / 4` in `card-gallery.liquid` |
| `image_fit` | select `cover` / `contain` | `cover` | label `t:settings.media_fit`, options `t:options.cover` / `t:options.contain` (all existing keys). Sets `--product-media-fit` unless `adapt` + constrain already set it. |
| `media_background_color` | color (no default) | – | `t:settings.media_background`; sets `--card-media-background` on `.card-gallery` (blank = transparent = today) |
| `show_badges` | checkbox | true | `t:settings.show_badges` |
| `neutral_placeholder` | checkbox | false | `t:settings.neutral_placeholder` |
| (header) | header | – | `t:content.image_position_line` |
| `show_indicator` | checkbox | false | `t:settings.show_image_indicator`; info `t:info.image_indicator` |
| `indicator_thickness` | range 1–6 px | 2 | `t:settings.thickness`; visible_if show_indicator |
| `indicator_color` | color | `#000000` | `t:settings.indicator_color`; visible_if |
| `indicator_track_color` | color | `#E0E0E0` | `t:settings.indicator_track_color`; visible_if |
| `indicator_gap` | range 0–24 px | 8 | `t:settings.indicator_gap`; visible_if |
| `swipe_in_carousels` | checkbox | false | `t:settings.swipe_in_carousels`; info `t:info.swipe_in_carousels` |
| block types | `"blocks": [{ "type": "@app" }]` | – | rendered with `{% content_for 'blocks' %}` inside `<div class="card-gallery__app-slot">` (absolute, top / inline-end, same inset as the badge, `z-index` above the card link) |

Rendering changes in the block:
- Replace the inline Sold out / Sale markup with `{% if block_settings.show_badges %}{% render 'product-badge', product: product, variant: product.selected_variant, style: 'card' %}{% endif %}`. The snippet always outputs its `[data-product-badge]` wrapper when called, even if empty, so swatch updates have a target.
- Pass the new params to `card-gallery`: `has_badges`, `image_fit`, `media_background`, `show_indicator`, `indicator_style`, `allow_nested`, `neutral_placeholder`.
- Keep the quick-add render and the zoom-out title exactly as they are.

### `snippets/card-gallery.liquid`
New optional `@param`s, each documented in `{% doc %}`. All are absent when called from `_featured-product-gallery`, so that output is unchanged:
- `has_badges` (boolean): overrides the internal Sold out / Sale check that is used only for the title-placeholder padding.
- `image_fit` (string), `media_background` (color).
- `show_indicator` (boolean) and `indicator_style` (string of CSS vars). The line renders after the slideshow, inside `.card-gallery`, only when `settings.product_card_carousel` is on and `visible_slide_count > 1`: `<div class="card-gallery__indicator" ref="cardIndicator" aria-hidden="true" style="--indicator-count: N; --indicator-index: 0">`. The dark segment width is `calc(100% / var(--indicator-count))`, translated by `--indicator-index`, and the transition is disabled under `prefers-reduced-motion`. It's hidden in `[product-grid-view='zoom-out']`.
- `allow_nested` (boolean): appends ` allow-nested` to `slideshow_attributes`.
- `neutral_placeholder` (boolean): when the product has no media, render a `placeholder_svg_tag` (`product-apparel-1`) inside the media box at `--gallery-aspect-ratio` on the media background, instead of `.product-card-gallery__title-placeholder`.
- Arrow rule: `show_arrows` becomes true when `visible_slide_count > 1` **and** (`product.media.size > 2` **or** `settings.show_second_image_on_hover == false`). When hover-swap is on (Horizon default) it's unchanged.
- `ratio` case: add `when 'tall'` → `'3 / 4'`.

### `blocks/swatches.liquid`
| id | type | default | notes |
|---|---|---|---|
| `swatch_style` | select `default` / `photos` | `default` | `t:settings.swatch_style`; options `t:options.default` (existing), `t:options.product_photos` |
| `thumbnail_size` | range 20–48 px | 30 | `t:settings.size` (existing); visible_if photos |
| `thumbnail_radius` | range 0–24 px | 0 | `t:settings.border_radius` (existing); visible_if photos |
| `thumbnail_gap` | range 0–16 px | 6 | `t:settings.gap` (existing); visible_if photos |
| `hide_single_value` | checkbox | false | `t:settings.hide_single_swatch`; visible_if photos |

Photos mode:
- Adds class `product-swatches--photos` and vars `--card-swatch-size` (mobile `max(24px, size × 0.85)`), `--card-swatch-radius` and `--card-swatch-gap` on `<product-swatches>`. These sit outside the morphed `swatches-variant-picker-component`, so they survive swatch updates.
- Passes `has_option_selected: true` to `variant-swatches`, so the default colour is checked (AC3.2).
- Skips rendering when the swatch option has fewer than 2 values and `hide_single_value` is on.
- Scoped CSS:
  - Square thumbnails with `background-size: cover` on the media background.
  - A thin light border, and a 1 px `var(--color-foreground)` border on `label:has(:checked) .swatch`.
  - Keeps Horizon's strike-through and opacity for unavailable values.
- The `product_has_swatches` check also accepts a name match against `settings.swatch_option_names`. This uses the same helper logic as `variant-swatches`.

### `snippets/variant-swatches.liquid`
- Option selection: the first option whose values have swatches (today), **or**, if none has them, the first option whose downcased, trimmed name is in `settings.swatch_option_names`.
- Pass `fallback_image: product_resource.featured_media` to `swatch`.
- Pass `maximum-items: settings.card_swatch_limit` to `overflow-list` when it is > 0.
- New optional `@param`: none. Behaviour is driven by theme settings, so `section-rendering-product-card` renders identical markup.

### `snippets/swatch.liquid`
New optional `@param {object} [fallback_image]`. It's used only when `settings.show_variant_image` is on and neither the variant image, the swatch image nor the swatch colour produced a value. Today that case renders an empty dashed swatch, and it can only happen through the new name-matched options.

### `snippets/overflow-list.liquid` and `assets/overflow-list.js`
- The snippet gets the optional `maximum-items` param (documented), output as an attribute.
- JS: a `get maximumItems()` getter. In `#reflowItems`, once `visibleElements.length` reaches `maximumItems`, any further element goes to the overflow list even if it fits. The more-slot / `--overflow-count` logic is unchanged.
- Without the attribute, behaviour is identical. The filters block and the header menu also use overflow-list and never set it.

### `blocks/product-title.liquid`
`single_line` checkbox, default false, `t:settings.truncate_single_line`. When on, it adds class `product-title--single-line` to the `<a class="contents">` wrapper. Its `{% stylesheet %}` sets `white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0` on the inner text element.

### `snippets/price.liquid`, `snippets/price-styles.liquid`, `blocks/price.liquid`
- `price.liquid` new optional params:
  - `context` (`'card'`): applies `settings.card_show_from_price`, `card_show_compare_at` and `card_show_discount_label`.
  - `show_discount` (boolean): explicit override that 006 can use on the PDP.
  - Callers that pass neither get today's output byte-for-byte.
- **From** (card context, `card_show_from_price`, `product_resource.price_varies`, and `product_resource.selected_variant == blank`):
  - Show `{{ 'content.price_from' | t: price: price_min }}` (existing key).
  - Take the compare-at price and discount from the lowest-priced variant (loop `product_resource.variants`, keep the first with `price == price_min`).
  - Once a variant is selected (swatch click, filtered collection), show that variant's price without "From".
- **Discount label**:
  - Shown when compare > price, inside `[ref=priceContainer]`, after the compare-at span: `<span class="price-item__group price-discount">{{ 'content.price_discount_off' | t: percent: pct }}</span>`.
  - `pct = compare | minus: price | times: 100.0 | divided_by: compare | round` (A4). The label is hidden when `pct < 1`.
- **Compare-at hidden** (`card_show_compare_at` false): omit that span, and leave no empty gap (AC4.4).
- **Volume-pricing branch**: unchanged.
- `price-styles.liquid`:
  - `.price-discount { color: var(--color-price-sale); text-transform: uppercase; white-space: nowrap }`.
  - `.compare-at-price` uses `var(--color-price-compare-at, <current value>)`.
  - `[ref=priceContainer]` gets `display: flex; flex-wrap: wrap; column-gap` with the price and compare-at in a `nowrap` group, so on narrow cards only the label wraps (S4 mobile).
  - Scope the flex rule to `.price--card` (a class added in card context) so the PDP layout is untouched.
- `blocks/price.liquid` passes `context: 'card'` when the block is inside a card. The test is `product == blank or closest.product.id != product.id`. On the PDP, the main product's price block has `closest.product == product`. Recommendation cards on the PDP and cards on other templates are different products, or `product` is nil.

### `blocks/_product-card.liquid`, `snippets/product-card.liquid`
- `_product-card` doc gets `@param {string} [card_id_suffix]`, passed through to the snippet.
- `product-card.liquid`:
  - New optional `@param {string} [card_id_suffix]`.
  - `product_card_id` appends the suffix only when it's present, so main-collection's `#hash` scroll-restore ids are unchanged.
  - The `<product-card>` element id becomes `product-card-{{ block.id }}-{{ product.id }}{{ card_id_suffix }}`. It isn't referenced anywhere (grep: no CSS or JS uses it).
- `sections/product-list.liquid` tab loop: pass `card_id_suffix: '-p' | append: panel_index` (assign first) to the `_product-card` `content_for`. The default / collection branches are unchanged.

### `sections/section-rendering-product-card.liquid`
- Render `{% render 'product-badge', product: product, variant: product.selected_or_first_available_variant, style: 'card' %}` inside the `<product-card>`.
- Change the price call to `{% render 'price', product_resource: product, show_unit_price: true, context: 'card', show_sale_price_first: true %}`. `show_sale_price_first: true` matches every card template (all set it to true), so the order doesn't flip after a swatch click. Today Horizon flips it.
- Schema unchanged.

### Section presets (new sections only; existing templates are not affected)
`sections/product-list.liquid` (3 presets), `sections/product-recommendations.liquid` and `blocks/product-recommendations.liquid`. In each static `_product-card` preset:
- Set gallery `image_ratio: tall`, `image_fit: contain`, `media_background_color: #EDEDED`, `show_indicator: true` and `swipe_in_carousels: true`.
- Add a `swatches` child (`swatch_style: photos`, `hide_single_value: true`) between the gallery and the title.
- Set title `single_line: true`.

## Locale keys
Every key goes into the English defaults first (T1). At the end (last task), it's synced with the English text into all other `locales/*.json` / `*.schema.json` (004/001 rule). Reuse wherever an existing key already matches: `content.product_badge_sold_out`, `content.product_badge_sale`, `content.price_from`, `settings.inventory_threshold`, `settings.media_fit`, `settings.thickness`, `settings.size`, `settings.gap`, `settings.border_radius`, `options.cover`, `options.contain`, `options.default`.

`en.default.schema.json`:
- `content.badge_sources`: "NEW and BESTSELLER badges come from the product tags badge:new and badge:bestseller. Custom text comes from the product metafield custom.badge. Only one badge shows, in this order: Sold out, Only few left, custom, New, Bestseller, Sale."
- `content.card_badges`: "Card badges"
- `content.card_prices`: "Card prices"
- `content.image_position_line`: "Image position line"
- `settings.badge_show_sale`: "Show Sale badge"
- `settings.badge_card_style`: "Card badge style"
- `settings.badge_card_font_size`: "Card badge text size"
- `settings.badge_card_text_color`: "Card badge text"
- `settings.card_show_from_price`: "Show \"From\" price when variant prices differ"
- `settings.card_show_compare_at`: "Show compare-at price"
- `settings.card_show_discount_label`: "Show discount label"
- `settings.card_sale_color`: "Discount label"
- `settings.card_compare_at_color`: "Compare-at price"
- `settings.card_swatch_limit`: "Maximum swatches on cards"
- `settings.swatch_option_names`: "Colour option names"
- `settings.media_background`: "Media background"
- `settings.show_badges`: "Show badges"
- `settings.neutral_placeholder`: "Plain placeholder for products without images"
- `settings.show_image_indicator`: "Show image position line"
- `settings.indicator_color`: "Active segment"
- `settings.indicator_track_color`: "Track"
- `settings.indicator_gap`: "Space above line"
- `settings.swipe_in_carousels`: "Browse images inside product carousels"
- `settings.swatch_style`: "Swatch style"
- `settings.hide_single_swatch`: "Hide when there is only one colour"
- `settings.truncate_single_line`: "Limit to one line"
- `options.portrait_tall`: "Tall portrait (3:4)"
- `options.badge_filled`: "Filled"
- `options.badge_text_only`: "Text only"
- `options.product_photos`: "Product photos"
- `info.badge_low_stock_threshold`: "Shows \"Only few left\" when tracked stock is at or below this number. 0 turns it off."
- `info.card_swatch_limit`: "0 shows as many as fit on one line."
- `info.swatch_option_names`: "Comma-separated, for example Color, Colour. Used when an option has no swatches set in Shopify admin."
- `info.image_indicator`: "Shown when the product has more than one image and the card image carousel is on."
- `info.swipe_in_carousels`: "Desktop only. On mobile, swiping moves the carousel."

The builder must grep before adding each key. If one already exists with a different meaning, use a `card_`-prefixed id instead and record it in Implementation notes.

`en.default.json` (storefront):
- `content.product_badge_low_stock`: "Only few left"
- `content.product_badge_new`: "New"
- `content.product_badge_bestseller`: "Bestseller"
- `content.price_discount_off`: "{{ percent }}% OFF"

Badge text is uppercased by the `badge_text_transform` setting, so it reads "SOLD OUT" / "ONLY FEW LEFT".

## Badge snippet contract (`snippets/product-badge.liquid`, shared with 006)
```
@param {product} product - required
@param {variant} [variant] - when present, SOLD OUT and ONLY FEW LEFT are evaluated for this variant
@param {string} [style] - 'card' (uses settings.badge_card_style) | 'filled' | 'text'; default 'filled'
@param {string} [class] - extra classes on the wrapper
```
Rules, in priority order (A3):
1. **SOLD OUT**: `product.available == false`, or `variant` given and `variant.available == false`. Label `content.product_badge_sold_out`, colour class `color-custom-badge-sold-out`.
2. **ONLY FEW LEFT**: `settings.badge_low_stock_threshold > 0`, and a tracked total in `1..threshold`.
   - Tracked means `inventory_management == 'shopify'` and `inventory_policy == 'deny'`.
   - Product scope: sum `max(inventory_quantity, 0)` over available variants. Skip the badge if any available variant is untracked or set to continue selling, because its stock is effectively unlimited.
   - Variant scope: that variant's quantity, under the same tracked test.
   - Label `content.product_badge_low_stock`.
3. **Custom**: `product.metafields.custom.badge.value`, stripped and escaped.
4. **NEW**: any tag that downcases to `badge:new`. Label `content.product_badge_new`.
5. **BESTSELLER**: any tag that downcases to `badge:bestseller`. Label `content.product_badge_bestseller`.
6. **Sale**: only when `settings.badge_show_sale` is on and compare > price (variant if given, else product). Label `content.product_badge_sale`, `color-custom-badge-sale`.

Output:
- `<div class="product-badges product-badges--{{ settings.badge_position }} product-badges--{{ resolved_style }} {{ class }}" data-product-badge style="--badge-border-radius…; --badge-font-family…; --badge-text-transform…">`, holding at most one `<div class="product-badges__badge product-badges__badge--rectangle {{ colour class }}" data-badge-type="…">`.
- Types 2–5 use `color-custom-badge-sale` in filled style.
- `.product-badges:empty { display: none }` (AC1.7).
- Text style (`product-badges--text`):
  - `background: none`, `padding-inline: 0`, `color: var(--badge-card-color, var(--color-foreground))`, `font-size: var(--badge-card-font-size)`, `letter-spacing: var(--letter-spacing--body-loose)`.
  - The `color-custom-*` classes are not applied.

## JavaScript
No new module and no import-map change. `component.js`, `morph.js`, `section-renderer.js`, `utilities.js` and `base.css` are **not** touched.

`assets/product-card.js` (`ProductCard`):
- Add refs typedef `cardIndicator?: HTMLElement`.
- `#handleSlideshowSelect`:
  - Keep the existing `userInitiated` bookkeeping.
  - Then, if `this.refs.cardIndicator` and `this.refs.slideshow` exist, set `--indicator-count` to `slideshow.slides.length` (visible slides) and `--indicator-index` to `event.detail.index`, clamped.
  - This runs for every trigger (`select`, `scroll`, `drag`), so arrows, swipe, swatch image swaps and `previewVariant` all move the segment (AC2.2).
  - Event: `SlideshowSelectEvent` (`slideshow:select`, already imported).
- `#handleProductSelect` promise: after `updatePrice(html)`, call new `#updateBadge(html)`. It finds `html.querySelector('[data-product-badge]')` and `this.querySelector('[data-product-badge]')`, and if both exist runs `morph(current, next)`. If the card has none (`show_badges` off), it does nothing. Event: `StandardEvents.productSelect` / `ProductSelectEvent` promise (existing).
- `updatePrice`:
  - Today it targets `querySelectorAll("product-price [ref='priceContainer']")[1]`.
  - The builder must verify whether a card ever has two matches.
  - If not, change the target to the first match that is not inside `quick-add-component` or a `dialog`. Today the card price may never update on a swatch click.
  - Record the finding in Implementation notes.
- JSDoc-typed (strict `checkJs`).

`assets/slideshow.js`:
- In `connectedCallback`, replace `this.disabled = this.isNested || this.disabled;` with: if `this.isNested && this.hasAttribute('allow-nested')`, set the `mobile-disabled` attribute and leave `disabled` as is; otherwise keep the original line.
- The existing `disabled` getter already treats `mobile-disabled` as disabled below the large breakpoint, and the existing drag hand-off (`isNested && cannotMoveInDirection`) passes edge drags to the outer carousel.
- Don't alter 004's reduced-motion and focus changes.
- `assets/product-card.js` `#preloadNextPreviewImage` runs when `isNested`, which is unchanged and harmless.

`assets/overflow-list.js`: `maximum-items` (see Schema changes).

## Template JSON changes

### `templates/*.json`: 7 card instances
`index.json` `most_loved_styles` and `new_arrivals` (004-owned; edit only the `static-product-card` subtree), `collection.json` `main/product-card`, `search.json` `main/product-card`, `product.json` `product_recommendations_qggXJq/static-product-card`, `cart.json` `product_list_NNFgcy`, `404.json` `product_list_iA96Tq`.

For each instance:
- **Gallery**:
  - `image_ratio: "tall"`, `image_fit: "contain"`, `media_background_color: "#EDEDED"`, `show_badges: true`, `neutral_placeholder: true`.
  - `show_indicator: true` (thickness 2, `#000000` / `#E0E0E0`, gap 8).
  - `swipe_in_carousels: true`.
  - `"blocks": {}` stays.
- **New `swatches` child** (id `swatches_card`):
  - `swatch_style: "photos"`, `thumbnail_size: 30`, `thumbnail_radius: 0`, `thumbnail_gap: 6`, `hide_single_value: true`.
  - `product_swatches_alignment` / `_mobile: "flex-start"`, `product_swatches_padding_top: 8`, other paddings 0.
  - Add it to `block_order` between the gallery and `product-title`.
- **product-title**: `single_line: true`, `width: "100%"` (search currently `fit-content`).
- **price**: unchanged (`show_sale_price_first: true` already, `type_preset: h6`).
- `_product-card` `product_card_gap` unchanged.

Method:
- Edit from the current working-tree files with a script (no `theme pull`).
- Keep the auto-generated header comment.
- Validate every id, select value and range against the schemas by script, as 004 T17 did.

### `config/settings_data.json` (`current` only; `presets.Horizon` untouched)
- `show_second_image_on_hover: false`, `show_variant_image: true`.
- `badge_position: "top-left"`, `badge_text_transform: "uppercase"`, `badge_show_sale: false`, `badge_card_style: "text"`.
- `card_show_from_price: true`, `card_show_discount_label: true`, `card_compare_at_color: "#8A8A8A"`.
- `card_swatch_limit: 5`, `swatch_option_names: "Color,Colour"`.

The file is one minified JSON line, so the builder must:
- Load it, set the keys and dump with `separators=(',', ':')` and `ensure_ascii=False`, keeping the single-line shape.
- Diff it to confirm that only these keys changed.

No `sections/*-group.json` changes.

## Risks / backwards compatibility
1. **Global switches in `settings_data.json` affect more than cards.**
   - `show_variant_image: true` also switches PDP variant-picker and quick-add swatches to variant photos. Spec 006 wants that (progress log 2026-11-19).
   - `badge_position` / `badge_text_transform` also affect `featured-product`, `product-hotspots` and the PDP gallery badges, which still render Horizon's markup.
   - `show_second_image_on_hover: false` removes hover-swap on every card.
   - All of these are the intended look. They're listed in the visual checklist.
2. **Low-stock badge default 5** (spec-mandated) appears automatically on existing cards for tracked products with 1–5 units, replacing "Sale" where both apply.
3. **Nested carousels.** With `swipe_in_carousels` on, cards inside the 004/006 carousels get working arrows on desktop. On mobile the in-card slideshow is `mobile-disabled`, so swipes move the outer carousel and the position line stays on image 1 (open question Q3).
4. **Section Rendering parity.** Anything the swatch response must reproduce lives in theme settings (badge, price options, swatch limit, option names). The thumbnail look lives on `<product-swatches>` (not morphed). If a builder moves any of it to block settings, swatch clicks would revert it. The reviewer must check this.
5. **Shared snippets.**
   - `price.liquid` is used by PDP, quick-add, hotspots, predictive search (`resource-card`) and featured product. New behaviour is gated on `context: 'card'`.
   - `swatch.liquid` is used by filters and the PDP. `fallback_image` is used only when passed.
   - `overflow-list` is used by filters and the header menu. `maximum-items` is opt-in.
   - `card-gallery` is used by `_featured-product-gallery`. All new params are optional.
6. **Swatch pre-selection** (photos mode). The default colour is checked on load, so pointer-leave resets the image to that variant's image. If a product's featured image isn't the first variant's image, the first hover-out can show a different image than on load. Accepted; the merchant fixes it by image order.
7. **Theme Check LiquidComplexity.**
   - `card-gallery.liquid` and `variant-swatches.liquid` are already large. Keep the new logic in `product-badge.liquid` and small param branches.
   - A new LiquidComplexity warning on an existing file is a deviation that must be recorded. Errors are not acceptable.
8. **Price on swatch click** may not update today (`[1]` index). Fixing it changes Horizon behaviour, for the better.
9. **Card ids.** The `<product-card>` element id changes. It's unreferenced. The link id (used for scroll restore) is unchanged without a suffix.
10. **`index.json` is 004-owned.** Only the two `static-product-card` subtrees change. The 003 "style edit" insertion note in progress.md stays valid.
11. **Out of reach.** `resource-card` (predictive search), `featured-product`, `product-hotspots` and `_featured-product` keep Horizon's look. They aren't product listings in G4.
12. **Money format.** Two decimals (AC4.5) depend on the store's money format in Shopify admin.

## Open questions (none blocking; recommended defaults are used)
- **Q1 Low-stock scope after a swatch click.** Recommended: product-level on first render, selected-variant level after a colour is chosen (and on the PDP in 006).
- **Q2 Untracked or "continue selling" variants.** Recommended: excluded. Any available untracked variant suppresses ONLY FEW LEFT.
- **Q3 Image swipe on mobile inside carousels.** Recommended: off. The outer carousel owns the swipe. Grids (collection, search) swipe normally. Desktop arrows work everywhere.
- **Q4 "From" with a compare-at price.** Recommended: compare-at and % OFF come from the lowest-priced variant.
- **Q5 Quick add "+" on cards.** It isn't in the mockups, and it's out of this spec. Recommended: leave the `quick_add` theme setting as it is. The merchant can turn it off.
- **Q6 Colour option names.** Recommended: `Color,Colour`.
- **Q7 Clicking "+N".** Recommended: Horizon behaviour (expands the row).
