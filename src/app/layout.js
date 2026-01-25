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
    "Streaming drama & anime dengan desain bersih ala iOS. Koleksi unggulan, tren, dan kategori lengkap.",
  keywords: [
    "drama",
    "anime",
    "streaming",
    "nonton",
    "sub indo",
    "series",
  ],
  openGraph: {
    type: "website",
    url: "https://dramanime.com/",
    title: "dramanime",
    description:
      "Streaming drama & anime dengan desain bersih ala iOS.",
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
    title: "dramanime",
    description:
      "Streaming drama & anime dengan desain bersih ala iOS.",
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
