import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Download,
  ExternalLink,
  Mail,
  ScrollText,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Qurʼon va qiroatlar",
  description:
    "Muqaddas Qurʼon va ön qiroat haqida töliq qöllanma: vahiy, töplaniş, tuziliş, qiroatlar, ön qori, rivoyat zanjiri va klassik matnlar.",
};

const STATS = [
  { label: "Suralar", value: 114 },
  { label: "Oyatlar", value: 6236 },
  { label: "Juzlar", value: 30 },
  { label: "Qiroatlar", value: 10 },
];

const CONTENTS = [
  { id: "quran", label: "Muqaddas Qurʼon nima?" },
  { id: "vahiy", label: "Vahiy" },
  { id: "toplanish", label: "Qurʼonning töplanişi" },
  { id: "tuzilish", label: "Qurʼonning tuzilişi" },
  { id: "qiraat", label: "Qiroatlar — öqiliş usullari" },
  { id: "qorilar", label: "Ön qori va rivoyatçilar" },
  { id: "mezonlar", label: "Toğri qiroat mezonlari" },
  { id: "zanjir", label: "Rivoyat zanjiri" },
  { id: "mutun", label: "Klassik didaktik matnlar" },
  { id: "manbalar", label: "Asosiy manbalar" },
];

const COMPANION_PDFS = [
  { title: "Tuhfat al-Atfol", href: "https://archive.org/details/tohfatalatfal" },
  { title: "Al-Muqaddima al-Jazariyya", href: "https://archive.org/details/sa71mir%5Fgmail%5F201906" },
  { title: "Hirz al-Amoniy (Aş-Şatibiyya)", href: "https://archive.org/details/shatibiah%5FQuraan" },
  { title: "Ad-Durra al-Mudiyya", href: "https://archive.org/details/dorrah.c/" },
];

const READERS = [
  { n: "01", name: "Nofeʼ al-Madaniy", place: "Madina", died: "h. 169", narrators: ["Qolun", "Varş"] },
  { n: "02", name: "Ibn Kasir al-Makkiy", place: "Makka", died: "h. 120", narrators: ["Al-Bazziy", "Qunbul"] },
  { n: "03", name: "Abu Amr al-Basriy", place: "Basra", died: "h. 154", narrators: ["Ad-Duri", "As-Susi"] },
  { n: "04", name: "Ibn Omir aş-Şomiy", place: "Damaşq", died: "h. 118", narrators: ["Hişam", "Ibn Zakvon"] },
  { n: "05", name: "Osim al-Kufiy", place: "Kufa", died: "h. 127", narrators: ["Hafs", "Şuʼba"] },
  { n: "06", name: "Hamza az-Zayyat", place: "Kufa", died: "h. 156", narrators: ["Xalaf", "Xallod"] },
  { n: "07", name: "Al-Kisoiy", place: "Kufa", died: "h. 189", narrators: ["Abu al-Horis", "Ad-Duri"] },
  { n: "08", name: "Abu Jaʼfar al-Madaniy", place: "Madina", died: "h. 130", narrators: ["Ibn Vardon", "Ibn Jammoz"] },
  { n: "09", name: "Yaʼqub al-Hadramiy", place: "Basra", died: "h. 205", narrators: ["Ruways", "Ravh"] },
  { n: "10", name: "Xalaf al-Bazzor", place: "Bağdod", died: "h. 229", narrators: ["Işoq al-Varroq", "Idris al-Haddod"] },
];

type Mutun = {
  title: string;
  author: string;
  description: string;
  arabic?: string;
  href?: string;
};

