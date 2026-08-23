/* ------------------------------------------------------------------ */
/*  ROBUST OFFER FIELD EXTRACTION                                     */
/* ------------------------------------------------------------------ */

import { extractRestrictions } from "./restriction-parser";

export interface ParsedField {
  key: string;
  label: string;
  value: string;
}

interface FieldDef {
  key: string;
  label: string;
  aliases: string[];
  patterns: RegExp[];
}

const LABEL_PREFIX = String.raw`(?:[-*•]\s*)?`;

// Known conversion-type tokens that may appear inside a payout string.
// Used to derive a normalized Conversion Flow value when no explicit
// "Conversion Flow:" label exists in the source.
const CONVERSION_TYPE_MAP: Record<string, string> = {
  PPS: "Pay Per Sale",
  CPA: "Cost Per Action",
  CPL: "Cost Per Lead",
  CPI: "Cost Per Install",
  CPS: "Cost Per Sale",
  CPM: "Cost Per Mille",
  RevShare: "Revenue Share",
  REVSHARE: "Revenue Share",
  "REVENUE SHARE": "Revenue Share",
  PPC: "Pay Per Click",
  PPV: "Pay Per View",
};

function normalizeConversionType(token: string): string | null {
  const upper = token.toUpperCase().replace(/[^A-Z]/g, "");
  if (upper === "PPS") return "PPS (Pay Per Sale)";
  if (upper === "CPA") return "CPA (Cost Per Action)";
  if (upper === "CPL") return "CPL (Cost Per Lead)";
  if (upper === "CPI") return "CPI (Cost Per Install)";
  if (upper === "CPS") return "CPS (Cost Per Sale)";
  if (upper === "CPM") return "CPM (Cost Per Mille)";
  if (upper === "PPC") return "PPC (Pay Per Click)";
  if (upper === "PPV") return "PPV (Pay Per View)";
  if (upper === "REVENUESHARE" || upper === "REVSHARE") return "RevShare (Revenue Share)";
  return null;
}

