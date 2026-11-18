# Spec 005: Collection page

- **Status:** Draft
- **Mockup(s):** `.claude/design/collection.png`, everything between the header and the footer (design-map rows C1–C5)
- **Template(s) affected:** `collection` (the default collection template; any alternate collection templates may reuse the same sections)

## Goal
A shopper who lands on a collection (the mockup shows "Bestsellers") sees a calm editorial banner that explains the collection, then a clear toolbar to sort and filter, then a 4-column product grid broken up by large merchant-curated promotional image tiles. Below the grid, a category carousel moves them sideways into other collections, and a collapsible SEO text block gives search engines and shoppers quick links by category and colour. The merchant controls all copy, imagery, promo tiles, carousel collections and SEO links from the theme editor. Product data comes from Shopify.

## In scope / Out of scope
- In:
  - S1 Split collection banner (breadcrumb, title, description, image) (C1)
  - S2 Toolbar: product count, Sort by, Filter (n) with drawer, active filter chips (C2)
  - S3 Product grid with inline promotional tiles (C3)
  - S4 Pagination / load more behaviour for the grid (not visible in the mockup)
  - S5 "Explore our categories" collection carousel (C4)
  - S6 SEO links text block with "Read more" (C5)
  - Page order of S1–S6
- Out (reference only):
  - Announcement bar, header, footer: spec 001. The footer accordions ("Top Searched on …", "Purposeful Picks", "Get Support"), logo, social row and copyright seen below S6 belong to 001.
  - Product card internals (image, badge, wishlist heart, swatches, title, price, compare-at, % OFF): spec 002. This page **uses the standard product card** unchanged.
  - Wishlist behaviour (G5).
  - Text printed inside product photography (for example "summer afternoon" on the second card) is part of the product image, not a theme element.

## Page order
Top to bottom, between the header (001) and the footer (001):
1. S1 Split collection banner
2. S2 Toolbar (count, Sort by, Filter), with the active filter chip row directly below it
3. S3 Product grid with promo tiles
4. S4 Pagination / load more control (directly under the grid)
5. S5 "Explore our categories" carousel
6. S6 SEO links text block

The merchant can reorder, hide or remove S5 and S6 in the theme editor. S1–S4 form the main collection block and keep this order.

## Sections

### S1. Split collection banner
- **Position:** First section under the header. Followed by S2.
- **Merchant-editable content:**
  - Banner image (right side), with focal point / alt text taken from the image.
  - Option to fall back to the collection's own featured image when no banner image is set.
  - Show/hide breadcrumb.
  - Show/hide description.
  - Left panel background colour (light grey in the mockup) via a colour scheme. `[NEEDS CLARIFICATION: exact background hex for the left panel]`
- **Data-driven content:**
  - Breadcrumb: "Home" link to the storefront root, "/" separator, then the current collection title (not linked). Mockup reads "Home / Bestsellers".
  - Collection title (mockup: "Bestsellers").
  - Collection description (mockup: "Best-loved. Best carried. From totes and hobos to minis, clutches, and backpacks, these are the bestsellers that women keep coming back to.").
- **Layout (desktop):**
  - Full-width band. Two columns: text panel on the left takes roughly 40% of the width, image on the right takes roughly 60%. `[NEEDS CLARIFICATION: exact column split, e.g. 40/60 or 5/7]`
  - Breadcrumb sits at the top-left of the text panel. Title and description are vertically centred (or slightly below centre) in the panel, left-aligned.
  - Title is a medium-weight heading, noticeably smaller than a hero heading. Description is small body text, max about 2–3 lines wide.
  - Image fills its column edge to edge (cover crop), no rounded corners. Banner height ≈ 385px at 1920px wide. `[NEEDS CLARIFICATION: banner height / aspect ratio of the image column]`
  - `[NEEDS CLARIFICATION: font family, sizes and weights for breadcrumb, title and description]`
