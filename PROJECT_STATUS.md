# Nectar Engine Project Status

## Pinterest API

Updated 2026-09-10.

- Pinterest app: Nectar Engine
- App ID: 1605925
- Production API base: `https://api.pinterest.com/v5`
- Production callback: `https://nectar-engine.vercel.app/api/pinterest/callback`
- OAuth scopes requested: `boards:read`, `boards:write`, `pins:read`, `pins:write`, `user_accounts:read`
- OAuth state protection: implemented
- Tokens: encrypted HttpOnly cookie session, server-side only
- Continuous refresh: aligned with current Pinterest OAuth documentation
- Board list/create: implemented with duplicate-name reuse
- Pin list/create: implemented through `/api/pinterest/pins`
- Control Room: exposes connection state and real Pin publishing form
- Tracked `.env`: removed from GitHub as a security hardening step

## Deployment

GitHub `main` is connected to the Vercel production project `nectar-affiliate-creator-engine`.

Latest Pinterest UI commit: `d7ccc6b08a4400edbbbd3f4b5d58c201e376619b`

At status update time, the corresponding Vercel production deployment was still BUILDING. No production Pin is claimed as published until a real authenticated Pinterest request returns a Pin ID.

## Remaining acceptance test

The final external test requires the user's authenticated Pinterest session in the browser:

1. Connect Pinterest from `/pinterest`.
2. Confirm granted scope includes `pins:write` and `boards:write`.
3. Create/reuse a board.
4. Publish one real test Pin.
5. Verify Pinterest returns a Pin ID and the Pin appears in the account.
6. Only after that, run the 20-Pin campaign.
