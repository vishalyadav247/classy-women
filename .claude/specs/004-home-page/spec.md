# Spec 004: Home page body

- **Status:** Done (2026-11-19)
- **Mockup(s):** `.claude/design/home.png`. Covers everything between the header (spec 001) and the footer (spec 001), which is design-map rows H1–H12. H10 is listed for page order only and is specified in spec 003.
- **Template(s) affected:** `index`

## Goal
The home page is the brand's shop window. Shoppers see a seasonal campaign hero and the brand promise first. They can then browse by occasion and by editorial edit, shop bestsellers by bag type in one tabbed carousel, see what is new, find gifting, and see press credibility and a fraud-safety notice before reaching the footer. The merchant controls every image, word, link, collection and logo in the theme editor, so the page can be re-merchandised each season without code changes.

## In scope / Out of scope
- In: H1 hero slideshow, H2 tagline, H3 "Made for every moment" tiles, H4 "Most-loved styles" tabbed product carousel, H5 "New in" tiles, H6 "New arrivals" carousel, H7 gifting banner, H8 "In the spotlight" 2-up carousel, H9 "Trending now" tiles, H11 "Featured on" press logos, H12 "Important update" band, and the section order of the home template.
- Out (reference only):
  - Announcement bar, header and footer are in spec 001.
  - The product card (badge, wishlist heart, swatches, title, price, compare-at, % OFF) is in spec 002. In this spec, every product tile "uses the standard product card from spec 002".
  - H10 "The style edit" video carousel is in spec 003. Only its position is fixed here.

## Conventions used in this spec
- "Content width" means the theme's standard page width with side margins. In the mockup, content starts about 60px from the left edge of a 1920px canvas. Sections H1, H7, H11 and H12 are **full-bleed**, edge to edge. All other sections sit inside the content width.
- "Section heading" means the left-aligned, uppercase, small, bold-ish heading style shared by H3, H4, H5, H6, H8, H9, H10 and H11, such as "MADE FOR EVERY MOMENT". All section headings must use one shared style so they look identical. `[RESOLVED — see Clarifications log: heading font family, size, weight, letter-spacing]`
- "Tile caption" means the small uppercase label left-aligned under an image tile, such as "EVERYDAY ICONS". H3, H5 and H9 must share this style.
- Vertical spacing between sections looks uniform in the mockup, at roughly 80–100px. `[RESOLVED — see Clarifications log: exact section spacing]`. Spacing is merchant-adjustable per section.
- All copy shown in the mockup is example merchant content, not hard-coded text. The brand name "MIRAGGIO" and the press names are placeholders.

## Page order (home template)
| # | Section | Map row | Width |
|---|---|---|---|
| — | Header group: announcement bar and header (spec 001) | G1, G2 | full |
| 1 | Hero slideshow | H1 | full-bleed |
| 2 | Brand tagline | H2 | content |
| 3 | Made for every moment | H3 | content |
| 4 | Most-loved styles | H4 | content |
| 5 | New in | H5 | content |
| 6 | New arrivals | H6 | content |
| 7 | Gifting banner | H7 | full-bleed |
| 8 | In the spotlight | H8 | content |
| 9 | Trending now | H9 | content |
| 10 | The style edit (spec 003) | H10 | content, right edge bleeds (peek) |
| 11 | Featured on | H11 | full-bleed |
| 12 | Important update | H12 | full-bleed |
| — | Footer group (spec 001) | G3 | full |

- **Page-order acceptance criteria:**
  - [ ] AC0.1 A fresh install of the home template shows sections 1–12 in exactly the order above, between the header group and the footer group.
  - [ ] AC0.2 Each section can be reordered, hidden or removed in the theme editor independently, with no section depending on another being present.
  - [ ] AC0.3 Every section in the home template has a merchant-facing name in the editor that matches its heading or purpose, such as "Most-loved styles".
  - [ ] AC0.4 No brand name, press name, product name or campaign copy appears in code or translations. All of it lives in section or block settings, or in template content.
  - [ ] AC0.5 With every section in its default state, Theme Check reports no new errors.

## Sections

