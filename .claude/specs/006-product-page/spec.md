# Spec 006: Product page (PDP)

- **Status:** Draft
- **Mockup(s):** `.claude/design/product.png`, everything between the header and the footer except "Watch and buy" (design-map rows P1–P4)
- **Template(s) affected:** `product` (default product template)

## Goal
Shoppers get a clear, image-led product page. On the left is a two-column grid of large product photos. On the right is a column that stays in view while they scroll and holds everything needed to buy: title, price with MRP and discount, tax note, an EMI / pay-later offer, colour swatches, wishlist and Add to cart. Under that sit a pincode delivery check, key features and expandable details. Below the main area, three product carousels ("New arrivals", "You may also like" with tabs, "Recently viewed products") keep shoppers browsing. Merchants can edit every heading, label and piece of copy in the theme editor. Product facts come from Shopify product data.

## In scope / Out of scope
- **In:**
  - Breadcrumb.
  - Media gallery: 2-column grid, badge on the first image, 360°/video icon.
  - Product info column: title, price block, tax note, EMI line + "Buy at EMI", colour swatches, wishlist heart placement, Add to cart.
  - Delivery details pincode check (P2), defining behaviour only. The data source is an open question.
  - Key features 2-column bullets and four accordions (P3).
  - "New arrivals", "You may also like" (tabbed) and "Recently viewed products" carousels (P4).
  - Section order for the product template.
- **Out (reference only):**
  - Header, announcement bar and footer: spec 001.
  - Product card appearance (badge, heart, swatch thumbnails, price/% OFF on cards) and wishlist behaviour: spec 002. This spec only covers where the PDP heart sits and that it is present.
  - "Watch and buy" shoppable video (P5): spec 003. This spec only fixes its position in the template.

## Sections

### S1. Breadcrumb
- **Position:** The first item under the header, above the media grid and the info column, left-aligned with the media grid's left edge.
- **Merchant-editable content:** Show or hide the breadcrumb. `[NEEDS CLARIFICATION: should the home crumb label be merchant-editable or come from the theme's translations?]`
- **Data-driven content:** Home link, then the current product title. The mockup shows two levels ("Home / Sabrina Crossbody Bag"). `[NEEDS CLARIFICATION: should a collection crumb appear when the shopper arrived from a collection (Home / Collection / Product)?]`
- **Layout (desktop):** One line of small text with "/" separators. The last crumb (the current page) is not a link and is visually muted.
- **Layout (mobile):** `[ASSUMPTION]` Same single line. If the product title is too long, it truncates with an ellipsis rather than wrapping onto more than one line.
- **Interactions & states:** Earlier crumbs are links with a hover state (underline or colour change). The current crumb is not interactive.
- **Acceptance criteria:**
  - [ ] AC1.1 The breadcrumb renders above the media and info columns and shows "Home" linking to the storefront root, then the product title.
  - [ ] AC1.2 The current product crumb is not a link.
  - [ ] AC1.3 The merchant can hide the breadcrumb from the theme editor without affecting the rest of the page.
  - [ ] AC1.4 The breadcrumb contains no hard-coded brand name.

### S2. Product media gallery
- **Position:** Left part of the main product area, under the breadcrumb, beside the info column (S3–S5).
- **Merchant-editable content:**
  - Gallery layout setting kept at a 2-column grid.
  - Whether the badge shows on the first image.
  - Image aspect ratio / crop.
- **Data-driven content:**
  - All product media (images, video, 3D model) in admin order.
  - When the selected variant has its own image, the gallery shows that colour's media.
  - Badge text (e.g. "BESTSELLER"). Its source follows spec 002's badge rules. `[NEEDS CLARIFICATION: confirm the PDP badge uses the same source (tag/metafield) as card badges in 002]`
  - The 360°/video icon on any media item that is a video or 3D model.
- **Layout (desktop):**
  - Media takes roughly the left 55–60% of the content width. `[NEEDS CLARIFICATION: exact column split; it reads as about 58/38 with a gap]`
  - Two equal columns of tiles with a small gutter, all the same portrait ratio. `[NEEDS CLARIFICATION: exact aspect ratio; it reads as about 3:4]`
  - The mockup shows 9 media. The odd last item sits alone in the left column and leaves the right cell empty, so it does not stretch.
  - Light grey tile background behind packshots.
  - The badge is a small black label with white uppercase text in the top-left corner of the **first** media only.
  - A circular 360° icon sits in the bottom-right corner of the media it belongs to (the 2nd tile in the mockup).
  - No arrows or thumbnails on desktop.
