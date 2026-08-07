import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nectar Engine — Affiliate Content Architecture System",
  description:
    "A 9-module engine that architects, generates, and packages compliant affiliate content systems. Built for operators who need infrastructure, not templates.",
  keywords: [
    "Nectar Engine",
    "affiliate marketing",
    "content generation",
    "compliance automation",
    "content architecture",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Nectar Engine",
    description:
      "A 9-module engine that architects, generates, and packages compliant affiliate content systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}