### S1. Hero slideshow (H1)
- **Position:** First section, directly below the header. Followed by S2 tagline.
- **Merchant-editable content (per slide):**
  - Desktop image, plus an optional separate mobile image.
  - Optional heading, such as "A/W 26".
  - Optional small subtext lines under the heading. In the mockup, two very small lines sit left and right under "A/W 26". `[RESOLVED — see Clarifications log: subtext copy is unreadable]`
  - Link label, such as "SHOP NOW", and link URL.
  - Optional link for the whole slide.
  - Text colour (light or dark) for legibility.
  - Content position. Slide 1 places the heading in the top-right and the "SHOP NOW" link in the bottom-right.
- **Section-level settings:** Autoplay on or off, autoplay interval, slide height (desktop and mobile).
- **Data-driven content:** None.
- **Layout (desktop):**
  - Full-bleed image across the 1920px width, about 660px tall in the mockup (roughly 2.9:1).
  - The slide-1 image is a triptych of the same product in three panels. It is one merchant image, not three blocks.
  - The heading is large, thin, light-coloured display type at the top-right.
  - "SHOP NOW" is a small uppercase text link, not a filled button, at the bottom-right.
  - Pagination indicators (dots or a small counter) sit at the bottom-right, below or beside the link.
  - No arrows are visible. `[RESOLVED — see Clarifications log: are prev/next arrows wanted, or only dots? Is the indicator dots or "1/3" numbers?]`
- **Layout (mobile):** `[ASSUMPTION]`
  - Shows the mobile image if one is set. Otherwise the desktop image is cropped to fill a portrait or near-square frame (about 4:5).
  - Text keeps its relative position but stacks to the bottom if a corner position would overflow.
  - Swipe changes slides.
  - Indicators stay visible.
- **Interactions & states:**
  - Autoplay pauses on hover, on focus, and when the shopper prefers reduced motion.
  - Swipe and drag on touch.
  - Keyboard users can move between slides.
  - The active indicator is visually distinct.
  - One slide hides the indicators and disables autoplay.
  - A slide with no image shows the theme's placeholder in the editor and is not rendered broken on the storefront.
  - A slide with no link label shows no link.
- **Acceptance criteria:**
  - [ ] AC1.1 The merchant can add, remove and reorder slides in the theme editor.
  - [ ] AC1.2 Each slide has image, mobile image, heading, subtext, link label, link URL, text colour and content position settings.
  - [ ] AC1.3 On desktop the slideshow spans the full viewport width with no side margins.
  - [ ] AC1.4 The heading can sit at the top-right while the link sits at the bottom-right of the same slide, matching the mockup.
  - [ ] AC1.5 "SHOP NOW" renders as an uppercase underlined or plain text link, not a filled button.
  - [ ] AC1.6 Slide indicators appear at the bottom-right and reflect the active slide.
  - [ ] AC1.7 Autoplay and its interval are merchant settings. Autoplay respects reduced-motion.
  - [ ] AC1.8 With one slide, no indicators show and no autoplay runs.
  - [ ] AC1.9 Every slide image has merchant-controllable alt text, using the image's alt.
  - [ ] AC1.10 On mobile, the mobile image is used when set.

### S2. Brand tagline (H2)
- **Position:** Directly below S1 and above S3.
- **Merchant-editable content:** One rich-text line, such as "We design for women who are driven by instinct, ambition, and an ever-evolving sense of style."
- **Data-driven content:** None.
- **Layout (desktop):** Single line of small body text, centred, inside the content width. Generous padding above and below, about 40–60px. No heading and no button. `[RESOLVED — see Clarifications log: font size and colour of tagline]`
- **Layout (mobile):** `[ASSUMPTION]` Centred, wraps onto multiple lines, with side padding equal to page margins.
- **Interactions & states:** None. With empty text the section renders nothing, or only the editor placeholder.
- **Acceptance criteria:**
  - [ ] AC2.1 The tagline text is editable rich text in the theme editor.
  - [ ] AC2.2 The text is horizontally centred on desktop and mobile.
  - [ ] AC2.3 Alignment, text size and vertical padding are adjustable by the merchant.
  - [ ] AC2.4 The section has no hard-coded copy.

### S3. "Made for every moment" (H3)
- **Position:** Below S2 and above S4.
- **Merchant-editable content:**
  - Section heading, such as "MADE FOR EVERY MOMENT".
  - Four tiles. For each tile:
    - Image.
    - Caption, such as "EVERYDAY ICONS", "WORK READY", "DAY TO NIGHT", "TRAVEL ESSENTIALS".
    - Link, typically a collection.
  - If a tile is linked to a collection and has no custom image or caption, it falls back to the collection's image and title.
