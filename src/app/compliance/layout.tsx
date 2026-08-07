import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nectar Engine — Platform Compliance Matrix",
  description:
    "Risk levels, banned triggers, mitigation strategies, and posting frequency advice for 9 platforms: X, TikTok, Instagram, Facebook, Reddit, Pinterest, Snapchat, Discord, and Telegram.",
};

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
