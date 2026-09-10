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
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-[#D4FF00] transition-colors group"
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
            <span className="inline-flex items-center text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/30">
              {project.category}
            </span>
          )}
          {project.created_at && (
            <span className="inline-flex items-center gap-1 text-xs text-white/40 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.created_at).toLocaleDateString(isId ? 'id-ID' : 'en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </span>
          )}
        </div>

        {/* Big Title */}
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
          {titleText}
        </h1>

        {/* Full-width Hero Cover Image */}
        {project.cover_image_url && (
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 bg-[#121212] mt-8 shadow-2xl">
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
        className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#D4FF00] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {isId ? 'Konsep & Narasi' : 'Concept & Context'}
          </h2>
          <p className="text-sm text-white/50">
            {isId
              ? 'Latar belakang eksplorasi visual, proses desain, dan perumusan solusi grafis.'
              : 'Background visual exploration, design process, and graphical solution formulation.'}
          </p>

          {/* 4. Tools Used Section */}
          {project.tools_used && project.tools_used.length > 0 && (
            <div className="pt-4 space-y-2">
              <h3 className="text-xs font-mono text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D4FF00]" />
                {isId ? 'Peralatan & Perangkat' : 'Tools Used'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tools_used.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#161616] text-white/80 border border-white/10"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 text-base sm:text-lg text-white/80 font-body leading-relaxed space-y-4">
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
          className="mt-16 sm:mt-24 pt-12 border-t border-white/10 space-y-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF00]">
                Gallery & Process
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">
                {isId ? 'Dokumentasi & Artefak Visual' : 'Visual Artifacts & Showcase'}
              </h2>
            </div>
            <span className="text-xs font-mono text-white/40">
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
                  className="rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-xl group"
                >
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9]">
                    <Image
                      src={img.url}
                      alt={captionStr || `${titleText} - image ${index + 1}`}
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>
                  {captionStr && (
                    <figcaption className="p-4 bg-[#0e0e0e] border-t border-white/5 text-xs text-white/60 font-mono flex items-center justify-between">
                      <span>{captionStr}</span>
                      <span className="text-white/30">0{index + 1}</span>
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        </motion.section>
      )}

      {/* 5. Navigation & Next Projects */}
      <section className="mt-16 sm:mt-24 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/80 hover:text-[#0a0a0a] hover:bg-[#D4FF00] hover:border-[#D4FF00] transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {isId ? 'Lihat Semua Proyek' : 'View All Projects'}
        </Link>

        {otherProjects.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 font-mono hidden sm:inline">
              {isId ? 'Karya Lainnya:' : 'More Projects:'}
            </span>
            {otherProjects.slice(0, 2).map((other) => (
              <Link
                key={other.slug}
                href={`/project/${other.slug}`}
                className="text-xs font-mono text-white/70 hover:text-[#D4FF00] underline-offset-4 hover:underline"
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
