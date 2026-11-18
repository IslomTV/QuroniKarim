"use client";

import { Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { PRAYER_TIMES } from "@/lib/constants";

function timeLabel(minutes: number): string {
  const hour24 = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function PrayerBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const minutesNow = now ? now.getHours() * 60 + now.getMinutes() : null;
  let activeIndex = -1;
  if (minutesNow != null) {
    PRAYER_TIMES.forEach((prayer, index) => {
      if (prayer.minutes <= minutesNow) activeIndex = index;
    });
  }
  const nextIndex = minutesNow == null ? -1 : PRAYER_TIMES.findIndex((prayer) => prayer.minutes > minutesNow);
  const next = nextIndex >= 0 ? PRAYER_TIMES[nextIndex] : PRAYER_TIMES[0];
  const minutesUntil = minutesNow == null
    ? null
    : nextIndex >= 0
      ? next.minutes - minutesNow
      : 24 * 60 - minutesNow + PRAYER_TIMES[0].minutes;
  const dateLabel = now
    ? now.toLocaleDateString("uz-UZ", { weekday: "short", month: "short", day: "numeric" })
    : "";
  const hijri = now
    ? new Intl.DateTimeFormat("uz-UZ-u-ca-islamic", { day: "numeric", month: "long" }).format(now)
    : "";

  return (
    <div className="relative border-b border-line bg-[color:var(--bg-2)]/70 backdrop-blur-md">
      <div className="container-page flex items-center gap-4 overflow-x-auto py-2.5 no-scrollbar">
        <div className="flex flex-none items-center gap-2 pr-3">
          <MapPin className="h-4 w-4 text-gold" />
          <div>
            <p className="text-[12px] font-semibold leading-tight">Nyu-York</p>
            <p className="text-[10px] leading-tight text-muted-2">
              {dateLabel || "—"} {hijri ? `· ${hijri}` : ""}
            </p>
          </div>
        </div>
        <div className="h-7 w-px flex-none bg-line" />
        <div className="flex flex-1 items-stretch justify-between gap-1">
          {PRAYER_TIMES.map((prayer, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={prayer.name}
                className={`flex min-w-[72px] flex-col items-center justify-center rounded-md border px-2 py-1 transition-colors ${
                  isActive
                    ? "border-gold/60 bg-gold/10 shadow-[0_0_20px_-10px_rgba(201,164,74,0.7)]"
                    : "border-transparent"
                }`}
              >
                <span className={`text-[9.5px] font-semibold uppercase tracking-[0.12em] ${isActive ? "text-gold-bright" : "text-muted-2"}`}>
                  {prayer.name}
                </span>
                <span className={`mt-0.5 whitespace-nowrap text-[12px] font-medium tabular-nums ${isActive ? "text-gold-bright" : "text-ink/85"}`}>
                  {timeLabel(prayer.minutes)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="hidden flex-none items-center gap-2 border-l border-line pl-4 sm:flex">
          <Clock className="h-3.5 w-3.5 text-gold" />
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">Keyingi · {next.name}</p>
            <p className="text-[11.5px] font-medium tabular-nums text-ink/85">
              {minutesUntil == null
                ? "—"
                : `${Math.floor(minutesUntil / 60)} soat ${String(minutesUntil % 60).padStart(2, "0")} daq`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
