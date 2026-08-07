import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  title: "Nectra Engine — Affiliate Content Architecture System",
  description:
    "A 9-module engine that architects, generates, and deploys compliant affiliate content systems. Built for operators who need infrastructure, not templates.",
  keywords: [
    "Nectra Engine",
    "affiliate marketing",
    "content generation",
    "compliance automation",
    "funnel builder",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Nectra Engine",
    description:
      "A 9-module engine that architects, generates, and deploys compliant affiliate content systems.",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
