# Design System Strategy: The Sovereign Lens

## 1. Overview & Creative North Star
**Creative North Star: "The Institutional Archive"**

This design system moves away from the "app-like" clutter of standard dashboards and toward a high-end, editorial experience that feels like a premium intelligence report. The goal is to convey absolute objectivity and data-driven authority. By utilizing **The Institutional Archive** concept, we treat every data point as a significant record. 

We break the "template" look through **intentional asymmetry** and **atmospheric depth**. Rather than a rigid grid of identical boxes, the layout should utilize varying card heights and wide margins (breathing room) to guide the eye through complex political data. We replace harsh lines with tonal shifts, creating an interface that feels carved from a single, cohesive canvas.

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, institutional blue (`primary: #001b44`) and accented by a sophisticated, non-aggressive national red (`on_tertiary_container: #ff6960`).

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning content. Boundaries must be defined through background color shifts. For example, a candidate’s detailed breakdown should sit in a `surface-container-low` section against the main `background` color.
*   **Surface Hierarchy & Nesting:** Use surface-container tiers to create physical depth.
    *   **Base:** `background` (#f4faff)
    *   **Level 1 (Sections):** `surface-container-low` (#e9f6fd)
    *   **Level 2 (Active Cards):** `surface-container-lowest` (#ffffff)
*   **The "Glass & Gradient" Rule:** For floating navigation or interactive overlays, use Glassmorphism. Apply `surface` with 80% opacity and a `24px` backdrop-blur. 
*   **Signature Textures:** For high-impact data (like a projected winner), use a subtle linear gradient from `primary` (#001b44) to `primary_container` (#002f6c) to provide a "velvet" depth that feels more premium than a flat fill.

## 3. Typography: The Editorial Voice
We utilize a dual-font strategy to balance character with legibility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern authority. Use `display-lg` and `headline-md` for election results and state-level headers. The wide tracking of Manrope adds an "expensive" feel to the data.
*   **Body & Labels (Inter):** Inter is the workhorse. It ensures that complex tables of economic or health data remain legible at small sizes. 
*   **Hierarchy as Narrative:** Use `title-lg` in `primary` for candidate names, while using `label-md` in `on_surface_variant` for metadata (e.g., "98.4% processed"). This contrast ensures the user identifies the "Subject" before the "Detail."

## 4. Elevation & Depth
In this design system, light and shadow mimic a gallery setting rather than a mobile OS.

*   **Tonal Layering:** Depth is achieved by "stacking." A white (`surface-container-lowest`) card placed on a light blue (`surface-container-low`) background creates a natural lift.
*   **Ambient Shadows:** If a card requires a floating state (e.g., a hover effect on a political party), use a shadow with a 40px blur, 4% opacity, and a color tint derived from `primary`. This prevents the "dirty" look of grey shadows.
*   **The "Ghost Border" Fallback:** For accessibility in data tables, use `outline_variant` at **10% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use for "floating" action bars or filters. The bleed-through of background colors keeps the user grounded in the overall electoral map while they filter specific sectors.

## 5. Components & Data Visualization

*   **Buttons:** 
    *   *Primary:* `primary` fill with `on_primary` text. No border. Use `lg` (0.5rem) roundedness for an architectural feel.
    *   *Tertiary:* Transparent background with `primary` text. Never use a box; use white space to define its hit area.
*   **Data Cards:** No dividers. Use `title-sm` for headers and `body-md` for content. Separate metrics using a 32px vertical gap.
*   **Progress Bars:** Representing vote counts. The track should be `surface-variant`, and the indicator should be a gradient of `primary` to `primary_fixed_dim`. 
*   **Sector Chips (Health, Economy, etc.):** Use `secondary_container` fills with `on_secondary_container` icons. Icons should be "thin-stroke" to maintain the professional, institutional aesthetic.
*   **Comparison Tables:** Forbid vertical and horizontal lines. Use alternating "Zebra" stripes with `surface-container-low` at 50% opacity for every second row.
*   **Political Indicators (The National Touch):** Use `tertiary_container` (deep red) sparingly for "Alert" or "High Tension" districts to ensure the color retains its psychological impact.

## 6. Do's and Don'ts

**Do:**
*   **Do** use extreme white space (48px, 64px) between major thematic blocks (e.g., between "National Results" and "Regional Breakdown").
*   **Do** use `manrope` for numbers. Numbers are the stars of this dashboard; they should look designed, not typed.
*   **Do** use `surface_bright` for interactive states to make them feel "illuminated."

**Don't:**
*   **Don't** use 100% black text. Always use `on_surface` (#111d23) to keep the contrast sophisticated.
*   **Don't** use fully rounded (pill) buttons for primary actions. Stick to the `lg` (0.5rem) scale to maintain a serious, institutional tone.
*   **Don't** use drop shadows on every card. Reserve them only for the highest level of the information hierarchy.
*   **Don't** use standard "Red/Green" for political leanings if they conflict with party colors. Use `secondary` tones and rely on labels for clarity.