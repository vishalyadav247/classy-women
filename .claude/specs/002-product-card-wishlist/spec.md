# Spec 002: Product card and wishlist

- **Status:** Draft
- **Mockup(s):**
  - `.claude/design/home.png`: product cards in "Most-loved styles" and "New arrivals"; wishlist heart icon in the header.
  - `.claude/design/collection.png`: product cards in the 4-column grid, including on-sale, "ONLY FEW LEFT" and "SOLD OUT" states.
  - `.claude/design/product.png`: product cards in "New arrivals", "You may also like" and "Recently viewed products"; wishlist heart next to "ADD TO CART" in the info column.
- **Template(s) affected:** `index`, `collection`, `product`, every template through the header (wishlist icon), and a new wishlist page template (`[ASSUMPTION]`, see S5).
- **Design-map rows:** G4 (product card), G5 (wishlist).

> The mockups are full-page desktop screenshots shown downscaled. Exact pixel sizes, fonts, colours and small copy can't be read reliably. Any value not stated here is marked `[NEEDS CLARIFICATION]`.

## Goal
Shoppers see the same consistent product card wherever products are listed: home carousels, the collection grid and the product-page carousels. The card shows a status badge, colour options as small product thumbnails, the price, and the saving when the product is on sale, so they can compare products at a glance. Shoppers can also save products to a wishlist from any card or from the product page, see how many items they have saved from the header, and come back to that list later, including as guests. This lets them shortlist products without adding them to the cart.

## In scope / Out of scope
- **In:**
  - The product card's visual structure, content and states (G4) wherever it appears.
  - The wishlist toggle on cards, the wishlist toggle on the product page next to Add to cart, the wishlist icon and count in the header, wishlist persistence, and a page that lists saved items (G5).
- **Out:**
  - The sections and carousels that contain cards: tabs, arrows, "View all" / "Shop all bestsellers" buttons, column counts of the host section, and promo tiles in the collection grid (specs 004–006).
  - Shoppable video cards with product title and price under the video (spec 003).
  - The rest of the product-page info column (title, price/MRP line, EMI line, variant picker, Add to cart, pincode check). Only the wishlist heart beside Add to cart is in scope here.
  - The rest of the header layout (G2). Only the wishlist icon and its count are in scope.
  - The product-page media-gallery badge (P1). This spec's badge rules should be reused there, but the gallery itself belongs to P1.

## Sections

### S1. Product card: media area
- **Position:** The top of every product card. Below it come the indicator line (S2), then the swatch row (S3), then the text (S4).
- **Merchant-editable content:**
  - Card-level settings, available wherever the card is configured:
    - image aspect ratio
    - show/hide badge
    - show/hide wishlist heart
    - media background colour (the light grey in the mockups)
  - Badge label text for each badge type (for example "BESTSELLER", "NEW", "ONLY FEW LEFT", "SOLD OUT"), editable as translatable content and not hard-coded.
  - Which signal drives each badge (see Open questions).
- **Data-driven content:**
  - The product's featured image, or the selected variant's image.
  - The badge type, derived from product data:
    - SOLD OUT: no variant is available.
    - ONLY FEW LEFT: low inventory.
    - NEW and BESTSELLER: source to be confirmed.
  - The wishlist state for this product (saved or not saved).
- **Layout (desktop):**
  - The product image sits centred on a flat, light-grey background `[NEEDS CLARIFICATION: exact hex]`. Product shots appear as cut-outs with no visible border or radius on the media box `[NEEDS CLARIFICATION: confirm 0 radius]`.
  - The media box is portrait. It measures about 4:5 in the collection grid and home carousels `[NEEDS CLARIFICATION: exact ratio; it reads as roughly 4:5 to 3:4]`. All cards in a row share the same ratio.
  - The badge sits in the top-left corner, inset from the edges. It is small uppercase text with no visible pill or background fill `[NEEDS CLARIFICATION: font, size, letter-spacing, colour; whether there is any background]`.
    - Exception: the product-page gallery badge (P1) appears as white text on a black fill. Confirm whether cards should ever use that style.
  - The wishlist heart sits in the top-right corner, inset by the same amount as the badge. It is an outline heart icon with no background circle.
  - Badge and heart are vertically aligned on the same top line.
