/* ------------------------------------------------------------------ */
/*  ROBUST OFFER FIELD EXTRACTION                                     */
/* ------------------------------------------------------------------ */

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

const FIELD_DEFS: FieldDef[] = [
  { key: "offer_name", label: "Offer Name", aliases: ["offer name", "offer", "product", "campaign", "title", "offer title", "product name"], patterns: [new RegExp(`^${LABEL_PREFIX}(?:offer[\\s_-]?name|offer[\\s_-]?title|product[\\s_-]?name|campaign|title)[\\s:#|=\\-]+(.+)$`, "im")] },
  { key: "network_id", label: "Offer ID", aliases: ["offer id", "network id", "network offer id", "campaign id", "campaign", "id"], patterns: [new RegExp(`^${LABEL_PREFIX}(?:offer[\\s_-]?id|network[\\s_-]?id|network[\\s_-]?offer[\\s_-]?id|campaign[\\s_-]?id|id)[\\s:#|=\\-]+([^\\n|]+)`, "im")] },
  { key: "vertical", label: "Vertical", aliases: ["vertical", "category", "vertical category"], patterns: [new RegExp(`^${LABEL_PREFIX}(?:vertical(?:\\s*\\/\\s*category|\\s*category)?|category)[\\s:#|=\\-]+([^\\n|]+)`, "im")] },
  { key: "payout_model", label: "Payout Model", aliases: ["payout", "default payout", "payout model", "commission", "commission rate", "rate", "default commission"], patterns: [new RegExp(`^${LABEL_PREFIX}(?:(?:default[\\s_-]?)?payout(?:[\\s_-]?model)?|commission(?:[\\s_-]?rate)?|rate)[\\s:#|=\\-]+([^\\n|]+)`, "im")] },
  { key: "conversion_flow", label: "Conversion Flow", aliases: ["conversion flow", "conversion", "flow", "funnel", "conversion event", "conversion type"], patterns: [new RegExp(`^${LABEL_PREFIX}(?:conversion[\\s_-]?flow|conversion[\\s_-]?event|conversion[\\s_-]?type|conversion|flow|funnel)[\\s:#|=\\-]+([^\\n|]+)`, "im")] },
  { key: "top_geo", label: "Available Countries", aliases: ["top geo", "geo", "geos", "countries", "target countries", "accepted countries", "allowed countries", "available countries"], patterns: [new RegExp(`^${LABEL_PREFIX}(?:(?:top[\\s_-]?)?(?:geo|geos)|target[\\s_-]?countries|accepted[\\s_-]?countries|allowed[\\s_-]?countries|available[\\s_-]?countries)[\\s:#|=\\-]+([^\\n|]+)`, "im")] },
  { key: "landing_page", label: "Landing Page URL", aliases: ["landing page", "landing page url", "default landing page", "default landing page url", "landing url", "destination url", "target url", "offer url", "url"], patterns: [new RegExp(`^${LABEL_PREFIX}(?:(?:default[\\s_-]?)?landing[\\s_-]?(?:page|url)|destination[\\s_-]?url|target[\\s_-]?url|offer[\\s_-]?url)[\\s:#|=\\-]+(https?:\\/\\/[^\\s|]+)`, "im")] },
  { key: "banned_traffic", label: "Banned Traffic Types", aliases: ["banned traffic", "banned traffic types", "prohibited traffic", "restricted traffic", "forbidden traffic", "traffic restrictions", "traffic allowed", "traffic sources", "restrictions"], patterns: [] },
  { key: "subid_format", label: "Sub-ID Format", aliases: ["sub id", "sub-id", "sub ids", "sub-ids", "sub id format", "sub-id format", "tracking token", "tracking format", "tracking parameters"], patterns: [] },
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

const RESTRICTIONS = [
  "No Incentive",
  "No Bot",
  "No Misleading",
  "No Brand Impersonation",
  "No Brand Bidding",
  "No Chat",
  "No Spam",
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

function extractTableValue(lines: string[], aliases: string[]): string | null {
  const aliasSet = new Set(aliases.map(normalizeLabel));
  for (const line of lines) {
    if (!line.includes("|")) continue;
    const cells = line.split("|").map(cleanCapturedValue);
    if (cells.length < 2) continue;
    if (!aliasSet.has(normalizeLabel(cells[0]))) continue;
    const value = cells.slice(1).find((cell) => cell && !/^[-:]+$/.test(cell));
    if (value) return value;
  }
  return null;
}

function extractInlineKeyValue(lines: string[], aliases: string[]): string | null {
  const aliasPatterns = aliases.map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[ _-]+/g, "[\\s_-]*")).sort((a, b) => b.length - a.length);
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
  for (let i = 0; i < lines.length - 1; i += 1) {
    if (!aliasSet.has(normalizeLabel(lines[i].replace(/[:=]+\s*$/, "")))) continue;
    const value = cleanCapturedValue(lines[i + 1]);
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

function extractOfferName(lines: string[]): string | null {
  for (const line of lines.slice(0, 8)) {
    const shorthand = line.match(/^(?:\|\s*)?(.+?)\s*(?:-|\|)\s*(?:PPS|CPA|CPL|CPI|CPS|CPM|RevShare)\s*$/i);
    if (shorthand?.[1]) return cleanCapturedValue(shorthand[1]);
  }
  const first = cleanCapturedValue(lines[0] ?? "");
  if (first && first.length <= 120 && !/^(?:network|offer|vertical|payout|conversion|restrictions|sub[- ]?id|landing|id|epc|device)\b/i.test(first)) return first;
  return null;
}

function extractProseVertical(source: string): string | null {
  const lower = source.toLowerCase();
  let best: string | null = null;
  let score = 0;
  for (const [vertical, terms] of COMMON_VERTICALS) {
    const matches = terms.filter((term) => lower.includes(term)).length;
    if (matches > score) { score = matches; best = vertical; }
  }
  return score >= 2 ? best : null;
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

function extractRestrictions(source: string): string | null {
  const lower = source.toLowerCase();
  const found = RESTRICTIONS.filter((restriction) => lower.includes(restriction.toLowerCase()));
  return found.length ? found.join(", ") : null;
}

function extractSubIdFormat(source: string): string | null {
  const urls = source.match(/https?:\/\/[^\s)]+/gi) ?? [];
  const params = new Map<string, Set<string>>();
  for (const rawUrl of urls) {
    try {
      const url = new URL(rawUrl.replace(/[.,;]+$/, ""));
      for (const [key, value] of url.searchParams.entries()) {
        if (!/^aff_sub(?:\d+)?$/i.test(key) && !/^(?:subid|sub_id|sub-id|transaction_id)$/i.test(key)) continue;
        if (!params.has(key)) params.set(key, new Set());
        params.get(key)!.add(value || "<empty>");
      }
    } catch {
      // Ignore malformed URLs. The parser must never fail the entire offer.
    }
  }
  if (!params.size) return null;
  return Array.from(params.entries()).map(([key, values]) => `${key}=${Array.from(values).join(" | ")}`).join(", ");
}

function extractField(def: FieldDef, source: string, lines: string[]): string | null {
  for (const pattern of def.patterns) {
    const match = source.match(pattern);
    if (match?.[1]) {
      const value = cleanCapturedValue(match[1]);
      if (value) return value;
    }
  }
  return extractTableValue(lines, def.aliases) ?? extractInlineKeyValue(lines, def.aliases) ?? extractFollowingLineValue(lines, def.aliases);
}

export function extractFields(text: string): ParsedField[] {
  const source = text.replace(/\r\n?/g, "\n");
  const lines = normalizedLines(source);
  return FIELD_DEFS.map((def) => {
    let value = extractField(def, source, lines);
    if (def.key === "offer_name") value = value ?? extractOfferName(lines);
    if (def.key === "vertical") value = value ?? extractProseVertical(source);
    if (def.key === "payout_model") value = value ?? extractProsePayout(source);
    if (def.key === "landing_page") value = value ?? extractStandaloneUrl(lines);
    if (def.key === "banned_traffic") value = value ?? extractRestrictions(source);
    if (def.key === "subid_format") value = value ?? extractSubIdFormat(source);
    return { key: def.key, label: def.label, value: value ? cleanCapturedValue(value) : "Not detected" };
  });
}
