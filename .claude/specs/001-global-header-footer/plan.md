# Plan 001: Global header, announcement bar, footer, floating buttons

- **Status:** Approved (2026-11-19, auto mode per user; open questions 1–7 take the recommended defaults)
- **Spec:** `./spec.md` (Approved 2026-11-19; the Clarifications log overrides inline text)
- **Baseline:** `shopify theme check` on 2026-11-19 (with the uncommitted 004 work in the tree) reports 0 errors and 7 warnings in 3 files: `sections/header.liquid` ExcessiveSettingsCount, `snippets/divider.liquid` 5x UnusedDocParam, `snippets/product-media-gallery-content.liquid` LiquidComplexity. Done means no offence beyond these. `sections/header.liquid` keeps exactly one ExcessiveSettingsCount warning, and no new LiquidComplexity warning.
- **Do not undo 004.** Spec 004 is uncommitted in the working tree (`blocks/text.liquid`, `blocks/button.liquid`, `snippets/text-block-styles.liquid`, `config/settings_schema.json`, the locale files and others). This plan does not touch any 004 file except `config/settings_schema.json` (one appended group entry) and the locale files (keys added only).
- **No `shopify theme pull`.** `sections/header-group.json` and `sections/footer-group.json` have no local changes (`git diff` is clean). Edit them from the committed versions.

## Summary

All of G1 to G3 reuses existing Horizon sections and blocks. **One small new section** (`floating-cart`) is needed for the per-template floating cart button. The back-to-top button is a snippet rendered from the layout behind a global theme setting. Everything else is configuration plus backwards-compatible extensions:

1. **Announcement bar** (`header-announcements`, `_announcement`): add autoplay on/off, an underline for linked messages, arrows beside the message, a correct visible-message count (no bar at 0 messages, no arrows at 1), and in JS a pause on focus plus no autoplay under reduced motion.
2. **Header** (`header`, `header-actions`, `header-row`): an "Icon order" option (account, search, wishlist, cart), a hidden-by-default wishlist icon link (merchant URL, no count, A1/A2), and an account icon colour setting. The account button markup moves into a new snippet so it can sit before search. Sticky "scroll-up", divider, logo, menu, drawer and cart bubble are configuration only.
3. **Footer** (`footer` section → `group` → `accordion` → `_accordion-row` → `menu` blocks; brand row `group` → `logo` + `social-links`; `footer-utilities` → `footer-copyright`): `menu` gets link columns and "hide when empty". `_accordion-row` gets "open on home page" (A17) and "hide when empty". `social-links` gets a label ("Follow Us On") that hides with the icons. `footer-copyright` gets custom text after "© <current year>". `footer-utilities` gets a centre alignment.
4. **Floating cart** (A10): new `sections/floating-cart.liquid`. The merchant adds it to a template. It shows on mobile, and also on desktop when "Show on desktop" is on. It reuses `cart-icon` and `cart-bubble` (count stays in sync with no new JS) and opens the cart drawer through the existing `#cart-drawer/toggle` declarative call.
5. **Back to top** (A11): new `snippets/back-to-top.liquid` + `assets/back-to-top.js` (small `Component`), rendered in `layout/theme.liquid` when the new theme setting `show_back_to_top` is on (default on).

Colour note: this Horizon build uses per-section colour settings (`background_color`, `text_color`, palette references), not colour schemes. Every "colour scheme" in the spec ACs maps to these per-section colour settings.

## Decision table
Reuse ladder: 1 Configure → 2 Extend → 3 New block in existing section → 4 New section

