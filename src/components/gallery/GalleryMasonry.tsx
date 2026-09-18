'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { HighlightItem } from '@/types/gallery'
import { GalleryItemCard } from './GalleryItemCard'
import { cn } from '@/lib/utils'

export interface GalleryMasonryProps {
  items: HighlightItem[]
  onOpenLightbox: (index: number) => void
  className?: string
}

export function GalleryMasonry({
  items,
  onOpenLightbox,
  className,
}: GalleryMasonryProps) {
  const { isId } = useLanguage()

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto py-20 text-center px-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-[8px] border border-[#E6E2D8] flex items-center justify-center mx-auto mb-4 text-[#E26D5C] shadow-xs">
          <ImageOff className="w-6 h-6 opacity-75" />
        </div>
        <h4 className="text-lg font-heading font-semibold text-[#181716]">
          {isId ? 'Tidak Ada Karya di Kategori Ini' : 'No Artworks in this Category'}
        </h4>
        <p className="text-xs sm:text-sm text-[#6B6661] mt-1.5 font-body">
          {isId
            ? 'Coba pilih kategori lain atau reset ke Semua Karya untuk melihat seluruh kurasi visual.'
            : 'Try selecting another category or reset to All Works to view the full curated collection.'}
        </p>
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        // Responsive CSS column layout:
        // Mobile (< 768px): 2 balanced columns with gap-3
        // Tablet (768px - 1024px): 3 columns with gap-4
        // Desktop (>= 1024px): 4 columns with gap-5
        'columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 lg:gap-5 [column-fill:_balance] w-full',
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <GalleryItemCard
            key={`${item.projectSlug}-${item.image.url}-${item.image.order ?? 0}`}
            item={item}
            index={index}
            onOpenLightbox={onOpenLightbox}
            priority={index < 4}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
