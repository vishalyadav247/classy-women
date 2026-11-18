# Theme build progress

The single source of truth for where the spec-driven build stands. **Update this file whenever a phase changes for any spec**: spec written, approved, planned, task done, reviewed. Newest log entries go at the top of the log.

Last updated: 2026-11-19

## Current phase
**Phase 1 (Specify) is complete. Waiting on the user** to edit and approve `.claude/specs/decisions.md`. The next step after approval is to copy the decisions into each spec's Clarifications log, set specs to `Approved`, then plan all specs (`/spec-plan`) and implement them in one run (`/spec-implement`).

## Spec status

| Spec | Scope | Spec | Plan | Tasks | Implemented | Reviewed | Notes |
|---|---|---|---|---|---|---|---|
| 001 | Global header, announcement, footer, floating cart, back-to-top | Draft | – | – | – | – | Owns the floating cart button. Header wishlist icon is a hidden link only (A1). |
| 002 | Product card (badge, swatches, price/% off) + wishlist | Draft | – | – | – | – | S5 Wishlist **deferred to app** |
| 003 | Shoppable video (tiles, rows, PDP card, popup viewer) | **Draft, on hold** | – | – | – | – | On hold: user discussing with the merchant. Theme-native proposal is in decisions.md A7–A9. |
| 004 | Home page | Draft | – | – | – | – | Depends on 002. H10 "The style edit" is excluded until 003 is resumed. |
| 005 | Collection page | Draft | – | – | – | – | S1 banner is reused by 007 |
| 006 | Product page | Draft | – | – | – | – | S4 Pincode **skipped**; EMI pending A6; P5 "Watch and buy" excluded until 003 is resumed |
| 007 | Shop by Video page | **Draft, on hold** | – | – | – | – | On hold: user discussing with the merchant. Depends on 003, 005 S1, 001 S4. |

Build order for the current run (by dependency): 001 → 002 → 005 → 004 → 006. **003 and 007 are on hold**, so they are not planned or built in this run.

## Deferred / app features
| Feature | Decision | Theme provision |
|---|---|---|
| Wishlist | App later (A1) | `@app` block slots on the card and PDP, plus a hidden header icon link |
| Pincode delivery check | Skipped (A5) | none |
| EMI / pay-later | App, proposed (A6) | `@app` slot in the PDP buy area |

## Open items for the user
- Edit and approve `.claude/specs/decisions.md`, especially A3 (badges) and A6 (EMI).
- Shop by video (003, 007, plus home H10 and PDP P5) is on hold until you have discussed it with the merchant; the proposal is in decisions.md A7–A9.

## Log
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
