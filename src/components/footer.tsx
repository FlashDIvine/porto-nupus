import React from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  Globe,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { ContactLink } from '@/types/database'

function renderSocialIcon(platform: string) {
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
  if (p.includes('git')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    )
  }

  return <ExternalLink className="w-4 h-4" />
}

export async function Footer() {
  let profileName = 'Portofolio DKV'
  let contactLinks: ContactLink[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profile')
      .select('name, contact_links')
      .limit(1)
      .maybeSingle()

    if (data) {
      if (data.name && data.name.trim() !== '') {
        profileName = data.name
      }
      if (data.contact_links && Array.isArray(data.contact_links)) {
        contactLinks = data.contact_links as unknown as ContactLink[]
      }
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && error.digest === 'DYNAMIC_SERVER_USAGE') { throw error; } console.error('Failed to load profile in footer:', error)
  }

  // Fallback links if database doesn't have any contact_links yet
  const displayLinks =
    contactLinks.length > 0
      ? contactLinks
      : [
          { platform: 'Instagram', url: 'https://instagram.com', label: 'Instagram' },
          { platform: 'Behance', url: 'https://behance.net', label: 'Behance' },
          { platform: 'Dribbble', url: 'https://dribbble.com', label: 'Dribbble' },
          { platform: 'LinkedIn', url: 'https://linkedin.com', label: 'LinkedIn' },
          { platform: 'Email', url: 'mailto:contact@example.com', label: 'Email' },
        ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white/40 backdrop-blur-md border-t border-white/60 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-[#181716] hover:text-[#2B50EC] transition-colors">
            {profileName}<span className="text-[#E26D5C]">.</span>
          </Link>
          <p className="text-xs text-[#6B6661] max-w-sm font-body">
            Desain Komunikasi Visual • Brand Identity, Visual Exploration & Digital Artworks
          </p>
        </div>

        {/* Social / Contact Links */}
        <div className="flex items-center flex-wrap justify-center gap-2.5">
          {displayLinks.map((link, index) => (
            <a
              key={`${link.platform}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label || link.platform}
              className="p-2.5 rounded-full bg-white/80 backdrop-blur-[8px] border border-white/80 text-[#181716] hover:text-[#FAF8F5] hover:bg-[#2B50EC] hover:border-[#2B50EC] transition-all transform hover:-translate-y-0.5 duration-200 shadow-xs"
              title={link.label || link.platform}
            >
              {renderSocialIcon(link.platform)}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#6B6661] text-center md:text-right font-mono">
          © {currentYear} {profileName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