- **Data-driven content:** Collection image and title only as fallbacks.
- **Layout (desktop):**
  - Heading left-aligned above the tiles.
  - 4 equal columns that fill the content width, with a small gutter (about 8–12px).
  - Images are portrait, roughly 0.92:1 (about 440×480px in the mockup). `[RESOLVED — see Clarifications log: exact tile aspect ratio, 4:5 or 1:1?]`
  - Images have no rounded corners.
  - The caption sits below the image, left-aligned, in the tile-caption style.
  - No arrows and no peek.
- **Layout (mobile):** `[ASSUMPTION]` Horizontal swipe carousel showing about 1.5–2 tiles with the next one peeking. A 2×2 grid is the alternative if the merchant chooses grid. Captions stay under images.
- **Interactions & states:**
  - On hover, the image zooms slightly or the caption is underlined. `[RESOLVED — see Clarifications log: hover effect]`
  - The whole tile is clickable.
  - A tile with no image shows a placeholder in the editor.
  - A tile with no link is not clickable.
- **Acceptance criteria:**
  - [ ] AC3.1 The heading text is editable, and hiding it removes it.
  - [ ] AC3.2 The merchant can add, remove and reorder tiles. The default shows 4.
  - [ ] AC3.3 Desktop shows 4 tiles per row at equal widths across the content width.
  - [ ] AC3.4 Each tile's image, caption and link are editable. Captions render uppercase in the shared tile-caption style.
  - [ ] AC3.5 All tiles share the same aspect ratio, which is a merchant setting.
  - [ ] AC3.6 The entire tile, image and caption, is a single link target.
  - [ ] AC3.7 Mobile behaviour matches the stated assumption, or the confirmed clarification.

### S4. "Most-loved styles" tabbed product carousel (H4)
- **Position:** Below S3 and above S5.
- **Merchant-editable content:**
  - Section heading, such as "MOST-LOVED STYLES".
  - An ordered list of tabs. Each tab has a label and a collection. The mockup labels are "ALL BESTSELLERS", "TOTE", "SHOULDER", "TOP HANDLE", "CROSSBODY", "MINI & MICRO".
  - Number of products per tab.
  - A button label and link under the carousel, such as "Shop All Bestsellers". `[RESOLVED — see Clarifications log: should the button link follow the active tab's collection, or always point to one fixed URL?]`
- **Data-driven content:** Products from each tab's collection, rendered with the standard product card from spec 002. That card supplies the image, badge, wishlist heart, swatches, title, price, compare-at price and % OFF.
- **Layout (desktop):**
  - Heading left-aligned.
  - Directly below the heading, a single row of left-aligned uppercase text tabs. The active tab is darker and underlined. Inactive tabs are lighter, with no underline.
  - Below the tabs, a carousel showing exactly 4 product cards across the content width. No peek is visible.
  - Below the carousel, a centred black filled button, "Shop All Bestsellers".
  - Prev/next arrow buttons sit at the bottom-right, on the same row as the button. They are small square outlined icons. The prev arrow is greyed out at the start.
- **Layout (mobile):** `[ASSUMPTION]`
  - The tab row scrolls horizontally without wrapping, with the active tab kept in view.
  - The carousel shows about 1.5–2 cards with a peek and is swipeable.
  - Arrows are hidden on mobile.
  - The button is centred below.
- **Interactions & states:**
  - Clicking a tab switches the carousel to that collection's products without a full page reload, and resets to the first slide.
  - Exactly one tab is active, and the first tab is active on load.
  - Tabs are keyboard accessible, using tab semantics: arrow keys move between tabs, and the selected state is announced.
  - The arrows step the carousel. Prev is disabled at the start and next at the end. If all products fit, both are disabled or hidden.
  - A tab whose collection has no products shows a short merchant-editable empty message, or the tab is hidden. `[RESOLVED — see Clarifications log: hide empty tabs vs show empty message]`
  - With only one tab configured, the tab row is hidden.
  - Sold-out, on-sale and badge states come from the spec 002 card.
