'use client'

import React, { createContext, useContext, useSyncExternalStore } from 'react'
import type { I18nText, Json } from '@/types/database'

export type Language = 'id' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  isId: boolean
  isEn: boolean
  t: (i18n?: I18nText | { id?: string; en?: string } | Json | null, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'portof_dkv_language'

let memoryLang: Language = 'id'
const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback)
  }
  return () => {
    listeners.delete(callback)
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', callback)
    }
  }
}

function getSnapshot(): Language {
  if (typeof window === 'undefined') return memoryLang
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null
    if (saved === 'id' || saved === 'en') {
      memoryLang = saved
      return saved
    }
  } catch {
    // ignore storage access restrictions if any
  }
  return memoryLang
}

function getServerSnapshot(): Language {
  return 'id'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setLanguage = (lang: Language) => {
    memoryLang = lang
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang)
      } catch {
        // ignore storage access restrictions if any
      }
    }
    listeners.forEach((listener) => listener())
  }

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id')
  }

  const t = (
    i18n?: I18nText | { id?: string; en?: string } | Json | null,
    fallback: string = ''
  ): string => {
    if (!i18n) return fallback
    if (typeof i18n === 'string') return i18n
    if (typeof i18n === 'object' && !Array.isArray(i18n)) {
      const textObj = i18n as { id?: string; en?: string }
      const currentVal = textObj[language]
      if (currentVal && typeof currentVal === 'string' && currentVal.trim() !== '') {
        return currentVal
      }
      const otherLang = language === 'id' ? 'en' : 'id'
      const otherVal = textObj[otherLang]
      if (otherVal && typeof otherVal === 'string' && otherVal.trim() !== '') {
        return otherVal
      }
    }
    return fallback
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isId: language === 'id',
        isEn: language === 'en',
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
