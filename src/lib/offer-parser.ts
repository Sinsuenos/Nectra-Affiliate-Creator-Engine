/* ------------------------------------------------------------------ */
/*  LIGHTWEIGHT OFFER FIELD EXTRACTION (deterministic, no AI)       */
/* ------------------------------------------------------------------ */

export interface ParsedField {
  key: string;
  label: string;
  value: string;
}

interface FieldDef {
  key: string;
  label: string;
  patterns: RegExp[];
}

const FIELD_DEFS: FieldDef[] = [
  { key: "offer_name", label: "Offer Name", patterns: [/^(?:offer[_ ]?name|product)[\s:\-]+(.+)/im, /^(.+)\s*[\-]\s*(?:mature|dating|platform|offer|product)/im] },
  { key: "network_id", label: "Network ID", patterns: [/network[\s:]+([^|\n]+)/im] },
  { key: "vertical", label: "Vertical", patterns: [/vertical[\s:]+([^\n]+)/im] },
  { key: "payout_model", label: "Payout Model", patterns: [/payout[\s:]+([^\n]+)/im] },
  { key: "conversion_flow", label: "Conversion Flow", patterns: [/conversion[_ ]?flow[\s:]+([^\n]+)/im, /flow[\s:]+([^\n]+)/im] },
  { key: "top_geo", label: "Top Geo", patterns: [/top[_ ]?geo[\s:]+([^\n]+)/im] },
  { key: "landing_page", label: "Landing Page URL", patterns: [/landing[_ ]?page[\s:]+(https?:\/\/[^\s\n]+)/im] },
  { key: "banned_traffic", label: "Banned Traffic Types", patterns: [/banned[_ ]?traffic[\s:]+([^\n]+)/im] },
  { key: "subid_format", label: "Sub-ID Format", patterns: [/sub[_ ]?id[\s:]+([^\n]+)/im] },
];

export function extractFields(text: string): ParsedField[] {
  return FIELD_DEFS.map((def) => {
    for (const pat of def.patterns) {
      const m = text.match(pat);
      if (m && m[1] && m[1].trim().length > 0) {
        return { key: def.key, label: def.label, value: m[1].trim().replace(/[|].*$/, "").trim() };
      }
    }
    return { key: def.key, label: def.label, value: "Not detected" };
  });
}

/* ------------------------------------------------------------------ */
/*  SLUGIFY OFFER NAME FOR SUB-IDS                                     */
/* ------------------------------------------------------------------ */

export function slugify(text: string): string {
  const firstLine = text.split("\n")[0];
  const cleaned = firstLine
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join("_")
    .toLowerCase();
  return cleaned || "offer";
}

export interface SubIDEntry {
  platform: string;
  tag: string;
}

export const SUBID_PLATFORMS = [
  { platform: "X", prefix: "x" },
  { platform: "TikTok", prefix: "tt" },
  { platform: "Pinterest", prefix: "pin" },
  { platform: "Reddit", prefix: "rd" },
  { platform: "Instagram", prefix: "ig" },
  { platform: "Facebook", prefix: "fb" },
];
