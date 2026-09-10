import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${fraunces.variable} ${inter.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white selection:bg-[#D4FF00] selection:text-[#0a0a0a]">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
