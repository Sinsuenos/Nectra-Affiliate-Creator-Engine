# Nectra Research & Orchestration Playbook

## Mission
Build a global, compliance-first creator and affiliate system. Keep work moving across Pinterest, Tailwind, GitHub, Meta research, international GEO research, dating discovery, creator security, and future verticals.

## Current Pinterest App
- App: Nectar Engine
- App ID: 1605925
- API: Pinterest REST API v5
- Current state: Trial access pending
- Secret: unavailable until Pinterest approves trial access
- Required OAuth direction: request only scopes actually needed
- Core publishing scopes when approved: `pins:write`, `boards:write`; read scopes only where needed for account/board/pin verification.
- Redirect URI must be HTTPS, app-specific scheme, or localhost.
- Never commit secrets, tokens, client secrets, or refresh tokens to GitHub.

## Pinterest Workflow
1. Authenticate with OAuth.
2. Verify user account and target board.
3. Create media/upload asset as required by current API flow.
4. Create Pin with title, description, board, media and destination URL.
5. Record Pin ID, board ID, destination, GEO, offer, creative concept, timestamp, and status.
6. Verify publication before reporting it as live.
7. Use Tailwind for scheduled/queued distribution where appropriate.

## Tailwind
- Connected account currently available.
- Custom app permissions currently allow Tailwind actions without asking.
- Do not claim a Pin is published merely because generation succeeded. Distinguish generated, queued, scheduled, published, and verified.
- SmartSchedule is supplemental. For launch tests, use explicit scheduling when a specific time is required.

## Offer Research Rules
Every offer must be scored against:
- offer ID
- payout
- EPC
- conversion type
- GEO
- device
- traffic sources allowed
- creative restrictions
- trademark restrictions
- landing/prelander rules
- adult-content restrictions
- social platform restrictions
- affiliate disclosure requirements
- current freshness

Never infer permission from payout or EPC. Verify the network's current terms and offer-specific rules before promotion.

## Initial Offer Signals
Use EPC as an initial performance signal, not the sole decision factor. High-priority candidates from the supplied inventory include Victoria Milan, Adult FriendFinder, Instabang, Fling, GayBloom, MyMaturePassion, NaughtyCharm, HometownFlirt, TransDate, Manfinder, MapleFling, MyAussieCrush, Ozzy-Match, TSDates, WaysToMeet, XMatch and strong regional European offers. Any offer with questionable branding or platform fit remains parked until rules are verified.

## GEO Research
Priority laboratories:
- Japan
- South Korea
- Philippines
- Indonesia
- Thailand
- Taiwan
- Singapore/Malaysia
- Nordics
- Spain
- LATAM
- Australia
- Canada

For each GEO capture: Pinterest adoption, Meta reach, language, cultural creative patterns, local dating behavior, platform availability, affiliate offer availability, legal/compliance considerations, and viable organic channels.

## Creative System
Master Pinterest creative: 1000x1500 px, 2:3.
Visual language: cinematic ultra-realism, sophisticated 3D/holographic interfaces, dimensional profile cards, luminous connection networks, geographic maps, futuristic architecture, human warmth, no explicit imagery.
Avoid generic stock-dating tropes and aggressive sexual thumbnails.
Creative concepts should be produced as specifications/prompts for external image tools, not needlessly rendered inside engineering workflows.

## Landing Page Families
Build reusable discovery shells before final offers are selected:
- /dating-discovery
- /global-dating
- /gay
- /transgender
- /mature
- /japan-dating
- /korea-dating
- /spanish-dating
- /nordic-dating
- /australia-dating
- /canada-dating

Each page should support compliant editorial/discovery content and modular monetization rather than hard-coding one affiliate brand.

## Meta Research
Use Meta Ad Library as a research source before paid spend. Study creative hooks, formats, localization, frequency, and landing-page patterns by GEO. Do not copy protected creative or make unsupported claims.

## Model Routing
OpenRouter `openrouter/auto` can route requests by task type and current community spend, with no router fee according to the supplied OpenRouter announcement. Use it as a routing option for suitable Nectar workloads, while preserving explicit production-model controls where deterministic behavior is required. Record selected model in internal logs when available.

## Multi-Agent Workstreams
When agent tooling is available, divide work into independently verifiable tracks:
1. GitHub Builder/QA: inspect repo, implement small changes, run/inspect CI, report commit SHA.
2. Pinterest Operator: inspect account/boards, create or queue approved content, report exact object IDs/status.
3. Market Intelligence: research GEO/offer/platform data and write structured findings with sources.
4. Meta Intelligence: research current ad patterns and platform policies.
5. Creative Director: turn approved campaign concepts into external production specifications.

No agent may be described as having completed work without an observable artifact, ID, URL, commit, queue item, or source-backed report.

## Proof Standard
Every claimed action must have one of:
- GitHub commit SHA
- deployed URL
- Tailwind post/queue/schedule ID or returned status
- Pinterest Pin/Board ID and verification status
- automation ID
- source-backed research output

Use labels: PLANNED / IN PROGRESS / CREATED / QUEUED / SCHEDULED / PUBLISHED / VERIFIED / BLOCKED.

## External Handoff
If ChatGPT access disappears, another agent/model can continue by reading this file, the README, current GitHub issues, and the repository's Pinterest integration documentation. Never place secrets in these files. Secrets remain in Vercel/environment secret stores and platform dashboards.

## Immediate Queue
1. Pinterest OAuth implementation and verification.
2. Tailwind explicit launch scheduling.
3. Dating Discovery shell completion.
4. Gay discovery shell.
5. Transgender discovery shell.
6. Mature discovery shell.
7. Japan campaign architecture.
8. APAC GEO matrix.
9. Offer compliance matrix.
10. Meta Ad Library research framework.
11. OpenRouter routing evaluation.
12. Agent orchestration proof-of-work system.
13. README continuation guide.
14. Creative prompt library.
15. Analytics/event schema.
