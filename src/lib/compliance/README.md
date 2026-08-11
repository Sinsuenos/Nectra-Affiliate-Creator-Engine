# Compliance Data Layer

This folder is a standalone, dependency-light data pack for Nectar's nine-platform compliance matrix.

## Files

- `platform-matrix.ts` - TypeScript single source of truth for the nine platforms currently published on `/compliance`, including risk level, flagged triggers, safe posting approach, and notes. Source citations are included as code comments above Snapchat, Discord, and Telegram entries.
- `scan-rules.ts` - Deterministic helpers for platform normalization, selectable-platform lists, and lightweight phrase/category hints. It makes no AI calls and contains no UI logic.
- `PLATFORM_MATRIX.md` - Human-readable export of the same nine-platform data for documentation or future buyer-facing use. Includes source basis lines for Snapchat, Discord, and Telegram.
- `README.md` - This integration note.

## Integration status

The data layer is fully wired into the scanner:
- `src/app/api/scan/route.ts` imports `PLATFORM_MATRIX` and builds the system prompt from all 9 platform records dynamically.
- `src/app/scanner/page.tsx` includes all 9 platform selection chips (TikTok, Instagram, Facebook, Reddit, X, Pinterest, Snapchat, Discord, Telegram).
- The scanner uses sequential batching (2 platforms per API call) for all 9 platforms.
