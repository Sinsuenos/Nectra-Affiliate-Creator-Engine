import { expect, test, describe } from "bun:test";
import {
  extractFields,
  extractSubIdData,
  slugify,
} from "../src/lib/offer-parser";

// ---------------------------------------------------------------------------
//  REGRESSION CASE 1: The exact XGameHub input from the bug report.
// ---------------------------------------------------------------------------
// This test is the acceptance criteria for the bug. If any of the previously
// missing fields ("Not detected") come back, this test fails.

const XGAMEHUB_INPUT = `XGamehub - PPS
Id: 10421
Default payout:
$35.00 PPS
D 10421
EPC: $0.0046
Top Performing Countries: FR,SG,UK,US
Device: Desktop, Mobile
Vertical: Adult Gaming
Default Landing Page: https://gateway-v2.crakrevenue.com/crakrevenue-screenshot-collector/2.0/desktop/10421/0.jpg
Offer Description: This platform specializes in high-quality adult interactive story games, offering users an engaging experience through choice-based gameplay and premium content. The current focus is on live-action interactive stories featuring real actors and filmed scenes with branching paths, designed to keep users engaged and encourage repeat interaction. In addition, anime and manga-style interactive content is currently in development, which will further expand audience reach and provide new angles for affiliates in the coming months. The offer benefits from a strong monetization model with competitive payouts, solid conversion potential, and consistent user value over time. Top-performing titles such as xgamehub and Interactive Porn have shown strong engagement, making this a reliable option for affiliates looking to scale.
POV Porn GamesInteractive Porn GamesLive-Action Porn GamesVirtual Sex GamesCYOA Porn GamesStory-Driven Porn GamesDating Sim Porn GamesFemale-Led Porn GamesBDSM Porn GamesFemale POV Porn Games

POSTITIAL LAPTOP VERSION DEFAULT LP SET AT 65% INSTEAD OF 85, BOTTOM NOT CENTER, SHOULD TEST

<script src="https://crxcra.com/popin/latest/affstitial-min.js"></script>
<script>
var crakPopInParamsIframe = {
  url: 'https://t.acust-9.com/413627/10421/0?aff_sub=NEWMODE&aff_sub2=MOBILE&source=CANTINA&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0016',
  decryptUrl: false,
  contentUrl: 'https://xgamehub.net/lp1?aff_id=1&transaction_id=postitial',
  decryptContentUrl: false,
  contentType: 'iframe',
  width: '65%',
  height: '65%',
  timeout: false,
  delayClose: 0,
  clickStart: false,
  closeIntent: false,
  postitialBehavior: true,
  closeButtonColor: '#000',
  closeCrossColor: '#fff',
  shadow: true,
  shadowColor: '#000',
  shadowOpacity: '.5',
  shadeColor: '#111',
  shadeOpacity: '0',
  border: '1px',
  borderColor: '#000',
  borderRadius: '0px',
  leadOut: true,
  animation: 'slide',
  direction: 'up',
  verticalPosition: 'bottom',
  horizontalPosition: 'center',
  expireDays: 0.01
};
</script>

EX1
Female-Led Porn Games
Female-led porn games put you in the role of a female protagonist, experiencing every scene from her perspective and making choices that shape her story. At XGameHub, female protagonist porn games are built with the same live-action production and interactive branching as every other category, but the point of view is entirely different. You see the world through her eyes, respond as her, and guide the narrative from her position.
Most adult games default to a male perspective. Female-led games offer something else: a shift in agency, a different emotional register, and dynamics that play out differently when the female character is the one making the decisions. Whether you are drawn to the female perspective because it matches your own or because you want to experience something outside your usual point of view, this category is built for both.
What Are Female Protagonist Porn Games?
Female protagonist porn games are interactive adult games where the central character is a woman, and the player experiences the story through her perspective. You make her choices. You shape her interactions. You determine how her encounters unfold. The gameplay is structured around her agency rather than positioning her as a supporting character in someone else's story.
At XGameHub, this means live-action video filmed to centre the female character's experience. The camera framing, the dialogue, and the branching decisions all reflect her point of view. When she decides how to respond to a situation, you are the one making that decision. When the scene shifts based on her choices, you see the consequences play out from her position.
The format works because XGameHub's branching mechanic gives the player genuine control over the character's path. A female lead porn game is not a passive experience where you watch a woman's story unfold. It is an active experience where you shape that story through decisions that have real consequences in the form of different filmed scenes, different dynamics, and different outcomes.

Restrictions No Incentive No Bot No Misleading No Brand Impersonation No Brand Bidding No chat No Spam
Device
Mobile, Desktop / Web, Tablet
Vertical
Adult Gaming

LAPTOP
https://t.acust-9.com/413627/10421/0?aff_sub=NEWMODE&aff_sub2=DESKTOP&source=CANTINA&aff_sub5=SF_006OG000004lmDN

MOBILE
https://t.acust-9.com/413627/10421/41274?aff_sub=NEWMODE&aff_sub2=MOBILE&source=CANTINA&aff_sub5=SF_006OG000004lmDN
`;

