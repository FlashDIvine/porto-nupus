'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Archive,
  LayoutGrid,
  Sliders,
  X,
  ExternalLink,
} from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { Project } from '@/types/database'
import { ProjectFilter } from './ProjectFilter'
import { ProjectCardCompact } from './ProjectCardCompact'
import { ProjectDrawer } from './ProjectDrawer'
import { cn } from '@/lib/utils'

export interface ProjectShowcaseProps {
  projects: Project[]
  className?: string
}

interface BentoProjectCardProps {
  project: Project
  idx: number
  isLead: boolean
  colSpan: string
  aspect: string
  titleText: string
  onOpenDrawer: (project: Project) => void
}

function BentoProjectCard({
  project,
  idx,
  colSpan,
  aspect,
  titleText,
  onOpenDrawer,
}: BentoProjectCardProps) {
  const { t, isId } = useLanguage()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty('--x', `${x}px`)
      el.style.setProperty('--y', `${y}px`)
    }

    const onLeave = () => {
      el.style.removeProperty('--x')
      el.style.removeProperty('--y')
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <motion.div
      key={project.id || project.slug}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
      className={colSpan}
    >
      <div
        ref={cardRef}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/85 dark:bg-[#181716]/90 backdrop-blur-md border border-[#E6E2D8] dark:border-white/10 shadow-[0_8px_30px_rgba(24,23,22,0.04)] hover:shadow-[0_20px_40px_rgba(24,23,22,0.1)] hover:border-[#181716]/40 transition-all duration-500 h-full"
      >
        {/* Ambient Spotlight Radial Hover Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),rgba(226,109,92,0.12),transparent_40%)]" />

        <div className="flex flex-col h-full">
          {/* Image Preview Container */}
          <div className={cn('relative w-full overflow-hidden bg-[#F2EFE9]', aspect)}>
            {project.cover_image_url ? (
              <Image
                src={project.cover_image_url}
                alt={titleText}
                fill
                sizes="(max-width: 1200px) 66vw, 50vw"
                priority={idx === 0}
                className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="absolute inset-0 bg-[#F2EFE9] flex items-center justify-center text-[#6B6661] font-mono text-xs">
                No Cover Image
              </div>
            )}

            {/* Category Badge Chip */}
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="inline-flex items-center text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D8E2DC] text-[#181716] border border-[#E6E2D8] shadow-xs">
                {project.category || 'Visual Case'}
              </span>
            </div>

            {/* Top-Right Quick Drawer Action */}
            <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenDrawer(project)}
                title={isId ? 'Buka Quick View' : 'Open Quick View'}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#E6E2D8] flex items-center justify-center text-[#181716] hover:bg-[#181716] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <Link
                href={`/project/${project.slug}`}
                title={isId ? 'Buka Halaman Proyek' : 'View Project Page'}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#E6E2D8] flex items-center justify-center text-[#181716] group-hover:bg-[#2B50EC] group-hover:text-white transition-all shadow-xs"
              >
                <ArrowUpRight className="w-4 h-4 transform group-hover:rotate-45 transition-transform" />
              </Link>
            </div>

            {/* Quantified impact badge if present */}
            {project.impact_chips && project.impact_chips.length > 0 && (
              <div className="absolute bottom-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-xs text-white border border-white/20">
                  <Sparkles className="w-3 h-3 text-[#E26D5C]" />
                  <span>{project.impact_chips[0]}</span>
                </span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white/75 backdrop-blur-[8px]">
            <div>
              <Link href={`/project/${project.slug}`} className="group/link block">
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#181716] group-hover/link:text-[#2B50EC] transition-colors leading-tight line-clamp-2">
                  {titleText}
                </h3>
              </Link>
              {project.description && (
                <p className="mt-2 text-xs sm:text-sm text-[#6B6661] font-body line-clamp-2 leading-relaxed">
                  {t(project.description)}
                </p>
              )}
            </div>

            {/* Metadata Footer */}
            <div className="mt-4 pt-3.5 border-t border-[#E6E2D8] flex items-center justify-between text-xs font-mono text-[#6B6661]">
              <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                {project.tools_used && project.tools_used.length > 0 ? (
                  <span className="truncate">
                    {project.tools_used.slice(0, 3).join(' • ')}
                  </span>
                ) : (
                  <span>DKV / 2026</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenDrawer(project)}
                  className="text-xs font-mono text-[#E26D5C] hover:underline cursor-pointer"
                >
                  {isId ? 'Preview' : 'Preview'}
                </button>
                <Link
                  href={`/project/${project.slug}`}
                  className="font-medium text-[#181716] hover:text-[#2B50EC] transform group-hover:translate-x-1 transition-all"
                >
                  {isId ? 'Kasus →' : 'Case →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ProjectShowcase({ projects, className }: ProjectShowcaseProps) {
  const { t, isId } = useLanguage()

  // Client-side category filtering state
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Mobile layout mode: 'carousel' (default, height <= 440px) or 'matrix' (compact 2-col bento)
  const [mobileViewMode, setMobileViewMode] = useState<'carousel' | 'matrix'>('carousel')

  // Archive directory modal state
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)

  // Drawer state for mobile and quick case previews
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Extract unique categories and counts
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = {}
    const cats = new Set<string>()

    projects.forEach((p) => {
      if (p.category) {
        cats.add(p.category)
        counts[p.category] = (counts[p.category] || 0) + 1
      }
    })

    return {
      categories: Array.from(cats),
      categoryCounts: counts,
    }
  }, [projects])

  // Filter projects instantaneously
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((p) => p.category === activeCategory)
  }, [projects, activeCategory])

  // Embla Carousel hook for mobile snap presentation
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const updateCarouselState = useCallback((api: NonNullable<typeof emblaApi>) => {
    setSelectedIndex(api.selectedScrollSnap())
    setPrevBtnDisabled(!api.canScrollPrev())
    setNextBtnDisabled(!api.canScrollNext())
  }, [])

  const handleReInit = useCallback((api: NonNullable<typeof emblaApi>) => {
    setScrollSnaps(api.scrollSnapList())
    updateCarouselState(api)
  }, [updateCarouselState])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => updateCarouselState(emblaApi)
    const onReInit = () => handleReInit(emblaApi)

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onReInit)

    const timer = setTimeout(() => {
      if (emblaApi) {
        handleReInit(emblaApi)
      }
    }, 0)

    return () => {
      clearTimeout(timer)
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onReInit)
    }
  }, [emblaApi, updateCarouselState, handleReInit])

  // Re-init carousel on category change or view mode switch back to carousel
  useEffect(() => {
    if (emblaApi && mobileViewMode === 'carousel') {
      emblaApi.reInit()
      emblaApi.scrollTo(0)
    }
  }, [emblaApi, activeCategory, mobileViewMode])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const handleOpenDrawer = (project: Project) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  // Helper formatting for 2-digit counter e.g. "01 / 04"
  const currentCounter = String(selectedIndex + 1).padStart(2, '0')
  const totalCounter = String(filteredProjects.length).padStart(2, '0')

  return (
    <div className={cn('w-full flex flex-col', className)}>
      {/* 1. Sticky Taxonomy Filter */}
      <ProjectFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categoryCounts={categoryCounts}
        totalCount={projects.length}
      />

      {/* 2. Main Presentation Area */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Controls Bar: Mobile View Switcher & Archive Toggle */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[#E6E2D8]/80">
          {/* Mobile View Mode Switcher (< 768px only) */}
          <div className="flex md:hidden items-center gap-1.5 p-1 rounded-full bg-white/80 border border-[#E6E2D8] text-xs font-mono">
            <button
              type="button"
              onClick={() => setMobileViewMode('carousel')}
              className={cn(
                'px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1',
                mobileViewMode === 'carousel'
                  ? 'bg-[#181716] text-white font-medium shadow-xs'
                  : 'text-[#6B6661] hover:text-[#181716]'
              )}
              aria-label="Mode Carousel"
            >
              <Sliders className="w-3 h-3" />
              <span>Slider</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode('matrix')}
              className={cn(
                'px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1',
                mobileViewMode === 'matrix'
                  ? 'bg-[#181716] text-white font-medium shadow-xs'
                  : 'text-[#6B6661] hover:text-[#181716]'
              )}
              aria-label="Mode Grid"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Grid</span>
            </button>
          </div>

          {/* Desktop Summary tag */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#6B6661]">
            <span className="w-2 h-2 rounded-full bg-[#E26D5C]" />
            <span>
              {filteredProjects.length}{' '}
              {isId ? 'karya dalam filter saat ini' : 'works in active filter'}
            </span>
          </div>

          {/* Full Archive Directory Trigger */}
          <button
            type="button"
            onClick={() => setIsArchiveOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-[#181716] text-[#181716] hover:text-white border border-[#E6E2D8] text-xs font-mono transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer ml-auto"
          >
            <Archive className="w-3.5 h-3.5 text-[#E26D5C]" />
            <span>{isId ? 'Lihat Semua Arsip' : 'View Full Archive'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E6E2D8]/80 text-[#181716]">
              {projects.length}
            </span>
          </button>
        </div>

        {/* Empty state if category filter yields no projects */}
        {filteredProjects.length === 0 ? (
          <div className="w-full py-16 text-center rounded-2xl border border-dashed border-[#E6E2D8] bg-white/60 backdrop-blur-xs p-8">
            <Sparkles className="w-7 h-7 text-[#E26D5C] mx-auto mb-2 opacity-80" />
            <h4 className="text-base font-heading font-semibold text-[#181716]">
              {isId ? 'Tidak ada proyek dalam kategori ini' : 'No projects found in this category'}
            </h4>
            <p className="text-xs text-[#6B6661] mt-1 font-body">
              {isId
                ? 'Coba pilih kategori lain atau reset filter ke "Semua Karya".'
                : 'Try selecting another category or reset filter to "All Works".'}
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="mt-4 px-4 py-1.5 rounded-full bg-[#181716] text-white text-xs font-mono hover:bg-[#2B50EC] transition-colors"
            >
              {isId ? 'Reset Filter' : 'Reset Filter'}
            </button>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* A. MOBILE VIEWPORT (<768px): STRICT BOUNDARY ISOLATION                    */}
            {/* Height-constrained touch-optimized snap slider or 2-col matrix            */}
            {/* ========================================================================= */}
            <div className="block md:hidden w-full">
              {mobileViewMode === 'carousel' ? (
                /* Carousel Mode: max-h-[440px] vertical container constraint */
                <div className="relative w-full max-h-[440px] flex flex-col justify-between">
                  {/* Embla Carousel Viewport */}
                  <div
                    ref={emblaRef}
                    className="overflow-hidden w-full cursor-grab active:cursor-grabbing rounded-2xl"
                  >
                    <div className="flex touch-pan-y -ml-3">
                      {filteredProjects.map((project, idx) => (
                        <div
                          key={project.id || project.slug}
                          className="flex-[0_0_86%] min-w-0 pl-3 select-none"
                        >
                          <ProjectCardCompact
                            project={project}
                            index={idx}
                            onSelect={handleOpenDrawer}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Carousel Controls: Inertia progress counter, indicator dots & arrow buttons */}
                  <div className="flex items-center justify-between pt-4 px-1">
                    {/* Progress Counter e.g. "01 / 04" */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E6E2D8] font-mono text-xs text-[#181716] shadow-2xs">
                      <span className="font-semibold text-[#E26D5C]">{currentCounter}</span>
                      <span className="text-[#6B6661]">/</span>
                      <span className="text-[#6B6661]">{totalCounter}</span>
                    </div>

                    {/* Subtle Pagination Dots */}
                    <div className="flex items-center gap-1.5">
                      {scrollSnaps.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => emblaApi?.scrollTo(idx)}
                          aria-label={`Slide ke-${idx + 1}`}
                          className={cn(
                            'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                            idx === selectedIndex
                              ? 'w-6 bg-[#181716]'
                              : 'w-1.5 bg-[#E6E2D8] hover:bg-[#6B6661]'
                          )}
                        />
                      ))}
                    </div>

                    {/* Arrow Navigation buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={scrollPrev}
                        disabled={prevBtnDisabled}
                        aria-label="Slide sebelumnya"
                        className="p-1.5 rounded-full bg-white/90 border border-[#E6E2D8] text-[#181716] disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-transform shadow-2xs cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={scrollNext}
                        disabled={nextBtnDisabled}
                        aria-label="Slide berikutnya"
                        className="p-1.5 rounded-full bg-white/90 border border-[#E6E2D8] text-[#181716] disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-transform shadow-2xs cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Matrix Mode: 2-Column Compressed Bento Grid for Mobile */
                <div className="grid grid-cols-2 gap-3 w-full">
                  {filteredProjects.map((project, idx) => (
                    <ProjectCardCompact
                      key={project.id || project.slug}
                      project={project}
                      index={idx}
                      onSelect={handleOpenDrawer}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* B. DESKTOP VIEWPORT (>=768px): STRICT BOUNDARY ISOLATION                  */}
            {/* Full-width Multi-Column Bento Grid with Ambient Spotlight & Hover Preview */}
            {/* ========================================================================= */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-min w-full">
              {filteredProjects.map((project, idx) => {
                const titleText = t(project.title, 'Untitled Project')
                const isLead = idx % 5 === 0
                const colSpan = isLead ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                const aspect = isLead ? 'aspect-[16/10]' : 'aspect-[3/4]'

                return (
                  <BentoProjectCard
                    key={project.id || project.slug}
                    project={project}
                    idx={idx}
                    isLead={isLead}
                    colSpan={colSpan}
                    aspect={aspect}
                    titleText={titleText}
                    onOpenDrawer={handleOpenDrawer}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* 3. Bottom Sheet Drawer (Vaul) for Mobile & Quick Previews */}
      <ProjectDrawer
        project={selectedProject}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />

      {/* 4. Collapsible Directory: Accessible "View Full Archive" Table Modal */}
      <AnimatePresence>
        {isArchiveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsArchiveOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-labelledby="archive-title"
              className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#181716] text-[#181716] dark:text-white border border-[#E6E2D8] dark:border-white/10 shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#E6E2D8] dark:border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-[#E26D5C]" />
                  <h3 id="archive-title" className="font-heading text-xl font-semibold">
                    {isId ? 'Arsip Direktori Portofolio' : 'Portfolio Directory Archive'}
                  </h3>
                  <span className="text-xs font-mono text-[#6B6661] ml-2">
                    ({projects.length} {isId ? 'Karya' : 'Works'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsArchiveOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F2EFE9] dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Tutup arsip"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto overflow-y-auto p-6 flex-1">
                <table className="w-full text-left text-sm font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[#E6E2D8] dark:border-white/10 text-xs text-[#6B6661] uppercase tracking-wider">
                      <th className="pb-3 pl-2 pr-6 w-20">Year</th>
                      <th className="pb-3">Project Title</th>
                      <th className="pb-3 hidden sm:table-cell">Category</th>
                      <th className="pb-3 hidden md:table-cell">Stack</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2D8]/60 dark:divide-white/5">
                    {projects.map((proj) => {
                      const year = proj.created_at ? new Date(proj.created_at).getFullYear() : '2026'
                      const projTitle = t(proj.title, 'Untitled')

                      return (
                        <tr
                          key={proj.id || proj.slug}
                          className="hover:bg-[#F2EFE9]/70 dark:hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="py-3 pl-2 pr-6 text-xs text-[#6B6661] whitespace-nowrap">{year}</td>
                          <td className="py-3 font-medium text-[#181716] dark:text-white group-hover:text-[#E26D5C] transition-colors">
                            <button
                              type="button"
                              onClick={() => {
                                setIsArchiveOpen(false)
                                handleOpenDrawer(proj)
                              }}
                              className="text-left hover:underline cursor-pointer"
                            >
                              {projTitle}
                            </button>
                          </td>
                          <td className="py-3 hidden sm:table-cell text-xs text-[#6B6661]">
                            <span className="px-2 py-0.5 rounded-full bg-[#E6E2D8]/70 dark:bg-white/10 text-[#181716] dark:text-white/80 text-[11px]">
                              {proj.category || 'General'}
                            </span>
                          </td>
                          <td className="py-3 hidden md:table-cell text-xs text-[#6B6661] truncate max-w-[200px]">
                            {proj.tools_used?.join(', ') || '-'}
                          </td>
                          <td className="py-3 text-right pr-2">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsArchiveOpen(false)
                                  handleOpenDrawer(proj)
                                }}
                                className="p-1 rounded-md hover:bg-white dark:hover:bg-white/10 text-[#E26D5C] text-xs cursor-pointer"
                                title="Quick Preview"
                              >
                                View
                              </button>
                              <Link
                                href={`/project/${proj.slug}`}
                                onClick={() => setIsArchiveOpen(false)}
                                className="p-1 rounded-md hover:bg-white dark:hover:bg-white/10 text-[#181716] dark:text-white"
                                title="Halaman Detail"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
