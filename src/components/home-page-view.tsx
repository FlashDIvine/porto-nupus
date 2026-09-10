'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowDown, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import { ProjectBentoGrid } from '@/components/project-bento-grid'
import type { Project, Profile } from '@/types/database'

interface HomePageViewProps {
  projects: Project[]
  profile: Profile
}

export function HomePageView({ projects, profile }: HomePageViewProps) {
  const { t, isId } = useLanguage()

  const bioText = t(
    profile.bio,
    'Berfokus pada identitas merek, desain editorial, tipografi eksperimental, dan sistem visual digital.'
  )

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121212] px-4 py-1.5 text-xs text-white/70 shadow-sm backdrop-blur mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#D4FF00] animate-pulse" />
          <span className="font-mono uppercase tracking-wider text-[11px]">
            {isId ? 'Portofolio Komunikasi Visual' : 'Visual Communication Portfolio'}
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-white max-w-4xl leading-[1.1] break-words">
          {isId ? (
            <>
              Eksplorasi Bentuk, Ruang & <span className="text-[#D4FF00]">Identitas Visual</span>.
            </>
          ) : (
            <>
              Exploring Form, Space & <span className="text-[#D4FF00]">Visual Identity</span>.
            </>
          )}
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl font-body leading-relaxed">
          {bioText}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4FF00] text-[#0a0a0a] font-semibold text-sm hover:bg-[#bce300] transition-all shadow-lg shadow-[#D4FF00]/10"
          >
            <span>{isId ? 'Lihat Karya Terpilih' : 'View Selected Works'}</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all text-sm font-medium"
          >
            {isId ? 'Tentang Desainer' : 'About Designer'}
          </Link>
        </div>
      </section>

      {/* Bento Grid Gallery Section */}
      <section id="gallery" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4FF00] uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isId ? 'Karya Terpilih' : 'Selected Works'}</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              {isId ? 'Galeri Proyek & Eksplorasi' : 'Project Gallery & Exploration'}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-mono text-white/60 hover:text-[#D4FF00] transition-colors underline-offset-4 hover:underline"
          >
            {isId ? 'Lihat Semua Highlight →' : 'View All Highlights →'}
          </Link>
        </div>

        {/* Bento Grid Component */}
        <ProjectBentoGrid projects={projects} />
      </section>
    </div>
  )
}
