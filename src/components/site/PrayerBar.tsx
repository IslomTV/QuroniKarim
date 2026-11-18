"use client";

import { Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import prayerSchedule from "@/data/prayer-times.json";
import { PRAYER_LOCATION } from "@/lib/constants";

const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabiul avval",
  "Rabiul soniy",
  "Jumadus avval",
  "Jumadus soni",
  "Rajab",
  "Shaban",
  "Ramazon",
  "Shavvol",
  "Zulqada",
  "Zulhijja",
];
const PRAYER_NAMES = ["Bomdod", "Quyoş çiqişi", "Peşin", "Asr", "Şom", "Xufton"] as const;
const SCHEDULE = prayerSchedule.days as Record<string, string[]>;

// Server-rendered values. The current Tashkent day replaces these on mount.
const FALLBACK_KEY = "2026-11-18";
const FALLBACK_SCHEDULE = PRAYER_NAMES.map((name, index) => ({
  name,
  minutes: timeToMinutes(SCHEDULE[FALLBACK_KEY][index]),
}));

function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function timeLabel(minutes: number): string {
  const hour24 = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// Hijri month names are mapped manually because browsers fall back to English
// for the Uzbek locale's Islamic calendar.
function hijriLabel(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
    timeZone: "Asia/Tashkent",
    day: "numeric",
    month: "numeric",
  }).formatToParts(date);
  const day = Number(parts.find((part) => part.type === "day")?.value ?? 0);
  const month = Number(parts.find((part) => part.type === "month")?.value ?? 0);
  return `${day}-${HIJRI_MONTHS[month - 1] ?? ""}`;
}

// Tashkent is UTC+5 all year, so shifting the timestamp keeps the bar accurate
// even when the visitor's device is in another time zone.
function tashkentDate(date: Date): Date {
  return new Date(date.getTime() + TASHKENT_OFFSET_MS);
}

function dateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function scheduleFor(date: Date) {
  const key = dateKey(date);
  let times = SCHEDULE[key];

  // The published calendar covers 2026. For later dates, reuse the same
  // calendar day from the dataset as a close approximation until it is updated.
  if (!times) {
    const monthDay = key.slice(5);
    times = SCHEDULE[`${prayerSchedule.year}-${monthDay}`];
    if (!times && monthDay === "02-29") {
      times = SCHEDULE[`${prayerSchedule.year}-02-28`];
    }
    if (!times) {
      times = SCHEDULE[FALLBACK_KEY] ?? Object.values(SCHEDULE)[0];
    }
  }

  return PRAYER_NAMES.map((name, index) => ({
    name,
    minutes: timeToMinutes(times[index]),
  }));
}

export function PrayerBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const tashkent = now ? tashkentDate(now) : null;
  const minutesNow = tashkent ? tashkent.getUTCHours() * 60 + tashkent.getUTCMinutes() : null;
  const today = tashkent ? scheduleFor(tashkent) : FALLBACK_SCHEDULE;
  const tomorrow = tashkent ? scheduleFor(new Date(tashkent.getTime() + DAY_MS)) : FALLBACK_SCHEDULE;

  let activeIndex = -1;
  if (minutesNow != null) {
    today.forEach((prayer, index) => {
      if (prayer.minutes <= minutesNow) activeIndex = index;
    });
  }
  const nextIndex = minutesNow == null ? -1 : today.findIndex((prayer) => prayer.minutes > minutesNow);
  const next = nextIndex >= 0 ? today[nextIndex] : tomorrow[0];
  const minutesUntil = minutesNow == null
    ? null
    : nextIndex >= 0
      ? next.minutes - minutesNow
      : 24 * 60 - minutesNow + tomorrow[0].minutes;
  const dateLabel = tashkent
    ? `${tashkent.getUTCDate()}-${MONTHS[tashkent.getUTCMonth()]}, ${WEEKDAYS[tashkent.getUTCDay()]}`
    : "";
  const hijri = now ? hijriLabel(now) : "";

  return (
    <div className="relative border-b border-line bg-[color:var(--bg-2)]/70 backdrop-blur-md">
      <div className="container-page flex items-center gap-4 overflow-x-auto py-2.5 no-scrollbar">
        <div className="flex flex-none items-center gap-2 pr-3">
          <MapPin className="h-4 w-4 text-gold" />
          <div>
            <p className="text-[12px] font-semibold leading-tight">{PRAYER_LOCATION}</p>
            <p className="text-[10px] leading-tight text-muted-2">
              {dateLabel || "—"} {hijri ? `· ${hijri}` : ""}
            </p>
          </div>
        </div>
        <div className="h-7 w-px flex-none bg-line" />
        <div className="flex flex-1 items-stretch justify-between gap-1">
          {today.map((prayer, index) => {
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