const FIELD_DEFS: FieldDef[] = [
  {
    key: "offer_name",
    label: "Offer Name",
    aliases: ["offer name", "offer", "product", "campaign", "title", "offer title", "product name"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:offer[\\s_-]?name|offer[\\s_-]?title|product[\\s_-]?name|campaign|title)[\\s:#|=\\-]+(.+)$`, "im")],
  },
  {
    key: "network_id",
    label: "Offer ID",
    aliases: ["offer id", "network id", "network offer id", "campaign id", "campaign", "id"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:offer[\\s_-]?id|network[\\s_-]?id|network[\\s_-]?offer[\\s_-]?id|campaign[\\s_-]?id|id)[\\s:#|=\\-]+([^\\n|]+)`, "im")],
  },
  {
    key: "vertical",
    label: "Vertical",
    aliases: ["vertical", "category", "vertical category"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:vertical(?:\\s*\\/\\s*category|\\s*category)?|category)[\\s:#|=\\-]+([^\\n|]+)`, "im")],
  },
  {
    key: "payout_model",
    label: "Payout Model",
    aliases: ["payout", "default payout", "payout model", "commission", "commission rate", "rate", "default commission"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:(?:default[\\s_-]?)?payout(?:[\\s_-]?model)?|commission(?:[\\s_-]?rate)?|rate)[\\s:#|=\\-]+([^\\n|]+)`, "im")],
  },
  {
    key: "conversion_flow",
    label: "Conversion Flow",
    aliases: ["conversion flow", "conversion", "flow", "funnel", "conversion event", "conversion type"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:conversion[\\s_-]?flow|conversion[\\s_-]?event|conversion[\\s_-]?type|conversion|flow|funnel)[\\s:#|=\\-]+([^\\n|]+)`, "im")],
  },
  {
    key: "top_geo",
    // Label reflects what is actually being extracted from affiliate-network offer text.
    // Source data lines like "Top Performing Countries: FR,SG,UK,US" describe top
    // performers, not guaranteed availability — keeping the label honest prevents
    // implying broader geo availability than the source actually states.
    label: "Top Performing Countries",
    aliases: [
      "top performing countries",
      "top-performing countries",
      "top countries",
      "performing countries",
      "top geo",
      "geo",
      "geos",
      "countries",
      "target countries",
      "accepted countries",
      "allowed countries",
      "available countries",
    ],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:top[\\s_-]?performing[\\s_-]?countries|top[\\s_-]?countries|performing[\\s_-]?countries|(?:top[\\s_-]?)?(?:geo|geos)|target[\\s_-]?countries|accepted[\\s_-]?countries|allowed[\\s_-]?countries|available[\\s_-]?countries)[\\s:#|=\\-]+([^\\n|]+)`, "im")],
  },
  {
    key: "landing_page",
    label: "Landing Page URL",
    aliases: ["landing page", "landing page url", "default landing page", "default landing page url", "landing url", "destination url", "target url", "offer url", "url"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:(?:default[\\s_-]?)?landing[\\s_-]?(?:page|url)|destination[\\s_-]?url|target[\\s_-]?url|offer[\\s_-]?url)[\\s:#|=\\-]+(https?:\\/\\/[^\\s|]+)`, "im")],
  },
  {
    key: "banned_traffic",
    label: "Banned Traffic Types",
    aliases: ["banned traffic", "banned traffic types", "prohibited traffic", "restricted traffic", "forbidden traffic", "traffic restrictions", "traffic allowed", "traffic sources", "restrictions", "restricted", "prohibited", "forbidden", "banned"],
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:banned|prohibited|restricted|forbidden)[\\s_-]?traffic(?:[\\s_-]?types)?[\\s:#|=\\-]+([^\\n|]+)`, "im"),
      new RegExp(`^${LABEL_PREFIX}(?:traffic[\\s_-]?restrictions|traffic[\\s_-]?allowed|traffic[\\s_-]?sources)[\\s:#|=\\-]+([^\\n|]+)`, "im"),
      // Bare "Restrictions No Incentive No Bot ..." (no colon, no "traffic" word).
      // Captures everything after the heading on the same line.
      new RegExp(`^${LABEL_PREFIX}(?:restrictions?|prohibited|forbidden|banned)[\\s:#|=\\-]+(.+)$`, "im"),
    ],
  },
  {
    key: "subid_format",
    label: "Sub-ID Format",
    aliases: ["sub id", "sub-id", "sub ids", "sub-ids", "sub id format", "sub-id format", "tracking token", "tracking format", "tracking parameters"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:sub[\\s_-]?id(?:s)?(?:[\\s_-]?format)?|tracking[\\s_-]?(?:token|format)|tracking[\\s_-]?parameters?)[\\s:#|=\\-]+([^\\n|]+)`, "im")],
  },
];

const COMMON_VERTICALS: Array<[string, string[]]> = [
  ["Dating", ["dating", "singles", "matchmaking", "dating platform", "dating site", "dating app"]],
  ["Adult", ["adult", "cams", "webcam", "porn", "explicit", "onlyfans", "ppv", "pay-per-view", "creator platform"]],
  ["Gaming", ["gaming", "games", "gamer", "geek culture"]],
  ["Finance", ["finance", "financial", "loan", "forex", "trading", "banking"]],
  ["Crypto", ["crypto", "cryptocurrency", "bitcoin", "ethereum"]],
  ["Health", ["health", "wellness", "supplement", "telehealth"]],
  ["E-commerce", ["ecommerce", "e-commerce", "online store"]],
  ["Software", ["software", "saas"]],
  ["Travel", ["travel", "hotel", "flight", "vacation"]],
];

function cleanCapturedValue(value: string): string {
  return value.trim().replace(/^[|\s]+|[|\s]+$/g, "").replace(/^[`\"']|[`\"']$/g, "").replace(/\s+\|\s*$/, "").trim();
}

function normalizedLines(text: string): string[] {
  return text.replace(/\r\n?/g, "\n").split("\n").map((line) => line.trim()).filter(Boolean);
}

function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[|*_`]/g, " ").replace(/[–—]/g, "-").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function stripFormatting(value: string): string {
  return cleanCapturedValue(value.replace(/^\*+|\*+$/g, ""));
}

function extractTableValue(lines: string[], aliases: string[]): string | null {
  const aliasSet = new Set(aliases.map(normalizeLabel));
  for (const line of lines) {
    if (!line.includes("|")) continue;
    const cells = line.split("|").map((cell) => stripFormatting(cell));
    if (cells.length < 2) continue;
    const label = normalizeLabel(cells[0]);
    if (!aliasSet.has(label)) continue;
    const value = cells.slice(1).find((cell) => cell && !/^[-:]+$/.test(cell));
    if (value) return value;
  }
  return null;
}

function extractInlineKeyValue(lines: string[], aliases: string[]): string | null {
  const aliasPatterns = aliases
    .map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[ _-]+/g, "[\\s_-]*"))
    .sort((a, b) => b.length - a.length);
  if (!aliasPatterns.length) return null;
  const pattern = new RegExp(`^${LABEL_PREFIX}(?:${aliasPatterns.join("|")})[\\s:#|=\\-]+(.+)$`, "i");
  for (const line of lines) {
    const match = line.match(pattern);
    if (match?.[1]) {
      const value = cleanCapturedValue(match[1]);
      if (value) return value;
    }
  }
  return null;
}

function extractFollowingLineValue(lines: string[], aliases: string[]): string | null {
  const aliasSet = new Set(aliases.map(normalizeLabel));
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const cleaned = normalizeLabel(raw.replace(/[:=]+\s*$/, ""));
    if (!aliasSet.has(cleaned)) continue;
    const next = lines[i + 1];
    if (!next) continue;
    const value = stripFormatting(next);
    if (value && !aliasSet.has(normalizeLabel(value))) return value;
  }
  return null;
}

function extractStandaloneUrl(lines: string[]): string | null {
  for (const line of lines) {
    const match = line.match(/^(?:\[[^\]]*\]\()?\s*(https?:\/\/\S+?)(?:\)\s*)?$/i);
    if (match?.[1]) return match[1].replace(/[),.;]+$/, "");
  }
  return null;
}

function extractOfferNameFromFirstLine(lines: string[]): string | null {
  if (lines.length === 0) return null;
  const first = cleanCapturedValue(lines[0]);
  if (!first || first.length < 2 || first.length > 120) return null;
  if (/^https?:\/\//i.test(first)) return null;
  if (/^(?:network|offer|vertical|payout|conversion|banned|sub[- ]?id|landing|default|id|epc|device|exclusive|hot pick|cam)\b/i.test(first)) return null;
  return first;
}

function extractOfferNameFromProse(lines: string[]): string | null {
  for (const rawLine of lines.slice(0, 6)) {
    const line = rawLine.replace(/^\[[^\]]*\]\s*/, "").trim();
    const match = line.match(/^(.+?)\s+is\s+(?:a|an|the)\s+/i);
    if (match?.[1]) {
      const candidate = cleanCapturedValue(match[1]);
      if (candidate.length >= 2 && candidate.length <= 80) return candidate;
    }
  }
  return null;
}

function extractOfferNameFromFirstMeaningfulLine(lines: string[]): string | null {
  for (const rawLine of lines.slice(0, 8)) {
    const line = rawLine.replace(/^[|\s]+|[|\s]+$/g, "");
    if (!line || /^[-|:]+$/.test(line)) continue;
    const shorthand = line.match(/^(?:\|\s*)?(.+?)\s*(?:-|\|)\s*(?:PPS|CPA|CPL|CPI|CPS|CPM|RevShare|REVSHARE)\s*$/i);
    if (shorthand?.[1]) return cleanCapturedValue(shorthand[1]);
    if (/^https?:\/\//i.test(line)) continue;
    if (/^(?:network|network id|offer id|vertical|category|payout|default payout|commission|rate|conversion|conversion flow|flow|funnel|top geo|geo|countries|accepted countries|landing|default landing page|banned|prohibited|restricted|traffic|sub[- ]?id|parsed fields)\b/i.test(line)) continue;
    if (/^(?:key offer details|offer details|details|description)\s*[:#-]?$/i.test(line)) continue;
    if (/^\|?\s*(field|value|label|name)\s*\|/i.test(line)) continue;
    return cleanCapturedValue(line);
  }
  return null;
}

function extractOfferNameFromAnyLine(lines: string[]): string | null {
  for (const line of lines) {
    const shorthand = line.match(/^(?:[-*•]\s*)?(?:\|\s*)?(.+?)\s*(?:-|\|)\s*(?:PPS|CPA|CPL|CPI|CPS|CPM|RevShare|REVSHARE)(?:\s*\|.*)?$/i);
    if (shorthand?.[1]) return cleanCapturedValue(shorthand[1]);
  }
  return null;
}

function extractProseVertical(source: string): string | null {
  const lower = source.toLowerCase();
  // Prose-based detection is the lowest-confidence path. Require at least 2
  // keyword matches from the same vertical to avoid false positives on generic
  // words. A wrong answer is worse than a blank one.
  let bestVertical: string | null = null;
  let bestScore = 0;
  for (const [vertical, terms] of COMMON_VERTICALS) {
    const matchCount = terms.filter((term) => lower.includes(term)).length;
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestVertical = vertical;
    }
  }
  return bestScore >= 2 ? bestVertical : null;
}

function extractProsePayout(source: string): string | null {
  const patterns = [
    /earns?\s+(\d+(?:\.\d+)?%)\s+of\s+all\s+user\s+spending/i,
    /(\d+(?:\.\d+)?%)\s+(?:of\s+)?(?:all\s+)?user\s+spending/i,
    /(?:commission|rev(?:enue)?\s*share|revenue share)\s+(?:of\s+)?(\d+(?:\.\d+)?%)/i,
    /(\$\s?\d+(?:\.\d+)?\s*(?:CPA|CPL|CPS|CPM|per\s+lead|per\s+sale))/i,
  ];
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match?.[1]) return cleanCapturedValue(match[0]);
  }
  return null;
}

// ---------------------------------------------------------------------------
//  SUB-ID / TRACKING URL EXTRACTION
// ---------------------------------------------------------------------------
// Affiliate networks ship explicit tracking URLs with query parameters like
//   ?aff_sub=NEWMODE&aff_sub2=DESKTOP&source=CANTINA&aff_sub5=SF_006OG000004lmDN
// Often there are two URLs (one labeled LAPTOP / DESKTOP, one labeled MOBILE)
// that differ only in aff_sub2. We preserve both rather than collapsing them.

export interface TrackingUrl {
  /** Canonical label (e.g. "DESKTOP", "MOBILE", or "DEFAULT" if unlabeled). */
  context: string;
  /** The full tracking URL as it appeared in the source text. */
  url: string;
  /** Parsed query parameters from the URL. */
  params: Record<string, string>;
}

export interface SubIdData {
  /** All tracking URLs discovered, in source order. */
  trackingUrls: TrackingUrl[];
  /**
   * Per-parameter aggregation. For parameters that vary by context (e.g.
   * aff_sub2=DESKTOP in one URL and aff_sub2=MOBILE in another), the value
   * is an array of distinct values; otherwise it's a single-element array.
   */
  params: Record<string, string[]>;
  /**
   * Convenience: human-readable summary string used for the "Sub-ID Format"
   * parsed field in the UI. Format: "aff_sub=NEWMODE; aff_sub2=DESKTOP/MOBILE; ..."
   */
  summary: string;
}

const TRACKING_URL_RE = /https?:\/\/[^\s"'<>'")\]]+\?(?:[^#\s]*\baff_sub\d?=[^#\s&|]+[^#\s|]*)/gi;
const DEVICE_CONTEXT_RE = /^\s*(LAPTOP|DESKTOP|MOBILE|TABLET|WEB|APP)\s*:?\s*$/i;

function parseQueryParams(url: string): Record<string, string> {
  try {
    const q = url.split("?")[1];
    if (!q) return {};
    const fragmentless = q.split("#")[0];
    const out: Record<string, string> = {};
    for (const pair of fragmentless.split("&")) {
      const eq = pair.indexOf("=");
      if (eq <= 0) continue;
      const k = decodeURIComponent(pair.slice(0, eq));
      // Strip trailing JS-string terminator chars (' or ") that may
      // have been captured when a URL was embedded in a <script> tag.
      const v = decodeURIComponent(pair.slice(eq + 1)).replace(/['"]+$/, "");
      if (k && v) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function cleanUrlString(url: string): string {
  // Strip trailing JS-string terminators (', ", `, ), ;, ,, ], }) that may
  // be captured when a URL is embedded inside a <script> tag or JS object.
  return url.replace(/['"`);,\]}]+$/, "");
}

export function extractSubIdData(text: string): SubIdData | null {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  // Find all tracking URLs along with the most recent "LAPTOP" / "MOBILE"
  // context label that appeared on a line by itself immediately above.
  // We collect both labeled and unlabeled URLs separately: labeled URLs
  // are the user-visible "tracking URL" source-of-truth; unlabeled URLs
  // (e.g. embedded inside <script> tags) are only used as a fallback.
  const labeled: TrackingUrl[] = [];
  const unlabeled: TrackingUrl[] = [];
  let pendingContext: string | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    const ctx = line.match(DEVICE_CONTEXT_RE);
    if (ctx) {
      pendingContext = ctx[1].toUpperCase();
      continue;
    }
    if (!line) continue;

    // Pull all tracking URLs from this line (most lines have 1).
    const matches = line.matchAll(TRACKING_URL_RE);
    for (const m of matches) {
      const url = cleanUrlString(m[0]);
      const params = parseQueryParams(url);
      if (Object.keys(params).length === 0) continue;
      // Only register URLs that actually contain affiliate tracking parameters
      // (aff_sub, aff_sub2, source, aff_sub3, aff_sub4, aff_sub5, etc.).
      const hasAffParam = Object.keys(params).some((k) => /^aff_sub\d?$|^source$|^aff_id$/i.test(k));
      if (!hasAffParam) continue;
      const entry: TrackingUrl = {
        context: pendingContext ?? "DEFAULT",
        url,
        params,
      };
      if (pendingContext) labeled.push(entry);
      else unlabeled.push(entry);
    }
    // Reset context after consuming a URL line so the next label is required
    // before another URL is attributed to that context.
    pendingContext = null;
  }

  // Prefer labeled URLs. Fall back to unlabeled only if no labeled URLs exist.
  const trackingUrls = labeled.length > 0 ? labeled : unlabeled;
  if (trackingUrls.length === 0) return null;

  // Aggregate per-parameter: collect distinct values across all tracking URLs,
  // preserving first-seen order.
  const params: Record<string, string[]> = {};
  for (const t of trackingUrls) {
    for (const [k, v] of Object.entries(t.params)) {
      if (!params[k]) params[k] = [];
      if (!params[k].includes(v)) params[k].push(v);
    }
  }

  // Build a human-readable summary. Use the canonical tracking-parameter
  // ordering: aff_sub, aff_sub2, aff_sub3, aff_sub4, aff_sub5, source, aff_id,
  // then any remaining keys in insertion order.
  const canonicalOrder = ["aff_sub", "aff_sub2", "aff_sub3", "aff_sub4", "aff_sub5", "source", "aff_id"];
  const seen = new Set<string>();
  const orderedKeys: string[] = [];
  for (const k of canonicalOrder) {
    if (params[k]) {
      orderedKeys.push(k);
      seen.add(k);
    }
  }
  for (const k of Object.keys(params)) {
    if (!seen.has(k)) orderedKeys.push(k);
  }

  const parts = orderedKeys.map((k) => `${k}=${params[k].join("/")}`);
  const summary = parts.join("; ");

  return { trackingUrls, params, summary };
}

// ---------------------------------------------------------------------------
//  RESTRICTION SPLITTING
// ---------------------------------------------------------------------------
// A captured "Restrictions" string may be either:
//   "No Incentive No Bot No Misleading No Brand Impersonation ..."
// or a semicolon/comma-separated list, or a multi-line list. Split it into
// individual normalized restriction entries. Never invent entries — only
// reformat what is actually present.

function splitRestrictions(rawValue: string): string[] {
  if (!rawValue) return [];
  // Normalize separators: split on semicolons and commas first so that
  // explicit lists ("No X; No Y; No Z") become line-based.
  const normalized = rawValue.replace(/\s*;\s*/g, "\n").replace(/\s*,\s*/g, "\n");
  const lines = normalized.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  const out: string[] = [];
  const seen = new Set<string>();

  const push = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    const key = cleaned.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) return;
    seen.add(key);
    out.push(cleaned);
  };

  // Match each "No X" item where X can be one or more words. Items are
  // bounded by the next " No " token or end-of-line. This handles both
  // run-on form ("No Incentive No Bot No Misleading...") and explicit
  // multi-word items ("No Brand Impersonation", "No Brand Bidding").
  const NO_ITEM_RE = /No\s+[A-Za-z][^,;|\n]*?(?=\s+No\s+[A-Za-z]|$)/g;

  for (const line of lines) {
    const matches = [...line.matchAll(NO_ITEM_RE)];
    if (matches.length === 0) {
      // Line doesn't follow the "No X" pattern — push as-is.
      push(line);
      continue;
    }
    for (const m of matches) {
      push(m[0]);
    }
  }

  return out;
}

function extractField(def: FieldDef, source: string, lines: string[]): string | null {
  for (const pattern of def.patterns) {
    const match = source.match(pattern);
    if (match?.[1]) {
      const value = cleanCapturedValue(match[1]);
      if (value) return value;
    }
  }
  const tableValue = extractTableValue(lines, def.aliases);
  if (tableValue) return tableValue;
  const inlineValue = extractInlineKeyValue(lines, def.aliases);
  if (inlineValue) return inlineValue;
  const followingLineValue = extractFollowingLineValue(lines, def.aliases);
  if (followingLineValue) return followingLineValue;
  return null;
}

export function extractFields(text: string): ParsedField[] {
  const source = text.replace(/\r\n?/g, "\n");
  const lines = normalizedLines(source);

  // First pass: extract every field using existing logic.
  const preliminary = FIELD_DEFS.map((def) => ({
    def,
    value: extractField(def, source, lines),
  }));

  // Look up the payout value (needed for conversion-flow normalization).
  const payoutValue = preliminary.find((p) => p.def.key === "payout_model")?.value ?? null;

  return preliminary.map(({ def, value }) => {
    let final = value;

    if (def.key === "offer_name") {
      if (!final) final = extractOfferNameFromProse(lines) ?? extractOfferNameFromAnyLine(lines) ?? extractOfferNameFromFirstMeaningfulLine(lines);
      // If extracted name is suspiciously long (>10 words), it's likely a wrong match
      // (e.g. "Offer Description" line captured by the broad "offer" alias).
      // Fall back to the first line of pasted text.
      if (final && final.split(/\s+/).length > 10) {
        final = extractOfferNameFromFirstLine(lines) ?? final.split(/\s+/).slice(0, 6).join(" ");
      }
    }
    if (def.key === "vertical" && !final) final = extractProseVertical(source);
    if (def.key === "payout_model" && !final) final = extractProsePayout(source);
    if (def.key === "landing_page" && !final) final = extractStandaloneUrl(lines);

    // Conversion Flow: if no explicit "Conversion Flow:" label was found, but
    // the payout string contains a known conversion-type token (PPS, CPA,
    // CPL, CPI, CPS, CPM, RevShare, PPC, PPV), normalize the token and use
    // it as the conversion flow. This is normalization of explicitly present
    // data, not fabrication.
    if (def.key === "conversion_flow" && !final && payoutValue) {
      const tokens = payoutValue.split(/[\s|,;]+/).filter(Boolean);
      for (const tok of tokens) {
        const normalized = normalizeConversionType(tok);
        if (normalized) {
          final = normalized;
          break;
        }
      }
    }

    // Banned Traffic Types: if the explicit "banned traffic" patterns matched,
    // the captured value may be a run-on string like "No Incentive No Bot..."
    // Split it into a clean semicolon-separated list. If no explicit pattern
    // matched, OR if only one item was captured (likely because
    // extractFollowingLineValue only grabs the FIRST bullet of a multi-line
    // list), fall back to the heading-aware restriction-parser library which
    // collects ALL bullet items after a "Restrictions:" heading.
    if (def.key === "banned_traffic") {
      if (final) {
        const parts = splitRestrictions(final);
        if (parts.length > 1) final = parts.join("; ");
      }
      // Always try the heading-aware parser when we have 0 or 1 captured item.
      // If it returns 2+ items (a real list), use it. If we had nothing and it
      // returns 1 item, use that.
      const currentItemCount = final ? final.split(";").map((s) => s.trim()).filter(Boolean).length : 0;
      if (currentItemCount < 2) {
        const detected = extractRestrictions(source);
        if (detected.length >= 2) {
          final = detected.map((r) => r.text).join("; ");
        } else if (detected.length === 1 && !final) {
          final = detected[0].text;
        }
      }
    }

    // Sub-ID Format: if no explicit "Sub-ID:" label was found, try to extract
    // structured tracking-URL data. The UI field's value becomes the human-
    // readable summary string; the structured form is also available via
    // extractSubIdData() for downstream consumers.
    if (def.key === "subid_format" && !final) {
      const subId = extractSubIdData(source);
      if (subId) final = subId.summary;
    }

    return { key: def.key, label: def.label, value: final || "Not detected" };
  });
}

export function slugify(text: string): string {
  const parsedName = extractFields(text).find((field) => field.key === "offer_name")?.value;
  const fallback = normalizedLines(text)[0] ?? "";
  const source = parsedName && parsedName !== "Not detected" ? parsedName : fallback;
  const cleaned = source.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/).slice(0, 3).join("_").toLowerCase();
  return cleaned || "offer";
}

export interface SubIDEntry { platform: string; tag: string; }

export const SUBID_PLATFORMS = [
  { platform: "X", prefix: "x" },
  { platform: "TikTok", prefix: "tt" },
  { platform: "Pinterest", prefix: "pin" },
  { platform: "Reddit", prefix: "rd" },
  { platform: "Instagram", prefix: "ig" },
  { platform: "Facebook", prefix: "fb" },
  { platform: "Snapchat", prefix: "sc" },
  { platform: "Discord", prefix: "dc" },
  { platform: "Telegram", prefix: "tg" },
];
