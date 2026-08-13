import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nectar Engine — Affiliate Content Architecture System",
  description: "A 9-module engine that architects, generates, and packages compliant affiliate content systems. Built for affiliates working high-risk, tightly-restricted verticals.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { title: "Nectar Engine", description: "A 9-module engine that architects, generates, and packages compliant affiliate content systems.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
          <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]" aria-hidden="true">
            <img src="/nectar-glow.svg" alt="" className="absolute -right-[18vw] top-[12vh] w-[70vw] max-w-[1000px] mix-blend-screen" />
          </div>
          <div className="relative z-10 flex min-h-screen flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </div>
        <Toaster />
        <Link
          href="/faq"
          className="fixed bottom-4 right-4 z-40 flex flex-col items-end text-sm text-amber-400/80 hover:text-amber-400 transition-colors duration-200"
        >
          <span className="font-medium">FAQ</span>
          <span className="text-[10px] opacity-70">Frequently Asked Questions. Unfortunately.</span>
        </Link>
        <Analytics />
      </body>
    </html>
  );
}