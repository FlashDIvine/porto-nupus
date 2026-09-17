'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, ArrowUpRight, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { I18nText, Json, ProjectImage } from '@/types/database'

export interface HighlightItem {
  projectSlug: string
  projectTitle: I18nText | { id?: string; en?: string } | Json
  category: string | null
  image: ProjectImage
  highlightOrder: number
  createdAt: string
}

interface HighlightGalleryViewProps {
  highlights: HighlightItem[]
}

export function HighlightGalleryView({ highlights }: HighlightGalleryViewProps) {
  const { t, isId } = useLanguage()

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E6E2D8] bg-[#D8E2DC] px-3.5 py-1 text-xs text-[#181716] font-mono uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E26D5C]" />
          <span>Curated Highlights</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-semibold text-[#181716] tracking-tight leading-[1.05]">
          {isId ? 'Galeri Karya Pilihan' : 'Curated Artwork Highlights'}
        </h1>
        <p className="text-base sm:text-lg text-[#6B6661] font-body leading-relaxed">
          {isId
            ? 'Koleksi tangkapan visual, detail tipografi, dan artefak desain dari seluruh proyek.'
            : 'A collection of visual captures, typography details, and design artifacts across all projects.'}
        </p>
      </div>

      {/* Masonry / Responsive Column Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {highlights.map((item, idx) => {
          const projectTitleStr = t(item.projectTitle, 'Project')
          const captionStr =
            typeof item.image.caption === 'object' && item.image.caption !== null
              ? t(item.image.caption)
              : typeof item.image.caption === 'string'
              ? item.image.caption
              : ''

          return (
            <motion.div
              key={`${item.projectSlug}-${item.image.url}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white/80 backdrop-blur-[8px] border border-white/80 hover:border-[#181716]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(24,23,22,0.04)] hover:shadow-[0_20px_40px_rgba(24,23,22,0.08)]"
            >
              <Link
                href={`/project/${item.projectSlug}`}
                className="block relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B50EC]"
              >
                {/* Image Container with scale-[1.025] hover zoom */}
                <div className="relative w-full overflow-hidden bg-[#F2EFE9]">
                  <Image
                    src={item.image.url}
                    alt={captionStr || projectTitleStr}
                    width={800}
                    height={600}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto object-cover scale-100 group-hover:scale-[1.025] transition-transform duration-500 ease-out"
                  />

                  {/* Badge & Arrow */}
                  {item.category && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D8E2DC] text-[#181716] border border-[#E6E2D8] shadow-xs">
                        {item.category}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-8 h-8 rounded-full bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#E6E2D8] flex items-center justify-center text-[#181716] group-hover:text-[#FAF8F5] group-hover:bg-[#2B50EC] group-hover:border-[#2B50EC] transition-all transform group-hover:rotate-45 shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Editorial Caption Bar: Frosted Glass */}
                <div className="p-4 sm:p-5 bg-white/70 backdrop-blur-[8px] border-t border-[#E6E2D8]/80 space-y-1">
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-[#181716] group-hover:text-[#2B50EC] transition-colors leading-snug">
                    {captionStr || projectTitleStr}
                  </h3>
                  <p className="text-xs text-[#6B6661] font-mono truncate">
                    {projectTitleStr}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
