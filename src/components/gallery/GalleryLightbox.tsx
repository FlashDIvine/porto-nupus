'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import { ArrowUpRight, Calendar, Wrench, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { HighlightItem } from '@/types/gallery'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'

export interface GalleryLightboxProps {
  items: HighlightItem[]
  index: number
  onClose: () => void
  onIndexChange?: (index: number) => void
}

interface CustomSlideMetadata {
  src: string
  alt: string
  title: string
  projectTitle: string
  projectSlug: string
  category: string | null
  description?: string
  toolsUsed?: string[]
  year?: string
}

export function GalleryLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: GalleryLightboxProps) {
  const { t, isId } = useLanguage()
  const [showDetails, setShowDetails] = useState(true)

  // Transform HighlightItem[] into slides format for yet-another-react-lightbox
  const slides: CustomSlideMetadata[] = items.map((item) => {
    const projectTitleStr = t(item.projectTitle, 'Project')
    const captionStr =
      typeof item.image.caption === 'object' && item.image.caption !== null
        ? t(item.image.caption)
        : typeof item.image.caption === 'string'
        ? item.image.caption
        : ''
    const artworkTitle = captionStr || projectTitleStr
    const descriptionStr = item.projectDescription ? t(item.projectDescription) : ''
    const yearStr =
      item.year || (item.createdAt ? new Date(item.createdAt).getFullYear().toString() : '2026')

    return {
      src: item.image.url,
      alt: artworkTitle,
      title: artworkTitle,
      projectTitle: projectTitleStr,
      projectSlug: item.projectSlug,
      category: item.category,
      description: descriptionStr,
      toolsUsed: item.toolsUsed,
      year: yearStr,
    }
  })

  return (
    <Lightbox
      open={index >= 0 && slides.length > 0}
      index={index >= 0 ? Math.min(index, slides.length - 1) : 0}
      close={onClose}
      slides={slides}
      plugins={[Zoom, Counter]}
      on={{
        view: ({ index: newIndex }) => {
          if (onIndexChange) {
            onIndexChange(newIndex)
          }
        },
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      carousel={{
        finite: false,
        imageFit: 'contain',
        padding: '0px',
      }}
      styles={{
        root: {
          // Ensure portal sits strictly on top of all fixed navigations and mobile dock
          '--yarl__portal_zindex': '9999',
          '--yarl__color_backdrop': '#0C0A09',
          '--yarl__color_button': '#FAF8F5',
          '--yarl__color_button_active': '#E26D5C',
        },
        slide: {
          paddingBottom: showDetails ? '160px' : '48px',
          paddingTop: '28px',
        },
      }}
      render={{
        // Custom bottom caption slot showcasing rich project metadata
        slideFooter: ({ slide }) => {
          const custom = slide as unknown as CustomSlideMetadata
          if (!custom) return null

          if (!showDetails) {
            return (
              <div className="yarl__custom_caption absolute bottom-3 inset-x-0 z-30 pointer-events-auto flex justify-center px-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDetails(true)
                  }}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181716]/90 hover:bg-[#2B50EC] border border-white/20 backdrop-blur-md text-white text-xs font-mono shadow-lg transition-all cursor-pointer"
                  aria-label="Tampilkan detail karya"
                >
                  <Info className="w-3.5 h-3.5 text-[#E26D5C]" />
                  <span className="truncate max-w-[180px] sm:max-w-[280px]">{custom.title}</span>
                  <ChevronUp className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>
            )
          }

          return (
            <div className="yarl__custom_caption absolute bottom-0 inset-x-0 z-30 pointer-events-auto p-3.5 sm:p-5 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/95 to-transparent backdrop-blur-[8px]">
              <div className="max-w-3xl mx-auto space-y-2 text-white">
                {/* Meta row: Category pill, Year, Case Study CTA, and Minimize toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {custom.category && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/20 text-[#FAF8F5] border border-white/25 shadow-xs">
                        {custom.category}
                      </span>
                    )}
                    {custom.year && (
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono text-white/70">
                        <Calendar className="w-3 h-3 text-[#E26D5C]" />
                        <span>{custom.year}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {custom.projectSlug && (
                      <Link
                        href={`/project/${custom.projectSlug}`}
                        className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1 rounded-full bg-[#181716] hover:bg-[#2B50EC] text-white border border-white/20 transition-all shadow-xs group"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <span className="hidden sm:inline">{isId ? 'Studi Kasus Proyek' : 'View Case Study'}</span>
                        <span className="sm:hidden">{isId ? 'Studi Kasus' : 'Case Study'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#E26D5C] group-hover:text-white" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDetails(false)
                      }}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/75 hover:text-white border border-white/15 transition-all cursor-pointer"
                      aria-label="Sembunyikan detail karya"
                      title={isId ? 'Sembunyikan detail' : 'Hide details'}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Artwork Title & Project Subheading */}
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-lg font-heading font-semibold text-white tracking-tight leading-snug drop-shadow-sm">
                    {custom.title}
                  </h3>
                  {custom.projectTitle && custom.projectTitle !== custom.title && (
                    <p className="text-[11px] sm:text-xs text-white/60 font-mono truncate">
                      {custom.projectTitle}
                    </p>
                  )}
                </div>

                {/* Narrative Description */}
                {custom.description && (
                  <p className="text-xs sm:text-sm text-white/80 font-body line-clamp-2 leading-relaxed">
                    {custom.description}
                  </p>
                )}

                {/* Tools Used Chips */}
                {custom.toolsUsed && custom.toolsUsed.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <Wrench className="w-3 h-3 text-white/50 shrink-0" />
                    {custom.toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-mono bg-white/10 text-white/90 border border-white/15"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        },
      }}
    />
  )
}
