# Tasks 004: Home page body

`[P]` marks a task that can run in parallel with the other `[P]` tasks (they touch disjoint files). T1 must land first because every later task uses its locale keys. T2–T13 are `[P]`. T14 and T15 run after T11–T13 (T15 also after T14). T16 and T17 run last.

Load the `horizon-conventions` skill before starting. Every new or changed snippet/block keeps its `{% doc %}` in sync. Never open a browser.

- [x] **T1 Locale keys.** Add every key listed in plan.md "Locale keys" to `locales/en.default.schema.json` (names, content, options, settings, info) and `accessibility.product_list_tabs` to `locales/en.default.json`. Keep the auto-generated header comment. No merchant copy. Files: `locales/en.default.schema.json`, `locales/en.default.json`. Covers: AC0.4 (labels only via `t:` keys).
- [x] **T2 [P] Typography roles: settings and variables.** Add the 8 `type_*_section_heading` / `type_*_tile_caption` settings under a new header in the Typography group of `config/settings_schema.json` (ids, options and defaults as in plan). Emit `--font-section-heading--*` and `--font-tile-caption--*` after the presets loop in `snippets/theme-styles-variables.liquid` without changing the loop. Files: `config/settings_schema.json`, `snippets/theme-styles-variables.liquid`. Covers: AC3.4, AC5.3, AC9.3, AC6.5 (shared heading style).
- [x] **T3 [P] Typography roles: text block options and CSS.** Add `section-heading` and `tile-caption` options to `type_preset` in `blocks/text.liquid` (default stays `rte`). Add `.text-block.section-heading` / `.text-block.tile-caption` rules plus bare `.section-heading` / `.tile-caption` utility classes in `snippets/text-block-styles.liquid`, using the T2 variables. Files: `blocks/text.liquid`, `snippets/text-block-styles.liquid`. Covers: AC3.4, AC5.3, AC9.3, AC6.5.
- [x] **T4 [P] Button underline option.** Add `link_underline` (checkbox, default false, visible only for `button-unstyled`) to `blocks/button.liquid` with a `{% stylesheet %}` for `.button-unstyled--underline` (underline, offset, hover thickness). Output the class from `snippets/button.liquid` when set. Files: `blocks/button.liquid`, `snippets/button.liquid`. Covers: AC1.5, AC7.3.
- [x] **T5 [P] Slide: mobile image, slide link, custom height pass-through.** In `blocks/_slide.liquid` add `image_1_mobile`, `link` and `open_in_new_tab`. Render a `<picture>` with a `(max-width: 749px)` source when the mobile image is set, plus a whole-slide overlay link. Pass `custom_height_mobile` / `custom_height_desktop` to `slideshow-slide` when `section.settings.slide_height == 'custom'`. In `snippets/slideshow-slide.liquid` add the two optional params (doc) and a `custom` case. Files: `blocks/_slide.liquid`, `snippets/slideshow-slide.liquid`. Covers: AC1.2, AC1.10, AC1.9 (alt kept via `image_tag`).
- [x] **T6 [P] Slideshow section: pagination alignment and custom height.** Add the `custom` option to `slide_height`, the `slide_height_desktop` (vw, default 34) and `slide_height_mobile` (vw, default 125) ranges, and `pagination_alignment` (`center` default / `right`) with the scoped CSS class. Defaults leave existing output unchanged. Files: `sections/slideshow.liquid`. Covers: AC1.3, AC1.6, AC1.8 (verify existing single-slide guard is untouched).
- [x] **T7 [P] Slideshow autoplay accessibility.** In `assets/slideshow.js` make `play()` a no-op under `prefersReducedMotion()`, add `focusin` → `suspend` / `focusout` → `resume` in `#setupSlideshow()`, and remove them in `disconnectedCallback`. Keep the JSDoc types strict. Files: `assets/slideshow.js`. Covers: AC1.7.
- [x] **T8 [P] Carousel extension: tile ratio, hover zoom, desktop peek.** Add `tile_image_ratio` (`block` default / `custom`), `tile_image_ratio_custom` (50–200 %, default 80), `image_hover_zoom` (default false) and `desktop_peek` (default true) to `sections/carousel.liquid`, with section classes/vars and CSS as in the plan. Only touch `blocks/_carousel-content.liquid` if a selector needs it. Files: `sections/carousel.liquid` (and only if needed `blocks/_carousel-content.liquid`). Covers: AC3.3, AC3.5, AC3.7, AC5.2, AC5.4, AC5.5, AC8.2, AC8.4, AC8.6, AC9.2, AC9.4.
- [x] **T9 [P] Marquee section extension.** In `sections/marquee.liquid` add the `heading` (inline_richtext, blank default, rendered in a page-width wrapper with `.section-heading`), `image_height` (40), `image_height_mobile` (28) and `speed` (25, replaces the hard-coded `data-speed-factor`) settings. Allow the `image` block. Add the reduced-motion `overflow-x: auto` CSS and hide empty `.placeholder-image` outside the editor. No colour filter. Files: `sections/marquee.liquid`. Covers: AC11.1, AC11.2, AC11.3, AC11.4, AC11.6, AC11.7.
- [x] **T10 [P] Marquee JS: focus pause and reduced-motion row.** In `assets/marquee.js` skip cloning under `prefersReducedMotion()` and add `focusin`/`focusout` slow-down/speed-up with cleanup. Files: `assets/marquee.js`. Covers: AC11.5, AC11.6.
- [x] **T11 [P] Product-list tab block and tablist snippet.** Create `blocks/_product-list-tab.liquid` (private, `tag: null`, settings `label` text and `collection` collection, renders nothing, `{% doc %}` explains why). Create `snippets/product-list-tablist.liquid` (`{% doc %}` params `tabs`, `section_id`) rendering `role="tablist"` / `role="tab"` buttons with `aria-selected`, roving `tabindex`, `aria-controls`, `data-collection-url`, `ref="tabs[]"`, `on:click="/selectTab"`, `on:keydown="/onTabKeydown"`, `{{ block.shopify_attributes }}`. The label falls back to `collection.title`. Add the tab CSS (tile-caption role, active underline, muted inactive, horizontal scroll with no wrap on mobile). Files: `blocks/_product-list-tab.liquid`, `snippets/product-list-tablist.liquid`. Covers: AC4.1, AC4.2, AC4.8, AC4.10.
- [x] **T12 [P] Product-list tabs component.** Create `assets/product-list-tabs.js`: `ProductListTabs extends Component`, registered as `product-list-tabs` with a guard. Refs `tabs[]`, `panels[]`, `shopAll?`, `tablist?`. Implement `selectTab`, `onTabKeydown` (Arrow/Home/End), and `#activate`, which toggles aria and `hidden`, resets the slideshow to slide 0, updates the shop-all href, and calls `scrollIntoView`. Handle `shopify:block:select` and clean it up. JSDoc strict. Files: `assets/product-list-tabs.js`. Covers: AC4.2, AC4.3, AC4.7, AC4.8, AC4.10.
- [x] **T13 [P] Product-list button extension.** In `blocks/_product-list-button.liquid` add `link` (url, info `t:info.product_list_button_link`) and `show_always` (default false). Add tabs-mode logic: first non-empty tab URL, always shown when the label is set, wrapped in `ref="shopAll"`. Render nothing when the label is blank. Today's logic is unchanged when there are no tab blocks and both new settings are blank or false. Files: `blocks/_product-list-button.liquid`. Covers: AC4.7, AC6.1, AC6.4.
- [x] **T14 Resource-list carousel: arrows below and peek toggle.** In `snippets/resource-list-carousel.liquid` read `settings.carousel_arrows_position` (`below_end` → class, absolute bottom-right placement, disabled arrows shown at reduced opacity, hidden below 750px) and `settings.desktop_peek == false` (zero peek at ≥750px). Absent keys keep today's output. Update `{% doc %}`. Files: `snippets/resource-list-carousel.liquid`. Covers: AC4.4, AC6.2, AC6.5.
- [x] **T15 Product-list section: tabs mode and new settings.** In `sections/product-list.liquid` add `_product-list-tab` and `_product-list-button` to `blocks`, the `carousel_arrows_position` and `desktop_peek` settings, and the `t:info.product_list_tabs` paragraph. Implement tabs mode as in the plan: filter non-empty tabs, `<product-list-tabs>` wrapper and module script only in tabs mode, render the tablist only when there are more than 1 tabs, and one `role="tabpanel"` per tab (first visible, rest `hidden`) each rendering `resource-list` with a distinct `carousel_ref` and the **same** static `_product-card` via `content_for 'block'`. Handle the all-empty case. Non-tabs markup stays unchanged. Keep LiquidComplexity under 120. Depends on T11–T14. Files: `sections/product-list.liquid`. Covers: AC4.1, AC4.2, AC4.3, AC4.5, AC4.6, AC4.9, AC6.3.
- [x] **T16 Backwards-compatibility check.** Without a browser, re-read every modified shared file and confirm that each new setting's default reproduces the previous output. Grep `templates/*.json` and `sections/*-group.json` for `slideshow`, `product-list`, `carousel`, `marquee`, `button`, `_slide` and `text` usages to confirm none rely on changed behaviour. Record any deviation in "Implementation notes". Files: none modified (review only). Covers: AC0.2 (sections stay independent), plan R1.
- [x] **T17 Home template and Theme Check (final).** Run `shopify theme pull` first, or confirm there are no unsynced editor changes. Rewrite `templates/index.json` (keep the header comment) with the 11 sections exactly as in the plan's "Template JSON changes" table, in spec order: `hero_slideshow`, `brand_tagline`, `made_for_every_moment`, `most_loved_styles`, `new_in`, `new_arrivals`, `gifting_banner`, `in_the_spotlight`, `trending_now`, *(slot for spec 003, no entry)*, `featured_on`, `important_update`. Each gets a merchant-facing `name`. Leave brand words and press logos out (blank fields), and copy the static `_product-card` config from the old `product_list_fa6P9H`. Add a note to `.claude/progress.md` that spec 003's section goes between `trending_now` and `featured_on`. Then run `shopify theme check` and fix every new offence in changed files until the result matches the baseline (0 errors, 7 existing warnings in header/divider/product-media-gallery-content). Files: `templates/index.json`, `.claude/progress.md`. Covers: AC0.1, AC0.2, AC0.3, AC0.4, AC0.5, AC1.1, AC1.3, AC1.4, AC1.6, AC1.8, AC2.1, AC2.2, AC2.3, AC2.4, AC3.1, AC3.2, AC3.3, AC3.7, AC4.1, AC4.6, AC4.7, AC5.1, AC5.2, AC6.1, AC6.4, AC6.5, AC7.1, AC7.2, AC7.4, AC7.5, AC8.1, AC8.2, AC8.3, AC8.4, AC8.5, AC8.6, AC9.1, AC9.2, AC10.1, AC11.1, AC11.3, AC11.7, AC12.1, AC12.2, AC12.3, AC12.4, AC12.5.

