"use client";

import Link from "next/link";

const NAV_LINKS = [
  { href: "/modules", label: "Modules" },
  { href: "/compliance", label: "Compliance" },
  { href: "/generator", label: "Generator" },
  { href: "/scanner", label: "Scanner" },
  { href: "/faq", label: "FAQ" },
] as const;

export function BottomNavRow() {
  return (
    <nav className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 sm:pb-20">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-base font-medium tracking-wide">
        {NAV_LINKS.map((link, i) => (
          <span key={link.href} className="flex items-center">
            {i > 0 && <span className="text-amber-400/25 mr-4 select-none">|</span>}
            <Link
              href={link.href}
              className="text-amber-400/80 hover:text-amber-400 transition-colors duration-200"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}
