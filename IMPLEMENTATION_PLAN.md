# Mobile Layout & Project Showcase Re-Engineering Plan

## Architecture Overview
The portfolio website at [porto-nupus.vercel.app](https://porto-nupus.vercel.app/) is being re-engineered to resolve mobile vertical scroll fatigue caused by long sequential vertical project stacking. The solution implements strict boundary isolation between mobile (<768px) and desktop (>=768px) viewports, delivering an ultra-responsive, touch-optimized, space-efficient browsing experience with an Editorial Dark Tech tone, client-side taxonomy filtering, Embla Carousel snap presentation, Vaul drag-to-dismiss bottom sheet case study drawers, and a persistent thumb-zone navigation dock.

---

## 1. External Dependencies
The following packages have been installed and verified against React 19 and Next.js 16:
- `embla-carousel-react` (^8.6.0): High-performance, touch-inertia swipe carousel for mobile project cards.
- `vaul` (^1.1.2): Accessible, gesture-driven drag-to-dismiss bottom sheet modal drawer for mobile case study drill-downs.
- `clsx` (^2.1.1) & `tailwind-merge` (^3.7.0): Type-safe conditional class merges in `src/lib/utils.ts`.
- `lucide-react` (^1.44.0): Iconography for categories, navigation dock, copy triggers, and external actions.

---

## 2. Target Files & Component Architecture

### A. Data Schema & Types
- **`src/types/database.ts`**:
  - Enrich `Project` with optional fields: `demo_url`, `github_url`, `impact_chips`, `metrics`, and `challenges` without breaking existing Supabase schema compatibility.
- **`src/lib/mock-data.ts`**:
  - Preserves all 5 existing projects while enriching them with quantified impact metrics, architectural challenges, demo links, and category taxonomies.

### B. New Components to Construct
1. **`src/components/projects/ProjectFilter.tsx`**:
   - Sticky taxonomy filter positioned right below header (`sticky top-16 md:top-20 z-30`).
   - Horizontal scrollable pill list with active state indicators, spring animations, category counts, and bilingual support (ID/EN).
   - Zero-reload client-side state filtering with instant response.

2. **`src/components/projects/ProjectCardCompact.tsx`**:
   - Optimized mobile card (<768px): 16:9 thumbnail preview, crisp typography, one-line summary, and mini technology badge chips.
   - Eliminates vertical content bloat; triggers bottom sheet drawer upon tap.
   - Spring active scaling (`active:scale-[0.98]`).

3. **`src/components/projects/ProjectDrawer.tsx`**:
   - Native-feeling Vaul bottom sheet drawer with drag handle and physical inertia dismiss.
   - Contains high-res media carousel/gallery, category metadata, quantified impact chips, architectural challenges, complete narrative, and actionable buttons ("Live Demo", "GitHub Source", "Full View").

4. **`src/components/projects/ProjectShowcase.tsx`**:
   - Orchestrates the project showcase with strict viewport boundary isolation:
     - **Mobile Viewport (<768px)**: Constrained height container (≤440px), touch-optimized Embla snap carousel with progress counter (e.g. `01 / 04`), inertia gestures, navigation buttons, and indicator dots. Also includes a toggle to switch to a 2-column compressed matrix view.
     - **Desktop Viewport (>=768px)**: Rich multi-column bento grid with ambient spotlight cursor effects, category badges, and expanded typography.
     - **Collapsible Directory ("View Full Archive")**: Clean table modal/sheet featuring older/all projects with metadata, direct drawer launch, and category filters.

5. **`src/components/navigation/MobileFloatingDock.tsx`**:
   - Anchored floating dock at bottom center of mobile viewports (`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden`).
   - Frosted glassmorphism (`backdrop-blur-md bg-[#181716]/85 border border-white/10 text-white shadow-2xl rounded-full px-5 py-2.5`).
   - Quick navigation icons (Home, Projects, About/Skills) + "Contact / Copy Email" with animated tooltip feedback.

### C. Pages & Integration Points
- **`src/components/home-page-view.tsx`**:
  - Replace the unbounded vertical grid with `<ProjectFilter>` and `<ProjectShowcase>`.
  - Add `<MobileFloatingDock>` for mobile ergonomics.
- **`src/app/layout.tsx`**:
  - Ensure viewport padding, safe-area-inset for bottom dock, and proper z-index layering.

---

## 3. Planned Layout & Viewport Boundary Strategies
| Feature | Mobile Viewport (`< 768px`) | Desktop Viewport (`>= 768px`) |
|---|---|---|
| **Project Presentation** | Horizontal Embla snap carousel (≤ 440px height) + optional 2-col compact grid | Multi-column Bento grid with hover spotlight & expanded cards |
| **Project Interaction** | Bottom sheet drawer (`Vaul`) with full case study, media, metrics & actions | Direct link to `/project/[slug]` or quick detail modal |
| **Scroll Ergonomics** | Height reduced by >70%; critical CTAs remain accessible | Full-width editorial storytelling with generous white space |
| **Navigation** | Sticky taxonomy filter + bottom floating dock with instant copy email | Top floating pill navbar with language switcher |
| **Aesthetic Tone** | Editorial Dark Tech accents (zinc/slate surfaces, radial spotlights, monospace metadata) | Balanced with ambient sky gradients and editorial serif headings |