const MUTUN: Mutun[] = [
  {
    title: "Tuhfat al-Atfol",
    author: "Şayx Sulaymon al-Jamzuriy (h. 1204) · 61 bayt",
    description:
      "Tajvid qoidalari böyiça eng maşhur kiriş şeʼri. Unda nun sokin va tanvin, mim sokin, taʼrif lam va feʼl lam qoidalari hamda mad (çöziş) turlari yoritilgan. Odatda tajvid öquvçilari yodlaydigan birinçi matn.",
    arabic: "يَقُولُ رَاجِي رَحْمَةِ الغَفُورِ ۞ دَوْمًا سُلَيْمَانُ هُوَ الجَمْزُورِي",
    href: "https://archive.org/details/tohfatalatfal",
  },
  {
    title: "Al-Muqaddima al-Jazariyya",
    author: "Imom Ibn al-Jazariy (h. 833) · 109 bayt",
    description:
      "Tajvid qoidalarining batafsil bayoni — Tuhfat al-Atfoldan keyingi asosiy manba. Unda artikulyatsiya nuqtalari (maxorij), harflar xususiyatlari (sifat), tafxim va tarqiq, ra va lam qoidalari, vaqf va ibtido hamda Qurʼon imlosi yoritilgan. Bu matnni özlaştirmasdan heç bir qori ijozat olmaydi.",
    arabic: "يَقُولُ رَاجِي عَفْوِ رَبٍّ سَامِعِ ۞ مُحَمَّدُ بْنُ الجَزَرِيِّ الشَّافِعِي",
    href: "https://archive.org/details/sa71mir%5Fgmail%5F201906",
  },
  {
    title: "Hirz al-Amoniy (Aş-Şatibiyya)",
    author: "Imom al-Qosim aş-Şatibiy (h. 590) · 1 173 bayt",
    description:
      "Yetti kanonik qiroat haqidagi eng buyuk şeʼr. Tavil vaznida yozilgan bölib, yetti qori va ularning rivoyatçilarining variantlarini nafis tarzda jamlaydi. U butun dunyoda qiroat taʼlimining asosi bölib qolmoqda — olimlarning aytişiça, Şatibiyyani egallagan kişi yetti qiroatni boşqaradi.",
    arabic: "بَدَأْتُ بِبِسْمِ اللهِ فِي النَّظْمِ أَوَّلَا ۞ تَبَارَكَ رَحْمَانًا رَحِيمًا وَمَوْئِلَا",
    href: "https://archive.org/details/shatibiah%5FQuraan",
  },
  {
    title: "Ad-Durra al-Mudiyya",
    author: "Imom Ibn al-Jazariy (h. 833) · 241 bayt",
    description:
      "Şatibiyyaning hamrohi bölib, önlikni töldiruvçi uç qöşimça qiroatni qamrab oladi: Abu Jaʼfar al-Madaniy, Yaʼqub al-Hadramiy va Xalaf al-Bazzor. Şatibiyya bilan bir xil vazn va uslubda yozilgan.",
    arabic: "الحَمْدُ للهِ الَّذِي أَعْلَى القُرَا ۞ وَأَنْزَلَ القُرْآنَ لِلنَّاسِ قُرَا",
    href: "https://archive.org/details/dorrah.c/",
  },
  {
    title: "Tayyibat an-Naşr",
    author: "Imom Ibn al-Jazariy (h. 833) · 1 014 bayt",
    description:
      "Barça ön qiroat va ularning köplab rivoyat yöllari böyiça eng töliq şeʼr. U ön qiroatni yagona asarda birlaştıradi (Şatibiyya va Durrani almaştıradi) va ikkalasida ham bölmagan qöşimça variantlarni öz içiga oladi. Ibn al-Jazariy uni özining «An-Naşr fi al-Qiraʼat al-Aşr» asarining şeʼriy xulosasi sifatida yozgan.",
    arabic: "أَقُولُ حَمْدًا لِلْإِلَهِ ذِي الطَّوْلِ ۞ مُصَلِّيًا عَلَى النَّبِيِّ وَالْآلِ",
    href: "https://archive.org/details/tajjibatuannashrfialqiraatialashribnaljazari",
  },
  {
    title: "Laʼoliy al-Bayon fi Tajvid al-Qurʼon",
    author: "Zamonaviy tajvid matnlari",
    description:
      "Klassik matnlar bilan bir qatorda zamonaviy didaktik asarlar ham paydo bölib, tajvid qoidalarini soddalaştıradi. Klassik mutunlarga köplab şarhlar (şuruh) va qisqartmalar ham yozilgan — ularni zamonaviy öquvçilar uçun qulayroq qiliş maqsadida.",
  },
];

const LEARNING_PATH = [
  { step: "1", title: "Tuhfat al-Atfol", level: "Kiriş" },
  { step: "2", title: "Al-Jazariyya", level: "Örta daraja" },
  { step: "3", title: "Aş-Şatibiyya", level: "Yuqori daraja" },
  { step: "4", title: "Ad-Durra", level: "Yuqori daraja" },
  { step: "5", title: "Tayyibat an-Naşr", level: "Mutaxassis" },
];

