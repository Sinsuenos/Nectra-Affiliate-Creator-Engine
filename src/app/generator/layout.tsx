import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nectar Engine — Content Generator",
  description:
    "Paste raw offer details from any source. The engine parses fields, reviews them, and generates a complete content toolkit with promo angles and platform-specific social posts.",
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
