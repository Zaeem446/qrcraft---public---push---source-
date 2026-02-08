# Self-Hosted QR Generation (Dormant)

This folder contains the self-hosted QR code generation system. It is NOT active - we are currently using QRFY API.

## When to Use

Activate this system when:
- QRFY API is banned or unavailable
- You want to avoid API costs
- You need full control over QR generation

## Files

- `CustomSVGQR.tsx` - Main QR renderer with all 19 patterns, 13+ corner styles, 31 frames
- `qr-generator-stub.ts` - Stub functions that replace qrfy.ts API calls
- `create-page-self-hosted.tsx` - Dashboard create page with slug prop
- `edit-page-self-hosted.tsx` - Dashboard edit page with slug prop
- `api-qrcodes-route-self-hosted.ts` - QR creation API without QRFY
- `redirect-route-self-hosted.ts` - Redirect route with local scan tracking

## How to Activate

See `/SWITCHING-QR-SYSTEMS.md` for detailed instructions.

**Quick version:**
```bash
cp src/lib/qr-self-hosted/CustomSVGQR.tsx src/components/qr/CustomSVGQR.tsx
cp src/lib/qr-self-hosted/qr-generator-stub.ts src/lib/qrfy.ts
cp src/lib/qr-self-hosted/create-page-self-hosted.tsx src/app/dashboard/create/page.tsx
cp src/lib/qr-self-hosted/edit-page-self-hosted.tsx src/app/dashboard/edit/[id]/page.tsx
cp src/lib/qr-self-hosted/api-qrcodes-route-self-hosted.ts src/app/api/qrcodes/route.ts
cp src/lib/qr-self-hosted/redirect-route-self-hosted.ts src/app/r/[slug]/route.ts
```

## Key Features

- Client-side SVG QR rendering (no server-side dependencies)
- All 19 QRFY patterns replicated
- All corner square and dot styles
- All 31 frame styles
- Local scan tracking via database
- Redirect URL encoding for dynamic types
