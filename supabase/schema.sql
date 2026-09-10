-- ==============================================================================
-- Supabase Schema & Storage Setup
-- Combined Migrations: Task 2.1 (Tables & RLS) & Task 2.2 (Storage Bucket)
-- Ready to run directly in the Supabase SQL Editor
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Functions
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. Table: profile (Singleton table)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. Table: projects
-- ------------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects (is_published);

-- ------------------------------------------------------------------------------
-- 4. Enable Row Level Security (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 5. RLS Policies: profile
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. RLS Policies: projects
-- ------------------------------------------------------------------------------
-- SELECT allowed untuk semua HANYA WHERE is_published = true
DROP POLICY IF EXISTS "Allow public read access on published projects" ON public.projects;
CREATE POLICY "Allow public read access on published projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (is_published = true);

-- SELECT allowed untuk authenticated role (admin) untuk melihat semua project termasuk draft (is_published = false)
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

-- ------------------------------------------------------------------------------
-- 7. Seed Data: Default Profile Row & Projects (Published & Draft)
-- ------------------------------------------------------------------------------
INSERT INTO public.profile (
  name,
  tagline,
  bio,
  photo_url,
  skills,
  cv_url,
  contact_links,
  updated_at
)
VALUES (
  'Najib Visual Studio',
  '{"id": "Desainer Komunikasi Visual & Pengarah Seni Visual", "en": "Visual Communication Designer & Art Director"}'::jsonb,
  '{"id": "Berfokus pada identitas merek, desain editorial, tipografi eksperimental, dan sistem visual digital. Menggabungkan kedalaman konsep komunikasi dengan eksplorasi visual kontemporer bernilai estetika tinggi.", "en": "Focused on brand identity, editorial design, experimental typography, and digital visual systems. Merging depth of communication concepts with high-aesthetic contemporary visual exploration."}'::jsonb,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'Brand Identity',
    'Editorial Design',
    'Typography',
    'Creative Direction',
    'UI/UX Design',
    'Packaging Design',
    'Motion Graphics',
    '3D Visualization'
  ]::text[],
  'https://example.com/cv.pdf',
  '[
    {"platform": "Instagram", "url": "https://instagram.com", "label": "@najib.visual"},
    {"platform": "Behance", "url": "https://behance.net", "label": "behance.net/najib"},
    {"platform": "Dribbble", "url": "https://dribbble.com", "label": "dribbble.com/najib"},
    {"platform": "LinkedIn", "url": "https://linkedin.com", "label": "LinkedIn Profile"},
    {"platform": "Email", "url": "mailto:studio@najibvisual.com", "label": "studio@najibvisual.com"}
  ]'::jsonb,
  NOW()
)
ON CONFLICT ((true)) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio,
  photo_url = EXCLUDED.photo_url,
  skills = EXCLUDED.skills,
  cv_url = EXCLUDED.cv_url,
  contact_links = EXCLUDED.contact_links,
  updated_at = NOW();