- **Acceptance criteria:**
  - [ ] AC4.1 The merchant can add, remove, reorder and relabel tabs, and pick one collection per tab.
  - [ ] AC4.2 On load, the first tab is active (underlined, darker) and its products are shown.
  - [ ] AC4.3 Selecting another tab shows that tab's collection products without a full page navigation.
  - [ ] AC4.4 Desktop shows 4 cards per view with prev/next arrows at the bottom-right. Arrow disabled states are correct at both ends.
  - [ ] AC4.5 Product tiles use the standard product card from spec 002, with no section-specific card markup.
  - [ ] AC4.6 Product count per tab is a merchant setting.
  - [ ] AC4.7 The button label and link are editable. The button is centred under the carousel and uses the primary (black) button style.
  - [ ] AC4.8 Tabs are operable by keyboard and exposed to assistive technology as tabs with a selected state.
  - [ ] AC4.9 Empty-collection behaviour matches the clarified rule.
  - [ ] AC4.10 On mobile, the tab row scrolls horizontally rather than wrapping.

### S5. "New in" tiles (H5)
- **Position:** Below S4 and above S6.
- **Merchant-editable content:**
  - Section heading, such as "NEW IN".
  - Four tiles, each with an image, caption and link. The mockup captions are "OFF THE CLOCK", "A/W 26 COLLECTION", "MIRAGGIO FORWARD", "FRIENDS x MIRAGGIO". These are editorial edits, not necessarily collections, so any link is allowed.
- **Data-driven content:** None. Optional collection image and title fallback when a tile links to a collection.
- **Layout (desktop):**
  - The same structure as S3: heading left-aligned, 4 equal columns, caption under each image in the tile-caption style.
  - Images are slightly taller than in S3, roughly 0.86:1 (about 440×510px). `[RESOLVED — see Clarifications log: exact aspect ratio; is it intentionally different from S3?]`
  - Small chevron icons appear on the left edge of tile 1 and the right edge of tile 4. These may be carousel arrows (more than 4 tiles) or part of the photography. `[RESOLVED — see Clarifications log: is "New in" a carousel with overlay arrows, or a static 4-up grid?]`
- **Layout (mobile):** `[ASSUMPTION]` Same as S3 mobile: a swipe carousel with a peek.
- **Interactions & states:**
  - Same as S3.
  - If the section is a carousel, overlay arrows appear only when there are more tiles than fit, and are disabled at the ends.
- **Acceptance criteria:**
  - [ ] AC5.1 The heading, tiles, images, captions and links are all editable, and tiles can be added, removed and reordered.
  - [ ] AC5.2 Desktop shows 4 equal tiles across the content width with captions below.
  - [ ] AC5.3 Captions use the same tile-caption style as S3.
  - [ ] AC5.4 The tile aspect ratio is a merchant setting, independent of S3.
  - [ ] AC5.5 If confirmed as a carousel, overlay arrows appear only when tiles overflow.

### S6. "New arrivals" product carousel (H6)
- **Position:** Below S5 and above S7.
- **Merchant-editable content:**
  - Section heading, such as "NEW ARRIVALS".
  - Collection.
  - Product count.
  - Button label and link, such as "View all".
- **Data-driven content:** Products from the selected collection, rendered with the standard product card from spec 002. In the mockup every card shows a "NEW" badge, which comes from the card's badge logic.
- **Layout (desktop):**
  - Identical to S4 but without tabs.
  - Heading left-aligned.
  - 4 cards per view across the content width.
  - Centred black "View all" button below.
  - Prev/next arrows at the bottom-right.
- **Layout (mobile):** `[ASSUMPTION]` The same as S4 mobile, without tabs.
- **Interactions & states:**
  - Arrow behaviour is the same as S4.
  - With an empty collection, the section shows nothing on the storefront and a placeholder in the editor.
  - With no button label, no button is shown.
- **Acceptance criteria:**
  - [ ] AC6.1 The heading, collection, product count, button label and button link are editable.
  - [ ] AC6.2 Desktop shows 4 cards per view, with arrows at the bottom-right and correct disabled states.
  - [ ] AC6.3 Cards use the standard product card from spec 002.
  - [ ] AC6.4 The "View all" button is centred below the carousel in the primary button style, and defaults to linking to the chosen collection.
  - [ ] AC6.5 S4 and S6 look visually identical apart from S4's tab row.

