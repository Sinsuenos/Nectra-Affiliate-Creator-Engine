import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nectar Engine — Privacy Policy",
  description:
    "No accounts required. No platform credentials collected. No user data sold. Full privacy policy for Nectar Engine."
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
