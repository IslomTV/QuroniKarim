"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  ChevronDown,
  Globe,
  GraduationCap,
  Menu,
  Moon,
  Pause,
  Play,
  Radio,
  Search,
  Sun,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { SearchOverlay } from "@/components/site/SearchOverlay";
import { Equalizer } from "@/components/ui/Equalizer";
import { Logo } from "@/components/ui/Logo";
import { NAV } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { Track } from "@/lib/types";

const LANGUAGE_OPTIONS = [
  { code: "UZ", label: "Özbekça", native: "Lotin" },
  { code: "AR", label: "Arab tili", native: "العربية", soon: true },
  { code: "EN", label: "Ingliz tili", native: "English", soon: true },
  { code: "RU", label: "Rus tili", native: "Русский", soon: true },
  { code: "TR", label: "Turk tili", native: "Türkçe", soon: true },
];

const NAV_ICONS = {
  listen: { icon: Volume2, color: "text-gold" },
  read: { icon: BookOpen, color: "text-[#3d9b7a]" },
  memorize: { icon: GraduationCap, color: "text-[#2f9b76]" },
} as const;

type User = { name: string; email?: string };

export function Header({ onAirTrack, onAirListeners }: { onAirTrack: Track; onAirListeners: number }) {
  const pathname = usePathname();
  const { current, isPlaying, playTrack, toggle } = usePlayer();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [language, setLanguage] = useState("UZ");
  const [user, setUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState("");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      setLight(document.documentElement.classList.contains("light"));
      const raw = window.localStorage.getItem("w2q-user");
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      // Ignore malformed local state.
    }
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setSignInOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      window.localStorage.setItem("w2q-theme", next ? "light" : "dark");
    } catch {
      // Theme still applies for this visit.
    }
  };

  const isRadioCurrent = current?.id === onAirTrack.id;
  const radioPlaying = isRadioCurrent && isPlaying;
  const activeLink = (href: string) => {
    const base = href.split("?")[0].split("#")[0];
    return base !== "/" && pathname.startsWith(base);
  };

  const submitSignIn = (event: FormEvent) => {
    event.preventDefault();
    const name = nameInput.trim();
    if (!name) return;
    const nextUser = { name };
    setUser(nextUser);
    try {
      window.localStorage.setItem("w2q-user", JSON.stringify(nextUser));
    } catch {
      // Session-only sign in.
    }
    setSignInOpen(false);
    setNameInput("");
  };

  const signOut = () => {
    setUser(null);
    try {
      window.localStorage.removeItem("w2q-user");
    } catch {
      // Ignore.
    }
    setOpenMenu(null);
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-line bg-[color:var(--bg)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[66px] w-full max-w-[1500px] items-center gap-3 px-3 sm:px-5">
          <Logo className="flex-none" />

          <nav className="nav-capsule hidden xl:flex" aria-label="Asosiy">
            {Object.entries(NAV).map(([key, menu]) => {
              const { icon: Icon, color } = NAV_ICONS[key as keyof typeof NAV_ICONS];
              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(key)}
                  onMouseLeave={() => setOpenMenu((value) => (value === key ? null : value))}
                >
                  <button
                    type="button"
                    className="nav-capsule-link"
                    aria-expanded={openMenu === key}
                    onClick={() => setOpenMenu(openMenu === key ? null : key)}
                  >
                    <Icon className={`h-4 w-4 flex-none ${color}`} aria-hidden="true" />
                    {menu.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === key ? "rotate-180" : ""}`} />
                  </button>
                  {openMenu === key && (
                    <div className="panel fade-in absolute left-0 top-full z-50 mt-2 w-[330px] overflow-hidden p-2">
                      {menu.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.045]"
                        >
                          <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md border border-gold/20 bg-gold/[0.06] text-gold">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span>
                            <span className="block text-[13px] font-medium text-ink group-hover:text-gold-bright">{item.label}</span>
                            <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">{item.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link href="/azkar" className={`nav-capsule-link ${activeLink("/azkar") ? "text-gold" : ""}`}>
              Azklar
            </Link>
            <Link href="/about" className={`nav-capsule-link ${activeLink("/about") ? "text-gold" : ""}`}>
              Qurʼon haqida
            </Link>
            <span className="mx-1 h-5 w-px bg-line" />
            <button type="button" onClick={() => setSearchOpen(true)} className="nav-capsule-icon" aria-label="Qidiriş">
              <Search className="h-[17px] w-[17px]" />
            </button>
            <button type="button" onClick={toggleTheme} className="nav-capsule-icon" aria-label="Mavzuni almaştiriş">
              {light ? <Sun className="h-[17px] w-[17px]" /> : <Moon className="h-[17px] w-[17px]" />}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
                className="nav-capsule-icon"
                aria-label="Bildirişnomalar"
              >
                <Bell className="h-[17px] w-[17px]" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
              </button>
              {openMenu === "notifications" && (
                <div className="panel fade-in absolute right-0 top-full z-50 mt-3 w-[300px] p-3">
                  <p className="eyebrow mb-2 text-[10px]">Bildirişnomalar</p>
                  <div className="rounded-lg border border-line bg-white/[0.02] p-3">
                    <p className="text-[12.5px] font-medium">Qurʼon radiosi jonli efirda</p>
                    <p className="mt-1 text-[11.5px] text-muted">Maşhur qorilarning keçayu kunduz davom etuvçi aralaşmasi.</p>
                    <Link href="/radio" onClick={() => setOpenMenu(null)} className="mt-2 inline-flex text-[11.5px] font-semibold text-gold">
                      Radioni oçiş →
                    </Link>
                  </div>
                  <p className="mt-2 px-1 text-[10.5px] text-muted-2">Hozirça boşqa bildirişnomalar yöq.</p>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === "language" ? null : "language")}
                className="nav-capsule-icon gap-1 px-2 text-[11px] font-semibold"
                aria-label="Til"
                aria-expanded={openMenu === "language"}
              >
                <Globe className="h-[15px] w-[15px]" /> {language}
                <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === "language" ? "rotate-180" : ""}`} />
              </button>
              {openMenu === "language" && (
                <div className="panel fade-in absolute right-0 top-full z-50 mt-3 w-[240px] p-2">
                  <p className="eyebrow px-2 pb-2 pt-1 text-[10px]">Til</p>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      disabled={option.soon}
                      onClick={() => {
                        setLanguage(option.code);
                        setOpenMenu(null);
                      }}
                      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-[12.5px] transition-colors hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      <span>
                        {option.label} <span className="ml-1 text-muted-2">{option.native}</span>
                      </span>
                      {option.soon ? (
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[8.5px] uppercase tracking-wider text-muted-2">Tez orada</span>
                      ) : (
                        <span className="text-gold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => (user ? setOpenMenu(openMenu === "user" ? null : "user") : setSignInOpen(true))}
                className="nav-capsule-link gap-1.5"
              >
                {user ? (
                  <>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-[#15170f]">
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="max-w-[80px] truncate text-[11.5px]">{user.name}</span>
                  </>
                ) : (
                  <>
                    <UserRound className="h-3.5 w-3.5" /> Kiriş
                  </>
                )}
              </button>
              {user && openMenu === "user" && (
                <div className="panel fade-in absolute right-0 top-full z-50 mt-3 w-[220px] p-2">
                  <div className="border-b border-line px-2 pb-2.5 pt-1">
                    <p className="text-[13px] font-semibold">{user.name}</p>
                    <p className="mt-0.5 text-[10.5px] text-muted-2">Mahalliy profil</p>
                  </div>
                  <p className="px-2 py-2 text-[11px] leading-relaxed text-muted">
                    Sevimlilaringiz va navbatingiz şu qurilmada saqlanadi.
                  </p>
                  <button type="button" onClick={signOut} className="w-full rounded-md px-2 py-1.5 text-left text-[12px] text-muted hover:bg-white/5 hover:text-ink">
                    Çiqiş
                  </button>
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-1 xl:hidden">
            <button type="button" onClick={() => setSearchOpen(true)} className="icon-btn" aria-label="Qidiriş">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button type="button" onClick={toggleTheme} className="icon-btn sm:hidden" aria-label="Mavzuni almaştiriş">
              {light ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="icon-btn"
              aria-expanded={mobileOpen}
              aria-label="Menyuni oçiş"
            >
              <Menu className="h-[19px] w-[19px]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => (isRadioCurrent ? toggle() : playTrack(onAirTrack, [onAirTrack]))}
            className="ml-2 hidden items-center gap-2.5 rounded-full border border-line bg-panel/60 py-1.5 pl-2 pr-3 text-left transition-colors hover:border-gold/45 lg:flex xl:ml-3"
            aria-label={radioPlaying ? "Qurʼon radiosini töxtatiş" : "Qurʼon radiosini qöyiş"}
          >
            <span className="relative flex h-8 w-8 flex-none items-center justify-center overflow-hidden rounded-full border border-red-400/30 bg-red-500/10 text-red-300">
              {radioPlaying ? <Equalizer bars={3} /> : <Radio className="h-3.5 w-3.5" />}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.18em] text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 live-dot" /> Jonli efirda
              </span>
              <span className="block max-w-[118px] truncate text-[11.5px] font-medium text-ink">
                {isRadioCurrent ? onAirTrack.title : "Qurʼon radiosi"}
              </span>
            </span>
            <span className="ml-1 hidden items-center gap-1 border-l border-line pl-2 text-[10px] tabular-nums text-muted-2 2xl:flex">
              {radioPlaying ? <Pause className="h-3 w-3 text-gold" /> : <Play className="h-3 w-3 text-gold" />}
              {formatNumber(onAirListeners)}
            </span>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[66px] z-[55] overflow-y-auto border-t border-line bg-bg xl:hidden">
            <div className="container-page py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow">Menyu</p>
                <button type="button" onClick={() => setMobileOpen(false)} className="icon-btn" aria-label="Menyuni yopiş">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="input mb-5 flex items-center gap-2 text-left text-muted-2"
              >
                <Search className="h-4 w-4" /> Qorilar va suralarni qidiriş…
              </button>
              <div className="space-y-5">
                {Object.entries(NAV).map(([key, menu]) => {
                  const { icon: Icon, color } = NAV_ICONS[key as keyof typeof NAV_ICONS];
                  return (
                    <div key={key}>
                      <p className="eyebrow mb-2 flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${color}`} aria-hidden="true" />
                        {menu.label}
                      </p>
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {menu.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg border border-line/60 bg-panel/40 px-3 py-2.5"
                          >
                            <span className="block text-[13px] font-medium">{item.label}</span>
                            <span className="mt-0.5 block text-[11px] text-muted">{item.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div>
                  <p className="eyebrow mb-2">Boşqa</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Azklar", "/azkar"],
                      ["Qurʼon haqida", "/about"],
                      ["Qurʼon radiosi", "/radio"],
                      ["Pleylistlar", "/playlists"],
                    ].map(([label, href]) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg border border-line px-3 py-2.5 text-[12.5px]"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-2 border-t border-line pt-5">
                <button type="button" onClick={toggleTheme} className="btn btn-outline flex-1">
                  {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {light ? "Tungi mavzu" : "Kunduzgi mavzu"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (user) signOut();
                    else setSignInOpen(true);
                  }}
                  className="btn btn-gold flex-1"
                >
                  <UserRound className="h-4 w-4" /> {user ? "Çiqiş" : "Kiriş"}
                </button>
              </div>
            </div>
          </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {signInOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Kiriş oynasini yopiş" onClick={() => setSignInOpen(false)} />
          <div className="panel fade-in relative z-10 w-full max-w-[420px] p-6">
            <button type="button" onClick={() => setSignInOpen(false)} className="icon-btn absolute right-3 top-3" aria-label="Yopiş">
              <X className="h-4 w-4" />
            </button>
            <div className="mb-5 flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-full border border-gold/25 bg-panel-2">
                <Image src="/images/logo-icon.png" alt="" fill sizes="44px" className="object-contain p-1" />
              </span>
              <div>
                <p className="eyebrow text-[9px]">Xuş kelibsiz</p>
                <h2 className="display text-2xl">Quroni Karimʼga kiriş</h2>
              </div>
            </div>
            <p className="text-[12.5px] leading-relaxed text-muted">
              Töliq akkaunt tizimi tez orada. Hozirça ismingizni sevimlilar va navbat bilan birga şu qurilmada
              saqlaş uçun mahalliy profil yarating.
            </p>
            <form onSubmit={submitSignIn} className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-2">Ismingiz</span>
                <input
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  className="input"
                  placeholder="masalan, Yusuf"
                  autoFocus
                  maxLength={40}
                />
              </label>
              <button type="submit" className="btn btn-gold w-full" disabled={!nameInput.trim()}>
                Davom etiş
              </button>
            </form>
            <p className="mt-3 text-center text-[10.5px] leading-relaxed text-muted-2">
              Parol yöq, kuzatuv yöq. Profilingiz bu brauzerdan heç qaçon çiqmaydi.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
