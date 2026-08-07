import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nectar Engine — Terms of Service",
  description:
    "Terms of service for Nectar Engine: use license, user responsibilities, no guarantee of platform compliance outcomes, and intellectual property terms.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