## AC coverage matrix
| AC | Tasks |
|---|---|
| AC0.1–0.3 | T17 (T16 for 0.2) |
| AC0.4 | T1, T17 |
| AC0.5 | T17 |
| AC1.1 | T17 |
| AC1.2 | T5 |
| AC1.3 | T6, T17 |
| AC1.4 | T17 |
| AC1.5 | T4 |
| AC1.6 | T6, T17 |
| AC1.7 | T7 |
| AC1.8 | T6, T17 |
| AC1.9 | T5 |
| AC1.10 | T5 |
| AC2.1–2.4 | T17 |
| AC3.1, 3.2 | T17 |
| AC3.3 | T8, T17 |
| AC3.4 | T2, T3 |
| AC3.5 | T8 |
| AC3.6 | T17 (`_card.link`) |
| AC3.7 | T8, T17 |
| AC4.1 | T11, T15, T17 |
| AC4.2 | T11, T12, T15 |
| AC4.3 | T12, T15 |
| AC4.4 | T14 |
| AC4.5 | T15 |
| AC4.6 | T15, T17 |
| AC4.7 | T12, T13, T17 |
| AC4.8 | T11, T12 |
| AC4.9 | T15 |
| AC4.10 | T11, T12 |
| AC5.1 | T17 |
| AC5.2 | T8, T17 |
| AC5.3 | T2, T3 |
| AC5.4 | T8 |
| AC5.5 | T8 |
| AC6.1 | T13, T17 |
| AC6.2 | T14 |
| AC6.3 | T15 |
| AC6.4 | T13, T17 |
| AC6.5 | T2, T3, T14, T17 |
| AC7.1, 7.2, 7.4, 7.5 | T17 |
| AC7.3 | T4 |
| AC8.1, 8.3, 8.5 | T17 |
| AC8.2, 8.4, 8.6 | T8, T17 |
| AC9.1 | T17 |
| AC9.2 | T8, T17 |
| AC9.3 | T2, T3 |
| AC9.4 | T8 |
| AC10.1 | T17 (slot documented; actual placement happens in spec 003) |
| AC11.1, 11.3, 11.7 | T9, T17 |
| AC11.2, 11.4 | T9 |
| AC11.5 | T10 |
| AC11.6 | T9, T10 |
| AC12.1–12.5 | T17 |

