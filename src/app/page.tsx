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
      projects = (projectData as unknown as Project[]).filter((p) => p.is_published)
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

