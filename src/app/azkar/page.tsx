import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookHeart, Heart, Moon, Sun } from "lucide-react";
import azkarJson from "@/data/azkar.json";
import { AzkarExplorer } from "@/components/azkar/AzkarExplorer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AzkarCategory, AzkarItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Azklar",
  description:
    "Tong va oqşom zikrlari, namozdan keyingi duolar, himoya va kundalik zikr — arabça matn, talaffuz, tarjima va oddiy hisoblagiç bilan.",
};

const data = azkarJson as { categories: AzkarCategory[]; items: AzkarItem[] };

export default function AzkarPage() {
  const categories = data.categories;
  const items = data.items;

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Azklar" }]} />

      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_340px_at_80%_0%,rgba(13,120,87,0.16),transparent_62%)]" />
        <div className="relative grid gap-7 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <BookHeart className="h-3 w-3" /> Zikr
            </p>
            <h1 className="display mt-2 max-w-[680px] text-[clamp(2rem,3.7vw,3rem)] leading-[1.04]">
              Kun böyi olib yuruvçi sözlar
            </h1>
            <p className="mt-3 max-w-[620px] text-[13px] leading-relaxed text-muted">
              Tong va oqşom azkarlari, namozdan keyingi zikrlar, uy uçun himoya va kundalik lahzalar uçun qisqa
              duolar — talaffuz, tarjima va yumşoq hisoblagiç bilan.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="#azkar" className="btn btn-gold">
                Tongdan boşlang <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/surahs/al-fatihah" className="btn btn-outline">
                Al-Fotihani öqiş
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { label: "Toifalar", value: categories.length, note: "har lahzaga" },
                { label: "Zikrlar", value: items.length, note: "tarjima bilan" },
                { label: "Kundalik amal", value: "5", note: "namozlar va boşqalar" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-line bg-black/15 px-3.5 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">{item.label}</p>
                  <p className="display mt-1 text-[22px] leading-none text-ink">{item.value}</p>
                  <p className="mt-1 text-[9.5px] text-muted-2">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl border border-gold/20 bg-black/20 px-5 py-8 text-center">
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(300px_180px_at_50%_0%,rgba(201,164,74,0.12),transparent_70%)]" />
            <p className="relative font-arabic text-[clamp(1.5rem,3vw,2rem)] leading-[2] text-gold/85" dir="rtl">
              أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ
            </p>
            <p className="relative mt-3 text-[11px] italic text-muted-2">
              “Darhaqiqat, Allohning zikri bilan qalblar tinçlanadi.”
            </p>
            <p className="relative mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-2/70">Qurʼon 13:28</p>
          </div>
        </div>
      </section>

      <div id="azkar">
        <AzkarExplorer categories={categories} items={items} />
      </div>

      <section className="py-14">
        <SectionHeading
          eyebrow="Kundalik tartib"
          title="Qaçan zikr qiliş kerak"
          subtitle="Sunna kunning har bir qismiga öz sözlarini bergan — ikkala uçidan boşlang."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sun, title: "Tong", text: "Bomdod namozidan quyoş çiqqunça — himoya, şukr va tiniq boşlaniş.", href: "/azkar?category=morning" },
            { icon: Moon, title: "Oqşom", text: "Asrdan Şomgaça — tun uçun panoh va uy uçun osoyişta.", href: "/azkar?category=evening" },
            { icon: Heart, title: "Namozdan keyin", text: "Har bir farz namozdan keyingi tasbeh, tahmid va takbir.", href: "/azkar?category=after-prayer" },
            { icon: BookHeart, title: "Har kuni", text: "Uxlaşdan oldin, ovqatdan oldin, safarda va ğam-ğussa vaqtida.", href: "/azkar?category=daily" },
          ].map((item) => (
            <article key={item.title} className="panel p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.06] text-gold">
                <item.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-4 text-[14px] font-semibold">{item.title}</h3>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
