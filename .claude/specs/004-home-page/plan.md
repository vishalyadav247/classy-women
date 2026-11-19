# Plan 004: Home page body

- **Status:** Approved (2026-11-19, auto-approved on the user's instruction: "implement it when done", auto mode)
- **Spec:** `./spec.md` (Approved 2026-11-19; Clarifications log overrides inline text)
- **Baseline:** `shopify theme check` on 2026-11-19 reports 0 errors and 7 warnings in 3 files (`sections/header.liquid` ExcessiveSettingsCount, `snippets/divider.liquid` 5x UnusedDocParam, `snippets/product-media-gallery-content.liquid` LiquidComplexity). AC0.5 means no offence beyond these.

## Summary

Every section on the home page reuses an existing Horizon section, so **no new section is needed**. Most of the work is configuration in `templates/index.json`. There are eight small, opt-in extensions. Each one adds settings whose defaults reproduce today's behaviour exactly:

1. Two shared **typography roles**, "Section heading" and "Tile caption". They are theme settings plus two new `type_preset` options on the `text` block. They give one source of truth for H3–H11 headings and H3/H5/H9 captions without touching the global h1–h6 presets. Changing h5 or h6 would restyle card prices (h6), filters and other places.
2. **`product-list` collection tabs** (S4). A new private `_product-list-tab` block, panels pre-rendered on the server, and a small `product-list-tabs` component. The section also gets an arrow position option, a desktop peek toggle, and a section-level `_product-list-button`.
3. **`slideshow` / `_slide`** (S1): mobile image, whole-slide link, pagination alignment, custom slide height. `slideshow.js` gets reduced-motion and focus handling.
4. **`carousel`** (S3, S5, S8, S9): one shared tile image ratio, hover zoom, desktop peek toggle.
5. **`marquee`** (S11): heading, `image` blocks, logo height, speed, reduced-motion static row, focus pause.
6. **`button`** (S1, S7): an "underline" option for the Link style.
7. **`_product-list-button`** (S4, S6): optional fixed link and "always show".
8. Product cards in S4 and S6 render **only** through product-list's existing static `_product-card` block (`content_for 'block', type: '_product-card', id: 'static-product-card'`). There is no card markup in any section, so the spec 002 card is picked up automatically.

## Decision table
Reuse ladder: 1 Configure → 2 Extend → 3 New block in existing section → 4 New section

| Spec section / AC | Ladder step | Existing base | Files to create/modify | Justification (why not a lower step) |
|---|---|---|---|---|
| Shared "section heading" and "tile caption" styles (S3–S11 headings, AC3.4, AC5.3, AC9.3, AC6.5) | 2 Extend | `text` block `type_preset`, theme typography settings | `config/settings_schema.json`, `snippets/theme-styles-variables.liquid`, `blocks/text.liquid`, `snippets/text-block-styles.liquid`, locales | Configuring the h5/h6 presets would also restyle existing uses: the card price uses h6, filters and menus hard-code h5/h6, and cart/search/404/collection templates use h6. New opt-in roles change nothing until a block selects them. |
| AC0.1–AC0.4 page order, names, no copy in code | 1 Configure | `templates/index.json` | `templates/index.json` | Order and instance names are template data. |
| AC0.5 Theme Check | n/a | — | — | Run in the final task, compared with the baseline above. |
| S1 Hero slideshow: slides, heading/subtext/link, positions, full-bleed, dots, no arrows, autoplay 5 s, single-slide behaviour, alt (AC1.1, 1.3, 1.4, 1.8, 1.9) | 1 Configure | `slideshow` + `_slide` + `text`/`group`/`button` blocks | `templates/index.json` | `_slide` already supports column layout with `space-between` (heading top, link bottom) and `flex-end` (right). `display_mode: full_frame`, `section_width: full-width`, `icons_style: none`, `slideshow_controls_style: dots`, `autoplay: true`, `autoplay_speed: 5`. Controls and autoplay already turn off with 1 slide. `image_tag` uses the file's alt text. |
| S1 mobile image, whole-slide link (AC1.2, AC1.10) | 2 Extend | `blocks/_slide.liquid` | `blocks/_slide.liquid` | `_slide` has no mobile image or slide link. New optional settings; blank keeps current output. |
| S1 dots at bottom-right (AC1.6) | 2 Extend | `sections/slideshow.liquid` (hard-codes `pagination_position: 'center'`) | `sections/slideshow.liquid` | The `slideshow-controls` left/right positions switch to vertical "thumbnail" scroll mode, so a CSS alignment option is safer. Default `center` = today. |
| S1 slide height desktop + mobile (spec section-level setting) | 2 Extend | `slide_height` (auto/small/medium/large in dvh) | `sections/slideshow.liquid`, `snippets/slideshow-slide.liquid`, `blocks/_slide.liquid` | Presets cannot reach the about 2.9:1 desktop / 4:5 mobile frame. Adds a `custom` option with desktop and mobile `vw` ranges. Other values are unchanged. |
| S1 autoplay respects reduced motion, pauses on focus (AC1.7) | 2 Extend | `assets/slideshow.js` (pauses only on hover) | `assets/slideshow.js` | WCAG requirement and spec AC. No Liquid can do it. Only affects slideshows that have the `autoplay` attribute. |
| S1 "SHOP NOW" plain text link (AC1.5) | 1 Configure (+ optional 2) | `button` block `style_class: button-unstyled` | `templates/index.json` (+ `blocks/button.liquid` shared with S7) | A plain link already satisfies "underlined or plain". The underline option from S7 is reused. Label is typed uppercase by the merchant. |
| S2 Brand tagline (AC2.1–2.4) | 1 Configure | `section` + `text` block | `templates/index.json` | Rich text, `alignment: center`, `width: 100%`, type preset/size, section padding all exist. |
| S3 Made for every moment: heading + 4 tiles, whole-tile link, mobile swipe with peek (AC3.1, 3.2, 3.4, 3.6) | 1 Configure | `carousel` → `_carousel-content` → `_card` (`image` + `text` children, card `link`) | `templates/index.json` | `_card.link` renders one overlay link over the whole tile. 4 columns with 4 tiles means no overflow, so arrows are disabled and hidden (existing CSS). On mobile `mobile_columns: 1` + peek gives a swipe carousel (C1). |
| S3/S5/S9 shared tile ratio, 4-up with no desktop peek, hover zoom (AC3.3, 3.5, 3.7, 5.2, 5.4, 9.2, 9.4) | 2 Extend | `sections/carousel.liquid`, `blocks/_carousel-content.liquid` | `sections/carousel.liquid`, `blocks/_carousel-content.liquid` | The image ratio is per `image` block (adapt/4:5/1:1/16:9), so tiles can drift apart and 0.92/0.86/1.2 are not available. Section-level `tile_image_ratio` (default `block` = today). The global `--peek-next-slide-size: 3rem` shrinks desktop tiles, so add `desktop_peek` (default on = today). `image_hover_zoom` (default off). |
| S3 collection image/title fallback (spec text, no AC) | Not built | — | — | See open question Q1. Tiles are hand-curated cards. |
| S4 Most-loved styles: tabs, one collection per tab, first tab active, no-reload switching, keyboard tabs, empty tabs hidden, single tab hides row, mobile scrollable tab row (AC4.1–4.3, 4.6, 4.8–4.10) | 3 New private block in existing section + 2 Extend | `product-list` (carousel layout, static `_product-card`) | **new** `blocks/_product-list-tab.liquid`, **new** `snippets/product-list-tablist.liquid`, **new** `assets/product-list-tabs.js`, `sections/product-list.liquid` | product-list already does heading + carousel + card + button, and spec 006 (A15 "You may also like" tabs) needs the same tab feature. A new section would duplicate it. Tabs mode is active only when at least one `_product-list-tab` block exists, so existing product-list instances are unchanged. |
| S4 tab switching mechanism | Decision | — | — | **Pre-rendered panels**, not the Section Rendering API. See "S4 switching: why pre-rendered panels" below. |
| S4/S6 4 cards per view, no peek, arrows bottom-right with disabled states (AC4.4, AC6.2) | 2 Extend | `snippets/resource-list-carousel.liquid` (arrows on media, disabled = `display:none`, 3rem peek) | `sections/product-list.liquid`, `snippets/resource-list-carousel.liquid` | New product-list settings `carousel_arrows_position` (`on_media` default = today, `below_end`) and `desktop_peek` (default on = today). `resource-list-carousel` reads them from the `settings` object it already receives. When they are absent (collection-list, etc.) nothing changes. |
| S4/S6 cards use the shared card (AC4.5, AC6.3) | 1 Configure | product-list static `_product-card` | `sections/product-list.liquid` (tabs loop reuses the same `content_for 'block', type: '_product-card', id: 'static-product-card'`) | No section-specific card markup. Spec 002 will change `_product-card` / `snippets/product-card.liquid` and both sections inherit it. |
| S4 "Shop all" button centred, primary, follows active tab (AC4.7) | 2 Extend | `_product-list-button` (link = `closest.collection.url`, shown only if collection has more products than `max_products`, private to `_product-list-content`) | `blocks/_product-list-button.liquid`, `sections/product-list.liquid` (adds `_product-list-button` to the section's block list) | Needs a section-level position (below the carousel), tab-aware link, "always show" and an optional fixed link. Defaults keep today's behaviour. |
| S5 New in: carousel, 4 per view, overlay arrows only on overflow (AC5.1, 5.5) | 1 Configure (+ the carousel extension above) | `carousel` + `_card` | `templates/index.json` | Clarification: carousel. Existing carousel hides disabled arrows, so arrows appear only when tiles overflow. `icons_style: chevron`. |
| S6 New arrivals (AC6.1–6.5) | 1 Configure (+ product-list / button extensions above) | `product-list` carousel | `templates/index.json` | Same section and settings as S4 without tab blocks, so they look identical (AC6.5). Empty collection: product-list already shows placeholders in the editor only when no collection is set. See risk R6. |
| S7 Gifting banner (AC7.1, 7.2, 7.4, 7.5) | 1 Configure | `hero` (image + mobile image, banner `link`, `content_direction: row`, `space-between`, `vertical_on_mobile`, `section_height: custom`, `full-width`) + two `group` blocks with `text`/`button` | `templates/index.json` | Two independent groups map to two `group` blocks. All text is live (clarification). |
| S7 underlined uppercase link (AC7.3) | 2 Extend | `button` block Link style (no underline) | `blocks/button.liquid`, `snippets/button.liquid` | Adds a `link_underline` checkbox, visible only for `button-unstyled`, default off. |
| S8 In the spotlight: 2-up, highlight label top-left, overlay arrows, ≤2 slides hides arrows, landscape, mobile 1-up (AC8.1–8.6) | 1 Configure (+ carousel `desktop_peek` off) | `carousel` + `_card` (`background_media: image`, `aspect_ratio: landscape`, card `link`) + `text` child with `background: true` + `background_color` | `templates/index.json` | `text.background` and `background_color` is the configurable highlight (clarification: live text, merchant colour). Arrows are already overlaid at mid-height and hidden when disabled (2 slides in 2 columns means both are disabled). `icons_shape: circle`. |
| S9 Trending now (AC9.1–9.4) | 1 Configure (+ carousel extension) | `carousel` + `_card` | `templates/index.json` | Same as S3 with `columns: 3`, ratio 120. |
| S10 The style edit (AC10.1) | Slot only | — | none | Spec 003 is on hold. No section and no placeholder. The order leaves the slot between `trending_now` and `featured_on`. |
| S11 Featured on: heading, logo image blocks with link and alt, original colours, full-bleed, height and speed settings, seamless loop (AC11.1–11.4, 11.6, 11.7) | 2 Extend | `marquee` (blocks: text/icon/logo/_divider; hard-coded `data-speed-factor="25"`; no heading) | `sections/marquee.liquid` | Allow the public `image` block (image + link + file alt). Add `heading` (blank default = today), `image_height` / `image_height_mobile`, `speed` (default 25 = today). The seamless loop is the existing clone logic. No logos ship with the theme. |
| S11 pause on focus, static scrollable row under reduced motion, skip empty logos (AC11.5) | 2 Extend | `assets/marquee.js` (slows to 0 on pointer hover only), marquee CSS (animation off under reduced motion, but overflow hidden with clones) | `assets/marquee.js`, `sections/marquee.liquid` | Needs focusin/focusout, no clones and `overflow-x: auto` under reduced motion. |
| S12 Important update (AC12.1–12.5) | 1 Configure | `section` (`full-width`, `background_color`, `content_direction: row`, `space-between`, `vertical_alignment: center`, `vertical_on_mobile`) + `group` (2 `text`) + `logo` block | `templates/index.json` | `logo` defaults to the store logo (spec: "optionally defaults to the store logo"). If no logo is set it falls back to the shop name, so it never shows a broken image. Merchants who want a different image swap it for an `image` block (section accepts `@theme`). See Q2. |

### S4 switching: why pre-rendered panels
- **The Section Rendering API cannot do it here.** `?section_id=` renders a section instance of the *current* template. Home-template instance ids do not exist on `/collections/<handle>`, and `index` has no collection context. A static helper section (like `section-rendering-product-card`) would lose the merchant's card child-block configuration stored in `index.json`, which breaks AC4.5 and the automatic pick-up of spec 002.
- **Pre-rendered panels:** for each non-empty tab the section renders a full `resource-list` carousel with the same static `_product-card`. Inactive panels have `hidden`, so their lazy images do not load. Switching is instant and offline, works in the theme editor, and empty tabs are dropped on the server (`collection == blank or collection.products_count == 0`), which meets "empty tabs hidden" (A16) with no client logic.
- **Cost:** DOM size grows by tabs × `max_products` cards (6 × 8 = 48 in the mockup set-up). This is acceptable for a home page, because only the first panel's images load eagerly or lazily on view. See R2.

## Schema changes
New and changed settings and blocks (id, type, default) per file. All `label`/`content`/`info` values use the `t:` keys listed under Locale keys.

### `config/settings_schema.json` (Typography group, appended after the h6 settings)
| id | type | options / range | default |
|---|---|---|---|
| (header) | header | `t:content.section_headings_and_captions` | — |
| `type_font_section_heading` | select | `heading`, `accent`, `subheading`, `body` (same labels as `type_font_h6`) | `heading` |
| `type_size_section_heading` | range | 10–32, step 1, `px` | 16 |
| `type_letter_spacing_section_heading` | select | `heading-tight`, `heading-normal`, `heading-loose` (same labels as h6) | `heading-loose` |
| `type_case_section_heading` | select | `none`, `uppercase` | `uppercase` |
| `type_font_tile_caption` | select | as above | `body` |
| `type_size_tile_caption` | range | 10–24, step 1, `px` | 13 |
| `type_letter_spacing_tile_caption` | select | as above | `heading-loose` |
| `type_case_tile_caption` | select | `none`, `uppercase` | `uppercase` |

`config/settings_data.json` is **not** edited. Missing keys fall back to the schema defaults.

### `snippets/theme-styles-variables.liquid`
After the type-presets loop, emit `--font-section-heading--{family,style,weight,size,letter-spacing,case,line-height}` and `--font-tile-caption--{…}` using the same mapping as the h-presets (`--font-<font>--family/style/weight`, `--letter-spacing--<value>`). Line height is fixed at `var(--line-height--display-normal)` for headings and `var(--line-height--body-normal)` for captions. Do not modify the existing loop.

### `blocks/text.liquid`
`type_preset` select gains two options after `h6`: `section-heading` (`t:options.section_heading`) and `tile-caption` (`t:options.tile_caption`). The default stays `rte`. `snippets/text.liquid` already outputs the preset value as a class, so it needs no change.

### `snippets/text-block-styles.liquid`
Add `.text-block.section-heading > *, .text-block.section-heading :is(h1,h2,h3,h4,h5,h6,p)` and the same for `.tile-caption`, applying the variables above. Also add bare `.section-heading` and `.tile-caption` utility classes (same declarations) for non-block markup: the marquee heading and the product-list tab labels.

### `blocks/_slide.liquid`
| id | type | default | notes |
|---|---|---|---|
| `image_1_mobile` | image_picker | — | `visible_if: media_type_1 == 'image'`. Rendered as `<picture><source media="(max-width: 749px)">` around the existing `image_tag`. Blank = today's markup. |
| `link` | url | — | Whole-slide link: absolutely-positioned `<a class="slide__link">` under the content layer (same pattern as `_card` `.card__link`), with an `aria-label` from `link-label` snippet. |
| `open_in_new_tab` | checkbox | false | `visible_if: link != blank` |

Pass `custom_height_desktop` / `custom_height_mobile` from `section.settings` to `slideshow-slide` when `section.settings.slide_height == 'custom'`.

### `snippets/slideshow-slide.liquid`
New optional params `custom_height_mobile` (number, vw) and `custom_height_desktop` (number, vw), documented in `{% doc %}`. New `when 'custom'` case sets `--grid-template-rows: <m>vw 1fr; --grid-template-rows-desktop: <d>vw 1fr`. Other cases are untouched.

### `sections/slideshow.liquid`
| id | type | default | notes |
|---|---|---|---|
| `slide_height` | select (existing) | `medium` (unchanged) | add option `custom` (`t:options.custom`) |
| `slide_height_desktop` | range 15–100, step 1, `vw` | 34 | `visible_if: slide_height == 'custom'` (34vw ≈ 660px at 1920) |
| `slide_height_mobile` | range 50–200, step 5, `vw` | 125 | `visible_if: slide_height == 'custom'` (4:5) |
| `pagination_alignment` | select `center` / `right` | `center` | under Navigation header. `right` adds class `slideshow-section--pagination-end`, and section CSS sets `justify-content: flex-end` plus inline padding on the on-media `slideshow-controls`. |

### `assets/slideshow.js`
- `play()`: return early when `prefersReducedMotion()` (already imported from `@theme/utilities`). Under reduced motion autoplay never starts, but manual navigation still works.
- In `#setupSlideshow()`: add `focusin` → `suspend` and `focusout` → `resume` listeners (only when focus leaves the component), and remove them in `disconnectedCallback`.
- No change to the public API or events.

### `blocks/button.liquid` + `snippets/button.liquid`
| id | type | default | notes |
|---|---|---|---|
| `link_underline` | checkbox | false | `visible_if: style_class == 'button-unstyled'`. Adds class `button-unstyled--underline` (underline, `text-underline-offset: 0.25em`, thicker underline on hover). CSS lives in `blocks/button.liquid` `{% stylesheet %}`. |

`snippets/button.liquid` adds the class when `block_settings.link_underline` is true. `_product-list-button` (also renders this snippet) does not get the setting, so its output is unchanged.

### `sections/carousel.liquid`
| id | type | default | notes |
|---|---|---|---|
| `tile_image_ratio` | select `block` / `custom` | `block` | `block` = each image block's own ratio (today) |
| `tile_image_ratio_custom` | range 50–200, step 1, `%` (width as % of height) | 80 | `visible_if: tile_image_ratio == 'custom'`. Emits `--carousel-tile-ratio: <n>/100` and class `section-carousel--fixed-ratio`. CSS: `.section-carousel--fixed-ratio .card :is(.image-block__image, .placeholder-image) { aspect-ratio: var(--carousel-tile-ratio); width: 100%; }`. This is the property, not the `--ratio` var, so no `!important` and no `image.liquid` edit. |
| `image_hover_zoom` | checkbox | false | class `section-carousel--hover-zoom`: image scales 1.04 on `.card:hover`/`:focus-within`, inside `overflow: hidden`, disabled under reduced motion. |
| `desktop_peek` | checkbox | true | When false, class `section-carousel--no-peek` sets `--peek-next-slide-size: 0px` at ≥750px only (mobile peek kept). |

### `blocks/_carousel-content.liquid`
No schema change. If needed, it reads the section classes/vars above. Prefer putting all CSS in `sections/carousel.liquid` and leave this file untouched unless the selector needs the block wrapper.

### `blocks/_product-list-tab.liquid` (new, private)
```
name: t:names.product_list_tab, tag: null
settings:
  label       text        (no default; blank → collection.title)   t:settings.label
  collection  collection                                           t:settings.collection
```
The block file outputs nothing (the section renders tabs and panels from `section.blocks`). Starts with a `{% doc %}` explaining that. The section puts `{{ block.shopify_attributes }}` on the matching tab button so editor selection works.

### `snippets/product-list-tablist.liquid` (new)
`{% doc %}` params: `tabs` (array of `_product-list-tab` blocks that passed the non-empty filter), `section_id` (string). Renders:
```
<div class="product-list-tabs__list section-heading?" role="tablist" aria-label="{{ 'accessibility.product_list_tabs' | t }}" ref="tablist">
  <button type="button" role="tab" id="Tab-{section_id}-{n}" aria-controls="TabPanel-{section_id}-{n}"
          aria-selected="true|false" tabindex="0|-1" ref="tabs[]"
          data-collection-url="{{ collection.url }}" on:click="/selectTab" on:keydown="/onTabKeydown"
          {{ block.shopify_attributes }}>label</button>…
</div>
```
Labels use the `.tile-caption` typography role. Active: `color: var(--color-foreground)` plus underline. Inactive: `rgb(var(--color-foreground-rgb) / var(--opacity-50))`, no underline. On mobile: `display:flex; overflow-x:auto; white-space:nowrap; scrollbar-width:none`.

### `sections/product-list.liquid`
Schema additions:
- `blocks`: add `{ "type": "_product-list-tab" }` and `{ "type": "_product-list-button" }`.
- Settings (in the "Carousel navigation" header group):

| id | type | default | visible_if |
|---|---|---|---|
| `carousel_arrows_position` | select `on_media` / `below_end` | `on_media` | `layout_type == 'carousel' or carousel_on_mobile` |
| `desktop_peek` | checkbox | true | `layout_type == 'carousel'` |
- Add a `paragraph` with `t:info.product_list_tabs` at the top of the schema settings.

Markup (tabs mode = `assign tab_blocks = section.blocks | where: 'type', '_product-list-tab'`, then keep the ones with `collection != blank and collection.products_count > 0`):
- **Not tabs mode** (no tab blocks at all): today's markup, byte-for-byte except new classes/vars driven by the two new settings.
- **Tabs mode, ≥1 non-empty tab:** wrap the section inner in `<product-list-tabs>` (loads `product-list-tabs.js` via `<script type="module">` only in tabs mode). Then render the header, then `product-list-tablist` (only when the non-empty count is greater than 1), then one `<div role="tabpanel" id="TabPanel-…" aria-labelledby="Tab-…" ref="panels[]" {% unless first %}hidden{% endunless %}>` per tab. Each panel contains `resource-list` fed by the same per-product `content_for 'block', type: '_product-card', id: 'static-product-card', closest.product: product`, looping `tab.settings.collection.products limit: section.settings.max_products` (no `paginate`). Each panel passes a distinct `carousel_ref` (`tabCarousel1`…). Then the content area (`content_for 'blocks'`).
- **Tabs mode, all tabs empty:** in the editor (`request.design_mode`), the existing placeholder cards; on the storefront, the header only (no panels, no tab row).
- Keep the Liquid complexity under 120. If it grows, move the panel loop markup into a snippet. Note that `content_for` must stay in the section, so capture each panel's list items in the section and pass the strings.

### `snippets/resource-list-carousel.liquid`
Reads `settings.carousel_arrows_position` and `settings.desktop_peek` (nil-safe):
- `below_end` adds class `resource-list__carousel--arrows-below`. CSS places `slideshow-arrows` below the track, right-aligned (absolute, `inset-block-start: calc(100% + var(--gap, 12px))`, `inset-inline-end: var(--util-page-margin-offset)`), so they line up with the content row that holds the centred button. Disabled controls show `opacity: var(--opacity-30)` with `pointer-events: none` instead of `display:none`. `icons_shape: square` gives the outlined square. Hidden below 750px.
- `desktop_peek == false` sets `--peek-next-slide-size: 0px` inside `@container (min-width: 750px)`.
- Update `{% doc %}` to mention the two optional settings keys.

### `blocks/_product-list-button.liquid`
| id | type | default | notes |
|---|---|---|---|
| `link` | url | — | Optional fixed link. Blank = collection URL (today) or the active tab's URL. |
| `show_always` | checkbox | false | false = today's rule (show only when `products_count > max_products`) |

Logic: if section has `_product-list-tab` blocks and `link` is blank, `button_url` = first non-empty tab's `collection.url` and the button is shown whenever `label != blank`. The output is wrapped in `<div class="product-list-button" ref="shopAll" data-follow-tab>` (tabs mode only, so `product-list-tabs` can update the `<a>` href). Otherwise today's logic, with `link` overriding the URL and `show_always` bypassing the count check. If `label` is blank, render nothing.

### `sections/marquee.liquid`
| id | type | default | notes |
|---|---|---|---|
| `heading` | inline_richtext | — (blank) | Rendered above the marquee inside a page-width wrapper (`section--page-width` grid) as `<div class="text-block section-heading">` (+ `render 'text-block-styles'`). Blank = no wrapper (today). |
| `image_height` | range 16–120, step 2, `px` | 40 | `--marquee-image-height`. Applies to `.marquee__repeated-items .image-block__image` (`height`, `width:auto`, `aspect-ratio:auto`). |
| `image_height_mobile` | range 16–120, step 2, `px` | 28 | below 750px |
| `speed` | range 5–60, step 1 (seconds factor, label "Speed"; higher = slower) | 25 | replaces the hard-coded `data-speed-factor="25"` |
- `blocks`: add `{ "type": "image" }`.
- CSS: no filter on images (AC11.2). Under `prefers-reduced-motion: reduce`, `.marquee__wrapper { overflow-x: auto }` on the component and scroll-snap off. Outside the editor (`request.design_mode` false), add class `marquee--hide-empty`, which hides `.placeholder-image` inside the marquee (skip logos without an image).

### `assets/marquee.js`
- `connectedCallback`: if `prefersReducedMotion()` (import from `@theme/utilities`), skip `#addRepeatedItems` / `#duplicateContent`, so the static row has no duplicates.
- Add `focusin` → `#slowDown` and `focusout` → `#speedUp` (when `relatedTarget` is outside), and remove them in `disconnectedCallback`.

### `assets/product-list-tabs.js` (new)
See JavaScript.

## Locale keys
`en.default.schema.json` (add only. Keys marked "reuse" already exist):

| Group | Key | English |
|---|---|---|
| names | `product_list_tab` | Tab |
| content | `section_headings_and_captions` | Section headings and tile captions |
| content | `section_heading` | Section heading |
| content | `tile_caption` | Tile caption |
| options | `section_heading` | Section heading |
| options | `tile_caption` | Tile caption |
| options | `set_per_image` | Set per image |
| options | `below_carousel_right` | Below carousel, right |
| settings | `mobile_image` | Mobile image |
| settings | `pagination_alignment` | Pagination alignment |
| settings | `link_underline` | Underline link |
| settings | `tile_image_ratio` | Tile image ratio |
| settings | `tile_image_ratio_custom` | Image width (% of height) |
| settings | `image_hover_zoom` | Zoom image on hover |
| settings | `desktop_peek` | Show next item peek on desktop |
| settings | `arrows_position` | Arrow position |
| settings | `show_always` | Always show button |
| settings | `image_height` | Image height |
| settings | `image_height_mobile` | Mobile image height |
| info | `product_list_tabs` | Add Tab blocks to show one collection per tab. Tabs with no products are hidden. |
| info | `product_list_button_link` | Leave empty to link to the collection, or the active tab's collection. |

Reused (no change): `settings.label`, `settings.collection`, `settings.link`, `settings.open_new_tab`, `settings.heading`, `settings.speed`, `settings.font`, `settings.size`, `settings.letter_spacing`, `settings.case`, `settings.desktop_height`, `settings.mobile_height`, `options.custom`, `options.center`, `options.right`, `options.on_media`, `options.uppercase`, `options.none`, `options.heading`/`body`/`subheading`/`accent`, and the h6 letter-spacing option keys.

`en.default.json`:

| Group | Key | English |
|---|---|---|
| accessibility | `product_list_tabs` | Product collections |

No merchant copy goes into either locale file (AC0.4). The tab label falls back to the collection title, not a translation.

## JavaScript
**New:** `assets/product-list-tabs.js` defines `product-list-tabs`, `class ProductListTabs extends Component`, guarded by `customElements.get`, with JSDoc types (strict `checkJs`).
- Refs: `tablist` (optional), `tabs[]`, `panels[]`, `shopAll` (optional). `requiredRefs = ['panels']`.
- `selectTab(event)` (`on:click`): reads the index of `event.target.closest('[role=tab]')` and calls `#activate(index, { focus: false })`.
- `onTabKeydown(event)` (`on:keydown`): ArrowRight/ArrowLeft (wrap), Home, End, then `#activate(i, { focus: true })`. The selection-follows-focus pattern.
- `#activate(i)`: sets `aria-selected` / `tabindex` on tabs and `hidden` on panels. Calls `panel.querySelector('slideshow-component')?.select(0, undefined, { animate: false })` to reset to the first slide (the slideshow's ResizeObserver re-measures once the panel is visible). Updates `this.refs.shopAll?.querySelector('a').href` from the tab's `data-collection-url`. Calls `tab.scrollIntoView({ block: 'nearest', inline: 'nearest' })` (instant under reduced motion) so the active tab stays visible on mobile.
- Editor: on `connectedCallback`, listen to `shopify:block:select` on `document`. If `event.target` is one of `this.refs.tabs`, activate it. Remove the listener on disconnect.
- Events: none dispatched, and none from `events.js` needed. Cart updates inside cards keep working through the card's own components.
- Import map: **not** added to `snippets/scripts.liquid` (nothing imports it). It is loaded by `<script type="module" src="{{ 'product-list-tabs.js' | asset_url }}" fetchpriority="low">` from `sections/product-list.liquid` in tabs mode only.

**Modified:** `assets/slideshow.js` (reduced-motion and focus autoplay guard) and `assets/marquee.js` (focus pause, no clones under reduced motion). Both are covered above.

**Not touched:** `component.js`, `morph.js`, `section-renderer.js`, `utilities.js`, `base.css`.

## Template JSON changes
`templates/index.json`: run `shopify theme pull` (or confirm there are no unsynced editor edits) first. Keep the auto-generated header comment. Replace the two existing sections (`hero_jVaWmY`, `product_list_fa6P9H`) with the following, in this `order`. Each instance has a `"name"` matching its purpose (AC0.3). Content sections use `padding-block-start: 40` / `padding-block-end: 40` (about 80px between sections, B3) unless stated otherwise.

| # | key | type | name | Key settings / blocks |
|---|---|---|---|---|
| 1 | `hero_slideshow` | slideshow | Hero slideshow | `display_mode: full_frame`, `section_width: full-width`, `slide_height: custom` (34/125), `icons_style: none`, `slideshow_controls_style: dots`, `pagination_alignment: right`, `autoplay: true`, `autoplay_speed: 5`, padding 0/0. 2 `_slide` blocks: `content_direction: column`, `vertical_alignment_flex_direction_column: space-between`, `horizontal_alignment_flex_direction_column: flex-end`, padding 48. Children: `text` heading (h1 preset, text "A/W 26", light `text_color`), `group` (row, space-between) with 2 small `text` subtext blocks (blank by default), `button` (`style_class: button-unstyled`, `link_underline: true`, label "SHOP NOW", link `shopify://collections/all`, light `link_text_color`). |
| 2 | `brand_tagline` | section | Brand tagline | `section_width: page-width`, `horizontal_alignment_flex_direction_column: center`, padding 48/48. 1 `text` block: `width: 100%`, `alignment: center`, `type_preset: paragraph`, tagline copy from the mockup. |
| 3 | `made_for_every_moment` | carousel | Made for every moment | `columns: 4`, `mobile_columns: 1`, `columns_gap: 10`, `icons_style: none`, `tile_image_ratio: custom`, `tile_image_ratio_custom: 92`, `image_hover_zoom: true`, `desktop_peek: false`. Static header `group` contains a `text` with `type_preset: section-heading`, "MADE FOR EVERY MOMENT". Static content has 4 `_card`s (`background_media: none`, `content_direction: column`, `gap: 12`, `link` = collection), each with an `image` block (blank image) and a `text` block (`tile-caption`, captions from the mockup). |
| 4 | `most_loved_styles` | product-list | Most-loved styles | `layout_type: carousel`, `columns: 4`, `mobile_card_size: 44cqw`, `max_products: 8`, `columns_gap: 12`, `icons_style: arrow`, `icons_shape: square`, `carousel_arrows_position: below_end`, `desktop_peek: false`, `horizontal_alignment: center`, `collection: ""`. Static header: `text` (section-heading, "MOST-LOVED STYLES", width 100%, align left). 6 `_product-list-tab` blocks with labels ALL BESTSELLERS / TOTE / SHOULDER / TOP HANDLE / CROSSBODY / MINI & MICRO and empty collections (merchant picks them). 1 `_product-list-button` (`label: "Shop All Bestsellers"`, `style_class: button`). Static `_product-card` copied from the current `product_list_fa6P9H` card config. |
| 5 | `new_in` | carousel | New in | Like #3 with `columns: 4`, `icons_style: chevron`, `icons_shape: none`, `tile_image_ratio_custom: 86`. 4 cards, captions from the mockup **except** brand words (see note). |
| 6 | `new_arrivals` | product-list | New arrivals | Same settings as #4, no tab blocks, `collection: ""`. Header: `text` (section-heading, "NEW ARRIVALS"). 1 `_product-list-button` (`label: "View all"`, `show_always: true`). Same static `_product-card` config. |
| 7 | `gifting_banner` | hero | Gifting banner | `section_width: full-width`, `section_height: custom` (30), `custom_mobile_media: true`, `content_direction: row`, `horizontal_alignment: space-between`, `vertical_alignment: center`, `vertical_on_mobile: true`, `toggle_overlay: false`, padding 0/0. Left `group`: eyebrow `text` (blank) and heading `text` ("GIFTING EDIT", `custom` preset, accent font, 4.5rem). Right `group` (align end): `text` ("Curate Your Own Bundle", custom subheading font) and `button` (`button-unstyled`, `link_underline: true`, "SHOP NOW"). Light `text_color` / `link_text_color`. |
| 8 | `in_the_spotlight` | carousel | In the spotlight | `columns: 2`, `mobile_columns: 1`, `columns_gap: 12`, `icons_style: arrow`, `icons_shape: circle`, `desktop_peek: false`. Header `text` (section-heading, "IN THE SPOTLIGHT"). 3 `_card`s: `background_media: image`, `aspect_ratio: landscape`, `horizontal_alignment_flex_direction_column: flex-start`, `vertical_alignment_flex_direction_column: flex-start`, padding 24, `link` set. Each has a `text` child (`background: true`, `background_color: "#D9D27A"`, `corner_radius: 0`, lowercase labels "off the clock" / "ayla crossbody bag" / third label). |
| 9 | `trending_now` | carousel | Trending now | Like #3 with `columns: 3`, `tile_image_ratio_custom: 120`. 3 cards, captions from the mockup. |
| — | *(slot: The style edit, spec 003)* | — | — | No section. When 003 resumes, its section key goes between `trending_now` and `featured_on` (AC10.1). |
| 10 | `featured_on` | marquee | Featured on | `heading: "FEATURED ON"`, `image_height: 40`, `image_height_mobile: 28`, `speed: 25`, `gap_between_elements: 64`, padding 40/40. 5 `image` blocks with blank images, `width: fit-content`, no links. No bundled press logos (AC11.7). |
| 11 | `important_update` | section | Important update | `section_width: full-width`, `background_color: "#F2F2F2"` (B2 panel grey), `content_direction: row`, `horizontal_alignment: space-between`, `vertical_alignment: center`, `vertical_on_mobile: true`, padding 56/56. The inner page-width alignment is reached through the section's content grid; check visually. `group` (column) with `text` (section-heading, "IMPORTANT UPDATE:") and `text` (rte, body copy). `logo` block (`unit: pixel`, `pixel_height: 72`). |

**Brand placeholders:** "MIRAGGIO" (S5 captions "MIRAGGIO FORWARD", "FRIENDS x MIRAGGIO", S7 eyebrow, S12 logo) and press names are **not** written into the template. Those captions are left blank (or use the non-brand part, e.g. "FRIENDS x") and listed in the merchant content checklist. `sections/header-group.json` and `sections/footer-group.json` are not touched (spec 001).

## Risks / backwards compatibility
- **R1 Shared sections modified** (`product-list`, `carousel`, `slideshow`, `marquee`, `button`, `_product-list-button`, `_slide`, `text`, `resource-list-carousel`, `slideshow-slide`). Every new setting defaults to current behaviour, and the new code paths are gated on new settings or blocks. The builder must diff-check that `templates/product.json`, `collection.json`, `cart.json`, `search.json`, `404.json` and the group JSON files render identically. They contain no new keys, so the defaults apply.
- **R2 Tabs DOM weight.** Up to tabs × `max_products` cards are in the HTML. Hidden panels do not load images. Recommend `max_products` ≤ 8 for tabbed instances. Note this in the plan for spec 006 (A15).
- **R3 `slideshow.js` behaviour change.** Under reduced motion, autoplay no longer starts on *any* autoplaying slideshow. Focus now pauses autoplay. Both are accessibility fixes, only affect slideshows with autoplay enabled, and the product gallery is unaffected.
- **R4 `marquee.js` under reduced motion** renders one copy and a scrollable row instead of a clipped static strip. This is an improvement for all marquees.
- **R5 Arrow row alignment (S4/S6).** The arrows live inside `slideshow-component` (required for `on:click="/previous"`), so they are positioned absolutely to line up with the button row. Their vertical alignment with the button depends on the section `gap` and button height and needs a visual check. Fallback: arrows on their own row below the carousel, right-aligned.
- **R6 S6 empty collection.** product-list renders placeholder cards when `collection` is blank (editor and storefront) and nothing when the collection has 0 products. This matches the spec only once a collection is chosen. The merchant must pick a collection before publishing (checklist).
- **R7 `_product-list-button` at section level.** It relies on `closest.collection` resolving from `section.settings.collection`. The builder must verify this. If it does not resolve, fall back to `section.settings.collection` explicitly.
- **R8 Editor-owned `templates/index.json`.** A later `theme pull` or editor save can overwrite hand edits. Pull before editing, and commit right after.
- **R9 Typography roles** read new theme settings that are absent from `settings_data.json`, so schema defaults apply. Merchants tune them under Theme settings → Typography.
- **R10 Liquid complexity.** `sections/product-list.liquid` must stay under the 120 LiquidComplexity threshold. The tablist is already split into a snippet.
- **R11 Spec 002 hand-off.** S4/S6 card appearance (badges, swatches, % OFF, NEW badge in S6) will look like today's Horizon card until 002 lands. No 004 work is needed then.
- **R12 Spec 006 A15** wants a "Related products" (recommendations) first tab. product-list tabs are collection-only, so 006's plan must handle that separately.

### Open questions (non-blocking; defaults chosen)
- **Q1** S3 "collection image/title fallback" (spec text, no AC) is not built. Tiles are curated `_card`s, so the merchant sets the image and caption. Building it would need an extension of `image`/`text` to read the card's linked collection. Recommend dropping it. Confirm.
- **Q2** S12 logo uses the `logo` block (the store logo from theme settings, which falls back to the shop name). If the merchant wants a different image on this band only, they swap it for an `image` block. Confirm that is acceptable for AC12.1.
- **Q3** Tile ratios use mockup estimates (S3 92%, S5 86%, S9 120%) rather than the generic B3 "category tiles 4:5", because the spec says S5 is taller than S3 and S9 is landscape. All are editable.

### Open-question resolutions (orchestrator, 2026-11-19, auto mode, recommended defaults)
- Q1: Dropped. S3 tiles are curated cards; no collection fallback is built.
- Q2: Accepted. S12 uses the `logo` block (store logo, falls back to shop name); merchants can swap it for an `image` block.
- Q3: Accepted. Tile ratios S3 92%, S5 86%, S9 120%, all editable.
