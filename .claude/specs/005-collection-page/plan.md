# Plan 005: Collection page

- **Status:** Approved (2026-11-19, auto mode per user; Q1–Q7 take the recommended defaults)
- **Spec:** `./spec.md` (Approved 2026-11-19; the Clarifications log overrides inline text)
- **Baseline:** `shopify theme check` reports 0 errors and 7 warnings (`sections/header.liquid` ExcessiveSettingsCount, `snippets/divider.liquid` 5x UnusedDocParam, `snippets/product-media-gallery-content.liquid` LiquidComplexity). The target is no offence beyond these.

## Summary

No new section is needed. Page order in `templates/collection.json`:

| # | Key | Section | Spec |
|---|---|---|---|
| 1 | `collection_banner` | `media-with-content` (extended) + new public `breadcrumb` block | S1 |
| 2 | `main` | `main-collection` (extended) with `filters` (new "Drawer" style) + new private `_collection-promo-tile` | S2, S3, S4 |
| 3 | `explore_categories` | `collection-list` carousel (extended) | S5 |
| 4 | `seo_text` | `section` + new public `read-more-text` block | S6 |

Every extension is opt-in. New settings default to today's output, so `search.json` (`search-results` shares `product-grid`, `filters`, `sorting`, `paginated-list.js`), `list-collections.json`, `cart.json`, `404.json`, `index.json` and the group files render as before.

