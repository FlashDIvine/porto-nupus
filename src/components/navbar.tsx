'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

export function Navbar() {
  const { setLanguage, isId } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: isId ? 'Beranda' : 'Home' },
    { href: '/gallery', label: isId ? 'Galeri' : 'Gallery' },
    { href: '/about', label: isId ? 'Tentang' : 'About' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Name */}
        <Link
          href="/"
          className="group flex items-center gap-1.5 focus:outline-none"
        >
          <span className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-white/90 transition-colors">
            Portofolio<span className="text-[#D4FF00]">.</span>
          </span>
          <span className="text-xs uppercase tracking-widest font-mono text-white/50 border border-white/10 px-1.5 py-0.5 rounded ml-1">
            DKV
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-[#D4FF00] transition-colors relative py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Language Toggle & Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center p-1 rounded-full bg-[#161616] border border-white/10">
            <button
              type="button"
              onClick={() => setLanguage('id')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                isId
                  ? 'bg-[#D4FF00] text-[#0a0a0a] shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              aria-label="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                !isId
                  ? 'bg-[#D4FF00] text-[#0a0a0a] shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              aria-label="English Language"
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          {/* Compact language switch for mobile header */}
          <button
            type="button"
            onClick={() => setLanguage(isId ? 'en' : 'id')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#161616] border border-white/10 text-white/80"
            aria-label="Toggle language"
          >
            <Globe className="w-3 h-3 text-[#D4FF00]" />
            <span>{isId ? 'ID' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#161616] border border-white/10 text-white/80 hover:text-white hover:border-white/30 focus:outline-none"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#D4FF00]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-4">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-white/80 hover:text-[#D4FF00] py-2 border-b border-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-white/50 uppercase tracking-wider font-mono">
                  {isId ? 'Bahasa / Language' : 'Language / Bahasa'}
                </span>
                <div className="flex items-center p-1 rounded-full bg-[#161616] border border-white/10">
                  <button
                    type="button"
                    onClick={() => setLanguage('id')}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                      isId
                        ? 'bg-[#D4FF00] text-[#0a0a0a]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                      !isId
                        ? 'bg-[#D4FF00] text-[#0a0a0a]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
