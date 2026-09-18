'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { Project } from '@/types/database'
import { cn } from '@/lib/utils'

export interface ProjectCardCompactProps {
  project: Project
  index?: number
  onSelect?: (project: Project) => void
  className?: string
}

export function ProjectCardCompact({
  project,
  index = 0,
  onSelect,
  className,
}: ProjectCardCompactProps) {
  const { t, isId } = useLanguage()

  const titleText = t(project.title, 'Untitled Project')
  const descriptionText = t(project.description, '')
  const firstSentence = descriptionText.split(/[.!?]/)[0] || descriptionText

  const tools = project.tools_used?.slice(0, 3) || []

  return (
    <div
      onClick={() => onSelect?.(project)}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/95 dark:bg-[#181716]/95 border border-[#E6E2D8] dark:border-white/10 shadow-[0_4px_20px_rgba(24,23,22,0.04)] hover:shadow-[0_12px_32px_rgba(24,23,22,0.08)] active:scale-95 transition-all duration-200 cursor-pointer select-none text-left w-full',
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(project)
        }
      }}
      aria-label={`Lihat detail proyek ${titleText}`}
    >
      {/* Subtle radial glow on card hover/active */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 bg-[radial-gradient(300px_circle_at_50%_0%,rgba(226,109,92,0.08),transparent_70%)]" />

      {/* 16:9 Thumbnail Image Preview */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#F2EFE9] dark:bg-[#201F1E]">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={titleText}
            fill
            sizes="(max-width: 768px) 85vw, 360px"
            priority={index < 2}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#6B6661] text-xs font-mono">
            No Preview
          </div>
        )}

        {/* Ambient Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15 opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Category Badge Chip (max-width prevents collision with action button) */}
        <div className="absolute top-2.5 left-2.5 z-10 max-w-[calc(100%-3rem)]">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#181716]/90 text-[#181716] dark:text-white border border-[#E6E2D8] dark:border-white/20 shadow-xs backdrop-blur-xs max-w-full">
            <span className="truncate">{project.category || 'Portfolio'}</span>
          </span>
        </div>

        {/* Interactive Action Icon */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <div className="w-7 h-7 rounded-full bg-white/90 dark:bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-[#181716] dark:text-white group-hover:bg-[#E26D5C] group-hover:text-white transition-all shadow-xs">
            <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:rotate-45 transition-transform duration-300" />
          </div>
        </div>

        {/* Quantified impact highlight pill if present */}
        {project.impact_chips && project.impact_chips.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 max-w-[calc(100%-1.25rem)]">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white border border-white/20 max-w-full">
              <Sparkles className="w-2.5 h-2.5 text-[#E26D5C] shrink-0" />
              <span className="truncate">{project.impact_chips[0]}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Content: Concise & Eliminate Narrative Bloat */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
        <div>
          <h3 className="font-heading text-base sm:text-lg font-semibold text-[#181716] dark:text-white group-hover:text-[#E26D5C] transition-colors leading-snug line-clamp-1">
            {titleText}
          </h3>
          <p className="mt-1 text-xs text-[#6B6661] dark:text-[#A8A29E] font-body line-clamp-1 leading-relaxed">
            {firstSentence}
          </p>
        </div>

        {/* Mini Technology Badge Chips & Tap Prompt */}
        <div className="pt-2 border-t border-[#E6E2D8]/80 dark:border-white/10 flex items-center justify-between gap-1 text-[11px] font-mono">
          <div className="flex items-center gap-1 overflow-hidden min-w-0">
            {tools.slice(0, 2).map((tool) => (
              <span
                key={tool}
                className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-[#F2EFE9] dark:bg-white/8 text-[#181716] dark:text-white/80 border border-[#E6E2D8]/70 dark:border-white/10 shrink-0 truncate max-w-[76px]"
              >
                {tool}
              </span>
            ))}
          </div>

          <span className="shrink-0 text-[10px] font-mono text-[#E26D5C] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            <span>{isId ? 'Detail' : 'Case'}</span>
            <span>&rarr;</span>
          </span>
        </div>
      </div>
    </div>
  )
}
