import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { HomePageView } from '@/components/home-page-view'
import { fallbackProjects, fallbackProfile } from '@/lib/mock-data'
import type { Project, Profile } from '@/types/database'

export const revalidate = 60 // Revalidate cache every 60 seconds

export default async function HomePage() {
  let projects: Project[] = []
  let profile: Profile = fallbackProfile

  try {
    const supabase = await createClient()

    // 1. Fetch published projects ordered by display_order
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (!projectError && projectData && projectData.length > 0) {
      const rawProjects = (projectData as unknown as Project[]).filter((p) => p.is_published)
      projects = rawProjects.map((p) => {
        const fallback = fallbackProjects.find((f) => f.slug === p.slug || f.id === p.id)
        return {
          ...p,
          demo_url: p.demo_url ?? fallback?.demo_url ?? `https://${p.slug}.vercel.app`,
          github_url: p.github_url ?? fallback?.github_url ?? `https://github.com/najib/${p.slug}`,
          impact_chips:
            p.impact_chips && p.impact_chips.length > 0
              ? p.impact_chips
              : fallback?.impact_chips ?? ['High Impact', 'Editorial Standard', '2026 Archive'],
          metrics:
            p.metrics && Array.isArray(p.metrics) && p.metrics.length > 0
              ? p.metrics
              : fallback?.metrics ?? [],
          challenges:
            p.challenges && Array.isArray(p.challenges) && p.challenges.length > 0
              ? p.challenges
              : fallback?.challenges ?? [],
        }
      })
    } else {
      projects = fallbackProjects.filter((p) => p.is_published)
    }

    // 2. Fetch profile data for hero presentation
    const { data: profileData } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (profileData) {
      profile = profileData as unknown as Profile
    } else {
      profile = fallbackProfile
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
    console.error('Error loading projects on HomePage:', error)
    projects = fallbackProjects.filter((p) => p.is_published)
    profile = fallbackProfile
  }

  return <HomePageView projects={projects} profile={profile} />
}

