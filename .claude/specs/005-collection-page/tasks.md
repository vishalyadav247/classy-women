# Tasks 005: Collection page

`[P]` marks a task that can run in parallel with the other `[P]` tasks (they touch disjoint files). Tasks without `[P]` run in the listed order after their dependencies. Load the `horizon-conventions` skill first. Every new snippet or block starts with `{% doc %}`. All labels are `t:` keys from T1.

- [x] **T1 Locale keys (English defaults).** Add every new key in plan "Locale keys" to `locales/en.default.schema.json` and `locales/en.default.json`. Before adding the conditional keys (`options.ratio_*`, `settings.text_size`), grep for existing equivalents and reuse them if found. Additions only; keep the comments and order. Files: `locales/en.default.json`, `locales/en.default.schema.json`. Covers: AC2.9, AC4.4, AC3.8, AC6.1 (labels translatable).
- [x] **T2 [P] Drawer: modal and left-side options.** In `theme-drawer.js`, add the `#isModal` getter (`modal` attribute or the <990px query) and use it everywhere `#modalQuery.matches` is read. `#onModalBreakpointChange` returns early for `[modal]`. Add `[side='start']` CSS (anchor, border, safe-area, opening and closing keyframes). The squeeze script ignores `[modal]` drawers. No change without the attributes. Files: `assets/theme-drawer.js`, `snippets/theme-drawer-styles.liquid`, `snippets/theme-drawer.liquid`. Covers: AC2.6, S2 drawer side.
- [x] **T3 [P] Facets: Apply-button mode.** On `FacetsFormComponent`, add `apply-mode="button"` support (`deferApply`, `markPending`, `applyAndClose`, and reset on `theme-drawer:close` when pending). `FacetInputsComponent.updateFilters` and `PriceFacetComponent.updatePriceFilterAndResults` defer when the closest form has `deferApply`. Chips, Clear all and sorting still apply at once. Keep the JSDoc strict-typed. Files: `assets/facets.js`. Covers: S2 apply mode, AC2.4.
- [x] **T4 [P] Paginated list: Load more.** Add the public `loadMore()` (busy state, disabled, hide at end, status text, focus on the first new card for keyboard users), with typed refs `loadMoreButton`/`loadMoreStatus`. `#renderNextPage` returns its promise. Infinite-scroll behaviour is unchanged. Files: `assets/paginated-list.js`. Covers: AC4.2, AC4.4.
- [x] **T5 [P] Product grid snippet.** Add the optional params `has_promos` (adds the `product-grid--has-promos` class and `grid-auto-flow: row dense`) and `load_more_button` (Load more markup from the plan, replacing `viewMoreNext`; `viewMorePrevious` kept). Read `section.settings.grid_columns` nil-safe for fixed desktop columns, and skip the large/xl container rule when it is fixed. Update `{% doc %}`. Output with no new params/settings must stay byte-identical. Files: `snippets/product-grid.liquid`. Covers: AC3.1, AC3.4, AC4.1, AC4.2, AC4.4.
- [x] **T6 [P] Promo tile block.** Create the private block with the plan's schema, the `<!--promo:N-->` + `li` output contract (`data-page="1"`, `ref="cards[]"`, no `.product-grid__item`, no `data-product-id`), image/video media, overlay (highlight box + text left, CTA right, top/bottom), whole-tile link with `aria-label`, editor placeholder, nothing on the storefront when the media is blank, CSS for side, size and mobile full width + ratio, hover (reduced-motion safe), and hidden in zoom-out. Files: `blocks/_collection-promo-tile.liquid`. Covers: AC3.3, AC3.5, AC3.6, AC3.7, AC3.8, AC3.10.
- [x] **T7 Main collection section** (after T4–T6). Schema: `blocks` → `_collection-promo-tile`; `grid_columns`; relabelled `enable_infinite_scroll` + info; `load_trigger`; `products_per_page` visible always and used in all modes; promo header + `show_promos_when_filtered`. Markup: compute `filters_active`, capture and interleave tiles (page 1, grid layout, `position < collection.products.size`, filter rule), pass `has_promos` / `load_more_button` to `product-grid`. Product `li` markup and the hash-scroll script must stay unchanged. Keep LiquidComplexity under the threshold, and extract a snippet if needed. Files: `sections/main-collection.liquid` (+ optional new `snippets/filters-active.liquid`). Covers: AC3.1, AC3.4, AC3.9, AC4.1, AC4.2, AC4.3, AC4.5, S3 out-of-range/filtering/page-1 rules.
- [x] **T8 Filters: Drawer style toolbar** (after T2, T3). New snippet `facets-toolbar` (count centred, Sort by + Filter (n) right with dividers, top/bottom borders, mobile two-cell bar + count line, chips row with "×"-first pills and Clear all at 2+). `sorting` gets an optional `label` param. `filter-remove-buttons` gets optional `form_id` and `clear_all_min`. `filters.liquid`: `drawer` option, `show_product_count`, `drawer_side`, `apply_mode`, `filter_width` visible for drawer, `modal`/`side` attributes on the drawer, `apply-mode` on the drawer form, no sorting inside the drawer in Drawer style, Apply button in button mode. Horizontal and vertical output stays the same except the count toggle (default on). Files: `blocks/filters.liquid`, `snippets/facets-toolbar.liquid`, `snippets/sorting.liquid`, `snippets/filter-remove-buttons.liquid`. Covers: AC2.1, AC2.2, AC2.3, AC2.4, AC2.5, AC2.6, AC2.7, AC2.8, AC2.9.
- [x] **T9 [P] Banner: media-with-content extensions.** `media_height: custom` + desktop/mobile vw ranges. Content-only grid via `:not(:has(.media-block))`. `_media-without-appearance`: `use_collection_image`, `hide_when_empty`. `media.liquid`: collection-image fallback, nothing rendered when empty on the storefront, `alt_text_fallback` = collection title (else page title), `{% doc %}` updated. `_media` output unchanged. Files: `sections/media-with-content.liquid`, `blocks/_media-without-appearance.liquid`, `snippets/media.liquid`. Covers: AC1.3, AC1.4, AC1.6, AC1.7, AC1.8.
- [x] **T10 [P] Breadcrumb block.** New public block (nav + ol, Home → `routes.root_url`, current page title by `request.page_type`, `aria-current`, separator setting, text size, alignment, padding, preset). Files: `blocks/breadcrumb.liquid`. Covers: AC1.2, AC1.8.
- [x] **T11 [P] Collection list extensions.** Add `desktop_peek` (default true; the setting is already read by `resource-list-carousel`), `image_hover_zoom` (default false; reduced-motion safe) and `hide_when_empty` (default false; storefront only). Files: `sections/collection-list.liquid`. Covers: AC5.2, AC5.5, S5 empty state.
- [x] **T12 [P] Read-more text block + component.** New public block (metafield `custom.seo_text` else shared rich text, collapsed lines, text size, alignment, hide section when empty on the storefront, full content always in the markup) and `assets/read-more.js` (`read-more-text`, ResizeObserver overflow check, `aria-expanded`/`aria-controls`, Read more/Read less labels from data attributes). Files: `blocks/read-more-text.liquid`, `assets/read-more.js`. Covers: AC6.1, AC6.2, AC6.3, AC6.4, AC6.5, AC6.6, AC6.7.
- [x] **T13 Backwards-compatibility review** (after T2–T12; review only, fix only the file at fault).
  - **Usages:** grep `templates/*.json`, `sections/*.json` and section presets for usages of `main-collection` (collection only, `enabled_on`), `search-results` (shares `product-grid`, `filters`, `sorting`, `filter-remove-buttons`, `facets.js`, `paginated-list.js`), `media-with-content`, `_media`, `collection-list`, `theme-drawer` (cart drawer, chat drawer, buy-buttons drawer) and `blog-posts-list`.
  - **Defaults:** confirm each new default reproduces the previous output. That covers horizontal/vertical filters, the existing drawer squeeze, search grid columns and pagination, blank `collection_list` placeholders, and media placeholders.
  - **002 card:** the 002 card config in `collection.json` is untouched. Card `li` ids and data attributes and the hash-scroll restore are unchanged.
  - **Tiles:** promo tiles never carry `.product-grid__item` or `data-product-id`.
  - Record the findings in Implementation notes.

  Files: none (unless a regression is found). Covers: plan R1–R5, AC3.2.
