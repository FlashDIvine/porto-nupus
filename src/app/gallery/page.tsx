import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { HighlightGalleryView, type HighlightItem } from '@/components/highlight-gallery-view'
import { fallbackProjects } from '@/lib/mock-data'
import type { Project, ProjectImage } from '@/types/database'

export const metadata: Metadata = {
  title: 'Galeri Karya Pilihan — Portofolio DKV',
  description: 'Koleksi kurasi visual, tipografi, dan artefak desain dari seluruh proyek.',
}

export const revalidate = 60

export default async function GalleryPage() {
  let allProjects: Project[] = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)

    if (!error && data && data.length > 0) {
      allProjects = (data as unknown as Project[]).filter((p) => p.is_published)
    } else {
      allProjects = fallbackProjects.filter((p) => p.is_published)
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && (error as { digest: string }).digest === 'DYNAMIC_SERVER_USAGE') {
      throw error
    }
    console.error('Error fetching projects for gallery:', error)
    allProjects = fallbackProjects.filter((p) => p.is_published)
  }

  // Flatten all images[] from all projects and filter where is_highlight = true
  const highlights: HighlightItem[] = []

  for (const proj of allProjects) {
    if (!proj.is_published) continue
    if (Array.isArray(proj.images)) {
      const imgArray = proj.images as unknown as ProjectImage[]
      for (const img of imgArray) {
        if (img && img.is_highlight === true && img.url) {
          highlights.push({
            projectSlug: proj.slug,
            projectTitle: proj.title,
            category: proj.category,
            image: img,
            highlightOrder: typeof img.highlight_order === 'number' ? img.highlight_order : 9999,
            createdAt: proj.created_at || '1970-01-01',
          })
        }
      }
    }
  }

  // Sort by highlight_order (ascending), fallback to project created_at if highlight_order is equal/null
  highlights.sort((a, b) => {
    if (a.highlightOrder !== b.highlightOrder) {
      return a.highlightOrder - b.highlightOrder
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return <HighlightGalleryView highlights={highlights} />
}
