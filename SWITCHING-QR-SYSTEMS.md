# Switching Between QR Code Systems

This project has two QR code generation systems:

1. **QRFY API** (currently active) - Uses qrfy.com API for QR generation
2. **Self-Hosted** (dormant) - Uses custom SVG rendering, no external API

---

## Current Status: QRFY API

The project is currently using QRFY API for:
- QR code creation and styling
- Pattern/corner/frame customization
- Analytics and tracking

---

## Dormant Files Location

Self-hosted code is stored in `/src/lib/qr-self-hosted/`:

| File | Description |
|------|-------------|
| `CustomSVGQR.tsx` | Main custom SVG QR renderer with all patterns, corners, frames |
| `qr-generator-stub.ts` | Stub functions for API compatibility |
| `create-page-self-hosted.tsx` | Create page with slug prop for tracking |
| `edit-page-self-hosted.tsx` | Edit page with slug prop for tracking |
| `api-qrcodes-route-self-hosted.ts` | API route without QRFY dependency |
| `redirect-route-self-hosted.ts` | Redirect route with local scan tracking |

---

## Switch to Self-Hosted

**Trigger phrase:** "switch to self-hosted qr"

### Steps:

1. **Replace qrfy.ts with stub:**
   ```bash
   cp src/lib/qr-self-hosted/qr-generator-stub.ts src/lib/qrfy.ts
   ```

2. **Copy CustomSVGQR to components:**
   ```bash
   cp src/lib/qr-self-hosted/CustomSVGQR.tsx src/components/qr/CustomSVGQR.tsx
   ```

3. **Replace create page:**
   ```bash
   cp src/lib/qr-self-hosted/create-page-self-hosted.tsx src/app/dashboard/create/page.tsx
   ```

4. **Replace edit page:**
   ```bash
   cp src/lib/qr-self-hosted/edit-page-self-hosted.tsx src/app/dashboard/edit/[id]/page.tsx
   ```

5. **Replace API routes:**
   ```bash
   cp src/lib/qr-self-hosted/api-qrcodes-route-self-hosted.ts src/app/api/qrcodes/route.ts
   cp src/lib/qr-self-hosted/redirect-route-self-hosted.ts src/app/r/[slug]/route.ts
   ```

6. **Verify and deploy:**
   ```bash
   npm run build
   git add -A && git commit -m "Switch to self-hosted QR generation"
   git push
   ```

---

## Switch Back to QRFY

**Trigger phrase:** "switch to qrfy"

### Steps:

1. **Restore QRFY from git history:**
   ```bash
   git checkout f5a49d1 -- src/lib/qrfy.ts
   git checkout f5a49d1 -- src/app/api/qrcodes/route.ts
   git checkout f5a49d1 -- src/app/r/[slug]/route.ts
   git checkout f5a49d1 -- src/app/dashboard/create/page.tsx
   git checkout f5a49d1 -- src/app/dashboard/edit/[id]/page.tsx
   ```

2. **Delete qr-generator.ts if exists:**
   ```bash
   rm src/lib/qr-generator.ts 2>/dev/null || true
   ```

3. **Verify and deploy:**
   ```bash
   npm run build
   git add -A && git commit -m "Switch to QRFY API"
   git push
   ```

---

## Key Differences

| Feature | QRFY API | Self-Hosted |
|---------|----------|-------------|
| QR Generation | Server-side via QRFY | Client-side SVG |
| Analytics | QRFY handles tracking | Local database tracking |
| Patterns | 19 patterns via API | 19 patterns in CustomSVGQR |
| Frames | 31 frames via API | 31 frames in CustomSVGQR |
| Dependency | Requires QRFY API key | No external API |
| Cost | API subscription | Free |
| Risk | Can be banned | Full control |

---

## Environment Variables

### QRFY (required when using QRFY):
```
QRFY_API_URL=https://qrfy.com
QRFY_API_KEY=your-api-key
```

### Self-Hosted (required when using self-hosted):
```
NEXT_PUBLIC_APP_URL=https://qr-craft.online
```

---

## Commit References

- **Last working QRFY:** `f5a49d1`
- **Self-hosted implementation:** `3bb5532` and earlier commits

---

## Notes

- Self-hosted version encodes redirect URL (`/r/[slug]`) for dynamic types to enable scan tracking
- QRFY version handles tracking internally, QR points to our redirect which redirects to actual content
- Both systems use the same database schema for QR codes and scans