- [x] **T14 Template, locale sync, Theme Check, tracking (final).**
  - **Template:** edit the committed `templates/collection.json` (no `theme pull`; keep the header comment) exactly as in the plan's "Template JSON changes":
    - `collection_banner` replaces `section`
    - `main` keeps the 002 static `product-card` subtree, and gets the new settings, the filters `drawer` config and 3 promo tiles with blank media and brand words
    - add `explore_categories`
    - add `seo_text`
    - `order`: banner, main, explore_categories, seo_text

    Validate every id, option value, range and step, and every block type, against the schemas by script (as in 001/004). If `{{ closest.collection.url }}` is rejected for the button link, apply the R8 fallback.
  - **Locale sync:** copy every key added in T1 (and later) with the English text into all other `locales/*.json` and `locales/*.schema.json`, inserted after the en.default neighbour. Additions only; no 001/002/004 key may change.
  - **Theme Check:** run `shopify theme check` and fix new offences until the result is 0 errors and the 7 baseline warnings.
  - **Tracking:** update `.claude/progress.md` (005 phases and a log entry; note that 007 V1 reuses `media-with-content` + `breadcrumb`), `.claude/specs/design-map.md` (C1–C5 status; C1 base → `media-with-content` + `breadcrumb`, C5 → `section` + `read-more-text`; V1 note) and `.claude/specs/decisions.md` (A12–A14 implementation notes; metafield `custom.seo_text`).
  - **Visual checklist:** write it for the user (below).

  Files: `templates/collection.json`, `locales/*.json`, `locales/*.schema.json`, `.claude/progress.md`, `.claude/specs/design-map.md`, `.claude/specs/decisions.md`. Covers: page order, AC1.1, AC1.5, AC3.1, AC3.2, AC3.3, AC4.3, AC5.1, AC5.2, AC5.3, AC5.4, AC5.6, AC5.7, AC6.1, all (Theme Check).

