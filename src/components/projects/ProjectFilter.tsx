'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Layers, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import { cn } from '@/lib/utils'

export interface ProjectFilterProps {
  categories: string[]
  activeCategory: string
  onSelectCategory: (category: string) => void
  categoryCounts?: Record<string, number>
  totalCount?: number
  className?: string
}

export function ProjectFilter({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts = {},
  totalCount = 0,
  className,
}: ProjectFilterProps) {
  const { isId } = useLanguage()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const allLabel = isId ? 'Semua Karya' : 'All Works'

  const handleSelect = (category: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    onSelectCategory(category)
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  return (
    <div
      className={cn(
        'sticky top-16 sm:top-20 z-30 w-full py-3 px-2 sm:px-4 backdrop-blur-xl bg-[#FAF8F5]/85 border-b border-[#E6E2D8]/80 transition-all duration-300 shadow-[0_4px_24px_rgba(24,23,22,0.03)]',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Filter Title Tag for Editorial Context (hidden on small mobile to save space) */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#6B6661] shrink-0 pr-2 border-r border-[#E6E2D8]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E26D5C]" />
          <span>{isId ? 'Filter Taksonomi' : 'Taxonomy Filter'}</span>
        </div>

        {/* Scrollable Pill Container */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="Filter kategori proyek"
          className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth py-1 w-full mask-edges"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* 'All' Filter Pill */}
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'All'}
            onClick={(e) => handleSelect('All', e)}
            className={cn(
              'relative shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer select-none active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B50EC]',
              activeCategory === 'All'
                ? 'text-white font-medium'
                : 'text-[#181716] bg-white/70 hover:bg-[#F2EFE9] border border-[#E6E2D8]/90'
            )}
          >
            {activeCategory === 'All' && (
              <motion.div
                layoutId="active-taxonomy-pill"
                className="absolute inset-0 rounded-full bg-[#181716] shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E26D5C]" />
              <span>{allLabel}</span>
              {totalCount > 0 && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full',
                    activeCategory === 'All'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E6E2D8] text-[#6B6661]'
                  )}
                >
                  {totalCount}
                </span>
              )}
            </span>
          </button>

          {/* Dynamic Category Filter Pills */}
          {categories.map((category) => {
            const isActive = activeCategory === category
            const count = categoryCounts[category] ?? 0

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={(e) => handleSelect(category, e)}
                className={cn(
                  'relative shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer select-none active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B50EC]',
                  isActive
                    ? 'text-white font-medium'
                    : 'text-[#181716] bg-white/70 hover:bg-[#F2EFE9] border border-[#E6E2D8]/90'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-taxonomy-pill"
                    className="absolute inset-0 rounded-full bg-[#181716] shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Layers
                    className={cn(
                      'w-3 h-3',
                      isActive ? 'text-[#D8E2DC]' : 'text-[#6B6661]'
                    )}
                  />
                  <span>{category}</span>
                  {count > 0 && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.2 rounded-full',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#E6E2D8] text-[#6B6661]'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
