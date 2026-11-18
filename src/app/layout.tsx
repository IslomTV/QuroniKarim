import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { PlayerBar } from "@/components/player/PlayerBar";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { PrayerBar } from "@/components/site/PrayerBar";
import { ThemeScript } from "@/components/site/ThemeScript";
import { getDefaultTrack, getRadio, radioToTrack } from "@/lib/content";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL("https://way2quran.com"),
  title: {
    default: SITE.title,
    template: "%s · Way2Quran",
  },
  description: SITE.description,
  keywords: [
    "Qurʼon",
    "Qurʼon tilovati",
    "Qurʼon tinglaş",
    "Qurʼon radiosi",
    "qorilar",
    "qiroat",
    "mushaf",
    "Way2Quran",
  ],
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: "https://way2quran.com",
    siteName: SITE.name,
    images: [{ url: "/images/hero-opt.jpg", width: 1600, height: 1067, alt: "Way2Quran" }],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/images/hero-opt.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#070f0c",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const defaultTrack = getDefaultTrack();
  const radio = getRadio("quran-radio");
  const onAirTrack = radio ? radioToTrack(radio) : defaultTrack;

  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeScript />
        <PlayerProvider initialTrack={defaultTrack}>
          <Header onAirTrack={onAirTrack!} onAirListeners={2140} />
          <PrayerBar />
          <main>{children}</main>
          <Footer />
          <div className="h-[82px] md:h-[94px]" aria-hidden="true" />
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
