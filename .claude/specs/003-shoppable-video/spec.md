# Spec 003: Shoppable video

- **Status:** Draft (ON HOLD: Shop by video is pending merchant discussion; do not plan or build)
- **Mockup(s):**
  - `.claude/design/home.png`: "The style edit" band, about 72–79% down the page, between "Trending now" and "Featured on" (design-map H10)
  - `.claude/design/product.png`: "Watch and buy" card, the last content block before the footer, after "Recently viewed products" (design-map P5)
  - `.claude/design/shopByVideo.png`: the three per-category rows "Top handle bags", "Shoulder bags" and "Crossbody bags", below the split banner, plus the floating circular cart button at the right edge (design-map V2)
- **Template(s) affected:** `index`, `product`, `page.shop-by-video`

## Goal
Shoppers can browse short vertical (reel-style) product videos and buy straight from them. Each video is tied to one product, and that product's title and live price (with compare-at price and discount when on sale) appear under the video. Opening a video shows it larger and lets the shopper add the product to the cart without leaving the page. The same component, configured differently, serves three placements: a home-page carousel, a single card on the product page, and stacked category rows on a dedicated "Shop by video" page. Videos are a main selling tool for the brand and help shoppers judge size, finish and how the bag is carried.

## In scope / Out of scope
- **In:**
  - The shoppable video tile: video, product title, price, compare-at price, discount line.
  - The carousel layout used on home and on the Shop by video page, including the heading and both arrow styles.
  - The single-card layout used on the product page.
  - Playback behaviour, the video viewer with add to cart, and empty, missing and sold-out states.
  - Reduced motion, accessibility and performance when many videos are on one page.
- **Out:**
  - The floating cart button. It is a global page-level element owned by spec 001 S4. S5 below only lists what this feature needs from it.
  - Page banners: the split banner on Shop by video (spec 004/006/007).
  - Page composition and order of sections on each template (004/006/007).
  - Standard product cards with badge, wishlist and swatches (002).
  - The cart drawer itself and the header cart icon (existing Horizon behaviour).
  - Wishlist.

---

## Sections

### S1. Shoppable video tile (shared by S2 and S3)
- **Position:** One item inside S2 (carousel) or S3 (single card).
- **Merchant-editable content (per tile):**
  - **Video.** A vertical video. By default, assume the merchant uploads it or picks it from Shopify Files. `[ASSUMPTION]` See S2 for the alternative where tiles come from a collection. `[NEEDS CLARIFICATION: Q1]`
  - **Linked product.** Picked by the merchant.
  - **Poster image (optional).** Used before the video loads and when motion is reduced. If none is set, the video's own preview image is used, then the product's featured image.
  - **Optional linked variant.** `[NEEDS CLARIFICATION: Q6]`
- **Data-driven content (from the linked product, never typed by the merchant):**
  - Product title.
  - Current price.
  - Compare-at price, shown struck through only when it is higher than the price.
  - Discount line "NN% off". The percentage is calculated from price and compare-at price, and the words around the number are translatable storefront copy.
  - Availability (sold out).
  - Product URL.
- **Layout (desktop):**
  - The video fills a portrait frame at about 9:16. Measured tiles are about 270 × 480 px on a 1920 px canvas, a ratio of about 0.56. `[NEEDS CLARIFICATION: Q9 exact ratio 9:16 vs 4:7]`
  - Video is cropped to cover the frame, with square corners.
  - Below the video, left-aligned and in this order:
    1. Product title on one line, regular weight.
    2. Price row: current price in bold, then the compare-at price in a lighter grey, smaller and struck through.
    3. On the Shop by video page only, the discount line on its own line below in small text. It is dark and not red, unlike the red "% OFF" on standard product cards.
  - Prices are shown without decimals (for example ₹3,419), unlike the PDP price (₹3,239.00). `[NEEDS CLARIFICATION: Q8]`
  - Fonts, sizes and colours follow the theme's type and colour settings. `[NEEDS CLARIFICATION: Q10]`
