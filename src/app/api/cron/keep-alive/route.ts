import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 1. Optional Bearer Auth for Vercel Cron Secret (if configured)
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret) {
      const authHeader = request.headers.get('authorization')
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid or missing CRON_SECRET' },
          { status: 401 }
        )
      }
    }

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
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Supabase keep-alive ping successful',
        timestamp: new Date().toISOString(),
        profile_count: count,
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
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