- **Layout (mobile):** `[ASSUMPTION]` Columns stack. Image first (full width, roughly 4:3 or 16:9 crop), then the grey text panel with breadcrumb, title and description, left-aligned with standard page padding. `[ASSUMPTION]` Breadcrumb may alternatively sit above the image; choose image-first unless the merchant says otherwise.
- **Interactions & states:**
  - Breadcrumb "Home" link shows the theme's standard link hover.
  - No banner image and no collection image: the text panel spans the full width; no empty grey box or broken image is shown.
  - Empty description: title alone, no empty gap where the description would be.
  - Description containing rich text (links, bold) renders that formatting.
- **Acceptance criteria:**
  - [ ] AC1.1 The banner shows the current collection's title and description automatically. No title or description text is hard-coded.
  - [ ] AC1.2 Breadcrumb reads "Home / <collection title>", "Home" links to the storefront root, and the merchant can hide it.
  - [ ] AC1.3 On desktop, the text panel is on the left and the image on the right, in one row, at the stated split.
  - [ ] AC1.4 The merchant can pick a banner image in the editor. If none is set, the collection's featured image is used. If neither exists, the text panel spans full width.
  - [ ] AC1.5 The left panel's background is set by a colour scheme the merchant can change.
  - [ ] AC1.6 On mobile, image and text stack vertically with no horizontal scroll.
  - [ ] AC1.7 The image has meaningful alt text (image alt, else the collection title).
  - [ ] AC1.8 The same banner can be reused for the "Shop by video" page (V1) without collection-specific breakage (title/description editable when no collection is present).

### S2. Toolbar (count, Sort by, Filter, active chips)
- **Position:** Directly under S1, above S3. Separated from the grid by a thin horizontal rule (top and bottom borders in the mockup).
- **Merchant-editable content:**
  - Enable/disable sorting.
  - Enable/disable filtering.
  - Show/hide product count.
  - Which filters appear and their order are managed in Shopify admin (Search & Discovery), not in the theme.
- **Data-driven content:**
  - Product count for the current (filtered) result, e.g. "19 products". Singular for one ("1 product").
  - Sort options from Shopify (Featured, Best selling, Alphabetical, Price, Date).
  - Filter groups and values from Shopify's storefront filters (e.g. product type, colour, price, availability).
  - Number of active filter values, shown in the Filter label as "Filter (n)".
  - Active filter chips, one per applied value (mockup: "× Crossbody Bag").
- **Layout (desktop):**
  - Single row, full content width.
  - Product count centred in the row, small text.
  - "Sort by" with a down chevron and "Filter (1)" right-aligned, each in its own cell separated by thin vertical dividers.
  - Left side of the row is empty in the mockup.
  - Active filter chips sit in a row below the toolbar, left-aligned with the grid. Each chip is a small outlined pill with "×" before the label.
  - `[NEEDS CLARIFICATION: is there a "Clear all" link when 2+ chips are active? Not visible in the mockup]`
- **Layout (mobile):** `[ASSUMPTION]` Toolbar becomes a two-cell bar: "Sort by" left, "Filter (n)" right, each half width. Product count moves to its own line above or below the bar, centred. Chips wrap onto multiple lines (or scroll horizontally) under the bar.
- **Interactions & states:**
  - **Sort by:** opens a dropdown/list of sort options; selecting one updates the grid without a full page reload, keeps active filters, updates the URL, and marks the selected option. Current sort is reflected when the page loads with a sort in the URL.
  - **Filter (n):** opens a filter drawer. `[ASSUMPTION]` Drawer slides in from the right on desktop and from the bottom or right (full screen) on mobile, with an overlay behind it, a close (×) control, collapsible filter groups, and "Clear all" and "Apply"/"View results" actions. `[NEEDS CLARIFICATION: drawer side (left/right), and whether filters apply instantly or on "Apply"]`
  - "(n)" counts active filter values; with none active the label reads "Filter" (no "(0)"). `[ASSUMPTION]`
  - **Chip:** clicking a chip removes that filter value and refreshes the grid, count and "(n)".
  - Drawer closes on overlay click, close button and Escape; focus is trapped inside while open and returns to the Filter button on close.
  - **No results:** when filters return zero products, the grid area shows a merchant-editable or translatable "No products found" message with a way to clear filters; toolbar and chips stay visible.
  - Hover: Sort/Filter cells show the theme's standard hover (e.g. underline or colour change).