- **Layout (mobile):** `[ASSUMPTION]` Same tile structure, scaled to the tile width. Long titles wrap to at most 2 lines and are then truncated.
- **Interactions & states:**
  - **Default:** the poster or video is shown with title and price.
  - **Playback:**
    - **Confirmed (user):** tile videos autoplay muted, looped and inline while the tile is mostly in the viewport, and pause when scrolled out of view.
    - `[ASSUMPTION]` There are no visible controls on the tile.
  - **Hover (desktop):** `[ASSUMPTION]` The pointer becomes a hand over the video and title. There is no other visual change unless one is specified. `[NEEDS CLARIFICATION: Q3]`
  - **Click or tap on a tile:** opens the popup viewer (S4). **Confirmed (user).**
  - **Click on the title:** goes to the product page. `[ASSUMPTION]` See Q4.
  - **On sale** (compare-at higher than price): compare-at price is struck through, and the discount line is shown where the placement enables it.
  - **Not on sale:** only the price is shown, with no struck price and no discount line. The mockup's "Suzie Shoulder Bag ₹5,499" shows this case.
  - **Sold out (confirmed by user):** the tile stays visible with a **"Sold out" badge** (translatable, same style as the card badges in spec 002) and the **whole tile fades slightly** (about 60% opacity). The video still plays. Add to cart in the popup is disabled.
  - **Product price varies by variant:** shows the price of the linked variant if one is set. Otherwise it shows the product's lowest price, as Horizon cards do. `[ASSUMPTION]`
  - **No linked product, or the product is deleted, unpublished or not available in the market:**
    - The tile shows the video only, with no title or price, and does not open the add-to-cart viewer.
    - The mockup shows tiles with no text: the 2nd and 5th in "Shoulder bags" and the 5th in "Crossbody bags". `[NEEDS CLARIFICATION: Q7 is this intentional or a capture artefact?]`
  - **No video:**
    - The tile shows the poster image, or the product featured image, as a still image in the same frame.
    - If no image exists either, the tile is not rendered on the storefront.
    - In the theme editor, a neutral placeholder is shown in its place so the merchant can see the slot.
  - **Video fails to load:** the poster stays visible. There is no broken-media icon and no layout shift.
- **Acceptance criteria:**
  - [ ] AC1.1 A tile renders a portrait media frame at the agreed aspect ratio (Q9) that keeps its size before, during and after the video loads, with no layout shift.
  - [ ] AC1.2 Title, price and compare-at price come from the linked product (or variant) and update when product data changes in admin, with no theme editor change needed.
  - [ ] AC1.3 Compare-at price shows struck through only when it is higher than the current price. Otherwise it is absent from the markup.
  - [ ] AC1.4 When the placement enables it, the discount line shows the whole-number percentage `(compare_at − price) / compare_at`, rounded per Q8, for example ₹3,419 vs ₹4,499 → "24% off". It is hidden when there is no discount.
  - [ ] AC1.5 The discount wording ("off") and "Sold out" are translatable storefront strings, not hard-coded.
  - [ ] AC1.6 A sold-out linked product shows the sold-out state and cannot be added to the cart from the viewer.
  - [ ] AC1.7 A tile with a video but no valid product shows only the video, has no price markup, and does not open an add-to-cart viewer.
  - [ ] AC1.8 A tile with no video falls back to the poster, then to the product featured image. With neither, it is omitted on the storefront and shown as a placeholder in the editor.
  - [ ] AC1.9 Every video is muted and plays inline (no forced fullscreen on iOS) when autoplaying.
  - [ ] AC1.10 Each tile has an accessible name that includes the product title, for example "Play video: Aira Top Handle Bag".

---

### S2. Shoppable video carousel (home "The style edit", Shop by video category rows)
- **Position:**
  - **Home:** a full-width band after "Trending now" and before the "Featured on" press strip.
  - **Shop by video:** after the split banner. Each category is its own instance of this section, stacked vertically: "Top handle bags", then "Shoulder bags", then "Crossbody bags", with generous vertical space between rows. The merchant can add, remove and reorder rows.
