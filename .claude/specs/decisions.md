# Cross-spec decisions

This file collects every `[NEEDS CLARIFICATION]` from specs 001–007. Each item has a **proposed default**. Once the user approves, these answers are copied into each spec's "Clarifications log" and the specs are set to `Approved`.

Status: **Awaiting user edits and approval**. The user is reviewing this file. Do not approve the specs or start planning until the user says so.

## Guiding principle (user, 2026-11-19)
> Build a feature in the theme only when it can be built easily and works effectively there. Otherwise leave it for a Shopify app and don't build it now.

Practical test for each feature: it needs no secret keys, no server or database, and no third-party data. It is pure presentation over Shopify data (products, collections, media, metafields, cart). If it fails the test, it goes to an app, and the theme provides at most an `@app` block slot.

| Feature | Verdict |
|---|---|
| Wishlist (hearts, page, count) | **App later.** The theme provides `@app` block slots plus a hidden header icon link. |
| Pincode delivery check | **Skipped for now** |
| EMI / pay-later line | **App, proposed.** Providers ship their own widget. Confirm in A6. |
| Shoppable video | **Theme, proposed.** See A7–A9 |
| Everything else (badges, swatches, carousels, tabs, banners, promo tiles, footer, floating cart, back to top, recently viewed) | Theme |

## A. Product and functional decisions (they change what gets built)

| # | Question | Decision / proposed default | Specs |
|---|---|---|---|
| A1 | Wishlist | **DECIDED: wishlist app later.** Not built. The theme keeps `@app` block slots (card media, PDP buy area) and a header heart icon linked to a merchant-set URL, hidden by default. | 002, 001, 006 |
| A2 | Wishlist header count | **DECIDED: no theme count**. The app handles it. | 002, 001 |
| A3 | Badge source | SOLD OUT is automatic (no variant available). ONLY FEW LEFT is automatic (total stock ≤ a threshold set in theme settings, default 5; tracked stock only). NEW and BESTSELLER come from product tags `badge:new` / `badge:bestseller`. Optional custom text from product metafield `custom.badge`. Priority: SOLD OUT > ONLY FEW LEFT > custom > NEW > BESTSELLER. The PDP uses the same source. | 002, 006 |
| A4 | Discount % rounding | Round to the nearest whole number (matches every mockup value). Used everywhere: cards, PDP, video tiles. | 002, 003, 006 |
| A5 | Pincode check | **DECIDED: skipped for now.** No pincode block is built. | 006 |
| A6 | EMI line | **Proposed: leave it to the pay-later provider's app.** Snapmint, Simpl and similar apps ship their own PDP widget as an app block, which drops into the `@app` slot in the buy area. (Alternative: a static text line with ₹price÷N and a link, which is easy but can show wrong terms.) | 006 |
| A7 | Video source | **Proposed: theme-native, using Shopify-hosted video.** See "Shoppable video proposal" below. | 003, 007 |
| A8 | Video playback | **Tiles autoplay (user confirmed).** Tiles autoplay muted, looped and inline only while on screen, with at most 4 playing at once. With reduced motion or data-saver, a still poster shows instead. | 003 |
| A9 | Video tile click | **CLARIFIED by user:** popup with one active, focused reel in the centre, previous and next reels peeking left and right behind it, Prev/Next buttons, and Add to cart. Spec 003 S4 has been rewritten to match. | 003 |
| A10 | Floating cart button | Owned by 001 S4. Turned on per template and shown on Shop by video by default. Shows with no bubble when the cart is empty. Opens the cart drawer. Hidden on desktop on other templates. | 001, 003, 007 |
| A11 | Back-to-top button | A global setting, on by default, shown after scrolling about 1 viewport height. | 001 |
| A12 | Collection pagination | "Load more" button, 24 products per page | 005 |
| A13 | Collection promo tiles | 2 columns × 1 row (as in the mockup). Image or video. Position set per tile. Hidden if the position is past the last product. Stays visible while filtering. | 005 |
| A14 | Filters | Drawer from the right. Applies instantly (Horizon default). "Clear all" when 2 or more chips are active. | 005 |
| A15 | "You may also like" tabs | Each tab is a collection picked by the merchant; the first tab can be "Related products" (Shopify recommendations) | 006 |
| A16 | Most-loved styles: "Shop all" link | Follows the active tab's collection. Empty tabs are hidden. | 004 |
| A17 | Footer accordions | Open or closed is a per-group setting. Home shows them open, other templates closed (as in the mockups). Links stay in the HTML. | 001 |
| A18 | Header behaviour | Sticky on scroll-up (Horizon option). Menu items can carry Horizon's existing dropdown/mega menu if the merchant adds child links. | 001 |
| A19 | Announcement bar | Rotates automatically every 5 s; pauses on hover and focus; arrows for manual control | 001 |
| A20 | Key features and accordion content | Key features from the product metafield `custom.key_features` (list). "Why you'll love it" uses the product description. Details and More info use metafields. "Shipping & returns" is a shared rich-text setting. | 006 |
| A21 | "Important update" band | Home only (a section in the home template) | 004 |

