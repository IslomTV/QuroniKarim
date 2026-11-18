import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { PlayerBar } from "@/components/player/PlayerBar";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { PrayerBar } from "@/components/site/PrayerBar";
import { ThemeScript } from "@/components/site/ThemeScript";
import { getDefaultTrack, getRadio, radioToTrack } from "@/lib/content";
import { BASE_PATH, withBasePath } from "@/lib/base-path";
import { SITE } from "@/lib/constants";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://islomtv.github.io";
const siteUrl = `${siteOrigin}${BASE_PATH}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: SITE.title,
    template: "%s · Quroni Karim",
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
    "Quroni Karim",
  ],
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: siteUrl,
    siteName: SITE.name,
    images: [
      {
        url: withBasePath("/images/hero-opt.jpg"),
        width: 1600,
        height: 1067,
        alt: "Quroni Karim",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [withBasePath("/images/hero-opt.jpg")],
  },
  icons: {
    icon: withBasePath("/favicon.ico"),
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
