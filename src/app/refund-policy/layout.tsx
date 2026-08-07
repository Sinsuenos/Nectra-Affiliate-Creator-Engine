import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nectar Engine — Refund Policy",
  description:
    "All sales final due to instant digital delivery. Contact support within 48 hours for technical issues. Full refund policy for Nectar Engine.",
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