- **Acceptance criteria:**
  - [ ] AC2.1 The count shows the number of products matching the current filters and updates after sorting/filtering, with singular/plural wording from translations.
  - [ ] AC2.2 On desktop, the count is centred and Sort by / Filter (n) are right-aligned with vertical dividers, matching the mockup.
  - [ ] AC2.3 Sort by lists Shopify's sort options; choosing one reorders the grid, keeps filters, and is reflected in the URL.
  - [ ] AC2.4 Filter (n) opens a drawer listing the filters configured in Shopify admin; "n" equals the number of active filter values and is hidden when 0.
  - [ ] AC2.5 Each active filter value appears as a chip "× <value>"; clicking it removes the filter.
  - [ ] AC2.6 The drawer can be closed by button, overlay click and Escape, and keyboard focus is managed correctly.
  - [ ] AC2.7 Zero results show an empty-state message and a clear-filters action instead of an empty grid.
  - [ ] AC2.8 The merchant can disable sorting, filtering and the product count independently in the editor.
  - [ ] AC2.9 All toolbar labels ("Sort by", "Filter", "products", "Clear all") come from translations, not hard-coded text.

### S3. Product grid with inline promotional tiles
- **Position:** Under S2 and the chip row. Followed by S4 (pagination) then S5.
- **Merchant-editable content:**
  - Desktop columns (4 in the mockup) and mobile columns.
  - Promotional tiles, added as repeatable items. Per tile:
    - Image (required for display). `[NEEDS CLARIFICATION: should tiles also accept a video?]`
    - Overlay text in two parts: a highlighted word (e.g. "flora", "ayla", "ivo", shown on a small solid background box) and a plain continuation (e.g. "shoulder bag", "crossbody bag", "micro bag").
    - Link label (e.g. "SHOP NOW") and link URL (the whole tile is clickable).
    - Position in the grid (the slot or row it appears at).
    - Side: left (columns 1–2) or right (columns 3–4).
    - Text placement: top or bottom (the mockup shows top for the first two tiles and bottom for the third). Title is always on the left and "SHOP NOW" on the right of the same line.
    - Text colour / colour scheme for the overlay (white text on the mockup images). `[NEEDS CLARIFICATION: colour of the highlight box behind the first word; looks like a muted yellow/olive]`
  - `[NEEDS CLARIFICATION: font for the overlay text; it looks like a lowercase, light display face that differs from the body font]`
- **Data-driven content:** Every non-promo cell is the standard product card (spec 002): image, badge (BESTSELLER / ONLY FEW LEFT / SOLD OUT), wishlist heart, swatch thumbnails, title, price, compare-at price, red "% OFF". The grid shows the collection's products in the current sort and filter order.
- **Layout (desktop):**
  - 4 equal columns with small, equal gaps (~4–6px at 1920px). `[NEEDS CLARIFICATION: exact column gap and side padding]`
  - Promo tiles span **2 columns wide**. In the mockup each tile's height equals one product-card row (image + swatches + title + price), so it is 2 columns × 1 row, not 2 × 2 rows. `[NEEDS CLARIFICATION: brief says 2×2, mockup reads as 2 columns × 1 row. Confirm]`
  - Mockup placement (rows of the grid, counted from 1): row 2 left (cols 1–2), row 4 right (cols 3–4), row 6 left (cols 1–2). Products flow around the tiles, so rows with a tile hold 2 products.
  - Promo image covers its tile (cover crop), no rounded corners, no card chrome (no badge, heart, title or price).
  - With 19 products and 3 tiles, the last row holds one product left-aligned; partial last rows are left-aligned with no stretching.
