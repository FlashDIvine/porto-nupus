import type { Profile, Project } from '@/types/database'

export const fallbackProfile: Profile = {
  id: 'default-profile',
  name: 'Najib Visual Studio',
  tagline: {
    id: 'Desainer Komunikasi Visual & Pengarah Seni Visual',
    en: 'Visual Communication Designer & Art Director',
  },
  bio: {
    id: 'Berfokus pada identitas merek, desain editorial, tipografi eksperimental, dan sistem visual digital. Menggabungkan kedalaman konsep komunikasi dengan eksplorasi visual kontemporer bernilai estetika tinggi.',
    en: 'Focused on brand identity, editorial design, experimental typography, and digital visual systems. Merging depth of communication concepts with high-aesthetic contemporary visual exploration.',
  },
  photo_url:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  skills: [
    'Brand Identity',
    'Editorial Design',
    'Typography',
    'Creative Direction',
    'UI/UX Design',
    'Packaging Design',
    'Motion Graphics',
    '3D Visualization',
  ],
  cv_url: 'https://example.com/cv.pdf',
  contact_links: [
    { platform: 'Instagram', url: 'https://instagram.com', label: '@najib.visual' },
    { platform: 'Behance', url: 'https://behance.net', label: 'behance.net/najib' },
    { platform: 'Dribbble', url: 'https://dribbble.com', label: 'dribbble.com/najib' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', label: 'LinkedIn Profile' },
    { platform: 'Email', url: 'mailto:studio@najibvisual.com', label: 'studio@najibvisual.com' },
  ],
  updated_at: new Date().toISOString(),
}

export const fallbackProjects: Project[] = [
  {
    id: 'p1',
    slug: 'lumina-brand-identity',
    title: {
      id: 'Lumina — Identitas Visual & Kemasan Kopi Spesialti',
      en: 'Lumina — Visual Identity & Specialty Coffee Packaging',
    },
    description: {
      id: 'Perancangan identitas merek menyeluruh untuk kedai kopi artisan Lumina. Konsep berakar pada spektrum cahaya dan presisi pemanggangan biji kopi, diterjemahkan ke dalam tipografi kustom, palet warna monokromatis dengan aksen neon, dan sistem label modular yang ramah lingkungan.',
      en: 'A comprehensive brand identity design for artisan roastery Lumina. The concept stems from the light spectrum and roasting precision, manifested into custom typography, monochrome palette with neon accents, and an eco-friendly modular labeling system.',
    },
    category: 'Branding & Packaging',
    cover_image_url:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Kemasan utama biji kopi Lumina', en: 'Lumina primary coffee bean packaging' },
        order: 1,
        is_highlight: true,
        highlight_order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Penerapan identitas pada cangkir & stationery', en: 'Identity application on cups & stationery' },
        order: 2,
        is_highlight: true,
        highlight_order: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Eksplorasi tipografi dan kartu menu', en: 'Typography exploration and menu card system' },
        order: 3,
        is_highlight: false,
      },
    ],
    tools_used: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Cinema 4D'],
    is_published: true,
    display_order: 1,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
    demo_url: 'https://behance.net',
    github_url: 'https://github.com',
    impact_chips: ['+140% Brand Recall', '100% Eco-cert Paper', 'Featured on Behance'],
    metrics: [
      { label: { id: 'Peningkatan Pengenalan Merek', en: 'Brand Recall Boost' }, value: '+140%' },
      { label: { id: 'Bahan Daur Ulang', en: 'Recycled Materials' }, value: '100%' },
      { label: { id: 'Titik Distribusi Retail', en: 'Retail Distribution' }, value: '24 Outlets' },
    ],
    challenges: [
      {
        title: { id: 'Konsistensi Tinta Neon pada Kertas Kraft', en: 'Neon Ink Fidelity on Kraft Substrate' },
        description: {
          id: 'Mengatasi penyerapan tinta tinggi pada kertas bertekstur tanpa kehilangan saturasi pigmen neon fluorescent.',
          en: 'Overcoming high substrate absorption on textured stock while preserving vibrant fluorescent neon pigment fidelity.',
        },
      },
      {
        title: { id: 'Sistem Label Modular Multi-Origin', en: 'Multi-Origin Modular Label System' },
        description: {
          id: 'Membangun arsitektur informasi label fleksibel untuk 12 varietas biji kopi seasonal dengan biaya produksi efisien.',
          en: 'Designing a flexible label information hierarchy for 12 rotating single-origin harvests with optimal print unit economics.',
        },
      },
    ],
  },
  {
    id: 'p2',
    slug: 'kinetic-type-experiment',
    title: {
      id: 'Kinetic Form — Eksplorasi Tipografi Gerak Kontemporer',
      en: 'Kinetic Form — Contemporary Motion Typography Exploration',
    },
    description: {
      id: 'Seri poster visual dan animasi tipografi eksperimental yang meneliti interaksi antara distorsi grid digital, distorsi ruang, dan ritme audio. Karya ini dipamerkan dalam pameran desain grafis digital Indonesia.',
      en: 'A series of experimental visual posters and typography animations studying the interplay of digital grid distortions, spatial anomalies, and audio rhythms. Exhibited in the Indonesian digital graphic design showcase.',
    },
    category: 'Typography & Motion',
    cover_image_url:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Poster seri #01: Sound & Gravity', en: 'Poster series #01: Sound & Gravity' },
        order: 1,
        is_highlight: true,
        highlight_order: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Struktur grid dekonstruktif', en: 'Deconstructive grid structure' },
        order: 2,
        is_highlight: false,
      },
    ],
    tools_used: ['After Effects', 'Illustrator', 'TouchDesigner'],
    is_published: true,
    display_order: 2,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z',
    demo_url: 'https://vimeo.com',
    github_url: 'https://github.com',
    impact_chips: ['60 FPS WebGL', '15k+ Impressions', 'Exhibited at DGID 2026'],
    metrics: [
      { label: { id: 'Kecepatan Render Realtime', en: 'Realtime Frame Rate' }, value: '60 FPS' },
      { label: { id: 'Total Pengunjung Galeri', en: 'Exhibition Attendees' }, value: '15,000+' },
      { label: { id: 'Variasi Eksperimen Tipografi', en: 'Generative Iterations' }, value: '48 Systems' },
    ],
    challenges: [
      {
        title: { id: 'Sinkronisasi FFT Audio ke Transformasi Vektor', en: 'FFT Audio-to-Vector Sync' },
        description: {
          id: 'Memetakan frekuensi audio low-pass secara langsung ke deformasi bezier kurva tipografi secara deterministik.',
          en: 'Mapping real-time sub-bass audio frequencies directly into mathematical bezier curve deformations.',
        },
      },
      {
        title: { id: 'Performa Render Resolusi 4K', en: '4K Realtime Motion Pipeline' },
        description: {
          id: 'Optimasi kalkulasi instancing GPU shader agar tidak terjadi frame-drop pada instalasi proyeksi skala besar.',
          en: 'Optimizing GPU shader instancing passes to avoid frame drops across large-scale physical projector arrays.',
        },
      },
    ],
  },
  {
    id: 'p3',
    slug: 'archival-book-design',
    title: {
      id: 'Arsip Visual Nusantara — Desain Buku & Editorial',
      en: 'Nusantara Visual Archive — Book & Editorial Design',
    },
    description: {
      id: 'Monograf editorial setebal 280 halaman yang mendokumentasikan ragam ornamen dan simbol grafis tradisional nusantara. Menggunakan teknik cetak risograph 3 warna di atas kertas daur ulang tekstur berat.',
      en: 'A 280-page editorial monograph documenting traditional Indonesian ornamental patterns and graphic symbols. Printed using 3-color risograph techniques on heavyweight textured recycled paper.',
    },
    category: 'Editorial & Print',
    cover_image_url:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Sampul hardcover dengan foil deboss', en: 'Hardcover binding with debossed foil' },
        order: 1,
        is_highlight: true,
        highlight_order: 4,
      },
      {
        url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Layout halaman ganda dan fotografi arsip', en: 'Double-page spread and archival photography' },
        order: 2,
        is_highlight: false,
      },
    ],
    tools_used: ['Adobe InDesign', 'Photoshop', 'Bookbinding Crafts'],
    is_published: true,
    display_order: 3,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    demo_url: 'https://behance.net',
    github_url: 'https://github.com',
    impact_chips: ['280 Pages Monograph', 'Sold Out Edition (500 Cop.)', 'Swiss Design Award Longlist'],
    metrics: [
      { label: { id: 'Ketebalan Halaman', en: 'Total Book Pages' }, value: '280 Pages' },
      { label: { id: 'Edisi Terjual Habis', en: 'Limited Edition Run' }, value: '500 Copies' },
      { label: { id: 'Arsip Motif Terdokumentasi', en: 'Documented Motifs' }, value: '120 Symbols' },
    ],
    challenges: [
      {
        title: { id: 'Separasi Warna Risograph Multi-Plate', en: 'Multi-Drum Risograph Color Separation' },
        description: {
          id: 'Kalibrasi overlap warna tinta Risograph kedelai murni untuk menghindari over-saturation dan registration drift.',
          en: 'Calibrating soy-based Risograph color overlaps to prevent bleed-through and misregistration artifacts across signatures.',
        },
      },
      {
        title: { id: 'Jilid Lay-Flat Swiss Binding', en: 'Swiss Lay-Flat Binding Architecture' },
        description: {
          id: 'Struktur jilid terbuka dengan benang jahit katun kontras agar buku dapat dibuka 180 derajat rata sempurna.',
          en: 'Constructing exposed-spine Swiss binding with contrasting thread to ensure 180-degree lay-flat reading experience.',
        },
      },
    ],
  },
  {
    id: 'p4',
    slug: 'aura-spatial-interface',
    title: {
      id: 'Aura — Desain Sistem Antarmuka & Pengalaman Pengguna',
      en: 'Aura — Spatial Interface & User Experience Design',
    },
    description: {
      id: 'Eksplorasi desain antarmuka digital untuk platform kurasi seni modern. Menghadirkan navigasi berbasis gestur, tipografi yang adaptif, dan palet warna kontras tinggi yang ramah mata untuk sesi kurasi panjang.',
      en: 'A digital interface design exploration for a contemporary art curation platform. Featuring gesture-driven navigation, adaptive typography, and high-contrast eye-friendly palettes for extended sessions.',
    },
    category: 'UI/UX & Interactive',
    cover_image_url:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Desain layout utama platform Aura', en: 'Main dashboard layout of Aura platform' },
        order: 1,
        is_highlight: true,
        highlight_order: 5,
      },
    ],
    tools_used: ['Figma', 'Protopie', 'React', 'Tailwind CSS'],
    is_published: true,
    display_order: 4,
    created_at: '2026-04-12T00:00:00Z',
    updated_at: '2026-04-12T00:00:00Z',
    demo_url: 'https://aura-spatial.vercel.app',
    github_url: 'https://github.com/najib/aura-spatial',
    impact_chips: ['LCP < 0.8s', '500+ Daily Curators', '99.8% Accessibility Score'],
    metrics: [
      { label: { id: 'Kecepatan LCP Core Web Vitals', en: 'Core Web Vitals LCP' }, value: '< 0.8s' },
      { label: { id: 'Pengguna Kurator Aktif', en: 'Active Curators' }, value: '500+' },
      { label: { id: 'Skor Aksesibilitas WCAG', en: 'Accessibility Score' }, value: '99.8%' },
    ],
    challenges: [
      {
        title: { id: 'Sistem Micro-Gestures Touchscreen', en: 'Touchscreen Micro-Gesture System' },
        description: {
          id: 'Menyelaraskan gesture swipe horizontal dengan pencegahan benturan scroll vertical pada browser mobile.',
          en: 'Eliminating gesture collision between horizontal swipe panning and natural mobile vertical scroll axes.',
        },
      },
      {
        title: { id: 'Dynamic Color Token Contrast Safety', en: 'Dynamic Color Token Contrast Safety' },
        description: {
          id: 'Perhitungan dinamis kontras rasio APCA (Accessible Perceptual Contrast Algorithm) untuk kartu artwork gelap/terang.',
          en: 'Realtime APCA contrast calculations ensuring readable typography against dynamic user-uploaded artwork palettes.',
        },
      },
    ],
  },
  {
    id: 'p5-draft',
    slug: 'secret-draft-branding',
    title: {
      id: 'Proyek Rahasia — Eksplorasi Konsep Brand (Draft)',
      en: 'Secret Project — Brand Concept Exploration (Draft)',
    },
    description: {
      id: 'Eksplorasi identitas visual rahasia yang masih dalam proses perancangan internal. Karya ini belum siap untuk konsumsi publik.',
      en: 'Secret visual identity exploration still in internal development. This work is not yet ready for public release.',
    },
    category: 'Experimental & Branding',
    cover_image_url:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        caption: { id: 'Sketsa konsep internal (Draft)', en: 'Internal concept sketch (Draft)' },
        order: 1,
        is_highlight: true,
        highlight_order: 99,
      },
    ],
    tools_used: ['Figma', 'Procreate'],
    is_published: false,
    display_order: 5,
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
    demo_url: null,
    github_url: null,
    impact_chips: ['Internal R&D', 'NDA Protected'],
  },
]