function findField(fields: ReturnType<typeof extractFields>, key: string): string {
  return fields.find((f) => f.key === key)?.value ?? "";
}

describe("XGameHub regression case (bug report)", () => {
  const fields = extractFields(XGAMEHUB_INPUT);

  test("Offer Name extracted", () => {
    expect(findField(fields, "offer_name")).toBe("XGamehub - PPS");
  });

  test("Offer ID extracted", () => {
    expect(findField(fields, "network_id")).toBe("10421");
  });

  test("Vertical extracted", () => {
    expect(findField(fields, "vertical")).toBe("Adult Gaming");
  });

  test("Payout Model extracted", () => {
    expect(findField(fields, "payout_model")).toBe("$35.00 PPS");
  });

  test("Top Performing Countries extracted (not 'Available Countries' / Not detected)", () => {
    const f = fields.find((x) => x.key === "top_geo");
    expect(f?.label).toBe("Top Performing Countries");
    expect(f?.value).toContain("FR");
    expect(f?.value).toContain("SG");
    expect(f?.value).toContain("UK");
    expect(f?.value).toContain("US");
    expect(f?.value).not.toBe("Not detected");
  });

  test("Landing Page URL extracted", () => {
    expect(findField(fields, "landing_page")).toBe(
      "https://gateway-v2.crakrevenue.com/crakrevenue-screenshot-collector/2.0/desktop/10421/0.jpg",
    );
  });

  test("PPS normalization into Conversion Flow", () => {
    expect(findField(fields, "conversion_flow")).toBe("PPS (Pay Per Sale)");
  });

  test("Restrictions parsed into individual items (no run-on)", () => {
    const v = findField(fields, "banned_traffic");
    expect(v).not.toBe("Not detected");
    expect(v).toContain("No Incentive");
    expect(v).toContain("No Bot");
    expect(v).toContain("No Misleading");
    expect(v).toContain("No Brand Impersonation");
    expect(v).toContain("No Brand Bidding");
    expect(v).toContain("No chat");
    expect(v).toContain("No Spam");
    // The full list should be 7 items joined with semicolons.
    const items = v.split(";").map((s) => s.trim());
    expect(items.length).toBe(7);
  });
});

// ---------------------------------------------------------------------------
//  SUB-ID / TRACKING URL EXTRACTION
// ---------------------------------------------------------------------------

describe("Sub-ID extraction from tracking URLs", () => {
  const sub = extractSubIdData(XGAMEHUB_INPUT)!;

  test("extractSubIdData returns a result (not null)", () => {
    expect(sub).not.toBeNull();
  });

  test("aff_sub extracted", () => {
    expect(sub.params.aff_sub).toEqual(["NEWMODE"]);
  });

  test("aff_sub2 preserves DESKTOP and MOBILE variants", () => {
    expect(sub.params.aff_sub2).toContain("DESKTOP");
    expect(sub.params.aff_sub2).toContain("MOBILE");
    expect(sub.params.aff_sub2.length).toBe(2);
  });

  test("aff_sub2 ordering is DESKTOP first (LAPTOP label appeared first in source)", () => {
    expect(sub.params.aff_sub2[0]).toBe("DESKTOP");
    expect(sub.params.aff_sub2[1]).toBe("MOBILE");
  });

  test("source extracted", () => {
    expect(sub.params.source).toEqual(["CANTINA"]);
  });

  test("aff_sub5 extracted", () => {
    expect(sub.params.aff_sub5).toEqual(["SF_006OG000004lmDN"]);
  });

  test("two tracking URLs detected (LAPTOP and MOBILE)", () => {
    expect(sub.trackingUrls.length).toBe(2);
  });

  test("tracking URLs preserve their context labels (LAPTOP and MOBILE from source)", () => {
    // The source uses "LAPTOP" and "MOBILE" as the line labels above each URL.
    // The parser preserves these labels as the URL context, so consumers can
    // distinguish them. (The aff_sub2 value inside the LAPTOP URL is "DESKTOP",
    // but that's a parameter value, not a context label.)
    const contexts = sub.trackingUrls.map((u) => u.context);
    expect(contexts).toContain("LAPTOP");
    expect(contexts).toContain("MOBILE");
  });

  test("tracking URLs preserve full URLs with path", () => {
    expect(sub.trackingUrls[0].url).toContain("t.acust-9.com/413627/10421/0");
    expect(sub.trackingUrls[1].url).toContain("t.acust-9.com/413627/10421/41274");
  });

  test("no trailing JS string terminators in parameter values", () => {
    // The MOBILE URL inside the <script> tag was wrapped in single quotes;
    // the parser must NOT include the closing ' in aff_sub4 or any value.
    for (const t of sub.trackingUrls) {
      for (const v of Object.values(t.params)) {
        expect(v).not.toMatch("['\"]+$");
      }
    }
  });

  test("the Sub-ID Format parsed field uses the human-readable summary", () => {
    const fields = extractFields(XGAMEHUB_INPUT);
    const v = findField(fields, "subid_format");
    expect(v).not.toBe("Not detected");
    expect(v).toContain("aff_sub=NEWMODE");
    expect(v).toContain("aff_sub2=DESKTOP/MOBILE");
    expect(v).toContain("source=CANTINA");
    expect(v).toContain("aff_sub5=SF_006OG000004lmDN");
  });
});