- **Layout (mobile):** `[ASSUMPTION]`
  - The card keeps the same structure, aspect ratio and corner positions.
  - The badge text and heart scale down, but the heart's tappable area is at least 44×44 px.
  - The host section decides the column count (out of scope). The card must render correctly at about 160 px wide (2 columns on a 360 px viewport) without the badge and heart overlapping.
- **Interactions & states:**
  - **Hover (desktop):**
    - The whole card links to the product page.
    - `[ASSUMPTION]` On hover the image changes to the product's second image, if one exists. Horizon's standard behaviour stays in place.
    - `[NEEDS CLARIFICATION]` Confirm whether hovering should show the second image or swipe through all images (see S2).
  - **Heart:** see S5. Clicking the heart never navigates to the product page.
  - **Sold out:**
    - The badge reads SOLD OUT.
    - The image is not dimmed or greyed in the mockup `[NEEDS CLARIFICATION: confirm no dimming]`.
    - The heart is still shown and still works.
  - **No badge:** if no badge rule applies, the top-left corner is empty. The mockup shows this on the collection grid's second card.
  - **More than one rule applies:** only one badge is shown, chosen by a fixed priority. `[ASSUMPTION]` The priority is SOLD OUT > ONLY FEW LEFT > NEW > BESTSELLER `[NEEDS CLARIFICATION: confirm order]`.
  - **No image:** the grey media box keeps its aspect ratio and shows a neutral placeholder. Badge and heart still render.
- **Acceptance criteria:**
  - [ ] AC1.1 Every product card on home, collection and product templates shows the product image centred on a flat background colour that the merchant can set in the theme editor.
  - [ ] AC1.2 All cards within one section render the media box at the same aspect ratio, and the merchant can choose that ratio in the theme editor.
  - [ ] AC1.3 A product with no available variants shows the "SOLD OUT" badge in the top-left corner of the media box.
  - [ ] AC1.4 A product that meets the low-stock rule and is still available shows the "ONLY FEW LEFT" badge.
  - [ ] AC1.5 A product that meets the "new" rule shows "NEW", and a product that meets the "bestseller" rule shows "BESTSELLER". The rules are those confirmed in Open questions.
  - [ ] AC1.6 At most one badge is shown per card, chosen by the documented priority order.
  - [ ] AC1.7 A product that matches no badge rule shows no badge and leaves no empty box or gap.
  - [ ] AC1.8 Badge label text can be changed or translated without editing code.
  - [ ] AC1.9 The merchant can hide badges and the wishlist heart separately in the theme editor.
  - [ ] AC1.10 The heart sits in the top-right corner, top-aligned with the badge, and has a tappable area of at least 44×44 px on touch devices.
  - [ ] AC1.11 A product with no images shows a placeholder at the same aspect ratio. The badge and heart still render.

### S2. Product card: indicator line under the image
- **Position:** Directly under the media box and above the swatch row, spanning the full card width.
- **Merchant-editable content:** Show/hide toggle `[ASSUMPTION]`.
- **Data-driven content:** The number of images, and which image is showing `[ASSUMPTION]`.
- **Layout (desktop):**
  - A thin horizontal track in a light tone, with a short dark segment at the left end. The segment is about one-fifth to one-quarter of the track's width in the mockup.
  - `[NEEDS CLARIFICATION: thickness, colours, gap to the image]`
- **Layout (mobile):** `[ASSUMPTION]` Same as desktop. It acts as the position indicator when the shopper swipes through card images.
- **Interactions & states:**
  - `[NEEDS CLARIFICATION]` What does this line represent? There are two readings:
    - **(a)** An image-position indicator for an in-card image carousel. The dark segment is 1/N of the width and moves as images change.
    - **(b)** A purely decorative divider.
  - `[ASSUMPTION]` Reading (a).
  - With one image, the line is hidden, or the segment fills the whole track `[NEEDS CLARIFICATION]`.