### S7. Gifting banner (H7)
- **Position:** Below S6 and above S8. Full-bleed.
- **Merchant-editable content:**
  - Background image, plus an optional mobile image.
  - Left group:
    - Small eyebrow or brand line, such as "MIRAGGIO". This could be text or a logo image. `[RESOLVED — see Clarifications log]`
    - Large display heading, such as "GIFTING EDIT", in a tall condensed serif. `[RESOLVED — see Clarifications log: font; is the heading live text or part of the image?]`
  - Right group:
    - Subheading, such as "Curate Your Own Bundle", in a serif.
    - Link label and URL, such as "SHOP NOW", shown as an underlined uppercase text link.
  - Text colour (light in the mockup).
  - Optional link for the whole banner.
- **Data-driven content:** None.
- **Layout (desktop):**
  - Full-bleed image, about 545px tall (roughly 3.5:1).
  - The left text group is vertically centred at the left content margin.
  - The right text group is vertically centred and right-aligned toward the right content margin, with the link under the subheading.
  - The product photography sits in the centre of the image, and the text must not cover it.
- **Layout (mobile):** `[ASSUMPTION]`
  - Uses the mobile image, or a cropped desktop image at about 4:5.
  - Left and right groups stack vertically, with the heading group on top and the subheading and link below. Both are left-aligned or both centred (merchant choice), and they overlay the image at the top and bottom.
- **Interactions & states:**
  - The link has a hover state, such as underline thickness or opacity change.
  - Without an image, a placeholder shows in the editor and a solid background colour shows on the storefront.
- **Acceptance criteria:**
  - [ ] AC7.1 The banner spans the full viewport width on desktop.
  - [ ] AC7.2 Text appears in two independent groups: eyebrow and heading at the left, subheading and link at the right. Each group's copy is editable.
  - [ ] AC7.3 The link renders as an uppercase underlined text link, not a filled button.
  - [ ] AC7.4 Image, mobile image, text colour and banner height are merchant settings.
  - [ ] AC7.5 On mobile the two groups stack without overlapping each other.

### S8. "In the spotlight" 2-up carousel (H8)
- **Position:** Below S7 and above S9.
- **Merchant-editable content:**
  - Section heading, such as "IN THE SPOTLIGHT".
  - Slides. For each slide:
    - Image.
    - Overlay label text, such as "off the clock" or "ayla crossbody bag".
    - Link.
  - The overlay label appears as lowercase text on a highlight background (a yellow or khaki marker effect) at the top-left of the image. `[RESOLVED — see Clarifications log: is the highlighted label live text with a configurable highlight colour, or baked into the photo? Exact highlight colour hex]`
- **Data-driven content:** None. Optionally, a slide may link to a product or collection.
- **Layout (desktop):**
  - Heading left-aligned.
  - 2 slides per view, filling the content width with a small gutter.
  - Images are landscape, roughly 4:3 (about 900×675px).
  - Prev/next arrows are small circular white buttons overlaid at the vertical middle of the carousel's left and right edges. In the mockup they sit on the second visible slide's left edge and at the far right. `[RESOLVED — see Clarifications log: exact arrow positions]`
  - No caption below the images.
- **Layout (mobile):** `[ASSUMPTION]` 1 slide per view with a peek of the next, swipeable. Arrows are hidden and the label overlay stays at the top-left.
- **Interactions & states:**
  - Arrows step one slide at a time and are disabled or hidden at the ends.
  - With 2 or fewer slides, the arrows are hidden.
  - The whole slide is clickable when a link is set.
  - With no label, no highlight box is shown.
- **Acceptance criteria:**
  - [ ] AC8.1 The heading is editable. Slides can be added, removed and reordered, each with image, label and link.
  - [ ] AC8.2 Desktop shows 2 slides per view at equal widths.
  - [ ] AC8.3 The label renders at the top-left over the image with a highlight background. The highlight colour is a merchant setting.
  - [ ] AC8.4 Arrows are overlaid at the vertical middle, step one slide at a time, and hide when there are 2 or fewer slides.
  - [ ] AC8.5 The aspect ratio is a merchant setting and defaults to landscape.
  - [ ] AC8.6 On mobile, 1 slide is shown per view and swipe works.

### S9. "Trending now" tiles (H9)
- **Position:** Below S8 and above S10 (The style edit).
- **Merchant-editable content:**
  - Section heading, such as "TRENDING NOW".
  - Three tiles, each with an image, caption and link. The mockup captions are "SCULPTED SILHOUETTE", "COLOR OF THE SEASON", "TINY STATEMENTS".
