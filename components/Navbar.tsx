"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";

const NAV_LINKS = [
  { href: "#how", label: "How it Works" },
  { href: "#escrow", label: "Escrow" },
  { href: "#value", label: "CloserValue AI" },
  { href: "#fees", label: "Fees" },
  { href: "#compare", label: "Compare" },
  { href: "#forums", label: "Forums" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar({ onJoinWaitlist }: { onJoinWaitlist: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => setMenuOpen(false);

  const handleJoin = () => {
    setMenuOpen(false);
    onJoinWaitlist();
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center gap-3">
        <Logo className="min-w-0 shrink" />

        <div className="hidden lg:flex items-center gap-5 text-sm">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-zinc-400 whitespace-nowrap">
              {link.label}
            </a>
          ))}
          <button
            onClick={onJoinWaitlist}
            className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 whitespace-nowrap"
          >
            Join the Waitlist
          </button>
        </div>

        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            onClick={handleJoin}
            className="px-3.5 py-2 bg-white text-black rounded-full text-xs sm:text-sm font-medium hover:bg-zinc-200 whitespace-nowrap"
          >
            Join Waitlist
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="p-2 border border-zinc-700 rounded-lg hover:bg-zinc-900"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="px-3 py-3 rounded-lg hover:bg-zinc-900 text-sm"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleJoin}
              className="mt-2 w-full py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}