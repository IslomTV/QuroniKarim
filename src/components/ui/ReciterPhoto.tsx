import Image from "next/image";

export function ReciterPhoto({
  src,
  alt,
  className = "",
  sizes = "96px",
  priority = false,
  rounded = "rounded-full",
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: string;
}) {
  // Callers can position the wrapper themselves (for example when filling a
  // card). Adding `relative` in that case would override their `absolute`.
  const selfPositioned = /(^|\s)(absolute|fixed)(\s|$)/.test(className);
  return (
    <span className={`${selfPositioned ? "" : "relative"} block overflow-hidden bg-panel-2 ${rounded} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <Image
          src="/images/logo-icon.png"
          alt={alt}
          fill
          sizes={sizes}
          className="object-contain p-[18%]"
        />
      )}
    </span>
  );
}