INSERT INTO public.projects (
  slug,
  title,
  description,
  category,
  cover_image_url,
  images,
  tools_used,
  is_published,
  display_order,
  created_at,
  updated_at
)
VALUES
(
  'lumina-brand-identity',
  '{"id": "Lumina — Identitas Visual & Kemasan Kopi Spesialti", "en": "Lumina — Visual Identity & Specialty Coffee Packaging"}'::jsonb,
  '{"id": "Perancangan identitas merek menyeluruh untuk kedai kopi artisan Lumina. Konsep berakar pada spektrum cahaya dan presisi pemanggangan biji kopi, diterjemahkan ke dalam tipografi kustom, palet warna monokromatis dengan aksen neon, dan sistem label modular yang ramah lingkungan.", "en": "A comprehensive brand identity design for artisan roastery Lumina. The concept stems from the light spectrum and roasting precision, manifested into custom typography, monochrome palette with neon accents, and an eco-friendly modular labeling system."}'::jsonb,
  'Branding & Packaging',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
  '[
    {
      "url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Kemasan utama biji kopi Lumina", "en": "Lumina primary coffee bean packaging"},
      "order": 1,
      "is_highlight": true,
      "highlight_order": 1
    },
    {
      "url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Penerapan identitas pada cangkir & stationery", "en": "Identity application on cups & stationery"},
      "order": 2,
      "is_highlight": true,
      "highlight_order": 3
    },
    {
      "url": "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Eksplorasi tipografi dan kartu menu", "en": "Typography exploration and menu card system"},
      "order": 3,
      "is_highlight": false
    }
  ]'::jsonb,
  ARRAY['Adobe Illustrator', 'Photoshop', 'InDesign', 'Cinema 4D']::text[],
  true,
  1,
  '2026-01-15T00:00:00Z',
  '2026-01-15T00:00:00Z'
),
(
  'kinetic-type-experiment',
  '{"id": "Kinetic Form — Eksplorasi Tipografi Gerak Kontemporer", "en": "Kinetic Form — Contemporary Motion Typography Exploration"}'::jsonb,
  '{"id": "Seri poster visual dan animasi tipografi eksperimental yang meneliti interaksi antara distorsi grid digital, distorsi ruang, dan ritme audio. Karya ini dipamerkan dalam pameran desain grafis digital Indonesia.", "en": "A series of experimental visual posters and typography animations studying the interplay of digital grid distortions, spatial anomalies, and audio rhythms. Exhibited in the Indonesian digital graphic design showcase."}'::jsonb,
  'Typography & Motion',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
  '[
    {
      "url": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Poster seri #01: Sound & Gravity", "en": "Poster series #01: Sound & Gravity"},
      "order": 1,
      "is_highlight": true,
      "highlight_order": 2
    },
    {
      "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Struktur grid dekonstruktif", "en": "Deconstructive grid structure"},
      "order": 2,
      "is_highlight": false
    }
  ]'::jsonb,
  ARRAY['After Effects', 'Illustrator', 'TouchDesigner']::text[],
  true,
  2,
  '2026-02-10T00:00:00Z',
  '2026-02-10T00:00:00Z'
),
(
  'archival-book-design',
  '{"id": "Arsip Visual Nusantara — Desain Buku & Editorial", "en": "Nusantara Visual Archive — Book & Editorial Design"}'::jsonb,
  '{"id": "Monograf editorial setebal 280 halaman yang mendokumentasikan ragam ornamen dan simbol grafis tradisional nusantara. Menggunakan teknik cetak risograph 3 warna di atas kertas daur ulang tekstur berat.", "en": "A 280-page editorial monograph documenting traditional Indonesian ornamental patterns and graphic symbols. Printed using 3-color risograph techniques on heavyweight textured recycled paper."}'::jsonb,
  'Editorial & Print',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
  '[
    {
      "url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Sampul hardcover dengan foil deboss", "en": "Hardcover binding with debossed foil"},
      "order": 1,
      "is_highlight": true,
      "highlight_order": 4
    },
    {
      "url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Layout halaman ganda dan fotografi arsip", "en": "Double-page spread and archival photography"},
      "order": 2,
      "is_highlight": false
    }
  ]'::jsonb,
  ARRAY['Adobe InDesign', 'Photoshop', 'Bookbinding Crafts']::text[],
  true,
  3,
  '2026-03-01T00:00:00Z',
  '2026-03-01T00:00:00Z'
),
(
  'aura-spatial-interface',
  '{"id": "Aura — Desain Sistem Antarmuka & Pengalaman Pengguna", "en": "Aura — Spatial Interface & User Experience Design"}'::jsonb,
  '{"id": "Eksplorasi desain antarmuka digital untuk platform kurasi seni modern. Menghadirkan navigasi berbasis gestur, tipografi yang adaptif, dan palet warna kontras tinggi yang ramah mata untuk sesi kurasi panjang.", "en": "A digital interface design exploration for a contemporary art curation platform. Featuring gesture-driven navigation, adaptive typography, and high-contrast eye-friendly palettes for extended sessions."}'::jsonb,
  'UI/UX & Interactive',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  '[
    {
      "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Desain layout utama platform Aura", "en": "Main dashboard layout of Aura platform"},
      "order": 1,
      "is_highlight": true,
      "highlight_order": 5
    }
  ]'::jsonb,
  ARRAY['Figma', 'Protopie', 'React', 'Tailwind CSS']::text[],
  true,
  4,
  '2026-04-12T00:00:00Z',
  '2026-04-12T00:00:00Z'
),
(
  'secret-draft-branding',
  '{"id": "Proyek Rahasia — Eksplorasi Konsep Brand (Draft)", "en": "Secret Project — Brand Concept Exploration (Draft)"}'::jsonb,
  '{"id": "Eksplorasi identitas visual rahasia yang masih dalam proses perancangan internal. Karya ini belum siap untuk konsumsi publik.", "en": "Secret visual identity exploration still in internal development. This work is not yet ready for public release."}'::jsonb,
  'Experimental & Branding',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  '[
    {
      "url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      "caption": {"id": "Sketsa konsep internal (Draft)", "en": "Internal concept sketch (Draft)"},
      "order": 1,
      "is_highlight": true,
      "highlight_order": 99
    }
  ]'::jsonb,
  ARRAY['Figma', 'Procreate']::text[],
  false,
  5,
  '2026-05-01T00:00:00Z',
  '2026-05-01T00:00:00Z'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  cover_image_url = EXCLUDED.cover_image_url,
  images = EXCLUDED.images,
  tools_used = EXCLUDED.tools_used,
  is_published = EXCLUDED.is_published,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 8. Safe Permissions Grants for Supabase Roles
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 9. Storage: "project-images" Bucket Setup (Task 2.2)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  26214400, -- 25MB in bytes (25 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 10. Storage Policies: "project-images"
-- ------------------------------------------------------------------------------
-- SELECT (read) allowed untuk semua/public
DROP POLICY IF EXISTS "Allow public read on project-images" ON storage.objects;
CREATE POLICY "Allow public read on project-images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'project-images');

-- INSERT allowed hanya untuk authenticated role
DROP POLICY IF EXISTS "Allow authenticated insert on project-images" ON storage.objects;
CREATE POLICY "Allow authenticated insert on project-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

-- DELETE allowed hanya untuk authenticated role
DROP POLICY IF EXISTS "Allow authenticated delete on project-images" ON storage.objects;
CREATE POLICY "Allow authenticated delete on project-images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

-- UPDATE allowed hanya untuk authenticated role (mendukung upload dengan overwrite / upsert)
DROP POLICY IF EXISTS "Allow authenticated update on project-images" ON storage.objects;
CREATE POLICY "Allow authenticated update on project-images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');
