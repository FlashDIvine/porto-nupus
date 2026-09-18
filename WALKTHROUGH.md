# Gallery Page Mobile Ergonomics & Interactive Masonry Lightbox Overhaul — Walkthrough

## Executive Summary
The portfolio gallery at `/gallery` was re-engineered to resolve mobile viewport ergonomics, eradicate excessive vertical scrolling, and eliminate visual clipping of design works with diverse aspect ratios (tall editorial posters, wide branding identity spreads, horizontal UI screenshots, and publication spreads).

The previous presentation rendered full-width column blocks without category segregation or interactive drill-down capabilities. We transformed the browsing experience into a responsive, fluid masonry grid equipped with:
- **Sticky Taxonomy Filter (`GalleryFilter`)** positioned with ergonomic clearance beneath the floating navigation bar (`sticky top-[76px] sm:top-[82px] z-30`) with spring physics, isolated horizontal container scrolling (no vertical window jumping), and zero-latency client-side reactive state filtering.
- **Adaptive Responsive Masonry Grid (`GalleryMasonry`)** utilizing CSS multi-column architecture (`columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 lg:gap-5 [column-fill:_balance]`) that preserves the intrinsic aspect ratio of every artwork without forced square cropping, paired with stable item keys and rapid exit transitions for smooth Framer Motion layout animations without skeleton flicker.
- **Micro-Interactions & Tap Feedback (`GalleryItemCard`)** including touch scaling (`active:scale-[0.98]`), `group-active:opacity-100` touch feedback for the gradient title overlay, animated shimmer skeleton loaders, and `break-inside-avoid inline-block w-full` multi-column stability.
- **Full-Screen Pinch-and-Swipe Lightbox (`GalleryLightbox`)** powered by `yet-another-react-lightbox` with `Zoom` and `Counter` plugins, native touch gestures, solid opaque dark backdrop (`#0C0A09`, eliminating background navbar ghosting), synchronized slide index, and an editorial bottom metadata caption drawer with a collapsible toggle allowing users to view artwork completely unobstructed on mobile.
- **Bottom Dock Spacing Harmony** with `pb-28 md:pb-16` padding preventing any visual collision with the fixed `MobileFloatingDock`.

---

## 1. Architectural Changes & Component Structure

### A. Data Layer & Types
- **`src/types/gallery.ts`**: Unified `HighlightItem` interface supporting optional dimension hints (`width`, `height`, `aspectRatio`):
  ```ts
  export interface HighlightItem {
    projectSlug: string
    projectTitle: I18nText | { id?: string; en?: string } | Json
    projectDescription?: I18nText | { id?: string; en?: string } | Json
    category: string | null
    image: ProjectImage
    highlightOrder: number
    createdAt: string
    year?: string
    toolsUsed?: string[]
    width?: number
    height?: number
    aspectRatio?: string
  }
  ```
- **`src/app/gallery/page.tsx`**: Server-side project extraction with `projectDescription`, `toolsUsed`, `year`, and defensive fallback extraction ensuring artwork is always delivered even if individual highlight flags are unset.
- **`src/components/highlight-gallery-view.tsx`**: Retained full backward compatibility by re-exporting `GalleryView` and `HighlightItem`.

### B. Modular Gallery Components
1. **`src/components/gallery/GalleryFilter.tsx`**:
   - Pinned beneath the floating navbar (`sticky top-[76px] sm:top-[82px] z-30`) with frosted glass styling (`backdrop-blur-xl bg-[#FAF8F5]/90 border-b border-[#E6E2D8]/80`).
   - Active state highlight animated with Framer Motion spring physics (`layoutId="active-gallery-filter-pill"`).
   - Dynamic category pills with exact item counts and bilingual support ("Semua Karya" / "All Works").
   - Horizontal touch scrolling with container-isolated `container.scrollTo(...)` preventing vertical window jumping on mobile.

2. **`src/components/gallery/GalleryMasonry.tsx`**:
   - Pure CSS multi-column masonry:
     - **Mobile (`< 768px`)**: 2 balanced columns with `gap-3`.
     - **Tablet (`768px - 1024px`)**: 3 columns with `gap-4`.
     - **Desktop (`>= 1024px`)**: 4 columns with `gap-5`.
   - Card items use `break-inside-avoid inline-block w-full mb-3 md:mb-4 lg:mb-5`.
   - Stable keys (`${item.projectSlug}-${item.image.url}-${item.image.order ?? 0}`) allowing Framer Motion to animate layout without remounting cards or re-triggering skeleton shimmers.