// ---------------------------------------------------------------------------
//  BACKWARD COMPAT: existing DEMO_PASTE format from generator-toolkit.ts.
//  The fix must not break parsing of older offer formats that worked before.
// ---------------------------------------------------------------------------

import { DEMO_PASTE } from "../src/lib/generator-toolkit";

describe("Backward compat: DEMO_PASTE (Velvet Encounters) format", () => {
  const fields = extractFields(DEMO_PASTE);

  test("Offer Name extracted (Velvet Encounters)", () => {
    expect(findField(fields, "offer_name")).toBe("Velvet Encounters");
  });

  test("Vertical extracted (Dating)", () => {
    expect(findField(fields, "vertical")).toBe("Dating");
  });

  test("Payout extracted (45% Lifetime RevShare)", () => {
    const v = findField(fields, "payout_model");
    expect(v).toMatch(/45%/);
    expect(v).toMatch(/RevShare/i);
  });

  test("Conversion Flow normalized from RevShare in payout", () => {
    expect(findField(fields, "conversion_flow")).toBe("RevShare (Revenue Share)");
  });

  test("Banned Traffic extracted (Incentivized, Bot, Brand Bidding, Email Spam)", () => {
    const v = findField(fields, "banned_traffic");
    expect(v).not.toBe("Not detected");
    expect(v).toMatch(/Incentivized/i);
    expect(v).toMatch(/Bot/i);
    expect(v).toMatch(/Brand Bidding/i);
    expect(v).toMatch(/Email Spam/i);
  });

  test("Top Geo extracted (US, UK, CA, AU, DE)", () => {
    const v = findField(fields, "top_geo");
    expect(v).not.toBe("Not detected");
    expect(v).toContain("US");
    expect(v).toContain("UK");
    expect(v).toContain("CA");
    expect(v).toContain("AU");
    expect(v).toContain("DE");
  });

  test("slugify still produces a clean slug", () => {
    expect(slugify(DEMO_PASTE)).toBe("velvet_encounters");
  });
});

// ---------------------------------------------------------------------------
//  EDGE CASES: variants in formatting (no fabricated values)
// ---------------------------------------------------------------------------

describe("Edge cases — never invent values", () => {
  test("empty input → all fields 'Not detected'", () => {
    const fields = extractFields("");
    for (const f of fields) {
      expect(f.value).toBe("Not detected");
    }
  });

  test("offer with no payout token → conversion flow stays 'Not detected'", () => {
    const fields = extractFields("Offer Name: Test Offer\nVertical: Dating");
    expect(findField(fields, "conversion_flow")).toBe("Not detected");
  });

  test("offer with no tracking URLs → subid_format stays 'Not detected'", () => {
    const fields = extractFields("Offer Name: Test Offer\nVertical: Dating");
    expect(findField(fields, "subid_format")).toBe("Not detected");
    expect(extractSubIdData("Offer Name: Test Offer")).toBeNull();
  });

  test("restrictions with semicolon separator split correctly", () => {
    const input = "Offer Name: Test\nRestrictions: No Incentive; No Bot; No Spam";
    const fields = extractFields(input);
    const v = findField(fields, "banned_traffic");
    expect(v).toContain("No Incentive");
    expect(v).toContain("No Bot");
    expect(v).toContain("No Spam");
  });

  test("restrictions on separate lines also parsed (via restriction-parser fallback)", () => {
    const input = [
      "Offer Name: Test",
      "Vertical: Dating",
      "",
      "Restrictions:",
      "- No Incentive",
      "- No Bot",
      "- No Misleading",
    ].join("\n");
    const fields = extractFields(input);
    const v = findField(fields, "banned_traffic");
    expect(v).toContain("No Incentive");
    expect(v).toContain("No Bot");
    expect(v).toContain("No Misleading");
  });
});
