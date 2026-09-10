'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Download, Mail, Phone, Globe, ExternalLink, Sparkles, Award } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import type { Profile, ContactLink } from '@/types/database'

interface AboutPageViewProps {
  profile: Profile
}

function renderContactIcon(platform: string) {
  const p = platform.toLowerCase()

  if (p.includes('mail') || p.includes('email')) {
    return <Mail className="w-4 h-4" />
  }
  if (p.includes('phone') || p.includes('wa') || p.includes('whatsapp')) {
    return <Phone className="w-4 h-4" />
  }
  if (p.includes('web') || p.includes('site') || p.includes('portfolio')) {
    return <Globe className="w-4 h-4" />
  }
  if (p.includes('insta')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }
  if (p.includes('behance')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.143 0-6.625-3.003-6.625-6.995 0-3.953 2.482-7.005 6.625-7.005 4.097 0 6.375 2.957 6.375 6.938 0 .445-.038.892-.075 1.332h-9.987c.189 2.477 1.758 3.864 3.754 3.864 1.71 0 2.827-.723 3.328-1.534l1.706.4zm-5.064-7.234c-1.895 0-3.298 1.157-3.621 3.234h7.026c-.151-1.996-1.51-3.234-3.405-3.234zm-13.662-7.766h5.834c2.511 0 4.166 1.321 4.166 3.42 0 1.324-.652 2.373-1.808 2.923 1.554.512 2.373 1.777 2.373 3.486 0 2.531-1.921 4.171-4.83 4.171h-5.735v-14zm3.013 2.529v3.425h2.489c1.077 0 1.782-.544 1.782-1.688 0-1.127-.705-1.737-1.782-1.737h-2.489zm0 5.642v3.834h2.721c1.232 0 1.998-.636 1.998-1.884 0-1.282-.766-1.95-1.998-1.95h-2.721z" />
      </svg>
    )
  }
  if (p.includes('dribbble')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.198 11.233c-.027-.229-.064-.455-.107-.678-1.848-.378-4.237-.417-6.918-.046-.109-.234-.223-.467-.34-.699-1.272-2.525-2.853-4.664-4.52-6.14 1.144-.43 2.387-.67 3.687-.67 4.173 0 7.768 2.668 9.198 6.533zm-11.458-7.233c1.65 1.459 3.208 3.565 4.464 6.05-.783.155-1.579.336-2.384.542-2.42-3.864-4.944-5.918-6.191-6.843 1.258-.598 2.671-.949 4.111-.949zm-6.273 2.106c1.171.868 3.659 2.879 6.069 6.702-.916.277-1.838.586-2.76.924-2.812-1.391-5.631-1.636-6.425-1.684.58-2.476 1.831-4.629 3.516-5.942zm-2.467 7.894c.833.05 3.738.307 6.643 1.761-.314.995-.601 2.029-.854 3.097-3.921-1.127-6.993.411-7.242.541-.186-.777-.287-1.584-.287-2.414 0-1.07.181-2.098.5-3.052l.24.067zm1.884 7.625c.355-.205 3.065-1.638 6.787-.557-.367 1.341-.676 2.709-.916 4.093-3.238-.854-5.325-2.607-5.871-3.536zm7.848 4.375c.24-1.353.543-2.691.902-4.004 2.825.26 5.347 1.328 6.441 1.89-1.823 1.954-4.42 3.167-7.343 3.167-.091 0-.182-.002-.273-.004zm8.396-3.844c-1.174-.627-3.848-1.782-6.846-1.993.22-.857.469-1.696.744-2.511 2.585-.316 4.908-.242 6.711.111.139.73.217 1.48.217 2.247 0 .749-.079 1.478-.216 2.146h.001z" />
      </svg>
    )
  }
  if (p.includes('linkedin')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    )
  }

  return <ExternalLink className="w-4 h-4" />
}