- **Merchant-editable content:**
  - **Heading.** Mockup copy: "The style edit", "Top handle bags", "Shoulder bags", "Crossbody bags".
  - **Heading alignment:** left (home) or centre (Shop by video).
  - **Tile source:**
    - Manual: an ordered list of tiles as in S1, each with a video and a product. `[ASSUMPTION]` This is the default.
    - Optional collection-driven mode: the merchant picks a collection, and tiles are built from the products in it that have a video in their product media, using the first video. Products without a video are skipped. `[NEEDS CLARIFICATION: Q1]`
  - **Maximum number of tiles.** `[ASSUMPTION]` Default 12.
  - **Tiles visible per view on desktop.** Home shows about 6.5 and Shop by video about 5.5 plus a partial tile.
  - **Arrow style:**
    - "Header": plain chevrons at the right end of the heading row (home).
    - "Overlay": white circular buttons centred vertically on the left and right edges of the track (Shop by video).
  - **Show discount line:** off on home, on on Shop by video.
  - **Color scheme and top/bottom padding**, as on other Horizon sections.
- **Data-driven content:** As S1, for each tile. In collection mode, tile order follows the collection's sort order.
- **Layout (desktop):**
  - **Home:**
    - Heading row: heading in uppercase on the left, aligned with the page content margin. Prev and next chevrons are at the far right of the same row; in the mockup, prev looks dimmed at the start.
    - Track: tiles start at the content margin and run off the right edge of the viewport. About 6 full tiles show, plus a peek of the 7th, cut by the viewport edge.
    - Narrow gutter between tiles. `[NEEDS CLARIFICATION: Q10 exact gap]`
  - **Shop by video:**
    - Heading: uppercase, centred above the row, larger than the home heading, with wide letter spacing.
    - Track: sits inside the page content width. Five full tiles show, and the 6th is cut by the container's right edge, not the viewport. Gap is about 30 px at 1920.
    - Circular arrow buttons are vertically centred on the video frames. The left one sits just outside the first tile and the right one overlaps the right edge of the cut-off tile.
  - **Both:** tiles are equal width and top-aligned. Product text below can differ in height without moving the video frames.
- **Layout (mobile):** `[ASSUMPTION]`
  - Heading stays on top. It is left- or centre-aligned as on desktop.
  - The track scrolls horizontally with touch swipe and snaps to tiles. About 2.2 tiles show, so the next one peeks.
  - Arrows are hidden on touch widths.
  - There is no page-level horizontal scrollbar, and the track spans the full viewport width.
- **Interactions & states:**
  - **Arrows:**
    - Next and prev move by one view-width of whole tiles. `[ASSUMPTION]`
    - Prev is disabled or dimmed at the start and next at the end. There is no looping. `[ASSUMPTION]`
    - Arrows are hidden when all tiles fit in view.
  - **Keyboard:** arrows are focusable buttons with labels ("Previous videos", "Next videos", translatable). Tabbing through tiles scrolls the focused tile into view.
  - **Trackpad and shift-wheel:** horizontal scroll works natively.
  - **Playback:**
    - Only tiles mostly in view autoplay. Tiles scrolled out of the visible track area pause.
    - **Confirmed (user):** all visible tiles play silently at once. Only off-screen tiles pause.
  - **Empty:**
    - If no tiles resolve (none configured, empty collection, or no products with video), the section renders nothing on the storefront, heading included.
    - In the theme editor, an empty state with placeholder tiles is shown.
  - **One tile only:** shows one tile at the start of the track with no arrows.
- **Acceptance criteria:**
  - [ ] AC2.1 The merchant can add the section to the home page and to a page template, set the heading text, and choose left or centre alignment.
  - [ ] AC2.2 The merchant can add, remove and reorder tiles, each with a video and a product, in the theme editor, and the order on the storefront matches.
  - [ ] AC2.3 If the collection-driven mode is approved (Q1), choosing a collection fills tiles from its products' first video media, skipping products without video, up to the maximum count.
  - [ ] AC2.4 At 1920 px with "header" arrows, the heading is left-aligned with arrows at the right of the heading row, and the last visible tile is cut by the viewport edge (peek).
  - [ ] AC2.5 At 1920 px with "overlay" arrows, the heading is centred and the tiles sit within the content width. Circular arrow buttons are vertically centred on the media frames at both ends, and a partial tile shows at the right.
  - [ ] AC2.6 Prev and next move the track. Prev is disabled at the start and next at the end. Both are keyboard-operable buttons with translatable accessible labels.
  - [ ] AC2.7 Arrows are not rendered, or are hidden, when all tiles fit in view and on touch widths.
  - [ ] AC2.8 On a mobile width, the track swipes horizontally with snap and the next tile peeks. The page itself never scrolls horizontally.
  - [ ] AC2.9 The discount line toggle works per instance: off in the home preset and on in the Shop by video preset.
  - [ ] AC2.10 Three instances can be stacked on one page, each with its own heading and tiles, with no conflicts in arrows or playback between them.
  - [ ] AC2.11 With no resolvable tiles, nothing renders on the storefront. The editor shows a placeholder.
  - [ ] AC2.12 Off-screen videos do not download video data until they are near the viewport. Only the poster or a lightweight preview is requested at page load.

