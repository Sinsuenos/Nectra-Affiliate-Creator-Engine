# Nectar Engine: Offer-to-Output Workflow Guide

A step-by-step walkthrough of the Nectar Engine content generation pipeline, from raw offer data to a polished, platform-ready toolkit.

---

## The Pipeline at a Glance

```
Raw Offer Data → Paste & Parse → AI Generation → Toolkit Output → Compliance Scan → Publish
```

Five stages. One paste. Nine platforms. Let's walk through each one.

---

## Step 1: Gather Your Offer Data

Before touching Nectar Engine, collect everything you know about the offer. The more signal you feed the engine, the better the output. Here's what matters most:

| Field | Why It Matters |
|-------|---------------|
| **Offer Name** | Becomes the identity of every generated asset |
| **Network** | Context for payout model and vertical norms |
| **Vertical** | Determines compliance red flags and audience tone |
| **Payout** | Shapes how the AI frames value (without inventing prices) |
| **Target Audience** | Drives voice, register, and emotional scaffolding |
| **Key Features** | The factual backbone for all creative claims |
| **Banned Traffic** | Helps the compliance layer flag platform mismatches |
| **Landing Page Angle** | Informs the emotional entry point for generated copy |
| **Available Countries** | Geo-targeting context for platform-specific posts |
| **Affiliate Link** | Used for Sub-ID tracking (not sent to the AI) |

**Pro tip:** You don't need all of these. The engine works with partial data and will flag what it couldn't detect. But more data means less creative guesswork and more grounded output.

---

## Step 2: Paste and Parse

1. Go to the Generator page.
2. Paste your raw offer text into the input area. The format doesn't matter. The parser handles structured fields, plain paragraphs, network dashboards, email snippets, and everything in between.
3. Watch the **Parsed Fields** section appear below the textarea. It auto-detects offer name, network, vertical, payout, and other key fields.
4. If a field is wrong, click it to edit. The parser is good, not perfect.

**What the parser detects:**
- Offer name (first line, or explicit "Offer Name:" label)
- Network name
- Vertical
- Payout model and amount
- Conversion flow
- Available countries / geo targets
- Banned traffic types
- Sub-ID format

