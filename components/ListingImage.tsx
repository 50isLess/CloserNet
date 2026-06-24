"use client";

import { useState } from "react";
import { LogoMark } from "@/components/LogoMark";

export function ListingImage({
  src,
  alt,
  className = "w-full h-48",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const hasImage = src.trim().length > 0 && !failed;

  if (!hasImage) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center gap-3 bg-zinc-950 border-b border-zinc-800/80`}
        role="img"
        aria-label={`${alt} — no image provided`}
      >
        <LogoMark size={52} className="opacity-90" />
        <span className="text-xs text-zinc-500 tracking-wide">No image provided</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => setFailed(true)}
    />
  );
}