---

### S3. Watch and buy (product page single card)
- **Position:** On the product template, after "Recently viewed products" and before the footer. The heading "Watch and buy" is left-aligned with the page content margin, and the card is centred horizontally below it.
- **Merchant-editable content:**
  - **Heading.** Mockup copy: "Watch and buy".
  - **Video source:**
    - **Confirmed (user):** if the merchant has set a **specific video for this product** (a per-product override, for example a product metafield holding a video), that video is used. **Otherwise**, the first video in the product's own media is used.
  - **Show discount line:** off by default, which matches the mockup.
  - **Color scheme and padding.**
- **Data-driven content:** The current product's title, price, compare-at price and availability. The tile links to the current product. In the viewer it acts on the currently selected variant. `[ASSUMPTION]`
- **Layout (desktop):**
  - One tile from S1 at the same size as a carousel tile (about 270 × 480 at 1920).
  - Centred, with no arrows.
  - Title and price are left-aligned under the video, within the tile width.
- **Layout (mobile):** `[ASSUMPTION]` The heading is left-aligned. The single tile is centred at about 60% of the viewport width, keeping its portrait ratio.
- **Interactions & states:**
  - Playback and the viewer are as in S1 and S4.
  - **Multiple videos on the product:** only one card shows (the override, or else the first video).
  - **Product has no video:** the whole section, heading included, is hidden on the storefront. In the editor, a placeholder is shown.
  - **Sold out:** the tile still shows, with the sold-out state from S1.
- **Acceptance criteria:**
  - [ ] AC3.1 On a product with a video in its media, the section shows that video with the current product's title, price and struck compare-at price (when higher), and no carousel arrows.
  - [ ] AC3.2 When a merchant-set video exists for the product, it is used. Otherwise the product's first media video is used. With neither, the section and its heading do not render on the storefront.
  - [ ] AC3.3 The heading is editable, and the card is centred horizontally at desktop width.
  - [ ] AC3.4 Adding to cart from the viewer adds the PDP's currently selected variant, or the first available variant if none is selected.

---

### S4. Video popup viewer (reel carousel with add to cart)
> **Clarified by the user (2026-11-19).** Tiles autoplay. Clicking any tile opens a popup showing **one active, focused reel in the centre** with an **Add to cart** button. The **previous reel peeks on the left and the next reel peeks on the right, behind the active one**, and there are **Previous and Next buttons**. This matches the reference site's behaviour.

- **Position:** A full-screen overlay (a modal dialog over a dimmed backdrop), opened from any tile in S2 or S3.
- **Merchant-editable content:**
  - **Placement-level toggle:** "Open video popup on click" (default on) or "Link to product page".
  - All labels are translatable storefront strings.
- **Data-driven content (for the active reel):** product title, price, compare-at price, discount, availability, first available variant id, and a product URL for "View details".
- **Reel sequence:** the popup holds **every tile in the row** (S2) that was clicked, in the same order, and opens on the clicked tile. On the PDP (S3) it holds that product's video or videos.
- **Layout (desktop):**
  - **Active reel:** centred, portrait 9:16, the largest element. It is fully opaque and in focus.
  - **Product panel (confirmed: under the video):** directly **below** the active reel and the same width as it. It shows the title, price, struck compare-at price and % off, then a full-width **Add to cart** button and a "View details" link. It never overlays the video.
  - **Side reels (recommended values, accepted by user):** the previous reel sits on the left and the next reel on the right, **behind** the active one (lower stacking order). Each is **scaled to 85%** of the active reel, **overlaps the active reel by about 15% of its width**, and is **dimmed with a 50% dark overlay** (no blur). They are paused, showing a poster or their current frame, and show no product panel. If there is no previous or next reel, that side is empty. The transition between reels is about 300 ms, ease-out, and is instant under reduced motion.
  - **Prev/Next buttons:** circular buttons at the left and right of the stage, vertically centred, with the same style as the S2 overlay arrows.
  - **Close button:** at the top-right of the viewport.
