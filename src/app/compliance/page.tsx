"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { PLATFORM_MATRIX } from "@/lib/compliance/platform-matrix";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } }),
};

const riskColors: Record<string, { dot: string; text: string }> = {
  LOW: { dot: "bg-emerald-400", text: "text-emerald-400" },
  MEDIUM: { dot: "bg-amber-400", text: "text-amber-400" },
  HIGH: { dot: "bg-red-400", text: "text-red-400" },
};

export default function CompliancePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.header className="max-w-3xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-mono text-xs tracking-widest uppercase text-electric mb-4">Protect Before You Post</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Platform Compliance Matrix</h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            A strategic reference for the risk signals Nectar looks for across nine publishing environments. Use it to understand the kinds of language and behavior that deserve a second look before publishing.
          </p>
          <p className="text-sm text-electric hover:text-electric/80 transition-colors mb-3"><Link href="/scanner">Have content ready? Open the Scanner →</Link></p>
          <p className="text-sm text-muted-foreground/70 leading-relaxed rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3">
            This is educational guidance, not a guarantee of compliance. Platform rules and enforcement change, and requirements vary by region, account history, content category, and format. Always verify the current rules directly with the platform before publishing.
          </p>
        </motion.header>

        <Separator className="my-8 bg-border/60" />

        <motion.div className="overflow-x-auto rounded-xl border border-border/60" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-surface-raised"><tr>
              {['Platform','Risk Level','Risk Signals','Safer Approach','Posting Guidance'].map((heading) => <th key={heading} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">{heading}</th>)}
            </tr></thead>
            <tbody>{PLATFORM_MATRIX.map((row, i) => { const colors = riskColors[row.risk]; return (
              <tr key={row.id} className="border-b border-border/30 last:border-0 hover:bg-surface-raised/50 transition-colors">
                <td className="px-5 py-4 text-foreground font-medium whitespace-nowrap">{row.name}</td>
                <td className="px-5 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-2"><span className={`inline-block h-2 w-2 rounded-full ${colors.dot}`} /><span className={`${colors.text} font-medium`}>{row.risk}</span></span></td>
                <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">{row.bannedTriggers.join(", ")}</td>
                <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">{row.safeApproach}</td>
                <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">{row.notes}</td>
              </tr>
            ); })}</tbody>
          </table>
        </motion.div>

        <motion.p className="mt-6 font-mono text-xs text-muted-foreground/60" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          Reference data is maintained as strategic guidance. Verify current platform policies directly before publishing.
        </motion.p>
      </section>
    </>
  );
}
