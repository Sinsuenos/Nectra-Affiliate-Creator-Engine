export interface DetectedRestriction {
  source: string;
  text: string;
}

const HEADING_RE = /^(?:[-*•#>\s]*)(?:restrictions?|restricted|prohibited|prohibitions|forbidden|not allowed|do not|don't|banned|banned traffic|traffic restrictions?)\s*(?::|-|=)?\s*(.*)$/i;

export function extractRestrictions(text: string): DetectedRestriction[] {
  const lines = text.replace(/\r\n?/g, "\n").split("\n").map((line) => line.trim());
  const found: DetectedRestriction[] = [];
  let active = false;

  for (const raw of lines) {
    if (!raw) {
      if (active) active = false;
      continue;
    }

    const heading = raw.match(HEADING_RE);
    if (heading) {
      active = true;
      if (heading[1]?.trim()) {
        found.push({ source: "Restrictions", text: heading[1].trim() });
      }
      continue;
    }

    if (active) {
      const cleaned = raw.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "").trim();
      if (cleaned && cleaned.length >= 2) {
        found.push({ source: "Restrictions", text: cleaned });
      }
    }
  }

  const deduped = new Map<string, DetectedRestriction>();
  for (const item of found) {
    const key = item.text.toLowerCase().replace(/\s+/g, " ").trim();
    if (!deduped.has(key)) deduped.set(key, item);
  }
  return Array.from(deduped.values()).slice(0, 50);
}

export function formatRestrictionsForPrompt(text: string): string {
  const restrictions = extractRestrictions(text);
  if (!restrictions.length) return "";
  return restrictions.map((item, index) => `${index + 1}. ${item.text}`).join("\n");
}
