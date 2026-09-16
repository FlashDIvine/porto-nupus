'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Upload,
  X,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  User,
  FileText,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { revalidatePortfolio } from '@/app/actions/revalidate'
import type { Profile, ContactLink } from '@/types/database'

const COMMON_PLATFORMS = [
  'Instagram',
  'Behance',
  'Dribbble',
  'LinkedIn',
  'Email',
  'Website',
  'Twitter',
  'GitHub',
]

interface ProfileFormProps {
  initialProfile: Profile
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter()
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [name, setName] = useState(initialProfile.name || '')
  const [taglineId, setTaglineId] = useState(initialProfile.tagline?.id || '')
  const [taglineEn, setTaglineEn] = useState(initialProfile.tagline?.en || '')
  const [bioId, setBioId] = useState(initialProfile.bio?.id || '')
  const [bioEn, setBioEn] = useState(initialProfile.bio?.en || '')
  const [cvUrl, setCvUrl] = useState(initialProfile.cv_url || '')
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialProfile.photo_url || null)

  // Skills tag state
  const [skills, setSkills] = useState<string[]>(initialProfile.skills || [])
  const [skillInput, setSkillInput] = useState('')

  // Contact links state
  const [contactLinks, setContactLinks] = useState<ContactLink[]>(
    Array.isArray(initialProfile.contact_links)
      ? (initialProfile.contact_links as ContactLink[])
      : []
  )

  // UI state
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id')
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Skill tag handlers
  const handleAddSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  // Contact links handlers
  const handleAddContactLink = () => {
    setContactLinks([
      ...contactLinks,
      { platform: 'Instagram', url: '', label: '' },
    ])
  }

  const handleRemoveContactLink = (index: number) => {
    setContactLinks(contactLinks.filter((_, i) => i !== index))
  }

  const handleUpdateContactLink = (index: number, field: keyof ContactLink, value: string) => {
    const updated = [...contactLinks]
    updated[index] = { ...updated[index], [field]: value }
    setContactLinks(updated)
  }

  // Photo upload handler
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage(null)
    setIsUploadingPhoto(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah foto profil')
      }

      setPhotoUrl(data.url)
      setSuccessMessage('Foto profil berhasil diunggah! Jangan lupa simpan perubahan.')
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah foto profil'
      )
    } finally {
      setIsUploadingPhoto(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!name.trim()) {
      setErrorMessage('Nama profil tidak boleh kosong.')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const payload = {
        name: name.trim(),
        tagline: {
          id: taglineId.trim(),
          en: taglineEn.trim() || taglineId.trim(),
        },
        bio: {
          id: bioId.trim(),
          en: bioEn.trim() || bioId.trim(),
        },
        skills: skills,
        photo_url: photoUrl,
        cv_url: cvUrl.trim() || null,
        contact_links: contactLinks.filter((c) => c.url.trim() !== ''),
        updated_at: new Date().toISOString(),
      }

      // Check if profile row exists
      if (initialProfile.id && initialProfile.id !== 'default-profile') {
        const { error } = await supabase
          .from('profile')
          .update(payload)
          .eq('id', initialProfile.id)

        if (error) throw new Error(error.message)
      } else {
        // Fallback: check if any row exists in table, update first or insert
        const { data: existingRows } = await supabase.from('profile').select('id').limit(1)

        if (existingRows && existingRows.length > 0) {
          const { error } = await supabase
            .from('profile')
            .update(payload)
            .eq('id', existingRows[0].id)
          if (error) throw new Error(error.message)
        } else {
          const { error } = await supabase.from('profile').insert([payload])
          if (error) throw new Error(error.message)
        }
      }

      setSuccessMessage('Profil dan informasi About berhasil disimpan!')
      await revalidatePortfolio()
      router.refresh()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan profil'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E2D8]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] text-[#6B6661] hover:text-[#181716] hover:border-[#181716]/30 transition-colors shadow-2xs"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#E26D5C]">
              Pengaturan Profil
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#181716] tracking-tight mt-0.5 leading-[1.1]">
              Edit Profil &amp; Informasi Diri
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isUploadingPhoto}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] font-semibold text-xs uppercase font-mono tracking-wider transition-all disabled:opacity-50 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Simpan Profil</span>
          )}
        </button>
      </div>

      {/* Feedback Alerts */}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Foto Profil & Nama */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E6E2D8] space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-[#E6E2D8] pb-4">
            <User className="w-5 h-5 text-[#E26D5C]" />
            <h2 className="text-base font-medium text-[#181716]">Identitas &amp; Foto Portofolio</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Photo Avatar Preview */}
            <div className="relative group">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-[#E6E2D8] bg-[#F2EFE9]">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="Foto Profil"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6B6661]">
                    <User className="w-12 h-12" />
                  </div>
                )}

                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-[#181716]/70 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#FAF8F5]" />
                  </div>
                )}
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoFileChange}
                className="hidden"
              />
            </div>

            {/* Photo & Name Controls */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#181716] mb-2">
                  Nama Desainer / Studio <span className="text-[#E26D5C]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Muhammad Najib"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] placeholder:text-[#6B6661]/50 focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC] focus:outline-none transition-all text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#2B50EC] text-[#181716] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5 text-[#E26D5C]" />
                  <span>{photoUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
                </button>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] text-red-600 hover:bg-red-50 border border-red-200 text-xs font-mono transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#6B6661] font-mono">
                Foto akan otomatis dikompresi ke WebP maks 2560px. Format: JPG, PNG, WebP.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Bilingual Tagline & Bio */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E6E2D8] space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#E26D5C]" />
              <h2 className="text-base font-medium text-[#181716]">Tagline &amp; Biografi Diri</h2>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex items-center rounded-lg bg-[#FAF8F5] p-1 border border-[#E6E2D8]">
              <button
                type="button"
                onClick={() => setActiveLangTab('id')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeLangTab === 'id'
                    ? 'bg-[#181716] text-[#FAF8F5] font-semibold'
                    : 'text-[#6B6661] hover:text-[#181716]'
                }`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeLangTab === 'en'
                    ? 'bg-[#181716] text-[#FAF8F5] font-semibold'
                    : 'text-[#6B6661] hover:text-[#181716]'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Tagline */}
          {activeLangTab === 'id' ? (
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
                Tagline Utama (Indonesia)
              </label>
              <input
                type="text"
                value={taglineId}
                onChange={(e) => setTaglineId(e.target.value)}
                placeholder="Desainer Komunikasi Visual & Pengarah Seni Visual"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] placeholder:text-[#6B6661]/50 focus:border-[#2B50EC] focus:outline-none text-sm"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
                Main Tagline (English)
              </label>
              <input
                type="text"
                value={taglineEn}
                onChange={(e) => setTaglineEn(e.target.value)}
                placeholder="Visual Communication Designer & Art Director"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] placeholder:text-[#6B6661]/50 focus:border-[#2B50EC] focus:outline-none text-sm"
              />
            </div>
          )}

          {/* Bio */}
          {activeLangTab === 'id' ? (
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
                Biografi / Tentang Saya (Indonesia)
              </label>
              <textarea
                rows={5}
                value={bioId}
                onChange={(e) => setBioId(e.target.value)}
                placeholder="Tuliskan latar belakang keahlian, filosofi desain, dan bidang spesialisasi Anda..."
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] placeholder:text-[#6B6661]/50 focus:border-[#2B50EC] focus:outline-none text-sm leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
                Biography / About Me (English)
              </label>
              <textarea
                rows={5}
                value={bioEn}
                onChange={(e) => setBioEn(e.target.value)}
                placeholder="Write your design philosophy, creative journey, and specialization..."
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] placeholder:text-[#6B6661]/50 focus:border-[#2B50EC] focus:outline-none text-sm leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Section 3: Keahlian & Tautan CV */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E6E2D8] space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-[#E6E2D8] pb-4">
            <Sparkles className="w-5 h-5 text-[#E26D5C]" />
            <h2 className="text-base font-medium text-[#181716]">Keahlian (Skills) &amp; Tautan CV</h2>
          </div>

          {/* Skills Tag Input */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
              Daftar Keahlian Desain (Tekan Enter atau Koma)
            </label>

            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus-within:border-[#2B50EC]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D8E2DC] text-[#181716] text-xs font-mono border border-[#E6E2D8]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#6B6661] hover:text-[#181716] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={handleAddSkill}
                placeholder={skills.length === 0 ? 'Ketik keahlian (misal: Brand Identity, Editorial, Typography)...' : ''}
                className="flex-1 min-w-[150px] bg-transparent text-sm text-[#181716] placeholder:text-[#6B6661]/50 focus:outline-none px-1 py-0.5"
              />
            </div>
          </div>

          {/* CV URL Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#181716]">
              Tautan CV (Curriculum Vitae / Resume PDF)
            </label>
            <input
              type="url"
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
              placeholder="https://example.com/cv.pdf atau Google Drive link"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] placeholder:text-[#6B6661]/50 focus:border-[#2B50EC] focus:outline-none text-sm font-mono"
            />
          </div>
        </div>

        {/* Section 4: Contact & Social Links */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E6E2D8] space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#E26D5C]" />
              <div>
                <h2 className="text-base font-medium text-[#181716]">Tautan Kontak &amp; Sosial Media</h2>
                <p className="text-xs text-[#6B6661]">
                  Ditampilkan pada footer dan halaman kontak/about portofolio.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddContactLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#2B50EC] text-[#181716] text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#E26D5C]" />
              <span>Tambah Tautan</span>
            </button>
          </div>

          {contactLinks.length === 0 ? (
            <div className="text-center py-8 rounded-xl border border-dashed border-[#E6E2D8] p-4 space-y-3 bg-[#FAF8F5]">
              <p className="text-xs text-[#6B6661] font-mono">Belum ada tautan kontak yang ditambahkan.</p>
              <button
                type="button"
                onClick={handleAddContactLink}
                className="text-xs text-[#2B50EC] hover:underline font-mono"
              >
                + Tambah Tautan Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {contactLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]"
                >
                  {/* Platform Select */}
                  <div className="w-full sm:w-44">
                    <select
                      value={link.platform}
                      onChange={(e) => handleUpdateContactLink(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E6E2D8] text-[#181716] text-xs focus:border-[#2B50EC] focus:outline-none"
                    >
                      {COMMON_PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* URL Input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUpdateContactLink(index, 'url', e.target.value)}
                      placeholder="URL (e.g. https://instagram.com/najib atau mailto:...)"
                      className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E6E2D8] text-[#181716] placeholder:text-[#6B6661]/50 text-xs font-mono focus:border-[#2B50EC] focus:outline-none"
                    />
                  </div>

                  {/* Label Input */}
                  <div className="w-full sm:w-44">
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => handleUpdateContactLink(index, 'label', e.target.value)}
                      placeholder="Label (e.g. @najib)"
                      className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E6E2D8] text-[#181716] placeholder:text-[#6B6661]/50 text-xs focus:border-[#2B50EC] focus:outline-none"
                    />
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => handleRemoveContactLink(index)}
                    className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E6E2D8] text-red-600 hover:bg-red-50 transition-colors self-end sm:self-center"
                    title="Hapus tautan ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Bottom Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E6E2D8]">
          <Link
            href="/admin"
            className="text-xs font-mono text-[#6B6661] hover:text-[#181716] transition-colors"
          >
            ← Kembali ke Dashboard
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || isUploadingPhoto}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] font-semibold text-xs uppercase font-mono tracking-wider transition-all disabled:opacity-50 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Profil</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
