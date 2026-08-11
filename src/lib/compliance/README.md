# Compliance Data Layer

This folder is a standalone, dependency-light data pack for Nectar's nine-platform compliance matrix.

## Files

- `platform-matrix.ts` — TypeScript single source of truth for the nine platforms currently published on `/compliance`, including risk level, flagged triggers, safe posting approach, and notes.
- `scan-rules.ts` — deterministic helpers for platform normalization, selectable-platform lists, and lightweight phrase/category hints. It makes no AI calls and contains no UI logic.
- `PLATFORM_MATRIX.md` — human-readable export of the same nine-platform data for documentation or future buyer-facing use.
- `README.md` — this integration note.

## Future integration, separate prompt required

The current live scanner handles six platforms. A future implementation prompt can extend it to nine using this data layer.

### API scanner

In `src/app/api/scan/route.ts`, import the matrix and helpers from this folder, for example:

```ts
import { PLATFORM_MATRIX, PLATFORM_MATRIX_BY_ID } from "@/lib/compliance/platform-matrix";
import { listSelectablePlatforms, normalizePlatformId } from "@/lib/compliance/scan-rules";
```

Use the canonical ids and matrix records when constructing scanner platform context. Do not duplicate the nine-platform policy data inside the route.

### Scanner UI

In `src/app/scanner/page.tsx`, import the selectable platform list and/or matrix to add the three missing chips: `snapchat`, `discord`, and `telegram`.

Do not perform this integration from this data-only change. It belongs in a separate prompt so the API/UI work can be tested independently.

## Boundary

This folder intentionally does not modify the scanner route, scanner page, compliance page, navigation, or any other existing application file. The data layer is ready for a later integration pass.
