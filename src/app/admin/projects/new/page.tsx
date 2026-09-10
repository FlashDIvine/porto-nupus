import React from 'react'
import { ProjectForm } from '@/components/admin/project-form'

export const dynamic = 'force-dynamic'

export default function NewProjectPage() {
  return <ProjectForm isEdit={false} />
}
