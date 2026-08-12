"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { GUMROAD_URL } from "@/lib/constants";

const LINKS = [
  { href: "/modules", label: "Modules" },
  { href: "/sample", label: "Sample Output" },
  { href: "/compliance", label: "Compliance" },
  { href: "/generator", label: "Generator" },
  { href: "/scanner", label: "Scanner" },
  { href: "/faq", label: "FAQ" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#11151f]/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-bold tracking-[0.18em] uppercase text-white hover:text-electric transition-colors"
        >
          <span
            className="inline-block h-5 w-5 rounded-sm bg-electric shadow-[0_0_16px_rgba(34,184,255,0.55)]"
            aria-hidden="true"
          />
          Nectar
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-electric/15 text-electric shadow-[inset_0_0_18px_rgba(34,184,255,0.08)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 rounded-md text-xs font-bold tracking-wide bg-electric hover:bg-sky-300 text-[#071019] transition-all shadow-[0_0_20px_rgba(34,184,255,0.22)]"
          >
            Get Nectar Engine
          </a>
        </div>

        <button
          className="sm:hidden p-2 rounded-md text-zinc-300 hover:text-white hover:bg-white/[0.07] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="sm:hidden border-t border-white/10 bg-[#151923] shadow-xl">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                    active
                      ? "bg-electric/15 text-electric"
                      : "text-zinc-300 hover:text-white hover:bg-white/[0.07]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 px-3 py-2.5 rounded-md text-sm font-bold bg-electric hover:bg-sky-300 text-[#071019] transition-colors text-center"
            >
              Get Nectar Engine
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
