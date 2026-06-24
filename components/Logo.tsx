import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`} aria-label="CloserNet home">
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="34" height="34" rx="9" fill="white" />
        <path
          d="M9 21.5C9 14.5 14 10 19.5 11.5C23 12.5 25.5 15 24 18.5C22.5 22 18.5 24 14 22"
          stroke="#09090b"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <circle cx="22" cy="14.5" r="2.75" fill="#09090b" />
        <path
          d="M22 17.5L26 21.5"
          stroke="#09090b"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg sm:text-[1.35rem] font-semibold tracking-tight leading-none truncate">
        Closer<span className="font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Net</span>
      </span>
    </Link>
  );
}