const REFERENCES = [
  "An-Naşr fi al-Qiraʼat al-Aşr — Ibn al-Jazariy (h. 833)",
  "Tayyibat an-Naşr — Ibn al-Jazariy",
  "Al-Sabʼa fi al-Qiraʼat — Ibn Mujohid (h. 324)",
  "Aş-Şatibiyya — Imom aş-Şatibiy (h. 590)",
  "Ad-Durra — Ibn al-Jazariy (uç qöşimça qiroat)",
  "Al-Itqon fi Ulum al-Qurʼon — as-Suyutiy (h. 911)",
];

function Divider() {
  return (
    <div className="mt-4 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-line/70" />
      <span className="text-[11px] leading-none text-gold/80">✦</span>
      <span className="h-px w-24 bg-line/70" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Qurʼon va qiroatlar" }]} />

      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(760px_340px_at_88%_0%,rgba(13,120,87,0.17),transparent_62%)]" />
        <div className="relative">
          <p className="eyebrow inline-flex items-center gap-2">
            <BookOpen className="h-3 w-3" /> Maqola
          </p>
          <h1 className="display mt-2 max-w-[760px] text-[clamp(2rem,3.8vw,3.1rem)] leading-[1.03]">
            Qurʼon va qiroatlar
          </h1>
          <p className="mt-3 max-w-[680px] text-[13px] leading-relaxed text-muted">
            Muqaddas Qurʼon va ön qiroat haqida töliq qöllanma
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STATS.map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-black/15 px-3.5 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">{item.label}</p>
                <p className="display mt-1 text-[24px] leading-none text-gold">{formatNumber(item.value)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="space-y-3 lg:sticky lg:top-24">
          <nav className="panel p-4" aria-label="Mundarija">
            <p className="eyebrow">Mundarija</p>
            <ol className="mt-3 space-y-1.5">
              {CONTENTS.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group flex items-start gap-2 rounded px-1.5 py-1 text-[11.5px] leading-snug text-muted transition-colors hover:bg-white/[0.03] hover:text-gold"
                  >
                    <span className="mt-px w-4 flex-none text-[9px] font-semibold tracking-wider text-muted-2 group-hover:text-gold/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="panel p-4">
            <p className="eyebrow inline-flex items-center gap-1.5">
              <BookMarked className="h-3 w-3" /> Hamroh PDFlar
            </p>
            <ul className="mt-3 space-y-2">
              {COMPANION_PDFS.map((pdf) => (
                <li key={pdf.title}>
                  <a
                    href={pdf.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-2 text-[11px] leading-snug text-muted transition-colors hover:text-gold"
                  >
                    <Download className="mt-0.5 h-3 w-3 flex-none text-gold/70" />
                    <span>{pdf.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <article className="min-w-0 space-y-4">
          <section id="quran" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">I bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Muqaddas Qurʼon nima?
            </h2>
            <Divider />
            <div className="mt-4 space-y-3 text-[12.5px] leading-relaxed text-muted">
              <p>
                Muqaddas Qurʼon — Allohning kalomi. U Payğambar Muhammad (s.a.v.)ga Jabroil (Gabriel)
                fariştasi orqali taxminan 23 yil davomida nozil qilingan. Bu oxirgi ilohiy kitob, butun
                insoniyat uçun hidoyat manbaidir.
              </p>
              <p>
                Alloh uning saqlanişini kafolatlagan: «Albatta, Biz zikrni (Qurʼonni) nozil qildik va
                albatta, Biz uni muhofaza qiluvçimiz» (Al-Hijr: 9).
              </p>
            </div>
          </section>

          <section id="vahiy" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">II bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">Vahiy</h2>
            <Divider />
            <div className="mt-4 space-y-3 text-[12.5px] leading-relaxed text-muted">
              <p>
                Vahiy Ramazon oyida, Makka yaqinidagi Hira ğorida, milodiy 610-yilda (hijratdan 13 yil
                avval) boşlangan. Birinçi nozil bölgan oyatlar Al-Alaq surasining boşlanişi edi:
                «Yaratgan Rabbing nomi bilan öqi».
              </p>
              <p>
                Vahiy taxminan 23 yil davom etdi — 13 yil Makkada va 10 yil Madinada. Qurʼon voqea va
                şaroitlarga mos ravişda bosqiçma-bosqiç nozil qilindi. Payğambar (s.a.v.) kotiblariga har
                bir vahiy darhol yozib olinişini buyurgan.
              </p>
            </div>
          </section>

          <section id="toplanish" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">III bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Qurʼonning töplanişi
            </h2>
            <Divider />
            <ol className="mt-4 space-y-3">
              {[
                {
                  title: "Payğambar (s.a.v.) hayotligida",
                  text: "Qurʼon teri, suyak, xurmo poyasi kabi narsalarga yozilgan va köplab sahobalar tomonidan yodlangan. Jabroil har Ramazanda Qurʼonni Payğambar bilan töliq körib çiqqan, oxirgi yilida esa ikki marta körib çiqqan.",
                },
                {
                  title: "Abu Bakr (r.a.) davrida",
                  text: "Yamoma jangida (hijriy 12-yil) köplab qori şahid bölgaç, Umar Abu Bakrga Qurʼonni yagona muşafga töplaşni taklif qildi. Bu iş Zayd ibn Sobitga topşirildi.",
                },
                {
                  title: "Usmon (r.a.) davrida",
                  text: "Taxminan hijriy 25-yilda Islom hududlari kengayib, qiroatlarda tafovutlar paydo bölgaç, Usmon Qurʼonni Qurayş lahjasida standartlaştirişni buyurdi. Nusxalar Makka, Madina, Damaşq, Basra va Kufaga yuborildi, boşqa nusxalar yoqib yuborildi. Bu Usmoniy muşaf bugungi kungaça standart hisoblanadi.",
                },
              ].map((item, index) => (
                <li key={item.title} className="flex gap-3 rounded-lg border border-line/70 bg-black/10 p-3.5">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06] text-[10px] font-semibold text-gold">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-ink">{item.title}:</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="tuzilish" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">IV bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Qurʼonning tuzilişi
            </h2>
            <Divider />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                {
                  title: "Suralar",
                  text: "114 ta sura — 86 tasi makkiy (Makkada nozil bölgan) va 28 tasi madaniy. Eng uzuni — Al-Baqara (286 oyat), eng qisqasi — Al-Kavsar (3 oyat).",
                },
                {
                  title: "Oyatlar",
                  text: "Eng köp qabul qilingan hisob böyiça 6 236 oyat. Oyatlar bir sözdan butun bir paragrafgaça bölişi mumkin.",
                },
                {
                  title: "Juz va hizb",
                  text: "30 juz, 60 hizb va 240 rub (çorak). Öqiş va yodlaşni osonlaştiriş uçun bölingan.",
                },
                {
                  title: "Tartib",
                  text: "Suralar tartibi ilohiy buyruq bilan (tavqifiy) belgilangan — Payğambar (s.a.v.) körsatmasi asosida — va vahiyning xronologik tartibidan farq qiladi.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-line/70 bg-black/10 p-4">
                  <h3 className="text-[12.5px] font-semibold text-gold/90">{item.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="qiraat" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">V bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Qiroatlar — Qurʼonning öqiliş usullari
            </h2>
            <Divider />
            <div className="mt-4 space-y-3 text-[12.5px] leading-relaxed text-muted">
              <p>
                Qiroatlar — Qurʼon vahyining talaffuz, harakatlantiriş va boşqa lingvistik
                xususiyatlaridagi variantlari. Bu Qurʼon sözlarining qanday talaffuz qilinişi va ijro
                etilişi haqidagi ilm bölib, har bir variant öz rivoyatçisiga uzluksiz zanjir orqali
                boğlanadi.
              </p>
              <p>
                Bu ilm Payğambar (s.a.v.) sahobalarga turli qiroat usullarini örgatişidan boşlangan —
                ularning barçasi ilohiy vahiy edi. İşonçli hadis Qurʼonning yetti harfda (ahruf) nozil
                qilinganini tasdiqlaydi. Keyinçalik olimlar bu qiroatlarni Payğambargaça boradigan
                uzluksiz rivoyat zanjirlari bilan hujjatlaştirgan.
              </p>
              <p>
                Yetti qiroat imom Abu Bakr ibn Mujohid (h. 324) tomonidan «Al-Sabʼa» asarida jamlangan.
                Imom Ibn al-Jazariy (h. 833) keyinçalik «An-Naşr fi al-Qiraʼat al-Aşr» asarida yana
                uçtasini qöşib, ön kanonik (mutavotir) qiroatni belgilagan.
              </p>
            </div>
          </section>

          <section id="qorilar" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">VI bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Ön qori va ularning rivoyatçilari
            </h2>
            <Divider />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {READERS.map((reader) => (
                <div key={reader.n} className="rounded-lg border border-line/70 bg-black/10 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[12.5px] font-semibold text-ink">{reader.name}</h3>
                      <p className="mt-0.5 text-[10px] text-muted-2">
                        {reader.place} · {reader.died}
                      </p>
                    </div>
                    <span className="display text-[18px] leading-none text-gold/45">{reader.n}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {reader.narrators.map((narrator) => (
                      <span
                        key={narrator}
                        className="rounded-full border border-gold/20 bg-gold/[0.05] px-2 py-0.5 text-[9.5px] text-gold/85"
                      >
                        {narrator}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="mezonlar" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">VII bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Toğri qiroat mezonlari
            </h2>
            <Divider />
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              Olimlar qiroatni qabul qiliş uçun uçta şartni belgilagan:
            </p>
            <ol className="mt-3 space-y-2">
              {[
                {
                  title: "Arab tili grammatikasiga muvofiqlik",
                  text: "heç bölmaganda bitta toğri talqin böyiça.",
                },
                {
                  title: "Usmoniy xatga muvofiqlik",
                  text: "heç bölmaganda ehtimoliy jihatdan (çunki ilk xatda nuqta va harakatlar yöq edi).",
                },
                {
                  title: "İşonçli rivoyat zanjiri (isnod)",
                  text: "Payğambar (s.a.v.)gaça uzluksiz zanjir.",
                },
              ].map((item, index) => (
                <li key={item.title} className="flex gap-3 rounded-lg border border-line/70 bg-black/10 p-3.5">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06] text-[10px] font-semibold text-gold">
                    {index + 1}
                  </span>
                  <p className="text-[12px] leading-relaxed text-muted">
                    <span className="font-semibold text-ink">{item.title}</span> — {item.text}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              Barça uç şartga javob beradigan qiroat Qurʼon sifatida qabul qilinadi va namozda öqilişi
              mumkin. Biror şartga javob bermagan qiroat «şoz» (ğayrioddiy) deb tasniflanadi va ibodatda
              qöllanilmaydi.
            </p>
          </section>

          <section id="zanjir" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">VIII bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Rivoyat zanjiri
            </h2>
            <Divider />
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              Qurʼon qiroatlari ustozlar orqali uzluksiz zanjir — isnod — orqali yetkazilgan. Bu
              zanjirning bir neça bosqiçi bor:
            </p>
            <ol className="mt-3 space-y-1.5">
              {[
                "Payğambar Muhammad (s.a.v.)",
                "Sahobalar (masalan, Ibn Masʼud, Ubay ibn Kaʼb, Zayd ibn Sobit)",
                "Tobiʼinlar (masalan, Abu Abdurahmon as-Sulamiy)",
                "Ön qori (Nofeʼ, Ibn Kasir, Abu Amr...)",
                "Rivoyatçilar / ruvot (Hafs, Varş, Qolun...)",
                "Turuq — kanonik matnlar mualliflari",
                "Olimlar va qorilar — bugungi kungaça",
              ].map((item, index) => (
                <li key={item} className="flex items-center gap-2.5 text-[12px] text-muted">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded border border-line bg-white/[0.03] text-[9px] font-semibold text-gold/80">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              Ijozat — Qurʼon qiroatida ustozning şogirdga maʼlum bir qiroatni yetkazişga ruxsat berişi;
              şogird mahoratini isbotlagandan söng beriladi. Bu tizim Payğambar davridan bugungi kungaça
              uzluksiz davom etib kelmoqda.
            </p>
          </section>

          <section id="mutun" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">IX bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Klassik didaktik matnlar (Mutun)
            </h2>
            <Divider />
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              Mutun (birlik: matn) — olimlar tomonidan tajvid va qiroat qoidalarini yodlaşni
              osonlaştiriş uçun yozilgan didaktik şeʼrlar. Ular asrlar davomida Qurʼon taʼlimining asosi
              bölib kelgan va bugungi kunda ham butun dunyoda öqitiladi.
            </p>
            <div className="mt-4 space-y-2">
              {MUTUN.map((item) => (
                <article key={item.title} className="rounded-lg border border-line/70 bg-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[12.5px] font-semibold text-ink">{item.title}</h3>
                      <p className="mt-0.5 text-[10px] text-muted-2">{item.author}</p>
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-gold/25 bg-gold/[0.06] px-2.5 py-1 text-[9.5px] font-medium text-gold transition-colors hover:border-gold/50"
                      >
                        <ExternalLink className="h-2.5 w-2.5" /> PDF
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted">{item.description}</p>
                  {item.arabic ? (
                    <div className="mt-3 rounded-md border border-gold/15 bg-black/20 px-3 py-2">
                      <p className="font-arabic text-[15px] leading-[2.1] text-gold/85" dir="rtl">
                        {item.arabic}
                      </p>
                      <p className="mt-1 text-[8.5px] uppercase tracking-[0.16em] text-muted-2">
                        Boşlaniş satri
                      </p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-line/70 bg-black/10 p-4">
              <p className="eyebrow">Tavsiya etilgan öquv yöli</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                {LEARNING_PATH.map((item) => (
                  <div key={item.step} className="rounded-md border border-line/60 bg-white/[0.02] p-2.5">
                    <p className="display text-[15px] leading-none text-gold/50">{item.step}</p>
                    <p className="mt-1.5 text-[10.5px] font-semibold leading-tight text-ink">{item.title}</p>
                    <p className="mt-0.5 text-[9px] text-muted-2">{item.level}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="manbalar" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">X bölim</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Asosiy manbalar
            </h2>
            <Divider />
            <ol className="mt-4 space-y-1.5">
              {REFERENCES.map((item, index) => (
                <li key={item} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted">
                  <span className="mt-0.5 w-5 flex-none text-[9px] font-semibold tracking-wider text-muted-2">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-start gap-2 text-[10.5px] leading-relaxed text-muted-2">
              <ScrollText className="mt-0.5 h-3 w-3 flex-none text-gold/60" />
              Maʼlumotlar Qurʼon ilmlari va qiroat böyiça işonçli ilmiy asarlardan olindi.
            </p>
          </section>

          <section id="contribute" className="panel scroll-mt-28 p-5 sm:p-7">
            <p className="eyebrow">Hissa qöşiş va aloqa</p>
            <h2 className="display mt-2 text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight">
              Bu kutubxonani birgalikda boyitamiz
            </h2>
            <p className="mt-2 max-w-[640px] text-[12.5px] leading-relaxed text-muted">
              Qurʼon ilmlari böyiça tuzatişlar, yangi tilovatlar yoki hamkorlik takliflari bölsa, biz
              bilan boğlaning.
            </p>
            <div id="contact" className="mt-4 grid scroll-mt-28 gap-2 sm:grid-cols-2">
              <a
                href="mailto:hello@way2quran.com"
                className="flex items-center gap-3 rounded-lg border border-line bg-black/15 px-3.5 py-3 transition-colors hover:border-gold/35"
              >
                <Mail className="h-4 w-4 flex-none text-gold" />
                <span className="min-w-0">
                  <span className="block text-[9px] uppercase tracking-[0.16em] text-muted-2">Umumiy</span>
                  <span className="block truncate text-[11.5px] text-ink">hello@way2quran.com</span>
                </span>
              </a>
              <a
                href="mailto:contribute@way2quran.com"
                className="flex items-center gap-3 rounded-lg border border-line bg-black/15 px-3.5 py-3 transition-colors hover:border-gold/35"
              >
                <BookMarked className="h-4 w-4 flex-none text-gold" />
                <span className="min-w-0">
                  <span className="block text-[9px] uppercase tracking-[0.16em] text-muted-2">Hissalar</span>
                  <span className="block truncate text-[11.5px] text-ink">contribute@way2quran.com</span>
                </span>
              </a>
            </div>
            <p id="app" className="mt-3 scroll-mt-28 text-[10.5px] leading-relaxed text-muted-2">
              Mobil ilova va oçiq API tez orada — yangiliklardan xabardor böliş uçun biz bilan
              boğlanişingiz mumkin.
            </p>
            <Link href="/reciters" className="btn btn-gold mt-5">
              Qorilarni tinglaş <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </article>
      </div>
    </div>
  );
}
