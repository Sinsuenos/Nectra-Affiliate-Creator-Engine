"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NectarOrbs } from "@/components/nectar-orbs";
import { CompactTransformationRail } from "@/components/transformation-rail";
import { GUMROAD_URL } from "@/lib/constants";
import {
  ClipboardPaste,
  ChevronDown,
  ChevronRight,
  Pencil,
  Check,
  Tag,
  Loader2,
  FileText,
  ShieldCheck,
  Send,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Copy,
} from "lucide-react";
import {
  extractFields,
  slugify,
  SUBID_PLATFORMS,
  type SubIDEntry,
} from "@/lib/offer-parser";

/* ------------------------------------------------------------------ */
/*  ANIMATION                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  DEMO PASTE TEXT (Cozy 50+ offer)                                   */
/* ------------------------------------------------------------------ */
const DEMO_PASTE =
  "Cozy 50+ — Mature Dating & Companionship Platform\n" +
  "Network: ClickDealer | Offer ID: CZ-5021\n" +
  "Vertical: Dating / Mature\n" +
  "Payout: $55 CPA (CC Submit)\n" +
  "Conversion Flow: Free Account Registration → CC Age Verification → $1 Trial → Rebill $49.99/mo\n" +
  "Top Geo: US, CA, UK, AU, NZ\n" +
  "Landing Page: https://example.com/offer/cozy50\n" +
  "Banned Traffic: Incentivized, Bot, Brand Search, Email Spam, Craigslist, Craigslist-adjacent, Social Sprinkling\n" +
  "Sub-ID Format: {sub1}_{sub2}_{sub3}\n\n" +
  "Key offer details:\n" +
  "- 2.4M+ active members, 58% female demographic aged 45-65\n" +
  "- AI-powered compatibility matching with 89% satisfaction rate\n" +
  "- Verified profile badges, photo verification, and real-time chat\n" +
  "- Free trial: 7-day full access, $1 age verification charge\n" +
  "- Target audience: Adults 45+ seeking companionship or serious dating after divorce/widowhood\n" +
  "- Unique angle: highest female-to-male ratio in the mature dating vertical (3.2:1)\n" +
  "- Content restriction: NO explicit or sexually suggestive language. Frame as companionship, connection, and meeting new people.\n" +
  "- Affiliate/redirect link: https://track.clickdealer.com/?a=1234&sub1={sub1}&sub2={sub2}";

/* ------------------------------------------------------------------ */
/*  VALIDATE OFFER INPUT                                               */
/* ------------------------------------------------------------------ */
function validateOfferInput(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return "Please paste your offer details before generating.";
  if (trimmed.length < 20) return "Input is too short — paste at least a full offer description.";
  const lower = trimmed.toLowerCase();
  const offerSignals = ["offer", "payout", "network", "vertical", "cpa", "cpl", "revshare", "conversion flow", "geo", "landing page", "trial", "affiliate", "traffic"];
  const signalCount = offerSignals.filter((s) => lower.includes(s)).length;
  if (signalCount === 0) return "This doesn't look like an affiliate offer. Include details like payout, network, vertical, and conversion flow.";
  return null;
}
