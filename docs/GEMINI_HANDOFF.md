# Gemini International Growth Lab Handoff

## Mission
Operate as an independent research/build lane alongside ChatGPT, Claude, Grok, Z.ai, NVIDIA tooling, and the human operator. Do not wait for permission to research or prepare work. Do not claim an action happened unless the connected tool returns evidence.

## Workspace separation
- ChatGPT working branch: `chatgpt-sinaloa-swaggarts`
- Keep Gemini work in its own repository or clearly isolated branch/workspace.
- Do not overwrite production or merge into `main` without review.
- Dating/Pinterest experiments should be separable from the Nectar Engine product-marketing property so a problem with one campaign does not unnecessarily affect another.

## Secrets policy
NEVER place Pinterest app secrets, OAuth client secrets, access tokens, refresh tokens, Tailwind API keys, OpenRouter keys, affiliate credentials, or other credentials in GitHub README files, source code, screenshots, commits, prompts, or public issues.

Store secrets only in the appropriate secret store/environment configuration, such as Vercel Environment Variables, GitHub Actions Secrets, or the provider's secure credential store. Commit only variable names and setup documentation, for example:
- `PINTEREST_APP_ID`
- `PINTEREST_APP_SECRET`
- `PINTEREST_REDIRECT_URI`
- `PINTEREST_ACCESS_TOKEN`
- `TAILWIND_API_KEY`
- `OPENROUTER_API_KEY`

If a credential is ever exposed, treat it as compromised and recommend rotation immediately.

## Pinterest: current state
App: Nectar Engine
App ID: `1605925`
Status: Trial access pending.

Pinterest's current developer documentation says app requests are reviewed each business day. Pinterest says pending apps cannot expose the app secret, and typical approval is 1-3 business days. Trial access can create Pins/Boards only visible to the creator, so this is useful for testing but is not equivalent to public production publishing.

Current intended callback:
`https://nectar-engine.vercel.app/api/pinterest/callback`

Pinterest requires the OAuth `redirect_uri` supplied during authorization to exactly match a URI configured on the app. Do not invent alternate callback URLs.

## Pinterest account strategy
Do NOT abandon the existing Nectar Engine app or assume a new account bypasses approval.

Pinterest officially supports:
1. creating a completely new Business account with an email not already used by another Pinterest account, or
2. converting an existing personal account to Business.

For campaign isolation, evaluate a NEW Business account for the dating/discovery brand, using a separate email and identity/brand positioning. Keep the existing Nectar Engine Business account/app intact for product marketing.

If a second Pinterest API app is needed, document why before creating it. Pinterest limits users to five apps, so app slots are a finite resource.

## Pinterest build target
Prepare a production-ready OAuth flow and content pipeline that can be activated when access is approved:
Pinterest account -> OAuth -> callback -> secure token storage -> board discovery/creation -> Pin media -> Pin creation -> analytics.

Never claim a Pin is public until its visibility can be verified. Trial-created Pins are expected to be creator-visible only.

## Tailwind
Research and use the connected Tailwind capability when available. Verify authentication and actual write permissions before claiming schedules or Pins exist. Build a campaign calendar and queue structure even if publishing is blocked.

Target capabilities to investigate:
- Pin scheduling
- boards/sections
- drafts/queues
- analytics
- multiple Pinterest accounts
- API rate limits
- international posting times

## International growth priority
Start with Japan, then compare South Korea, Southeast Asia, Nordic countries, Germany, France, Spain, Latin America, Australia, and Canada.

For each market score:
- Pinterest adoption/use
- search behavior
- visual conventions
- localization difficulty
- affiliate rules
- dating/adult-content restrictions
- platform suitability
- competition
- organic opportunity
- monetization potential

Do not assume American tactics transfer directly.

## Dating campaign architecture
Treat dating discovery as a separate campaign/property from Nectar Engine product marketing. Build useful, culturally localized landing experiences first. Affiliate offers must be checked against the applicable network offer rules and platform policies before promotion.

Do not automatically select the highest payout. Score offers by EPC, GEO, payout, conversion type, landing-page quality, brand/platform suitability, creative restrictions, and compliance risk.

## Creative direction
Avoid generic stock-photo affiliate graphics. Develop a recognizable visual system:
- cinematic realism
- holographic 3D interfaces
- dimensional typography
- glass/liquid UI
- futuristic discovery maps
- premium editorial layouts
- localized visual language

The human operator can use Gemini/Z.ai/image tools for final artwork. Provide exact canvas sizes, layout specs, text hierarchy, safe zones, and prompts rather than wasting implementation cycles generating finished artwork when unnecessary.

## OpenRouter
Evaluate `openrouter/auto` as a routing option. Record the selected model and cost behavior in experiments. Never assume Auto is always best. Compare cost, latency, quality, and task fit. Keep API keys in secure environment variables.

## GitHub operating rules
Every meaningful session should leave evidence:
- commit
- issue
- research document
- market scorecard
- tested implementation
- PR
- campaign calendar
- creative specification
- or documented blocker with next action

No phantom work. No invented agents. No invented deployments.

## Agent strategy
If a real agent-capable connector is available, assign at least three independent workstreams:
1. Pinterest/API research and implementation audit.
2. International market research, beginning with Japan.
3. Dating/affiliate offer compliance and market scoring.

A fourth workstream can audit Tailwind and scheduling.

Each agent must return an artifact or verifiable status. If the connector cannot actually execute autonomous agents, say so and use parallel research/build tasks instead.

## Immediate priority queue
1. Audit Pinterest OAuth implementation in the Nectar repository.
2. Verify callback route and environment-variable names.
3. Build a Pinterest integration readiness checklist.
4. Research separate Pinterest Business account strategy.
5. Research Japan Pinterest market.
6. Build international market scorecard.
7. Audit dating offer list for platform fit.
8. Research Tailwind scheduling capabilities.
9. Evaluate OpenRouter Auto for research/content workloads.
10. Identify three safe, concrete GitHub improvements and implement the highest-value one.

## Human actions that may be required
When a provider requires an action that cannot be performed through available tools, give Christopher exactly one short instruction at a time. Never ask him to handle secrets in chat or GitHub.
