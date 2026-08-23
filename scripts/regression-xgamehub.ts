// Regression test: run the actual offer parser against the XGameHub input
// from the bug report and inspect what comes out.
import { extractFields, slugify } from "../src/lib/offer-parser";

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

const fields = extractFields(XGAMEHUB_INPUT);

console.log("=== CURRENT PARSER OUTPUT (BEFORE FIX) ===");
console.log(`Slug: ${slugify(XGAMEHUB_INPUT)}`);
console.log("");
console.log("Parsed Fields:");
for (const f of fields) {
  const marker = f.value === "Not detected" ? "  ❌ MISSING" : "  ✅";
  console.log(`${marker}  ${f.label}: ${f.value}`);
}

console.log("");
console.log("=== FAILURE MODE ANALYSIS ===");
const expected: Record<string, string> = {
  offer_name: "XGamehub - PPS",
  network_id: "10421",
  vertical: "Adult Gaming",
  payout_model: "$35.00 PPS",
  conversion_flow: "PPS (Pay Per Sale)",
  top_geo: "FR, SG, UK, US",
  landing_page: "https://gateway-v2.crakrevenue.com/crakrevenue-screenshot-collector/2.0/desktop/10421/0.jpg",
  banned_traffic: "No Incentive; No Bot; No Misleading; No Brand Impersonation; No Brand Bidding; No chat; No Spam",
  subid_format: "aff_sub=NEWMODE; aff_sub2=DESKTOP/MOBILE; source=CANTINA; aff_sub5=SF_006OG000004lmDN",
};

for (const f of fields) {
  const exp = expected[f.key] ?? "(not specified)";
  const ok = f.value !== "Not detected" && f.value.length > 0;
  console.log(`  ${ok ? "OK" : "FAIL"} ${f.label.padEnd(22)} | expected: ${exp}`);
  console.log(`                            actual:   ${f.value}`);
}
