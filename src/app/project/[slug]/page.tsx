import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectDetailView } from '@/components/project-detail-view'
import { fallbackProjects } from '@/lib/mock-data'
import type { Project } from '@/types/database'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let project: Project | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()

    if (data) {
      project = data as unknown as Project
    } else {
      project = fallbackProjects.find((p) => p.slug === slug && p.is_published) || null
    }
  } catch {
    project = fallbackProjects.find((p) => p.slug === slug && p.is_published) || null
  }

  if (!project || !project.is_published) {
    return {
      title: 'Proyek Tidak Ditemukan — Portofolio DKV',
    }
  }

  const titleStr =
    typeof project.title === 'object' && project.title !== null
      ? project.title.id || project.title.en || 'Project'
      : String(project.title)

  const descStr =
    typeof project.description === 'object' && project.description !== null
      ? project.description.id || project.description.en || ''
      : String(project.description)

  return {
    title: `${titleStr} — Portofolio DKV`,
    description: descStr,
    openGraph: {
      title: `${titleStr} — Portofolio DKV`,
      description: descStr,
      images: project.cover_image_url ? [{ url: project.cover_image_url }] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  let project: Project | null = null
  let otherProjects: Project[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()

    if (data) {
      project = data as unknown as Project
    } else {
      project = fallbackProjects.find((p) => p.slug === slug && p.is_published) || null
    }

    // Fetch other projects for footer navigation
    const { data: others } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .neq('slug', slug)
      .limit(3)

    if (others && others.length > 0) {
      otherProjects = others as unknown as Project[]
    } else {
      otherProjects = fallbackProjects.filter((p) => p.slug !== slug && p.is_published)
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && (error as { digest: string }).digest === 'DYNAMIC_SERVER_USAGE') {
      throw error
    }
    project = fallbackProjects.find((p) => p.slug === slug && p.is_published) || null
    otherProjects = fallbackProjects.filter((p) => p.slug !== slug && p.is_published)
  }

  if (!project || !project.is_published) {
    notFound()
  }

  return <ProjectDetailView project={project} otherProjects={otherProjects} />
}