- **Layout (mobile):** `[ASSUMPTION]` The active reel goes almost full-screen and the side reels shrink to thin slivers at the edges, or are hidden. Swiping left or right moves to the previous or next reel; the buttons are hidden on touch. The product panel with Add to cart stays below the reel and visible without scrolling.
- **Interactions & states:**
  - **Opening:** the popup opens on the clicked reel. That reel plays from the start; the side reels stay paused. All tile videos on the page pause.
  - **Sound (confirmed by user):** when the popup opens, the active reel **plays with sound on**. The shopper's click allows this in browsers. If a browser still blocks unmuted playback, the reel plays muted and shows a prominent "Tap for sound" unmute control. A mute/unmute toggle is always visible. The mute choice carries over as the shopper moves between reels.
  - **Prev/Next** (buttons, ←/→ keys, swipe): the next reel animates into the centre and becomes active; the old active reel moves to the side and pauses. The product info and Add to cart update to the new reel's product. Prev is disabled on the first reel and Next on the last, with no looping. `[ASSUMPTION]`
  - **Clicking a side reel** makes it the active reel, the same as Prev/Next.
  - **Add to cart (confirmed: no variant picker for now):** adds the product's first available variant directly, because Shop by video products currently have no variants. No picker is built. If a product with several variants is linked later, Add to cart is replaced by "View details" (link to the PDP) so a wrong variant is never added. The button shows loading and then success states, and the header cart count and floating cart count update without a reload. The popup stays open.
  - **Sold out:** the button is disabled and reads "Sold out".
  - **Add fails:** an inline translatable error message appears.
  - **Reel without a product (video-only tile):** it plays in the sequence with no product panel or Add to cart.
  - **Close** (close button, Esc, click on the backdrop, or browser back): focus returns to the tile for the last active reel, and tile playback on the page resumes.
  - **Loading:** only the active reel's video loads at full quality. The side reels show their posters and preload the next video lightly.
- **Acceptance criteria:**
  - [ ] AC4.1 Clicking a tile opens the popup with that tile's reel active in the centre and playing, and the adjacent reels from the same row visible on the left and right behind it (smaller and dimmed). With the toggle off, the tile links to the product page instead.
  - [ ] AC4.2 The Prev and Next buttons (and ←/→ keys) move through every reel in the row in order. The new reel becomes centred and playing, the previous one pauses and moves to the side, and Prev/Next are disabled at the ends.
  - [ ] AC4.3 The active reel's product title, price, compare-at price and Add to cart always match the reel in the centre.
  - [ ] AC4.4 Add to cart adds the correct product or variant. The header cart count and the floating cart count update without a page reload, and the popup stays open.
  - [ ] AC4.5 A sold-out product disables Add to cart. A failed add shows an inline message.
  - [ ] AC4.10 The popup's active reel starts with sound on. If the browser blocks this, it falls back to muted with a visible unmute control.
  - [ ] AC4.11 The product panel sits below the active reel, never over it. The side reels are at 85% scale, behind the active reel, with a 50% dark overlay.
  - [ ] AC4.12 A product with several variants shows "View details" instead of Add to cart.
  - [ ] AC4.6 Only the active reel plays. The side reels and all tile videos on the page are paused while the popup is open.
  - [ ] AC4.7 The popup is an accessible modal: focus is trapped inside, Esc and the close button work, focus returns to the originating tile, and mute and play/pause controls are keyboard-operable with labels.
  - [ ] AC4.8 On mobile widths, swiping left or right changes reels, and Add to cart stays reachable without scrolling.
  - [ ] AC4.9 All popup labels ("Add to cart", "Sold out", "View details", "Close", "Previous", "Next", "Mute", "Unmute") are translation strings.
