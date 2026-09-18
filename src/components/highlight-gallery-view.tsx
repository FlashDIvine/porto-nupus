'use client'

import React from 'react'
import { GalleryView } from '@/components/gallery/GalleryView'
import type { HighlightItem } from '@/types/gallery'

export type { HighlightItem }

export interface HighlightGalleryViewProps {
  highlights: HighlightItem[]
}

export function HighlightGalleryView({ highlights }: HighlightGalleryViewProps) {
  return <GalleryView highlights={highlights} />
}

export default HighlightGalleryView