3. **`src/components/gallery/GalleryItemCard.tsx`**:
   - `next/image` integration preserving intrinsic proportions without forced cropping.
   - Shimmer skeleton placeholder while image asset streams over the network.
   - Tactile touch feedback via `active:scale-[0.98]`.
   - Gradient overlay with `group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100` ensuring tap feedback on touchscreens.

4. **`src/components/gallery/GalleryLightbox.tsx`**:
   - Powered by `yet-another-react-lightbox` with `Zoom` and `Counter` plugins.
   - Pure opaque dark backdrop (`#0C0A09`) eliminating floating navbar bleed-through.
   - Synchronized slide index via `onIndexChange`.
   - Collapsible bottom metadata drawer:
     - Category pill and creation year.
     - Artwork title and parent project name.
     - Full narrative description.
     - Tools used chips (`Adobe Illustrator`, `Photoshop`, `InDesign`, `Cinema 4D`, etc.).
     - Direct navigation button: "Studi Kasus Proyek ↗" (`/project/[slug]`).
     - Collapsible toggle (`ChevronDown` / `Info`) allowing full unobstructed image inspection on mobile.
   - Touch gestures: swipe navigation between slides and pinch-to-zoom on touchscreens.

5. **`src/components/gallery/GalleryView.tsx`**:
   - Correct visual hierarchy: Editorial Header at the top, sticky taxonomy filter directly above the masonry grid.
   - Zero-latency exact normalized category filtering (`h.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()`).
   - Automatically closes lightbox if category changes to prevent index out-of-bounds.
   - Enforces `pb-28 md:pb-16` bottom spacing harmony.

---

## 2. Deep Visual Verification Evidence

All tests were executed against the compiled production build in headless Brave browser via Chrome DevTools Protocol (CDP) across iPhone (375x812) and Android (412x915) standard viewports.

### Verification Results Summary
| Test Case | Viewport | Assertion | Status |
|---|---|---|---|
| **1. Visual Hierarchy & 2-Column Masonry** | 375x812 | Editorial Header is above filter bar; 2 distinct column buckets (`left: 16px, 194px`), 0 horizontal overflow (`scrollWidth === clientWidth === 375px`) | **PASS** |
| **2. Sticky Filter Clearance** | 375x812 | Filter bar sticks at `top-[76px]`, maintaining clean non-overlapping clearance below floating navbar (`bottom: 75px`) | **PASS** |
| **3. Exact Category Filtering** | 375x812 | Tapping "Branding & Packaging" filters items to exactly 2 cards matching badge count with zero reload | **PASS** |
| **4. Full-Screen Lightbox & Opaque Backdrop** | 375x812 | Tapping card opens lightbox, counter shows `1 / 5`, backdrop is solid `#0C0A09` with zero navbar bleed-through | **PASS** |
| **5. Collapsible Metadata Caption Drawer** | 375x812 | Caption displays title, year, category, narrative, tools, and case study link; collapse button minimizes drawer to slim pill | **PASS** |
| **6. Slide Navigation & Index Sync** | 375x812 | Next button advances counter to `2 / 5` and synchronizes with parent state | **PASS** |
| **7. Lightbox Dismissal** | 375x812 | Close button dismisses lightbox cleanly, restoring masonry view | **PASS** |
| **8. Android Viewport Check** | 412x915 | 2 distinct columns, zero horizontal margin overflow (`scrollWidth === 412px`) | **PASS** |
| **9. Compilation & Linter** | Node/Next | `npm run build` compiled cleanly; `npm run lint` passed with 0 errors & 0 warnings | **PASS** |

---

### Screenshot Evidence

#### (a) Mobile 2-Column Responsive Masonry State (375x812)
File: `public/verification-evidence/01_gallery_mobile_masonry_state.png`
- Shows the sticky taxonomy filter below the floating navbar without any text clipping.
- Balanced 2-column distribution without horizontal overflow.
- Generous bottom padding (`pb-28`) giving ample clearance above the fixed `MobileFloatingDock`.

#### (b) Interactive Full-Screen Lightbox Active with Metadata Caption
File: `public/verification-evidence/02_gallery_mobile_lightbox_active.png`
- Shows full-screen high-resolution lightbox with opaque dark backdrop (no background navbar ghosting).
- Counter plugin displaying `1 / 5`, zoom controls, and close button.
- Bottom metadata drawer displaying category pill, year, case study link, artwork title, project title, description, tools chips, and collapsible toggle.

#### (c) Category Filter Reactive State (375x812)
File: `public/verification-evidence/03_gallery_category_filtered.png`
- Shows active "Branding & Packaging" pill with spring animated indicator.
- Exactly 2 filtered artwork cards displayed matching the category count.
- Zero horizontal layout shift or page reloading, with smooth Framer Motion layout animation.