- **Layout (mobile):** `[ASSUMPTION]` 2 product columns. Promo tiles span the full width (both columns) at their configured position, with height set by the image ratio (roughly 4:3 or square), and overlay text scaled down but still in one line where possible.
- **Interactions & states:**
  - Promo tile hover: `[ASSUMPTION]` subtle image zoom or "SHOP NOW" underline; cursor is a pointer.
  - Promo tile without an image: tile is not rendered (no empty block), products fill its place. In the theme editor a placeholder may be shown so the merchant can see where it will go.
  - Promo tile whose position is beyond the last product (e.g. a short or heavily filtered collection): not shown, or appended at the end. `[NEEDS CLARIFICATION: hide or append out-of-range tiles?]`
  - Tiles while filtering/sorting: `[NEEDS CLARIFICATION: should promo tiles stay visible when filters are active (the mockup shows them with one active filter)?]` Default `[ASSUMPTION]`: they stay.
  - Tiles on later pages: `[ASSUMPTION]` positions are counted on page 1 only and do not repeat on later pages / loaded batches.
  - Sold-out, on-sale, low-stock and no-image product states are handled by the standard product card (spec 002).
  - Empty collection: S2 count reads "0 products" and the grid area shows an empty-state message; promo tiles are hidden.
- **Acceptance criteria:**
  - [ ] AC3.1 Desktop grid shows 4 equal columns; mobile shows 2 (or the merchant-set values).
  - [ ] AC3.2 Every product cell is the standard product card from spec 002, with no grid-specific changes to the card.
  - [ ] AC3.3 The merchant can add, remove and reorder promo tiles in the theme editor, and set image, highlighted word, rest of the title, link label, link URL, position, side and text placement for each.
  - [ ] AC3.4 A promo tile spans exactly 2 columns on desktop and sits at the configured position and side; surrounding products flow around it with no gaps or duplicates.
  - [ ] AC3.5 The overlay shows the highlighted word on its background box followed by the plain words, with the link label on the opposite side of the same line, at the configured top/bottom placement.
  - [ ] AC3.6 The whole tile is a single link to the configured URL, with an accessible name taken from the tile title.
  - [ ] AC3.7 A tile with no image does not leave an empty space on the storefront.
  - [ ] AC3.8 No brand or product-line names (e.g. "flora", "ayla", "ivo") are hard-coded; all overlay text is merchant content.
  - [ ] AC3.9 Product count in S2 counts products only, never promo tiles.
  - [ ] AC3.10 On mobile, promo tiles span the full grid width without horizontal scroll.

### S4. Pagination / load more
- **Position:** Directly under the last row of S3, centred. Followed by S5.
- **Merchant-editable content:**
  - Products per page.
  - Pagination style. `[NEEDS CLARIFICATION: the mockup shows all 19 products with no control. Choose one of: numbered pages, "Load more" button, or infinite scroll]`
- **Data-driven content:** Total product count, current page, whether more products exist.
- **Layout (desktop):** `[ASSUMPTION]` A centred control under the grid, with spacing above S5. If "Load more" is chosen: an outlined button labelled from translations, optionally with "Showing X of Y". If numbered: previous/next arrows with page numbers.
- **Layout (mobile):** `[ASSUMPTION]` Same control, full width or centred, touch target at least 44px tall.
- **Interactions & states:**
  - When all products fit on one page (as in the mockup), no control is shown.
  - "Load more" / infinite scroll appends the next batch below the existing products without a full reload and keeps sort and filters; a loading state is shown while fetching; the control disappears after the last batch.
  - Changing sort or filters returns to the first page/batch.
  - The URL reflects the page so the result can be shared and the back button works. `[ASSUMPTION]`
- **Acceptance criteria:**
  - [ ] AC4.1 With products ≤ products-per-page, no pagination control is rendered.
  - [ ] AC4.2 With more products, the chosen control appears and loads/navigates to the next set, keeping the current sort and filters.
  - [ ] AC4.3 The merchant can set products per page in the editor.
  - [ ] AC4.4 Pagination labels come from translations and the control is keyboard accessible.
  - [ ] AC4.5 Changing sort or filters resets to the first page.

