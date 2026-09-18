# Mobile Layout & Project Showcase Re-Engineering Walkthrough

## Executive Summary
The portfolio website at [porto-nupus.vercel.app](https://porto-nupus.vercel.app/) was re-engineered to eradicate acute mobile vertical scroll fatigue. Previously, full-bleed projects rendered sequentially down a single vertical column forced mobile users through deep DOM scroll distances (~3,500px+), burying critical call-to-action sections and inducing cognitive friction.

We overhauled the project showcase architecture into an ultra-responsive, touch-first browsing experience featuring:
- Strict viewport boundary isolation between mobile (<768px) and desktop (>=768px).
- Instantaneous client-side taxonomy filtering with spring physics.
- Embla Carousel touch-inertia snap slider with progressive counter (`01 / 05`) and height strictly constrained to `max-h-[440px]`.
- Gesture-driven `vaul` drag-to-dismiss bottom sheet case study drawers.
- Thumb-zone mobile floating dock (`fixed bottom-4 left-1/2 -translate-x-1/2 z-50`) with instant email copy feedback.
- Collapsible "View Full Archive" directory modal.
- Deep verification via automated headless Brave browser over Chrome DevTools Protocol (CDP).

---

## Architecture & Re-Engineering Details

### 1. Sticky Taxonomy Filter (`src/components/projects/ProjectFilter.tsx`)
- **Sticky Ergonomics**: Pinned directly beneath the header during scrolling (`sticky top-16 sm:top-20 z-30`).
- **Instant Client State**: Filters projects instantaneously without triggering page reloads or layout jumps.
- **Micro-Interactions**: Features an active pill indicator powered by Framer Motion (`layoutId="active-taxonomy-pill"`) with smooth spring physics, touch-friendly pill targets, and bilingual support (ID/EN).
- **Narrow Viewport Auto-Scroll**: Horizontal scroll container automatically centers the active pill on tap.

### 2. Mobile Responsive Project Presentation (`src/components/projects/ProjectShowcase.tsx`)
- **Strict Boundary Isolation**:
  - **Mobile (< 768px)**: Encapsulated within `block md:hidden`. Container height is strictly constrained to `max-h-[440px]`. Features an Embla Carousel (`useEmblaCarousel`) horizontal snap slider with touch-inertia gestures, progressive index counter (e.g. `01 / 05`), pagination dots, and arrow controls. Users can also toggle into a 2-column compressed matrix view.
  - **Desktop (>= 768px)**: Encapsulated within `hidden md:grid md:grid-cols-2 lg:grid-cols-3`. Displays an expansive bento grid with dynamic ambient radial hover spotlights (`--x`, `--y`), rich typography, and direct navigation links.
- **Collapsible Directory ("View Full Archive")**:
  - Accessible modal table displaying all projects with year, category, tools, and actions ("Quick View" or "Full Case Study").

### 3. Compact Project Card & Bottom Sheet Drawer
- **Compact Card (`src/components/projects/ProjectCardCompact.tsx`)**:
  - High-performance 16:9 thumbnail preview, concise single-line title, one-line summary, and mini technology badge chips (`Illustrator`, `Photoshop`, etc.).
  - Added `active:scale-95` spring touch feedback for natural mobile tactile feel.
  - Implemented badge text truncation (`max-w-[calc(100%-3rem)]`) to prevent badge collisions in 2-column matrix mode.
- **Project Drawer (`src/components/projects/ProjectDrawer.tsx`)**:
  - Built with `vaul` (`Drawer.Root`, `Drawer.Portal`, `Drawer.Overlay`, `Drawer.Content`).
  - Added `<Drawer.Description>` for full Radix UI / Vaul accessibility compliance.
  - Resolved active image slide desynchronization bug by updating image counter during project transitions.
  - Inside the drawer:
    - Physical drag handle pill at top.
    - Media gallery carousel with slide counter.
    - Quantified impact chips (`+140% Brand Recall`, `100% Eco-cert Paper`, etc.).
    - 3-column performance metrics cards.
    - Full case study narrative & challenge analysis.
    - Direct action buttons: "Live Demo", "GitHub Source Code", and "Full Page View".

### 4. Floating Thumb-Zone Navigation Dock (`src/components/navigation/MobileFloatingDock.tsx`)
- Positioned in thumb reach zone (`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden`).
- Frosted glass finish (`backdrop-blur-xl bg-[#181716]/90 border border-white/15 shadow-2xl rounded-full px-5 py-2.5`).
- Quick navigation to Top, Projects (`#gallery`), About (`/about`), and Instant Email Copy with animated tooltip feedback.
- Footer padding adjusted (`pb-28 md:py-14` in `src/components/footer.tsx`) so bottom dock never occludes copyright or social links.

### 5. Resilient Server Data Layer (`src/app/page.tsx`)
- Server-side data enrichment merged database records with fallback schema fields (`metrics`, `challenges`, `impact_chips`, `demo_url`, `github_url`). This guarantees that projects loaded from live Supabase databases without newly migrated columns still render complete rich metrics in the case study drawer.

---

## Visual Verification Artifacts (Headless Brave CDP Screenshots)

All screenshots below were captured directly from the live running web application using automated Chrome DevTools Protocol in a headless Chromium/Brave session:

### Evidence 1: Mobile Carousel State with Active Taxonomy Filter
*Viewport: 375x812 (iPhone), Carousel Height: 319px (≤ 440px constraint).*

![Mobile Carousel State](/verification-evidence/01_mobile_carousel_state.png)

### Evidence 2: Opened Project Case Study Drawer (Vaul)
*Gestural bottom sheet showing media carousel, impact chips, quantified metrics, and action buttons.*

![Mobile Project Drawer](/verification-evidence/02_mobile_project_drawer.png)

### Evidence 3: Floating Thumb-Zone Navigation Dock & Footer Clearance
*Dock anchored at bottom-4 with clear 112px clearance above footer copyright text.*

![Mobile Floating Dock](/verification-evidence/03_mobile_bottom_dock.png)

### Evidence 4: Accessible Archive Directory Modal
*Full catalog table modal displaying project year, category, technology stack, and quick view previews.*

![Archive Directory Modal](/verification-evidence/04_archive_modal.png)

---

## Quality Assurance & Automated Verification Suite

### Automated Test Suite (`scripts/deep-browser-verification.mjs`)
1. **TEST 1: Mobile Viewport Geometry (375x812)**:
   - Carousel Container Height: `319px` (`≤ 440px` spec verified).
   - Strict Boundary Isolation: Mobile gallery `block` / Desktop gallery `hidden`.
   - Floating Dock & Taxonomy Filter verified in DOM.
2. **TEST 2: Instant Category Filtering**:
   - Tapped 'Branding & Packaging' tab.
   - Filter updated instantaneously from 5 slides to 1 slide with 0 page reloads.
3. **TEST 3: Embla Carousel Touch-Snap Slider & Progressive Counter**:
   - Initial counter: `01 / 05`.
   - Triggered slide navigation: successfully advanced to `02 / 05`.
4. **TEST 4: Bottom Sheet Drawer (Vaul)**:
   - Tapped project card: bottom sheet drawer animated open with spring transition.
   - Verified 3 impact chips, 3 metric cards, 2 challenge breakdowns, Live Demo button, and GitHub button.
   - Closed drawer cleanly via close trigger.
5. **TEST 5: Mobile Dock Clearance**:
   - Scrolled to page bottom: verified floating dock does not occlude footer links.
6. **TEST 6: Desktop Viewport (1280x800) & Ambient Spotlight**:
   - Boundary Isolation: Mobile gallery `hidden` / Desktop bento `grid` (5 cards).
   - Mouse movement over desktop Bento card: verified `--x` and `--y` dynamically updated to mouse coordinates (`styleX: '75px', styleY: '74.26px'`).
7. **TEST 7: Archive Directory Modal**:
   - Tapped archive trigger: modal dialog opened with 5 complete project entries.

### Static Analysis & Build
- `npx tsc --noEmit`: Exited 0 (0 type errors).
- `npm run lint`: Exited 0 (0 errors, 0 warnings).
- `npm run build`: Turbopack production build succeeded for all 14 routes.
