import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, Headphones, Radio, Wifi } from "lucide-react";
import { PlayButton } from "@/components/player/PlayButton";
import { RadioStations, type RadioItem } from "@/components/radio/RadioStations";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Equalizer } from "@/components/ui/Equalizer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRadioStations, radioToTrack } from "@/lib/content";

export const metadata: Metadata = {
  title: "Qurʼon radiosi",
  description:
    "Keçayu kunduz Qurʼon radiosini tinglang — Haramayndan doimiy tilovat stansiyalari, maşhur qorilar, ruqya va tafsir, barçasi bepul.",
};

export default function RadioPage() {
  const stations = getRadioStations();
  const items: RadioItem[] = stations.map((station) => ({ station, track: radioToTrack(station) }));
  const featured = stations[0];
  const featuredTrack = featured ? radioToTrack(featured) : null;
  const queue = items.map((item) => item.track);
  const categories = [...new Set(stations.map((station) => station.category))];

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Qurʼon radiosi" }]} />

      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(760px_360px_at_12%_0%,rgba(13,120,87,0.18),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_260px_at_92%_20%,rgba(201,164,74,0.09),transparent_65%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <Radio className="h-3 w-3" /> Jonli radio
            </p>
            <h1 className="display mt-2 max-w-[660px] text-[clamp(2rem,3.7vw,3.1rem)] leading-[1.04]">
              Qurʼon — keçayu kunduz tilovatda
            </h1>
            <p className="mt-3 max-w-[620px] text-[13px] leading-relaxed text-muted">
              Ikki Muqaddas Masjiddan ön ikkita doimiy oqim, sevimli qorilar hamda ruqya va tafsir uçun maxsus
              stansiyalar. Navbat yöq, yuklab oliş yöq — şunçaki tinglaşni bosing.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <PlayButton
                track={featuredTrack}
                queue={queue}
                label="Qurʼon radiosini tinglaş"
                size="lg"
                ariaLabel="Qurʼon radiosini jonli tinglaş"
              />
              <Link href="#stations" className="btn btn-outline">
                Barça stansiyalar <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Stansiyalar", value: String(stations.length), note: "doim jonli" },
                { label: "Toifalar", value: String(categories.length), note: "tinglaş uslublari" },
                { label: "Qamrov", value: "24/7", note: "har kuni" },
                { label: "Narx", value: "Bepul", note: "akkaunt kerak emas" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-line bg-black/15 px-3.5 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">{item.label}</p>
                  <p className="display mt-1 text-[21px] leading-none text-ink">{item.value}</p>
                  <p className="mt-1 text-[9.5px] text-muted-2">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl border border-gold/25 bg-[linear-gradient(150deg,rgba(13,120,87,0.22),rgba(7,15,12,0.6))] p-5">
            <div className="absolute inset-0 rounded-xl pattern-dots opacity-25" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5484d]/15 px-2 py-1 text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#ff9a9d]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff6b70]" /> Hozir jonli efirda
                </span>
                <Equalizer className="text-gold" bars={5} />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-gold/35 bg-black/25 text-gold">
                  <Radio className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="display truncate text-[21px] leading-tight">{featured?.name ?? "Qurʼon radiosi"}</p>
                  <p className="truncate font-arabic text-[14px] text-gold/80" dir="rtl">
                    {featured?.arabicName ?? "إذاعة القرآن الكريم"}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
                {featured?.description ?? "Maşhur qorilarning keçayu kunduz davom etuvçi aralaşmasi."}
              </p>

              <div className="mt-4 rounded-lg border border-line/70 bg-black/20 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">Keyingi efir</p>
                <div className="mt-2 space-y-1.5">
                  {items.slice(1, 4).map(({ station, track }) => (
                    <div key={station.slug} className="flex items-center gap-2">
                      <PlayButton track={track} queue={queue} variant="bare" className="h-7 w-7 flex-none" ariaLabel={`Tinglash: ${station.name}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] font-medium text-ink">{station.name}</p>
                        <p className="truncate text-[9px] text-muted-2">{station.category} · {station.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="stations">
        <RadioStations items={items} />
      </div>

      <section className="py-14">
        <SectionHeading
          eyebrow="Nega jonli tinglaş kerak"
          title="Bitta oqim, ortiqça tanlovsiz"
          subtitle="Radio — Qurʼonni xonada saqlaşning eng oddiy usuli: işlayotganda, maşinada, ovqat pişirganda yoki dam olayotganda."
          align="center"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Globe2,
              title: "Har joydan",
              text: "Makka, Quvayt, Misr va xalqaro stansiyalar — butun dunyo tilovati bir joyda.",
            },
            {
              icon: Wifi,
              title: "Boşqariş kerak emas",
              text: "Navbat yöq, yuklab oliş yöq va akkaunt kerak emas. Oqim siz töxtatmaguningizça davom etadi.",
            },
            {
              icon: Headphones,
              title: "Fonda işlaşga tayyor",
              text: "Qulflangan ekran boşqaruvi va media bildirişnomalari stansiyani har bir qurilmada yaqin tutadi.",
            },
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
