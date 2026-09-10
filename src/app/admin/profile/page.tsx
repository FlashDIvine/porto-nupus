import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/admin/profile-form'
import { fallbackProfile } from '@/lib/mock-data'
import type { Profile } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
  let profile: Profile = fallbackProfile

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (!error && data) {
      profile = data as unknown as Profile
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
    console.error('Error fetching admin profile:', error)
  }

  return <ProfileForm initialProfile={profile} />
}
