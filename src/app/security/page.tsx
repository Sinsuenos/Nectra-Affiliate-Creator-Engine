import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Creator Security | Sinaloa Sueños",
  description: "Practical defensive resources for creators working with AI, public content, and digital workflows.",
};

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#070910] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(34,184,255,.16),transparent_30%),radial-gradient(circle_at_15%_70%,rgba(217,70,239,.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Link href="/" className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">← Sinaloa Sueños Tools</Link>
          <div className="mt-10 max-w-4xl"><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 font-mono text-xs uppercase tracking-[.2em] text-white/60"><LockKeyhole className="h-4 w-4 text-cyan-300" /> Creator protection</div><h1 className="mt-6 text-5xl font-black leading-[1] tracking-[-.04em] sm:text-7xl">Your work is public.<br /><span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Your workflow doesn't have to be.</span></h1><p className="mt-7 max-w-3xl text-lg leading-8 text-white/65 sm:text-xl">A practical security collection for independent creators who use AI, publish online, sell digital products, or simply want fewer surprises when their work leaves the laptop.</p></div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/[.035] p-7 sm:p-9"><ShieldCheck className="h-7 w-7 text-cyan-300" /><h2 className="mt-6 text-3xl font-bold">Agent Deflection</h2><p className="mt-4 leading-7 text-white/55">Defensive patterns for reducing unwanted instruction extraction, prompt hijacking, and accidental exposure when AI agents or automated systems interact with creator-facing material.</p><div className="mt-7 space-y-3 text-sm text-white/65"><p>• Think in boundaries, not magic shields.</p><p>• Reduce unnecessary exposure of sensitive instructions.</p><p>• Build workflows that assume inputs can be adversarial.</p></div></article>
        <article className="rounded-3xl border border-white/10 bg-white/[.035] p-7 sm:p-9"><LockKeyhole className="h-7 w-7 text-fuchsia-300" /><h2 className="mt-6 text-3xl font-bold">Creator Security Toolkit</h2><p className="mt-4 leading-7 text-white/55">Practical checklists and defensive guidance for creators who want tighter control over public content, digital assets, AI-facing surfaces, and the workflows connecting them.</p><div className="mt-7 space-y-3 text-sm text-white/65"><p>• Audit what your public workflow reveals.</p><p>• Harden the places where tools meet content.</p><p>• Keep useful separation between public and sensitive material.</p></div></article>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8"><div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[.04] p-8 sm:p-10"><p className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">THE POINT</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Security that fits the workflow you already have.</h2><p className="mt-4 max-w-3xl leading-7 text-white/55">These resources are defensive education and practical tooling. They do not promise perfect protection, legal compliance, or immunity from compromise.</p><Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black">Back to creator tools <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  );
}
