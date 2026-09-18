# Gallery Page Mobile Ergonomics & Interactive Masonry Lightbox Overhaul — Implementation Plan

## Architecture Overview
The portfolio gallery at `/gallery` is being overhauled to resolve mobile viewport ergonomics, prevent excessive vertical scrolling, and eliminate visual clipping of design works with diverse aspect ratios (tall editorial posters, wide branding identity spreads, horizontal UI screenshots, and publication spreads).

The solution replaces the unconstrained column list with:
1. **Sticky Taxonomy Filter (`GalleryFilter`)**: Pinned below the main navigation bar with zero-latency client-side reactive state filtering, active indicator pill with Framer Motion spring physics, and mobile touch auto-scroll.
2. **Responsive Adaptive Masonry Grid (`GalleryMasonry`)**: Native CSS multi-column masonry (`columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 lg:gap-5`) with balanced height distribution, fluid aspect-ratio preservation, skeleton loaders, and touch feedback (`active:scale-[0.98]`).
3. **Interactive Pinch-and-Swipe Lightbox (`GalleryLightbox`)**: Powered by `yet-another-react-lightbox` with `Zoom` and `Counter` plugins, mobile swipe/pinch gestures, full-bleed high-res rendering, backdrop dismissal, and an editorial bottom metadata caption drawer.
4. **Bottom Dock Spacing Harmony**: Viewport bottom padding (`pb-28 md:pb-16`) ensuring masonry items are never occluded by the fixed `MobileFloatingDock`.

---

## 1. External Dependencies
- `yet-another-react-lightbox` (^3.21.7): Lightweight, accessible, touch-gesture-driven lightbox with plugins.
  - `yet-another-react-lightbox/plugins/zoom`: Pinch-to-zoom on touchscreens and wheel zoom on desktop.
  - `yet-another-react-lightbox/plugins/counter`: Progressive slide counter (`1 / N`) in the top toolbar.
  - Styles: `yet-another-react-lightbox/styles.css` and plugin counter CSS.
- `framer-motion` (^13.2.0): Spring transitions for filter pill indicator and masonry entry animations.
- `next/image`: Optimized image delivery with responsive sizes, intrinsic aspect ratio, and blur skeleton placeholder.
- `lucide-react`: Icons for expand/lightbox trigger, category tags, sparkles, and case study links.

---

## 2. Target Files & Component Architecture

### A. Data Schema & Types (`src/types/gallery.ts`)
- Enriched `HighlightItem` interface:
  - `projectSlug: string`
  - `projectTitle: I18nText | { id?: string; en?: string } | Json`
  - `projectDescription?: I18nText | { id?: string; en?: string } | Json`
  - `category: string | null`
  - `image: ProjectImage`
  - `highlightOrder: number`
  - `createdAt: string`
  - `year?: string`
  - `toolsUsed?: string[]`

### B. Modular Gallery Components
1. **`src/components/gallery/GalleryFilter.tsx`**:
   - Sticky category pill buttons below the navigation bar (`sticky top-16 sm:top-20 z-30`).
   - Active highlight animated with Framer Motion spring transition (`layoutId="active-gallery-filter"`).
   - Reactive instant client-side filtering without page reloads or layout shift.
   - Dynamic category chips with item counts.
   - Mobile horizontal scroll with hidden scrollbars and active item auto-centering.

2. **`src/components/gallery/GalleryMasonry.tsx`**:
   - Adaptive responsive CSS multi-column architecture:
     - Mobile (`< 768px`): 2 balanced columns with `gap-3`.
     - Tablet (`768px - 1024px`): 3 columns with `gap-4`.
     - Desktop (`>= 1024px`): 4 columns with `gap-5`.
   - Card items tagged with `break-inside-avoid mb-3 md:mb-4 lg:mb-5`.
   - Smooth entry animations and empty-state fallback.

3. **`src/components/gallery/GalleryItemCard.tsx`**:
   - Displays artwork with `next/image` preserving intrinsic aspect ratios (no forced square cropping).
   - Animated shimmer skeleton placeholder during image load.
   - Touch tap feedback (`active:scale-[0.98]`).
   - Elegant semi-transparent dark gradient overlay on hover/tap revealing artwork title, project name, year, and expand icon.
   - Accessible keyboard trigger (`Enter` / `Space`) to launch lightbox.

4. **`src/components/gallery/GalleryLightbox.tsx`**:
   - Integrates `yet-another-react-lightbox` with `Zoom` and `Counter` plugins.
   - Launches full-screen lightbox at the clicked item's index.
   - Enables touch swipe between images, pinch-to-zoom on mobile, and smooth backdrop dismissal.
   - Custom `render.slideFooter` displaying project metadata: title, category chip, creation year, narrative description, tools used tags, and direct link to full case study (`/project/[slug]`).

5. **`src/components/gallery/GalleryView.tsx`**:
   - Main orchestrating client component combining `GalleryFilter`, `GalleryMasonry`, and `GalleryLightbox`.
   - Editorial header with badge, serif heading, and bilingual description.
   - Viewport bottom spacing (`pb-28 md:pb-16`) to guarantee clear separation above the fixed mobile floating dock.

### C. Page Integration (`src/app/gallery/page.tsx`)
- Server-side data fetching from Supabase with fallback to `fallbackProjects`.
- Preserves all existing published highlight images, captions, orders, and metadata.
- Resilient fallback guaranteeing artwork items even if `is_highlight` flags are unpopulated.
- Re-exports and backwards compatibility for existing imports in `src/components/highlight-gallery-view.tsx`.

---

## 3. Viewport Breakdown & Ergonomic Standards
| Viewport | Columns | Gap | Bottom Padding | Interaction Mode |
|---|---|---|---|---|
| **Mobile (`< 768px`)** | 2 balanced columns | `gap-3` (`12px`) | `pb-28` (`112px`) | Touch tap opens Lightbox; pinch-to-zoom; swipe navigation |
| **Tablet (`768px - 1024px`)** | 3 columns | `gap-4` (`16px`) | `pb-20` (`80px`) | Hover reveals title overlay; tap opens Lightbox |
| **Desktop (`>= 1024px`)** | 4 columns | `gap-5` (`20px`) | `pb-16` (`64px`) | Full multi-column masonry; wheel zoom; keyboard arrow nav |
