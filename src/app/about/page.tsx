import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AboutPageView } from '@/components/about-page-view'
import { fallbackProfile } from '@/lib/mock-data'
import type { Profile } from '@/types/database'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  let profile: Profile = fallbackProfile

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profile')
      .select('name, tagline')
      .limit(1)
      .maybeSingle()

    if (data) {
      profile = data as unknown as Profile
    }
  } catch {
    profile = fallbackProfile
  }

  const nameStr = profile.name || 'Najib Visual Studio'
  const taglineStr =
    typeof profile.tagline === 'object' && profile.tagline !== null
      ? profile.tagline.id || profile.tagline.en || ''
      : String(profile.tagline)

  return {
    title: `${nameStr} — Portfolio`,
    description: taglineStr,
    openGraph: {
      title: `${nameStr} — Portfolio`,
      description: taglineStr,
    },
  }
}

export default async function AboutPage() {
  let profile: Profile = fallbackProfile

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (data) {
      profile = data as unknown as Profile
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && (error as { digest: string }).digest === 'DYNAMIC_SERVER_USAGE') {
      throw error
    }
    console.error('Error loading profile on AboutPage:', error)
    profile = fallbackProfile
  }

  return <AboutPageView profile={profile} />
}