## Manual visual checklist (for the user; no browser is used by the agents)
1. Home order matches the spec. No section sits between "Trending now" and "Featured on".
2. Hero: full width; heading top-right, SHOP NOW bottom-right; dots bottom-right; 5 s autoplay that pauses on hover/focus; no autoplay with OS reduced motion; mobile image on phones.
3. All section headings (H3–H11) look identical; H3/H5/H9 captions look identical.
4. Most-loved styles: first tab underlined; clicking or arrow-keying tabs swaps products with no reload and resets to the first card; "Shop All Bestsellers" href follows the tab; tabs with empty collections disappear; tab row scrolls on mobile; arrows bottom-right on the button row, prev greyed at start.
5. New arrivals looks the same minus tabs; "View all" centred.
6. Gifting: two text groups left/right, underlined SHOP NOW; stacked on mobile.
7. Spotlight: 2 landscape slides, highlight labels top-left, circular arrows mid-height, hidden with 2 slides.
8. Featured on: full-bleed seamless marquee, logos in original colours, pauses on hover/focus, static scrollable under reduced motion.
9. Important update: grey band, text left, logo right; stacked on mobile.
10. Product, collection, cart, search and 404 pages look unchanged.
11. Merchant content to enter: hero images and copy, collections for each tab and for New arrivals, tile images and links, brand eyebrow/captions, press logo images, store logo.