- **Layout (mobile):** `[ASSUMPTION]` The grid collapses to a full-width, swipeable single-image carousel with a position indicator (dots or counter). The badge stays on the first slide and the 360° icon stays on its slide.
- **Interactions & states:**
  - Clicking an image opens the theme's zoom / lightbox. `[ASSUMPTION]` This keeps Horizon's existing zoom behaviour.
  - A video or 3D media item plays or activates in place when its tile or icon is clicked.
  - No image: one placeholder tile is shown and the grid does not collapse.
  - Changing the colour swatch updates the gallery to that variant's media.
- **Acceptance criteria:**
  - [ ] AC2.1 On desktop the product media renders as a 2-column grid with equal-width columns and the same aspect ratio on every tile.
  - [ ] AC2.2 With an odd number of media, the last tile keeps its size (it is not stretched to full width).
  - [ ] AC2.3 The badge shows only on the first media item, top-left, and only when the product qualifies for a badge. With no badge, nothing is rendered there.
  - [ ] AC2.4 Video and 3D media items show a 360°/play icon in the bottom-right corner. Image-only items show no icon.
  - [ ] AC2.5 Choosing a different colour swatch changes the gallery to that variant's media.
  - [ ] AC2.6 A product with no media shows a placeholder and the layout does not break.
  - [ ] AC2.7 On mobile the media is a swipeable carousel, not a stacked 2-column grid.
  - [ ] AC2.8 Every image has alt text (taken from the media alt, or the product title if empty).

### S3. Product info column (buy area)
> **Decisions A1/A6:** the wishlist heart beside Add to cart comes from a wishlist app (the theme provides an `@app` block slot only). The EMI / pay-later line is pending the user's edit of decisions.md A6. Pay-later providers usually ship their own app widget, so the default is to defer it to the provider app.

- **Position:** Right column of the main product area. Order from the top: title → price block → tax note → EMI line → colour picker → wishlist + Add to cart → then S4 and S5. On desktop the column stays in view (sticky) while the shopper scrolls the taller media grid, and it is released when the grid ends.
- **Merchant-editable content:**
  - Tax note text (default "Inclusive of all Taxes").
  - Label before the compare-at price (default "MRP").
  - Discount label format (default "{n}% OFF").
  - EMI line: on/off, template text (e.g. "or {amount}/month ({n} months) via"), number of instalments, provider logo image, button label (default "Buy at EMI") and button behaviour (see open questions).
  - Swatch label text (default "Color:").
  - Add to cart button label comes from the theme's translations.
  - Sticky on/off.
- **Data-driven content:**
  - Product title.
  - Price, compare-at price, and the discount %, calculated from price and compare-at and rounded to a whole number.
  - EMI monthly amount, calculated from the current variant price. The mockup shows ₹3,239 / 4 ≈ ₹810. `[NEEDS CLARIFICATION]`
  - Selected option value (e.g. "Wine").
  - Swatch thumbnails (variant images, or the swatch image / colour from the option value).
  - Variant availability.
- **Layout (desktop):**
  - Title in uppercase, medium size.
  - Price row on one line: sale price (dark, larger) · "MRP" label + compare-at struck through (grey) · discount % (red).
  - Tax note in small grey text directly below.
  - EMI line in a full-width bordered pill or box: text plus provider logo on the left, small black "Buy at EMI" button on the right.
  - The colour label reads "Color: Wine", with "Color:" muted and the value dark.
  - A row of square image swatches (5 shown). The selected swatch has a dark border.
  - Below that: an outlined heart icon button on the left, then the full-width black "ADD TO CART" button with white uppercase text filling the rest of the row.
  - No quantity selector is visible. `[NEEDS CLARIFICATION: confirm the quantity selector is hidden]`
- **Layout (mobile):** `[ASSUMPTION]`
  - The info column stacks under the media carousel at full width, in the same order, with no sticky behaviour.
  - Swatches wrap or scroll horizontally.
  - The heart + Add to cart row stays on one line.
- **Interactions & states:**
  - **On sale** (compare-at > price): show MRP, the struck compare-at price and the red % OFF.
  - **Not on sale:** show only the price, with no MRP label, strikethrough or % OFF.
  - **Swatch hover:** a border or highlight appears. **Swatch selected:** dark border, the label value updates, and price, media, availability and URL update to that variant.
  - **Unavailable variant swatch:** visually marked (e.g. faded or crossed) and still selectable.
  - **Sold out:** the Add to cart button is disabled and reads "Sold out". The EMI line stays visible. `[NEEDS CLARIFICATION: hide the EMI line when sold out?]`
  - Add to cart shows a loading state, then opens the theme's cart drawer or cart feedback.
  - The heart toggles wishlist state as defined in spec 002.
  - "Buy at EMI" behaviour is unknown (see open questions).
  - Single-variant product: no swatch row.
