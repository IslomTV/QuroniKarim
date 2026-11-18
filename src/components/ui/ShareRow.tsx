"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { FacebookIcon, TelegramIcon, WhatsappIcon, XIcon } from "@/components/ui/SocialIcons";

export function ShareRow({
  title,
  path,
  compact = false,
  className = "",
}: {
  title: string;
  path: string;
  compact?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const url = () => {
    if (typeof window === "undefined") return path;
    return new URL(path, window.location.origin).toString();
  };

  const open = (network: "x" | "facebook" | "whatsapp" | "telegram") => {
    const target = encodeURIComponent(url());
    const text = encodeURIComponent(title);
    const links = {
      x: `https://twitter.com/intent/tweet?text=${text}&url=${target}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${target}`,
      whatsapp: `https://wa.me/?text=${text}%20${target}`,
      telegram: `https://t.me/share/url?url=${target}&text=${text}`,
    };
    window.open(links[network], "_blank", "noopener,noreferrer,width=640,height=520");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: url() });
        return;
      } catch {
        // Fall back to copying.
      }
    }
    void copy();
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {!compact && <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-2">Ulaşiş</span>}
      <button type="button" onClick={() => open("x")} className="icon-btn h-8 w-8 border border-line" aria-label="Xʼda ulaşiş">
        <XIcon className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={() => open("facebook")} className="icon-btn h-8 w-8 border border-line" aria-label="Facebookʼda ulaşiş">
        <FacebookIcon className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={() => open("whatsapp")} className="icon-btn h-8 w-8 border border-line" aria-label="WhatsAppʼda ulaşiş">
        <WhatsappIcon className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={() => open("telegram")} className="icon-btn h-8 w-8 border border-line" aria-label="Telegramʼda ulaşiş">
        <TelegramIcon className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={copy} className="icon-btn h-8 w-8 border border-line" aria-label="Havolani nusxalaş">
        {copied ? <Check className="h-3.5 w-3.5 text-green-bright" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      {compact && (
        <button type="button" onClick={share} className="icon-btn h-8 w-8 border border-line" aria-label="Ulaşiş">
          <Share2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
