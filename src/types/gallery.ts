import type { I18nText, Json, ProjectImage } from '@/types/database'

export interface HighlightItem {
  projectSlug: string
  projectTitle: I18nText | { id?: string; en?: string } | Json
  projectDescription?: I18nText | { id?: string; en?: string } | Json
  category: string | null
  image: ProjectImage
  highlightOrder: number
  createdAt: string
  year?: string
  toolsUsed?: string[]
  width?: number
  height?: number
  aspectRatio?: string
}
