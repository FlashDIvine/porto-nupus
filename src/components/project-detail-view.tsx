'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { ArrowLeft, Layers, Sparkles, Calendar } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { Project, ProjectImage } from '@/types/database'

interface ProjectDetailViewProps {
  project: Project
  otherProjects?: Project[]
}

export function ProjectDetailView({ project, otherProjects = [] }: ProjectDetailViewProps) {
  const { t, isId } = useLanguage()

  const titleText = t(project.title, 'Project Detail')
  const descriptionText = t(project.description, '')

  // Safely parse and sort gallery images
  const imagesList: ProjectImage[] = Array.isArray(project.images)
    ? (project.images as unknown as ProjectImage[]).slice().sort((a, b) => (a.order || 0) - (b.order || 0))
    : []

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <article className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Top Navigation / Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#6B6661] hover:text-[#2B50EC] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{isId ? 'Kembali ke Semua Proyek' : 'Back to all projects'}</span>
        </Link>
      </motion.div>

      {/* 1. Hero Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Category & Metadata */}
        <div className="flex flex-wrap items-center gap-3">
          {project.category && (
            <span className="inline-flex items-center text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#D8E2DC] text-[#181716] border border-[#E6E2D8] shadow-xs">
              {project.category}
            </span>
          )}
          {project.created_at && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6B6661] font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#E26D5C]" />
              {new Date(project.created_at).toLocaleDateString(isId ? 'id-ID' : 'en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </span>
          )}
        </div>

        {/* Big Title */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-semibold text-[#181716] tracking-tight leading-[1.05]">
          {titleText}
        </h1>

        {/* Full-width Hero Cover Image */}
        {project.cover_image_url && (
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/80 bg-white/80 backdrop-blur-[8px] mt-8 shadow-[0_16px_40px_rgba(24,23,22,0.06)]">
            <Image
              src={project.cover_image_url}
              alt={titleText}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover object-center"
            />
          </div>
        )}
      </motion.section>

      {/* 2. Narrative & Description Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-12 sm:mt-16 pt-8 border-t border-[#E6E2D8] grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#E26D5C] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {isId ? 'Konsep & Narasi' : 'Concept & Context'}
          </h2>
          <p className="text-sm text-[#6B6661] font-body">
            {isId
              ? 'Latar belakang eksplorasi visual, proses desain, dan perumusan solusi grafis.'
              : 'Background visual exploration, design process, and graphical solution formulation.'}
          </p>

          {/* 4. Tools Used Section */}
          {project.tools_used && project.tools_used.length > 0 && (
            <div className="pt-4 space-y-2">
              <h3 className="text-xs font-mono text-[#181716] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#E26D5C]" />
                {isId ? 'Peralatan & Perangkat' : 'Tools Used'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tools_used.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-white/80 backdrop-blur-[8px] text-[#181716] border border-white/80 shadow-2xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 text-base sm:text-lg text-[#181716]/90 font-body leading-relaxed space-y-4">
          {descriptionText.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </motion.section>

      {/* 3. Gallery Section (Vertical Stack / High-res Showcase) */}
      {imagesList.length > 0 && (
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 sm:mt-24 pt-12 border-t border-[#E6E2D8] space-y-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E26D5C]">
                Gallery &amp; Process
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#181716] tracking-tight mt-1 leading-[1.05]">
                {isId ? 'Dokumentasi & Artefak Visual' : 'Visual Artifacts & Showcase'}
              </h2>
            </div>
            <span className="text-xs font-mono text-[#6B6661]">
              {imagesList.length} {isId ? 'Aset' : 'Assets'}
            </span>
          </div>

          <div className="space-y-8">
            {imagesList.map((img, index) => {
              const captionStr =
                typeof img.caption === 'object' && img.caption !== null
                  ? t(img.caption)
                  : typeof img.caption === 'string'
                  ? img.caption
                  : ''

              return (
                <figure
                  key={`${img.url}-${index}`}
                  className="rounded-2xl overflow-hidden border border-white/80 bg-white/80 backdrop-blur-[8px] shadow-[0_8px_30px_rgba(24,23,22,0.04)] group"
                >
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#F2EFE9]">
                    <Image
                      src={img.url}
                      alt={captionStr || `${titleText} - image ${index + 1}`}
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>
                  {captionStr && (
                    <figcaption className="p-4 bg-white/70 backdrop-blur-[8px] border-t border-[#E6E2D8]/80 text-xs text-[#181716] font-mono flex items-center justify-between">
                      <span>{captionStr}</span>
                      <span className="text-[#6B6661]">0{index + 1}</span>
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        </motion.section>
      )}

      {/* 5. Navigation & Next Projects */}
      <section className="mt-16 sm:mt-24 pt-10 border-t border-[#E6E2D8] flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#181716] text-[#FAF8F5] hover:bg-[#2B50EC] transition-all text-sm font-medium shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          {isId ? 'Lihat Semua Proyek' : 'View All Projects'}
        </Link>

        {otherProjects.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B6661] font-mono hidden sm:inline">
              {isId ? 'Karya Lainnya:' : 'More Projects:'}
            </span>
            {otherProjects.slice(0, 2).map((other) => (
              <Link
                key={other.slug}
                href={`/project/${other.slug}`}
                className="text-xs font-mono text-[#181716] hover:text-[#2B50EC] underline-offset-4 hover:underline"
              >
                {t(other.title)} &rarr;
              </Link>
            ))}
          </div>
        )}
      </section>
    </article>
  )
}
