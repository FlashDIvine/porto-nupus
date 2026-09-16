'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Upload,
  X,
  Star,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Tag,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { revalidatePortfolio } from '@/app/actions/revalidate'
import type { Project, ProjectImage } from '@/types/database'

const CATEGORIES = [
  'Branding & Identity',
  'Editorial & Print',
  'Typography',
  'UI/UX & Digital',
  'Packaging',
  'Motion Graphics',
  'Other',
]

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface ProjectFormProps {
  initialData?: Project | null
  isEdit?: boolean
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [titleId, setTitleId] = useState(initialData?.title?.id || '')
  const [titleEn, setTitleEn] = useState(initialData?.title?.en || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialData?.slug))
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0])
  const [customCategory, setCustomCategory] = useState('')
  const [descId, setDescId] = useState(initialData?.description?.id || '')
  const [descEn, setDescEn] = useState(initialData?.description?.en || '')
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order ?? 0)
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.is_published ?? false)

  // Tools tag state
  const [tools, setTools] = useState<string[]>(initialData?.tools_used || [])
  const [toolInput, setToolInput] = useState('')

  // Images state
  const [images, setImages] = useState<ProjectImage[]>(
    Array.isArray(initialData?.images) ? (initialData.images as ProjectImage[]) : []
  )
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    initialData?.cover_image_url ||
      (Array.isArray(initialData?.images) && (initialData.images as ProjectImage[])[0]?.url) ||
      ''
  )

  // UI status
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Field-specific validation errors for inline feedback and auto-focus
  const [fieldErrors, setFieldErrors] = useState<{
    titleId?: string
    titleEn?: string
    slug?: string
    descId?: string
    descEn?: string
    images?: string
  }>({})

  // Auto-generate slug when Title (ID) changes if not manually set
  const handleTitleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitleId(val)
    if (!isSlugManual) {
      setSlug(slugify(val))
    }
    if (fieldErrors.titleId) {
      setFieldErrors((prev) => ({ ...prev, titleId: undefined }))
    }
    if (fieldErrors.slug) {
      setFieldErrors((prev) => ({ ...prev, slug: undefined }))
    }
  }

  const handleRegenerateSlug = () => {
    if (titleId) {
      setSlug(slugify(titleId))
      setIsSlugManual(true)
      if (fieldErrors.slug) {
        setFieldErrors((prev) => ({ ...prev, slug: undefined }))
      }
    }
  }

  // Tag input handlers
  const handleAddTool = () => {
    const trimmed = toolInput.trim()
    if (trimmed && !tools.includes(trimmed)) {
      setTools([...tools, trimmed])
      setToolInput('')
    }
  }

  const handleRemoveTool = (toolToRemove: string) => {
    setTools(tools.filter((t) => t !== toolToRemove))
  }

  const handleToolKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTool()
    }
  }

  // Multi-image upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setErrorMessage(null)

    // Check limit
    if (images.length + files.length > 15) {
      setErrorMessage(`Maksimal 15 gambar per proyek. Saat ini sudah ada ${images.length} gambar.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setIsUploading(true)
    const newImages: ProjectImage[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgressText(`Mengunggah gambar ${i + 1} dari ${files.length}: ${file.name}...`)

        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || `Gagal mengunggah ${file.name}`)
        }

        const uploadedItem: ProjectImage = {
          url: data.url,
          caption: { id: '', en: '' },
          order: images.length + newImages.length + 1,
          is_highlight: false,
        }

        newImages.push(uploadedItem)
      }

      const updated = [...images, ...newImages]
      setImages(updated)

      // If no cover is set yet, default to first uploaded image
      if (!coverImageUrl && updated.length > 0) {
        setCoverImageUrl(updated[0].url)
      }

      if (fieldErrors.images) {
        setFieldErrors((prev) => ({ ...prev, images: undefined }))
      }

      setSuccessMessage(`${newImages.length} gambar berhasil diunggah!`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah gambar'
      )
    } finally {
      setIsUploading(false)
      setUploadProgressText(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Image actions: Delete, Reorder, Cover, Highlight, Caption
  const handleDeleteImage = (indexToRemove: number) => {
    const removed = images[indexToRemove]
    const updated = images.filter((_, idx) => idx !== indexToRemove)
    setImages(updated)

    // If removed was cover, fallback to first image or empty
    if (removed.url === coverImageUrl) {
      setCoverImageUrl(updated.length > 0 ? updated[0].url : '')
    }

    if (fieldErrors.images) {
      setFieldErrors((prev) => ({ ...prev, images: undefined }))
    }
  }

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return
    const updated = [...images]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    // Update order sequence
    const reordered = updated.map((img, idx) => ({ ...img, order: idx + 1 }))
    setImages(reordered)
  }

  const handleToggleHighlight = (index: number) => {
    const updated = images.map((img, idx) => {
      if (idx === index) {
        return { ...img, is_highlight: !img.is_highlight }
      }
      return img
    })
    setImages(updated)
  }

  const handleUpdateCaption = (index: number, lang: 'id' | 'en', text: string) => {
    const updated = images.map((img, idx) => {
      if (idx === index) {
        const currentCap =
          typeof img.caption === 'object' && img.caption !== null
            ? img.caption
            : { id: '', en: '' }
        return {
          ...img,
          caption: {
            ...currentCap,
            [lang]: text,
          },
        }
      }
      return img
    })
    setImages(updated)
  }

  // Submission handler
  const handleSubmit = async (targetPublishState?: boolean) => {
    setErrorMessage(null)
    setSuccessMessage(null)

    const publishState = targetPublishState !== undefined ? targetPublishState : isPublished
    const finalCategory = category === 'Other' && customCategory ? customCategory : category

    // Validation rules
    const newErrors: {
      titleId?: string
      titleEn?: string
      slug?: string
      descId?: string
      descEn?: string
      images?: string
    } = {}
    const errors: string[] = []

    if (!titleId.trim()) {
      newErrors.titleId = 'Judul (Bahasa Indonesia) wajib diisi.'
      errors.push('Judul (Bahasa Indonesia) wajib diisi.')
    }

    if (publishState && !titleEn.trim()) {
      newErrors.titleEn = 'Untuk publikasi, Judul (English) wajib diisi.'
      errors.push('Untuk publikasi, Judul (English) wajib diisi.')
    }

    if (!slug.trim()) {
      newErrors.slug = 'Slug URL unik wajib diisi.'
      errors.push('Slug URL unik wajib diisi.')
    }

    if (publishState && !descId.trim()) {
      newErrors.descId = 'Untuk publikasi, Deskripsi (Bahasa Indonesia) wajib diisi.'
      errors.push('Untuk publikasi, Deskripsi (Bahasa Indonesia) wajib diisi.')
    }

    if (publishState && !descEn.trim()) {
      newErrors.descEn = 'Untuk publikasi, Deskripsi (English) wajib diisi.'
      errors.push('Untuk publikasi, Deskripsi (English) wajib diisi.')
    }

    if (images.length === 0) {
      newErrors.images = 'Minimal 1 gambar harus di-upload dan dipilih sebagai Cover.'
      errors.push('Minimal 1 gambar harus di-upload dan dipilih sebagai Cover.')
    } else if (!coverImageUrl) {
      newErrors.images = 'Pilih salah satu gambar sebagai Sampul Utama (Cover).'
      errors.push('Minimal 1 gambar harus dipilih sebagai Cover.')
    } else if (images.length > 15) {
      newErrors.images = `Maksimal 15 gambar per proyek diperbolehkan (saat ini ${images.length} gambar).`
      errors.push(`Maksimal 15 gambar per proyek diperbolehkan.`)
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      setErrorMessage(errors.join(' • '))

      // Field priority order for auto-scroll and focus
      const fieldPriority: Array<{ key: keyof typeof newErrors; id: string }> = [
        { key: 'titleId', id: 'field-title-id' },
        { key: 'titleEn', id: 'field-title-en' },
        { key: 'slug', id: 'field-slug' },
        { key: 'descId', id: 'field-desc-id' },
        { key: 'descEn', id: 'field-desc-en' },
        { key: 'images', id: 'section-images' },
      ]

      const firstErr = fieldPriority.find((item) => newErrors[item.key])
      if (firstErr) {
        const el = document.getElementById(firstErr.id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setTimeout(() => {
            el.focus?.()
          }, 150)
        }
      }

      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const projectPayload = {
        slug: slug.trim().toLowerCase(),
        title: {
          id: titleId.trim(),
          en: titleEn.trim() || titleId.trim(),
        },
        description: {
          id: descId.trim(),
          en: descEn.trim() || descId.trim(),
        },
        category: finalCategory,
        cover_image_url: coverImageUrl,
        images: images,
        tools_used: tools,
        is_published: publishState,
        display_order: Number(displayOrder) || 0,
        updated_at: new Date().toISOString(),
      }

      if (isEdit && initialData?.id) {
        // UPDATE
        const { error } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', initialData.id)

        if (error) {
          if (error.code === '23505') {
            throw new Error(`Slug "${slug}" sudah digunakan oleh proyek lain. Gunakan slug yang berbeda.`)
          }
          throw new Error(error.message)
        }

        setSuccessMessage('Proyek berhasil diperbarui!')
      } else {
        // INSERT
        const { error } = await supabase.from('projects').insert([projectPayload])

        if (error) {
          if (error.code === '23505') {
            throw new Error(`Slug "${slug}" sudah digunakan oleh proyek lain. Gunakan slug yang berbeda.`)
          }
          throw new Error(error.message)
        }

        setSuccessMessage('Proyek baru berhasil disimpan!')
      }

      // Revalidate public caches for instant reflection
      await revalidatePortfolio(projectPayload.slug)

      setTimeout(() => {
        router.push('/admin')
        router.refresh()
      }, 1000)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan proyek.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E2D8]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] text-[#6B6661] hover:text-[#181716] hover:border-[#181716]/30 transition-colors shadow-2xs"
            title="Kembali ke Dashboard Admin"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#E26D5C]">
              {isEdit ? 'Mode Edit Proyek' : 'Tambah Proyek Baru'}
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#181716] tracking-tight mt-0.5 leading-[1.1]">
              {isEdit ? initialData?.title?.id || 'Edit Proyek' : 'Buat Karya Baru'}
            </h1>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] text-[#181716] hover:bg-[#F2EFE9] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 shadow-2xs"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting || isUploading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] font-semibold text-xs uppercase font-mono tracking-wider transition-all disabled:opacity-50 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{isEdit ? 'Simpan Perubahan' : 'Publikasikan'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#D8E2DC]/60 border border-[#E6E2D8] text-[#181716] text-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#181716]" />
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Section 1: Detail Bahasa & Konten Utama */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E6E2D8] space-y-6 shadow-xs">
          <div className="border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#E26D5C]" />
              <h2 className="text-base font-medium text-[#181716]">Informasi &amp; Deskripsi Proyek</h2>
            </div>
            <p className="text-xs text-[#6B6661] mt-1 font-body">
              Isi judul dan narasi proyek dalam Bahasa Indonesia dan Bahasa Inggris secara langsung tanpa perlu berpindah tab.
            </p>
          </div>

          {/* Bilingual Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title ID */}
            <div className="space-y-2">
              <label
                htmlFor="field-title-id"
                className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#181716]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#D8E2DC] text-[10px] font-bold text-[#181716]">
                    ID
                  </span>
                  <span>Judul Proyek (Indonesia)</span>
                </span>
                <span className="text-[#E26D5C] font-bold">*</span>
              </label>
              <input
                id="field-title-id"
                type="text"
                value={titleId}
                onChange={handleTitleIdChange}
                placeholder="Contoh: Identitas Visual Lumina Coffee"
                className={`w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border text-[#181716] placeholder:text-[#6B6661]/50 focus:outline-none transition-all text-sm ${
                  fieldErrors.titleId
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-[#E6E2D8] focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC]'
                }`}
              />
              {fieldErrors.titleId && (
                <p className="text-xs text-red-600 font-mono animate-in fade-in duration-200">
                  {fieldErrors.titleId}
                </p>
              )}
            </div>

            {/* Title EN */}
            <div className="space-y-2">
              <label
                htmlFor="field-title-en"
                className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#181716]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#F2EFE9] text-[10px] font-bold text-[#6B6661]">
                    EN
                  </span>
                  <span>Project Title (English)</span>
                </span>
                <span className="text-[#6B6661] text-[11px] font-normal lowercase">
                  (wajib dipublikasikan)
                </span>
              </label>
              <input
                id="field-title-en"
                type="text"
                value={titleEn}
                onChange={(e) => {
                  setTitleEn(e.target.value)
                  if (fieldErrors.titleEn) {
                    setFieldErrors((prev) => ({ ...prev, titleEn: undefined }))
                  }
                }}
                placeholder="Example: Lumina Coffee Visual Identity & Packaging"
                className={`w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border text-[#181716] placeholder:text-[#6B6661]/50 focus:outline-none transition-all text-sm ${
                  fieldErrors.titleEn
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-[#E6E2D8] focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC]'
                }`}
              />
              {fieldErrors.titleEn && (
                <p className="text-xs text-red-600 font-mono animate-in fade-in duration-200">
                  {fieldErrors.titleEn}
                </p>
              )}
            </div>
          </div>

          {/* Slug URL Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="field-slug"
                className="block text-xs font-mono uppercase tracking-wider text-[#181716]"
              >
                Slug URL <span className="text-[#E26D5C]">*</span>
              </label>
              <button
                type="button"
                onClick={handleRegenerateSlug}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#2B50EC] hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Auto-generate dari Judul
              </button>
            </div>
            <div
              className={`flex rounded-xl bg-[#FAF8F5] border overflow-hidden transition-all ${
                fieldErrors.slug
                  ? 'border-red-500/80 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
                  : 'border-[#E6E2D8] focus-within:border-[#2B50EC]'
              }`}
            >
              <span className="px-3 py-3 text-xs font-mono text-[#6B6661] bg-[#F2EFE9] border-r border-[#E6E2D8] select-none">
                /project/
              </span>
              <input
                id="field-slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value))
                  setIsSlugManual(true)
                  if (fieldErrors.slug) {
                    setFieldErrors((prev) => ({ ...prev, slug: undefined }))
                  }
                }}
                placeholder="lumina-coffee-visual-identity"
                className="w-full px-4 py-3 bg-transparent text-[#181716] font-mono text-sm placeholder:text-[#6B6661]/50 focus:outline-none"
              />
            </div>
            {fieldErrors.slug ? (
              <p className="text-xs text-red-600 font-mono animate-in fade-in duration-200">
                {fieldErrors.slug}
              </p>
            ) : (
              <p className="text-[11px] text-[#6B6661] font-mono">
                Identifier unik halaman detail karya (huruf kecil, angka, dan tanda hubung).
              </p>
            )}
          </div>

          {/* Bilingual Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description ID */}
            <div className="space-y-2">
              <label
                htmlFor="field-desc-id"
                className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#181716]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#D8E2DC] text-[10px] font-bold text-[#181716]">
                    ID
                  </span>
                  <span>Deskripsi Narasi (Indonesia)</span>
                </span>
                <span className="text-[#6B6661] text-[11px] font-normal lowercase">
                  (wajib dipublikasikan)
                </span>
              </label>
              <textarea
                id="field-desc-id"
                rows={6}
                value={descId}
                onChange={(e) => {
                  setDescId(e.target.value)
                  if (fieldErrors.descId) {
                    setFieldErrors((prev) => ({ ...prev, descId: undefined }))
                  }
                }}
                placeholder="Tuliskan latar belakang konsep, riset visual, filosofi perancangan, dan hasil akhir proyek ini..."
                className={`w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border text-[#181716] placeholder:text-[#6B6661]/50 focus:outline-none transition-all text-sm leading-relaxed ${
                  fieldErrors.descId
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-[#E6E2D8] focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC]'
                }`}
              />
              {fieldErrors.descId && (
                <p className="text-xs text-red-600 font-mono animate-in fade-in duration-200">
                  {fieldErrors.descId}
                </p>
              )}
            </div>

            {/* Description EN */}
            <div className="space-y-2">
              <label
                htmlFor="field-desc-en"
                className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#181716]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#F2EFE9] text-[10px] font-bold text-[#6B6661]">
                    EN
                  </span>
                  <span>Project Narrative (English)</span>
                </span>
                <span className="text-[#6B6661] text-[11px] font-normal lowercase">
                  (wajib dipublikasikan)
                </span>
              </label>
              <textarea
                id="field-desc-en"
                rows={6}
                value={descEn}
                onChange={(e) => {
                  setDescEn(e.target.value)
                  if (fieldErrors.descEn) {
                    setFieldErrors((prev) => ({ ...prev, descEn: undefined }))
                  }
                }}
                placeholder="Write the concept context, typography exploration, and design outcomes in English..."
                className={`w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border text-[#181716] placeholder:text-[#6B6661]/50 focus:outline-none transition-all text-sm leading-relaxed ${
                  fieldErrors.descEn
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-[#E6E2D8] focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC]'
                }`}
              />
              {fieldErrors.descEn && (
                <p className="text-xs text-red-400 font-mono animate-in fade-in duration-200">
                  {fieldErrors.descEn}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Metadata & Kategori */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E6E2D8] space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-[#E6E2D8] pb-4">
            <Tag className="w-5 h-5 text-[#E26D5C]" />
            <h2 className="text-base font-medium text-[#181716]">Klasifikasi & Alat yang Digunakan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
                Kategori Desain <span className="text-[#E26D5C] font-bold">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC] focus:outline-none transition-all text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#FFFFFF] text-[#181716]">
                    {cat}
                  </option>
                ))}
              </select>

              {category === 'Other' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Ketik kategori kustom..."
                  className="w-full mt-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] text-sm focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC] focus:outline-none"
                />
              )}
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
                Urutan Tampil (Display Order)
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC] focus:outline-none transition-all text-sm font-mono"
              />
              <p className="text-[11px] text-[#6B6661] font-mono">
                Angka lebih kecil tampil lebih awal di grid portfolio.
              </p>
            </div>
          </div>

          {/* Tools Used (Tag Input) */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
              Tools & Software yang Digunakan (Tekan Enter atau Koma)
            </label>

            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus-within:border-[#2B50EC]">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D8E2DC]/60 text-[#181716] text-xs font-mono border border-[#E6E2D8]"
                >
                  <span>{tool}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(tool)}
                    className="text-[#6B6661] hover:text-[#181716] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyDown={handleToolKeyDown}
                onBlur={handleAddTool}
                placeholder={tools.length === 0 ? 'Ketik nama tool (misal: Illustrator, Figma, Glyphs)...' : ''}
                className="flex-1 min-w-[140px] bg-transparent text-sm text-[#181716] placeholder:text-[#6B6661]/50 focus:outline-none px-1 py-0.5"
              />
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
            <div>
              <p className="text-sm font-medium text-[#181716]">Status Publikasi</p>
              <p className="text-xs text-[#6B6661]">
                Jika diaktifkan, proyek akan langsung dapat dilihat oleh publik di halaman utama.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPublished}
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPublished ? 'bg-[#181716]' : 'bg-[#E6E2D8]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#FAF8F5] shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isPublished ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 3: Manajemen Gambar Galeri & Cover */}
        <div
          id="section-images"
          className={`p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border space-y-6 transition-all shadow-xs ${
            fieldErrors.images
              ? 'border-red-500/80 ring-1 ring-red-500/30'
              : 'border-[#E6E2D8]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E2D8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E26D5C]" />
                <h2 className="text-base font-medium text-[#181716]">Galeri Gambar & Sampul (Cover)</h2>
              </div>
              <p className="text-xs text-[#6B6661] mt-1">
                Unggah hingga 15 gambar berkualitas tinggi (JPG, PNG, WebP). Sharp akan otomatis mengompresi ke WebP maks 2560px.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || images.length >= 15}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#181716] text-[#181716] text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#181716]" />
              ) : (
                <Upload className="w-4 h-4 text-[#181716]" />
              )}
              <span>Unggah Gambar ({images.length}/15)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Image error alert */}
          {fieldErrors.images && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-mono animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{fieldErrors.images}</span>
            </div>
          )}

          {/* Upload Progress Status */}
          {uploadProgressText && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E26D5C]/40 text-xs font-mono text-[#E26D5C] animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{uploadProgressText}</span>
            </div>
          )}

          {/* Image List / Grid */}
          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`py-12 border-2 border-dashed rounded-2xl bg-[#FAF8F5] flex flex-col items-center justify-center cursor-pointer transition-colors p-6 text-center space-y-3 ${
                fieldErrors.images
                  ? 'border-red-500/60 hover:border-red-500'
                  : 'border-[#E6E2D8] hover:border-[#6B6661]'
              }`}
            >
              <div className="p-4 rounded-full bg-[#FFFFFF] border border-[#E6E2D8] text-[#6B6661] shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[#181716]">
                Klik untuk memilih dan mengunggah gambar proyek
              </p>
              <p className="text-xs text-[#6B6661] font-mono">
                Format: JPEG, PNG, WebP • Maksimum 25MB per file • Maks 15 gambar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {images.map((img, index) => {
                const isCover = img.url === coverImageUrl
                const capObj =
                  typeof img.caption === 'object' && img.caption !== null
                    ? (img.caption as { id?: string; en?: string })
                    : { id: typeof img.caption === 'string' ? img.caption : '', en: '' }

                return (
                  <div
                    key={img.url + index}
                    className={`p-4 rounded-xl border transition-all ${
                      isCover
                        ? 'bg-[#FAF8F5] border-[#E26D5C]/60 ring-1 ring-[#E26D5C]/20'
                        : 'bg-[#FAF8F5] border-[#E6E2D8] hover:border-[#6B6661]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      {/* Image Thumbnail Preview */}
                      <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-[#F2EFE9] border border-[#E6E2D8]">
                        <Image
                          src={img.url}
                          alt={`Project image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                        {isCover && (
                          <div className="absolute top-1 left-1 bg-[#E26D5C] text-[#FAF8F5] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                            COVER
                          </div>
                        )}
                      </div>

                      {/* Captions & Info */}
                      <div className="flex-1 space-y-2 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={capObj.id || ''}
                            onChange={(e) => handleUpdateCaption(index, 'id', e.target.value)}
                            placeholder="Caption gambar (Indonesia)..."
                            className="w-full px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E6E2D8] text-xs text-[#181716] placeholder:text-[#6B6661]/50 focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={capObj.en || ''}
                            onChange={(e) => handleUpdateCaption(index, 'en', e.target.value)}
                            placeholder="Caption gambar (English)..."
                            className="w-full px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E6E2D8] text-xs text-[#181716] placeholder:text-[#6B6661]/50 focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC] focus:outline-none"
                          />
                        </div>

                        {/* Badges & Options */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImageUrl(img.url)
                              if (fieldErrors.images) {
                                setFieldErrors((prev) => ({ ...prev, images: undefined }))
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                              isCover
                                ? 'bg-[#E26D5C] text-[#FAF8F5] font-semibold'
                                : 'bg-[#FFFFFF] text-[#6B6661] hover:text-[#181716] border border-[#E6E2D8]'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isCover ? 'fill-current' : ''}`} />
                            <span>{isCover ? 'Sampul Utama' : 'Jadikan Cover'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleHighlight(index)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                              img.is_highlight
                                ? 'bg-[#D8E2DC] text-[#181716] font-semibold border border-[#E6E2D8]'
                                : 'bg-[#FFFFFF] text-[#6B6661] hover:text-[#181716] border border-[#E6E2D8]'
                            }`}
                            title="Tampilkan di kurasi gambar pilihan halaman /gallery"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#E26D5C]" />
                            <span>Highlight Galeri: {img.is_highlight ? 'Ya' : 'Tidak'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Reorder and Delete Actions */}
                      <div className="flex md:flex-col items-center gap-1 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, index - 1)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-[#FFFFFF] text-[#6B6661] hover:text-[#181716] hover:bg-[#F2EFE9] border border-[#E6E2D8] disabled:opacity-30 transition-colors shadow-2xs"
                          title="Pindah ke Atas"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, index + 1)}
                          disabled={index === images.length - 1}
                          className="p-1.5 rounded-lg bg-[#FFFFFF] text-[#6B6661] hover:text-[#181716] hover:bg-[#F2EFE9] border border-[#E6E2D8] disabled:opacity-30 transition-colors shadow-2xs"
                          title="Pindah ke Bawah"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          className="p-1.5 rounded-lg bg-[#FFFFFF] text-red-600 hover:bg-red-50 border border-[#E6E2D8] transition-colors shadow-2xs"
                          title="Hapus Gambar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sticky/Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E6E2D8]">
          <Link
            href="/admin"
            className="text-xs font-mono text-[#6B6661] hover:text-[#181716] transition-colors"
          >
            ← Batal & Kembali
          </Link>

          <div className="flex items-center gap-3">
            {isEdit ? (
              <button
                type="button"
                onClick={() => handleSubmit(isPublished)}
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] font-semibold text-xs uppercase font-mono tracking-wider transition-all disabled:opacity-50 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] hover:bg-[#F2EFE9] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 shadow-2xs"
                >
                  Simpan Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting || isUploading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] font-semibold text-xs uppercase font-mono tracking-wider transition-all disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Publikasikan Proyek</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
