"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const PAGE_SEQUENCE = [
  { id: "/", label: "Home" },
  { id: "/generator", label: "Generator" },
  { id: "/scanner", label: "Scanner" },
  { id: "/compliance", label: "Compliance Engine" },
  { id: "/modules", label: "Modules" },
  { id: "/faq", label: "FAQ" },
] as const;

export function BottomNextNav({ currentPage }: { currentPage: string }) {
  const currentIndex = PAGE_SEQUENCE.findIndex((p) => p.id === currentPage);
  const isLast = currentIndex === PAGE_SEQUENCE.length - 1;
  const next = isLast
    ? PAGE_SEQUENCE[0]
    : PAGE_SEQUENCE[currentIndex + 1];

  return (
    <div className="fixed bottom-0 left-0 w-full z-30 backdrop-blur-md bg-slate-900/80 border-t border-slate-700/50 py-3 flex justify-center">
      <Link
        href={next.id}
        prefetch={true}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg hover:shadow-amber-500/30 transition-all text-sm"
      >
        {isLast ? "Back to Home" : `Next: ${next.label}`}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
