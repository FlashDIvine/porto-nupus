'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { Project } from '@/types/database'

interface ProjectBentoGridProps {
  projects: Project[]
}

interface BentoCardConfig {
  colSpan: string
  aspectRatio: string
  label: string
}

function getBentoCardConfig(index: number, total: number): BentoCardConfig {
  // If exactly 5 projects (e.g. current production portfolio dataset)
  if (total === 5) {
    switch (index) {
      case 0:
        // Lead Project: Span 2 columns on desktop (16:10 aspect ratio) for complete branding systems.
        return {
          colSpan: 'md:col-span-2 lg:col-span-2',
          aspectRatio: 'aspect-[16/10]',
          label: 'Branding System',
        }
      case 1:
        // Poster / Print Card: 1 column (3:4 aspect ratio) for editorial or poster artwork.
        return {
          colSpan: 'md:col-span-1 lg:col-span-1',
          aspectRatio: 'aspect-[3/4]',
          label: 'Editorial / Poster',
        }
      case 2:
        // Poster / Print Card: 1 column (3:4 aspect ratio) for editorial book design.
        return {
          colSpan: 'md:col-span-1 lg:col-span-1',
          aspectRatio: 'aspect-[3/4]',
          label: 'Editorial / Print',
        }
      case 3:
        // Detail / Type Card: 1 column (1:1 aspect ratio) for kinetic typography or micro-experiments.
        return {
          colSpan: 'md:col-span-1 lg:col-span-1',
          aspectRatio: 'aspect-[1/1]',
          label: 'Experimental Type',
        }
      case 4:
        // Detail / Digital Card: 1 column (1:1 aspect ratio) completing the 3-column row.
        return {
          colSpan: 'md:col-span-1 lg:col-span-1',
          aspectRatio: 'aspect-[1/1]',
          label: 'Digital Artifact',
        }
    }
  }

  // If 4 projects (e.g. fallback dataset)
  if (total === 4) {
    switch (index) {
      case 0:
        return {
          colSpan: 'md:col-span-2 lg:col-span-2',
          aspectRatio: 'aspect-[16/10]',
          label: 'Branding System',
        }
      case 1:
        return {
          colSpan: 'md:col-span-1 lg:col-span-1',
          aspectRatio: 'aspect-[3/4]',
          label: 'Editorial / Poster',
        }
      case 2:
        return {
          colSpan: 'md:col-span-1 lg:col-span-1',
          aspectRatio: 'aspect-[1/1]',
          label: 'Experimental Type',
        }
      case 3:
        return {
          colSpan: 'md:col-span-2 lg:col-span-2',
          aspectRatio: 'aspect-[16/10]',
          label: 'Visual Identity',
        }
    }
  }

  // General fallback for N items: alternating 2+1, 1+2, 1+1+1 patterns
  const mod = index % 5
  switch (mod) {
    case 0:
      return {
        colSpan: 'md:col-span-2 lg:col-span-2',
        aspectRatio: 'aspect-[16/10]',
        label: 'Branding System',
      }
    case 1:
      return {
        colSpan: 'md:col-span-1 lg:col-span-1',
        aspectRatio: 'aspect-[3/4]',
        label: 'Editorial / Poster',
      }
    case 2:
      return {
        colSpan: 'md:col-span-1 lg:col-span-1',
        aspectRatio: 'aspect-[1/1]',
        label: 'Experimental Type',
      }
    case 3:
      return {
        colSpan: 'md:col-span-2 lg:col-span-2',
        aspectRatio: 'aspect-[16/10]',
        label: 'Visual Identity',
      }
    default:
      return {
        colSpan: 'md:col-span-1 lg:col-span-1',
        aspectRatio: 'aspect-[3/4]',
        label: 'Visual Exploration',
      }
  }
}

export function ProjectBentoGrid({ projects }: ProjectBentoGridProps) {
  const { t, isId } = useLanguage()

  if (!projects || projects.length === 0) {
    return (
      <div className="w-full py-20 text-center rounded-xl border border-dashed border-[#E6E2D8] bg-[#FFFFFF] p-8 shadow-xs">
        <Sparkles className="w-8 h-8 text-[#E26D5C] mx-auto mb-3 opacity-80" />
        <h3 className="text-xl font-heading text-[#181716]">
          {isId ? 'Belum Ada Proyek Publik' : 'No Published Projects Yet'}
        </h3>
        <p className="text-sm text-[#6B6661] mt-1.5 max-w-sm mx-auto font-body">
          {isId
            ? 'Karya yang telah dipublikasikan akan tampil di sini secara otomatis.'
            : 'Published works will automatically appear in this section.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-min w-full items-stretch">
      {projects.map((project, idx) => {
        const titleText = t(project.title, 'Untitled Project')
        const cardConfig = getBentoCardConfig(idx, projects.length)

        return (
          <motion.div
            key={project.id || project.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
            className={`group flex flex-col justify-between overflow-hidden rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] shadow-[0_4px_20px_rgba(24,23,22,0.03)] hover:shadow-[0_16px_36px_rgba(24,23,22,0.08)] hover:border-[#181716]/30 transition-all duration-500 ${cardConfig.colSpan}`}
          >
            <Link
              href={`/project/${project.slug}`}
              className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B50EC]"
            >
              {/* Image Container with specific Aspect Ratio & scale-[1.025] hover zoom */}
              <div
                className={`relative w-full overflow-hidden bg-[#F2EFE9] ${cardConfig.aspectRatio}`}
              >
                {project.cover_image_url ? (
                  <Image
                    src={project.cover_image_url}
                    alt={titleText}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    priority={idx === 0}
                    className="object-cover object-center scale-100 group-hover:scale-[1.025] transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#F2EFE9] flex items-center justify-center text-[#6B6661] font-mono text-xs">
                    No Cover Image
                  </div>
                )}

                {/* Category Badge in #D8E2DC (Celadon Sage Mist) */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-flex items-center text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D8E2DC] text-[#181716] border border-[#E6E2D8] shadow-xs">
                    {project.category || cardConfig.label}
                  </span>
                </div>

                {/* External Link Icon / Hover cobalt badge */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#E6E2D8] flex items-center justify-center text-[#181716] group-hover:text-[#FAF8F5] group-hover:bg-[#2B50EC] group-hover:border-[#2B50EC] transition-all duration-300 transform group-hover:rotate-45 shadow-xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Card Body: #FFFFFF card body with subtle ambient drop-shadow */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-[#FFFFFF]">
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#181716] group-hover:text-[#2B50EC] transition-colors leading-[1.1] line-clamp-2">
                    {titleText}
                  </h3>
                  {project.description && (
                    <p className="mt-2 text-xs sm:text-sm text-[#6B6661] font-body line-clamp-2 leading-relaxed">
                      {t(project.description)}
                    </p>
                  )}
                </div>

                {/* Metadata Slide at Bottom */}
                <div className="mt-4 pt-3.5 border-t border-[#E6E2D8] flex items-center justify-between text-xs font-mono text-[#6B6661]">
                  <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                    {project.tools_used && project.tools_used.length > 0 ? (
                      <span className="truncate">
                        {project.tools_used.slice(0, 2).join(' • ')}
                      </span>
                    ) : (
                      <span>DKV / 2026</span>
                    )}
                  </div>
                  <span className="shrink-0 font-medium text-[#181716] group-hover:text-[#2B50EC] transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                    {isId ? 'Lihat Detail →' : 'View Case →'}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