- **Acceptance criteria:**
  - [ ] AC3.1 The order in the info column is title, price row, tax note, EMI line, colour picker, wishlist + Add to cart, and each item can be reordered or hidden in the theme editor.
  - [ ] AC3.2 When compare-at > price, the price row shows the sale price, then the editable "MRP" label plus the compare-at price struck through, then the discount as a whole-number "% OFF" in red.
  - [ ] AC3.3 When there is no compare-at price, or it is ≤ price, only the price shows.
  - [ ] AC3.4 The tax note text is editable in the theme editor and can be blank or hidden.
  - [ ] AC3.5 The EMI line can be switched off. When on, its text, instalment count, logo and button label are all editable, and the monthly amount updates when the variant changes.
  - [ ] AC3.6 The colour label shows the option name and the currently selected value, and updates on selection.
  - [ ] AC3.7 Colour swatches render as image thumbnails, and the selected swatch has a visible border distinct from the others.
  - [ ] AC3.8 Selecting a swatch updates price, discount, media, availability and the URL variant without a full page reload.
  - [ ] AC3.9 The heart button sits to the left of Add to cart on the same row. Add to cart is black with white uppercase text and fills the remaining width.
  - [ ] AC3.10 For a sold-out variant, Add to cart is disabled and labelled "Sold out".
  - [ ] AC3.11 On desktop the info column stays in view while the media grid scrolls past, and the merchant can turn this off.
  - [ ] AC3.12 No brand name or EMI provider name is hard-coded. The provider logo and name are merchant content.

### S4. Delivery details (pincode check), P2
> **DEFERRED (decision A5): skipped for now.** No pincode block is built. Revisit with a logistics app.

- **Position:** In the info column, directly under the wishlist + Add to cart row and above Key features.
- **Merchant-editable content:**
  - Heading (default "Delivery Details").
  - Input placeholder (default "Enter your Pincode").
  - Button label (default "CHECK").
  - Success, failure and invalid-input messages, with placeholders for things like the estimated delivery date or days and COD availability.
  - Show/hide.
- **Data-driven content:** The serviceability result for the pincode the shopper enters. The source is undefined (see open questions).
- **Layout (desktop):** Small heading, then one row holding a full-width bordered text input with a black "CHECK" button attached on the right. The result message appears under the row.
- **Layout (mobile):** `[ASSUMPTION]` Same row at full width. The button keeps its fixed width and the input shrinks.
- **Interactions & states (expected behaviour, pending clarification):**
  - The input accepts digits only, up to 6 (Indian PIN format). Pressing Enter or clicking CHECK submits.
  - **Invalid** (not 6 digits): an inline error appears and no lookup happens.
  - **Loading:** the button is disabled and shows a busy state.
  - **Serviceable:** a success message appears, e.g. estimated delivery, with COD shown if available.
  - **Not serviceable:** a failure message appears.
  - **Lookup error or timeout:** a generic "try again" message appears.
  - `[ASSUMPTION]` The last checked pincode is remembered for the session and pre-filled on other product pages.
  - The check never blocks Add to cart.
- **Acceptance criteria:**
  - [ ] AC4.1 The heading, placeholder, button label and all result messages are editable in the theme editor.
  - [ ] AC4.2 Input that is not exactly 6 digits shows the invalid message and makes no lookup.
  - [ ] AC4.3 A valid pincode triggers a lookup. During the lookup the button is disabled, and afterwards exactly one of the success, failure or error messages is shown.
  - [ ] AC4.4 Result messages are announced to assistive technology (polite live region), and the input has an accessible label.
  - [ ] AC4.5 The block can be hidden. When it is hidden, nothing is rendered and nothing is requested.
  - [ ] AC4.6 Add to cart works whatever the pincode result is.

### S5. Key features and accordions, P3
- **Position:** In the info column under Delivery details. Key features comes first, then four accordions in this order: "Why You'll Love It?", "Details & Dimensions", "Shipping & Returns", "More Information".
- **Merchant-editable content:**
  - Key features heading.
  - Each accordion's heading, whether it starts open or closed, and its content source.
  - Shared copy such as Shipping & Returns, which can be static rich text or a page.
- **Data-driven content:**
  - Key features bullets, per product. The mockup shows "Multiple Functional Pockets", "Buckled Belt Detail", "Flap Magnetic Closure", "Detachable Crossbody Strap".
  - "Why You'll Love It?", "Details & Dimensions" and "More Information" content, per product.
  - `[NEEDS CLARIFICATION: which product fields/metafields hold key features and each accordion's content, and whether "Why You'll Love It?" is the product description]`
