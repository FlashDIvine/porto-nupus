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
        <div className="w-14 h-14 rounded-2xl bg-[#161616] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#D4FF00]">
          <ImageIcon className="w-7 h-7 opacity-70" />
        </div>
        <h3 className="text-xl font-heading text-white">
          {isId ? 'Belum Ada Karya Pilihan' : 'No Highlights Yet'}
        </h3>
        <p className="text-sm text-white/50 mt-2">
          {isId
            ? 'Karya yang ditandai sebagai highlight dari proyek yang dipublikasikan akan tampil di galeri ini.'
            : 'Artworks marked as highlight in published projects will appear in this curated gallery.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
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
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121212] px-3.5 py-1 text-xs text-[#D4FF00] font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Highlights</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-white tracking-tight">
          {isId ? 'Galeri Karya Pilihan' : 'Curated Artwork Highlights'}
        </h1>
        <p className="text-sm sm:text-base text-white/60 font-body">
          {isId
            ? 'Koleksi tangkapan visual, detail tipografi, dan artefak desain dari seluruh proyek.'
            : 'A collection of visual captures, typography details, and design artifacts across all projects.'}
        </p>
      </div>

      {/* Masonry / Responsive Column Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 space-y-5 sm:space-y-6">
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
              className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-[#121212] border border-white/10 hover:border-[#D4FF00]/50 transition-all duration-300 shadow-lg"
            >
              <Link
                href={`/project/${item.projectSlug}`}
                className="block relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
              >
                {/* Image Container */}
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={item.image.url}
                    alt={captionStr || projectTitleStr}
                    width={800}
                    height={600}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Hover Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div className="flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-[#0a0a0a]/80 backdrop-blur border border-white/10 flex items-center justify-center text-[#D4FF00] transform group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    {item.category && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4FF00]">
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-heading text-base font-semibold text-white leading-snug">
                      {captionStr || projectTitleStr}
                    </h3>
                    <p className="text-xs text-white/50 font-mono line-clamp-1">
                      {projectTitleStr}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
