import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
      <p className="font-mono text-sm uppercase tracking-widest text-electric">Nectar Engine</p>
      <h1 className="mt-3 text-5xl font-bold tracking-tight">Contact</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Questions about Nectar Engine, technical problems, or purchase support?
      </p>
      <p className="mt-4 text-lg">
        Email <a className="text-electric hover:underline" href="mailto:sinaloainspireddreams@gmail.com">sinaloainspireddreams@gmail.com</a>.
      </p>
      <p className="mt-8 text-sm text-muted-foreground">
        Nectar Engine is a high-risk affiliate workflow tool. It provides strategic and platform-specific risk signals, not legal advice or guaranteed platform approval.
      </p>
      <Link href="/" className="mt-8 inline-block text-electric hover:underline">Back to Nectar Engine</Link>
    </main>
  );
}
