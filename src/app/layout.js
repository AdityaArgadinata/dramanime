import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import BottomNav from "../components/layout/BottomNav";
import Container from "../components/layout/Container";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata = {
  metadataBase: new URL("https://dramanime.com"),
  title: {
    default: "dramanime",
    template: "%s • dramanime",
  },
  applicationName: "dramanime",
  description:
    "Platform streaming terlengkap untuk nonton drama Korea, drama Mandarin, film, dan anime subtitle Indonesia. Nikmati koleksi serial terbaru, film populer, dan anime trending dengan kualitas HD.",
  keywords: [
    "nonton drama korea",
    "streaming anime sub indo",
    "drama mandarin subtitle indonesia",
    "nonton film online",
    "drama korea terbaru",
    "anime subtitle indonesia",
    "streaming drama gratis",
    "kdrama sub indo",
    "nonton anime",
    "series korea",
    "drakor terbaru",
    "film bioskop online",
  ],
  openGraph: {
    type: "website",
    url: "https://dramanime.com/",
    title: "dramanime - Streaming Drama Korea, Anime & Film Sub Indo",
    description:
      "Platform streaming terlengkap untuk nonton drama Korea, drama Mandarin, film, dan anime subtitle Indonesia. Koleksi serial terbaru dengan kualitas HD.",
    siteName: "dramanime",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "dramanime hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dramanime",
    creator: "@dramanime",
    title: "dramanime - Streaming Drama Korea, Anime & Film Sub Indo",
    description:
      "Platform streaming terlengkap untuk nonton drama Korea, drama Mandarin, film, dan anime subtitle Indonesia. Koleksi serial terbaru dengan kualitas HD.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/dramanime.svg",
  },
  alternates: {
    canonical: "https://dramanime.com/",
    languages: {
      "x-default": "https://dramanime.com/",
      id: "https://dramanime.com/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Header />
        <main className="pt-16 pb-24">
          <Container>{children}</Container>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
