'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { HighlightItem } from '@/types/gallery'
import { GalleryFilter } from './GalleryFilter'
import { GalleryMasonry } from './GalleryMasonry'
import { GalleryLightbox } from './GalleryLightbox'

export interface GalleryViewProps {
  highlights: HighlightItem[]
}

export function GalleryView({ highlights }: GalleryViewProps) {
  const { isId } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1)

  // Derive unique categories from highlights
  const categories = useMemo(() => {
    const set = new Set<string>()
    highlights.forEach((h) => {
      if (h.category) set.add(h.category)
    })
    return Array.from(set)
  }, [highlights])

  // Calculate item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    highlights.forEach((h) => {
      if (h.category) {
        counts[h.category] = (counts[h.category] || 0) + 1
      }
    })
    return counts
  }, [highlights])

  // Zero-latency reactive client-side filtering (exact normalized match)
  const filteredHighlights = useMemo(() => {
    if (activeCategory === 'All') return highlights
    return highlights.filter((h) => {
      if (!h.category) return false
      return h.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()
    })
  }, [highlights, activeCategory])

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat)
    setLightboxIndex(-1)
  }

  if (!highlights || highlights.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto py-24 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-[8px] border border-white/80 flex items-center justify-center mx-auto mb-4 text-[#E26D5C] shadow-xs">
          <ImageIcon className="w-7 h-7 opacity-80" />
        </div>
        <h3 className="text-xl font-heading text-[#181716]">
          {isId ? 'Belum Ada Karya Pilihan' : 'No Highlights Yet'}
        </h3>
        <p className="text-sm text-[#6B6661] mt-2 font-body">
          {isId
            ? 'Karya yang ditandai sebagai highlight dari proyek yang dipublikasikan akan tampil di galeri ini.'
            : 'Artworks marked as highlight in published projects will appear in this curated gallery.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] text-xs font-mono transition-all shadow-xs"
        >
          {isId ? 'Kembali ke Beranda' : 'Back to Home'}
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col">
      {/* 1. Editorial Header (Introduces page at the top) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-4 sm:pb-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E2D8] bg-[#D8E2DC]/70 backdrop-blur-md px-3.5 py-1 text-xs text-[#181716] font-mono uppercase tracking-widest shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E26D5C]" />
            <span>Curated Highlights</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-heading text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#181716] tracking-tight leading-[1.08]"
          >
            {isId ? 'Galeri Karya Pilihan' : 'Curated Artwork Highlights'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm sm:text-base lg:text-lg text-[#6B6661] font-body leading-relaxed"
          >
            {isId
              ? 'Koleksi tangkapan visual, detail tipografi, dan artefak desain dari seluruh proyek.'
              : 'A collection of visual captures, typography details, and design artifacts across all projects.'}
          </motion.p>
        </div>
      </div>

      {/* 2. Sticky Category Taxonomy Filter below the navigation bar */}
      <GalleryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
        totalCount={highlights.length}
        className="mb-6 sm:mb-8"
      />

      {/* 3. Main Gallery Masonry Container with proper bottom dock clearance (pb-28 md:pb-16) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 md:pb-16">
        {/* Responsive Adaptive Masonry Grid */}
        <GalleryMasonry
          items={filteredHighlights}
          onOpenLightbox={(idx) => setLightboxIndex(idx)}
        />

        {/* Interactive Pinch-and-Swipe Lightbox */}
        <GalleryLightbox
          items={filteredHighlights}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onIndexChange={setLightboxIndex}
        />
      </div>
    </div>
  )
}
