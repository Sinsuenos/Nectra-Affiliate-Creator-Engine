import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nectar Engine — Affiliate Content Architecture System",
  description: "A 9-module engine that architects, generates, and packages compliant affiliate content systems. Built for affiliates working high-risk, tightly-restricted verticals.",
  icons: { icon: "/favicon.svg" },
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
        <Analytics />
      </body>
    </html>
  );
}