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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF00]">
              Dashboard
            </span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-xs font-mono text-white/50">{projects.length} Proyek Terdaftar</span>
          </div>
          <h1 className="font-heading text-3xl font-semibold text-white tracking-tight mt-1">
            Manajemen Karya & Proyek
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161616] border border-white/10 text-white/80 hover:text-white hover:border-white/30 text-xs font-medium transition-colors"
          >
            <User className="w-4 h-4 text-[#D4FF00]" />
            <span>Edit Profil / About</span>
          </Link>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] text-[#0a0a0a] font-semibold text-xs transition-all shadow-md shadow-[#D4FF00]/10"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Project</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161616] border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/30 text-xs font-medium transition-colors disabled:opacity-50"
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
              ? 'bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[#D4FF00]'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Projects Table / List */}
      {projects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 bg-[#121212]/50 p-8 space-y-4">
          <p className="text-white/60 font-body text-sm">Belum ada proyek yang dibuat.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4FF00] text-[#0a0a0a] font-semibold text-xs uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Buat Proyek Pertama
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-xs uppercase font-mono text-white/40 bg-[#0e0e0e] border-b border-white/10">
                <tr>
                  <th scope="col" className="px-6 py-4">Thumbnail & Judul</th>
                  <th scope="col" className="px-6 py-4">Kategori</th>
                  <th scope="col" className="px-6 py-4">Urutan</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((project) => {
                  const titleStr =
                    typeof project.title === 'object' && project.title !== null
                      ? project.title.id || project.title.en || 'Untitled'
                      : String(project.title)

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Thumbnail & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 shrink-0">
                            {project.cover_image_url ? (
                              <Image
                                src={project.cover_image_url}
                                alt={titleStr}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30 font-mono">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-base font-medium text-white group-hover:text-[#D4FF00] transition-colors truncate max-w-xs sm:max-w-md">
                              {titleStr}
                            </p>
                            <p className="text-xs text-white/40 font-mono truncate">
                              /{project.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-white/70 bg-[#161616] px-2.5 py-1 rounded-md border border-white/10">
                          {project.category || '—'}
                        </span>
                      </td>

                      {/* Display Order */}
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-white/50">
                        #{project.display_order}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.is_published ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D4FF00] bg-[#D4FF00]/10 border border-[#D4FF00]/30 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
                            className="p-2 rounded-lg bg-[#161616] border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                            title="Buka pratinjau publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="p-2 rounded-lg bg-[#161616] border border-white/10 text-white/60 hover:text-[#D4FF00] hover:border-[#D4FF00]/40 transition-colors"
                            title="Edit proyek"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(project)}
                            className="p-2 rounded-lg bg-[#161616] border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-white">
                Hapus Proyek Ini?
              </h3>
            </div>

            <p className="text-xs text-white/70 font-body leading-relaxed">
              Anda akan menghapus proyek{' '}
              <strong className="text-white">
                &ldquo;
                {typeof deleteTarget.title === 'object' && deleteTarget.title !== null
                  ? deleteTarget.title.id || deleteTarget.title.en
                  : deleteTarget.title}
                &rdquo;
              </strong>
              . Data yang sudah dihapus tidak dapat dipulihkan kembali.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-[#161616] border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
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
