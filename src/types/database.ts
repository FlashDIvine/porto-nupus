export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface I18nText {
  id: string
  en: string
}

export interface ContactLink {
  platform: string
  url: string
  label?: string
}

export interface ProjectImage {
  url: string
  caption?: I18nText | string
  order?: number
  is_highlight?: boolean
  highlight_order?: number
}

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string
          name: string
          tagline: I18nText
          bio: I18nText
          photo_url: string | null
          skills: string[]
          cv_url: string | null
          contact_links: ContactLink[] | Json
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tagline?: I18nText
          bio?: I18nText
          photo_url?: string | null
          skills?: string[]
          cv_url?: string | null
          contact_links?: ContactLink[] | Json
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tagline?: I18nText
          bio?: I18nText
          photo_url?: string | null
          skills?: string[]
          cv_url?: string | null
          contact_links?: ContactLink[] | Json
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          slug: string
          title: I18nText
          description: I18nText
          category: string | null
          cover_image_url: string | null
          images: ProjectImage[] | Json
          tools_used: string[]
          is_published: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title?: I18nText
          description?: I18nText
          category?: string | null
          cover_image_url?: string | null
          images?: ProjectImage[] | Json
          tools_used?: string[]
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: I18nText
          description?: I18nText
          category?: string | null
          cover_image_url?: string | null
          images?: ProjectImage[] | Json
          tools_used?: string[]
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profile']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
