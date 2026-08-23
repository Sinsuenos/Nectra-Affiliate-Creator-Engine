import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="flex items-center gap-2.5 text-base font-bold tracking-widest uppercase">
            <img
              src="/favicon-32.png"
              alt=""
              width={48}
              height={48}
              className="rounded-sm"
              aria-hidden="true"
            />
            Nectar Engine
          </span>

          <nav
            className="flex items-center gap-6 text-base text-muted-foreground"
            aria-label="Footer navigation"
          >
            <Link
              href="/faq"
              className="hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
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
          </nav>
        </div>

        <p className="mt-6 text-center text-base text-muted-foreground/80 font-mono">
          &copy; {new Date().getFullYear()} Nectar Engine. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