### Prior art checked
- `sections/main-collection.liquid`: `enabled_on: collection` only. It renders static `filters` and static `_product-card` (002 config, kept) and loops `paginate` into `snippets/product-grid.liquid`. Today it has infinite scroll (fixed 24 per page) or numbered pages, and no "Load more".
- `assets/paginated-list.js` (base of `results-list.js` and `blog-posts-list.js`) appends only `:scope > [ref="cards[]"]` from the next page's Section Rendering response. It reads `data-page` of the first and last `cards[]` and pushes `?page=N`.
- `assets/product-card.js` scroll restore writes `?page=<li data-page>#<card link id>` only inside `results-list[infinite-scroll="true"]`. `main-collection` scrolls to the hash on load.
- `assets/utilities.js` product-grid view transition sets `view-transition-name: product-card-${dataset.productId}` on every `.product-grid__item`. A non-product item with that class would get a duplicate name `product-card-undefined` and abort the transition, so **promo tiles must not use `.product-grid__item`**.
- `snippets/product-grid.liquid` organic (editorial) layout uses `li:nth-of-type` rules. Extra `li`s break the pattern, so **tiles render only in the `grid` layout**.
- `blocks/filters.liquid` has styles `horizontal` (inline dropdowns, "More" opens `#filters-drawer`) and `vertical` (sidebar). There is no toolbar with "Filter (n)" + drawer on desktop. The `#filters-drawer` (`theme-drawer`) already holds collapsible `list-filter` / `price-filter` groups, chips, Clear all and "See n items".
- `assets/theme-drawer.js`: right side only. At ≥990px it is a non-modal "squeeze" sidebar with no overlay. Below 990px it is a modal with a backdrop. Escape, focus trap and focus return are already handled.
- `assets/facets.js`: every input change re-renders the section at once (`FacetInputsComponent.updateFilters` / `PriceFacetComponent`). Sorting submits through the closest `facets-form-component`, or the first one in the section.
- `snippets/filter-remove-buttons.liquid`: chips (`facet-remove-component` pills). Clear all shows with 1+ active filters. `removeFilter?form=` falls back to `closest('facets-form-component')`.
- `sections/media-with-content.liquid`: full-width + `media_position: right` + `media_width: wide` gives content 2.5fr / media 3.5fr (41.7/58.3, which is the spec's ≈40/60). On mobile the media stacks first. Height options are only svh presets. The media block always renders a placeholder, and there is no collection-image fallback.
- `sections/collection-list.liquid` carousel + `_collection-card` (whole-card link, `_collection-card-image` ratio `portrait` = 4:5, children `collection-title` / `button`) + `resource-list-carousel` (004 added nil-safe `desktop_peek`; disabled arrows hidden; arrows on media). Blank `collection_list` renders placeholder cards on the storefront too.
- Collapsible text: `show-more.js` is item-based (hidden list items) and does not clamp lines. `content.read_more` is a blog link ("Read more..."). There is no line-clamp read-more.
- 004 patterns reused: `type_preset: section-heading` (S5 heading), `button` `link_underline` (S5 "View products"), carousel `image_hover_zoom` CSS (copied to collection-list), reduced-motion handling.

## Decision table
Reuse ladder: 1 Configure → 2 Extend → 3 New block in existing section → 4 New section

| Spec section / AC | Ladder step | Existing base | Files to create/modify | Justification (why not a lower step) |
|---|---|---|---|---|
| Page order S1–S6, S5/S6 hide/reorder (AC5.7) | 1 Configure | template JSON | `templates/collection.json` | Order is template data. S5 and S6 are separate sections, so the merchant can hide, remove or reorder them. |
| S1 split banner: layout, split ≈40/60, image right, mobile stack image-first, panel background (AC1.3, AC1.5, AC1.6) | 1 Configure | `media-with-content` (`section_width: full-width`, `media_position: right`, `media_width: wide`, `background_color`) | `templates/collection.json` | The existing layout gives a 2.5fr/3.5fr split and stacks media first on mobile. Horizon 4.5 has no colour schemes: "colour scheme" = the section `background_color` (default `#F2F2F2`, B2), which the merchant can change. |
| S1 banner height ≈385px at 1920 (≈20vw), mobile ≈4:3 | 2 Extend | `media_height` select (svh presets) | `sections/media-with-content.liquid` | Presets cannot reach 385px. Add a `custom` option + `media_height_custom` (vw) and `media_height_custom_mobile` (vw). Default stays `80svh`. |
| S1 image fallback: banner image → collection featured image → no image, so the text spans full width (AC1.4); alt = image alt else collection title (AC1.7) | 2 Extend | `_media-without-appearance` + `snippets/media.liquid` | `blocks/_media-without-appearance.liquid`, `snippets/media.liquid`, `sections/media-with-content.liquid` (CSS) | The block has no collection fallback and always renders a placeholder. New opt-in `use_collection_image` and `hide_when_empty` (both default false = today). The section CSS uses `:not(:has(.media-block))` to collapse to one content column. Today that never matches, because the placeholder always renders. |
| S1 title + description from the collection, formatted, no gap when empty (AC1.1) | 1 Configure | `text` blocks with `{{ closest.collection.title }}` / `{{ closest.collection.description }}` (already in today's `collection.json`) | `templates/collection.json` | `snippets/text.liquid` renders nothing when the resolved text is blank. The description uses `rte`, so links and bold render. |
| S1 breadcrumb "Home / <title>", hideable (AC1.2) | 3 New public block | none (no breadcrumb anywhere in the theme) | **new** `blocks/breadcrumb.liquid` | No breadcrumb exists. A public block can go in any `@theme` container (banner content now, 006/007 later). The merchant hides it with the editor's block visibility toggle, or removes it. |
| S1 reusable for 007 V1 without a collection (AC1.8) | — | same section | — | Title and description are plain `text` settings (the merchant types copy on a page). The breadcrumb falls back to the page title. The collection-image fallback is a no-op without a collection. |
| S2 toolbar: count centred, "Sort by" + "Filter (n)" right with dividers, top/bottom rules; mobile two-cell bar + count line (AC2.2) | 2 Extend | `filters` block `filter_style` | `blocks/filters.liquid`, **new** `snippets/facets-toolbar.liquid`, `snippets/sorting.liquid` (optional `label` param) | Neither existing style has a desktop "Filter (n)" + drawer toolbar. New option `filter_style: drawer`. The markup goes in a snippet, so `filters.liquid` grows little. `horizontal`/`vertical` output stays the same. |
| S2 count with product/products wording, toggle (AC2.1, AC2.8) | 2 Extend | count markup uses `content.item_count` ("items") | `blocks/filters.liquid`, `snippets/facets-toolbar.liquid` | New `show_product_count` (default true = today, applies to all styles). The Drawer style uses the new key `content.product_count`. Other styles keep `item_count`. |
| S2 sorting via Shopify options, keeps filters, URL (AC2.3) | 1 Configure (+ snippet param) | `sorting` snippet + `SortingFilterComponent` | `snippets/facets-toolbar.liquid` | The toolbar sort radios use `form="FacetFiltersForm--{section}-overflow"` (the drawer form), so FormData carries the active filters. With filtering disabled, the toolbar wraps its own `facets-form-component` (`-toolbar` form). `createURLParameters` already drops `page` (AC4.5). |
| S2 drawer from right (default) or left, overlay, overlay click / close / Escape, focus trap and return (AC2.4, AC2.6) | 2 Extend | `theme-drawer` (right only; non-modal squeeze ≥990px) | `assets/theme-drawer.js`, `snippets/theme-drawer-styles.liquid`, `snippets/theme-drawer.liquid` (squeeze script) | Opt-in attributes: `modal` (always `showModal()` + backdrop, never squeezes) and `side="start"`. Without them, cart, chat, buy-buttons and the existing filter drawer behave as today. Writing a second drawer would duplicate focus and scroll-lock logic. |
| S2 apply instantly (default) or with an Apply button | 2 Extend | `facets.js` | `assets/facets.js`, `blocks/filters.liquid` | New `apply_mode` setting (default `instant` = today). With `button`, drawer inputs only mark the form pending. "Apply" submits and closes. Closing without Apply resets the form. |
| S2 chips "× value", Clear all at 2+ (AC2.5) | 2 Extend | `filter-remove-buttons` | `snippets/filter-remove-buttons.liquid` | New optional params `form_id` (chips outside any form) and `clear_all_min` (default 1 = today). The "×"-first order is CSS scoped to `.facets-toolbar`. |
| S2 "Filter (n)", n hidden at 0 (AC2.4) | 2 Extend | `total_active_values` in `filters.liquid` | `snippets/facets-toolbar.liquid` | Label `actions.filter_with_count` when n>0, else `actions.show_filters` ("Filter"). Morph updates it after each render. |
| S2 zero results (AC2.7) | 1 Configure | `product-grid` empty state (`content.no_products_found` + `use_fewer_filters_html` clear link) | — | Already present. The toolbar and chips sit in the filters block, which still renders. |
| S2 labels translatable (AC2.9) | — | locales | `locales/en.default.json` | New keys below. "Clear all" and "Remove" are reused. |
| S3 4 desktop columns / 2 mobile (AC3.1) | 2 Extend | `product_card_size` (auto-fill, width-dependent) | `sections/main-collection.liquid`, `snippets/product-grid.liquid` | Auto-fill cannot guarantee exactly 4 columns, and promo spans need fixed tracks. New `grid_columns` select, default `auto` = today. `product-grid` reads it nil-safe, so `search-results` is unchanged. Mobile keeps `mobile_product_card_size: small` (2). |
| S3 standard 002 card unchanged (AC3.2) | 1 Configure | static `_product-card` in `collection.json` | — | Not touched. |
| S3 promo tiles: add/remove/reorder; image or video; highlight + rest; label; URL; position; side; top/bottom; 2×1 or 2×2; colours/font (AC3.3, AC3.5, AC3.8) | 3 New private block in existing section | `main-collection` (no `blocks` key today) | **new** `blocks/_collection-promo-tile.liquid`, `sections/main-collection.liquid` | The tile must sit inside the grid `ul`, between product `li`s, and react to filters/pagination in the same Section Rendering response. A separate section cannot do that. Private, because it only makes sense in this grid. |
| S3 placement, flow, no gaps or duplicates, 2-col span desktop, full width mobile (AC3.4, AC3.10) | 3 + 2 | CSS grid | `blocks/_collection-promo-tile.liquid` (CSS), `snippets/product-grid.liquid` (`has_promos` → class) | See "Promo tile placement" below. `grid-auto-flow: row dense` only when tiles render. |
| S3 whole tile is one link named by the title (AC3.6) | 3 | — | `blocks/_collection-promo-tile.liquid` | `<a>` wraps the tile; `aria-label` = highlight + text (fallback: link label). The media is decorative (`alt=""`). |
| S3 no image → nothing on the storefront, placeholder in the editor (AC3.7) | 3 | — | `blocks/_collection-promo-tile.liquid` | The block outputs nothing when its media is blank and `request.design_mode` is false. |
| S3 count excludes tiles (AC3.9) | — | `collection.products_count` | — | The count never reads the grid. |
| S3 out-of-range tiles hidden; page 1 only; hidden while filtering (setting); hidden in empty collection | 3 | — | `sections/main-collection.liquid` | Liquid rules: `paginate.current_page == 1`, `position < collection.products.size`, `layout_type == 'grid'`, and (`show_promos_when_filtered` or no active filters). The empty state branch renders no list. |
| S4 Load more (default) / infinite scroll / numbered, per-page, keeps sort and filters, loading state, hides at end, URL page (AC4.1–AC4.5) | 2 Extend | `enable_infinite_scroll` + `paginated-list.js` | `sections/main-collection.liquid`, `snippets/product-grid.liquid`, `assets/paginated-list.js` | No Load more exists. Keep the checkbox (relabelled "Load more products without page reload"; off = numbered pages, which is today's off state). Add `load_trigger` `scroll` (default = today) / `button`. `products_per_page` now applies in every mode (default 24 = today's fixed 24). `PaginatedList.loadMore()` reuses the private `#renderNextPage`, so it must live in `paginated-list.js`. `infinite-scroll="true"` stays for both append modes, which keeps the 002 scroll restore. |
| S5 heading (section-heading style), ordered collections, "View products", 4-up portrait, overlay arrows only on overflow, step one tile, swipe + peek on mobile, placeholder image (AC5.1–AC5.6) | 1 Configure | `collection-list` carousel + `_collection-card` (`collection-title` + `button` children) | `templates/collection.json` | Collection title, image and URL are automatic. `image_ratio: portrait` (4:5, B3). `icons_shape: circle`. Disabled arrows are hidden (existing). One tile per step is the slideshow default. `mobile_card_size: 60cqw` gives ≈1.6 tiles. |
| S5 no desktop peek, hover zoom, hidden when no collections | 2 Extend | `collection-list` | `sections/collection-list.liquid` | Add `desktop_peek` (default true; `resource-list-carousel` already reads it), `image_hover_zoom` (default false, same CSS as 004 carousel), `hide_when_empty` (default false: blank list + storefront → render nothing). |
| S5 per-collection image override (`[ASSUMPTION]`, no AC) | Not built | — | — | See Q1. |
| S6 metafield per collection else shared rich text, 4 lines + Read more/Read less, `aria-expanded`, full markup indexed, hidden when short, section empty → nothing (AC6.1–AC6.7) | 3 New public block in `section` | `section` + `text` | **new** `blocks/read-more-text.liquid`, **new** `assets/read-more.js` | A `text` block cannot choose metafield-else-fallback or clamp lines. `show-more.js` is item-based. A public block keeps it reusable on 006/007. Links and " \| " separators are merchant rich text (clarification). |

### Promo tile placement
- **Position semantics:** the setting `position` means "show after product number N" (range 0–35, default 4). DOM order = the visual reading order, and the count is independent of the column count, so it works on desktop (4) and mobile (2).
- **Side:** `left` → `grid-column: 1 / span 2`; `right` → `grid-column: span 2 / -1` (≥750px). **Size:** `2x1` → 1 row; `2x2` → `grid-row: span 2`. On mobile, every tile is `grid-column: 1 / -1`, with height from `mobile_ratio`.
- **Flow:** when at least one tile renders, the grid `ul` gets `product-grid--has-promos` → `grid-auto-flow: row dense`. Products are placed in DOM order. A tile with a definite column takes the first row where its two columns are free. Later products backfill only the holes left beside a tile. Products never jump before an earlier product, and there are no gaps or duplicates. Worked example from the mockup (4 cols, 19 products): tiles after 4 (left), 12 (right) and 16 (left) land in rows 2, 4 and 6. Each of those rows holds 2 products, and the 19th product sits alone, left-aligned, in row 7.
- **Height:** a 2×1 tile has no intrinsic height (media absolutely positioned, cover). It takes the row height of the cards beside it. It renders only when product N+1 exists on the page, so there is always a card in its row.
- **Hidden under** `[product-grid-view='zoom-out']`, which is only reachable if grid density is turned on.
- **Markup contract (pagination-safe):** `<li class="product-grid__promo …" data-page="{{ paginate.current_page }}" ref="cards[]" {{ block.shopify_attributes }}>`. The tile keeps `ref="cards[]"` and `data-page`, so `PaginatedList` treats it like a card. When a shopper lands on `?page=2` and scrolls up, the prepended page 1 includes its tiles. First/last `data-page` reads stay correct. It has **no** `.product-grid__item` class and **no** `data-product-id` (view-transition safety). Page 2+ responses contain no tiles, so appended batches never repeat them.
- **Interleaving:** `content_for 'blocks'` must live in the section and renders all blocks at once. The section captures it once. Each tile outputs `<!--promo:{{ position }}-->` followed by its `li`. The section splits on `<!--promo:` and parses the leading `N-->`. In the product loop it echoes the chunks whose N equals `forloop.index0` (products already output). Ties keep block order. Blocks that output nothing produce no chunk.

## Schema changes
All labels/info/options use `t:` keys (see Locale keys). "(reuse)" = the key already exists.

### `sections/main-collection.liquid`
- Add `"blocks": [{ "type": "_collection-promo-tile" }]`. Static `filters` and `_product-card` do not need to be listed (same as `product-list` / `search-results`).
- Settings:

| id | type | options / range | default | visible_if / note |
|---|---|---|---|---|
| `grid_columns` | select | `auto` (`t:options.auto` reuse), `2` (`two_number` reuse), `3`, `4`, `5`, `6` (`three_number`…`six_number`) | `auto` | `layout_type == 'grid'`. Label `t:settings.columns` (reuse). `product_card_size` gains `and grid_columns == 'auto'` in its visible_if. |
| `enable_infinite_scroll` | checkbox (existing) | — | true (unchanged) | Label changes to `t:settings.load_products_without_reload`. Info `t:info.pagination_numbered_when_off`. |
| `load_trigger` | select | `scroll` (`t:options.on_scroll`), `button` (`t:options.load_more_button`) | `scroll` | `enable_infinite_scroll` |
| `products_per_page` | range 8–36 step 4 (existing) | — | 24 | Remove its visible_if. The Liquid uses it in all modes. |
| (header) | header | `t:content.promo_tiles` | — | |
| `show_promos_when_filtered` | checkbox | — | true | Info `t:info.promo_tiles` |

- Markup: compute `filters_active` (same rules as `filters.liquid`: list `active_values.size > 0`, price `min_value.value`/`max_value.value != null`, boolean). Compute `show_promos`. When true, capture `content_for 'blocks'` inside `paginate` and interleave as above. Pass `has_promos` (true when at least one chunk was echoed), `load_more_button: enable_infinite_scroll and load_trigger == 'button'` and `section` to `product-grid`. Keep the `<li>` product markup and the hash-scroll script byte-identical. Keep LiquidComplexity under the threshold. If it trips, move the filter-active calculation into a small snippet (`snippets/filters-active.liquid` returning via capture).

### `snippets/product-grid.liquid`
- New optional params (document them in `{% doc %}`): `has_promos` (boolean, default false) → adds `product-grid--has-promos` to the `ul`; `load_more_button` (boolean, default false).
- Grid style: in the `'grid'` case, if `section.settings.grid_columns != blank and section.settings.grid_columns != 'auto'`, emit `--product-grid-columns-desktop: repeat(N, minmax(0, 1fr))` and skip the large/extra-large `@container` rule. Otherwise output exactly as today.
- CSS: `.product-grid--has-promos { grid-auto-flow: row dense; }`.
- When `load_more_button` is true (only possible with infinite scroll on), replace `<span ref="viewMoreNext">` with:
  ```
  {% if paginate.next %}
  <div class="product-grid__load-more">
    <button type="button" class="button button-secondary product-grid__load-more-button" ref="loadMoreButton" on:click="/loadMore">
      <span class="product-grid__load-more-label">{{ 'actions.load_more' | t }}</span>
      <span class="product-grid__load-more-loading" aria-hidden="true"><!-- spinner --></span>
    </button>
    <span class="visually-hidden" role="status" ref="loadMoreStatus"></span>
  </div>
  {% endif %}
  ```
  `viewMorePrevious` stays. The button is centred, at least 44px tall, and the theme focus style is kept.

### `blocks/_collection-promo-tile.liquid` (new, private)
`{% doc %}` explains the output contract. `"tag": null`, name `t:names.collection_promo_tile`.

| id | type | default | notes |
|---|---|---|---|
| `media_type` | select `image`/`video` (reuse options) | `image` | label `t:settings.media_type` (reuse) |
| `image` | image_picker | — | visible_if image |
| `video` | video | — | visible_if video. `render 'video'` with autoplay, loop, muted, no controls, `video_preview_image: video.preview_image`. Under `prefers-reduced-motion: reduce`, CSS hides the `<video>` and shows the poster image instead (unless the `video` snippet already handles reduced motion). |
| `highlight_text` | text | — | label `t:settings.highlight_text` |
| `text` | text | — | label `t:settings.text` (reuse) |
| `link_label` | text | — | label `t:settings.link_label` |
| `link` | url | — | reuse |
| `position` | range 0–35 step 1 | 4 | label `t:settings.show_after_product` |
| `size` | select `2x1` (`t:options.size_2x1`), `2x2` (`t:options.size_2x2`) | `2x1` | label `t:settings.size` (reuse) |
| `side` | select `left`/`right` (reuse options) | `left` | label `t:settings.side` |
| `text_position` | select `top`/`bottom` (reuse options) | `top` | label `t:settings.text_position` |
| `mobile_ratio` | select `4/3`, `1`, `3/4`, `16/9` (`t:options.ratio_4_3`, `ratio_1_1`, `ratio_3_4`, `ratio_16_9`) | `4/3` | label `t:settings.mobile_aspect_ratio` |
| (header) | `t:content.typography` (reuse if present, else `t:content.text`) | | |
| `font` | select `heading`/`subheading`/`body`/`accent` (reuse options) | `body` | emits `--font-<x>--family/style/weight` like the 004 roles |
| `text_size` | range 14–64 step 1 px | 28 | mobile: `clamp(14px, 4.5vw, <size>)`. Label `t:settings.text_size` |
| `text_color` | color | `#FFFFFF` | reuse label |
| `highlight_color` | color | `#A8A24E` | estimated muted olive (B2), editable |
| `highlight_text_color` | color | `#FFFFFF` | |

Output: nothing when `media blank and not request.design_mode`. Otherwise `<!--promo:{{ position }}-->` + `<li class="product-grid__promo product-grid__promo--{{ side }} product-grid__promo--{{ size }} product-grid__promo--text-{{ text_position }}" data-page="1" ref="cards[]" style="--promo-mobile-ratio: …; …" {{ block.shopify_attributes }}>`. `data-page` is hard-coded to 1 because the section only renders tiles on page 1. Inside: `<a class="promo-tile" href aria-label>` (a `div` when there is no link), the media layer (`image_tag` with `sizes="(min-width: 750px) 50vw, 100vw"`, `alt=""`, cover) or video, and the overlay row: `<span class="promo-tile__title"><span class="promo-tile__highlight">{{ highlight }}</span> {{ text }}</span><span class="promo-tile__cta">{{ link_label }}</span>` (`justify-content: space-between`, `align-self: start|end`). Hover: image scale 1.03 + CTA underline, off under reduced motion; `cursor: pointer`. Focus-visible outline on the link. Editor placeholder: `placeholder_svg_tag` in the same box.

### `blocks/filters.liquid`
| id | change | default | visible_if |
|---|---|---|---|
| `filter_style` | add option `drawer` (`t:options.drawer` reuse) | `horizontal` (unchanged) | unchanged |
| `filter_width` | visible_if also when `filter_style == 'drawer'` | — | |
| `show_product_count` | new checkbox, label `t:settings.show_product_count` | true | — |
| `drawer_side` | new select `right` / `left` (reuse options) | `right` | `enable_filtering` |
| `apply_mode` | new select `instant` (`t:options.apply_instantly`) / `button` (`t:options.apply_button`) | `instant` | `enable_filtering` |

Markup:
- `filter_style == 'drawer'`: render `facets-toolbar` instead of the horizontal/vertical wrapper and the mobile `facets-toggle`. Pass results, filters, products_count, total_active_values (computed in the top `liquid` block, already there), sort_by, results_url, block, section_id, and the form id.
- The existing count markup gets `{% if block_settings.show_product_count %}`.
- `<theme-drawer id="filters-drawer">`: add `side="start"` when `drawer_side == 'left'`. Add `modal` only when `filter_style == 'drawer'`, so horizontal/vertical keep today's squeeze. On the drawer's `facets-form-component` add `apply-mode="button"` when `apply_mode == 'button'`.
- Drawer style: skip the `sorting` render inside the drawer (the toolbar owns sort; this avoids duplicate `sort_by` values in FormData).
- Drawer actions: with `apply_mode == 'button'`, the primary button becomes `{{ 'actions.apply' | t }}` with `on:click="#{{ form_component }}/applyAndClose"`. Otherwise "See n items" as today.

### `snippets/facets-toolbar.liquid` (new)
`{% doc %}` params: `results`, `filters`, `products_count`, `total_active_values`, `sort_by`, `results_url`, `block_settings`, `section_id`, `form_id`. Markup: `<div class="facets-toolbar" style="--grid-column--desktop: var(--{{ filter_width }})">`:
- Row: 3-column grid `1fr auto 1fr`. Count in column 2 (`role="status"`, `content.product_count` / cutoff). Controls cell in column 3, `justify-content: end`, each control with `border-inline-start: 1px solid var(--color-border)`. Sorting: `render 'sorting'` with `suffix: 'overflow'` when filtering is on, else `'toolbar'`, `should_use_select_on_mobile: false`, `label: 'actions.sort_by' | t`. Filter button: `button-unstyled`, `on:click="#filters-drawer/open"`, `aria-haspopup="dialog"`, `aria-controls="filters-drawer"`, text = `actions.filter_with_count` (n>0) or `actions.show_filters`.
- `border-block: 1px solid var(--color-border)`. Mobile (<750px): count on its own centred line above; Sort | Filter as two equal half-width cells with a vertical divider, each at least 44px.
- When filtering is disabled and sorting is enabled: wrap the row in `<facets-form-component section-id … id="FacetFiltersFormComponent--{id}-toolbar"><form id="FacetFiltersForm--{id}-toolbar" ref="facetsForm">…</form></facets-form-component>`, with the same data attributes as the existing forms.
- Chips row below: `render 'filter-remove-buttons', filters, results_url, show_filter_label: block_settings.show_filter_label, should_show_clear_all: true, form_id: form_id, clear_all_min: 2`. Left-aligned with the grid. CSS scoped `.facets-toolbar .facets-remove__pill .svg-wrapper { order: -1 }` gives "× value", as outlined pills.

### `snippets/sorting.liquid`
New optional `label` param (string). Default `'actions.sort' | t` (unchanged). Used in both label spots.

### `snippets/filter-remove-buttons.liquid`
New optional params `form_id` (string, default blank → today's `?form=`) and `clear_all_min` (number, default 1). Count active chips in the existing loop (`active_count`). Clear all shows when `should_show_clear_all and active_count >= clear_all_min`. Update `{% doc %}`.

### `assets/theme-drawer.js`, `snippets/theme-drawer-styles.liquid`, `snippets/theme-drawer.liquid`
- JS: private getter `#isModal` = `this.hasAttribute('modal') || this.#modalQuery.matches`. It replaces every `this.#modalQuery.matches` read (`#onRestore`, `open`, `#bringToFront`, `#closeDialog`). `#onModalBreakpointChange` returns early when `hasAttribute('modal')`. Update the class JSDoc.
- CSS: `theme-drawer[side='start'] .theme-drawer__dialog` anchors with `inset-inline-start` (closed: `calc(-1 * width)`, open: 0), `border-inline-end` instead of start, mirrored safe-area padding, and its own opening/closing keyframes (`drawer-slide-in-start` / `drawer-slide-out-start`). Nothing changes without the attribute.
- Squeeze script: ignore `theme-drawer:open` events whose `event.target` has `modal`. Use `theme-drawer[open]:not([modal])` in the close and breakpoint handlers.

### `assets/facets.js`
- `FacetsFormComponent`: `get deferApply()` → `this.getAttribute('apply-mode') === 'button'`. `#pending` flag. Public `markPending()`. `applyAndClose()` calls `this.updateFilters()` when pending (else just closes), then `document.getElementById('filters-drawer')?.close()`. On `connectedCallback`, when `deferApply`, listen for `theme-drawer:close` on the closest `theme-drawer`: if pending, `this.refs.facetsForm.reset()`, clear the pending flag and call `clearSummary`/re-sync summaries where available. Remove the listener in `disconnectedCallback`.
- `FacetInputsComponent.updateFilters` and `PriceFacetComponent.updatePriceFilterAndResults`: if the closest form has `deferApply`, call `markPending()` and update the local summary, without submitting. `FacetRemoveComponent` (chips, Clear all) and sorting always apply at once.

### `assets/paginated-list.js`
- New public `async loadMore()` (bound via `on:click="/loadMore"`): reads `this.refs.loadMoreButton`, sets `aria-busy="true"` + `disabled` + class `is-loading`, and remembers the current last card. Awaits `this.#renderNextPage()`, then clears the busy state. Hides the button's wrapper when the next page is beyond `grid.dataset.lastPage`. Writes the translated status text from `data-loaded-text` on the button into `loadMoreStatus` (key `content.products_loaded`). If the button had keyboard focus, moves focus to the first newly added card's first link (`preventScroll: false`).
- `#renderNextPage` returns its promise. It already resolves when nothing is rendered, so `loadMore` resets the busy state in `finally`.
- Typedef `Refs` gains `loadMoreButton?: HTMLButtonElement` and `loadMoreStatus?: HTMLElement`.
- `#observeViewMore` is unchanged: no `viewMoreNext` exists in button mode, so nothing auto-loads below. `viewMorePrevious` still prepends.
- `#handleFilterUpdate` is unchanged. The morph re-renders the button for page 1 of the new result.

### `sections/media-with-content.liquid`
| id | change | default | visible_if |
|---|---|---|---|
| `media_height` | add option `custom` (`t:options.custom` reuse) | `80svh` (unchanged) | — |
| `media_height_custom` | range 10–60 step 1 `vw`, label `t:settings.desktop_height` (reuse) | 20 | `media_height == 'custom'` |
| `media_height_custom_mobile` | range 30–150 step 5 `vw`, label `t:settings.mobile_height` (reuse) | 75 | `media_height == 'custom'` |

In the existing `case`, `custom` emits `--media-height: {{ d }}vw; --media-height-mobile: {{ m }}vw;`. CSS: `.media-with-content:not(:has(.media-block))` → `--media-with-content-grid-columns: var(--full-page-grid-with-margins)` for page width / `1fr` for full width, with `grid-template-areas` content-only on all breakpoints.

### `blocks/_media-without-appearance.liquid` + `snippets/media.liquid`
| id | type | default | visible_if |
|---|---|---|---|
| `use_collection_image` | checkbox, `t:settings.use_collection_image` | false | `media_type == 'image'` |
| `hide_when_empty` | checkbox (reuse label) | false | `media_type == 'image'` |

`media.liquid`: `image = block_settings.image`. If blank and `use_collection_image`: `closest.collection.featured_image`, else the global `collection.featured_image`. If still blank and `hide_when_empty` and not `request.design_mode`: output nothing (no `.media-block` wrapper). Pass `alt_text_fallback: closest.collection.title | default: page.title` to `image`. Document the block settings in `{% doc %}`. The `_media` block has no such settings, so it is unchanged.

### `blocks/breadcrumb.liquid` (new, public)
Settings: `separator` (text, default `/`, label `t:settings.separator`), `alignment` (left/center, reuse), `text_size` select `xs`/`sm`/`md` → `var(--font-size--xs|sm|md)` (default `xs`), `padding` group like `text`. Markup: `<nav aria-label="{{ 'accessibility.breadcrumb' | t }}" class="breadcrumb" {{ block.shopify_attributes }}><ol>`. Home link (`routes.root_url`, `content.breadcrumb_home`), separators `aria-hidden`, then the current item (`aria-current="page"`, not linked): `collection.title` | `product.title` | `article.title` | `blog.title` | `page.title`, picked by `request.page_type`. Link hover uses the theme link hover. Preset `t:names.breadcrumb`.

### `sections/collection-list.liquid`
| id | type | default | visible_if |
|---|---|---|---|
| `desktop_peek` | checkbox (reuse label) | true | `layout_type == 'carousel'` |
| `image_hover_zoom` | checkbox (reuse label) | false | — |
| `hide_when_empty` | checkbox (reuse label) | false | — (info `t:info.collection_list_hide_when_empty`) |

`hide_when_empty and collection_list == blank and request.design_mode == false` → render nothing (the section wrapper outputs no padding block). Hover zoom: class `section-resource-list--hover-zoom`; `.collection-card:is(:hover, :focus-within) img { scale: 1.04 }` inside the existing overflow-hidden image wrapper, transitions off under reduced motion.

### `blocks/read-more-text.liquid` (new, public) + `assets/read-more.js` (new)
Settings: `text` (richtext, shared fallback, label `t:settings.text` reuse), `use_collection_metafield` (checkbox, default true, info `t:info.seo_text_metafield`), `collapsed_lines` (range 2–12, default 4), `text_size` (select `xs`/`sm`/`md`, default `sm`), `alignment` (left/center), padding. Source: `closest.collection.metafields.custom.seo_text` (type rich text → `| metafield_tag`; multi-line text → `| newline_to_br`) when it is set and the setting is on, else `text`. Empty content: on the storefront output `{% style %}#shopify-section-{{ section.id }}{display:none}{% endstyle %}` and nothing else (AC6.7). In the editor show an info placeholder. Markup:
```
<read-more-text class="read-more-text" style="--collapsed-lines: N" {{ block.shopify_attributes }}>
  <div id="ReadMore-{{ block.id }}" class="read-more-text__content rte" ref="content" data-collapsed>…full content…</div>
  <button type="button" class="button-unstyled button-unstyled--underline read-more-text__toggle" ref="toggle"
          aria-expanded="false" aria-controls="ReadMore-{{ block.id }}" on:click="/toggle" hidden
          data-label-more="{{ 'actions.read_more' | t }}" data-label-less="{{ 'actions.read_less' | t }}">{{ 'actions.read_more' | t }}</button>
</read-more-text>
<script type="module" src="{{ 'read-more.js' | asset_url }}" fetchpriority="low"></script>
```
CSS: `[data-collapsed]` → `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: var(--collapsed-lines); overflow: hidden; max-height: calc(var(--collapsed-lines) * 1lh)`. The max-height covers multi-paragraph content. Paragraph margins inside are set to 0.
JS `ReadMoreText extends Component`: refs `content`, `toggle` (`requiredRefs` both). `connectedCallback` sets up a ResizeObserver on `content` and runs `#measure()`: while collapsed, `toggle.hidden = content.scrollHeight <= content.clientHeight + 1`. `toggle()` flips `data-collapsed`, `aria-expanded` and the label. Disconnect cleans up. No events, no import map entry.

## Locale keys
`en.default.schema.json` (new; everything else reuses existing keys as marked above):

| Group | Key | English |
|---|---|---|
| names | `breadcrumb` | Breadcrumb |
| names | `collection_promo_tile` | Promo tile |
| names | `read_more_text` | Collapsible text |
| content | `promo_tiles` | Promo tiles |
| options | `three_number` / `four_number` / `five_number` / `six_number` | 3 / 4 / 5 / 6 |
| options | `on_scroll` | Automatically on scroll |
| options | `load_more_button` | "Load more" button |
| options | `apply_instantly` | Instantly |
| options | `apply_button` | With an Apply button |
| options | `size_2x1` | 2 columns × 1 row |
| options | `size_2x2` | 2 columns × 2 rows |
| options | `ratio_4_3` / `ratio_1_1` / `ratio_3_4` / `ratio_16_9` | 4:3 / 1:1 / 3:4 / 16:9 (only if no equivalent keys exist; builder checks with a grep first) |
| settings | `load_products_without_reload` | Load more products without page reload |
| settings | `load_trigger` | Load more products |
| settings | `show_promos_when_filtered` | Show promo tiles while filters are active |
| settings | `show_product_count` | Show product count |
| settings | `drawer_side` | Filter drawer side |
| settings | `apply_mode` | Apply filters |
| settings | `use_collection_image` | Use collection image when empty |
| settings | `separator` | Separator |
| settings | `highlight_text` | Highlighted text |
| settings | `link_label` | Link label |
| settings | `show_after_product` | Show after product number |
| settings | `side` | Side |
| settings | `text_position` | Text position |
| settings | `mobile_aspect_ratio` | Mobile aspect ratio |
| settings | `text_size` | Text size (only if missing) |
| settings | `highlight_color` | Highlight color |
| settings | `highlight_text_color` | Highlight text color |
| settings | `collapsed_lines` | Lines shown before "Read more" |
| settings | `use_collection_metafield` | Use the collection's SEO text when set |
| info | `pagination_numbered_when_off` | When off, numbered pages are shown. |
| info | `promo_tiles` | Promo tiles show in the Grid layout on the first page only. A tile is hidden when no product follows its position. |
| info | `collection_list_hide_when_empty` | Hides the section on the storefront when no collections are selected. |
| info | `seo_text_metafield` | Reads the collection metafield custom.seo_text (rich text). Leave the text below as the fallback for collections without it. |

`en.default.json` (new):

| Group | Key | English |
|---|---|---|
| actions | `sort_by` | Sort by |
| actions | `filter_with_count` | Filter ({{ count }}) |
| actions | `load_more` | Load more |
| actions | `read_more` | Read more |
| actions | `read_less` | Read less |
| content | `product_count` | `{ one: "{{ count }} product", other: "{{ count }} products" }` |
| content | `products_loaded` | More products loaded |
| content | `breadcrumb_home` | Home |
| accessibility | `breadcrumb` | Breadcrumb |

Reused: `actions.show_filters` (Filter), `actions.clear_all`, `actions.remove`, `actions.apply`, `actions.close`, `content.item_count_cutoff`, `content.no_products_found`, `content.use_fewer_filters_html`, `content.pagination.*`, `accessibility.filter_count`. Locale-sync rule: at the end, copy every new key with English text into all other `locales/*.json` / `*.schema.json` (additions only).

## JavaScript
| File | Change | Components / refs | Events |
|---|---|---|---|
| `assets/paginated-list.js` | modified | `loadMore()`; refs `loadMoreButton`, `loadMoreStatus` | Uses the existing `StandardEvents.collectionUpdate`/`searchUpdate` reset. `history.pushState` for `?page=` (existing). |
| `assets/facets.js` | modified | `FacetsFormComponent.markPending/applyAndClose`, `apply-mode` attribute | Listens to `theme-drawer:close` (`DrawerCloseEvent`) on its drawer. Still dispatches `CollectionUpdateEvent`/`SearchUpdateEvent` unchanged. |
| `assets/theme-drawer.js` | modified | `modal`, `side` attributes | `DrawerOpenEvent`/`DrawerCloseEvent` unchanged |
| `assets/read-more.js` | **new** | `read-more-text` (refs `content`, `toggle`) | none |

No import-map entries (nothing imports the new module). Not touched: `component.js`, `morph.js`, `section-renderer.js`, `utilities.js`, `base.css`, `results-list.js`, `product-card.js`.

## Template JSON changes
`templates/collection.json` (edit the committed file; no `theme pull`; keep the header comment). `order`: `collection_banner`, `main`, `explore_categories`, `seo_text`.

1. **Replace** `section` (the heading) with `collection_banner` / `media-with-content`, name "Collection banner": `media_position: right`, `media_width: wide`, `media_height: custom` (20 / 75), `section_width: full-width`, `background_color: "#F2F2F2"`, padding 0/0.
   - Static `media` (`_media-without-appearance`): `media_type: image`, image blank, `use_collection_image: true`, `hide_when_empty: true`, `image_position: cover`.
   - Static `content` (`_content-without-appearance`): `vertical_alignment_flex_direction_column: space-between`, padding ≈ 24/40 (visual check). Children: `breadcrumb` (separator "/", size xs); `group` (column, gap 12) holding `text` title (`<h1>{{ closest.collection.title }}</h1>`, `type_preset: h3`) and `text` description (`{{ closest.collection.description }}`, `rte`, `max_width: narrow`); `spacer` so the title group sits at mid-height.
2. **`main`**: keep both static blocks and the 002 `product-card` subtree **unchanged**.
   - Section settings: add `grid_columns: "4"`, `enable_infinite_scroll: true`, `load_trigger: "button"`, `products_per_page: 24`, `show_promos_when_filtered: true`, `columns_gap_horizontal: 6`, `columns_gap_vertical: 24` (mockup gap ~4–6px).
   - `filters`: `filter_style: "drawer"`, `enable_filtering: true`, `enable_sorting: true`, `enable_grid_density: false`, `show_product_count: true`, `drawer_side: "right"`, `apply_mode: "instant"`, `filter_width: "centered"`.
   - Add 3 `_collection-promo-tile` blocks, all with blank images (merchant content), `link_label: "SHOP NOW"`, `link: "shopify://collections/all"`, highlight and text blank (brand words, D):
     - tile 1: `position` 4, `side` left, `text_position` top
     - tile 2: `position` 12, `side` right, `text_position` top
     - tile 3: `position` 16, `side` left, `text_position` bottom
3. **New** `explore_categories` / `collection-list`, name "Explore our categories": `layout_type: carousel`, `columns: 4`, `mobile_card_size: 60cqw`, `columns_gap: 6`, `icons_style: arrow`, `icons_shape: circle`, `desktop_peek: false`, `image_hover_zoom: true`, `hide_when_empty: true`, `section_width: page-width`, `collection_list: []`, padding 40/40.
   - Header `text` (`type_preset: section-heading`, "Explore our categories").
   - Static card: `placement: below_image`, `horizontal_alignment: flex-start`, gap 6.
   - Image: `image_ratio: portrait`.
   - Children: `collection-title` (small body) and `button` (`style_class: button-unstyled`, `link_underline: true`, `label: "View products"`, `link: "{{ closest.collection.url }}"`).
4. **New** `seo_text` / `section`, name "SEO text": `section_width: page-width`, padding 24/40, one `read-more-text` (`use_collection_metafield: true`, `collapsed_lines: 4`, `text_size: sm`, `text`: blank shared fallback, filled by the merchant).

`sections/*-group.json` and `config/settings_data.json`: no changes.

## Risks / backwards compatibility
- **R1 Shared files** (`product-grid`, `filters`, `sorting`, `filter-remove-buttons`, `facets.js`, `paginated-list.js`, `theme-drawer*`, `media-with-content`, `_media-without-appearance`, `media`, `collection-list`): every change is gated on a new setting, param or attribute whose default reproduces today. `search-results` passes neither `has_promos` nor `load_more_button` and has no `grid_columns` or drawer style, so search is unchanged. `blog-posts-list.js` inherits `loadMore()` but never calls it.
- **R2 Behaviour changes in existing settings:**
  - `products_per_page` now also applies with infinite scroll. An instance that stored a non-24 value while auto-load was on changes page size. `collection.json` stores none.
  - `main-collection` relabels `enable_infinite_scroll` (data unchanged).
- **R3 Drawer modal mode** only applies to the new Drawer style. Horizontal/vertical keep the desktop squeeze. The squeeze script edit must keep cart/chat drawers squeezing.
- **R4 Promo tiles + pagination:** tiles carry `ref="cards[]"` and `data-page="1"`, so page-1 prepend restores them. `#getPage` stays correct even when a tile is first. Tiles never have `.product-grid__item` or `data-product-id`, which avoids duplicate view-transition names (`utilities.js`). The 002 scroll restore (`?page=N#card-link-id`) is unaffected: card `li` ids and link ids are untouched. A tile above the target shifts layout before `scrollIntoView`, which runs on DOMContentLoaded, so it is fine.
- **R5 Dense flow** only backfills holes created by tiles. With `position` values that leave no hole, the order is pure DOM order. Visual check with odd positions and a right-side tile.
- **R6 LiquidComplexity:** `main-collection` (interleave + filter-active loop) and `filters.liquid`. The toolbar is already a snippet. Extract the filter-active calculation to a snippet if the check flags it.
- **R7 Apply-button mode:** Clear all and chips inside the drawer still apply at once. Closing without Apply resets the inputs (`form.reset()`). Price-slider summaries may need re-sync. Visual check.
- **R8 `{{ closest.collection.url }}` as a `url` dynamic source** inside `_collection-card` → `button`: if the editor or Theme Check rejects it, the fallback is a `text` block "View products" styled as an underlined link (via `.collection-card__content .text-block` CSS in collection-list, behind a new `view_link_underline` class). The whole card is already the link, so AC5.3 holds either way.
- **R9 Editor-owned `templates/collection.json`:** edit the committed version and commit soon after. A later editor save can overwrite it.
- **R10 Metafield:** the merchant must create the collection metafield definition `custom.seo_text` (rich text) in admin. Without it, the shared text shows.
- **R11 `:has()` collapse of the banner** needs `:has` support (all evergreen browsers). Without it, an empty grey media column remains (graceful).

### Open questions (non-blocking; recommended defaults applied)
- **Q1** S5 per-collection image override (`[ASSUMPTION]`, no AC): **not built**. Tiles use the collection image set in admin. Building it means switching to hand-made `_card`s, which loses the automatic title/URL.
- **Q2** "Showing X of Y" under Load more: **not built** (spec says optional). Only a screen-reader status "More products loaded".
- **Q3** Promo position = "after product N" plus side, instead of a grid row number. It is robust to column count and mobile. Mockup values 4/12/16.
- **Q4** Promo highlight default `#A8A24E` and font `body` at 28px are estimates. Merchant-editable.
- **Q5** S1 "colour scheme" = section background colour (Horizon 4.5 has no colour schemes). Default `#F2F2F2`.
- **Q6** The SEO metafield key is fixed to `custom.seo_text`, like 002's `custom.badge`.
- **Q7** Filter drawer in the Drawer style is a modal overlay at every width (spec: overlay + overlay click). It does not squeeze the page.
