'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  LogOut,
  User,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { revalidatePortfolio } from '@/app/actions/revalidate'
import type { Project } from '@/types/database'

interface AdminProjectListProps {
  initialProjects: Project[]
}

export function AdminProjectList({ initialProjects }: AdminProjectListProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  )

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    } catch {
      setIsLoggingOut(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    setFeedback(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id)

      if (error) {
        setFeedback({ message: `Gagal menghapus proyek: ${error.message}`, type: 'error' })
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        setFeedback({ message: 'Proyek berhasil dihapus.', type: 'success' })
        await revalidatePortfolio(deleteTarget.slug)
      }
    } catch {
      setFeedback({ message: 'Terjadi kesalahan saat menghapus proyek.', type: 'error' })
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E26D5C]">
              Dashboard
            </span>
            <span className="text-xs text-[#6B6661]/40">•</span>
            <span className="text-xs font-mono text-[#6B6661]">{projects.length} Proyek Terdaftar</span>
          </div>
          <h1 className="font-heading text-3xl font-semibold text-[#181716] tracking-tight mt-1 leading-[1.1]">
            Manajemen Karya &amp; Proyek
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] text-[#181716] hover:border-[#181716]/40 hover:bg-[#F2EFE9] text-xs font-medium transition-colors shadow-2xs"
          >
            <User className="w-4 h-4 text-[#E26D5C]" />
            <span>Edit Profil / About</span>
          </Link>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] font-medium text-xs transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Project</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] text-[#6B6661] hover:text-red-600 hover:border-red-300 text-xs font-medium transition-colors disabled:opacity-50 shadow-2xs"
            title="Keluar dari sesi admin"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Alert Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-xs font-mono animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-[#D8E2DC]/60 border border-[#E6E2D8] text-[#181716]'
              : 'bg-red-500/10 border border-red-500/20 text-red-600'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#181716]" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Projects Table / List */}
      {projects.length === 0 ? (
        <div className="py-20 text-center rounded-xl border border-dashed border-[#E6E2D8] bg-[#FFFFFF] p-8 space-y-4 shadow-xs">
          <p className="text-[#6B6661] font-body text-sm">Belum ada proyek yang dibuat.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181716] text-[#FAF8F5] font-medium text-xs uppercase tracking-wider hover:bg-[#2B50EC] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Buat Proyek Pertama
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#181716]">
              <thead className="text-xs uppercase font-mono text-[#6B6661] bg-[#F2EFE9] border-b border-[#E6E2D8]">
                <tr>
                  <th scope="col" className="px-6 py-4">Thumbnail &amp; Judul</th>
                  <th scope="col" className="px-6 py-4">Kategori</th>
                  <th scope="col" className="px-6 py-4">Urutan</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8]">
                {projects.map((project) => {
                  const titleStr =
                    typeof project.title === 'object' && project.title !== null
                      ? project.title.id || project.title.en || 'Untitled'
                      : String(project.title)

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-[#FAF8F5] transition-colors group"
                    >
                      {/* Thumbnail & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#F2EFE9] border border-[#E6E2D8] shrink-0">
                            {project.cover_image_url ? (
                              <Image
                                src={project.cover_image_url}
                                alt={titleStr}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#6B6661] font-mono">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-base font-semibold text-[#181716] group-hover:text-[#2B50EC] transition-colors truncate max-w-xs sm:max-w-md">
                              {titleStr}
                            </p>
                            <p className="text-xs text-[#6B6661] font-mono truncate">
                              /{project.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-[#181716] bg-[#F2EFE9] px-2.5 py-1 rounded-md border border-[#E6E2D8]">
                          {project.category || '—'}
                        </span>
                      </td>

                      {/* Display Order */}
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-[#6B6661]">
                        #{project.display_order}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.is_published ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#181716] bg-[#D8E2DC] border border-[#E6E2D8] px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#181716]" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/project/${project.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] text-[#6B6661] hover:text-[#2B50EC] hover:border-[#2B50EC] transition-colors shadow-2xs"
                            title="Buka pratinjau publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] text-[#6B6661] hover:text-[#2B50EC] hover:border-[#2B50EC] transition-colors shadow-2xs"
                            title="Edit proyek"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(project)}
                            className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] text-[#6B6661] hover:text-red-600 hover:border-red-300 transition-colors shadow-2xs"
                            title="Hapus proyek"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog (AlertDialog) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181716]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#FFFFFF] border border-[#E6E2D8] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#181716]">
                Hapus Proyek Ini?
              </h3>
            </div>

            <p className="text-xs text-[#6B6661] font-body leading-relaxed">
              Anda akan menghapus proyek{' '}
              <strong className="text-[#181716]">
                &ldquo;
                {typeof deleteTarget.title === 'object' && deleteTarget.title !== null
                  ? deleteTarget.title.id || deleteTarget.title.en
                  : deleteTarget.title}
                &rdquo;
              </strong>
              . Data yang sudah dihapus tidak dapat dipulihkan kembali.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E2D8]">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] hover:bg-[#F2EFE9] text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-[#FFFFFF] text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Proyek</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
