"use client";

import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

const TARGET = new Date("2027-02-18T00:00:00.000Z").getTime();

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function calculate(): Remaining {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    done: false,
  };
}

export function RamadanCountdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(calculate());
    const timer = window.setInterval(() => setRemaining(calculate()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const segments = [
    { label: "kun", value: remaining?.days },
    { label: "soat", value: remaining?.hours },
    { label: "daq", value: remaining?.minutes },
    { label: "son", value: remaining?.seconds },
  ];

  return (
    <div className="mx-auto mt-5 w-fit rounded-[22px] border border-gold/25 bg-black/25 px-5 py-3 text-center backdrop-blur-md sm:px-7">
      <p className="mb-1.5 text-[10px] font-medium tracking-[0.08em] text-[#f4f1ea]/70">
        {remaining?.done ? "Ramazon muborak — rözalaringiz qabul bölsin" : "Allohim, bizni Ramazonga yetkazgin"}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <MoonStar className="h-7 w-7 text-gold-bright drop-shadow-[0_0_12px_rgba(201,164,74,0.45)]" />
        {segments.map((segment, index) => (
          <div key={segment.label} className="flex items-center gap-3 sm:gap-4">
            <div className="min-w-[34px]">
              <p className="text-[21px] font-bold tabular-nums leading-none text-gold-bright">
                {segment.value == null ? "—" : String(segment.value).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[8.5px] uppercase tracking-[0.12em] text-[#f4f1ea]/55">{segment.label}</p>
            </div>
            {index < segments.length - 1 && <span className="mb-3 h-1 w-1 rounded-full bg-gold/45" />}
          </div>
        ))}
      </div>
    </div>
  );
}
