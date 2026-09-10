import { NextResponse, type NextRequest } from 'next/server'
import sharp from 'sharp'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_RAW_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB

export async function POST(request: NextRequest) {
  try {
    // 1. Auth Validation: Check Supabase session from cookies
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi tidak valid atau belum login' },
        { status: 401 }
      )
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'Bad Request: Parameter "file" tidak ditemukan' },
        { status: 400 }
      )
    }

    // 3. Validate Mime Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Format file tidak didukung (${file.type}). Hanya diperbolehkan: image/jpeg, image/png, image/webp`,
        },
        { status: 400 }
      )
    }

    // 4. Validate Raw File Size (Max 25MB)
    if (file.size > MAX_RAW_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Ukuran file (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 25 MB`,
        },
        { status: 413 }
      )
    }

    // 5. Read File Buffer & Process with Sharp
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    // Resize: longest side max 2560px, maintain aspect ratio, withoutEnlargement: true
    const processedBuffer = await sharp(inputBuffer)
      .resize({
        width: 2560,
        height: 2560,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer()

    const processedMetadata = await sharp(processedBuffer).metadata()
    const width = processedMetadata.width || 0
    const height = processedMetadata.height || 0
    const size_kb = Math.round(processedBuffer.length / 1024)

    // 6. Upload to Supabase Storage "project-images" using Unique Filename
    const uniqueFilename = `${crypto.randomUUID()}.webp`
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Supabase URL or Key is missing' },
        { status: 500 }
      )
    }

    const adminClient = createSupabaseClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const { error: uploadError } = await adminClient.storage
      .from('project-images')
      .upload(uniqueFilename, processedBuffer, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError)
      return NextResponse.json(
        { error: `Gagal mengunggah ke penyimpanan: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // 7. Get Public URL
    const {
      data: { publicUrl },
    } = adminClient.storage.from('project-images').getPublicUrl(uniqueFilename)

    return NextResponse.json(
      {
        url: publicUrl,
        width,
        height,
        size_kb,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unhandled upload route error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Terjadi kesalahan saat memproses gambar: ${error.message}`
            : 'Terjadi kesalahan internal server saat memproses gambar',
      },
      { status: 500 }
    )
  }
}