- **Layout (desktop):**
  - "Key Features" is a small heading followed by a bulleted list in **two columns**, filled top-to-bottom then left-to-right. With 4 items that gives 2 per column.
  - Accordions are full-width rows split by thin horizontal dividers. Each has its title on the left and a chevron on the right, and all are closed by default.
- **Layout (mobile):** `[ASSUMPTION]` Key features drops to a single column below about 400px of available width, or keeps 2 columns if the items are short. The accordions are unchanged.
- **Interactions & states:**
  - Clicking a row toggles it open or closed and the chevron rotates.
  - More than one accordion can be open at once. `[ASSUMPTION]`
  - Empty: if a product has no key features, the whole Key features group, heading included, is hidden. If an accordion's content is empty for a product, that accordion row is hidden.
- **Acceptance criteria:**
  - [ ] AC5.1 Key features render as a bulleted list in two columns on desktop, with item text taken from the product's data and not typed into the template.
  - [ ] AC5.2 Key features, heading included, are hidden when the product has no features.
  - [ ] AC5.3 Four accordions render in the order above, and each heading can be edited and reordered in the theme editor.
  - [ ] AC5.4 All accordions are closed on load. Each opens and closes by mouse and by keyboard (Enter/Space), and its expanded state is exposed to assistive technology.
  - [ ] AC5.5 An accordion with empty content for the current product is not rendered.
  - [ ] AC5.6 Shipping & Returns content can be set once and shown on every product.

### S6. "New arrivals" carousel, P4
- **Position:** First full-width section after the main product area.
- **Merchant-editable content:**
  - Heading (default "NEW ARRIVALS").
  - Source collection.
  - Number of products.
  - "View all" label and link (defaults to the source collection).
- **Data-driven content:** Product cards, as in spec 002 (badge, heart, swatch thumbnails, title, price, compare-at, % OFF).
- **Layout (desktop):**
  - Uppercase heading left-aligned above the row.
  - 4 cards visible with no peek.
  - Under the row: a centred small black "View all" button, and prev/next arrow buttons at the right edge on the same line.
- **Layout (mobile):** `[ASSUMPTION]` About 2 cards visible with a peek of the next one, swipeable. Arrows hidden. "View all" stays centred below.
- **Interactions & states:**
  - Arrows scroll one page or card. The prev arrow is disabled at the start and next is disabled at the end.
  - Arrows are hidden when all products fit.
  - Empty or no collection set: the section is hidden on the storefront and shows a placeholder in the editor.
- **Acceptance criteria:**
  - [ ] AC6.1 The section shows products from the merchant-chosen collection, 4 per view on desktop.
  - [ ] AC6.2 The heading and "View all" label and link are editable. "View all" links to the source collection by default.
  - [ ] AC6.3 The prev and next arrows sit bottom-right and are disabled at their respective ends.
  - [ ] AC6.4 An empty or unset collection hides the section on the storefront.
  - [ ] AC6.5 The current product is excluded from the list. `[ASSUMPTION]`

### S7. "You may also like" tabbed carousel, P4
- **Position:** After "New arrivals".
- **Merchant-editable content:**
  - Heading (default "YOU MAY ALSO LIKE").
  - Tabs: 1 to n, each with a label and a source collection. The mockup shows "CROSSBODY BAG" and "WINE BAGS".
  - "View all" label. Its link follows the active tab's collection.
- **Data-driven content:** Product cards (spec 002) for the active tab.
- **Layout (desktop):** Heading, then a row of uppercase text tabs. The active tab is underlined and the others are muted. Then the 4-card row, then "View all" centred with arrows at the right, the same as S6.
- **Layout (mobile):** `[ASSUMPTION]` The tab row scrolls horizontally if it overflows. Cards behave as in S6.
- **Interactions & states:**
  - The first tab is active on load.
  - Clicking a tab swaps the products and the "View all" link, and resets the carousel to the start. The page does not reload.
  - The active tab has the underline style. Hovering an inactive tab darkens it.
  - A tab whose collection is empty is hidden. If all tabs are empty, the section is hidden.
  - With one tab, the tab row is hidden. `[ASSUMPTION]`
  - `[NEEDS CLARIFICATION: should tabs be fixed collections chosen by the merchant, or derived per product (e.g. product type and colour, or Shopify related/complementary recommendations)?]`
