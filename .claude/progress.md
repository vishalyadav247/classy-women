# Theme build progress

The single source of truth for where the spec-driven build stands. **Update this file whenever a phase changes for any spec**: spec written, approved, planned, task done, reviewed. Newest log entries go at the top of the log.

Last updated: 2026-11-19

## Current phase
**Specs 004 (home), 001 (header/footer), 002 (product card) and 005 (collection) are Done, pending your visual check.** All uncommitted (user's choice). Next: spec 006 (product page): confirm its remaining defaults (A15, A20 proposed), then plan and build in auto mode. 003 and 007 stay on hold.

## Spec status

| Spec | Scope | Spec | Plan | Tasks | Implemented | Reviewed | Notes |
|---|---|---|---|---|---|---|---|
| 001 | Global header, announcement, footer, floating cart, back-to-top | **Done** | **Approved** (auto) | Written (19) | **Done** (19/19) | **Done** (pass; 6 fixes applied) | Owns the floating cart button. Header wishlist icon is a hidden link only (A1). Spec 007's `page.shop-by-video.json` must include a `floating-cart` section with `show_on_desktop: true`. |
| 002 | Product card (badge, swatches, price/% off) + wishlist | **Done** | **Approved** (auto) | Written (18) | **Done** (18/18) | **Done** (pass; 5 fixes applied) | S5 Wishlist **deferred to app** (`@app` slot on card media). New snippet `product-badge` is shared with 006. |
| 003 | Shoppable video (tiles, rows, PDP card, popup viewer) | **Draft, on hold** | – | – | – | – | On hold: user discussing with the merchant. Theme-native proposal is in decisions.md A7–A9. |
| 004 | Home page | **Done** | **Approved** (auto) | Written (17) | **Done** (17/17) | **Done** (pass; 5 fixes applied) | Built first (user choice), using Horizon's current product card until 002 lands. H10 "The style edit" excluded until 003 is resumed. |
| 005 | Collection page | **Done** | **Approved** (auto) | Written (14) | **Done** (14/14) | **Done** (pass; 6 fixes applied) | S1 banner (`media-with-content` + `breadcrumb`) is reused by 007 V1. Merchant must create collection metafield `custom.seo_text` (rich text) for per-collection SEO text. |
| 006 | Product page | Draft | – | – | – | – | S4 Pincode **skipped**; EMI **left to app (A6)**; P5 "Watch and buy" excluded until 003 is resumed |
| 007 | Shop by Video page | **Draft, on hold** | – | – | – | – | On hold: user discussing with the merchant. Depends on 003, 005 S1, 001 S4. |

Build order for the current run (by dependency): 001 → 002 → 005 → 004 → 006. **003 and 007 are on hold**, so they are not planned or built in this run.

## Deferred / app features
| Feature | Decision | Theme provision |
|---|---|---|
| Wishlist | App later (A1) | `@app` block slots on the card and PDP, plus a hidden header icon link |
| Pincode delivery check | Skipped (A5) | none |
| EMI / pay-later | App, decided (A6) | `@app` slot in the PDP buy area |

## Open items for the user
- Confirm the remaining defaults in `.claude/specs/decisions.md` (A4, A7–A21, B, C) when the build starts.
- Shop by video (003, 007, plus home H10 and PDP P5) is on hold until you have discussed it with the merchant; the proposal is in decisions.md A7–A9.

## Log
- **2026-11-19:** 005 reviewed: pass with follow-ups. Fixed: promo tiles only render when following products fill their row(s); dense flow kept on page 2+ so prepended page-1 tiles lay out right; Load more recovers from a failed fetch; Drawer style shows the See-results button on desktop; apply_mode only for Drawer style; Load more polish. Theme check 0 errors / 7 baseline warnings. Spec 005 Done. Not committed.
- **2026-11-19:** 005 T13–T14 done (all 14 tasks implemented). T13 backwards-compat review: no regressions found (search-results, cart/chat/buy-buttons drawers, media-with-content/_media/collection-list defaults unchanged; 002 card config untouched; promo tiles never carry `.product-grid__item`/`data-product-id`); earlier ValidScopedCSSClass warning on `_collection-promo-tile` is gone. `templates/collection.json` rebuilt (collection_banner, main, explore_categories, seo_text), validated against the schemas by script. New keys synced to all other locales with English fallback (8 storefront, 37 schema; additions only). Theme check: 0 errors, 7 baseline warnings. 007 V1 can reuse `media-with-content` + `breadcrumb`. Not committed; theme-reviewer next.
- **2026-11-19:** 005 plan + tasks written (14 tasks, no new section; new blocks: _collection-promo-tile, breadcrumb, read-more-text). Auto-approved, Q1–Q7 defaults. Implementation started.
- **2026-11-19:** 005 clarified: pagination style, filter apply mode/drawer side and promo tile size become merchant choices (defaults: Load more 24/page; right drawer, instant, Clear all; 2×1 tiles shown while filtering). SEO text: metafield with shared fallback, 4 lines then Read more. Spec 005 approved; planning in auto mode.
- **2026-11-19:** 002 reviewed: pass with follow-ups. Fixed: "From" no longer survives a swatch click (variant_selected param), card context always shows sale price first, product-card.js price fallback for a card on its own product page, swatch aria-label escaped. Radio-group note corrected (not a defect: each picker has its own form). Theme check 0 errors / 7 baseline warnings. Spec 002 Done; design-map G4 Done, G5 deferred to app. Not committed.
- **2026-11-19:** 002 T1–T18 implemented (18/18). T17 backwards-compat review fixed: price block no longer treats the featured-product-information product as a card (no "From"/% OFF there); position-line overlay offsets only apply while the line is shown and not in zoom-out; card-context prices always use the card currency-code setting (swatch response parity). Swatch radio-group follow-up re-checked: not a defect (each card picker has its own `<form>`, so same-named radios in two cards are separate groups; no rename needed). 1,409 missing locale entries (39 keys) synced to all other locales with English fallback (additions only). Theme check: 0 errors, 7 baseline warnings. design-map G4 Implemented (review pending). Not committed; theme-reviewer next.
- **2026-11-19:** 002 plan + tasks written (18 tasks, no new section/block; new snippet product-badge shared with 006; card options needed by the swatch-update response become theme settings). Auto-approved with Q1–Q7 defaults. Implementation started.
- **2026-11-19:** 002 clarified by user: in-card swipe carousel with position line; swatch click updates image/price/% off/badge and link; max 5 swatches then +N, row hidden for 0–1 colours; 1-line title and "From" price. Other open items take decisions A1–A4 and B defaults. Spec 002 approved; planning in auto mode. Nothing committed (user).
- **2026-11-19:** 001 reviewed: pass with follow-ups. Fixed: menu `show_heading` (no "Footer menu" sub-heading under Get Support / Purposeful Picks), announcement autoplay resumes after tab switch, floating-cart last-section flex-grow, floating vars duplicated so floating cart works with back-to-top off, even icon spacing with account_first, cart-bubble doc. Theme check 0 errors / 7 baseline warnings. Spec 001 Done; design-map G1–G3 Done. Not committed.
- **2026-11-19:** 001 T16–T19 done (all 19 tasks implemented). T16 backwards-compat review: no regressions found. `sections/header-group.json` and `sections/footer-group.json` rebuilt from the committed versions (no theme pull), ids/options/ranges/block types validated against the schemas by script. 26 new keys (23 schema, 3 storefront) synced to all 81 other locales with English fallback (additions only). Theme check: 0 errors, 7 baseline warnings. **Spec 007's `templates/page.shop-by-video.json` must include a `floating-cart` section with `show_on_desktop: true`.** Not committed; theme-reviewer next.
- **2026-11-19:** 001 plan + tasks written (19 tasks). One new section (`floating-cart`, per template, mobile-only unless "Show on desktop"); back-to-top is a layout snippet behind theme setting `show_back_to_top` (default on). Everything else configures/extends `header-announcements`, `header` (icon order, wishlist link, account colour), `menu`, `_accordion-row`, `social-links`, `footer-copyright`, `footer-utilities`. Group JSON edited from the committed versions (no theme pull). Spec 007's `page.shop-by-video.json` must include `floating-cart` with `show_on_desktop: true`.
- **2026-11-19:** User accepted 001 defaults (A10, A11, A17, A18, A19, B) plus: account icon is a permanent brand accent colour (setting), copyright year automatic. Spec 001 approved; planning in auto mode. Home (004) work stays uncommitted at user's request.
- **2026-11-19:** 004 reviewed: pass with follow-ups. Fixed: tab muted colour (cascade), gifting height 30→50 svh, marquee full-bleed, hidden dead Shop-all button when no tab has products, slide-link accessible name (new key accessibility.slide_link). Left for 002: duplicate card ids when a product is in two tabs. Theme check 0 errors / 7 baseline warnings. Spec 004 Done; design-map H1–H9, H11, H12 Done. Not committed.
- **2026-11-19:** 004 all 17 tasks implemented; templates/index.json rebuilt in spec order; 22 new keys synced to all 81 other locales (English fallback). Theme check: 0 errors, 7 baseline warnings. theme-reviewer running.
- **2026-11-19:** 004 T17: `templates/index.json` rewritten with the 11 home sections. **Spec 003's "The style edit" section must be inserted in `order` between `trending_now` and `featured_on`** (AC10.1) when 003 resumes; no placeholder entry exists. T16 backwards-compat review done; new locale keys synced to all other locale files.
- **2026-11-19:** 004 T1 locale keys done. Decision: new keys get synced to all 81 other locale files with English fallback (end of T17) rather than disabling MatchingTranslations. T2–T15 running in 6 parallel builder groups.
- **2026-11-19:** 004 plan + tasks written (17 tasks, no new section; S4 tabs are a new private block in product-list). Auto-approved; Q1 dropped, Q2/Q3 accepted. Implementation started.
- **2026-11-19:** User waived plan review for 004: implement directly once plan.md/tasks.md are written (plan auto-approved on the user's instruction).
- **2026-11-19:** User chose to start the build with the home page (004). Confirmed A4, A16, A21, B1–B4, C1 for home, plus: hero dots + 5 s autoplay, live overlay text, "New in" carousel, "Featured on" marquee, home built before 002 using the current card. Spec 004 approved; planning started.
- **2026-11-19:** Confirmed: card and PDP colour swatches show variant product photos, not flat colour chips (spec 002 AC3.7, spec 006 S3).
- **2026-11-19:** Repo committed, pushed and connected to the Shopify store via GitHub. Decided: A3 badges are automatic plus product tags; A6 EMI is left to the provider app. The user will start building on 2026-11-20.
- **2026-11-19:** Theme moved from `theme/` to the repo root (git mv, history kept) so the Shopify GitHub integration accepts the branch. Path references in CLAUDE.md, agents and skills updated. `.shopifyignore` added for CLI pushes.
- **2026-11-19:** More Shop by video answers recorded in spec 003: sound on in the popup; side reels at 85% scale with 50% dimming; product panel under the video; no variant picker; all visible tiles autoplay silently and one video plays in the popup; sold out shows a badge and fade; Watch and buy uses the merchant video, else the product video. Still on hold.
- **2026-11-19:** Shop by video popup clarified by the user: tiles autoplay; clicking opens a reel popup (active reel in the centre, prev and next reels peeking behind it, Prev/Next buttons, Add to cart). Spec 003 S4 rewritten. 003 and 007 remain Draft and on hold.
- **2026-11-19:** The user put Shop by video on hold (specs 003 and 007 stay Draft, to discuss with the merchant). Home H10 and PDP P5 are excluded from the current run.
- **2026-11-19:**
  - Specs 001–007 drafted (design-analyst).
  - Cross-spec conflicts resolved: floating cart moved to 001 S4; 007 dependencies confirmed.
  - All 29 design-map rows assigned to a spec.
  - User decisions: wishlist goes to an app, pincode is skipped, and features are built in the theme only when easy and effective.
  - Shoppable video proposal added to decisions.md.
- **2026-11-19:** Spec workflow set up (agents, skills, templates, design-map). The specs folder moved into `.claude/`.