- **Data-driven content:** None. Optional collection fallback as in S3.
- **Layout (desktop):**
  - Heading left-aligned.
  - 3 equal columns across the content width.
  - Images are near-square to slightly landscape, roughly 1.2:1 (about 600×490px). `[RESOLVED — see Clarifications log: exact aspect ratio]`
  - The caption sits below each tile in the tile-caption style.
  - No arrows.
- **Layout (mobile):** `[ASSUMPTION]` Swipe carousel with a peek, about 1.2 tiles per view, or a single-column stack.
- **Interactions & states:** Same as S3.
- **Acceptance criteria:**
  - [ ] AC9.1 The heading and tiles are editable. Tiles can be added, removed and reordered, and the default is 3.
  - [ ] AC9.2 Desktop shows 3 equal tiles per row across the content width.
  - [ ] AC9.3 Captions match the S3 and S5 tile-caption style.
  - [ ] AC9.4 The tile aspect ratio is a merchant setting.

### S10. "The style edit" (H10) — reference only
- **Position:** Below S9 and above S11. Fully specified in spec 003. This spec only requires that it occupies this slot in the home template.
- **Acceptance criteria:**
  - [ ] AC10.1 Once spec 003 is implemented, its section is placed between "Trending now" and "Featured on" in the home template.

### S11. "Featured on" press logos (H11)
- **Position:** Below S10 and above S12.
- **Merchant-editable content:**
  - Section heading, such as "FEATURED ON".
  - Logo blocks. For each logo:
    - Image. The mockup shows GRAZIA, BAZAAR, COSMOPOLITAN, ELLE and GRAZIA again. All are placeholder press logos.
    - Optional link, such as to the article.
    - Alt text.
  - Logo height.
  - Scroll speed.
- **Data-driven content:** None.
- **Layout (desktop):**
  - Heading left-aligned at the content margin.
  - The logo row is full-bleed and edge to edge. Logos are cut off at both viewport edges (the left one shows a partial "E"), which suggests a continuously scrolling marquee.
  - Logos are evenly spaced, vertically centred and about 40px tall.
  - Logos keep their own colours. COSMOPOLITAN is pink and the others are black, so logos are uploaded images, not tinted text.
  - `[RESOLVED — see Clarifications log: is the strip an auto-scrolling marquee or a static row that overflows?]`
- **Layout (mobile):** `[ASSUMPTION]` The same marquee with smaller logos (about 28px tall) and the same edge-to-edge bleed.
- **Interactions & states:**
  - If it is a marquee: scrolls continuously and loops seamlessly with no visible gap or jump.
  - It pauses on hover and focus, and it stops completely when reduced motion is preferred. With reduced motion, the logos become a static, horizontally scrollable row.
  - A logo block without an image is skipped.
- **Acceptance criteria:**
  - [ ] AC11.1 The heading is editable. Logos are separate blocks that can be added, removed and reordered, each with image, alt text and optional link.
  - [ ] AC11.2 Logos render in their original colours, with no forced monochrome filter by default.
  - [ ] AC11.3 The logo row spans the full viewport width.
  - [ ] AC11.4 Logo height and scroll speed are merchant settings.
  - [ ] AC11.5 Motion pauses on hover and focus, and does not animate under reduced-motion.
  - [ ] AC11.6 The loop is seamless, with no blank gap at the end of a cycle.
  - [ ] AC11.7 No press brand names or logos are bundled with the theme.

### S12. "Important update" band (H12)
- **Position:** Last section of the home template, directly above the footer group. `[RESOLVED — see Clarifications log: is this notice home-only, or should it appear on every page (footer group)? Spec assumes home-only.]`
- **Merchant-editable content:**
  - Heading, such as "IMPORTANT UPDATE:".
  - Body text, such as "Ignore fraudulent calls. Enjoy secure shopping with us. All Safe. All Style."
  - Logo image on the right. "MIRAGGIO" is a placeholder logo.
  - Background colour (light grey in the mockup). `[RESOLVED — see Clarifications log: hex]`
- **Data-driven content:** None. Optionally, the logo can default to the store logo from theme settings.
- **Layout (desktop):**
  - Full-bleed light grey band, about 220px tall.
  - Inside the content width, the text group is on the left: a bold uppercase heading with one line of body text below it.
  - The logo is on the right, vertically centred and large, at about the same height as the heading and body combined.