## Implementation notes
Deviations from the plan, with the reason for each.
- T1 (2026-11-19): adding keys only to en.default* triggers Theme Check MatchingTranslations errors in the 81 other locale files. Decision: after all tasks, sync every new key into all other locales/*.json and *.schema.json with the English text as fallback (part of T17). Don't disable the check.
- T4: link underline class also sets overflow: visible (base .button-unstyled clips the offset underline).
- T2: settings split by two paragraph sub-labels (Section heading / Tile caption) under the new header, for editor clarity. Files that use .section-heading/.tile-caption directly must render 'text-block-styles'.
- T9/T10: heading rendered inside marquee-component grid; empty image blocks hidden with wrapper; reduced-motion row spans full grid; aria-hidden clone gets inert. New key info.marquee_speed (sync in T17).
- T5–T7: custom height also needed a section-scoped min-height rule (on-media slides take height from snippets/slideshow.liquid --slide-min-height). Autoplay also skips while :focus-within, so clicking a dot keeps autoplay paused until focus leaves (by design, matches "pause on focus"). Slide link follows hero__link layering with an editor exception. pagination_alignment visible only when controls are shown.
- T11–T15: tablist snippet takes all tab blocks and skips empty ones using the same rule as the panel loop (tab n ↔ panel n). Panels re-use the section grid via subgrid. _product-list-button: blank label now renders nothing (was an empty <a>); collection falls back to section.settings.collection. JS not type-checked with tsc (not installed).
- T16 (review only, no files changed): all new settings default to the previous output. Non-tabs product-list markup is the same apart from whitespace (wrapped in an always-true `show_list`). `resource-list-carousel` only reacts to `carousel_arrows_position == 'below_end'` / `desktop_peek == false`, so nil keys (collection-list, blog, recommendations) are unchanged. Carousel, slideshow, slide, button and text add classes/vars only when the new settings are set. No collisions with the new `.section-heading` / `.tile-caption` classes. Usages: no existing template or group uses slideshow, carousel or marquee. `cart.json` and `404.json` use product-list without tab blocks; cart's header `_product-list-button` still resolves to a blank collection, so it stays hidden as before. Intentional global changes (already in the plan): R3 slideshow autoplay off under reduced motion and paused on focus; R4 marquee static scrollable row under reduced motion. Behaviour changes that only matter in edge cases: a `_product-list-button` with a blank label now renders nothing instead of an empty `<a>`; marquee clones get `inert`; storefront marquees get `marquee--hide-empty`, which only hides image-block placeholders (a block type that is new in marquee). No regressions found, nothing fixed.
- T17: `templates/index.json` was built from the committed version (`git diff` was clean; no `theme pull`). Every setting id, select value and range was checked against the schemas by script. Deviations: (1) S1: the heading and the subtext row are wrapped in a `group` (column, aligned to the end). With `space-between` and three direct children, the subtext row would otherwise sit in the vertical middle. (2) S12 uses `section_width: page-width` instead of `full-width`. `.section-background` already spans the full viewport, so the grey band is still full-bleed (AC12.2) and the text and logo stay inside the content width, as the spec asks. (3) Slide 2's heading is blank (the mockup only shows slide 1). New in captions 3 and 4 are blank (brand words). The third spotlight label is "new season". Tile, spotlight and hero links default to `shopify://collections/all`. The logo uses a 48px custom mobile size. (4) The old header "View all" button was dropped from both product lists because the section-level `_product-list-button` replaces it. Locale sync: 22 schema keys were added to 35 `*.schema.json` files and 1 key to 46 storefront files, with the English text and inserted after their en.default neighbour where possible (816 lines, additions only). Theme Check: 0 errors and 7 warnings (baseline).
- Review fix 1 (tabs colour): `.product-list-tabs__tab` now sets `--color` (muted `rgb(var(--color-foreground-rgb) / var(--opacity-50))`, active/hover `var(--color-foreground)`) and uses `color: var(--color)`, so the shared `.tile-caption { color: var(--color) }` rule resolves to the same value regardless of bundle order. Active tab keeps the underline.
- Review fix 2 (gifting banner height): `templates/index.json` `gifting_banner.section_height_custom` 30 → 50 (hero unit is svh; setting range 0–100, so 50 is valid).
- Review fix 3 (marquee bleed): under `prefers-reduced-motion: no-preference`, the animated `.marquee__wrapper` (not `[data-disabled]`) spans `grid-column: 1 / -1`; the heading stays in the content column. `marquee.js` is unaffected: copies are computed from the component's own box (IntersectionObserver `root: this`), and the keyframe translates by -50% of the wrapper's own width. Visible change for any existing marquee section: the moving row now starts at the viewport edge instead of the page margin. `blocks/_marquee.liquid` not touched.
- Review fix 4 (tabs "View all"): in tabs mode, when following tabs and no tab has products (`button_url` still blank), `show_button` is false, so nothing is rendered.
- Review fix 5 (slide link name): `_slide.liquid` captures the child blocks before the link. If `link-label` renders nothing, the aria-label falls back to the text of the first `<h1>`–`<h6>` in the slide content, then to the new storefront key `accessibility.slide_link` ("Open slide link"), synced with the English text to all 46 other storefront locales. The aria-label is now always present.
