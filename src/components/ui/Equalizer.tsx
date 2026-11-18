export function Equalizer({
  playing = true,
  bars = 4,
  className = "",
}: {
  playing?: boolean;
  bars?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex h-4 items-end gap-[2px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, index) => (
        <span
          key={index}
          className={playing ? "eq-bar w-[2.5px] rounded-full bg-current" : "w-[2.5px] rounded-full bg-current opacity-50"}
          style={{
            height: `${[60, 100, 45, 80, 55, 95][index % 6]}%`,
            animationDelay: `${index * 0.13}s`,
          }}
        />
      ))}
    </span>
  );
}
