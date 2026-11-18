import Image from "next/image";
import Link from "next/link";

export function Logo({
  variant = "header",
  className = "",
  href = "/",
}: {
  variant?: "header" | "hero" | "footer";
  className?: string;
  href?: string;
}) {
  const iconSize = variant === "hero" ? 88 : variant === "footer" ? 78 : 38;
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${variant === "hero" ? "flex-col gap-3 text-center" : ""} ${className}`}>
      <span
        className="relative flex-none drop-shadow-[0_6px_20px_rgba(13,120,87,0.35)]"
        style={{ width: iconSize, height: iconSize * 0.83 }}
      >
        <Image
          src="/images/logo-icon.png"
          alt="Way2Quran"
          fill
          sizes={`${iconSize}px`}
          className="object-contain"
          priority={variant === "hero"}
        />
      </span>
      <span className={variant === "hero" ? "" : "leading-none"}>
        <span className={`block font-display font-bold tracking-tight ${variant === "hero" ? "text-[46px] sm:text-[58px]" : "text-[17px]"}`}>
          <span className="text-green-bright">Way</span>
          <span className="text-gold">2</span>
          <span className="text-gold-bright">Quran</span>
        </span>
        <span
          className={`block font-arabic text-gold/80 ${
            variant === "hero" ? "mt-1 text-lg" : "mt-1 text-[9px]"
          }`}
          dir="rtl"
        >
          الطريق إلى القرآن
        </span>
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label="Way2Quran boş sahifasi" className="inline-flex">
      {content}
    </Link>
  );
}
