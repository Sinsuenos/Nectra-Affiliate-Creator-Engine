import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nectar Engine — Sample Output",
  description:
    "See a full content toolkit generated for a demo offer: headlines, body copy, email sequences, social posts, CTA variations, and compliance scan results.",
};

export default function SampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
