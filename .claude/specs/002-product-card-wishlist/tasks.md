# Tasks 002: Product card (badge, image carousel and position line, photo swatches, title, price / compare-at / % off)

`[P]` marks a task that can run in parallel with the other `[P]` tasks in the same wave (they touch disjoint files). Load the `horizon-conventions` skill first. Read `plan.md` for exact ids, defaults and contracts. Every new snippet or param gets `{% doc %}` `@param` entries. Don't revert 001/004 changes in shared files.

## Wave 0
- [x] T1 Add the locale keys listed in plan.md "Locale keys" to the English defaults only. Grep each key first and reuse existing ones (`content.product_badge_sold_out`, `content.price_from`, `settings.inventory_threshold`, `settings.media_fit`, `settings.thickness`, `settings.size`, `settings.gap`, `settings.border_radius`, `options.cover/contain/default`). Files: `locales/en.default.json`, `locales/en.default.schema.json`. Covers: AC1.8, AC4.6 (and labels for every later task).

## Wave 1 (after T1; all [P], disjoint files)
- [x] T2 [P] Create the shared badge snippet with the A3 rules, priority, variant scope and card/filled/text styles, following the "Badge snippet contract" in plan.md. Extend the badge styles: `.product-badges:empty`, `.product-badges--text`, `--badge-card-font-size`, `--badge-card-color`. Files: **new** `snippets/product-badge.liquid`, `snippets/product-badges-styles.liquid`. Covers: AC1.3, AC1.4, AC1.5, AC1.6, AC1.7, AC1.8.
- [x] T3 [P] Add the theme settings: Badges group (`badge_sources` paragraph, `badge_low_stock_threshold`, `badge_show_sale`, `card_badges` header, `badge_card_style`, `badge_card_font_size`, `badge_card_text_color`), Product cards group (`card_prices` header, `card_show_from_price`, `card_show_compare_at`, `card_show_discount_label`, `card_sale_color`, `card_compare_at_color`) and Swatches group (`card_swatch_limit`, `swatch_option_names`). Output the CSS vars `--color-price-sale`, `--color-price-compare-at` (only if set), `--badge-card-font-size` and `--badge-card-color` with `| default:` fallbacks. Leave 004's typography-role block untouched. Files: `config/settings_schema.json`, `snippets/theme-styles-variables.liquid`. Covers: AC1.4, AC3.4, AC4.6.
- [x] T4 [P] Price: add the `context: 'card'` and `show_discount` params, From price (lowest-priced variant's compare-at), discount label inside `[ref=priceContainer]` with nearest-whole rounding (hidden if < 1), the compare-at toggle and the `.price--card` flex/wrap layout. Add `.price-discount` and the compare-at colour var. In the price block, pass `context: 'card'` when `product == blank or closest.product.id != product.id`. Callers without `context` must render byte-identical output. Files: `snippets/price.liquid`, `snippets/price-styles.liquid`, `blocks/price.liquid`. Covers: AC4.2, AC4.3, AC4.4, AC4.5, AC4.6.
- [x] T5 [P] Overflow list: add the optional `maximum-items` attribute (snippet param plus `maximumItems` getter, capping `visibleElements` in `#reflowItems`). It does nothing when absent. Files: `snippets/overflow-list.liquid`, `assets/overflow-list.js`. Covers: AC3.4.
- [x] T6 [P] Slideshow: add opt-in `allow-nested` (nested + attribute → set `mobile-disabled` instead of `disabled`). Keep 004's reduced-motion/focus code. Files: `assets/slideshow.js`. Covers: AC2.2, AC4.7.
- [x] T7 [P] Product title: add the `single_line` checkbox (default false), the `product-title--single-line` class and ellipsis CSS. Files: `blocks/product-title.liquid`. Covers: AC4.1.
- [x] T8 [P] Duplicate ids (004 reviewer follow-up):
  - Add `card_id_suffix` param to `_product-card` → snippet.
  - The `<product-card>` id becomes `product-card-{{ block.id }}-{{ product.id }}{{ suffix }}`.
  - The link-id md5 source appends the suffix only when present.
  - The product-list tab loop passes `'-p' | append: panel_index`.
  - Confirm that `navigateToProduct` and main-collection scroll restore still resolve, since they use the link id.

  Files: `blocks/_product-card.liquid`, `snippets/product-card.liquid`, `sections/product-list.liquid` (tab loop only). Covers: AC4.7 (valid DOM in tabs).

## Wave 2
- [x] T9 Swatches:
  - Pass `fallback_image` to `swatch` (4th image priority).
  - Fall back to option names from `settings.swatch_option_names`.
  - Pass `maximum-items: settings.card_swatch_limit` when > 0.

  Files: `snippets/swatch.liquid`, `snippets/variant-swatches.liquid`. Depends: T3, T5. Covers: AC3.1, AC3.4, AC3.7.
- [x] T10 Swatches block: add photos mode (`swatch_style`, `thumbnail_size`, `thumbnail_radius`, `thumbnail_gap`, `hide_single_value`), CSS vars on `<product-swatches>`, `has_option_selected: true` in photos mode, the selected and unavailable styles, mobile min 24 px, and name-match in `product_has_swatches`. Files: `blocks/swatches.liquid`. Depends: T9. Covers: AC3.1, AC3.2, AC3.4, AC3.5, AC3.6 (verify `aria-label` + radio keyboard), AC3.7.
- [x] T11 Card media:
  - Gallery block settings (`image_ratio` option `tall`, `image_fit`, `media_background_color`, `show_badges`, `neutral_placeholder`, indicator settings, `swipe_in_carousels`).
  - `"blocks": [{"type": "@app"}]` rendered in `.card-gallery__app-slot` (top / inline-end, same inset as the badge).
  - Badge through `product-badge` (`variant: product.selected_variant`, `style: 'card'`).
  - card-gallery params: `has_badges`, `image_fit`, `media_background`, `show_indicator` + `indicator_style`, `allow_nested`, `neutral_placeholder`.
  - The `tall` ratio, the arrow rule (`visible_slide_count > 1` when hover-swap is off), and the indicator markup (`ref="cardIndicator"`, `aria-hidden`, reduced-motion, hidden in zoom-out and when ≤ 1 visible slide or the carousel setting is off).
  - `_featured-product-gallery` output must stay unchanged.

  Files: `blocks/_product-card-gallery.liquid`, `snippets/card-gallery.liquid`. Depends: T2, T6. Covers: AC1.1, AC1.2, AC1.3–AC1.7 (rendering), AC1.9, AC1.10 (badge/slot alignment; heart target = app), AC1.11, AC2.1, AC2.3.
- [x] T12 [P] Section rendering response: render `product-badge` (`variant: product.selected_or_first_available_variant`, `style: 'card'`) and the price with `context: 'card'` and `show_sale_price_first: true`. Files: `sections/section-rendering-product-card.liquid`. Depends: T2, T4. Covers: AC3.3.

## Wave 3
- [x] T13 Product card JS:
  - `#handleSlideshowSelect` updates `--indicator-count` and `--indicator-index` on `refs.cardIndicator` for every trigger.
  - New `#updateBadge(html)` morphs `[data-product-badge]` in the `#handleProductSelect` promise.
  - Investigate the `updatePrice` `[1]` index. Retarget it to the card's own price container if there's only one, and record the finding.
  - JSDoc types (strict `checkJs`).

  Files: `assets/product-card.js`. Depends: T11, T12. Covers: AC2.2, AC3.3.

## Wave 4 (configuration)
- [x] T14 [P] Theme settings values: script-edit `current` only (keep the single minified line, `presets` untouched) with the 11 keys in plan.md, then diff to confirm. Files: `config/settings_data.json`. Depends: T3. Covers: AC1.4, AC3.4, AC3.7, AC4.2, AC4.6, S1/S2 carousel behaviour.
- [x] T15 [P] Card instances in templates:
  - For all 7 `_product-card` instances, set the gallery settings, add the `swatches_card` child between gallery and title in `block_order`, and set title `single_line: true` / `width: 100%`.
  - In `index.json`, edit only the two `static-product-card` subtrees (004-owned).
  - Work from the working-tree files with a script, keep the header comments, and validate every id, option and range against the schemas.

  Files: `templates/index.json`, `templates/collection.json`, `templates/search.json`, `templates/product.json`, `templates/cart.json`, `templates/404.json`. Depends: T7, T10, T11. Covers: AC1.1, AC1.2, AC2.1, AC3.5, AC4.1, AC4.7.
- [x] T16 Section presets: update the static `_product-card` presets the same way as T15. Valid preset JSON only. Files: `sections/product-list.liquid` (3 presets; schema only, after T8), `sections/product-recommendations.liquid`, `blocks/product-recommendations.liquid`. Depends: T8, T15. Covers: AC4.7 (future carousels, e.g. 006).

## Wave 5 (review and close)
- [x] T17 Backwards-compatibility review (no new features; fix only regressions). For each place cards render, confirm that the output with **schema defaults** (no new settings set) matches today's, and that the configured output matches the spec:
  - Places: home product-list grid, carousel and tabs (004); collection grid incl. editorial layout and zoom-out view; search results; product recommendations (section and block, related/complementary); cart and 404 product lists; `blocks/product-card.liquid` (public card in `section`); `_featured-product` (card-gallery without new params).
  - Check `price.liquid` callers without `context` (PDP `product-information`, `_featured-product-price`, `_hotspot-product`, `resource-card`, quick-add) for unchanged markup.
  - Check `swatch.liquid` callers (filters, PDP picker) and `overflow-list` callers (filters, header menu).
  - Confirm Section Rendering parity: every setting the swatch response needs is a theme setting.
  - Confirm no duplicate ids with a product in two tabs.
  - Record findings in Implementation notes.

  Files: none, or the fix's file. Covers: AC4.7 and the plan's Risks section.
- [x] T18 Close-out:
  - **Locale sync:** add every new key from T1 (and any added later) to all other `locales/*.json` and `locales/*.schema.json` with the English text. Additions only, structure preserved.
  - Run `shopify theme check`. The target is 0 errors and only the 7 baseline warnings. Any new warning is either fixed or recorded with a reason.
  - Update `.claude/progress.md` (002 Plan/Tasks/Implemented, log entry), `.claude/specs/design-map.md` (G4 → Done, G5 → "Deferred to app; `@app` slot on card media"), and `.claude/specs/decisions.md` (A3 implementation note: snippet `product-badge` shared with 006).
  - Write the visual checklist for the user:
    - Badges in every state and priority.
    - 3:4 grey media and contain fit.
    - Arrows and position line in grid and carousels (desktop), and swipe in grids (mobile).
    - Photo swatches: max 5 + "+N", selected border, faded/struck unavailable colour, hidden for 0–1 colours.
    - Swatch click updates image, price, % off, badge and link.
    - "From" price, "19% OFF" for 3,239/3,999.
    - One-line ellipsis titles.
    - Money format shows 2 decimals.
    - App heart slot position once an app is installed.
    - PDP swatches now photos.
    - No "Sale" pill.

  Files: `locales/*.json`, `locales/*.schema.json`, `.claude/progress.md`, `.claude/specs/design-map.md`, `.claude/specs/decisions.md`. Covers: AC1.8, AC4.6, all (verification).

## AC coverage
| AC | Tasks |
|---|---|
| AC1.1 | T11, T15 |
| AC1.2 | T11, T15 |
| AC1.3 | T2, T11 |
| AC1.4 | T2, T3, T14 |
| AC1.5 | T2 |
| AC1.6 | T2 |
| AC1.7 | T2, T11 |
| AC1.8 | T1, T18 |
| AC1.9 | T11 (badge toggle; heart = add/remove the app block, A1) |
| AC1.10 | T11 (slot top-right, top-aligned with the badge); 44×44 target belongs to the wishlist app (A1) |
| AC1.11 | T11 |
| AC2.1 | T11, T15 |
| AC2.2 | T6, T11, T13 (mobile in carousels: see plan Q3) |
| AC2.3 | T11 |
| AC3.1 | T9, T10, T14 |
| AC3.2 | T10 |
| AC3.3 | T12, T13 (image/link updates are existing Horizon behaviour) |
| AC3.4 | T3, T5, T9, T10, T14 |
| AC3.5 | T10, T15 |
| AC3.6 | T10 (verify existing) |
| AC3.7 | T9, T10, T14 |
| AC4.1 | T7, T15 |
| AC4.2 | T4, T14 |
| AC4.3 | T4 |
| AC4.4 | T4 |
| AC4.5 | T4 + store money format (checklist) |
| AC4.6 | T1, T3, T4 |
| AC4.7 | T8, T15, T16, T17 |
| AC5.1–AC5.14 | Out of scope (deferred to app, A1/A2); `@app` slot in T11 |

## Implementation notes
Deviations from the plan, with the reason for each.
- T8: <product-card> id gets -{product.id}{suffix} only when card_id_suffix is passed (product-list tabs: -pN). Without suffix, output is byte-identical (kept Horizon's shared product-card-{block.id} id in grids; nothing references it). Link md5 ids unchanged for collection grid scroll restore.
- T3: --badge-card-color and --color-price-compare-at are output only when set; consumers use var(..., fallback) so cards in other colour schemes keep the right colour. Schema defaults keep today's output (from/discount off, swatch limit 0); store values set in T14.
- T5–T7: maximum-items skips the overflow placeholder when only the cap hides items; not observed after load. allow-nested sets mobile-disabled instead of disabled. single_line applies only to the product-link branch (not the editor placeholder).
- T2: product-badge wrapper always output (data-product-badge, :empty hides it) so swatch morph can update it. Text style keeps padding-block. Theme check: OrphanedSnippet + 2 ValidScopedCSSClass on product-badge until T11/T12 render it — recheck then.
- T4: compare-at colour applied only to .price--card (not PDP/cart/quick-add). Card context skipped when product is blank. RISK for T17: blocks/price.liquid treats the price block inside featured-product-information on non-product templates as a card (product blank) → 'From' and % OFF would show there once settings_data enables them; T17 must decide/fix.
- T9/T10: option-name match is case- and space-insensitive. No media-background fill on thumbnails (would hide colour swatches). Colour with no variant/swatch image falls back to product featured image (AC3.7 priority 4). Photos mode: 1px border, selected = foreground border, focus outline kept, unavailable faded + strike.
- T11: @app slot top-right (wrapper only when an app block renders). Position line = ref cardIndicator on .card-gallery with --indicator-count/--indicator-index (T13 updates them). Arrows when >1 visible slide and (media>2 or hover-swap off) — also affects _featured-product-gallery with exactly 2 media once hover-swap is off. Frozen line if show_indicator on but swipe_in_carousels off inside carousels (templates set both). Badge top-right would collide with the app slot; configured top-left.
- T12: response renders product-badge (selected_or_first_available_variant, style card) inside productCardLink before <product-price>, and price with context card + show_sale_price_first true (cards must set the same — T15/T16). After a click, badge stock follows the chosen variant and 'From' disappears (intended). KNOWN for T17: response is fetched from the product URL, so price.liquid uses product-page currency-code setting and variant volume pricing — may differ from first render if those settings differ.
- T14: settings_data current: show_second_image_on_hover false, show_variant_image true, badge_position top-left, badge_text_transform uppercase, badge_show_sale false, badge_card_style text, card_show_from_price true, card_show_discount_label true, card_compare_at_color #8A8A8A, card_swatch_limit 5, swatch_option_names Color,Colour. Store-wide effects: badges top-left uppercase everywhere (PDP, featured product, hotspots); Sale pill hidden.
- T15: 7 card instances (index x2, collection, search, product recs, cart, 404) configured: gallery tall/contain/#EDEDED/badges/neutral placeholder/swipe in carousels/indicator 2px #000 on #E0E0E0 gap 8; new swatches_card block (photos 30px, gap 6, hide single, padding-top 8) after gallery; title single_line. Price blocks already show_sale_price_first true.
- T13: updatePrice now morphs the card's own product-price [ref=priceContainer].price--card (old [1] index was always undefined — card prices never updated before); falls back to old lookup. #updateBadge morphs [data-product-badge]. #updateIndicator on own SlideshowSelectEvent and after variant image swap; hides line when ≤1 reachable slide. disconnectedCallback now removes productSelect/slideshow:select/mediaQueryLarge listeners. FOR T17: add :not([hidden]) to the .card-gallery:has(> .card-gallery__indicator) offset rules in snippets/card-gallery.liquid.
- T16: 5 presets (product-list grid/carousel/editorial, product-recommendations section + block) mirror the T15 card config; title type_preset/price settings kept as they were.
- T17 review (schema defaults vs configured). Fixed:
  (a) blocks/price.liquid:16-18 — the price block clears the card context when the section's own product setting is the same product (featured-product-information on any template, incl. a product page showing a different product). Cards in product-list, main-collection (incl. editorial), search, product-recommendations (its `product` setting is the source product, which recommendations exclude), the recommendations block and the public product-card block are unaffected. PDP product-information and quick add (fetched on the product URL) were already non-card.
  (b) snippets/card-gallery.liquid:342-350 — quick-add / bottom-left badge offsets now need `.card-gallery__indicator:not([hidden])` and skip `[product-grid-view='zoom-out']` (where the line is display:none).
  (c) snippets/price.liquid:108-114 — in card context use_currency always follows `currency_code_enabled_product_cards`, so the swatch response (rendered on the product URL) matches the first render. Non-card callers unchanged. NOT fixed: volume pricing — on product-template responses price.liquid uses the selected variant's quantity breaks instead of `quantity_price_breaks_configured?`; only affects B2B volume-priced products, Horizon logic, left as is.
  Confirmed unchanged with defaults: price.liquid without `context` (product-information, quick add, _hotspot-product, resource-card, quick-order-list), swatch.liquid without `fallback_image` (filters, PDP picker), overflow-list without `maximum-items` (filters, header menu; card_swatch_limit default 0 omits the attribute), card-gallery without the new params (_featured-product-gallery; only the T11-recorded arrow rule differs when hover-swap is off), product-title/swatches/gallery new settings default off, swatch_option_names default blank. Expected differences with defaults (plan Risks 2): low-stock badge (threshold 5) and badge wrapper class `product-badges--filled`. Section Rendering parity: every value the response needs is a theme setting; card price blocks keep show_sale_price_first true like the response. Ids: no duplicate ids with a product in two tabs (card/link ids suffixed; swatch inputs have no id).
  FOLLOW-UP (corrected after review, NOT a defect): swatch radios are named `{option}-{product.id}-swatch`, but each card's swatch picker renders its own `<form>`, so same-named radios in two cards of the same product are separate radio groups and both keep their pre-selected state. No rename is needed (a per-card rename would also be reverted by the swatch-response morph).
- T18: 39 missing keys (4 storefront, 35 schema) synced as 1,409 entries into 46 `*.json` and 35 `*.schema.json` locales with English text, inserted after their English predecessor key. Verified against HEAD by script: no existing key/value removed or changed (diff deletions are comma-only lines). Theme check: 0 errors, 7 baseline warnings.
- Review fixes (002):
  - "From" after swatch click: `snippets/price.liquid` takes optional `variant_selected`; when true the card "From" price is skipped. `sections/section-rendering-product-card.liquid` passes `variant_selected: true`. The response request sends only `option_values=`, which Shopify resolves into `product.selected_or_first_available_variant`; the response file and `price.liquid` already read price, compare-at and the % OFF from that variant, so no other change was needed.
  - Price order: in card context `price.liquid` always renders the sale price first (forces `show_sale_price_first`), so first render and swatch response match. Documented in the snippet `{% doc %}`. Non-card callers are unchanged.
  - `assets/product-card.js` `updatePrice`: without a `.price--card` container, falls back to the card's only `product-price [ref='priceContainer']` before the original `[1]` lookup (card on its own product page now updates).
  - T17 swatch radio-group follow-up corrected above (not a defect, each picker has its own form).
  - `snippets/variant-swatches.liquid`: swatch `aria-label` value now `| escape`d.
