# Spec 007: Shop by Video page

- **Status:** Draft (ON HOLD: Shop by video is pending merchant discussion; do not plan or build)
- **Mockup(s):** `.claude/design/shopByVideo.png`, the whole page between the global header and the global footer (design-map rows **V1** and the page composition of **V2**)
- **Template(s) affected:** a new page template for Shopify pages, referred to here as `page.shop-by-video`

## Goal
Shoppers get one landing page where they can browse short vertical product videos grouped by category (for example "Top handle bags", "Shoulder bags", "Crossbody bags"). Each video shows the product it features, with price and discount, so shoppers can see a bag in use and go straight to buying it. Merchants build and maintain the page entirely in the theme editor: they choose how many category rows there are, the order of the rows, and which videos and products each row shows. They also link the page from the main menu ("Shop by Video"). No code changes are needed to add, remove or reorder categories.

## In scope / Out of scope
- In:
  - How the page is created: a Shopify page that uses a dedicated "Shop by video" page template.
  - S1: the split banner at the top of the page (breadcrumb, title, description, lifestyle image). It reuses the split banner from spec 005 (C1).
  - S2: a stack of category video rows that the merchant configures. Each row is one instance of the shoppable video section from spec 003. This spec covers how rows are composed, how many there are, their order, their spacing, and how each row gets its videos and products.
  - Page-level whitespace and rhythm between banner, rows and footer.
  - How the main-menu "Shop by Video" link reaches the page.
- Out (reference only):
  - Announcement bar, header and footer: spec 001.
  - Internals of the shoppable video carousel (video playback, card markup, arrows behaviour, product info rendering, quick-add) and the floating cart button (owned by spec 001 S4).
  - Product card pricing and discount rules beyond what spec 003 shows: specs 002/003.
  - Split banner internals beyond how this page uses them: spec 005 (C1).

## Page setup and navigation
- **Page creation.** The merchant creates a normal Shopify page (Online Store > Pages), for example titled "Shop by Video", and assigns it the dedicated "Shop by video" template. The template ships pre-composed: the S1 banner followed by three S2 video rows, matching the mockup.
- **Handle.** `[ASSUMPTION]` The suggested handle is `shop-by-video`, which gives the URL `/pages/shop-by-video`. Nothing on the page depends on the handle. Any page that uses the template renders the same way.
- **Multiple pages.** Assigning the template to more than one page is allowed. Every such page renders the template's sections. The banner title, breadcrumb and description follow each page's own data (see S1).
- **Main-menu link.** The merchant adds a "Shop by Video" item to the main menu (Online Store > Navigation) and points it at the page. No theme code or setting hard-codes this link. In the mockup the item sits between "Gifting" and "Store Locator". The menu's own order controls where it appears.
- **Active state.** When the shopper is on this page, the "Shop by Video" menu item shows whatever active or current state spec 001 defines for menu items.
- **Page SEO.** The browser title and meta description come from the page's standard Shopify SEO fields.

## Sections

### S1. Split banner (reuses spec 005 C1)
- **Position:** The first section in the page body, directly below the header (spec 001). Whitespace (S3) and then the first video row come after it.
- **Reuse requirement:** This must be the same split banner section or block defined in spec 005 C1, used without a page-specific copy. Any variation this page needs (for example taking the title and description from the page instead of a collection) must be an option on that shared banner. It must not be a fork.
- **Merchant-editable content:**
  - Lifestyle image (right side). Image picker.
  - Optional title override. If empty, the page title is used. Mockup: "Shop by Video".
  - Optional description override (rich text). If empty, the page's content (body) is used. Mockup: "Discover the convenience of shopping by video on our platform. Watch product demos and make informed decisions from home." `[ASSUMPTION]` that the page body is the default description source. See open questions.
  - Show or hide breadcrumb.
  - Left panel background colour (light grey in the mockup), using the theme's colour schemes.
