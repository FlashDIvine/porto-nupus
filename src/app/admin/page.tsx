import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { AdminProjectList } from '@/components/admin/admin-project-list'
import { fallbackProjects } from '@/lib/mock-data'
import type { Project } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  let projects: Project[] = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      projects = data as unknown as Project[]
    } else {
      projects = fallbackProjects
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
    console.error('Error fetching admin projects:', error)
    projects = fallbackProjects
  }

  return <AdminProjectList initialProjects={projects} />
}
