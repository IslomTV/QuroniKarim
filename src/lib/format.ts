const NUMBER_FORMAT = new Intl.NumberFormat("uz-UZ");

export function formatNumber(value: number): string {
  return NUMBER_FORMAT.format(value);
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")} mln`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1).replace(/\.0$/, "")} ming`;
  return formatNumber(value);
}

export function formatDuration(seconds?: number | null): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatLongDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h} soat ${m > 0 ? `${m} daqiqa` : ""}`.trim();
  return `${m} daqiqa`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural || singular;
}
