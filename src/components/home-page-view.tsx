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
    'Berfokus pada identitas merek, desain editorial, tipografi eksperimental, dan sistem visual digital yang terstruktur serta berkarakter.'
  )

  return (
    <div className="w-full flex flex-col items-center">
      {/* Dynamic 2-Column Asymmetrical Editorial Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16 border-b border-[#E6E2D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Metadata tag, active status indicator, expressive heading */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#6B6661] bg-[#F2EFE9] border border-[#E6E2D8] px-3 py-1 rounded-full">
                01 / ARCHIVE 2026
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E6E2D8] text-xs font-mono text-[#181716] shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E26D5C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E26D5C]" />
                </span>
                <span>
                  {isId
                    ? 'Available for creative direction'
                    : 'Available for creative direction'}
                </span>
              </div>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#181716] leading-[1.05] text-balance">
              {isId ? (
                <>
                  Eksplorasi <span className="italic font-normal">Bentuk</span>, Ruang &amp;{' '}
                  <span className="italic font-semibold text-[#E26D5C]">Identitas Visual</span>.
                </>
              ) : (
                <>
                  Exploring <span className="italic font-normal">Form</span>, Space &amp;{' '}
                  <span className="italic font-semibold text-[#E26D5C]">Visual Identity</span>.
                </>
              )}
            </h1>
          </div>

          {/* Right Column: Editorial narrative paragraph, design discipline tags, tactile action buttons */}
          <div className="lg:col-span-5 flex flex-col items-start text-left space-y-6 pt-2 lg:pt-8">
            <p className="text-base sm:text-lg text-[#6B6661] font-body leading-relaxed">
              {bioText}
            </p>

            {/* Design Disciplines */}
            <div className="space-y-2.5 w-full">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6661]">
                {isId ? 'Disiplin Desain' : 'Design Disciplines'}
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Branding',
                  'Editorial Design',
                  'Experimental Typography',
                  'Packaging',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-[#D8E2DC]/70 text-[#181716] border border-[#E6E2D8] transition-colors hover:border-[#181716]/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons: Charcoal Solid Primary + Minimal Ghost Link */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <a
                href="#gallery"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#181716] text-[#FAF8F5] text-sm font-medium hover:bg-[#2B50EC] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>{isId ? 'Lihat Karya Terpilih' : 'View Selected Works'}</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <Link
                href="/about"
                className="text-sm font-medium text-[#181716] hover:text-[#2B50EC] transition-all duration-200 border-b border-[#181716]/30 hover:border-[#2B50EC] pb-0.5 hover:-translate-y-0.5"
              >
                {isId ? 'Tentang Desainer →' : 'About Designer →'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Gallery Section */}
      <section id="gallery" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-18 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4 border-b border-[#E6E2D8] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#E26D5C] uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isId ? 'Karya Terpilih' : 'Selected Works'}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#181716] tracking-tight leading-[1.05]">
              {isId ? 'Galeri Proyek & Eksplorasi' : 'Project Gallery & Exploration'}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-mono text-[#6B6661] hover:text-[#2B50EC] transition-colors underline-offset-4 hover:underline"
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
