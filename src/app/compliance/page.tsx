"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NectarOrbs } from "@/components/nectar-orbs";
import { BottomNavRow } from "@/components/BottomNavRow";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { PLATFORM_MATRIX } from "@/lib/compliance/platform-matrix";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } }),
};

const riskColors: Record<string, { dot: string; text: string; rowBorder: string }> = {
  LOW: { dot: "bg-emerald-400", text: "text-emerald-400", rowBorder: "border-l-emerald-400/40" },
  MEDIUM: { dot: "bg-amber-400", text: "text-amber-400", rowBorder: "border-l-amber-400/40" },
  HIGH: { dot: "bg-red-400", text: "text-red-400", rowBorder: "border-l-red-400/40" },
};

const RESEARCH_VERIFIED_IDS = new Set(["snapchat", "discord", "telegram"]);

function ExpandableRow({ row, index }: { row: (typeof PLATFORM_MATRIX)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colors = riskColors[row.risk];
  const isVerified = RESEARCH_VERIFIED_IDS.has(row.id);
  const isLong = row.bannedTriggers.length > 3 || row.safeApproach.length > 120 || row.notes.length > 120;

  return (
    <>
      <tr
        key={row.id}
        className={`border-b border-border/30 border-l-2 ${colors.rowBorder} hover:bg-surface-raised/50 transition-colors cursor-pointer`}
        onClick={() => isLong && setExpanded(!expanded)}
      >
        <td className="px-5 py-4 text-foreground font-medium whitespace-nowrap">
          <span className="flex items-center gap-2">
            {isLong && (
              <span className="text-muted-foreground/50">
                {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </span>
            )}
            {row.name}
            {isVerified && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold tracking-wider bg-electric/10 text-electric border border-electric/20">SOURCED</span>
            )}
          </span>
        </td>
        <td className="px-5 py-4 whitespace-nowrap">
          <span className="inline-flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${colors.dot}`} />
            <span className={`${colors.text} font-medium`}>{row.risk}</span>
          </span>
        </td>
        <td className="px-5 py-4 text-foreground/85 text-xs leading-relaxed max-w-xs">
          <span className={isLong ? (expanded ? "" : "line-clamp-2") : ""}>
            {row.bannedTriggers.join(", ")}
          </span>
        </td>
        <td className="px-5 py-4 text-foreground/85 text-xs leading-relaxed max-w-xs">
          <span className={isLong ? (expanded ? "" : "line-clamp-2") : ""}>
            {row.safeApproach}
          </span>
        </td>
        <td className="px-5 py-4 text-foreground/85 text-xs leading-relaxed max-w-xs">
          <span className={isLong ? (expanded ? "" : "line-clamp-2") : ""}>
            {row.notes}
          </span>
        </td>
      </tr>
    </>
  );
}

export default function CompliancePage() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/nectar-atmo-compliance.png)', filter: 'brightness(1.5)' }}
        />
        <div className="absolute inset-0 bg-[#121827]/[0.78]" />
      </div>

      <NectarOrbs />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.header className="max-w-3xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-mono text-xs tracking-widest uppercase text-electric mb-4">Protect Before You Post</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Platform Compliance Matrix</h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            A strategic reference for the risk signals Nectar looks for across nine publishing environments. Use it to understand the kinds of language and behavior that deserve a second look before publishing.
          </p>
          <p className="text-sm text-electric hover:text-electric/80 transition-colors mb-3"><Link href="/scanner" className="inline-flex items-center gap-1">Have content ready? Open the Scanner <ExternalLink className="h-3 w-3" /></Link></p>
          <p className="text-sm text-zinc-300 leading-relaxed rounded-lg border border-amber-400/25 bg-amber-400/5 px-4 py-3">
            This is educational guidance, not a guarantee of compliance. Platform rules and enforcement change, and requirements vary by region, account history, content category, and format. Always verify the current rules directly with the platform before publishing.
          </p>
        </motion.header>

        <Separator className="my-8 bg-border/60" />

        <div className="overflow-x-auto rounded-xl border border-border/60 sm:sticky sm:top-[64px] sm:z-20">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-surface-raised"><tr>
              {['Platform','Risk Level','Risk Signals','Safer Approach','Posting Guidance'].map((heading) => <th key={heading} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">{heading}</th>)}
            </tr></thead>
            <tbody>{PLATFORM_MATRIX.map((row, i) => {
              return <ExpandableRow key={row.id} row={row} index={i} />;
            })}</tbody>
          </table>
        </div>

        <motion.div className="mt-6 flex items-center gap-3" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold tracking-wider bg-electric/10 text-electric border border-electric/20">SOURCED</span>
          <p className="font-mono text-xs text-zinc-400">Indicates policy data individually researched and cited in source code.</p>
        </motion.div>

        <motion.p className="mt-3 font-mono text-xs text-zinc-400" variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          Reference data is maintained as strategic guidance. Verify current platform policies directly before publishing.
        </motion.p>
      </section>
      <BottomNavRow />
    </>
  );
}
