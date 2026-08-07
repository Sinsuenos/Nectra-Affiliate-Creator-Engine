"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "/modules", label: "Modules" },
  { href: "/sample", label: "Sample Output" },
  { href: "/compliance", label: "Compliance" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:opacity-80 transition-opacity"
        >
          <span
            className="inline-block h-5 w-5 rounded-sm bg-electric"
            aria-hidden="true"
          />
          Necter
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-colors ${
                  active
                    ? "bg-electric/10 text-electric"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-raised"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-raised transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-border/40 bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-electric/10 text-electric"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-raised"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
