import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`} aria-label="CloserNet home">
      <LogoMark className="shrink-0" />
      <span className="text-lg sm:text-[1.35rem] font-semibold tracking-tight leading-none truncate">
        Closer<span className="font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Net</span>
      </span>
    </Link>
  );
}