---

### S5. Floating cart button: requirements on spec 001 S4 (reference only)
> **Owned by spec 001 S4.** It is built once as a global element. The notes and ACs below are interface requirements this feature places on it. Verify them under spec 001, not here.

- **Position:**
  - A white circular button with a cart icon and a small black count badge at its top-right.
  - Fixed at the right edge of the viewport, at about mid-height. The mockup captures it at two scroll positions, which suggests it is fixed.
  - It is not shown on the home or product mockups.
- **Merchant-editable content:** Show or hide, per page or section. `[ASSUMPTION]` Shown by default on the Shop by video page only. `[NEEDS CLARIFICATION: Q12]`
- **Data-driven content:** The cart item count.
- **Layout (desktop):**
  - A circle about 64 px at 1920. `[NEEDS CLARIFICATION: Q10]`
  - It has a thin border or shadow and sits about 20–30 px in from the right edge.
  - It floats above page content.
- **Layout (mobile):** `[ASSUMPTION]` The same button, slightly smaller, near the bottom-right. It must not cover the add-to-cart controls in the S4 viewer, and it is hidden while the viewer is open.
- **Interactions & states:**
  - Click opens the cart using the theme's existing cart behaviour (drawer or cart page).
  - The count updates immediately after any add to cart.
  - **Empty cart:** `[ASSUMPTION]` The button shows with no badge. `[NEEDS CLARIFICATION: Q12]`
- **Acceptance criteria:**
  - [ ] AC5.1 On the Shop by video page, a circular cart button stays fixed at the right edge while scrolling.
  - [ ] AC5.2 Its badge shows the current cart item count and updates without reload after adding from S4.
  - [ ] AC5.3 Clicking it opens the cart the same way the header cart icon does.
  - [ ] AC5.4 It is a keyboard-focusable button or link with an accessible name that includes the count, for example "Cart, 1 item" (translatable).
  - [ ] AC5.5 The merchant can turn it off. It does not appear on templates where it is not enabled.

---

## Cross-cutting requirements (apply to S1–S5)

### Reduced motion and accessibility
- [ ] AC6.1 When the shopper's system asks for reduced motion, no tile autoplays. Tiles show the poster with a visible play affordance. Carousel movement does not animate (it jumps instead of sliding).
- [ ] AC6.2 Any autoplaying video can be paused. `[ASSUMPTION]` There is a section-level pause control, or tiles pause on focus or click, to satisfy the WCAG "pause, stop, hide" rule for motion longer than 5 s. `[NEEDS CLARIFICATION: Q3]`
- [ ] AC6.3 Muted tile videos are marked decorative or labelled by the product title, and are not announced repeatedly by screen readers.
- [ ] AC6.4 All interactive elements (tiles, arrows, viewer controls, floating cart) have a visible focus indicator. Their colour contrast follows the section's colour scheme.
- [ ] AC6.5 If the merchant supplies captions with the video, the viewer can show them. `[NEEDS CLARIFICATION: Q13]`

### Performance (up to about 20 videos on one page, for example 3 rows of 6 plus the banner)
- [ ] AC7.1 At first load, no video file is downloaded for tiles outside the viewport. Only posters, sized responsively, are requested, and they are lazy-loaded below the fold.
- [ ] AC7.2 Video data loads only when a tile approaches the viewport. Videos that leave the viewport pause.
- [ ] AC7.3 **Playback rule (confirmed by user):** with the popup closed, **every tile visible in a carousel autoplays silently**, with no fixed cap. Tiles outside the viewport pause and don't download. With the popup open, **exactly one video plays** (the active reel); all tile videos and side reels are paused.
- [ ] AC7.4 The video rendition requested suits the tile size (for example around 480–720 px tall for tiles), not the original upload. The viewer may request a higher rendition.
- [ ] AC7.5 Adding the section causes no measurable layout shift, because media frames reserve their aspect ratio.
- [ ] AC7.6 `[ASSUMPTION]` When the shopper's browser signals data saving, tiles do not autoplay and behave as in reduced motion.

