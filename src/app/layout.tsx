import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png?v=2",
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
          className="fixed bottom-4 right-4 z-40 flex flex-col items-end text-lg text-amber-400 hover:text-amber-400 transition-colors duration-200"
        >
          <span className="font-medium">FAQ</span>
          <span className="text-sm font-semibold text-amber-400">Frequently Asked Questions. Unfortunately.</span>
        </Link>
        <Analytics />
        {/* Google Analytics 4 — site-wide, fires on every page via root layout */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BN8WC7DQB6"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BN8WC7DQB6');
          `}
        </Script>
      </body>
    </html>
  );
}