## AC coverage matrix
| AC | Tasks |
|---|---|
| AC1.1 | T14 (text blocks with collection dynamic sources) |
| AC1.2 | T10, T14 |
| AC1.3 | T9, T14 |
| AC1.4 | T9, T14 |
| AC1.5 | T14 (section background colour) |
| AC1.6 | T9 |
| AC1.7 | T9 |
| AC1.8 | T9, T10 |
| AC2.1 | T8 |
| AC2.2 | T8 |
| AC2.3 | T8 (existing sorting) |
| AC2.4 | T2, T3, T8 |
| AC2.5 | T8 |
| AC2.6 | T2, T8 |
| AC2.7 | T8 (existing empty state, toolbar kept) |
| AC2.8 | T8 |
| AC2.9 | T1, T8, T14 |
| AC3.1 | T5, T7, T14 |
| AC3.2 | T13, T14 (card untouched) |
| AC3.3 | T6, T7, T14 |
| AC3.4 | T5, T6, T7 |
| AC3.5 | T6 |
| AC3.6 | T6 |
| AC3.7 | T6 |
| AC3.8 | T6, T14 |
| AC3.9 | T7 (count from `products_count`) |
| AC3.10 | T6 |
| AC4.1 | T5 |
| AC4.2 | T4, T5, T7 |
| AC4.3 | T7, T14 |
| AC4.4 | T1, T4, T5 |
| AC4.5 | T7 (existing `createURLParameters` drops `page`) |
| AC5.1 | T14 |
| AC5.2 | T11, T14 |
| AC5.3 | T14 |
| AC5.4 | T14 (existing slideshow arrows) |
| AC5.5 | T11, T14 |
| AC5.6 | T14 (existing collection-card placeholder) |
| AC5.7 | T14 |
| AC6.1 | T12, T14 |
| AC6.2 | T12 (merchant rich text) |
| AC6.3 | T12 |
| AC6.4 | T12 |
| AC6.5 | T12 |
| AC6.6 | T12 |
| AC6.7 | T12 |

## Manual visual checklist (for the user; no browser is used by the agents)
1. **Order:** banner, toolbar + chips, grid with tiles, Load more, Explore our categories, SEO text, footer.
2. **Banner:**
   - Grey text panel on the left (~40%), image on the right (~60%), about 385px tall at 1920.
   - Breadcrumb "Home / <collection>" top-left; title and description near mid-height.
   - No banner image: the collection image shows. Neither image: the text spans the full width.
   - Mobile: image first, then text.
3. **Toolbar:**
   - Count centred ("19 products", "1 product"). Sort by and Filter (n) on the right with thin dividers, and rules above and below.
   - Filter shows no "(0)" when nothing is active.
   - Mobile: count line, then a Sort | Filter two-cell bar.
