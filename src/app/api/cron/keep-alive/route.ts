import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const envStatus = {
    has_supabase_url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    has_anon_key: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    has_service_role_key: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    url_prefix: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 16) + '...'
      : null,
    anon_key_length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
  }

  // 1. Optional Bearer Auth for Vercel Cron Secret (if configured)
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing CRON_SECRET', envStatus },
        { status: 401 }
      )
    }
  }

  if (!envStatus.has_supabase_url || !envStatus.has_anon_key) {
    return NextResponse.json(
      {
        status: 'env_missing',
        message:
          'Variabel NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum terdeteksi di Vercel runtime. Pastikan sudah klik Redeploy di Vercel setelah menambahkan Environment Variables.',
        envStatus,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }

  try {
    // 2. Perform lightweight query to Supabase (HEAD count query)
    const supabase = await createClient()
    const { count, error } = await supabase
      .from('profile')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Supabase keep-alive ping failed:', error)
      return NextResponse.json(
        {
          status: 'error',
          message: `Query gagal: ${error.message}`,
          envStatus,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Supabase keep-alive ping successful! Database terhubung.',
        envStatus,
        profile_count: count,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Keep-alive cron route error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Internal server error during keep-alive ping',
        envStatus,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
