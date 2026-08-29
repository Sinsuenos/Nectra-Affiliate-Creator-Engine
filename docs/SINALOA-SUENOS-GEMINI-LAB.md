# Sinaloa-Suenos-Gemini-Lab

## Collaborative Architecture

This document defines the working architecture for the multi-AI ecosystem coordinated by the human architect and independent AI collaborators.

### Primary collaborative workspace

Target workspace name: `Sinaloa-Suenos-Gemini-Lab`.

Until a standalone repository with this exact name exists, this specification is maintained on the dedicated `chatgpt-sinaloa-swaggarts` branch of `Nectra-Affiliate-Creator-Engine` as the current collaboration staging area. No claim is made that a separate repository exists yet.

## Pinterest blast-shield architecture

### Account A: Nectar Engine
- Creator tools, affiliate education, Pinterest API experimentation.
- Pinterest App ID: `1605925`.
- Existing Pinterest OAuth work remains isolated to this property.
- Trial API behavior must be treated as test-only until Standard access is granted.

### Account B: Cantina de Sueños
- International dating and visual-discovery property.
- Intended to use an independent Pinterest Business account.
- Intended application architecture: isolated brand property -> clean Vercel bridge -> approved destination/offer.
- Must not reuse Account A credentials, OAuth tokens, client secrets, or application storage.
- Any account separation must follow Pinterest's terms and normal account policies. Do not attempt to evade enforcement or platform restrictions.

## Pinterest API reality

Trial access is for development/testing and does not equal public production distribution. Build publishing, board-selection, OAuth callback, token refresh, scheduling integration, logging, and QA machinery now, but gate production publishing on the access level actually granted by Pinterest.

Required OAuth values, client secrets, access tokens, and refresh tokens are configuration/secrets, never source code.

## Secret policy

NEVER commit:
- Pinterest client secrets
- OAuth access/refresh tokens
- OpenRouter API keys
- Gemini API keys
- Tailwind credentials/API keys
- Vercel tokens
- GitHub personal access tokens
- Affiliate credentials or private network credentials

Use Vercel project environment variables and GitHub Actions/Repository secrets where appropriate. Documentation may contain variable NAMES, but never secret VALUES.

Recommended variable names:
- `PINTEREST_CLIENT_ID`
- `PINTEREST_CLIENT_SECRET`
- `PINTEREST_ACCESS_TOKEN`
- `PINTEREST_REFRESH_TOKEN`
- `OPENROUTER_API_KEY`
- `GEMINI_API_KEY`
- `TAILWIND_API_KEY`

## International market scorecard

Initial research priority:
1. Japan
2. Latin America
3. Europe

Score markets independently on:
- Pinterest usage and discovery behavior
- Organic-search/discovery opportunity
- Language/localization requirements
- Creative format preferences
- Adult-content/platform restrictions
- Affiliate-network offer availability
- Destination-site restrictions
- Disclosure requirements
- Data/privacy requirements
- Age-gating requirements
- Estimated content-production effort
- Testability on free/low-cost tiers

Do not assume that an offer approved by an affiliate network is automatically permitted on Pinterest, Meta, Instagram, or another traffic source. Each campaign requires a platform-policy check.

## Build principle

The system should produce verifiable artifacts and status records. Never claim an account was authenticated, a Pin was published, an agent executed work, or a deployment succeeded unless the corresponding tool/API/GitHub/Vercel evidence exists.

## Immediate technical sequence

1. Maintain this architecture specification.
2. Audit the current Pinterest OAuth implementation.
3. Build the Account A publishing/test abstraction with secrets externalized.
4. Build Account B as a separate configuration boundary, not a clone of Account A credentials.
5. Add the international market scorecard.
6. Add campaign-policy gates before any publishing action.
7. Document Tailwind scheduling integration separately from Pinterest direct API publishing.
8. Record every real execution as a commit, deployment, API response, or other verifiable artifact.
