import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nectar Engine — The 9 Modules",
  description:
    "A 9-module closed-loop pipeline from niche research to packaged output. Each module feeds the next: intelligence, compliance, architecture, copy, funnels, email, landing pages, analytics, and delivery.",
};

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