- **Acceptance criteria:**
  - [ ] AC2.1 A thin indicator line appears under the media box on every card, unless the merchant turns it off.
  - [ ] AC2.2 (Depends on the answer about reading (a).) For a product with N images, the dark segment is 1/N of the track width. It moves to the matching position when the shopper changes the image on that card, on hover/arrow on desktop or by swiping on mobile.
  - [ ] AC2.3 For a product with a single image, the line follows the confirmed single-image behaviour.

### S3. Product card: colour swatch thumbnails
- **Position:** Below the indicator line and above the product title. Left-aligned.
- **Merchant-editable content:**
  - Show/hide swatches.
  - Maximum number of swatches shown before an overflow indicator.
    - The mockup shows up to 5 on a 4-column grid.
    - `[NEEDS CLARIFICATION: max count and the overflow style, e.g. "+3"]`
- **Data-driven content:**
  - One thumbnail per value of the product's colour option, showing that variant's image (a small product photo, not a flat colour chip).
  - The selected or default colour.
- **Layout (desktop):**
  - A single row of small square thumbnails with small even gaps. Each thumbnail shows the product image on a light background.
  - The selected or current colour has a thin dark border. The others have a light or no border.
  - `[NEEDS CLARIFICATION: thumbnail size (about 28–32 px at 1920 wide), border colour/width, gap]`
- **Layout (mobile):** `[ASSUMPTION]`
  - Thumbnails shrink slightly but stay at least 24 px.
  - If they don't fit on one line, the row shows as many as fit, followed by a "+N" overflow indicator. It does not wrap or scroll sideways.
- **Interactions & states:**
  - `[ASSUMPTION]` Hover on desktop, or tap on mobile:
    - Choosing a thumbnail switches the card's main image to that variant's image.
    - It updates the price and badge to match that variant, if they differ.
    - It updates the card link so it opens the product page with that variant pre-selected.
    - It does not navigate by itself.
  - **Unavailable colour variant:** the thumbnail stays visible `[ASSUMPTION]`. It is shown with a strike-through or reduced opacity `[NEEDS CLARIFICATION: style]`.
  - **No colour option, or only one colour:**
    - `[ASSUMPTION]` A single thumbnail is shown. The mockup shows single-thumbnail cards (for example "Caroline Crossbody Bag", "Nona Crossbody Bag").
    - `[NEEDS CLARIFICATION]` For products with no colour option at all, is the row hidden or does it show one thumbnail?
  - **Variant has no image:** fall back to the colour swatch defined for the option value, or to the product's featured image.
- **Acceptance criteria:**
  - [ ] AC3.1 For a product with a colour option, the card shows one thumbnail per colour value, using that variant's image.
  - [ ] AC3.2 The current or default colour's thumbnail has a visible selected border, and only one thumbnail is marked selected at a time.
  - [ ] AC3.3 Choosing a different thumbnail changes the card's main image and updates the card link to that variant. Price and badge also update if the variant differs.
  - [ ] AC3.4 When there are more colours than the configured maximum, the extra ones are summarised by an overflow indicator and the row does not wrap.
  - [ ] AC3.5 The merchant can turn swatches on or off in the theme editor.
  - [ ] AC3.6 Each thumbnail has an accessible name equal to its colour value and can be operated with the keyboard.

### S4. Product card: title and price
- **Position:** The bottom of the card, below the swatch row. Left-aligned.
- **Merchant-editable content:**
  - Show/hide compare-at price.
  - Show/hide discount label.
  - Discount label wording (for example "{{ percent }}% OFF"), editable and translatable.
- **Data-driven content:**
  - Product title.
  - Current price for the selected or default variant.
  - Compare-at price.
  - Discount percentage, calculated from the price and compare-at price.
- **Layout (desktop):**
  - **Line 1:** product title, in sentence/title case, regular weight, dark text, single line `[NEEDS CLARIFICATION: truncate with ellipsis, or allow 2 lines]`.
  - **Line 2, all inline on one baseline:**
    1. The current price in dark text, slightly bolder than the title (e.g. "₹3,239.00").
    2. The compare-at price, struck through in grey (e.g. "₹3,999.00").
    3. The discount label in red uppercase (e.g. "19% OFF").
  - Card prices show the currency symbol with two decimal places.
  - `[NEEDS CLARIFICATION: font family/size/weight, red hex]`
