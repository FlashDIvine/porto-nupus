'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePortfolio(slug?: string) {
  try {
    revalidatePath('/', 'page')
    revalidatePath('/gallery', 'page')
    revalidatePath('/about', 'page')
    if (slug) {
      revalidatePath(`/project/${slug}`, 'page')
    }
    revalidatePath('/admin', 'page')
    return { success: true }
  } catch (error) {
    console.error('Failed to revalidate paths:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
