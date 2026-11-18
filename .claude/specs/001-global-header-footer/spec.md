# Spec 001: Global header and footer (announcement bar, header, footer)

- **Status:** Draft
- **Mockup(s):** `.claude/design/home.png`, `collection.png`, `product.png`, `shopByVideo.png`. Covers the top band of every mockup (announcement bar and header) and the bottom band (footer accordions, logo and social row, copyright bar). Also covers two floating page-level buttons: the cart button on `shopByVideo.png` and the back-to-top button on `collection.png`.
- **Template(s) affected:** all storefront templates (`index`, `collection`, `product`, `page.shop-by-video`, plus every other template that uses the global header and footer)
- **Design-map rows:** G1, G2, G3

## Goal
Every page gets the same branded frame. A rotating announcement bar carries promotions such as EMI offers and launches. A clean header puts the logo on the left, a horizontal menu next to it, and account, search, wishlist and cart icons on the right, so shoppers can navigate and reach their cart from anywhere. A light-grey footer holds collapsible SEO link groups ("Top Searched on …", "Purposeful Picks", "Get Support") that help discovery and search ranking without taking much space, followed by the brand logo, social links and a copyright line. The merchant edits all copy, links, logos and social URLs. Nothing brand-specific is fixed in code.

## In scope / Out of scope
- **In:**
  - G1 announcement bar: rotating messages with optional links and prev/next arrows.
  - G2 header: logo, horizontal main menu, account / search / wishlist / cart icons, and the cart count bubble.
  - Placement of the header wishlist icon (position, size and link target slot only).
  - G3 footer: three collapsible link groups, the multi-column grouped link layout inside an open group, the logo and "Follow us on" social row, and the copyright bar.
  - Floating cart button (seen on `shopByVideo.png`) and back-to-top button (seen on `collection.png`), both page-level overlays.
- **Out:**
  - Wishlist behaviour, the wishlist count and the wishlist page (spec 002 / G5).
  - Product cards (G4).
  - All page bodies, including the home "Important update" notice band (H12), which sits directly above the footer on home only and is a body section.
  - Contents of the search, cart and account destinations (the drawer or page itself). Horizon defaults apply.
  - Mega-menu or dropdown content. The mockups show no open menu (see Open questions).

## Sections

### S1. Announcement bar (G1)
- **Position:** The very top of every page, above the header. Full width.
- **Merchant-editable content:**
  - One or more announcement messages, each with text and an optional link. Observed placeholder copy: "0% EMI on UPI - Miraggio Pay Later" (home, product; no underline), "'A/W 26' Is Live - Shop Now" (collection; underlined), "'Off The Clock' is Live - Shop Now" (shopByVideo; underlined). Treat all of it as placeholder.
  - Autoplay on/off and the rotation interval. `[ASSUMPTION]` The four mockups each show a different message, which implies rotation. Whether it rotates automatically is not visible.
  - Bar colour scheme (background and text).
- **Data-driven content:** none.
- **Layout (desktop):**
  - A single row with the message centred horizontally.
  - A "‹" previous arrow and a "›" next arrow sit symmetrically on either side of the message, close to the centre column (about 300–400 px from centre at 1920 px) rather than at the page edges.
  - Very light grey background, dark text, small type. The bar is about 50 px tall at 1920 px `[NEEDS CLARIFICATION: exact height, background hex, font and size]`.
  - A message that has a link is shown underlined. A message without a link is plain text.
- **Layout (mobile):** `[ASSUMPTION]` Same single row at full width with the arrows near the screen edges. Long messages wrap to at most 2 lines or are truncated; they never overlap the arrows.
- **Interactions & states:**
  - Clicking › shows the next message and ‹ shows the previous one. Navigation wraps from the last message to the first and from the first to the last.
  - Clicking a linked message navigates to its link.
  - With only one message, the arrows are hidden and nothing rotates.
  - With zero messages, the bar is not rendered at all, and no empty strip remains.
  - `[ASSUMPTION]` If autoplay is on, it pauses on hover or focus.
  - The arrows are keyboard focusable and have accessible labels ("Previous announcement" / "Next announcement" or equivalent translatable strings).