### S5. "Explore our categories" collection carousel
- **Position:** After the grid and pagination, before S6.
- **Merchant-editable content:**
  - Heading (mockup: "EXPLORE OUR CATEGORIES", uppercase, left-aligned). Case set by the merchant's text or a setting, not forced in code. `[NEEDS CLARIFICATION: is the uppercase a style or the literal copy?]`
  - Ordered list of collections to show (mockup: Tote Bags, Shoulder Bags, Crossbody Bags, Top Handle Bags).
  - Link label (mockup: "View products").
  - Optional image override per collection. `[ASSUMPTION]`
  - Number of visible tiles on desktop (4 in the mockup) and on mobile.
- **Data-driven content:** Each tile's collection title, collection image (unless overridden) and collection URL.
- **Layout (desktop):**
  - Heading above, left-aligned with the content edge.
  - 4 tiles visible in a row, equal width, small gap, no peek of a 5th tile.
  - Portrait images, roughly 7:8 at the mockup size (≈ 440 × 500px at 1920px). `[NEEDS CLARIFICATION: exact image aspect ratio, e.g. 4:5 or 3:4]`
  - Under each image: collection title (small text) and an underlined "View products" link, both left-aligned.
  - Prev/next arrows are small round buttons overlaid on the vertical middle of the images, at the left edge of the first tile and the right edge of the last tile.
- **Layout (mobile):** `[ASSUMPTION]` Horizontal swipe carousel with about 1.5–2 tiles visible (the next tile peeks in), arrows hidden, swipe enabled.
- **Interactions & states:**
  - Arrows move the carousel by one tile (or one page). `[NEEDS CLARIFICATION: step by 1 tile or by a full page of 4?]`
  - Arrow disabled/hidden at the start and end (no looping). `[ASSUMPTION]` The mockup shows both arrows, which suggests more than 4 collections exist.
  - With 4 or fewer collections on desktop, no arrows are shown.
  - Image and title and "View products" all link to the collection. Hover: `[ASSUMPTION]` subtle image zoom and link colour/underline change.
  - Collection without an image: show the theme's placeholder image in the same aspect ratio; layout does not shift.
  - No collections selected: the section is hidden on the storefront (placeholders shown in the editor only).
- **Acceptance criteria:**
  - [ ] AC5.1 The merchant can set the heading, choose and order the collections, and set the link label.
  - [ ] AC5.2 Desktop shows 4 tiles with prev/next arrows overlaid at the image mid-height; arrows appear only when there are more tiles than fit.
  - [ ] AC5.3 Each tile shows the collection image in a fixed portrait ratio, the collection title, and an underlined "View products" link, all leading to the collection.
  - [ ] AC5.4 Arrows are buttons with accessible labels and work by keyboard.
  - [ ] AC5.5 On mobile, the carousel scrolls by swipe with the next tile peeking.
  - [ ] AC5.6 A collection with no image keeps the same tile size using a placeholder.
  - [ ] AC5.7 The section can be hidden, removed or reordered in the theme editor.

### S6. SEO links text block with "Read more"
- **Position:** Last section before the footer, after S5.
- **Merchant-editable content:**
  - One or more labelled link groups. Each group: a label (mockup: "Shop by Categories :", "Shop by Color :") and a list of links (label + URL).
    - Categories (mockup): Tote Bags | Sling Bags | Side Bags | Shoulder Bags | Crossbody Bags.
    - Colours (mockup): Black Crossbody Bags | Pink Sling Bags | Brown Tote Bags | Green Crossbody Bags | Red Sling Bags…
  - Optional free rich text (paragraphs of SEO copy). `[ASSUMPTION]`
  - "Read more" / "Read less" labels (from translations).
  - Collapsed height (how many lines show before "Read more"). `[NEEDS CLARIFICATION: exact collapsed height; the mockup cuts off after about 4 lines]`
  - `[NEEDS CLARIFICATION: should the links come from a navigation menu chosen by the merchant, from free rich text, or both? Should the content be different per collection (e.g. a collection metafield) or the same on every collection?]`
