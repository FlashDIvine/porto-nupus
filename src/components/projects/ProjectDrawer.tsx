'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Drawer } from 'vaul'
import {
  ExternalLink,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRight,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { Project, ProjectImage, ProjectMetric, ProjectChallenge } from '@/types/database'

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export interface ProjectDrawerProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDrawer({ project, open, onOpenChange }: ProjectDrawerProps) {
  const { t, isId } = useLanguage()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [prevProjectId, setPrevProjectId] = useState(project?.id)

  // React 19 official pattern: adjust state during render when props change (avoids cascading effect renders)
  if (project && project.id !== prevProjectId) {
    setPrevProjectId(project.id)
    setActiveImageIndex(0)
  }

  if (!project) return null

  const titleText = t(project.title, 'Project Detail')
  const descriptionText = t(project.description, '')

  // Safely extract images list
  const imagesList: ProjectImage[] = Array.isArray(project.images)
    ? (project.images as unknown as ProjectImage[]).slice().sort((a, b) => (a.order || 0) - (b.order || 0))
    : project.cover_image_url
    ? [{ url: project.cover_image_url, order: 1 }]
    : []

  const metrics: ProjectMetric[] = Array.isArray(project.metrics)
    ? (project.metrics as unknown as ProjectMetric[])
    : []

  const challenges: ProjectChallenge[] = Array.isArray(project.challenges)
    ? (project.challenges as unknown as ProjectChallenge[])
    : []

  const impactChips: string[] = Array.isArray(project.impact_chips) && project.impact_chips.length > 0
    ? project.impact_chips
    : ['High Impact', 'Editorial Standard', '2026 Archive']

  const activeImage = imagesList[activeImageIndex] || imagesList[0]

  const nextImage = () => {
    if (imagesList.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % imagesList.length)
    }
  }

  const prevImage = () => {
    if (imagesList.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length)
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 transition-opacity duration-300" />
        <Drawer.Content
          className="bg-[#121211] text-[#FAF8F5] border-t border-white/10 flex flex-col rounded-t-[28px] max-h-[92vh] fixed bottom-0 left-0 right-0 z-50 outline-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] focus:outline-none"
        >
          {/* Physical Drag Handle Pill */}
          <div className="pt-3 pb-2 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-white/30 hover:bg-white/50 transition-colors" />
          </div>

          {/* Sticky Drawer Sub-Header with Close button */}
          <div className="px-5 sm:px-8 py-2.5 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E26D5C]/20 text-[#E26D5C] border border-[#E26D5C]/30">
                {project.category || 'Visual Case'}
              </span>
              <span className="text-[11px] font-mono text-[#A8A29E]">
                {imagesList.length} {isId ? 'Slide' : 'Slides'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF8F5] transition-colors cursor-pointer active:scale-95"
              aria-label="Tutup detail proyek"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Drawer Body */}
          <div className="overflow-y-auto px-5 sm:px-8 py-5 space-y-6 flex-1 overscroll-contain">
            {/* Title & Quantified Impact Chips */}
            <div>
              <Drawer.Title className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-snug">
                {titleText}
              </Drawer.Title>
              <Drawer.Description className="text-xs text-white/60 mt-1 font-body">
                {descriptionText ? (descriptionText.split(/[.!?]/)[0] || titleText) : titleText}
              </Drawer.Description>

              {/* Quantified Impact Chips Bar */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                {impactChips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/8 text-[#FAF8F5] border border-white/15 shadow-xs"
                  >
                    <Sparkles className="w-3 h-3 text-[#E26D5C]" />
                    <span>{chip}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* High-Resolution Media Carousel / Showcase */}
            {imagesList.length > 0 && (
              <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 aspect-[16/10] sm:aspect-[16/9] group">
                {activeImage && (
                  <Image
                    src={activeImage.url}
                    alt={titleText}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover object-center"
                    priority
                  />
                )}

                {/* Left/Right Slide Buttons */}
                {imagesList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition-transform active:scale-90"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition-transform active:scale-90"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white/90">
                      {activeImageIndex + 1} / {imagesList.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Quantified Metrics Grid */}
            {metrics.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#E26D5C] uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isId ? 'Metrik Performa & Dampak' : 'Quantified Impact Metrics'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {metrics.map((m, idx) => {
                    const labelText = typeof m.label === 'object' && m.label !== null ? t(m.label) : String(m.label)
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between"
                      >
                        <span className="text-xl sm:text-2xl font-semibold font-mono text-white tracking-tight">
                          {m.value}
                        </span>
                        <span className="text-[11px] text-[#A8A29E] font-mono mt-1 leading-snug">
                          {labelText}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Comprehensive Case Study Narrative */}
            <div id="project-drawer-desc" className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#E26D5C] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isId ? 'Konsep & Narasi Studi Kasus' : 'Case Study Narrative & Concept'}</span>
              </h3>
              <div className="text-sm sm:text-base text-white/80 font-body leading-relaxed space-y-3">
                {descriptionText.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Technical & Architectural Challenges */}
            {challenges.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#E26D5C] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{isId ? 'Tantangan Teknis & Arsitektural' : 'Technical & Design Challenges'}</span>
                </h3>
                <div className="space-y-2.5">
                  {challenges.map((c, idx) => {
                    const cTitle = typeof c.title === 'object' && c.title !== null ? t(c.title) : String(c.title)
                    const cDesc = typeof c.description === 'object' && c.description !== null ? t(c.description) : String(c.description)
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1"
                      >
                        <h4 className="text-xs font-mono font-semibold text-white">
                          0{idx + 1}. {cTitle}
                        </h4>
                        <p className="text-xs text-[#A8A29E] font-body leading-relaxed">
                          {cDesc}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tools & Tech Stack */}
            {project.tools_used && project.tools_used.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#A8A29E] uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-[#E26D5C]" />
                  <span>{isId ? 'Peralatan & Tumpukan Teknologi' : 'Tools & Tech Stack'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools_used.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.06] text-white/90 border border-white/15 shadow-2xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Live Demo, GitHub, Full Case Page */}
            <div className="pt-4 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FAF8F5] text-[#181716] font-medium text-sm hover:bg-white active:scale-95 transition-all shadow-md"
                >
                  <span>{isId ? 'Lihat Demo Langsung' : 'Live Demo'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all text-sm font-mono border border-white/15"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}

              <Link
                href={`/project/${project.slug}`}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-transparent text-[#FAF8F5]/80 hover:text-white active:scale-95 transition-all text-xs font-mono border border-white/10 hover:border-white/30"
              >
                <span>{isId ? 'Buka Halaman Lengkap' : 'Full Page'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