export function AboutPageView({ profile }: AboutPageViewProps) {
  const { t, isId } = useLanguage()

  const nameText = profile.name || 'Desainer Grafis DKV'
  const taglineText = t(profile.tagline, 'Desainer Komunikasi Visual')
  const bioText = t(profile.bio, '')

  const contactList: ContactLink[] = Array.isArray(profile.contact_links)
    ? (profile.contact_links as unknown as ContactLink[])
    : []

  const skillsList = Array.isArray(profile.skills) ? profile.skills : []

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* 1 & 2. Profile Photo + Name + Tagline */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12"
      >
        {/* Profile Photo */}
        <div className="relative shrink-0">
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl bg-[#161616] group">
            {profile.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={nameText}
                fill
                priority
                sizes="(max-width: 640px) 176px, 224px"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 font-mono text-xs">
                No Photo
              </div>
            )}
            {/* Elegant Inner Border Highlight */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>

          {/* Accent dot badge */}
          <div className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-lg">
            <div className="w-4 h-4 rounded-full bg-[#D4FF00] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
            </div>
          </div>
        </div>

        {/* Name, Tagline, & Quick Action */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[#D4FF00] text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isId ? 'Profil Kreatif' : 'Creative Profile'}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-tight break-words">
            {nameText}
          </h1>

          <p className="text-lg sm:text-xl font-heading text-white/70 italic max-w-xl">
            &ldquo;{taglineText}&rdquo;
          </p>

          {/* 5. Download CV Button */}
          {profile.cv_url && (
            <div className="pt-2">
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#D4FF00] hover:bg-[#bce300] text-[#0a0a0a] font-semibold text-sm shadow-lg shadow-[#D4FF00]/15 transition-all transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
              >
                <Download className="w-4 h-4" />
                <span>{isId ? 'Unduh Curriculum Vitae (CV)' : 'Download Curriculum Vitae (CV)'}</span>
              </a>
            </div>
          )}
        </div>
      </motion.section>

      {/* 3. Bio Paragraphs */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF00]">
            {isId ? 'Filosofi & Pendekatan' : 'Philosophy & Approach'}
          </span>
          <h2 className="font-heading text-2xl font-semibold text-white">
            {isId ? 'Tentang Praktik Desain' : 'About Design Practice'}
          </h2>
        </div>

        <div className="md:col-span-2 space-y-4 text-base sm:text-lg text-white/80 font-body leading-relaxed">
          {bioText ? (
            bioText.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p className="text-white/40 italic">
              {isId ? 'Belum ada data biografi.' : 'No biography provided yet.'}
            </p>
          )}
        </div>
      </motion.section>

      {/* 4. Skills & Competencies */}
      {skillsList.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-10 border-t border-white/10 space-y-6"
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4FF00]" />
            <h2 className="font-heading text-2xl font-semibold text-white">
              {isId ? 'Keahlian & Disiplin Kreatif' : 'Skills & Creative Disciplines'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-xl bg-[#121212] border border-white/10 text-white/90 text-sm font-body hover:border-[#D4FF00]/50 hover:bg-[#161616] transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.section>
      )}

      {/* 6. Contact Links */}
      {contactList.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-10 border-t border-white/10 space-y-6"
        >
          <h2 className="font-heading text-2xl font-semibold text-white">
            {isId ? 'Hubungi & Kolaborasi' : 'Contact & Collaboration'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {contactList.map((contact, idx) => (
              <a
                key={`${contact.platform}-${idx}`}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#121212] border border-white/10 hover:border-[#D4FF00]/50 hover:bg-[#161616] transition-all text-white/80 hover:text-white group"
              >
                <div className="p-2.5 rounded-lg bg-[#1a1a1a] text-[#D4FF00] group-hover:scale-105 transition-transform">
                  {renderContactIcon(contact.platform)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    {contact.platform}
                  </p>
                  <p className="text-sm font-medium text-white truncate">
                    {contact.label || contact.url}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-[#D4FF00] transition-colors" />
              </a>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}