### Content hygiene
- [ ] AC8.1 No brand name, product name, price, heading copy or video is hard-coded. Everything shown comes from section settings, blocks, translation strings or Shopify product data.
- [ ] AC8.2 Theme editor presets exist for "The style edit" (left heading, header arrows, no discount line, peek to viewport edge), a "Shop by video row" (centred heading, overlay arrows, discount line on) and "Watch and buy" (single card from the current product). Preset headings are placeholder text the merchant can edit.

---

## Open questions
- `[NEEDS CLARIFICATION: Q1]` **Content source.** Should videos be:
  - (a) uploaded by the merchant per tile with a product picked for each (manual), or
  - (b) taken from each product's own media (video), so a collection fills the row, or
  - both? On Shop by video, should each category row be tied to a collection?
- ~~Q2~~ **RESOLVED:** tiles autoplay; all visible tiles play silently, and only one video plays in the popup.
- `[NEEDS CLARIFICATION: Q3]` **Visual hover and pause affordances on tiles.** Is there a hover effect, a play icon overlay or a mute icon? Is a visible pause control wanted? It is needed for accessibility if videos autoplay.
- ~~Q4~~ **RESOLVED:** reel popup with sound on, side reels at 85% scale with 50% dimming, product panel under the video, and no variant picker (see S4).
- ~~Q5~~ **RESOLVED:** "Sold out" badge plus a slight fade on the tile.
- ~~Q6~~ **Not needed now:** Shop by video products have no variants.
- `[NEEDS CLARIFICATION: Q7]` **Tiles without text.** In "Shoulder bags" (tiles 2 and 5) and "Crossbody bags" (tile 5), the tiles have no title or price. Is that a deliberate "video only, no product" tile, or did the data not load when the mockup was captured?
- `[NEEDS CLARIFICATION: Q8]` **Price format and rounding.**
  - Video tiles show prices without decimals (₹3,419), while the PDP shows ₹3,239.00. Is the no-decimal format intended for these tiles only?
  - Should the discount percentage round down, round to nearest, or match the "% OFF" rule in spec 002? All mockup values are near-whole numbers.
- `[NEEDS CLARIFICATION: Q9]` **Exact media aspect ratio.** Is it 9:16, or something else? It measures about 0.56 to 0.57.
- `[NEEDS CLARIFICATION: Q10]` **Exact typography and colours.**
  - Heading fonts, sizes and letter spacing for the left (home) and centred (Shop by video) headings.
  - Title, price, compare-at and discount line sizes and colours.
  - Tile gaps.
  - Arrow and floating-button sizes, borders and shadows.
  - These cannot be read from the downscaled mockups.
- ~~Q11~~ **RESOLVED:** the merchant's per-product video if set, otherwise the product's own first video.
- `[NEEDS CLARIFICATION: Q12]` **Floating cart button.**
  - Is it only for the Shop by video page, or site-wide?
  - Is it shown when the cart is empty?
  - Is it part of this video feature or a separate global element?
  - Does clicking it open the cart drawer?
- `[NEEDS CLARIFICATION: Q13]` **Captions.** (Sound is resolved: it is on in the popup.) Do videos contain meaningful audio? If so, should the merchant be able to attach captions, and should the viewer start with sound on?

## Clarifications log
| Question | Answer | Date |
|---|---|---|
| Q2 Tile playback | Tiles autoplay (muted, while in view) | 2026-11-19 |
| Q4 Click behaviour | A popup with one active, focused reel in the centre, the previous and next reels peeking left and right behind it, Prev/Next buttons, and an Add to cart button (see S4) | 2026-11-19 |
| Sound in popup | On when the popup opens and the video runs; falls back to muted with an unmute prompt if the browser blocks it | 2026-11-19 |
| Side reels | Recommended values accepted: 85% scale, behind the active reel, 50% dark overlay | 2026-11-19 |
| Product info position | Under the video, not overlaid | 2026-11-19 |
| Variant picker | Not needed now (Shop by video products have no variants); first available variant is added | 2026-11-19 |
| Q2 Playback count | All visible carousel tiles autoplay silently; only one video plays when the popup is open | 2026-11-19 |
| Q5 Sold out | Sold-out badge and a slight fade on the tile | 2026-11-19 |
| Q11 Watch and buy source | The merchant-set video for the product if present, otherwise the product's own video | 2026-11-19 |