| Spec section / AC | Ladder step | Existing base | Files to create/modify | Justification (why not a lower step) |
|---|---|---|---|---|
| AC1.1 bar above header on every page | 1 Configure | `header-announcements` in `header-group.json` (already first in `order`) | `sections/header-group.json` | The header group renders on every template. |
| AC1.2 add/remove/reorder messages, text + optional link | 1 Configure | `_announcement` (`text` inline_richtext, `link` url) | `sections/header-group.json` | Already blocks with text and link. |
| AC1.3 linked message underlined, unlinked plain | 2 Extend | `_announcement` overlays an invisible `<a>` on linked slides with no visual cue | `sections/header-announcements.liquid` | New section checkbox `underline_links` (default false = today) adds class `announcement-bar--underline-links`. CSS underlines `.announcement-bar__text` only in slides that contain `.announcement-bar__link`. Per section rather than per block, so one switch covers every message. |
| AC1.4 arrows either side of the centred message, wrap-around | 1 Configure + 2 Extend | arrows exist (`slideshow-arrows`, chevron); wrap-around exists in `announcement-bar.js` `current` setter; arrows sit at the page edges | `sections/header-announcements.liquid` | New select `arrows_position`: `edges` (default = today) / `beside_message`. `beside_message` limits `slideshow-arrows` to `inset-inline: max(0px, calc(50% - 340px - var(--button-size)))` at ≥750px (slides max-width is 680px), so the arrows sit about 360px from centre at 1920px, as in the mockup. Mobile keeps the edges. |
| AC1.5 one message → no arrows; AC1.6 zero → no bar | 2 Extend | arrows/autoplay keyed on `section.blocks.size > 1`, but `_announcement` skips blocks with blank text, so the count is wrong. With 0 blocks the `<aside>` still renders with padding (an empty strip). | `sections/header-announcements.liquid` | Count visible messages (`text | strip_newlines | strip_html | strip != ''`) once in Liquid and use that count for the script tag, autoplay and arrows. With a count of 0, output nothing (no `section-background`, no `<aside>`) on the storefront and in the editor. This is a bug fix for edge cases only; existing ≥2 and 1 message bars render the same. |
| AC1.7 autoplay on/off + interval; A19 5 s, pause on hover and focus | 2 Extend | `speed` range (2–10 s, default 5) exists; autoplay is forced on with ≥2 messages; JS pauses on hover only | `sections/header-announcements.liquid`, `assets/announcement-bar.js` | New checkbox `autoplay` (default true = today). It emits the `autoplay` attribute only when on. `speed` is `visible_if` autoplay. JS skips a tick while `:focus-within`, and `play()` returns early under `prefersReducedMotion()` (same accessibility fix as 004's `slideshow.js`). |
| AC1.8 bar colours editable, no brand text in code | 1 Configure | `background_color`, `_announcement.text_color`, typography | `sections/header-group.json` | Background `#F2F2F2` (B2 panel grey), 12px subheading font. Messages are template data. |
| AC1.9 arrows focusable with translatable labels | 1 Configure | `slideshow-arrow` buttons with `accessibility.slideshow_previous/next` | none | Existing translatable labels ("Previous slide" / "Next slide") count as "or equivalent". See Q2. |
| S1 mobile: messages never overlap the arrows, at most 2 lines | 2 Extend | `.announcement-bar__slides` width is already `calc(100% - 2 × button)` | `sections/header-announcements.liquid` | Add a `-webkit-line-clamp: 2` / `line-height: 1.3` rule below 750px for `.announcement-bar__text`. |
| AC2.1 logo left, menu next to it, icons right | 1 Configure | `header`: `logo_position: left`, `menu_position: left`, `menu_row: top` | `sections/header-group.json` | Already set in the committed group. |
| AC2.2 logo from editor, shop-name fallback | 1 Configure | `_header-logo` + theme settings `logo`, `logo_height` | none (`config/settings_data.json` is merchant data) | Horizon falls back to `shop.name`. |
| AC2.3 menu from a navigation menu | 1 Configure | `_header-menu.menu: main-menu` | `sections/header-group.json` | Menu items are Shopify navigation. Typography set to 0.75rem body, case none. |
| A18 sticky on scroll-up; announcement not sticky; dropdown/mega only with child links | 1 Configure | `enable_sticky_header: scroll-up`; the announcement is a separate section outside `header-component`; `_header-menu.menu_style` | `sections/header-group.json` | Horizon behaviour. Keep the existing `menu_style` (Horizon dropdown/mega). |
| AC2.4 icon order account, search, wishlist, cart | 2 Extend | `header-row` renders `search` and then `header-actions` (account, cart), so account always follows search | **new** `snippets/header-account.liquid`; `snippets/header-actions.liquid`, `snippets/header-row.liquid`, `sections/header.liquid` | New header select `icon_order`: `search_first` (default = today) / `account_first`. The account markup moves verbatim from `header-actions` into `header-account` (rendered by `header-actions` by default, so output is the same). With `account_first`, `header.liquid` captures `account` separately and passes `show_account: false` to `header-actions`, and `header-row` puts `account` before `search` in the right column (DOM order = visual order = focus order). A CSS `order`/`display: contents` trick was rejected because the focus order would no longer match the visual order (WCAG 1.3.2 / 2.4.3). |
| AC2.5 wishlist heart between search and cart, same size, hidden by default (A1/A2) | 2 Extend | none (no heart icon asset) | `snippets/header-actions.liquid`, `sections/header.liquid`, **new** `assets/icon-heart.svg` | New header settings `show_wishlist` (false) and `wishlist_url` (url). It renders `<a class="header-actions__action header-actions__wishlist">` before the cart only when `show_wishlist` is on and the URL is set. No count, no JS. The icon is an outline heart in the same 20×20 stroke style as `icon-cart.svg`. Any wishlist behaviour comes from an app (decisions A1). |
| Account icon permanent accent colour (Clarifications) | 2 Extend | `.header__row { --color-account-icon: var(--color-foreground) }` | `sections/header.liquid` | New header colour `account_icon_color` (blank = today). It sets `--header-account-icon-color` inline on `header-component`, and the row rule becomes `var(--header-account-icon-color, var(--color-foreground))`. See Q1 (header setting vs global theme setting). |
| AC2.6 cart bubble only at ≥1, live update | 1 Configure | `cart-bubble` + `cart-icon.js` (listens to `cartLinesUpdate`) | none | Built in. Above 99 Horizon shows a dot, not "99+" (Q3). |
| AC2.7 thin divider under header | 1 Configure | `border_width`, `bottom_border_color` | `sections/header-group.json` | `border_width: 1`, palette `color2`. It applies on every template, including home (Q4). |
| AC2.8 header colours editable, default white/dark | 1 Configure | `background_color_top`, `text_color_top` | `sections/header-group.json` | Already palette background / foreground. |
| AC2.9 mobile drawer with every menu item | 1 Configure | `header-drawer` from the same `_header-menu` | none | Built in. |
| AC2.10 icons keyboard reachable with translatable labels | 2 Extend (wishlist only) | search, account and cart already have labels | `snippets/header-actions.liquid` | Wishlist link uses new key `accessibility.wishlist`. |
| AC3.1 footer order: accordions, brand row, copyright bar | 1 Configure | `footer` section (blocks `group`, `logo`, `social-links`, `menu`…), `footer-utilities` | `sections/footer-group.json` | One top-level `group` (column) inside `footer`. A single top-level block keeps `.footer-content` at 1 column. If the blocks sat directly in the footer, each would become a grid column. The group holds an `accordion` (public, allowed through the group's `@theme`), then a brand-row `group`. `footer-utilities` follows with `footer-copyright` only. `email-signup` and the policy list are removed (not in the mockups). |
| AC3.2 three ordered, editable, add/remove/reorder groups | 1 Configure | `accordion` → `_accordion-row` (heading, caret, dividers, `<details>`) | `sections/footer-group.json` | Rows are blocks the merchant can edit, reorder and remove. |
| AC3.3 links from merchant menus | 1 Configure | `menu` block (`link_list`) inside `_accordion-row` (`@theme`) | `sections/footer-group.json` | Each sub-group is a `menu` block. Its heading falls back to the menu title. |
| AC3.4 sub-group headings + 4-column link grid on desktop | 2 Extend | `menu` renders a vertical list | `blocks/menu.liquid` | New `columns` (range 1–6, default 1 = today) and `columns_mobile` (range 1–2, default 1). Above 1 they add class `menu--columns` and vars `--menu-columns` / `--menu-columns-mobile`. CSS: `ul` becomes a grid; `.menu__item + .menu__item` margin is reset to 0 and `row-gap: var(--spacing--size)` is used instead; 1 column below 360px. |
| Spec: sub-group with no links hides its heading | 2 Extend | `menu` renders when `menu != blank or heading != blank` | `blocks/menu.liquid` | New checkbox `hide_when_empty` (default false = today). When on, the block renders nothing if `menu == blank or menu.links.size == 0`. |
| Spec: group with no links not rendered | 2 Extend | `_accordion-row` always renders | `blocks/_accordion-row.liquid` | New checkbox `hide_when_empty` (default false = today). When on, and `request.design_mode` is false, the row captures `content_for 'blocks'` first and renders nothing if the captured output is blank after `strip`. In the editor the row still renders so the merchant can select it. |
| AC3.5 toggle by click/keyboard, expanded state exposed, chevron | 1 Configure | native `<details>`/`<summary>` in `accordion-custom`; `icon-caret icon-animated` | none | Native disclosure semantics expose expanded state. |
| AC3.6 / A17 per-group default; home open, other templates closed | 2 Extend | `_accordion-row.open_by_default` (checkbox, same on every template, desktop and mobile) | `blocks/_accordion-row.liquid` | The footer group is shared by every template, so a per-template default needs a template condition. New checkbox `open_on_home_page` (default false, `visible_if: open_by_default == false`). Desktop open = `open_by_default or (open_on_home_page and template.name == 'index')`; the server-side `open` attribute uses the same rule. Mobile open stays `open_by_default` (C1: collapsed on mobile). Existing rows render the same. |
| AC3.7 collapsed links present in the HTML | 1 Configure | `<details>` content is server-rendered; `accordion-custom` only toggles `open` | none | Links are in the DOM, and not focusable while closed. |
| AC3.8 footer logo + shop-name fallback | 1 Configure | `logo` block | `sections/footer-group.json` | Uses the store logo and falls back to the shop name. |
| AC3.9 "Follow Us On" label, icons only with URL, FB/IG/YT order, label hidden with no icons | 2 Extend | `social-links` (fixed order facebook, instagram, youtube…; storefront skips URLs without a profile path; `target="_blank"`) | `blocks/social-links.liquid` | New `label` text setting (blank = today). The icon loop is captured first. The label renders as `<span class="social-icons__label">` before the icons only when the captured icons are not blank, so with no URLs the label is hidden too. A separate `text` block cannot know whether any icon rendered. |
| AC3.10 copyright editable, centred, own bar | 2 Extend | `footer-copyright` prints `© year shop-link` + optional "Powered by"; `footer-utilities` left-aligns a single block | `blocks/footer-copyright.liquid`, `sections/footer-utilities.liquid` | `footer-copyright`: new `copyright_text` (text, blank = today's shop-name link). When set, it outputs `© {{ 'now' | date: '%Y' }} {{ copyright_text }}`, so the year stays current (Clarifications). `footer-utilities`: new `alignment` select `default` (today) / `center`, which adds class `utilities--center` (single column, centred). The divider is the existing `divider_thickness` top border. |
| AC3.11 footer colours, default light grey | 1 Configure | `footer.background_color`, `footer-utilities.background_color` | `sections/footer-group.json` | Both set to `#F2F2F2` (B2). Text uses contrast-override. |
| AC3.12 mobile ≤2 link columns, brand row stacks | 1 Configure + 2 Extend | `columns_mobile` (above); `group.vertical_on_mobile` | `sections/footer-group.json` | Brand-row group `vertical_on_mobile: true`. |
| S3 brand row: logo left, label + icons right | 1 Configure | `group` (row, `space-between`, `center`) | `sections/footer-group.json` | — |
| AC4.1 / A10 floating cart, per template, fixed right edge; default on for Shop by Video only; mobile-only elsewhere | **4 New section** | none. `header-actions` cart is inside the header; no section or block is a page-level fixed overlay. | **new** `sections/floating-cart.liquid` | "Per template" means it must live in template JSON, not in a header/footer group (those are global). A public theme block placed in the generic `section`/`_blocks` wrapper would leave an empty padded row in the page flow. It would also show up in every `@theme` block picker (cards, groups, slides), where a fixed cart overlay makes no sense. A section with no layout of its own is the smallest correct unit. It reuses `cart-icon` + `cart-bubble` and the existing `#cart-drawer/toggle` call, so no JS is added. Setting `show_on_desktop` (default false: mobile only, A10). The Shop by Video template (spec 007, on hold) adds this section with `show_on_desktop: true`. No template gets it now. |
| AC4.2 floating count matches header, live, hidden at 0 | 2 Extend | `cart-bubble` has a hard-coded `id="cart-bubble-text"`, so a second copy would duplicate the id | `snippets/cart-bubble.liquid` | New optional `@param id` (default `cart-bubble-text` = today). The floating cart passes `floating-cart-bubble-{{ section.id }}` and points its `aria-describedby` at it. `cart-icon.js` updates every `<cart-icon>` from `cartLinesUpdate`. |
| AC4.3 / A11 back to top, global, on by default, after ~1 viewport, smooth unless reduced motion, focus to top | 3-equivalent (new snippet + component, no section) | none | **new** `snippets/back-to-top.liquid`, **new** `assets/back-to-top.js`; `layout/theme.liquid`, `config/settings_schema.json` | A sitewide on/off belongs in theme settings, and the layout is the only place that renders on every template without merchant set-up. Putting it in the footer group would let a merchant delete it with the footer. No section is needed. |
| AC4.4 keyboard operable, labels, never overlap each other or sticky add-to-cart | 2 Extend (CSS) | sticky ATC bar is `position: fixed` with `[data-stuck='true']` | `snippets/back-to-top.liquid`, `sections/floating-cart.liquid` | Shared CSS custom properties `--floating-button-size` (56px desktop / 48px mobile), `--floating-button-inset` (24px / 16px), `--floating-button-gap` (12px). Floating cart: desktop vertically centred (mockup), mobile bottom-right. Back-to-top: bottom-right; below 750px `body:has(.floating-cart)` raises it by size + gap. `body:has(.sticky-add-to-cart__bar[data-stuck='true'])` raises both bottom-anchored buttons by `--floating-sticky-offset` (88px mobile / 96px desktop). Labels: `accessibility.cart` (reused), `accessibility.back_to_top` (new). |

## Schema changes
All labels, info and options use the `t:` keys listed under Locale keys.

### `sections/header-announcements.liquid`
| id | type | default | notes |
|---|---|---|---|
| `autoplay` | checkbox | true | Insert before `speed`. With false, the `autoplay` attribute and `aria-live` are not emitted. |
| `speed` | range (existing) | 5 | Add `"visible_if": "{{ section.settings.autoplay }}"`. |
| `arrows_position` | select `edges` / `beside_message` | `edges` | Under the Appearance header. Class `announcement-bar--arrows-beside` on `.announcement-bar`. |
| `underline_links` | checkbox | false | Class `announcement-bar--underline-links`. CSS: `.announcement-bar--underline-links .announcement-bar__slide:has(.announcement-bar__link) .announcement-bar__text { text-decoration: underline; text-underline-offset: 0.2em; }` |

Liquid: before any output, loop `section.blocks` and count `visible_count` with the same blank-text test as `_announcement`. `if visible_count == 0` → render nothing. Script tag, arrows and autoplay use `visible_count > 1`, plus `section.settings.autoplay` for autoplay.

### `blocks/_announcement.liquid`
No change. Its `block_index` for the first `aria-hidden="false"` uses `section.blocks`. If the first block has blank text, no slide starts visible. The builder fixes this only if it is cheap (by computing the first visible index in the section and passing nothing extra). Otherwise record it as a known edge case in Implementation notes.

### `sections/header.liquid` (schema settings; append to the existing groups)
| id | type | default | placement / notes |
|---|---|---|---|
| `icon_order` | select `search_first` / `account_first` | `search_first` | After `customer_account_menu` (Customer account group). Only has an effect when customer accounts are on and search is shown in the top row on the right. |
| `show_wishlist` | checkbox | false | New header `t:content.wishlist` after the Search group. |
| `wishlist_url` | url | — | `visible_if: show_wishlist`; info `t:info.wishlist_url`. |
| `account_icon_color` | color | — (blank) | In the existing top-row colour group after `text_color_top`. |

Liquid (keep additions small; ExcessiveSettingsCount stays one warning, and there must be no LiquidComplexity warning):
- `if section.settings.icon_order == 'account_first' and shop.customer_accounts_enabled` → `capture account` = `render 'header-account', customer_account_menu: …, display_style: …, section: section`; pass `show_account: false` to `header-actions`.
- Pass `show_wishlist`, `wishlist_url` to `header-actions`, and `account: account` to `header-row`.
- On `header-component` style: `{% if section.settings.account_icon_color != blank %}--header-account-icon-color: {{ … }};{% endif %}`. In the `.header__row` rule: `--color-account-icon: var(--header-account-icon-color, var(--color-foreground));`.

### `snippets/header-account.liquid` (new)
`{% doc %}` params: `section` (object, optional), `display_style` (string), `customer_account_menu` (string). Body: the `{% if shop.customer_accounts_enabled %}` account `<div class="account-button header-actions__action …">…</div>` block and the `account_icon` SVG capture, moved **verbatim** from `header-actions`. No stylesheet move: the `.account-button` CSS stays in `header-actions` (bundled globally).

### `snippets/header-actions.liquid`
New optional params (update `{% doc %}`): `show_account` (boolean, default true), `show_wishlist` (boolean, default false), `wishlist_url` (string).
- Replaces the inline account markup with `{% unless show_account == false %}{% render 'header-account', … %}{% endunless %}`.
- After the account and before the cart: when `show_wishlist and wishlist_url != blank`, render `<a href="{{ wishlist_url }}" class="header-actions__action header-actions__wishlist" aria-label="{{ 'accessibility.wishlist' | t }}"><span class="svg-wrapper" aria-hidden="true">{{ 'icon-heart.svg' | inline_asset_content }}</span></a>`. Text display style: show `{{ 'content.wishlist' | t }}` like the cart does (`hidden` / `mobile:hidden` spans).
- With the defaults, the output must be the same as today, apart from whitespace.

### `snippets/header-row.liquid`
New optional param `account` (string, captured markup; add to `{% doc %}`). When `account != blank`: in the right-column build, insert the key `account` right before `search` if `search` is in this row's right column, otherwise right before `actions`. Add `{% when 'account' %}{{ account }}`. With no `account`, nothing changes.

### `assets/icon-heart.svg` (new)
`<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--icon-stroke-width)" d="…outline heart…"/></svg>`, visually the same weight as `icon-cart.svg`.

### `blocks/menu.liquid`
| id | type | default | notes |
|---|---|---|---|
| `columns` | range 1–6, step 1 | 1 | After `menu_spacing`. Above 1: class `menu--columns`, `--menu-columns: n`. |
| `columns_mobile` | range 1–2, step 1 | 1 | `visible_if: columns > 1`. `--menu-columns-mobile`. |
| `hide_when_empty` | checkbox | false | info `t:info.menu_hide_when_empty`. |

CSS (in the block's `{% stylesheet %}`): `.menu--columns .details-content > ul { display: grid; grid-template-columns: repeat(var(--menu-columns-mobile, 1), minmax(0, 1fr)); column-gap: var(--gap-xl); row-gap: var(--spacing--size); }` and `@media (min-width: 750px)` → `repeat(var(--menu-columns), …)`, `@media (max-width: 359px)` → 1 column, `.menu--columns .menu__item + .menu__item { margin-block-start: 0; }`.

### `blocks/_accordion-row.liquid`
| id | type | default | notes |
|---|---|---|---|
| `open_on_home_page` | checkbox | false | After `open_by_default`, `visible_if: open_by_default == false`, info `t:info.open_on_home_page`. |
| `hide_when_empty` | checkbox | false | info `t:info.accordion_row_hide_when_empty`. |

Logic: `assign open_desktop = block_settings.open_by_default`; `if block_settings.open_on_home_page and template.name == 'index'` → `open_desktop = true`. The `<details>` gets `open` when `open_desktop`. `accordion-custom-component` gets `open_by_default_on_desktop: open_desktop` and `open_by_default_on_mobile: block_settings.open_by_default` (unchanged). For hide-when-empty, capture `content_for 'blocks'` into `row_content` before building `accordion_row_children`, then output `{{ row_content }}` inside `.details-content`. That is the same HTML as today. Skip rendering when `hide_when_empty and request.design_mode == false and row_content stripped == blank`.

### `blocks/social-links.liquid`
| id | type | default | notes |
|---|---|---|---|
| `label` | text | — (blank) | First setting. |

Capture the `{% for link_key in social_links %}` output as `icons`. Output `<span class="social-icons__label">{{ label | escape }}</span>` (only if `label != blank and icons stripped != blank`), then `{{ icons }}`. CSS: wrapper `align-items: center`; label uses `--font-paragraph--*` at 0.75rem and `color: var(--color-utilities, currentColor)`. With a blank label the markup is unchanged.

### `blocks/footer-copyright.liquid`
| id | type | default | notes |
|---|---|---|---|
| `copyright_text` | text | — (blank) | Before the `manage_store_name` paragraph; info `t:info.copyright_text`. |

If set: `&copy; {{ 'now' | date: '%Y' }} {{ block_settings.copyright_text | escape }}` (the shop link is dropped; Powered-by still follows `show_powered_by`). Blank → today's output.

### `sections/footer-utilities.liquid`
| id | type | default | notes |
|---|---|---|---|
| `alignment` | select `default` / `center` | `default` | After `gap`. `center` adds class `utilities--center`: `grid-template-columns: 1fr; justify-items: center; > * { justify-self: center; text-align: center; }` at ≥750px. |

### `snippets/cart-bubble.liquid`
New optional `@param {string} [id]`, default `cart-bubble-text`. It replaces the literal `id="cart-bubble-text"`.

### `sections/floating-cart.liquid` (new)
```
name: t:names.floating_cart, tag: "div", class: "floating-cart-section"
enabled_on: { templates: ["*"] }
settings:
  paragraph  content: t:info.floating_cart
  show_on_desktop  checkbox  default false   t:settings.show_on_desktop
presets: [{ name: t:names.floating_cart }]
```
Markup (render nothing when `template.name == 'cart'`):
- `<script type="module" src="{{ 'cart-icon.js' | asset_url }}" fetchpriority="low">`
- `<div class="floating-cart{% if section.settings.show_on_desktop %} floating-cart--desktop{% endif %}" {{ section.shopify_attributes }}>`
- If `settings.cart_type == 'drawer'`: `<button type="button" class="floating-cart__button button-unstyled" on:click="#cart-drawer/toggle" aria-haspopup="dialog" aria-controls="cart-drawer" aria-label="{{ 'accessibility.cart' | t }}" aria-describedby="floating-cart-bubble-{{ section.id }}">`. Otherwise an `<a href="{{ routes.cart_url }}">` with the same label.
- Inside: `<cart-icon class="floating-cart__icon"><span class="svg-wrapper" aria-hidden="true">{{ 'icon-cart.svg' | inline_asset_content }}</span>{% render 'cart-bubble', limit: 100, id: … %}</cart-icon>`.

CSS: `.floating-cart { position: fixed; z-index: var(--layer-heightened); inset-inline-end: var(--floating-button-inset, 16px); inset-block-end: calc(var(--floating-button-inset, 16px) + var(--floating-sticky-offset-current, 0px)); }`. Button is a 48px circle (56px ≥750px), `background: var(--color-background)`, `border: 1px solid var(--color-border)`, icon `var(--icon-size-md)`, bubble absolutely top-right like `.header-actions__cart-icon .cart-bubble`. `@media (min-width: 750px)`: `.floating-cart:not(.floating-cart--desktop) { display: none }`, `.floating-cart--desktop { inset-block: 50% auto; transform: translateY(-50%); }`. `.shopify-section:has(> .floating-cart-section)` needs no layout. The section outputs no in-flow box. Hover is a border colour change, and there is no animation.

### `snippets/back-to-top.liquid` (new)
`{% doc %}` (no params). Markup: `<script type="module" src="{{ 'back-to-top.js' | asset_url }}" fetchpriority="low"></script>` then `<back-to-top-button class="back-to-top" inert><button type="button" class="back-to-top__button button-unstyled" on:click="/scrollToTop" aria-label="{{ 'accessibility.back_to_top' | t }}"><span class="svg-wrapper icon-caret" aria-hidden="true">{{ 'icon-caret.svg' | inline_asset_content }}</span></button></back-to-top-button>`.
CSS (`{% stylesheet %}`): defines `:root { --floating-button-size: 48px; --floating-button-inset: 16px; --floating-button-gap: 12px; --floating-sticky-offset: 88px }` and desktop overrides (56px / 24px / 96px), plus `body:has(.sticky-add-to-cart__bar[data-stuck='true']) { --floating-sticky-offset-current: var(--floating-sticky-offset); }`. Button: fixed bottom-right, a circle with `background: var(--color-foreground)`, `color: var(--color-background)`, caret rotated to point up. Hidden state: `opacity: 0; visibility: hidden` until `[data-visible]` (transition off under reduced motion). Below 750px: `body:has(.floating-cart) .back-to-top { inset-block-end: calc(inset + size + gap + sticky offset) }`. At ≥750px the same applies only for a bottom-anchored desktop cart; the desktop cart is centred, so no rule is needed.

### `config/settings_schema.json`
Append to the `t:names.page_layout` group (after `page_width`): header `t:content.back_to_top`, then checkbox `show_back_to_top` (default **true**, label `t:settings.show_back_to_top`). `config/settings_data.json` is not edited; the default applies.

### `layout/theme.liquid`
After `</footer>` and before the closing wrapper `</div>`: `{% if settings.show_back_to_top %}{% render 'back-to-top' %}{% endif %}`. This is the only layout change.

## Locale keys
Add to `en.default*` first, then (last task) sync every new key with the English text into all other `locales/*.json` (storefront keys) and `locales/*.schema.json` (schema keys), as 004 did, so MatchingTranslations stays clean. No merchant copy in any locale file.

`en.default.schema.json` (new; "reuse" = already exists):

| Group | Key | English |
|---|---|---|
| names | `floating_cart` | Floating cart button |
| content | `wishlist` | Wishlist |
| content | `back_to_top` | Back to top button |
| options | `page_edges` | Page edges |
| options | `beside_message` | Beside message |
| options | `search_account_cart` | Search, account, wishlist, cart |
| options | `account_search_cart` | Account, search, wishlist, cart |
| settings | `underline_links` | Underline messages with a link |
| settings | `icon_order` | Icon order |
| settings | `show_wishlist` | Show wishlist icon |
| settings | `wishlist_url` | Wishlist link |
| settings | `account_icon_color` | Account icon color |
| settings | `hide_when_empty` | Hide when empty |
| settings | `open_on_home_page` | Open by default on home page |
| settings | `copyright_text` | Copyright text |
| settings | `show_on_desktop` | Show on desktop |
| settings | `show_back_to_top` | Show back to top button |
| info | `wishlist_url` | Link to your wishlist app's page. No count is shown. |
| info | `menu_hide_when_empty` | Hide the heading when the menu has no links. |
| info | `accordion_row_hide_when_empty` | Hide the row on the storefront when it has no content. |
| info | `open_on_home_page` | Desktop only. On mobile, rows start closed. |
| info | `copyright_text` | Shown after © and the current year. Leave empty to show the store name. |
| info | `floating_cart` | Always shown on mobile. Opens the cart drawer when the cart type is Drawer. |

Reused (no change): `settings.autoplay`, `settings.scroll_speed`, `settings.arrows_position`, `settings.label`, `settings.columns`, `settings.mobile_columns` (label for `menu.columns_mobile`), `settings.alignment`, `options.default`, `options.center`, `settings.open_row_by_default`.

`en.default.json`:

| Group | Key | English |
|---|---|---|
| accessibility | `wishlist` | Wishlist |
| accessibility | `back_to_top` | Back to top |
| content | `wishlist` | Wishlist |

Reused: `accessibility.cart`, `accessibility.slideshow_previous` / `slideshow_next`, `content.cart_title`.

## JavaScript
**Modified: `assets/announcement-bar.js`**
- Import `prefersReducedMotion` from `@theme/utilities`.
- `play()`: `if (!this.autoplay || prefersReducedMotion()) return;`
- In the interval callback: `if (this.matches(':hover') || this.matches(':focus-within') || document.hidden) return;` (pause on focus, A19). Manual arrows keep working. No new events, and no API change.

**New: `assets/back-to-top.js`**: `class BackToTop extends Component`, registered as `back-to-top-button` with the `customElements.get` guard. JSDoc strict.
- `connectedCallback`: a passive `scroll` listener throttled with `requestAnimationFrame` calls `#update()`, which runs `this.toggleAttribute('data-visible', window.scrollY > window.innerHeight)` and sets `this.inert = !visible` (not focusable while hidden). Run once on connect. Remove the listener in `disconnectedCallback`.
- `scrollToTop()` (`on:click`): `window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })`. Then move focus to the top: set `tabindex="-1"` on `document.body`, call `focus({ preventScroll: true })`, and remove the tabindex on `blur` (once). The next Tab reaches the skip link.
- Imports: `Component` from `@theme/component`, `prefersReducedMotion` from `@theme/utilities`. Not added to the import map (nothing imports it); loaded by a script tag from the snippet.

**Reused, unchanged:** `cart-icon.js` (floating cart bubble via `StandardEvents.cartLinesUpdate`), the cart drawer `toggle` through `on:click="#cart-drawer/toggle"` (document-level delegation in `component.js`), `accordion-custom.js`, `header.js`, `header-actions.js` (its `aria-expanded` sync only looks inside `<header-actions>`, so the floating button carries no `aria-expanded`).

**Not touched:** `component.js`, `morph.js`, `section-renderer.js`, `utilities.js`, `base.css`.

## Template JSON changes
Edit the committed files. Keep the auto-generated header comment. Only the keys below change. Validate every id and option value against the schemas (the 004 approach).

### `sections/header-group.json`
- `header_announcements_9jGBFp` → settings: `autoplay: true`, `speed: 5`, `arrows_position: "beside_message"`, `underline_links: true`, `section_width: "page-width"`, `background_color: "#F2F2F2"`, `divider_width: 0`, padding 12/12. Replace the single block with two `_announcement` blocks (12px subheading font, case none): (1) `text: "0% EMI on UPI"`, no link; (2) `text: "A/W 26 Is Live - Shop Now"`, `link: "shopify://collections/all"`. Placeholder copy with no brand words. The merchant edits it.
- `header_section` → settings: `enable_sticky_header: "scroll-up"`, `border_width: 1`, `bottom_border_color: "{{ settings.color_palette.color2 }}"`, `icon_order: "account_first"`, `show_wishlist: false`, `account_icon_color: "#D89B2B"` (accent close to the mockup's orange/gold), `show_country: false`, `show_language: false` (the mockups show no localisation in the header; the merchant can turn them back on). Keep `logo_position: left`, `menu_position: left`, `section_height: standard`.
- `header-menu` block → `type_font_primary_size: "0.75rem"`, `type_font_primary_link: "body"`, `type_case_primary_link: "none"`. Other settings unchanged.

### `sections/footer-group.json`
- `footer_m9NzUG` (footer) → settings: `section_width: "page-width"`, `gap: 0`, `background_color: "#F2F2F2"`, padding 0/0. Blocks (replace `group_H6VpwJ` and `email_signup_crihX7`):
  - `footer_stack` `group` (column, `width: fill`, gap 0):
    - `footer_links` `accordion` (`icon: caret`, `dividers: true`, `divider_color: "{{ settings.color_palette.color2 }}"`, `type_preset: "h6"`, padding 0).
      - `row_top_searched` `_accordion-row` (`heading: "Top Searched"`, `open_by_default: false`, `open_on_home_page: true`, `hide_when_empty: true`). Children: four `menu` blocks `menu_category`, `menu_featured`, `menu_editorial`, `menu_others` (`menu: ""`, `heading: ""` so the menu title is used, `columns: 4`, `columns_mobile: 2`, `hide_when_empty: true`, `show_as_accordion: false`, `heading_preset: "h6"`, `link_preset: "paragraph"`, `menu_spacing: 12`).
      - `row_purposeful_picks` `_accordion-row` (`heading: "Purposeful Picks"`, same flags). One `menu` block (`menu: ""`, `columns: 4`, `columns_mobile: 2`, `hide_when_empty: true`, `heading_preset: ""`).
      - `row_get_support` `_accordion-row` (`heading: "Get Support"`, same flags). One `menu` block (`menu: "footer"`, Horizon's default footer menu, same column settings).
    - `footer_brand_row` `group` (row, `horizontal_alignment: space-between`, `vertical_alignment: center`, `vertical_on_mobile: true`, gap 16, padding 32/32):
      - `footer_logo` `logo` (`unit: pixel`, `pixel_height: 32`).
      - `footer_social` `social-links` (`label: "Follow Us On"`, `facebook_url`, `instagram_url`, `youtube_url` kept as the existing generic placeholders, `tiktok_url` / `twitter_url` removed). Storefront skips URLs without a profile path, so nothing shows until the merchant enters real profiles.
- `footer_utilities_jLGE8U` → settings: `alignment: "center"`, `background_color: "#F2F2F2"`, `divider_thickness: 1`, padding 20/20. Blocks: keep `footer_copyright_jweRK8` only (`show_powered_by: false`, `font_size: "0.625rem"`, `copyright_text: ""`, so the shop name is used until the merchant types the company line). Remove `footer_policy_list_VCdnpa` and `social_links_Ew63Kq` from `blocks` and `block_order`.

Brand words ("Miraggio" in "Top Searched on Miraggio", the company name in the copyright, the logo) are **not** written into JSON. They go on the merchant content checklist.

### `templates/*.json`
No change. The floating cart is added per template by the merchant. **When spec 007 creates `templates/page.shop-by-video.json`, it must include a `floating-cart` section with `show_on_desktop: true`** (recorded in `.claude/progress.md`).

## Risks / backwards compatibility
- **R1 Header refactor.** Moving the account markup into `header-account` must leave the default output unchanged (`icon_order: search_first`, no wishlist). The builder diffs the rendered markup by reading both versions. `header-row` only changes when `account` is passed.
- **R2 `sections/header.liquid` Theme Check.** It already has ExcessiveSettingsCount (one warning, so four more settings do not add a warning). Keep the Liquid additions to a few `assign`/`capture` lines so LiquidComplexity is not triggered. The column logic lives in `header-row`.
- **R3 Editor-owned group JSON.** Both files are clean against HEAD. Edit the committed versions. A later editor save or `theme pull` could overwrite them, so commit soon after review. Never run `theme pull` while 004 and 001 are uncommitted.
- **R4 Footer looks empty until menus are set.** With `hide_when_empty`, rows with no menu links are hidden on the storefront. Only "Get Support" shows (using the default `footer` menu) until the merchant creates and assigns the "Shop by Category / Featured Collections / Editorial / Others / Purposeful Picks" menus. In the editor every row stays visible.
- **R5 Floating button offsets** for the sticky add-to-cart bar are fixed estimates (88/96px), because CSS cannot measure the bar. Needs a visual check on the PDP. They are custom properties, so they are easy to tune.
- **R6 Announcement edge-case changes:** blocks with blank text no longer count toward arrows/autoplay, and a bar with no visible messages renders nothing (spec AC1.6). Bars with 1 or more real messages are unchanged.
- **R7 `announcement-bar.js`:** under reduced motion the bar no longer autoplays (arrows still work), and focus inside the bar pauses rotation. Both are accessibility fixes, consistent with 004 R3.
- **R8 Nested `accordion-custom`.** `menu` blocks inside `_accordion-row` are themselves `accordion-custom` elements (disabled on desktop; with `show_as_accordion: false` they are also disabled and open on mobile). The outer element's `this.querySelector('details')` returns its own `<details>` first (document order), so the toggling is correct. Visual check: the sub-group heading is a `<summary>` with `cursor: auto`, as in stock Horizon footers.
- **R9 `open_on_home_page`** is desktop-only by design (C1 mobile collapsed). `accordion-custom` resets `open` when the breakpoint changes.
- **R10 Footer dividers** stop at the page gutter (`page-width`), while the mockup lines look full-bleed. Accepted as a minor deviation. A full-bleed version would need `full-width` plus inline padding on the rows. Visual check.
- **R11 Mobile header crowding** with account, wishlist and cart icons, plus the hamburger and search. The wishlist is off by default. Visual check at 360px.
- **R12 Cart drawer layering.** The drawer is a modal dialog in the top layer, so the fixed buttons sit under it. Confirm visually that neither button covers the drawer or quick-add modal.
- **R13 Shared blocks changed** (`menu`, `_accordion-row`, `social-links`, `footer-copyright`, `footer-utilities`, `cart-bubble`, `header-actions`, `header-row`, `header-announcements`): every new setting defaults to today's output. Usages to re-check: `_product-details` and the `section` preset use `accordion`/`_accordion-row`; `footer-group.json` and the header use the others.

### Open questions (non-blocking; recommended defaults applied)
- **Q1 Account icon colour location.** Planned as a header section setting (`account_icon_color`) next to the other header colours, rather than in global Theme settings. Recommended: keep it in the header. Moving it to `config/settings_schema.json` is a two-line change if the user prefers.
- **Q2 Arrow labels.** Reuse "Previous slide" / "Next slide" (already translated in every locale). Spec wording "Previous announcement" would need new params on the shared `slideshow-arrow(s)` snippets. Recommended: reuse.
- **Q3 Cart bubble above 99.** Horizon shows a dot with no number (`limit: 100`), not "99+". The spec marks this as an `[ASSUMPTION]`, not an AC. Recommended: keep Horizon's behaviour.
- **Q4 Header divider on home.** One `border_width` setting applies on every template, so home gets the divider too. AC2.7 allows that. Recommended: keep it on.
- **Q5 Account/cart visibility toggles.** No new switches. Account follows "Customer accounts" in Shopify admin, and the cart is always shown. Only the wishlist gets a toggle (AC2.5). Recommended: accept.
- **Q6 Localization selectors** are turned off in the header group to match the mockups. Recommended: accept; the merchant can turn them back on.
