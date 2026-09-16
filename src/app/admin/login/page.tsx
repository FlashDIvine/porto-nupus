'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error || !data.user) {
        setErrorMessage('Email atau password salah')
        setIsLoading(false)
        return
      }

      // Success: redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch {
      setErrorMessage('Terjadi kendala saat menghubungkan ke server. Silakan coba lagi.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8 bg-[#FFFFFF] p-8 sm:p-10 rounded-2xl border border-[#E6E2D8] shadow-[0_8px_30px_rgba(24,23,22,0.04)]">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F2EFE9] border border-[#E6E2D8] text-[#E26D5C] shadow-xs mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#181716] tracking-tight leading-[1.1]">
            Admin Portal
          </h1>
          <p className="text-xs text-[#6B6661] font-mono">
            Masuk untuk mengelola karya &amp; profil portofolio
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#181716] block">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6661]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                {...register('email')}
                disabled={isLoading}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] placeholder-[#6B6661]/50 text-sm focus:outline-none focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC] transition-colors disabled:opacity-50"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-600 font-mono mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#181716] block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6661]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                {...register('password')}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#181716] placeholder-[#6B6661]/50 text-sm focus:outline-none focus:border-[#2B50EC] focus:ring-1 focus:ring-[#2B50EC] transition-colors disabled:opacity-50"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 font-mono mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#181716] hover:bg-[#2B50EC] text-[#FAF8F5] font-semibold text-sm transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#6B6661] hover:text-[#2B50EC] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Publik</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
