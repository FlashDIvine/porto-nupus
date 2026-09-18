'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Maximize2, Sparkles, Calendar } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { HighlightItem } from '@/types/gallery'
import { cn } from '@/lib/utils'

export interface GalleryItemCardProps {
  item: HighlightItem
  index: number
  onOpenLightbox: (index: number) => void
  priority?: boolean
}

export function GalleryItemCard({
  item,
  index,
  onOpenLightbox,
  priority = false,
}: GalleryItemCardProps) {
  const { t } = useLanguage()
  const [imageLoaded, setImageLoaded] = useState(false)

  const projectTitleStr = t(item.projectTitle, 'Project')
  const captionStr =
    typeof item.image.caption === 'object' && item.image.caption !== null
      ? t(item.image.caption)
      : typeof item.image.caption === 'string'
      ? item.image.caption
      : ''
  const artworkTitle = captionStr || projectTitleStr
  const yearStr =
    item.year || (item.createdAt ? new Date(item.createdAt).getFullYear().toString() : '2026')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15, delay: 0 } }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.15) }}
      className="break-inside-avoid inline-block w-full mb-3 md:mb-4 lg:mb-5 group relative rounded-xl sm:rounded-2xl overflow-hidden bg-white/80 backdrop-blur-[8px] border border-white/80 hover:border-[#181716]/30 shadow-[0_4px_20px_rgba(24,23,22,0.04)] hover:shadow-[0_16px_36px_rgba(24,23,22,0.1)] transition-all duration-300 cursor-pointer active:scale-[0.98] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B50EC]"
      onClick={() => onOpenLightbox(index)}
      role="button"
      tabIndex={0}
      aria-label={`Lihat karya ${artworkTitle}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenLightbox(index)
        }
      }}
    >
      {/* Aspect-Ratio Preserving Media Container */}
      <div className="relative w-full overflow-hidden bg-[#F2EFE9]">
        {/* Animated shimmer skeleton placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#E6E2D8]/50 animate-pulse min-h-[180px] sm:min-h-[220px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#6B6661]/40 animate-pulse" />
          </div>
        )}

        {/* Next.js Image preserving natural dimensions (no forced square cropping) */}
        <Image
          src={item.image.url}
          alt={artworkTitle}
          width={item.width || 900}
          height={item.height || 1200}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority || index < 4}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            'w-full h-auto object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.03]',
            !imageLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
          )}
        />

        {/* Permanent Subtle Category Badge (top-left) */}
        {item.category && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-none">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/90 backdrop-blur-md text-[#181716] border border-[#E6E2D8] shadow-xs group-hover:bg-[#181716] group-hover:text-white group-hover:border-black transition-colors">
              {item.category}
            </span>
          </div>
        )}

        {/* Elegant Semi-Transparent Gradient Overlay on Hover & Tap */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#181716]/90 via-[#181716]/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-4 text-white pointer-events-none">
          {/* Top Right Expand Trigger Icon */}
          <div className="flex justify-end">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs group-hover:scale-110 group-hover:bg-[#2B50EC] group-hover:border-[#2B50EC] transition-all">
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Bottom Info: Artwork Title & Year */}
          <div className="space-y-1">
            <h4 className="font-heading text-sm sm:text-base md:text-lg font-semibold leading-tight line-clamp-2 text-white drop-shadow-sm">
              {artworkTitle}
            </h4>
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/85">
              <span className="truncate max-w-[70%]">{projectTitleStr}</span>
              {yearStr && (
                <span className="shrink-0 flex items-center gap-1 text-white/75">
                  <Calendar className="w-3 h-3 text-[#E26D5C]" />
                  <span>{yearStr}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
