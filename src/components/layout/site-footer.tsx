import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <span
              className="inline-block h-4 w-4 rounded-sm bg-electric"
              aria-hidden="true"
            />
            Nectar Engine
          </span>

          <nav
            className="flex items-center gap-6 text-xs text-muted-foreground"
            aria-label="Footer navigation"
          >
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refund-policy"
              className="hover:text-foreground transition-colors"
            >
              Refund Policy
            </Link>
            {/* PLACEHOLDER — Christopher will provide real URL once listing is live */}
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/40 font-mono">
          &copy; {new Date().getFullYear()} Nectar Engine. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