- **Data-driven content:** None required. `[ASSUMPTION]` If per-collection content is chosen, it comes from a collection metafield and the section hides when empty.
- **Layout (desktop):**
  - Left-aligned, content width, small body text.
  - Each group: label on its own line, then links inline separated by " | ".
  - Collapsed state cuts off with a trailing "…" and shows an underlined "Read More" link below.
- **Layout (mobile):** `[ASSUMPTION]` Same structure with standard page padding; links wrap across lines; same collapsed line count.
- **Interactions & states:**
  - "Read more" expands to the full content and its label changes to "Read less"; clicking again collapses.
  - Content shorter than the collapsed height: no "Read more" link.
  - All content is present in the page markup when collapsed, so search engines can index it.
  - Links show the theme's standard link hover.
  - Empty content: the section renders nothing on the storefront.
- **Acceptance criteria:**
  - [ ] AC6.1 The merchant can edit the group labels and links (and optional rich text) in the editor; no category or colour names are hard-coded.
  - [ ] AC6.2 Links render inline separated by " | " under their group label.
  - [ ] AC6.3 Content is collapsed to the set height with "Read more" shown; clicking expands fully and switches to "Read less".
  - [ ] AC6.4 "Read more" is hidden when the content fits within the collapsed height.
  - [ ] AC6.5 The toggle is a button with `aria-expanded` that reflects its state and works by keyboard.
  - [ ] AC6.6 Full content exists in the page markup even when collapsed.
  - [ ] AC6.7 The section renders nothing when it has no content.

## Open questions
- `[NEEDS CLARIFICATION]` S1: exact hex of the banner's light grey left panel.
- `[NEEDS CLARIFICATION]` S1: column split (≈40/60) and banner height / image aspect ratio.
- `[NEEDS CLARIFICATION]` S1: fonts, sizes and weights for breadcrumb, title and description (text too small to read precisely).
- `[NEEDS CLARIFICATION]` S2: is there a "Clear all" link next to the chips when 2+ filters are active?
- `[NEEDS CLARIFICATION]` S2: filter drawer side (left/right) and whether filters apply instantly or on an "Apply" button.
- `[NEEDS CLARIFICATION]` S3: brief says promo tiles are 2×2, but in the mockup they span 2 columns × 1 card-row height. Which is correct?
- `[NEEDS CLARIFICATION]` S3: exact grid column gap and page side padding.
- `[NEEDS CLARIFICATION]` S3: should promo tiles accept video as well as image?
- `[NEEDS CLARIFICATION]` S3: colour of the highlight box behind the first overlay word, and the overlay font (looks like a light lowercase display face).
- `[NEEDS CLARIFICATION]` S3: when a tile's position is beyond the available products, hide it or append it at the end?
- `[NEEDS CLARIFICATION]` S3: should promo tiles stay visible while filters are active?
- `[NEEDS CLARIFICATION]` S4: pagination style: numbered pages, "Load more" button or infinite scroll; and products per page (mockup shows all 19 with no control).
- `[NEEDS CLARIFICATION]` S5: is "EXPLORE OUR CATEGORIES" literal uppercase copy or an uppercase style?
- `[NEEDS CLARIFICATION]` S5: exact image aspect ratio (≈7:8 measured; 4:5 or 3:4?).
- `[NEEDS CLARIFICATION]` S5: arrows step by one tile or by a full page of 4?
- `[NEEDS CLARIFICATION]` S6: collapsed height / line count before "Read more".
- `[NEEDS CLARIFICATION]` S6: links source (navigation menu, rich text, or both) and whether the content is global or per collection (metafield).

## Clarifications log
| Question | Answer | Date |
|---|---|---|