- **Acceptance criteria:**
  - [ ] AC7.1 The merchant can add, remove and reorder tabs, and give each one a label and a collection.
  - [ ] AC7.2 The first tab is active on load and visibly underlined.
  - [ ] AC7.3 Selecting a tab shows that tab's products and points "View all" to that tab's collection, with no full page reload.
  - [ ] AC7.4 The tabs are keyboard operable and expose the selected state to assistive technology.
  - [ ] AC7.5 Empty tabs are not shown, and the section is hidden when every tab is empty.
  - [ ] AC7.6 Arrows and "View all" match the S6 layout and states.

### S8. "Recently viewed products", P4
- **Position:** After "You may also like" and before "Watch and buy" (S9 / spec 003).
- **Merchant-editable content:** Heading (default "RECENTLY VIEWED PRODUCTS") and the maximum number of products.
- **Data-driven content:** Products this shopper viewed earlier, from the browser's history of viewed products, most recent first, shown as product cards (spec 002). The mockup includes a "SOLD OUT" badge on one card.
- **Layout (desktop):** Uppercase heading, then a row of 4 cards. The mockup shows no "View all" and no arrows.
- **Layout (mobile):** `[ASSUMPTION]` Same as S6 mobile, a swipeable row with a peek.
- **Interactions & states:**
  - The current product is excluded.
  - No history (for example a first visit): the section is not shown, and leaves no empty heading or gap.
  - More products than fit: arrows appear as in S6. `[ASSUMPTION]`
  - Sold-out products still appear, with a sold-out badge.
- **Acceptance criteria:**
  - [ ] AC8.1 The section lists previously viewed products, most recent first, up to the merchant-set maximum.
  - [ ] AC8.2 The product currently being viewed never appears in its own list.
  - [ ] AC8.3 With no history, the section, heading included, is not displayed.
  - [ ] AC8.4 Sold-out products show the sold-out badge defined in spec 002.

### S9. Template section order
The product template must contain these sections in this order, with each one reorderable in the theme editor:
1. Header group (announcement bar + header): spec 001
2. Breadcrumb (S1)
3. Main product: media gallery (S2) + info column (S3 → S4 → S5)
4. New arrivals (S6)
5. You may also like (S7)
6. Recently viewed products (S8)
7. Watch and buy (P5): spec 003, placeholder position only
8. Footer group: spec 001
- **Acceptance criteria:**
  - [ ] AC9.1 The default product template renders sections 2–7 in the order above between the header and the footer groups.
  - [ ] AC9.2 Every section and block in S1–S8 can be hidden or reordered in the theme editor without code changes.
  - [ ] AC9.3 No UI copy in S1–S8 is hard-coded. All of it is editable or translatable.

## Open questions
- `[NEEDS CLARIFICATION]` Fonts, sizes and weights for the title, price, labels, headings and buttons (not readable from the downscaled mockup).
- `[NEEDS CLARIFICATION]` Exact colours: discount red, muted grey text, tile background grey, EMI box border.
- `[NEEDS CLARIFICATION]` Media-to-info column split and gutters; media aspect ratio (about 3:4?).
- `[NEEDS CLARIFICATION]` Breadcrumb: include a collection crumb when one is known? Should the home label be editable?
- `[NEEDS CLARIFICATION]` Badge source on the first media: same rule as the card badges in spec 002?
- `[NEEDS CLARIFICATION]` EMI: provider (the mockup shows a pay-later logo, treated as placeholder content). Is the monthly amount simply price ÷ instalments, rounded? Does "Buy at EMI" open a provider modal or widget, an external link, or add to cart and go to checkout? Hide it when sold out or below a minimum price?
- `[NEEDS CLARIFICATION]` Is the quantity selector intentionally hidden on the PDP?
- `[NEEDS CLARIFICATION]` Pincode check data source: a third-party logistics/serviceability API (which one, and with what auth, which must not be exposed in the storefront), an app proxy, a merchant-maintained list (metaobject or file of serviceable pincodes with delivery days), or checkout shipping rates? What should the success message contain (delivery date or range, COD yes/no)? Should it vary per product or variant? Should the pincode persist across pages?
- `[NEEDS CLARIFICATION]` Where key features and each accordion's content live (product metafields? the description?). Is "Why You'll Love It?" the product description? Is "Shipping & Returns" shared copy or a page?
- `[NEEDS CLARIFICATION]` "You may also like" tabs: fixed merchant-chosen collections, or per-product (Shopify related/complementary recommendations, same type or colour)?
- `[NEEDS CLARIFICATION]` "New arrivals" source collection, and the product count for all carousels.
- `[NEEDS CLARIFICATION]` Recently viewed: maximum count, and should it show arrows or "View all" when there are more than 4?

## Clarifications log
| Question | Answer | Date |
|---|---|---|
