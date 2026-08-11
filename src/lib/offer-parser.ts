/* ------------------------------------------------------------------ */
/*  LIGHTWEIGHT OFFER FIELD EXTRACTION                                */
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
 * Affiliate offer sheets are deliberately NOT standardized.
 * This parser must therefore recognize label aliases, Markdown/table
 * formatting, optional bullets, whitespace variations, and title-first
 * exports without being tied to one network or one offer format.
 *
 * Important: this is deterministic extraction only. It never invents a
 * value. If a field cannot be grounded in the pasted text, it remains
 * "Not detected".
 */
const LABEL_PREFIX = String.raw`(?:[-*•]\s*)?`;

const FIELD_DEFS: FieldDef[] = [
  {
    key: "offer_name",
    label: "Offer Name",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:offer[\\s_-]?name|offer|product|campaign|title)[\\s:#|\\-]+(.+)$`, "im"),
      /^\s*(?:\|\s*)?(.+?)\s*[-|]\s*(?:PPS|CPA|CPL|CPI|CPS|CPM|RevShare|REVSHARE)\s*(?:\|.*)?$/im,
    ],
  },
  {
    key: "network_id",
    label: "Offer ID",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:offer[\\s_-]?id|network[\\s_-]?id|network[\\s_-]?offer[\\s_-]?id|campaign[\\s_-]?id|id)[\\s:#|\\-]+([^\\n|]+)`, "im"),
    ],
  },
  {
    key: "vertical",
    label: "Vertical",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}vertical(?:\\s*\\/\\s*category|\\s*category)?[\\s:#|\\-]+([^\\n|]+)`, "im"),
      new RegExp(`^${LABEL_PREFIX}category[\\s:#|\\-]+([^\\n|]+)`, "im"),
      new RegExp(`^${LABEL_PREFIX}vertical[\\s:#|\\-]+([^\\n|]+)`, "im"),
    ],
  },
  {
    key: "payout_model",
    label: "Payout Model",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:default[\\s_-]?)?(?:payout|commission|rate)[\\s:#|\\-]+([^\\n|]+)`, "im"),
    ],
  },
  {
    key: "conversion_flow",
    label: "Conversion Flow",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:conversion[\\s_-]?flow|conversion|flow|funnel)[\\s:#|\\-]+([^\\n|]+)`, "im"),
    ],
  },
  {
    key: "top_geo",
    label: "Top Geo",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:top[\\s_-]?)?(?:geo|geos|countries|target[\\s_-]?countries|accepted[\\s_-]?countries)[\\s:#|\\-]+([^\\n|]+)`, "im"),
    ],
  },
  {
    key: "landing_page",
    label: "Landing Page URL",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:default[\\s_-]?)?(?:landing[\\s_-]?page|landing[\\s_-]?url|destination[\\s_-]?url|target[\\s_-]?url)[\\s:#|\\-]+(https?:\\/\\/[^\\s|]+)`, "im"),
    ],
  },
  {
    key: "banned_traffic",
    label: "Banned Traffic Types",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:banned|prohibited|restricted|forbidden)[\\s_-]?traffic(?:[\\s_-]?types)?[\\s:#|\\-]+([^\\n|]+)`, "im"),
      new RegExp(`^${LABEL_PREFIX}(?:traffic[\\s_-]?restrictions|traffic[\\s_-]?allowed|traffic[\\s_-]?sources)[\\s:#|\\-]+([^\\n|]+)`, "im"),
    ],
  },
  {
    key: "subid_format",
    label: "Sub-ID Format",
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:sub[\\s_-]?id|sub[\\s_-]?ids)(?:[\\s_-]?format)?[\\s:#|\\-]+([^\\n|]+)`, "im"),
      new RegExp(`^${LABEL_PREFIX}(?:tracking[\\s_-]?(?:token|format)|tracking[\\s_-]?parameters?)[\\s:#|\\-]+([^\\n|]+)`, "im"),
    ],
  },
];

function cleanCapturedValue(value: string): string {
  return value
    .trim()
    .replace(/^[|\s]+|[|\s]+$/g, "")
    .replace(/^[`\"']|[`\"']$/g, "")
    .replace(/\s+\|\s*$/, "")
    .trim();
}

function normalizedLines(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^\s+|\s+$/g, ""))
    .filter(Boolean);
}

function extractOfferNameFromFirstLine(text: string): string | null {
  const lines = normalizedLines(text);
  if (!lines.length) return null;

  const firstLine = lines[0].replace(/^[|\s]+|[|\s]+$/g, "");

  if (/^(?:offer[\s_-]?name|offer|product|campaign|title)\s*[:#|\-]/i.test(firstLine)) {
    return null;
  }

  /* Common network shorthand: "OhChat - PPS", "Offer X | CPA". */
  const shorthand = firstLine.match(
    /^(?:\|\s*)?(.+?)\s*(?:-|\|)\s*(?:PPS|CPA|CPL|CPI|CPS|CPM|RevShare|REVSHARE)\s*$/i,
  );
  if (shorthand?.[1]) return cleanCapturedValue(shorthand[1]);

  /* A bare first line can be the offer title. Reject obvious metadata,
     URLs, table separators, and section headings. */
  if (/^https?:\/\//i.test(firstLine)) return null;
  if (/^[-|]+$/.test(firstLine)) return null;
  if (/^(?:network|vertical|category|payout|commission|rate|conversion|flow|funnel|top\s+geo|geo|countries|landing|default\s+landing|banned|prohibited|restricted|accepted\s+countries|parsed\s+fields)\b/i.test(firstLine)) {
    return null;
  }

  return cleanCapturedValue(firstLine);
}

export function extractFields(text: string): ParsedField[] {
  const source = text.replace(/\r\n?/g, "\n");

  return FIELD_DEFS.map((def) => {
    for (const pat of def.patterns) {
      const m = source.match(pat);
      if (m?.[1] && m[1].trim().length > 0) {
        return {
          key: def.key,
          label: def.label,
          value: cleanCapturedValue(m[1]),
        };
      }
    }

    if (def.key === "offer_name") {
      const inferred = extractOfferNameFromFirstLine(source);
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
  const firstLine = normalizedLines(text)[0] ?? "";
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