## Shoppable video proposal (A7–A9): ON HOLD (user is discussing with the merchant; specs 003 and 007 stay Draft)

**Why the theme rather than a video app.** The reference site's popup probably comes from a video-commerce app (Tolstoy, Whatmore, Firework or similar). Those cost a monthly fee and load a heavy third-party script on every page, and their player sits outside your theme's styling and cart. Everything the design shows (tiles, rows, popup, add to cart) can be built from Shopify data:

1. **Video source: product media.** Upload each reel as a **video on the product itself** in Shopify admin. A tile is simply "product + its video", so title, price, % off, stock and variants are always correct, and the same video also appears in the PDP gallery and in "Watch and buy" automatically. Rows can be:
   - **Collection-fed:** pick a collection (for example Shoulder bags) and the row shows every product in it that has a video, in collection order. No per-tile setup.
   - **Hand-picked:** add tiles one by one, choosing a product and optionally a specific video for each.
2. **Tiles:** 9:16 tiles with muted autoplay only while visible, a poster image first (fast load) and a small mute/pause icon. Below each: title, price, struck compare-at and % off.
3. **Popup viewer (an upgrade on the reference site):**
   - Full-screen on mobile and a centred 9:16 player on desktop.
   - Previous/next arrows, swipe up/down on mobile, and arrow keys and Esc on desktop. It moves through **all videos in that row**.
   - Sound on (the shopper tapped), with a mute toggle and a progress bar.
   - A **product panel inside the popup** with image, title, price, colour swatches, **Add to cart** (the cart count updates live) and "View details".
   - A shareable link (`#video=<id>`) that reopens the same video, and the browser back button closes the popup.
   - Only the visible video and the next one load, so the page stays fast.
4. **Where it appears:** Home "The style edit", every Shop by Video row, and PDP "Watch and buy" (the current product's own videos).

**What an app would add that this doesn't:** UGC/Instagram import, video analytics dashboards, and shoppable "stories" on other sites. You can add one later. The theme's `@app` slots let an app section sit next to or replace the theme's video rows.

## B. Visual values (cannot be read from the downscaled mockups)

| # | Question | Proposed default |
|---|---|---|
| B1 | Fonts, sizes, weights | Use the theme typography settings. The implementer approximates the mockup (clean geometric sans for UI, uppercase section headings with letter spacing). The merchant fine-tunes in theme settings. |
| B2 | Colours (sale red, greys, card bg, footer bg, panel grey) | Add colour-scheme and theme-setting entries with defaults close to the mockup: sale red `#D0021B`, card bg `#EDEDED`, panel/footer grey `#F2F2F2`, muted text `#8A8A8A`. All editable. |
| B3 | Spacing, aspect ratios, sizes | Estimates from the mockups become setting defaults (e.g. card ratio 3:4, video 9:16, category tiles 4:5). All adjustable in the editor. |
| B4 | Price formatting | Use the store's money format. Video tiles show no decimals, as in the mockup. |

## C. Mobile (mockups are desktop only)

| # | Proposed default |
|---|---|
| C1 | Accept every `[ASSUMPTION]` in the specs: 2-column product grids, about 2 cards plus a peek in carousels with swipe and no arrows, stacked banners (image first), swipeable PDP gallery, non-sticky PDP info, hamburger menu drawer, scrollable tabs. |

## D. Content (merchant supplies; no code impact)
Announcement messages, footer link lists, social networks, press logos, hero copy, banner text, promo overlay words and the SEO link text are all merchant content entered in the theme editor. The specs require only that they can be edited.
