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

/*
 * Affiliate offer sheets are not standardized. Keep this parser
 * deliberately deterministic, but recognize the common variants seen
 * in real network exports, including "Id: 10464" and title-first sheets
 * such as "OhChat - PPS".
 */
const FIELD_DEFS: FieldDef[] = [
  {
    key: "offer_name",
    label: "Offer Name",
    patterns: [
      /^(?:offer[\s_-]?name|product|campaign)[\s:\-]+(.+)/im,
      /^([^\n]+?)\s+-\s+(?:PPS|CPA|CPL|CPI|CPS|RevShare|REVSHARE)\s*$/im,
      /^([^\n]+?)\s+-\s+(?:mature|dating|platform|offer|product)\b.*$/im,
    ],
  },
  {
    key: "network_id",
    label: "Offer ID",
    patterns: [
      /^(?:offer[\s_-]?id|network[\s_-]?id|id)[\s:#-]+([^\n|]+)/im,
    ],
  },
  {
    key: "vertical",
    label: "Vertical",
    patterns: [/^vertical[\s:]+([^\n]+)/im],
  },
  {
    key: "payout_model",
    label: "Payout Model",
    patterns: [/^payout[\s:]+([^\n]+)/im],
  },
  {
    key: "conversion_flow",
    label: "Conversion Flow",
    patterns: [
      /^conversion[\s_-]?flow[\s:]+([^\n]+)/im,
      /^flow[\s:]+([^\n]+)/im,
    ],
  },
  {
    key: "top_geo",
    label: "Top Geo",
    patterns: [/^top[\s_-]?geo[\s:]+([^\n]+)/im],
  },
  {
    key: "landing_page",
    label: "Landing Page URL",
    patterns: [
      /^landing[\s_-]?page[\s:]+(https?:\/\/[^\s\n]+)/im,
      /^default[\s_-]?landing[\s_-]?page[\s:]+(https?:\/\/[^\s\n]+)/im,
    ],
  },
  {
    key: "banned_traffic",
    label: "Banned Traffic Types",
    patterns: [
      /^banned[\s_-]?traffic(?:[\s_-]?types)?[\s:]+([^\n]+)/im,
      /^prohibited[\s_-]?traffic(?:[\s_-]?types)?[\s:]+([^\n]+)/im,
    ],
  },
  {
    key: "subid_format",
    label: "Sub-ID Format",
    patterns: [
      /^sub[\s_-]?id[\s_-]?format[\s:]+([^\n]+)/im,
      /^sub[\s_-]?id[\s:]+([^\n]+)/im,
    ],
  },
];

function cleanCapturedValue(value: string): string {
  return value
    .trim()
    .replace(/^[|\s]+|[|\s]+$/g, "")
    .replace(/[|].*$/, "")
    .trim();
}

function extractOfferNameFromFirstLine(text: string): string | null {
  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return null;

  /* Prefer explicit labeled fields over the heuristic title line. */
  if (/^(?:offer[\s_-]?name|product|campaign)\s*[:\-]/i.test(firstLine)) {
    return null;
  }

  /* Common network shorthand: "OhChat - PPS". */
  const shorthand = firstLine.match(
    /^(.+?)\s+-\s+(?:PPS|CPA|CPL|CPI|CPS|RevShare|REVSHARE)\s*$/i,
  );
  if (shorthand?.[1]) return cleanCapturedValue(shorthand[1]);

  /* A bare first line is a valid offer title when the document clearly
     contains affiliate metadata elsewhere. Avoid treating a URL or label
     line as a product name. */
  if (/^https?:\/\//i.test(firstLine)) return null;
  if (/^(?:network|vertical|payout|conversion|top\s+geo|landing|default\s+landing|banned|accepted\s+countries|parsed\s+fields)\b/i.test(firstLine)) {
    return null;
  }

  return cleanCapturedValue(firstLine);
}

export function extractFields(text: string): ParsedField[] {
  return FIELD_DEFS.map((def) => {
    for (const pat of def.patterns) {
      const m = text.match(pat);
      if (m && m[1] && m[1].trim().length > 0) {
        return {
          key: def.key,
          label: def.label,
          value: cleanCapturedValue(m[1]),
        };
      }
    }

    if (def.key === "offer_name") {
      const inferred = extractOfferNameFromFirstLine(text);
      if (inferred) {
        return { key: def.key, label: def.label, value: inferred };
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