4. **Drawer:**
   - Slides in from the right over a dim overlay; overlay click, × and Escape close it; focus returns to Filter.
   - Set the side to Left: it slides from the left.
   - Set Apply mode to Apply button: changes wait for Apply, and closing without Apply discards them.
5. **Chips and sorting:**
   - Chips read "× value"; clicking one removes the filter. Clear all appears with 2+ chips.
   - Sort keeps the filters and updates the URL.
   - Zero results: "No products found" with a clear link, and the toolbar stays.
6. **Promo tiles:**
   - Grid is 4 columns. Tiles sit in rows 2 (left), 4 (right) and 6 (left), with 2 products in each of those rows and no gaps.
   - The tile is as tall as the card row. Overlay: highlight box + text left, SHOP NOW right, top or bottom.
   - The whole tile is clickable. Mobile: tiles are full width at about 4:3.
   - A 2×2 tile spans two rows.
   - A tile with no image disappears on the storefront.
   - Tiles stay with an active filter. Turn "Show promo tiles while filters are active" off: they hide.
7. **Load more:**
   - A collection with more than 24 products shows a centred Load more. It appends the next 24 with a loading state and disappears at the end, and the URL shows `?page=2`.
   - Click a product on page 2, then go back: you return to the same card.
   - Switch to Infinite scroll and to numbered pages: both work.
8. **Explore our categories:** 4 portrait tiles with no peek, title + underlined "View products", round arrows at mid-image only when there are more than 4 collections (one tile per step), hover zoom, swipe with a peek on mobile, and a placeholder for a collection without an image.
9. **SEO text:**
   - 4 lines with "…" and Read more. It expands to Read less. Short text shows no button.
   - With the `custom.seo_text` metafield set on a collection, that text shows instead of the shared text.
   - Empty: no section.
10. **Regressions:** search results, cart/404 product lists, home page and the cart drawer squeeze on desktop look unchanged.
11. **Merchant content to enter:**
    - Banner images (optional)
    - Promo tile images/videos, words and links. Fill each tile's highlight and/or text (or the link label): the tile link takes its accessible name from them, so a tile with all three blank has an unnamed link.
    - Collections for Explore our categories
    - Shared SEO text, plus the metafield definition `custom.seo_text` (rich text) and per-collection values
    - Search & Discovery filters

