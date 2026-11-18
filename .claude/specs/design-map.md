# Design map

Every section in the mockups (`.claude/design/`), top to bottom, with its **likely** Horizon starting point. The likely ladder step (1 Configure, 2 Extend, 3 New block, 4 New section) is a first guess. The theme-architect confirms or changes it in each spec's `plan.md`.

## Global (all pages)
| # | Design section | Likely Horizon base | Step | Spec | Status |
|---|---|---|---|---|---|
| G1 | Announcement bar with prev/next arrows | `header-announcements` + `_announcement` | 1 | 001 | Draft |
| G2 | Header: logo left, menu, icons (account, search, wishlist, cart) | `header` + `_header-menu`, `header-actions` | 1–2 (wishlist icon) | 001 | Draft |
| G3 | Footer: SEO link accordions ("Top Searched", "Purposeful Picks", "Get Support"), logo, "Follow us on" social row, copyright | `footer` group, `menu`/`accordion` blocks, `social-links`, `footer-copyright` | 1–2 | 001 | Draft |
| G4 | Product card: badge (Bestseller/New/Only few left/Sold out), wishlist heart, swatch thumbnails, title, price + compare-at + red "% OFF" | `_product-card`, `swatches`, `price` | 2 (badge source, wishlist, % off) | 002 | Draft |
| G5 | Wishlist (heart on cards, PDP, header) | none | 3–4 | 002 | Draft |

## Home (`home.png`)
| # | Design section | Likely Horizon base | Step | Spec | Status |
|---|---|---|---|---|---|
| H1 | Full-bleed hero slideshow (A/W 26, "Shop now", dots) | `slideshow` | 1 | 004 | Draft |
| H2 | Centred brand tagline | `section` + `text` | 1 | 004 | Draft |
| H3 | "Made for every moment": 4 lifestyle collection tiles with captions | `collection-list` | 1 | 004 | Draft |
| H4 | "Most-loved styles": tabbed product carousel (All bestsellers / Tote / Shoulder / …) + "Shop all bestsellers" + arrows | `product-list` (carousel) | 2 (collection tabs) | 004 | Draft |
| H5 | "New in": 4 editorial image tiles with captions | `collection-list` or `section` + `_card` | 1 | 004 | Draft |
| H6 | "New arrivals": product carousel + "View all" | `product-list` | 1 | 004 | Draft |
| H7 | Gifting banner: full-width image, text left + CTA right | `hero` or `media-with-content` | 1 | 004 | Draft |
| H8 | "In the spotlight": 2-up image carousel with text overlay | `carousel` / `slideshow` | 1–2 | 004 | Draft |
| H9 | "Trending now": 3 image tiles with captions | `collection-list` / `section` + `_card` | 1 | 004 | Draft |
| H10 | "The style edit": video reels carousel with product title/price under each | none (shoppable video) | 4 (shared with V2, P5) | 003 | On hold |
| H11 | "Featured on": press logo strip | `marquee` or `logo` | 1 | 004 | Draft |
| H12 | "Important update" notice band + logo | `section` + `text` + `image` | 1 | 004 | Draft |

## Collection (`collection.png`)
| # | Design section | Likely Horizon base | Step | Spec | Status |
|---|---|---|---|---|---|
| C1 | Split banner: breadcrumb, title, description left / image right | `section` (or `main-collection` header) | 1–2 | 005 | Draft |
| C2 | Toolbar: product count, Sort by, Filter (n) drawer, active filter chips | `main-collection` + `filters` | 1–2 | 005 | Draft |
| C3 | 4-col product grid with inline promo tiles (2×2 image tiles, "Shop now") | `main-collection` + `editorial-product-grid` | 2 | 005 | Draft |
| C4 | "Explore our categories": collection carousel with "View products" | `collection-list` (carousel) | 1 | 005 | Draft |
| C5 | SEO links text ("Shop by categories / colour", Read more) | `section` + `text` | 1–2 (read-more) | 005 | Draft |

## Product (`product.png`)
| # | Design section | Likely Horizon base | Step | Spec | Status |
|---|---|---|---|---|---|
| P1 | 2-col media grid (badge) + sticky info column: title, price/MRP/% off, tax note, EMI line, colour swatches, wishlist + Add to cart | `product-information`, `_product-media-gallery`, `variant-picker`, `buy-buttons` | 1–2 | 006 | Draft |
| P2 | Delivery details pincode check | none | 3 (new block) | 006 | Draft |
| P3 | Key features 2-col bullets + accordions (Why you'll love it, Details & dimensions, Shipping & returns, More information) | `text`/`product-description` + `accordion` / `disclosures` | 1–2 | 006 | Draft |
| P4 | "New arrivals", "You may also like" (tabs), "Recently viewed" carousels | `product-list`, `product-recommendations`, `recently-viewed-products.js` | 1–2 | 006 | Draft |
| P5 | "Watch and buy": shoppable video card | none | 4 (shared with H10, V2) | 003 | On hold |

## Shop by video (`shopByVideo.png`)
| # | Design section | Likely Horizon base | Step | Spec | Status |
|---|---|---|---|---|---|
| V1 | Split banner (same as C1) | same as C1 | 1 | 005 S1 / 007 | On hold |
| V2 | Per-category video carousels (title, 9:16 videos, product title/price/% off, arrows) + floating cart button | none | 4 (shared with H10, P5) | 003 / 007 | On hold |
