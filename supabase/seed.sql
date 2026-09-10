-- ==============================================================================
-- Supabase Seed Data for Portofolio DKV
-- Includes:
-- 1. Singleton Profile row (Bilingual Indonesian & English)
-- 2. 4 Published Projects (is_published = true)
-- 3. 1 Draft Project (is_published = false)
-- ==============================================================================

-- 1. Upsert Profile Singleton Data
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

-- 2. Seed Projects (Published & Draft)
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
-- Published Project 1
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

-- Published Project 2
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

-- Published Project 3
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

-- Published Project 4
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

-- Draft Project (is_published = false)
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
