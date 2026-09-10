import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { fallbackProjects } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://najib-portfolio.vercel.app'

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // 2. Dynamic Published Projects
  let projectRoutes: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()
    const { data: projects, error } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('is_published', true)

    if (!error && projects && projects.length > 0) {
      projectRoutes = projects.map((p) => ({
        url: `${siteUrl}/project/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      }))
    } else {
      projectRoutes = fallbackProjects
        .filter((p) => p.is_published)
        .map((p) => ({
          url: `${siteUrl}/project/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.9,
        }))
    }
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      (error as { digest: string }).digest === 'DYNAMIC_SERVER_USAGE'
    ) {
      throw error
    }
    console.error('Error generating sitemap dynamic routes:', error)
    projectRoutes = fallbackProjects
      .filter((p) => p.is_published)
      .map((p) => ({
        url: `${siteUrl}/project/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      }))
  }

  return [...staticRoutes, ...projectRoutes]
}
