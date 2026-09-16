'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Download, Mail, Phone, Globe, Sparkles, Award, ArrowUpRight } from 'lucide-react'
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

  return <Globe className="w-4 h-4" />
}

function getSocialStyles(platform: string) {
  const p = platform.toLowerCase()

  if (p.includes('insta')) {
    return {
      cardHover: 'hover:border-[#E26D5C] hover:shadow-[0_12px_28px_-6px_rgba(226,109,92,0.22)]',
      iconBox: 'text-[#E26D5C] group-hover:bg-[#E26D5C] group-hover:text-white',
      arrowHover: 'group-hover:text-[#E26D5C]',
    }
  }
  if (p.includes('behance')) {
    return {
      cardHover: 'hover:border-[#2B50EC] hover:shadow-[0_12px_28px_-6px_rgba(43,80,236,0.22)]',
      iconBox: 'text-[#2B50EC] group-hover:bg-[#2B50EC] group-hover:text-white',
      arrowHover: 'group-hover:text-[#2B50EC]',
    }
  }
  if (p.includes('dribbble')) {
    return {
      cardHover: 'hover:border-[#EA4C89] hover:shadow-[0_12px_28px_-6px_rgba(234,76,137,0.22)]',
      iconBox: 'text-[#EA4C89] group-hover:bg-[#EA4C89] group-hover:text-white',
      arrowHover: 'group-hover:text-[#EA4C89]',
    }
  }
  if (p.includes('linkedin')) {
    return {
      cardHover: 'hover:border-[#0A66C2] hover:shadow-[0_12px_28px_-6px_rgba(10,102,194,0.22)]',
      iconBox: 'text-[#0A66C2] group-hover:bg-[#0A66C2] group-hover:text-white',
      arrowHover: 'group-hover:text-[#0A66C2]',
    }
  }

  return {
    cardHover: 'hover:border-[#E26D5C] hover:shadow-[0_12px_28px_-6px_rgba(226,109,92,0.22)]',
    iconBox: 'text-[#E26D5C] group-hover:bg-[#E26D5C] group-hover:text-white',
    arrowHover: 'group-hover:text-[#E26D5C]',
  }
}

