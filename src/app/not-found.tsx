'use client'

import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

export default function NotFound() {
  const { isId } = useLanguage()

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#E6E2D8] flex items-center justify-center text-[#E26D5C] mb-6 shadow-sm">
        <Compass className="w-8 h-8 opacity-90" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-[#E26D5C] mb-2">
        Error 404
      </span>

      <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-[#181716] tracking-tight max-w-md leading-[1.05] break-words">
        {isId ? 'Halaman Tidak Ditemukan' : 'Page Not Found'}
      </h1>

      <p className="mt-4 text-sm sm:text-base text-[#6B6661] max-w-md font-body">
        {isId
          ? 'Karya atau tautan yang Anda cari mungkin telah dipindahkan, diganti nama, atau belum dipublikasikan.'
          : 'The artwork or link you are looking for may have been moved, renamed, or is not yet published.'}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#181716] text-[#FAF8F5] font-medium text-xs uppercase tracking-wider hover:bg-[#2B50EC] transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isId ? 'Kembali ke Beranda' : 'Back to Home'}</span>
        </Link>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E6E2D8] text-[#181716] hover:bg-[#F2EFE9] hover:border-[#181716]/40 text-xs font-mono transition-all shadow-2xs"
        >
          {isId ? 'Jelajahi Galeri' : 'Explore Gallery'}
        </Link>
      </div>
    </div>
  )
}

