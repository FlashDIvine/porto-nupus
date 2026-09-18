import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileFloatingDock } from "@/components/navigation/MobileFloatingDock";
import {
  PuffyCloudsLayer,
  SeagullsBackgroundLayer,
  SeagullsForegroundLayer,
} from "@/components/sky-ambience";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://najib-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Najib — Visual Communication Design Portfolio",
    template: "%s — Najib Portfolio",
  },
  description:
    "Portofolio kurasi karya Desain Komunikasi Visual (DKV), identitas merek, tipografi eksperimental, desain editorial, dan sistem visual digital oleh desainer Muhammad Najib.",
  keywords: [
    "Desain Komunikasi Visual",
    "DKV",
    "Visual Communication Design",
    "Brand Identity",
    "Typography",
    "Editorial Design",
    "Graphic Design Portfolio",
    "Art Direction",
  ],
  authors: [{ name: "Muhammad Najib" }],
  creator: "Muhammad Najib",
  openGraph: {
    title: {
      default: "Najib — Visual Communication Design Portfolio",
      template: "%s — Najib Portfolio",
    },
    description:
      "Kurasi karya Desain Komunikasi Visual (DKV), identitas merek, tipografi eksperimental, dan sistem visual digital.",
    url: siteUrl,
    siteName: "Najib Visual Communication Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Najib — Visual Communication Design Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Najib — Visual Communication Design Portfolio",
      template: "%s — Najib Portfolio",
    },
    description:
      "Kurasi karya Desain Komunikasi Visual (DKV), identitas merek, tipografi eksperimental, dan sistem visual digital.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${plusJakarta.variable} ${spaceMono.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-b from-[#D0F2F9] via-[#E9F8FF] to-[#F0FDFA] bg-fixed text-[#181716] selection:bg-[#E26D5C] selection:text-[#FAF8F5] relative overflow-x-hidden">
        <LanguageProvider>
          {/* Lapisan Awan-Awan Pastel Mengapung (Paling belakang: z-0) */}
          <PuffyCloudsLayer />
          {/* Lapisan Latar Belakang Burung (Di depan awan, di balik kartu konten: z-[2]) */}
          <SeagullsBackgroundLayer />
          <Navbar />
          <main className="relative z-10 flex-1 w-full pb-16 md:pb-0">{children}</main>
          {/* Lapisan Latar Depan Burung (Di depan kartu konten: z-40) */}
          <SeagullsForegroundLayer />
          <Footer />
          {/* Floating Thumb-Zone Navigation Dock for Mobile Devices */}
          <MobileFloatingDock />
        </LanguageProvider>
      </body>
    </html>
  );
}
