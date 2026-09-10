'use client'

import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

export default function NotFound() {
  const { isId } = useLanguage()

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-[#161616] border border-white/10 flex items-center justify-center text-[#D4FF00] mb-6 shadow-xl">
        <Compass className="w-8 h-8 opacity-80" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF00] mb-2">
        Error 404
      </span>

      <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-white tracking-tight max-w-md break-words">
        {isId ? 'Halaman / Proyek Tidak Ditemukan' : 'Page / Project Not Found'}
      </h1>

      <p className="mt-4 text-sm sm:text-base text-white/60 max-w-md font-body">
        {isId
          ? 'Karya atau tautan yang Anda cari mungkin telah dipindahkan, diganti nama, atau belum dipublikasikan.'
          : 'The artwork or link you are looking for may have been moved, renamed, or is not yet published.'}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D4FF00] text-[#0a0a0a] font-semibold text-xs uppercase tracking-wider hover:bg-[#bce300] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isId ? 'Kembali ke Beranda' : 'Back to Home'}</span>
        </Link>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/5 text-xs font-mono transition-all"
        >
          {isId ? 'Jelajahi Galeri' : 'Explore Gallery'}
        </Link>
      </div>
    </div>
  )
}

