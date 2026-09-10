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

export function ProjectBentoGrid({ projects }: ProjectBentoGridProps) {
  const { t, isId } = useLanguage()

  if (!projects || projects.length === 0) {
    return (
      <div className="w-full py-20 text-center rounded-2xl border border-dashed border-white/10 bg-[#121212]/50 p-8">
        <Sparkles className="w-8 h-8 text-[#D4FF00] mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-heading text-white">
          {isId ? 'Belum Ada Proyek Publik' : 'No Published Projects Yet'}
        </h3>
        <p className="text-sm text-white/50 mt-1 max-w-sm mx-auto">
          {isId
            ? 'Karya yang telah dipublikasikan akan tampil di sini secara otomatis.'
            : 'Published works will automatically appear in this section.'}
        </p>
      </div>
    )
  }

  // Bento grid span assignment helper
  const getBentoClasses = (index: number) => {
    const pattern = index % 5
    switch (pattern) {
      case 0:
        // Large featured tile
        return 'md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[500px]'
      case 1:
        // Compact top tile
        return 'md:col-span-1 md:row-span-1 min-h-[260px] md:min-h-[240px]'
      case 2:
        // Compact tile next to it
        return 'md:col-span-1 md:row-span-1 min-h-[260px] md:min-h-[240px]'
      case 3:
        // Tall portrait tile
        return 'md:col-span-1 md:row-span-2 min-h-[360px] md:min-h-[480px]'
      case 4:
        // Wide landscape tile
        return 'md:col-span-2 md:row-span-1 min-h-[260px] md:min-h-[240px]'
      default:
        return 'md:col-span-1 md:row-span-1 min-h-[260px]'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr w-full">
      {projects.map((project, idx) => {
        const titleText = t(project.title, 'Untitled Project')
        const spanClass = getBentoClasses(idx)

        return (
          <motion.div
            key={project.id || project.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl bg-[#121212] border border-white/10 hover:border-[#D4FF00]/50 transition-colors ${spanClass}`}
          >
            <Link
              href={`/project/${project.slug}`}
              className="block w-full h-full relative focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
            >
              {/* Background Image with Framer Motion Zoom */}
              {project.cover_image_url ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={project.cover_image_url}
                    alt={titleText}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx === 0}
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 bg-[#161616] flex items-center justify-center text-white/20 font-mono text-xs">
                  No Cover Image
                </div>
              )}

              {/* Gradient Overlay for Readable Text Hierarchy */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Category Badge at Top Left */}
              {project.category && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#0a0a0a]/75 backdrop-blur-md text-white/90 border border-white/10 group-hover:border-[#D4FF00]/50 group-hover:text-[#D4FF00] transition-colors">
                    {project.category}
                  </span>
                </div>
              )}

              {/* External Link Icon at Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <div className="w-8 h-8 rounded-full bg-[#0a0a0a]/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 group-hover:text-[#0a0a0a] group-hover:bg-[#D4FF00] group-hover:border-[#D4FF00] transition-all transform group-hover:rotate-45 duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card Footer Content: Title + Subtitle */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                <h3 className="font-heading text-lg sm:text-2xl font-semibold text-white group-hover:text-[#D4FF00] transition-colors line-clamp-2">
                  {titleText}
                </h3>
                {project.tools_used && project.tools_used.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.tools_used.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80 backdrop-blur"
                      >
                        {tool}
                      </span>
                    ))}
                    {project.tools_used.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                        +{project.tools_used.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
