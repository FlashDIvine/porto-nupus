'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

export function Navbar() {
  const { setLanguage, isId } = useLanguage()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navContainerRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { href: '/', label: isId ? 'Beranda' : 'Home' },
    { href: '/gallery', label: isId ? 'Galeri' : 'Gallery' },
    { href: '/about', label: isId ? 'Tentang' : 'About' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    if (href === '/gallery') {
      return pathname === '/gallery' || pathname.startsWith('/gallery/') || pathname.startsWith('/project/')
    }
    return pathname === href || pathname.startsWith(href + '/')
  }


  // Handle escape key and outside clicks for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Full-viewport mobile backdrop placed outside any backdrop-filter containing block */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-[#181716]/15 backdrop-blur-[2px] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header className="sticky top-6 z-50 mx-auto max-w-fit px-4 transition-all duration-300">
        <div
          ref={navContainerRef}
          className="relative flex items-center justify-between gap-5 sm:gap-7 px-4 sm:px-6 py-2.5 rounded-full backdrop-blur-md bg-white/80 border border-white/80 shadow-[0_4px_20px_rgba(24,23,22,0.04)]"
        >
          {/* Logo: Editorial serif wordmark "Portofolio." */}
          <Link
            href="/"
            className="group flex items-center focus:outline-none shrink-0"
          >
            <span className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-[#181716] group-hover:text-[#2B50EC] transition-colors">
              Portofolio<span className="text-[#E26D5C]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm ${
                    active
                      ? 'bg-[#E26D5C] text-white font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm'
                      : 'text-[#181716] hover:text-[#E26D5C] hover:bg-[#F2EFE9] active:bg-[#E26D5C] active:text-white px-3.5 py-1.5 rounded-full transition-colors active:scale-95'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Language Switcher */}
          <div className="hidden md:flex items-center shrink-0">
            <div
              className="relative flex items-center p-1 rounded-full bg-[#F2EFE9] border border-[#E6E2D8]"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => setLanguage('id')}
                aria-pressed={isId}
                className={`relative z-10 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none cursor-pointer select-none active:scale-95 ${
                  isId
                    ? 'text-white'
                    : 'text-[#6B6661] hover:text-[#181716]'
                }`}
                aria-label="Bahasa Indonesia"
              >
                {isId && (
                  <motion.div
                    layoutId="active-lang-pill-desktop"
                    className="absolute inset-0 rounded-full bg-[#E26D5C] shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">ID</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={!isId}
                className={`relative z-10 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none cursor-pointer select-none active:scale-95 ${
                  !isId
                    ? 'text-white'
                    : 'text-[#6B6661] hover:text-[#181716]'
                }`}
                aria-label="English Language"
              >
                {!isId && (
                  <motion.div
                    layoutId="active-lang-pill-desktop"
                    className="absolute inset-0 rounded-full bg-[#E26D5C] shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">EN</span>
              </button>
            </div>
          </div>

          {/* Mobile Actions: Animated language switch + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <div
              className="relative flex items-center p-0.5 rounded-full bg-[#F2EFE9] border border-[#E6E2D8]"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => setLanguage('id')}
                aria-pressed={isId}
                className={`relative z-10 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none cursor-pointer select-none active:scale-95 ${
                  isId
                    ? 'text-white'
                    : 'text-[#6B6661] hover:text-[#181716]'
                }`}
                aria-label="Bahasa Indonesia"
              >
                {isId && (
                  <motion.div
                    layoutId="active-lang-pill-mobile"
                    className="absolute inset-0 rounded-full bg-[#E26D5C] shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">ID</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={!isId}
                className={`relative z-10 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none cursor-pointer select-none active:scale-95 ${
                  !isId
                    ? 'text-white'
                    : 'text-[#6B6661] hover:text-[#181716]'
                }`}
                aria-label="English Language"
              >
                {!isId && (
                  <motion.div
                    layoutId="active-lang-pill-mobile"
                    className="absolute inset-0 rounded-full bg-[#E26D5C] shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">EN</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full bg-[#F2EFE9] border border-[#E6E2D8] text-[#181716] hover:text-[#E26D5C] focus:outline-none transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-[#E26D5C]" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile Dropdown Panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-nav-panel"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-3 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-xl md:hidden overflow-hidden z-50 min-w-[240px]"
              >
                <nav className="flex flex-col space-y-1.5">
                  {navLinks.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-sm text-center ${
                          active
                            ? 'bg-[#E26D5C] text-white font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm'
                            : 'text-[#181716] hover:text-[#E26D5C] hover:bg-[#F2EFE9] active:bg-[#E26D5C] active:text-white px-3.5 py-1.5 rounded-full transition-colors'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
}
