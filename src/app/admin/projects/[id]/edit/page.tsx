import React from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectForm } from '@/components/admin/project-form'
import { fallbackProjects } from '@/lib/mock-data'
import type { Project } from '@/types/database'

export const dynamic = 'force-dynamic'

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params

  let project: Project | null = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!error && data) {
      project = data as unknown as Project
    } else {
      project = fallbackProjects.find((p) => p.id === id) || null
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
    console.error('Error fetching project to edit:', error)
    project = fallbackProjects.find((p) => p.id === id) || null
  }

  if (!project) {
    notFound()
  }

  return <ProjectForm initialData={project} isEdit={true} />
}