- **Data-driven content:**
  - Breadcrumb: "Home" (links to the storefront home), a separator, then the current page title (not a link). Mockup: "Home / Shop By Video". Note that the mockup shows "By" capitalised in the breadcrumb but not in the title. See open questions.
  - Title and description fall back to the page title and page content.
- **Layout (desktop):** The banner is full width and split into two columns. The left panel is about 40% of the width with a light grey background. It holds the breadcrumb at the top left and the title and description together below it, left aligned and vertically centred in the panel. The right column is about 60% wide and shows the lifestyle image, cropped to fill (cover). The banner is about 385px tall at 1920px viewport width (measured from the downscaled mockup, so approximate). The description wraps at roughly 50% of the panel width. All proportions, heights and type styles must match spec 005 C1. This page introduces no values of its own.
- **Layout (mobile):** `[ASSUMPTION]` Same behaviour as spec 005 C1 on mobile: the columns stack with the image first and the text panel below (or whatever order 005 defines). The breadcrumb stays visible and the text is left aligned.
- **Interactions & states:**
  - The "Home" breadcrumb link has the theme's standard link hover.
  - No image selected: the text panel spans the full width (or 005's defined fallback). The editor shows a placeholder image.
  - Empty description (no override and empty page body): the description area is not rendered and leaves no empty gap.
- **Acceptance criteria:**
  - [ ] AC1.1 The `page.shop-by-video` template's first body section is the same split banner section or block used by the collection banner in spec 005 C1. No duplicate banner section exists for this page.
  - [ ] AC1.2 With no overrides set, the banner title equals the page title and the description equals the page content.
  - [ ] AC1.3 When the merchant sets a title or description override in the theme editor, the override is shown instead of the page data.
  - [ ] AC1.4 The breadcrumb reads "Home", a separator, then the page title. "Home" links to the root URL and the last item is not a link.
  - [ ] AC1.5 The breadcrumb can be hidden from the theme editor.
  - [ ] AC1.6 The lifestyle image is chosen in the theme editor and can be replaced without code changes. No image or brand asset is hard-coded.
  - [ ] AC1.7 With no image, the banner still renders legibly (005's fallback) and shows a placeholder in the editor.
  - [ ] AC1.8 With an empty description, no empty description element or extra spacing is rendered.
  - [ ] AC1.9 Desktop and mobile layout match spec 005 C1 exactly.

### S2. Category video rows (stack of spec 003 shoppable video sections)
- **Position:** Directly after S1, separated by generous whitespace (S3). The rows stack vertically, one per category, and the footer follows them. Mockup order: "TOP HANDLE BAGS", "SHOULDER BAGS", "CROSSBODY BAGS".
- **Composition:**
  - Each row is one independent instance of the shoppable video section from spec 003. The page template ships with three instances (matching the mockup) pre-filled with the headings above and no videos.
  - **How many rows:** The merchant can add, remove, duplicate and reorder rows freely in the theme editor. There is no theme-imposed minimum or maximum. Shopify's own per-template section limit is the only cap. Zero rows is valid: the page then shows only the banner and footer.
  - **Order:** The rows render in the order set in the theme editor.
- **Merchant-editable content (per row, as provided by spec 003):**
  - Row heading (for example "Top handle bags"). It appears uppercase in the mockup. Whether the uppercase comes from a style setting or from the typed text is defined by spec 003's heading style. The merchant's text is never hard-coded.
  - Videos: an ordered list of video items. Per item, the merchant can set:
    - the video (a Shopify-hosted video file)
    - an optional poster or fallback image
    - an optional linked product.
  - **How a row picks its videos and products:** Each row's content is curated by hand. The merchant adds video items to the row and, for each one, optionally picks the product it features. A row is not filled automatically from a collection unless spec 003 offers that as a source option. If 003 does offer a "collection" source (videos taken from each product's video media or metafield), this page can use it unchanged. `[NEEDS CLARIFICATION: Should rows also support "auto-fill from a collection" (for example the Top Handle Bags collection), or is manual curation per row enough?]`
  - Optional "View all" link per row, if spec 003 provides one. The mockup shows none, so it is off by default on this page.
  - Section colour scheme and top/bottom padding (used to achieve S3).
- **Data-driven content (per video item with a linked product, rendered by spec 003):** product title, current price, compare-at price (struck through) when higher than the price, discount line "NN% off" calculated from the price and compare-at price, and the product URL.
- **Layout (desktop) (as seen on this page. Card internals are owned by 003):**
  - The heading is centred above the track, in uppercase.
  - The track holds 9:16 portrait video cards. About 5.5 cards are visible at 1920px. The 6th card is cut off at the right edge as a "peek" that signals more content. Cards are about 270px wide with about 30px gaps (approximate, from the downscaled mockup).
  - The track starts at the same left content edge as the banner text. It is not centred as a block.
  - Round previous and next arrow buttons sit vertically centred on the video area, just outside the track on the left and right.
  - Below each card, left aligned: the product title (regular), the price (bold) followed by the compare-at price (struck through, muted), and below that a small "NN% off" line.
- **Layout (mobile):** `[ASSUMPTION]` As defined by spec 003 for mobile: a horizontal swipe track showing about 1.5 to 2 cards with a peek, arrows hidden, and the heading centred. This page adds no mobile-specific behaviour.
- **Interactions & states (page-level expectations. Behaviour is owned by 003):**
  - Arrows scroll the row. Each row scrolls independently of the others.
  - Video item with no linked product: only the video is shown, with no title or price area. This is visible in the mockup (Shoulder bags cards 2 and 5, Crossbody card 5). The empty space must not shift the alignment of neighbouring cards.
  - Linked product not on sale (no compare-at price, or compare-at not higher than price): only the price is shown, with no strikethrough and no "% off" line. Mockup: "Suzie Shoulder Bag ₹5,499".
  - Linked product sold out: shown as spec 003 or 002 defines (for example a sold-out label). It stays in the row.
  - Linked product deleted or unavailable on the storefront: treated as "no linked product".
  - Video missing or failing to load: the poster image is shown. If there is no poster, the editor shows a placeholder and the storefront skips the item.
  - Row with zero renderable video items: the whole row (heading included) is hidden on the storefront. In the theme editor it shows a placeholder so the merchant can fill it.
  - Fewer items than fit in the viewport: no arrows and no peek. Items stay left aligned (or follow 003's rule).
- **Acceptance criteria:**
  - [ ] AC2.1 The template ships with exactly three shoppable video sections (spec 003) below the banner, with headings "Top handle bags", "Shoulder bags" and "Crossbody bags" as editable defaults.
  - [ ] AC2.2 In the theme editor the merchant can add another shoppable video section to this template, and remove, duplicate and reorder any of them. The storefront order matches the editor order.
  - [ ] AC2.3 Every row on this page is the spec 003 section itself. No page-specific copy of the video carousel exists.
  - [ ] AC2.4 Each row's heading, video items, per-item video, poster and linked product are editable in the theme editor without code.
  - [ ] AC2.5 A video item with a linked product shows that product's title, price and, when the product is on sale, the struck-through compare-at price and an "NN% off" line. All of these come from Shopify product data.
  - [ ] AC2.6 A video item with no linked product shows the video with no title or price, and the card's top edge stays aligned with its neighbours.
  - [ ] AC2.7 A row with no renderable items is not output on the storefront, and no blank gap is left in its place.
  - [ ] AC2.8 Each row's arrows scroll only that row.
  - [ ] AC2.9 With zero rows, the page renders the banner and then the footer with no errors.
  - [ ] AC2.10 No brand name, product name or copy from the mockup is hard-coded. All text is either merchant input or Shopify data.

### S3. Page whitespace and rhythm
- **Position:** Between the banner and the first row, between rows, and between the last row and the footer.
- **Merchant-editable content:** the top and bottom padding of each row (and of the banner, if 005 exposes it), using the sections' standard padding settings.
- **Layout (desktop):** Values are approximate, measured from the downscaled mockup at 1920px:
  - about 200 to 220px from the bottom of the banner to the first row heading
  - about 160 to 180px from the end of one row's product info to the next row's heading
  - about 30px from a heading to its video track
  - an unusually large gap of about 450 to 500px between the last row and the footer.
  `[NEEDS CLARIFICATION: Is the large gap above the footer intentional, or an artefact of the mockup?]`
- **Layout (mobile):** `[ASSUMPTION]` The vertical gaps scale down to about half of their desktop values, using the theme's standard responsive section padding.
- **Interactions & states:** none.
- **Acceptance criteria:**
  - [ ] AC3.1 The vertical spacing between banner, rows and footer is controlled only by section padding settings in the theme editor. No fixed spacer is hard-coded.
  - [ ] AC3.2 The template's default padding values reproduce the approximate desktop gaps above (within the theme's padding steps).
  - [ ] AC3.3 Changing one row's padding does not affect the other rows.

### Floating cart button (reference only)
The mockup shows a round floating cart button with a count badge. It sits at the right edge, overlapping the bottom of the banner, and stays in view while scrolling (it appears again beside the second row). It is fully specified in spec 001 S4 (spec 003 S5 lists its video-related requirements). This page only requires that it is present when spec 003 says it should be (for example whenever at least one shoppable video section is on the page) and that it does not cover the row arrows. `[NEEDS CLARIFICATION: Should it appear on this page even when the cart is empty?]`

- [ ] AC4.1 On this page, the floating cart button shows or hides according to spec 001 S4 rules, and it never covers a row's next arrow at 1920px or 1280px viewport widths.

## Open questions
- `[NEEDS CLARIFICATION]` **Banner text source.** Should the banner title and description default to the Shopify page's title and body, as this spec assumes, or be entered only as banner settings?
- `[NEEDS CLARIFICATION]` **Breadcrumb casing.** The mockup breadcrumb reads "Shop By Video" while the title reads "Shop by Video". Should the breadcrumb simply mirror the page title, as this spec assumes?
- `[NEEDS CLARIFICATION]` **Row source.** Should a row be able to auto-fill from a collection (videos taken from product media or a metafield), or is manual per-video curation with an optional product link enough?
- `[NEEDS CLARIFICATION]` **"View all" link.** Should each row have a "View all" link to the matching collection? The mockup shows none.
- `[NEEDS CLARIFICATION]` **Gap above the footer.** Is the roughly 450 to 500px gap between the last row and the footer intentional?
- `[NEEDS CLARIFICATION]` **Floating cart on an empty cart.** Should the floating cart button show on this page when the cart is empty? (Owned by spec 001 S4.)
- `[NEEDS CLARIFICATION]` **Exact type and colours.** Exact font family, sizes and weights for the row headings, banner title, description and breadcrumb, plus the exact hex of the banner's light grey panel and the muted compare-at colour, cannot be read from the downscaled mockup. The default is to inherit from specs 005 and 003 and the theme's settings.
- `[NEEDS CLARIFICATION]` **Exact measurements.** The banner height, card width and gap, and section gaps are estimated from a downscaled image. Confirm them, or accept "approximate, within the theme's padding steps".
- `[NEEDS CLARIFICATION]` **Mobile.** There is no mobile mockup. Confirm the assumptions: the banner stacks as in spec 005, rows show about 1.5 to 2 cards with a peek and no arrows, and gaps are about half of desktop.
- **Dependencies (resolved):** spec 003 provides per-video product linking, an optional collection-fed row mode, and hiding of empty rows. Spec 005 S1 (AC1.8) provides a split banner that can be reused on page templates. Spec 001 S4 owns the floating cart button.

## Clarifications log
| Question | Answer | Date |
|---|---|---|
