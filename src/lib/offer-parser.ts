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

/* Affiliate exports are heterogeneous by design. Networks use different
   labels, separators, table layouts, ordering, and sometimes put a value
   on the line immediately after its label. This parser deliberately uses
   several deterministic passes and never invents a value. */
const LABEL_PREFIX = String.raw`(?:[-*•]\s*)?`;

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
    label: "Top Geo",
    aliases: ["top geo", "geo", "geos", "countries", "target countries", "accepted countries", "allowed countries", "available countries"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:(?:top[\\s_-]?)?(?:geo|geos)|target[\\s_-]?countries|accepted[\\s_-]?countries|allowed[\\s_-]?countries|available[\\s_-]?countries)[\\s:#|=\\-]+([^\\n|]+)`, "im")],
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
    aliases: ["banned traffic", "banned traffic types", "prohibited traffic", "restricted traffic", "forbidden traffic", "traffic restrictions", "traffic allowed", "traffic sources"],
    patterns: [
      new RegExp(`^${LABEL_PREFIX}(?:banned|prohibited|restricted|forbidden)[\\s_-]?traffic(?:[\\s_-]?types)?[\\s:#|=\\-]+([^\\n|]+)`, "im"),
      new RegExp(`^${LABEL_PREFIX}(?:traffic[\\s_-]?restrictions|traffic[\\s_-]?allowed|traffic[\\s_-]?sources)[\\s:#|=\\-]+([^\\n|]+)`, "im"),
    ],
  },
  {
    key: "subid_format",
    label: "Sub-ID Format",
    aliases: ["sub id", "sub-id", "sub ids", "sub-ids", "sub id format", "sub-id format", "tracking token", "tracking format", "tracking parameters"],
    patterns: [new RegExp(`^${LABEL_PREFIX}(?:sub[\\s_-]?id(?:s)?(?:[\\s_-]?format)?|tracking[\\s_-]?(?:token|format)|tracking[\\s_-]?parameters?)[\\s:#|=\\-]+([^\\n|]+)`, "im")],
  },
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

/* Handles exports such as:
   Accepted countries:
   Australia, Austria, Belgium...
   and markdown/table variants where the label occupies its own row. */
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

  return FIELD_DEFS.map((def) => {
    let value = extractField(def, source, lines);
    if (def.key === "offer_name" && !value) value = extractOfferNameFromAnyLine(lines) ?? extractOfferNameFromFirstMeaningfulLine(lines);
    return { key: def.key, label: def.label, value: value || "Not detected" };
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
