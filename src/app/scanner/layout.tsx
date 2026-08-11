import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nectar Engine — Compliance Scanner",
  description:
    "Paste a post, pick platforms, and get a Pass / Warning / Fail verdict with safer rewrites. Built for affiliates working high-risk verticals.",
};

export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