## Implementation notes
Deviations from the plan, with the reason for each.
- T1: reuse instead of new keys — product count: `content.search_results_resource_products_count` (plural "{{ count }} product(s)"; `content.product_count` already exists as "Product count", don't change); ratios: 1:1 `t:options.square`, 3:4 `t:options.portrait_tall`, 16:9 `t:options.landscape`, 4:3 new `t:options.ratio_4_3`; text size label `t:settings.size`.
- T11: collection-list desktop_peek (reuses resource-list-carousel handling), image_hover_zoom (transform scale 1.04, reduced-motion safe), hide_when_empty (storefront only; editor keeps placeholders).
- T10: breadcrumb Home / current title (collection, product, article, blog, page; else page_title); home page shows Home only; alignment left/center select; hide via editor block visibility.
- T12: read-more-text clamps only once the custom element is defined (no-JS shows full text). Own underline CSS + [hidden]{display:none} on the toggle. Empty content hides the section on storefront via style tag; dashed box in editor. No height animation; scroll-back on collapse respects reduced motion. Padding top/bottom only.
- T9: media_height custom (desktop 10–60vw default 20, mobile 30–150vw default 75). Collection image/alt lookup lives in _media-without-appearance and passes fallback_image / alt_text_fallback to snippets/media.liquid. Alt fallback only when use_collection_image is on (so existing banners keep their alt). For 007 page banner, turn use_collection_image on to get page title alt. Text spans full width when no media block renders.
- T2/T3/T8: drawer [modal] skips squeeze and session-restore; side=start mirrored. facets.js deferred apply (markPending/applyAndClose; reset + syncSummary on close without Apply; chips/Clear all/sort still instant). drawer_side only for Drawer style (left drawer with squeeze would shift the wrong way). No grid-density controls in Drawer toolbar. Sorting from toolbar skips the grid view transition (existing dialog-form logic). Instant mode ≥990px has no See-results button; closes with ×/overlay/Esc.
- T4–T7: promo tile values for T14 — mobile_ratio "4 / 3" (default) | "1" | "3 / 4" | "16 / 9"; size "2x1"|"2x2"; side "left"|"right"; text_position "top"|"bottom"; font heading|subheading|body|accent; position 0–35; text_size 14–64. Section: grid_columns "auto"|"2"–"6"; load_trigger "scroll"|"button". Desktop tiles min-height 16rem; tile video uses background-video markup (no play buttons inside link); tiles after <4 products load eagerly; products_per_page falls back to 24; Load more hides only the button (status stays announced); tile link has no name if highlight, text and label are all blank (merchant content).
- T13: no regressions found; no files changed. Checked: `search-results`/`search.json` (product-grid without `has_promos`/`load_more_button`, no `grid_columns` → auto-fill + viewMoreNext as before; filters defaults; sorting `label` defaults to "Sort"; chips `?form=` unchanged with blank `form_id`, Clear all threshold 1 = `is_active`); `theme-drawer` users (cart-drawer, chat-drawer, buy-buttons, filters horizontal/vertical) carry no `modal`/`side` attribute, so squeeze/restore/`#isModal` behave as before; `facets.js` deferral only with `apply-mode="button"`; `paginated-list.js` `loadMore()` unused by results/blog lists; `media-with-content`/`_media`/`_media-without-appearance` render `.media-block` (placeholder included) unless the new opt-in `hide_when_empty` is on; `collection-list` blank list still shows placeholders unless `hide_when_empty`; 002 card subtree and product `li` ids/data attributes and the hash-scroll script unchanged; promo tile `li` has no `.product-grid__item`/`data-product-id`. Minor: the `viewMoreNext` span is now emitted inline (whitespace-only difference). The earlier ValidScopedCSSClass warning on `_collection-promo-tile` no longer appears.
- T14: `templates/collection.json` rebuilt from the working copy (header comment kept, 002 `product-card` subtree untouched, existing title/description `text` blocks moved into the banner group; title `type_preset` h2 → h3, description `max_width` narrow). Banner content: breadcrumb, group (title + description), 0px spacer with space-between so the title group sits between breadcrumb and bottom; `_content-without-appearance` has no padding settings, so panel padding is the section's built-in page-margin padding (plan's "≈24/40" not applicable). Main: `columns_gap_horizontal` 16 → 6. Collection card title `font_size` 0.875rem. Validated every setting id/option/range/step, block type and block_order by script. "View products" uses `{{ closest.collection.url }}` (R8 fallback not applied: Theme Check accepts it; confirm in the editor). Locale sync: 8 storefront + 37 schema keys added to every other locale (English text, inserted after the en.default neighbour; git diff shows no removed key/value, only trailing commas). Theme check 0 errors / 7 baseline warnings.
- Review fixes (D1–D7):
  - D1: tile marker is now `<!--promo:N,SIZE,SIDE-->`. With fixed `grid_columns`, main-collection renders a tile only when the products after it on the page can fill every cell up to the end of its row (2x2: both rows); the tile's row is estimated from N + cells of earlier rendered tiles, assuming earlier items pack from the grid start (a right-side tile can share a partly filled row with ≥2 free cells). `auto` columns keep the "a product follows" rule. Info `info.promo_tiles` reworded (synced to all 36 schema locales). Not covered: the shopper switching grid density (not offered in Drawer style).
  - D2: `has_promos` (dense flow class) now = Grid layout and ≥1 promo block with media (any block in the editor), on every page, so tiles prepended from page 1 lay out densely. Only main-collection passes it; search results unchanged.
  - D3: `#fetchPage` awaits inside try/finally so the waiting render always resolves. `loadMore` hides the button only when no next page remains, so after a failed fetch the button is re-enabled and stays visible for a retry (keyboard focus returned to it).
  - D4: Drawer style's instant-mode "See items" close button gets `facets__see-results--drawer` and shows at every width (like `--apply`); horizontal/vertical unchanged.
  - D6: `apply_mode` visible only for Drawer style; markup also ignores a leftover `button` value under other styles (`apply_with_button`).
  - D7: Load more wrapper drops its top padding when the button is `[hidden]` (`:has()`); the status region stays. `.is-loading:disabled` rule at higher specificity keeps opacity 1. No products-worded cutoff key exists (`content.item_count_cutoff` says "items"), so the >25,000 count is left as is.
  - D5: merchant checklist item 11 now asks for highlight/text per tile (descriptive link name).
