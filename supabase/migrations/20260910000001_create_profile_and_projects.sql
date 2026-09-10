-- Migration: 20260910000001_create_profile_and_projects.sql
-- Task 2.1: SQL Migration: Tabel & RLS

-- 1. Helper function for updated_at timestamps
-- Set explicit search_path and SECURITY INVOKER to satisfy Supabase Database Advisor
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. Tabel profile (singleton table for portfolio owner profile)
CREATE TABLE IF NOT EXISTS public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline jsonb NOT NULL DEFAULT '{"id": "", "en": ""}'::jsonb,
  bio jsonb NOT NULL DEFAULT '{"id": "", "en": ""}'::jsonb,
  photo_url text,
  skills text[] DEFAULT '{}'::text[],
  cv_url text,
  contact_links jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enforce strict singleton at database level: exactly at most 1 row can ever exist in profile
CREATE UNIQUE INDEX IF NOT EXISTS profile_singleton_idx ON public.profile ((true));

-- Trigger for profile.updated_at
DROP TRIGGER IF EXISTS set_profile_updated_at ON public.profile;
CREATE TRIGGER set_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. Tabel projects
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title jsonb NOT NULL DEFAULT '{"id": "", "en": ""}'::jsonb,
  description jsonb NOT NULL DEFAULT '{"id": "", "en": ""}'::jsonb,
  category text,
  cover_image_url text,
  images jsonb DEFAULT '[]'::jsonb,
  tools_used text[] DEFAULT '{}'::text[],
  is_published boolean DEFAULT false,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger for projects.updated_at
DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Helpful indexes for query performance
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects (is_published);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: profile
-- SELECT allowed untuk semua (public)
DROP POLICY IF EXISTS "Allow public read access on profile" ON public.profile;
CREATE POLICY "Allow public read access on profile"
  ON public.profile
  FOR SELECT
  TO public
  USING (true);

-- UPDATE hanya untuk authenticated user
DROP POLICY IF EXISTS "Allow authenticated update on profile" ON public.profile;
CREATE POLICY "Allow authenticated update on profile"
  ON public.profile
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. RLS Policies: projects
-- SELECT allowed untuk semua HANYA WHERE is_published = true
DROP POLICY IF EXISTS "Allow public read access on published projects" ON public.projects;
CREATE POLICY "Allow public read access on published projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (is_published = true);

-- Authenticated user (admin) can SELECT all projects including drafts (is_published = false)
DROP POLICY IF EXISTS "Allow authenticated read access on all projects" ON public.projects;
CREATE POLICY "Allow authenticated read access on all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT/UPDATE/DELETE hanya untuk authenticated user
DROP POLICY IF EXISTS "Allow authenticated insert on projects" ON public.projects;
CREATE POLICY "Allow authenticated insert on projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update on projects" ON public.projects;
CREATE POLICY "Allow authenticated update on projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete on projects" ON public.projects;
CREATE POLICY "Allow authenticated delete on projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- 7. Insert 1 default empty row to profile (singleton table) if none exists
INSERT INTO public.profile (name, tagline, bio, contact_links, skills)
VALUES ('', '{"id": "", "en": ""}'::jsonb, '{"id": "", "en": ""}'::jsonb, '[]'::jsonb, '{}'::text[])
ON CONFLICT ((true)) DO NOTHING;

-- 8. Safe permissions grant for Supabase API roles
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    GRANT SELECT ON public.profile TO anon;
    GRANT SELECT ON public.projects TO anon;
  END IF;
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    GRANT SELECT, UPDATE ON public.profile TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
  END IF;
END
$$;

