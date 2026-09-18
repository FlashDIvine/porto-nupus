'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Layers, User, Mail, Check } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import { cn } from '@/lib/utils'

export interface MobileFloatingDockProps {
  email?: string
  className?: string
}

export function MobileFloatingDock({
  email = 'studio@najibvisual.com',
  className,
}: MobileFloatingDockProps) {
  const { isId } = useLanguage()
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = email
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  const isHome = pathname === '/'
  const isAbout = pathname === '/about'

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden pointer-events-auto',
        className
      )}
    >
      <nav
        aria-label="Mobile Dock Navigation"
        className="relative flex items-center gap-5 sm:gap-6 px-5 py-2.5 rounded-full backdrop-blur-xl bg-[#181716]/90 border border-white/15 shadow-2xl text-white"
      >
        {/* Home Item */}
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center gap-0.5 p-1 text-white/70 hover:text-white active:scale-90 transition-all cursor-pointer',
            isHome && 'text-[#FAF8F5]'
          )}
          aria-label={isId ? 'Beranda' : 'Home'}
        >
          <Home className={cn('w-5 h-5', isHome ? 'text-[#E26D5C]' : 'text-white/75')} />
          <span className="text-[9px] font-mono tracking-tight">Home</span>
        </Link>

        {/* Projects / Gallery Item */}
        <a
          href={isHome ? '#gallery' : '/#gallery'}
          className="flex flex-col items-center gap-0.5 p-1 text-white/70 hover:text-white active:scale-90 transition-all cursor-pointer"
          aria-label={isId ? 'Proyek' : 'Projects'}
        >
          <Layers className="w-5 h-5 text-white/75" />
          <span className="text-[9px] font-mono tracking-tight">Projects</span>
        </a>

        {/* About / Skills Item */}
        <Link
          href="/about"
          className={cn(
            'flex flex-col items-center gap-0.5 p-1 text-white/70 hover:text-white active:scale-90 transition-all cursor-pointer',
            isAbout && 'text-[#FAF8F5]'
          )}
          aria-label={isId ? 'Tentang / Skills' : 'About / Skills'}
        >
          <User className={cn('w-5 h-5', isAbout ? 'text-[#E26D5C]' : 'text-white/75')} />
          <span className="text-[9px] font-mono tracking-tight">Skills</span>
        </Link>

        {/* Separator Divider */}
        <div className="w-[1px] h-5 bg-white/20" />

        {/* Instant Contact / Copy Email Item */}
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex flex-col items-center gap-0.5 p-1 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer focus:outline-none"
            aria-label={isId ? 'Salin Alamat Email' : 'Copy Email Address'}
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Mail className="w-5 h-5 text-[#E26D5C]" />
            )}
            <span className="text-[9px] font-mono tracking-tight">
              {copied ? (isId ? 'Disalin' : 'Copied') : 'Contact'}
            </span>
          </button>

          {/* Animated Floating Tooltip Feedback */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.85 }}
                animate={{ opacity: 1, y: -38, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="absolute whitespace-nowrap pointer-events-none px-2.5 py-1 rounded-full bg-emerald-500 text-black font-mono text-[10px] font-semibold shadow-lg"
              >
                {isId ? '✓ Email Disalin!' : '✓ Email Copied!'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  )
}