- **Layout (mobile):** `[ASSUMPTION]` Stacked. The text group comes first and is left-aligned, and the logo sits below it, left-aligned or centred and smaller.
- **Interactions & states:**
  - Static, with no links required. Body text supports rich-text links.
  - Without a logo, the text group alone spans the band.
- **Acceptance criteria:**
  - [ ] AC12.1 The heading, body (rich text) and logo image are editable.
  - [ ] AC12.2 The background spans the full viewport width. Its colour is set through a colour scheme or setting.
  - [ ] AC12.3 On desktop, the text sits at the left and the logo at the right, both vertically centred.
  - [ ] AC12.4 With no logo set, nothing breaks and the text remains left-aligned.
  - [ ] AC12.5 On mobile, text and logo stack without overlap.

## Open questions
- `[RESOLVED — see Clarifications log]` Fonts: section heading, tile caption, tagline, hero "A/W 26" display face, gifting "GIFTING EDIT" condensed serif and "Curate Your Own Bundle" serif. Need family, size, weight and letter-spacing.
- `[RESOLVED — see Clarifications log]` Colours (hex): page text, inactive tab grey, primary button black, S8 highlight label colour, S12 band grey, gifting banner text.
- `[RESOLVED — see Clarifications log]` Vertical spacing between sections, and the page side margin and gutter values.
- `[RESOLVED — see Clarifications log]` S1: subtext copy under "A/W 26" is unreadable. Are prev/next arrows wanted? Is the indicator dots or a numeric counter? What are the autoplay default and interval?
- `[RESOLVED — see Clarifications log]` S2: tagline font size and colour.
- `[RESOLVED — see Clarifications log]` S3, S5, S9: exact tile aspect ratios. Is the S5 ratio intentionally taller than S3? What is the hover effect for tiles?
- `[RESOLVED — see Clarifications log]` S4: should "Shop All Bestsellers" follow the active tab's collection or use a fixed link? Should empty tabs be hidden or show an empty message?
- `[RESOLVED — see Clarifications log]` S5: is "New in" a carousel with overlay arrows (chevrons are visible on tiles 1 and 4) or a static 4-up grid?
- `[RESOLVED — see Clarifications log]` S7: is "MIRAGGIO / GIFTING EDIT" live text or part of the banner image? Is the eyebrow text or a logo?
- `[RESOLVED — see Clarifications log]` S8: is the highlighted label live text or baked into the photo? Where exactly do the arrows sit?
- `[RESOLVED — see Clarifications log]` S11: auto-scrolling marquee or a static overflowing row? What is the scroll speed?
- `[RESOLVED — see Clarifications log]` S12: home-only, or sitewide in the footer group?
- `[RESOLVED — see Clarifications log]` All mobile behaviour marked `[ASSUMPTION]` needs sign-off, because the mockups are desktop only.

## Clarifications log
| Question | Answer | Date |
|---|---|---|
| Defaults A4, A16, A21, B1–B4, C1 | Accepted as proposed in decisions.md. Shop-all button follows the active tab's collection; empty tabs are hidden. Important update band is home-only. Discount % rounds to nearest whole number. Fonts, colours, spacing, ratios use B defaults, all editable. All mobile `[ASSUMPTION]`s accepted. | 2026-11-19 |
| S1 hero controls | Dots at bottom-right, no prev/next arrows, autoplay on by default every 5 s (pauses on hover/focus/reduced motion). Subtext lines are optional merchant text. | 2026-11-19 |
| Overlay text (S1 heading, S7 eyebrow + "GIFTING EDIT", S8 labels) | Live, editable text, not baked into images. S8 highlight colour is a merchant setting. S7 eyebrow is text (an optional logo image is allowed). | 2026-11-19 |
| S5 "New in" | Carousel, 4 per view on desktop; overlay arrows appear only when tiles overflow. | 2026-11-19 |
| S11 "Featured on" | Auto-scrolling seamless marquee; pauses on hover/focus; static scrollable row under reduced motion. | 2026-11-19 |
| Dependency on spec 002 | Build home now using Horizon's current product card; S4/S6 must render cards via the shared card so the 002 card is picked up automatically later. | 2026-11-19 |
| Exact pixel values (fonts, hex, spacing, ratios) | Not readable from mockup; implementer uses close defaults exposed as settings (B1–B3). | 2026-11-19 |
