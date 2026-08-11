import { PLATFORM_MATRIX } from "./platform-matrix";

const PLATFORM_ALIASES: Readonly<Record<string, string>> = {
  x: "x",
  twitter: "x",
  "x (twitter)": "x",
  tiktok: "tiktok",
  instagram: "instagram",
  facebook: "facebook",
  reddit: "reddit",
  pinterest: "pinterest",
  snapchat: "snapchat",
  discord: "discord",
  telegram: "telegram",
};

const HINT_CATEGORIES: Readonly<Record<string, readonly string[]>> = {
  solicitation_language: [
    "buy now",
    "sign up",
    "join now",
    "click here",
    "use my link",
    "check it out",
  ],
  urgency_cta: [
    "act now",
    "limited time",
    "don't miss",
    "only today",
    "last chance",
    "only a few left",
  ],
  guarantee_claims: [
    "guaranteed",
    "guarantee",
    "risk free",
    "no risk",
    "will cure",
    "100% effective",
  ],
  disclosure_language: [
    "#ad",
    "#sponsored",
    "paid partnership",
    "affiliate link",
    "affiliate",
    "sponsored",
  ],
};

/** Normalize common platform labels to Nectar's canonical platform ids. */
export function normalizePlatformId(value: string): string | null {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  return PLATFORM_ALIASES[normalized] ?? null;
}

/** Return the nine platform ids represented by the compliance data layer. */
export function listSelectablePlatforms(): string[] {
  return PLATFORM_MATRIX.map((platform) => platform.id);
}

/** Return lightweight phrase/category hints for future scanner prompt construction. */
export function listPhraseCategoryHints(): Readonly<Record<string, readonly string[]>> {
  return HINT_CATEGORIES;
}

/** Categorize an input phrase using deterministic substring hints only. */
export function categorizePhraseHints(text: string): string[] {
  const normalized = text.toLowerCase();
  return Object.entries(HINT_CATEGORIES)
    .filter(([, phrases]) => phrases.some((phrase) => normalized.includes(phrase)))
    .map(([category]) => category);
}
