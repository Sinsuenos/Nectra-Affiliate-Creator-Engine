import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

export const metadata = {
  title: "Dating Discovery | Sinaloa Sueños",
  description: "A clean, adults-only discovery page for legitimate dating services and offers.",
};

export default function DatingDiscovery() {
  return (
    <main className="min-h-screen bg-[#080a10] text-white">
      <section className="relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(244,114,182,.18),transparent_30%),radial-gradient(circle_at_20%_70%,rgba(34,184,255,.12),transparent_30%)]" /><div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28"><Link href="/" className="font-mono text-xs uppercase tracking-[.22em] text-white/45">Sinaloa Sueños</Link><div className="mt-12 max-w-4xl"><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs uppercase tracking-[.18em] text-white/60"><Heart className="h-4 w-4 text-pink-300" /> Adults 18+</div><h1 className="mt-6 text-5xl font-black leading-[.98] tracking-[-.04em] sm:text-7xl">Meet people.<br /><span className="bg-gradient-to-r from-pink-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">Choose your connection.</span></h1><p className="mt-7 max-w-3xl text-lg leading-8 text-white/60 sm:text-xl">A clean discovery experience for adults looking for legitimate dating and connection services. Compare the kind of experience you want, then choose a service that fits.</p></div></div></section>
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8"><div className="grid gap-5 md:grid-cols-3">{[["Real connections","Profiles, conversations, and people looking to meet."] ,["Your pace","Choose services based on the experience and features that suit you."] ,["Clear choices","We aim to describe destinations honestly, with no fake promises or guaranteed-match claims."]].map(([title,body]) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[.035] p-7"><Sparkles className="h-5 w-5 text-pink-300" /><h2 className="mt-5 text-2xl font-bold">{title}</h2><p className="mt-3 leading-7 text-white/50">{body}</p></article>)}</div><div className="mt-8 rounded-3xl border border-pink-300/15 bg-pink-300/[.04] p-8"><h2 className="text-3xl font-black">Offers are coming next.</h2><p className="mt-3 max-w-2xl leading-7 text-white/55">This page is ready for verified, permitted dating destinations. Affiliate relationships and disclosures will be added only where the underlying offer permits the traffic source.</p></div></section>
    </main>
  );
}