function MarqueeDivider({ reverse = false }: { reverse?: boolean }) {
  const tickerText = '✦ BRAND IDENTITY ✦ EDITORIAL SYSTEMS ✦ PACKAGING DESIGN ✦ EXPERIMENTAL TYPE ✦ CREATIVE DIRECTION '
  const tickerContent = tickerText.repeat(4)

  return (
    <div className="w-full overflow-hidden rounded-xl bg-[#F2EFE9] border border-[#E6E2D8] py-2.5 select-none">
      <motion.div
        className="flex w-max"
        initial={{ x: reverse ? '-50%' : '0%' }}
        animate={{ x: reverse ? '0%' : '-50%' }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 70,
        }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-[#6B6661] whitespace-nowrap">
          {tickerContent}
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-[#6B6661] whitespace-nowrap" aria-hidden="true">
          {tickerContent}
        </span>
      </motion.div>
    </div>
  )
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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col gap-10 sm:gap-14">
      {/* 1. Studio Header & Profile Picture */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12"
      >
        {/* Profile Picture with Layered Artistic Composition & Rotating Stamp */}
        <div className="relative shrink-0 group">
          {/* Layered background accent card (offset & organic feel) */}
          <div className="absolute inset-0 rounded-2xl bg-[#D8E2DC]/50 -rotate-3 translate-x-2 translate-y-2 transition-transform duration-300 group-hover:rotate-0 group-hover:translate-x-1 group-hover:translate-y-1 pointer-events-none" />

          {/* Profile photo container */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#E6E2D8] shadow-[0_12px_30px_-8px_rgba(226,109,92,0.25)] bg-[#FFFFFF]">
            {profile.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={nameText}
                fill
                priority
                sizes="(max-width: 640px) 192px, 224px"
                className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#6B6661] font-mono text-xs bg-[#F2EFE9]">
                No Photo
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#E6E2D8]/40 pointer-events-none" />
          </div>

          {/* Creative rotating circular stamp / badge floating near the avatar corner */}
          <div className="absolute -bottom-5 -right-5 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FAF8F5]/95 backdrop-blur-xs border border-[#E6E2D8] shadow-md flex items-center justify-center p-1 z-20 select-none">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full animate-[spin_12s_linear_infinite]"
              aria-label="• VISUAL COMMUNICATION • DKV ARCHIVE 2026 •"
            >
              <defs>
                <path
                  id="avatarCirclePath"
                  d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                className="text-[7px] font-mono uppercase fill-[#181716] font-semibold"
                xmlSpace="preserve"
              >
                <textPath
                  href="#avatarCirclePath"
                  textLength="224"
                  lengthAdjust="spacing"
                >
                  • VISUAL COMMUNICATION • DKV ARCHIVE 2026 •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[#E26D5C] text-sm font-semibold">✦</span>
            </div>
          </div>
        </div>

        {/* Name, Tagline, Live Status, & Actions */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8E2DC] border border-[#E6E2D8] text-[#181716] text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#E26D5C]" />
              <span>{isId ? 'Profil Kreatif' : 'Creative Profile'}</span>
            </div>

            {/* Live status indicator with tooltip */}
            <div
              className="group/status relative inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E6E2D8] text-xs font-mono text-[#181716] shadow-2xs cursor-default"
              role="status"
              aria-label="Open for freelance & collaborations"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E26D5C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E26D5C]" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium">
                {isId ? 'Terbuka untuk kolaborasi' : 'Open for freelance & collaborations'}
              </span>

              {/* Floating Tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#181716] text-[#FAF8F5] text-[10px] font-mono whitespace-nowrap opacity-0 group-hover/status:opacity-100 transition-opacity duration-200 shadow-md z-30"
              >
                Open for freelance &amp; collaborations
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#181716]" />
              </div>
            </div>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-semibold text-[#181716] tracking-tight leading-[1.05] break-words">
            {nameText}
          </h1>

          <p className="text-lg sm:text-xl font-heading text-[#6B6661] italic max-w-xl">
            &ldquo;{taglineText}&rdquo;
          </p>

          {/* Download CV Button */}
          {profile.cv_url && (
            <div className="pt-2">
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] font-medium text-sm shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
              >
                <Download className="w-4 h-4" />
                <span>{isId ? 'Unduh Curriculum Vitae (CV)' : 'Download Curriculum Vitae (CV)'}</span>
              </a>
            </div>
          )}
        </div>
      </motion.section>

      {/* Animated Marquee Divider 1 */}
      <MarqueeDivider />

      {/* 2. Bio Paragraphs & Philosophy */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E26D5C]">
            {isId ? 'Filosofi & Pendekatan' : 'Philosophy & Approach'}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#181716] leading-[1.1]">
            {isId ? 'Tentang Praktik Desain' : 'About Design Practice'}
          </h2>
        </div>

        <div className="md:col-span-2 space-y-4 text-base sm:text-lg text-[#181716]/90 font-body leading-relaxed">
          {bioText ? (
            bioText.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p className="text-[#6B6661] italic">
              {isId ? 'Belum ada data biografi.' : 'No biography provided yet.'}
            </p>
          )}
        </div>
      </motion.section>

      {/* Animated Marquee Divider 2 */}
      {skillsList.length > 0 && <MarqueeDivider reverse />}

      {/* 3. Interactive Creative Skills & Disciplines */}
      {skillsList.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E26D5C]" />
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#181716] leading-[1.1]">
              {isId ? 'Keahlian & Disiplin Kreatif' : 'Skills & Creative Disciplines'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {skillsList.map((skill, idx) => (
              <div
                key={`${skill}-${idx}`}
                tabIndex={0}
                role="button"
                className="group bg-[#FFFFFF] text-[#181716] border border-[#E6E2D8] px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 shadow-sm hover:bg-[#E26D5C] hover:text-white hover:border-[#E26D5C] hover:-translate-y-1 hover:shadow-md cursor-pointer select-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E26D5C]"
              >
                <span className="text-[#E26D5C] group-hover:text-white group-hover:rotate-45 transition-all duration-300 text-xs inline-block shrink-0">
                  ✦
                </span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Animated Marquee Divider 3 */}
      {contactList.length > 0 && <MarqueeDivider />}

      {/* 4. Contact & Social Cards */}
      {contactList.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#181716] leading-[1.1]">
            {isId ? 'Hubungi & Kolaborasi' : 'Contact & Collaboration'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {contactList.map((contact, idx) => {
              const styles = getSocialStyles(contact.platform)
              const isDirectAction =
                contact.url.startsWith('mailto:') || contact.url.startsWith('tel:')

              return (
                <a
                  key={`${contact.platform}-${idx}`}
                  href={contact.url}
                  target={isDirectAction ? undefined : '_blank'}
                  rel={isDirectAction ? undefined : 'noopener noreferrer'}
                  className={`group bg-[#FFFFFF] border border-[#E6E2D8] rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 flex items-center justify-between gap-4 ${styles.cardHover}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`p-3 rounded-xl bg-[#F2EFE9] transition-all duration-300 ${styles.iconBox}`}
                    >
                      {renderContactIcon(contact.platform)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-[#6B6661] uppercase tracking-wider">
                        {contact.platform}
                      </p>
                      <p className="text-sm font-medium text-[#181716] truncate">
                        {contact.label || contact.url}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    className={`w-4 h-4 text-[#6B6661] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200 shrink-0 ${styles.arrowHover}`}
                  />
                </a>
              )
            })}
          </div>
        </motion.section>
      )}
    </div>
  )
}