- **Layout (mobile):** `[ASSUMPTION]` Same order. If line 2 doesn't fit, the discount label wraps onto its own line, and the price and compare-at price stay together.
- **Interactions & states:**
  - **On sale** (the compare-at price is higher than the price): show the price, the struck compare-at price and "NN% OFF".
  - **Not on sale:** show the price only, with no strike-through and no label. Examples are the cards under "New arrivals".
  - **Variants priced differently:** show the price of the default or selected variant `[NEEDS CLARIFICATION: or "From ₹x" when variant prices differ]`.
  - **Sold out:** the price and discount still show (as on the collection mockup's SOLD OUT cards).
  - **Discount percentage rounding:** the mockup values are consistent with rounding to the nearest whole number. For example, 3,239 / 3,999 gives 19%, and 1,999 / 3,999 gives 50%.
    - `[NEEDS CLARIFICATION: round to the nearest whole number, or always round down so the saving is never overstated]`
  - **Title hover:** `[ASSUMPTION]` the title is underlined on hover. The whole card is a single link target.
- **Acceptance criteria:**
  - [ ] AC4.1 The card shows the product title, then the price line. Both are left-aligned and sit below the swatches.
  - [ ] AC4.2 When the compare-at price is greater than the price, the card shows the price, then the compare-at price struck through, then the discount label in the sale colour, in that order on one line on desktop.
  - [ ] AC4.3 The discount percentage equals (compare-at − price) / compare-at × 100, rounded by the confirmed rule. For example, ₹3,239 against ₹3,999 shows "19% OFF".
  - [ ] AC4.4 When there is no compare-at price, or it is not greater than the price, only the price is shown and there is no empty gap.
  - [ ] AC4.5 Prices use the store's currency formatting. On cards, prices show the currency symbol and two decimal places.
  - [ ] AC4.6 The discount label text and sale colour can be changed in the theme editor or through translations without editing code.
  - [ ] AC4.7 The same card (S1–S4) renders identically in home "Most-loved styles" and "New arrivals", the collection grid, and product-page "New arrivals", "You may also like" and "Recently viewed products". The only differences are those caused by data.

### S5. Wishlist
> **DEFERRED: Shopify wishlist app (decision A1).** None of S5 is built in the theme. The theme only keeps a clean slot where a wishlist app can inject its heart: an `@app` block slot on the card media area, the PDP buy area and the header. All S5 ACs are out of scope for this build.

- **Position:**
  - **(a)** The heart in the top-right corner of every product card (S1).
  - **(b)** The heart on the product page: a square outline button directly left of "ADD TO CART", on the same row and at the same height.
  - **(c)** The heart icon in the header actions: between the search icon and the cart icon, after the account icon.
  - **(d)** A wishlist page that lists saved products. The mockups don't show one `[ASSUMPTION]`.
- **Merchant-editable content:**
  - Turn the wishlist on or off store-wide. Turning it off hides all hearts and the header icon.
  - Wishlist page heading and empty-state message, with an empty-state button label and link (for example "Continue shopping" pointing to a collection).
  - Whether the header shows a count badge.
  - The text announced to screen readers and shown in confirmation messages, such as "Added to wishlist" and "Removed from wishlist".
- **Data-driven content:**
  - The shopper's saved products: product, and the variant if saved from the product page with a variant selected `[NEEDS CLARIFICATION: product-level or variant-level saving]`.
  - The number of saved items.
  - On the wishlist page, live product data for each saved item (title, image, price, compare-at price, availability), shown with the S1–S4 card.
- **Layout (desktop):**
  - **Card heart:** see S1.
  - **Product-page heart:**
    - A square outline icon button with a thin border. Its height matches the Add to cart button.
    - The heart icon is centred in it.
  - **Header heart:**
    - An outline heart, the same size and line weight as the other header icons.
    - `[ASSUMPTION]` When the count is above 0, a small count bubble shows on the icon, in the same style as the cart count.
    - The mockup shows no bubble, so `[NEEDS CLARIFICATION]` whether a count should be shown at all.
  - **Wishlist page `[ASSUMPTION]`:**
    - Page heading, then a grid of the S1–S4 card in the same column count as the collection grid (4 columns on desktop).
    - Each card's heart is in the filled state. Clicking it removes the item.
- **Layout (mobile):** `[ASSUMPTION]`
  - The card heart stays in the top-right corner of the media box.
  - The product-page heart stays left of Add to cart. If Add to cart becomes sticky on mobile, the heart goes with it `[NEEDS CLARIFICATION]`.
  - The header heart stays visible in the mobile header and is not moved into the menu drawer `[NEEDS CLARIFICATION: mobile header may lack room]`.
  - The wishlist page uses a 2-column grid.
- **Interactions & states:**
  - **Toggle:**
    - Clicking or tapping an outline heart saves the product, and the heart becomes filled `[NEEDS CLARIFICATION: filled colour, black or brand accent]`.
    - Clicking a filled heart removes the product, and the heart returns to outline.
    - The change is immediate, with no page reload.
  - **Sync:** every heart for the same product on the page updates together, for example if the product appears in two carousels or on the product page and in "Recently viewed". The header count updates at the same moment.
  - **Feedback:** the change is announced to screen readers. `[ASSUMPTION]` There is no visible toast.
  - **Persistence for guests:** saved items persist in this browser on this device across sessions until removed `[ASSUMPTION]`. No login is required.
  - **Persistence for logged-in customers:** `[NEEDS CLARIFICATION]`
    - Should the wishlist be stored against the customer account, so it follows them across devices?
    - Should a guest's list merge into the account list on login?
    - Is a third-party wishlist app planned instead?
  - **Header icon click:** opens the wishlist page `[ASSUMPTION]`.
  - **Empty wishlist:** the page shows the merchant's empty-state message and button. The header count is hidden.
  - **Saved product later deleted or unpublished:** it is silently dropped from the list and the count.
  - **Saved product later sold out:** it stays in the list and shows the SOLD OUT badge.
  - **Adding to cart from the wishlist page:** not in the mockups `[NEEDS CLARIFICATION: is a quick add-to-cart needed on wishlist cards, or does the card only link to the product page]`.
  - **Wishlist turned off:** no hearts render anywhere and the header icon is hidden.
  - **Maximum items:** `[NEEDS CLARIFICATION: any limit]`.
- **Acceptance criteria:**
  - [ ] AC5.1 Every product card shows an outline heart in the top-right corner when the wishlist is on.
  - [ ] AC5.2 The product page shows a heart button directly left of Add to cart, matching its height.
  - [ ] AC5.3 The header shows a heart icon between search and cart, styled like the other header icons, and it links to the wishlist page.
  - [ ] AC5.4 Clicking an outline heart saves the product without reloading the page or navigating, and the heart changes to its filled state.
  - [ ] AC5.5 Clicking a filled heart removes the product, and the heart returns to outline.
  - [ ] AC5.6 After a toggle, every heart for that product on the current page shows the new state, and the header count updates without a reload.
  - [ ] AC5.7 A guest who saves products, closes the browser and returns to the store on the same device sees the same products saved: hearts filled, count correct, and the wishlist page listing them.
  - [ ] AC5.8 On page load, hearts for already-saved products render as filled.
  - [ ] AC5.9 The wishlist page lists every saved product using the standard product card (S1–S4) with live price, compare-at price, discount and badge.
  - [ ] AC5.10 With no saved items, the wishlist page shows the merchant-editable empty-state heading, message and button, and the header shows no count.
  - [ ] AC5.11 A saved product that no longer exists or isn't published is not shown and is not counted.
  - [ ] AC5.12 Every heart is a button with an accessible name that includes the product title and reflects its state, for example "Add Sabrina Crossbody Bag to wishlist" or "Remove … from wishlist". It is operable by keyboard and has a visible focus style.
  - [ ] AC5.13 The merchant can turn the wishlist off store-wide in the theme editor. When it is off, no heart appears on cards, the product page or the header.
  - [ ] AC5.14 All wishlist UI text (button labels, announcements, page heading, empty state) can be edited or translated without changing code.

## Open questions
- `[NEEDS CLARIFICATION]` **Badge source: BESTSELLER.** Product tag (e.g. `bestseller`), a product metafield, membership of a "Bestsellers" collection, or sales-based?
- `[NEEDS CLARIFICATION]` **Badge source: NEW.** Product tag, metafield, membership of a "New arrivals" collection, or published within the last N days (what N)?
- `[NEEDS CLARIFICATION]` **Badge source: ONLY FEW LEFT.** Inventory at or below a threshold (what number, and is it merchant-set)? Is it total inventory across variants, or per selected variant? Does it apply when inventory isn't tracked?
- `[NEEDS CLARIFICATION]` **Badge source: SOLD OUT.** Confirm it means "no variant available for sale".
- `[NEEDS CLARIFICATION]` **Badge priority** when several apply. Proposed: SOLD OUT > ONLY FEW LEFT > NEW > BESTSELLER.
- `[NEEDS CLARIFICATION]` **Custom badges.** Should merchants be able to set a free-text custom badge per product (e.g. via a metafield) as well as the four types?
- `[NEEDS CLARIFICATION]` **Badge styling.** The card badge appears to be plain small uppercase text, while the product-page gallery badge is white on black. Should they match? Exact font, size, letter-spacing and colours?
- `[NEEDS CLARIFICATION]` **Card media.** Background hex, exact aspect ratio, corner radius (appears 0), and whether sold-out images are dimmed (appears not).
- `[NEEDS CLARIFICATION]` **Indicator line.** Is the line under the image a position indicator for an in-card image carousel, or decorative? Behaviour with a single image? Thickness and colours?
- `[NEEDS CLARIFICATION]` **Card image hover.** Second image on hover, or swiping through all images with arrows?
- `[NEEDS CLARIFICATION]` **Swatch thumbnails.** Size, border style, gap, maximum shown, overflow style (+N), how unavailable colours look, and whether the row is hidden for products with no colour option.
- `[NEEDS CLARIFICATION]` **Swatch interaction.** On hover or on click (desktop)? Should it update price and badge, or only the image?
- `[NEEDS CLARIFICATION]` **Title.** Single-line truncation or two lines?
- `[NEEDS CLARIFICATION]` **Typography and colours.** Font family, sizes and weights for title, price, compare-at price and discount. Hex for the sale red and the grey compare-at price.
- `[NEEDS CLARIFICATION]` **Discount rounding.** Nearest whole number or always rounded down?
- `[NEEDS CLARIFICATION]` **Price display.** Should products with different variant prices show "From ₹x" or the default variant's price?
- `[NEEDS CLARIFICATION]` **Wishlist level.** Save the product or the specific variant?
- `[NEEDS CLARIFICATION]` **Wishlist for logged-in customers.**
  - Should the list be stored on the customer account (cross-device)?
  - Should a guest list merge on login?
  - Or is a third-party wishlist app planned?
- `[NEEDS CLARIFICATION]` **Wishlist page.** Not in the mockups. Confirm a dedicated page is wanted, plus its layout, heading copy and empty-state copy and link. Also confirm whether wishlist cards need quick add-to-cart or a remove button besides the heart.
- `[NEEDS CLARIFICATION]` **Header wishlist count.** Show a count bubble (none is visible in the mockup)? Should the heart appear in the mobile header or move into the menu drawer?
- `[NEEDS CLARIFICATION]` **Filled heart.** Colour (black, or a brand/sale accent), and whether a visible toast or confirmation is wanted on toggle.
- `[NEEDS CLARIFICATION]` **Mobile sticky Add to cart.** Does the product-page heart go with it?
- `[NEEDS CLARIFICATION]` **Wishlist limits.** Is there a maximum number of saved items?

## Clarifications log
| Question | Answer | Date |
|---|---|---|