- **Acceptance criteria:**
  - [ ] AC1.1 The bar renders above the header on home, collection, product and the shop-by-video page.
  - [ ] AC1.2 The merchant can add, remove and reorder messages in the theme editor. Each message has its own text and an optional link.
  - [ ] AC1.3 A message that has a link renders underlined and clickable. A message without a link renders as plain, non-clickable text.
  - [ ] AC1.4 With 2 or more messages, ‹ and › arrows show either side of the centred message and step through the messages in both directions with wrap-around.
  - [ ] AC1.5 With exactly 1 message, no arrows are shown.
  - [ ] AC1.6 With 0 messages, the bar is absent from the page.
  - [ ] AC1.7 Autoplay and its interval can be set in the editor.
  - [ ] AC1.8 The bar's colour scheme can be chosen in the editor. No brand text is hard-coded.
  - [ ] AC1.9 The arrows are focusable buttons with translatable accessible labels.

### S2. Header (G2)
> **Decision A1:** the header wishlist icon is a plain icon link to a merchant-set URL (the wishlist app's page), hidden by default, with no count bubble. Wishlist behaviour comes from the app later.

- **Position:** Directly below the announcement bar on every page. The page body (hero, collection banner, breadcrumb, etc.) starts below it. On home the header sits above the hero and does not overlay it.
- **Merchant-editable content:**
  - Logo image, with the shop name as a text fallback when no logo is set. The mockups show a placeholder wordmark.
  - Logo width or height.
  - Main menu (a navigation menu). Observed placeholder items, in order: New Arrivals, Best Sellers, Shop by Category, Featured Collections, Gifting, Shop by Video, Store Locator.
  - Visibility of each icon: account, search, wishlist, cart.
  - Wishlist icon link destination, which is set by spec 002.
  - Header colour scheme.
  - Sticky behaviour `[NEEDS CLARIFICATION]`.
- **Data-driven content:**
  - Cart item count, shown in the cart icon bubble.
  - Customer logged-in state, which may affect the account icon (see Open questions).
- **Layout (desktop):**
  - A single row on a white background with a thin light-grey bottom border separating it from the content (visible on collection, product and shopByVideo).
  - The left content edge matches the page content gutter (about 64 px at 1920 px; the logo lines up with the breadcrumb and body content).
  - Left group: the logo, then the main menu directly to its right (left-aligned, not centred). Menu items are small, regular-weight, dark text spaced evenly.
  - Right group, aligned to the right gutter, in this order: account (person icon, shown in an accent colour, orange/gold, in every mockup), search (magnifier), wishlist (heart outline), cart (cart outline).
  - The cart shows a small circular dark count bubble at its top-right. The wishlist icon shows no bubble in the mockups.
  - The row is about 100 px tall at 1920 px `[NEEDS CLARIFICATION: exact height, menu font and size, icon size, accent colour hex]`.
- **Layout (mobile):** `[ASSUMPTION]`
  - The menu collapses into a hamburger icon on the left that opens a drawer listing the same menu items. The logo sits next to it or centred.
  - On the right, search and cart stay visible. Account and wishlist move into the menu drawer, or stay as icons if space allows. The cart bubble stays visible.
  - The announcement bar stays above the header.
- **Interactions & states:**
  - Hover on menu links shows an underline or colour change `[NEEDS CLARIFICATION: hover style]`. The current page's link is shown as active `[NEEDS CLARIFICATION: whether an active-state style is wanted]`.
  - Whether menu items with child links open a dropdown or mega menu is not shown `[NEEDS CLARIFICATION]`.
  - Account goes to login or the account page. Search opens Horizon's search (modal or page). Cart opens the cart drawer or cart page according to the theme's cart setting. Wishlist goes to the wishlist destination (spec 002).
  - Cart bubble: hidden at 0 items. Shows the item count at 1 or more items and updates without a page reload when items are added or removed. `[ASSUMPTION]` Large counts are capped visually (e.g. "99+") so they stay inside the bubble.
  - Every icon is a focusable link or button with a translatable accessible label.
- **Acceptance criteria:**
  - [ ] AC2.1 The header renders on all four mockup page types with the logo at the far left, the main menu directly right of the logo, and the icon group at the far right.
  - [ ] AC2.2 The logo is set in the theme editor. With no logo set, the shop name shows as text. No brand name or logo file is hard-coded.
  - [ ] AC2.3 The menu items come from a merchant-selected navigation menu. Changing that menu in Shopify admin changes the header with no code change.
  - [ ] AC2.4 The icon order is account, search, wishlist, cart, from left to right.
  - [ ] AC2.5 The wishlist (heart) icon sits between search and cart and matches their size and spacing. It can be hidden from the editor. Its count and behaviour are not part of this spec.
  - [ ] AC2.6 The cart icon shows a circular count bubble only when the cart has 1 or more items, and the number updates after add-to-cart without a full reload.
  - [ ] AC2.7 A thin divider separates the header from the page content on non-home pages (and on home if it is confirmed).
  - [ ] AC2.8 The header colour scheme is selectable in the editor and defaults to a white background with dark text and icons.
  - [ ] AC2.9 On narrow viewports the menu collapses into a drawer opened by a hamburger button. Every desktop menu item is reachable from it.
  - [ ] AC2.10 Every icon has a translatable accessible label and is keyboard reachable.

### S3. Footer (G3)
- **Position:** The bottom of every page, after the last body section. On home it follows the "Important update" band (H12, out of scope). On collection it follows the SEO links text (C5). On product it follows "Watch and buy" (P5). On shopByVideo it follows the last video carousel after generous white space.
- **Merchant-editable content:**
  - **Link groups (accordion rows):** three, in order: "Top Searched on Miraggio" (placeholder brand), "Purposeful Picks", "Get Support". Each has an editable title and its own content.
  - **Content of an open group:** link lists, optionally split into titled sub-groups. Observed on home:
    - "Top Searched on …" has sub-group headings "Shop by Category", "Featured Collections", "Editorial" and "Others". Each heading is followed by links laid out across 4 columns. Examples: Trendy Tote Bags, Cute Shoulder Bags, Mini Bags for Women, Stylish Sling Bags, Clutches & Purses, Small Bags for women, Cross body Bags for Ladies, Wallets & Card Holders for women, Side Bags for Girls, Cute Bag Charms, Laptop Bags for Women, Summer Scoop, Holiday Collection, Capsule Collection, Beyond Basics, Ayesbore Collection, Pieces Collection, Love Collection, Blogs, Under 1999, Shop by Video, Best Sellers, A/W 26 Collection. Several are unreadable at mockup resolution `[NEEDS CLARIFICATION: full link list]`.
    - "Purposeful Picks": Women Travel Bags, Night Out Bags, Everyday Bags, Women Office Bags (4 columns, one row).
    - "Get Support": Track My Order, FAQs, Returns & Exchange, Corporate Gifting, Terms of Service, Privacy Policy (4 columns).
    - All link text and URLs are merchant content (preferably Shopify navigation menus).
  - **Default open/closed state per group**, set per group in the editor.
  - **Footer logo:** image, with the shop name as a text fallback.
  - **"Follow Us On" label:** editable text.
  - **Social links:** URLs for each network. Observed: Facebook, Instagram, YouTube. An icon renders only when its URL is set.
  - **Copyright text:** editable. Observed placeholder "© 2026 MIRAGGIO Lifestyles Private Limited. All Rights Reserved". The year should stay current automatically `[ASSUMPTION]`.
  - Footer colour scheme.
- **Data-driven content:** the current year, if automatic; the shop name as fallback text.
- **Layout (desktop):**
  - The footer background is light grey (about #EBEBEB to #EFEFEF visually `[NEEDS CLARIFICATION: exact hex]`) and spans the full width.
  - **Accordion rows:** full width, each about 70 px tall at 1920 px, with a small bold title on the left (aligned to the page gutter) and a chevron-down icon on the right gutter. Thin horizontal dividers separate the rows.
  - **Open group panel:** sits below its title. Sub-group headings are small and bold, each followed by links in a 4-column grid with equal column widths spanning the content width, flowing row by row. Link text is small and regular weight.
  - **Brand row:** sits below the accordions, separated by a divider. Logo on the left. "Follow Us On" label plus the social icons (Facebook, Instagram, YouTube, in that order) on the right.
  - **Copyright bar:** sits below the brand row, separated by a divider. Copyright text is centred and very small.
  - **Difference between pages:** on home, all three groups render open with their links visible (the brief said only the first; on close inspection of `home.png` "Purposeful Picks" and "Get Support" also show links). On collection, product and shopByVideo, all three groups are collapsed. `[NEEDS CLARIFICATION: is "open on home, collapsed elsewhere" a per-template requirement, or is the home mockup just showing the groups opened for illustration?]`
- **Layout (mobile):** `[ASSUMPTION]`
  - The accordion rows stay full width and collapsed by default on every page.
  - The link grid inside an open group reflows to 2 columns, then 1 column on very small screens.
  - The brand row stacks: logo above, then "Follow Us On" and the icons, centred or left-aligned.
  - The copyright text stays centred and wraps.
- **Interactions & states:**
  - Clicking or tapping a row title, or pressing Enter/Space on it, toggles that group open or closed, and the chevron rotates to point up when open. Groups are independent: opening one does not close the others `[ASSUMPTION]`.
  - Links inside a closed group are not focusable or visible, but they stay present in the page HTML so search engines can crawl them (this is the SEO purpose).
  - A group with no links is not rendered.
  - A sub-group with no links has its heading hidden.
  - A social icon without a URL is not rendered. With no social URLs at all, the "Follow Us On" label is hidden too.
  - Link hover style `[NEEDS CLARIFICATION]` (`[ASSUMPTION]` an underline).
  - Social icons open in a new tab `[ASSUMPTION]`.
- **Acceptance criteria:**
  - [ ] AC3.1 The footer renders on all four mockup page types in this order: accordion rows, brand row (logo + social), copyright bar.
  - [ ] AC3.2 The three accordion rows appear in the order "Top Searched on …", "Purposeful Picks", "Get Support". Every title is editable, and the merchant can add, remove and reorder groups.
  - [ ] AC3.3 The links in each group come from merchant-editable sources. Changing a menu in admin changes the footer links with no code change.
  - [ ] AC3.4 An open group shows its sub-group headings, each followed by links in a 4-column grid on desktop.
  - [ ] AC3.5 Each row toggles open and closed by click and by keyboard, and exposes its expanded state to assistive technology. The chevron reflects the state.
  - [ ] AC3.6 The default open or closed state can be configured, so that home can match `home.png` (open) while collection, product and shopByVideo match their mockups (all collapsed), subject to the open question about per-template behaviour.
  - [ ] AC3.7 Links inside collapsed groups are present in the server-rendered HTML.
  - [ ] AC3.8 The footer logo is set in the editor and falls back to the shop name. No brand is hard-coded.
  - [ ] AC3.9 The "Follow Us On" label is editable. Social icons render only for networks with a URL set, in the order Facebook, Instagram, YouTube when all are set.
  - [ ] AC3.10 The copyright text is editable and centred in its own bar below the brand row.
  - [ ] AC3.11 The footer colour scheme is selectable and defaults to light grey.
  - [ ] AC3.12 On narrow viewports the link grid reduces to 2 columns or fewer, and the brand row stacks without horizontal scrolling.

### S4. Floating page-level buttons
- **Position:**
  - **Floating cart button:** `shopByVideo.png` shows a circular white cart button with a dark count bubble, fixed at the right edge of the viewport. It appears at the top right below the header (overlapping the banner image) and again mid-page, which suggests it stays fixed while the page scrolls.
  - **Back-to-top button:** `collection.png` shows a circular black button with a white up arrow at the bottom right, overlapping the footer's social area at the end of the page.
- **Merchant-editable content:**
  - Enable or disable each button.
  - `[NEEDS CLARIFICATION]` Which templates show the floating cart button (only shop-by-video, or all pages).
  - `[NEEDS CLARIFICATION]` Which templates show back-to-top (only collection, or all pages).
- **Data-driven content:** the cart item count in the floating cart bubble, which matches the header bubble.
- **Layout (desktop):**
  - Floating cart: a circle about 64 px across at 1920 px with a white fill, thin grey border and a cart icon, about 30 px from the right viewport edge.
  - Back-to-top: a circle of similar size in solid black with a white chevron-up icon, bottom-right of the viewport.
  - `[NEEDS CLARIFICATION: exact offsets, sizes]`
- **Layout (mobile):** `[ASSUMPTION]` Same position (right edge), slightly smaller. The two buttons never overlap each other when both are enabled; back-to-top stacks above the cart button. Neither covers the sticky add-to-cart or the cart drawer.
- **Interactions & states:**
  - Floating cart opens the cart drawer or page, the same as the header cart. Its bubble is hidden at 0 items and updates live.
  - `[ASSUMPTION]` Back-to-top is hidden until the shopper has scrolled down at least one viewport height. Clicking it scrolls to the top (smoothly unless the shopper prefers reduced motion) and moves focus to the top of the page.
  - Both buttons have translatable accessible labels.
- **Acceptance criteria:**
  - [ ] AC4.1 The floating cart button can be enabled in the editor. When it is enabled on the shop-by-video page, it stays fixed at the right edge while the page scrolls.
  - [ ] AC4.2 The floating cart count matches the header cart count and updates without a reload. The bubble is hidden at 0.
  - [ ] AC4.3 The back-to-top button can be enabled in the editor. When it is enabled on collection pages, it appears bottom-right after scrolling and returns to the top when clicked.
  - [ ] AC4.4 Both buttons are keyboard operable with translatable accessible labels, and they never overlap each other.

## Open questions
- `[NEEDS CLARIFICATION]` Fonts (family, weights, sizes) for the announcement text, menu items, footer titles, footer links and copyright.
- `[NEEDS CLARIFICATION]` Exact colours: announcement bar background, header divider, account icon accent (orange/gold), cart bubble, footer background, footer dividers.
- `[NEEDS CLARIFICATION]` Exact heights and spacing: announcement bar, header row, accordion rows, logo size, icon size.
- `[NEEDS CLARIFICATION]` Is the coloured account icon a permanent brand accent, or does it indicate the logged-in state?
- `[NEEDS CLARIFICATION]` Should the header stick to the top on scroll? Should the announcement bar stick with it?
- `[NEEDS CLARIFICATION]` Do any main-menu items (e.g. "Shop by Category", "Featured Collections") open a dropdown or mega menu? If so, what is the content and layout?
- `[NEEDS CLARIFICATION]` Menu link hover and active-page styles, and footer link hover style.
- `[NEEDS CLARIFICATION]` Announcement bar: does it autoplay, and at what interval? Full list of messages and links.
- `[NEEDS CLARIFICATION]` Footer: on home, should the groups be expanded by default while being collapsed on other pages (per-template default), or is `home.png` only illustrating the expanded state? Should it be just the first group or all three (the mockup shows all three with links)?
- `[NEEDS CLARIFICATION]` The full, readable footer link list for every group and sub-group, including "Editorial" and "Others".
- `[NEEDS CLARIFICATION]` The full set of social networks to support beyond Facebook, Instagram and YouTube.
- `[NEEDS CLARIFICATION]` Should the copyright year update automatically or be fixed text?
- `[NEEDS CLARIFICATION]` Floating cart button: shop-by-video only or site-wide? Does it ever appear on desktop when the header cart is visible?
- `[NEEDS CLARIFICATION]` Back-to-top button: collection only or site-wide? When should it appear?
- `[NEEDS CLARIFICATION]` Should the wishlist icon show a count bubble like the cart? (Owned by spec 002; the placement here assumes no bubble, matching the mockups.)

## Clarifications log
| Question | Answer | Date |
|---|---|---|
