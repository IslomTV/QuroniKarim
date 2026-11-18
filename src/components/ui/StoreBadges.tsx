import { Play } from "lucide-react";

function AppleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.365 1.43c0 1.14-.417 2.2-1.25 3.18-.998 1.16-2.2 1.83-3.5 1.73-.04-1.2.44-2.35 1.23-3.2.88-.95 2.13-1.62 3.52-1.71zM20.9 17.1c-.53 1.23-.78 1.78-1.46 2.87-.95 1.52-2.29 3.42-3.95 3.43-1.47.02-1.85-.96-3.85-.95-2 .01-2.42.98-3.9.96-1.66-.02-2.93-1.73-3.88-3.25-2.66-4.28-2.94-9.3-1.3-11.97 1.17-1.9 3.02-3.02 4.76-3.02 1.77 0 2.88.97 4.35.97 1.42 0 2.28-.97 4.33-.97 1.55 0 3.19.84 4.36 2.3-3.83 2.1-3.21 7.56.54 9.63z" />
    </svg>
  );
}

export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      <a
        href="https://apps.apple.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-black/40 px-3 py-1.5 text-ink transition-colors hover:border-gold/50"
        aria-label="App Storeʼdan yuklab oliş"
      >
        <AppleLogo className="h-5 w-5" />
        <span className="text-left leading-none">
          <span className="block text-[8px] uppercase tracking-wide text-muted-2">Yuklab oling</span>
          <span className="mt-0.5 block text-[13px] font-semibold">App Store</span>
        </span>
      </a>
      <a
        href="https://play.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-black/40 px-3 py-1.5 text-ink transition-colors hover:border-gold/50"
        aria-label="Google Playʼdan yuklab oliş"
      >
        <span className="flex h-5 w-5 items-center justify-center text-green-bright">
          <Play className="h-4 w-4 fill-current" />
        </span>
        <span className="text-left leading-none">
          <span className="block text-[8px] uppercase tracking-wide text-muted-2">Yuklab oling</span>
          <span className="mt-0.5 block text-[13px] font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}