**What the parser will NOT detect (and the AI won't invent):**
- Pricing that isn't in your paste
- Trial periods you didn't specify
- Statistics or user counts you didn't provide
- Guarantees or outcomes not stated in the source

---

## Step 3: Generate the Toolkit

Click **Generate Toolkit**. Here's what happens behind the scenes:

1. Your parsed offer data is sent to the AI system prompt.
2. The AI constructs an invisible human profile (specific person, specific moment, emotional stance, voice register) to anchor the writing.
3. It generates: 3 promo angles, 9 platform-specific social posts, 4 headline variants, 1 body copy, 4 CTA variations, and 3-5 compliance notes.
4. The output is validated: all 9 platforms must be present, character counts are verified, and the JSON structure is enforced.
5. Your toolkit appears on-screen, organized into collapsible sections.

**What you get:**

| Section | What It Contains |
|---------|-----------------|
| Promo Angles | 3 named campaign directions, each with hook + body |
| Social Posts | 9 posts, one per platform, with character counts |
| Headlines | 4 headline variants (A-D) |
| Body Copy | 2-3 paragraphs of long-form copy |
| CTA Variations | 4 call-to-action options with tone labels |
| Compliance Notes | Platform-specific compliance observations |

---

## Step 4: Review and Scan

Before posting anything, run it through the **Compliance Scanner**:

1. Click **Check This Toolkit** at the bottom of your generated output. This sends all content to the Scanner automatically.
2. Select the platforms you plan to post on (the generator's platforms are pre-selected).
3. Click **Check Compliance**.
4. Review the results: each platform gets a Pass, Warning, or Fail verdict with specific flagged phrases and safer rewrites.
5. Fix any Fail results, then post.

**The scanner checks for:**
- Prohibited language patterns per platform
- Missing disclosure signals
- Urgency/guarantee claims that trigger platform enforcement
- Adult/explicit content that violates platform policies
- Deceptive or misleading framing

---

## Step 5: Customize Sub-IDs (Optional)

Before distributing links, set up platform-specific Sub-ID tracking:

1. Expand the **Platform Sub-IDs** section on the generator page.
2. Each platform gets a tracking tag in the format: `PREFIX_offerslug_PREFIX_sub`
3. Edit the format if your network uses a different Sub-ID structure.
4. These tags help you attribute conversions to specific platforms and campaigns.

---

## Worked Example: Velvet Encounters

Here's a complete walkthrough using a fictional offer. No real networks, tracking IDs, or secrets are used.

### The Offer

You receive this from your affiliate manager:

```
Offer Name: Velvet Encounters
Network: ExampleAffiliateNet
Vertical: Dating
Payout: 45% Lifetime RevShare
Device: Desktop, Mobile
Landing Page Angle: upscale, discreet, connection-focused
Offer Description: Velvet Encounters is a premium dating platform built for adults seeking genuine, discreet connections. Members browse verified profiles, message freely, and unlock deeper conversations through an intuitive matching system. Positioned as a sophisticated alternative to mainstream dating apps, it's designed for users who want real connection without the noise of casual swiping.
Banned Traffic: Incentivized, Bot, Brand Bidding, Email Spam
Available Countries: US, UK, CA, AU, DE
```

### Step 1: Paste

Paste the entire block into the Generator textarea. No formatting needed.

### Step 2: Parse

The parser auto-detects:
- **Offer Name:** Velvet Encounters
- **Network:** ExampleAffiliateNet
- **Vertical:** Dating
- **Payout:** 45% Lifetime RevShare
- **Banned Traffic:** Incentivized, Bot, Brand Bidding, Email Spam
- **Available Countries:** US, UK, CA, AU, DE

All correct. No edits needed.

### Step 3: Generate

Click Generate Toolkit. The AI produces content tailored to the dating vertical, with each platform getting a distinct voice:

- **X:** Direct, punchy, 280-char limit respected
- **TikTok:** Conversational, story-driven
- **Pinterest:** Descriptive, SEO-friendly pin copy
- **Reddit:** Genuine discussion format (not a pitch)
- **Instagram:** Visual-first caption with disclosure-ready formatting
- **Facebook:** Community-toned, slightly longer
- **Snapchat:** Quick-hitting story angle
- **Discord:** Community-question format
- **Telegram:** Informational, direct

### Step 4: Compliance Scan

Send to Scanner. Typical results for a dating offer:

- **X, Pinterest:** Pass (low-risk platforms with proper disclosure)
- **TikTok, Instagram, Facebook, Snapchat:** Warning (dating content needs careful framing)
- **Reddit:** Warning or Fail (self-promotion rules are strict)
- **Discord, Telegram:** Warning (enforcement varies)

Apply any suggested safer rewrites, especially for Reddit.

### Step 5: Post

Copy each platform's post directly from the toolkit. Each post includes a character count so you know it fits. Add your affiliate link with the platform-specific Sub-ID, include any required disclosure, and publish.

---

## Quick Reference: What NOT to Do

- **Don't** paste competitor URLs or tracking links into the generator input (the AI doesn't need them)
- **Don't** edit the AI's compliance notes to be less cautious (they exist to keep you from getting banned)
- **Don't** post Reddit content that reads like marketing (it will get reported and removed)
- **Don't** skip the compliance scan (platforms change their rules, and the scanner catches what you might miss)
- **Don't** use the same post across all platforms (the engine writes different versions for a reason)

---

## Output Format

The toolkit is returned as structured JSON with these top-level keys:

- `promo_angles` — array of 3 angle objects
- `social_posts` — array of 9 post objects (one per platform)
- `headlines` — array of 4 headline objects
- `body_copy` — string (2-3 paragraphs)
- `cta_variations` — array of 4 CTA objects
- `compliance_notes` — array of 3-5 note objects

Each social post includes a `character_count` field so you can verify it fits the platform's limit without counting manually.

---

*This guide uses a fictional worked example. No real networks, tracking IDs, or secrets are included. The workflow reflects the current Nectar Engine pipeline and may be updated as the system evolves.*
