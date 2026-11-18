import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { StoreBadges } from "@/components/ui/StoreBadges";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  WhatsappIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/SocialIcons";

const EXPLORE_LINKS = [
  { label: "Qorilar", href: "/reciters" },
  { label: "Suralar", href: "/surahs" },
  { label: "Pleylistlar", href: "/playlists" },
  { label: "Qurʼon radiosi", href: "/radio" },
  { label: "Azklar", href: "/azkar" },
];

const ABOUT_LINKS = [
  { label: "Qurʼon va qiroatlar", href: "/about" },
  { label: "Muqaddas Qurʼon nima?", href: "/about#quran" },
  { label: "Qiroatlar", href: "/about#qiraat" },
  { label: "Ön qori va rivoyatçilar", href: "/about#qorilar" },
  { label: "Aloqa", href: "/about#contact" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
  { label: "Telegram", href: "https://telegram.org", icon: TelegramIcon },
  { label: "WhatsApp", href: "https://whatsapp.com", icon: WhatsappIcon },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/20 bg-[#06120e] pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_300px_at_20%_0%,rgba(13,120,87,0.18),transparent_60%)]" />
      <div className="container-page relative">
        <div className="grid gap-10 pb-10 md:grid-cols-[1.3fr_1fr_1fr] lg:gap-16">
          <div>
            <Logo variant="footer" />
            <p className="mt-4 max-w-[320px] text-[12.5px] leading-relaxed text-muted">
              Islom olamidan Muqaddas Qurʼon tilovatlari — tinglaş, kuzatiş va yuklab oliş bepul, Ummat uçun mehr bilan yaratilgan.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-gold"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <StoreBadges className="mt-5" />
          </div>

          <div>
            <h3 className="display mb-4 text-lg text-gold">Köriş</h3>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-ink/85 transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="display mb-4 text-lg text-gold">Maʼlumot</h3>
            <ul className="space-y-2.5">
              {ABOUT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-ink/85 transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-5 text-[11px] text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Mualliflik huquqi © 2026 Way2Quran. Qurʼon va qorilarga hurmat sifatida yaratilgan.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about#privacy" className="hover:text-gold">Maxfiylik siyosati</Link>
            <Link href="/about#contact" className="hover:text-gold">Aloqa</Link>
            <Link href="/about#accessibility" className="hover:text-gold">Qulaylik</Link>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-green via-gold to-green" />
    </footer>
  );
}
