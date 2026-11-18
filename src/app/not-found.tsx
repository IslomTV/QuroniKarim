import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Home, Radio, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[62vh] items-center justify-center py-16">
      <div className="panel relative w-full max-w-[640px] overflow-hidden px-6 py-12 text-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_260px_at_50%_0%,rgba(13,120,87,0.18),transparent_65%)]" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        <div className="relative">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06] text-gold">
            <Compass className="h-6 w-6" />
          </span>
          <p className="eyebrow mt-5">404 · Sahifa topilmadi</p>
          <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)] leading-[1.05]">
            Bu yöl adaşib qoldi
          </h1>
          <p className="mx-auto mt-3 max-w-[420px] text-[13px] leading-relaxed text-muted">
            Siz izlagan sahifa kutubxonada yöq. Boş sahifaga qayting yoki qori, sura yoxud jonli radio bilan
            qaytadan boşlang.
          </p>

          <p className="mt-5 font-arabic text-2xl text-gold/70" dir="rtl">
            وَٱللَّهُ يَهْدِى مَن يَشَآءُ إِلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <Link href="/" className="btn btn-gold">
              <Home className="h-4 w-4" /> Boş sahifa
            </Link>
            <Link href="/reciters" className="btn btn-outline btn-sm">
              <Compass className="h-3.5 w-3.5" /> Qorilar
            </Link>
            <Link href="/surahs" className="btn btn-outline btn-sm">
              <BookOpen className="h-3.5 w-3.5" /> Suralar
            </Link>
            <Link href="/radio" className="btn btn-ghost btn-sm">
              <Radio className="h-3.5 w-3.5" /> Radio
            </Link>
          </div>

          <Link href="/search" className="mt-6 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-green-bright hover:text-gold">
            <Search className="h-3.5 w-3.5" /> Kutubxonadan qidiriş <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
