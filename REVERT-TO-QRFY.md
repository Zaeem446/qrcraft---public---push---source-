# How to Revert to QRFY API

**Trigger phrase:** "lets revert it and go back to qrfy"

## What Was Changed

We replaced the QRFY API (which was banned) with a self-hosted solution using `qr-code-styling` library for client-side QR generation.

### Files Modified:

1. **`src/lib/qr-generator.ts`** - Was rewritten to be a stub (no actual QR generation)
2. **`src/lib/qrfy.ts`** - Re-exports from qr-generator.ts (original QRFY code is commented out)
3. **`src/components/qr/StyledQRPreview.tsx`** - NEW file for client-side QR generation
4. **`src/app/dashboard/create/page.tsx`** - Uses StyledQRPreview instead of API
5. **`src/app/dashboard/edit/[id]/page.tsx`** - Uses StyledQRPreview instead of API

### Packages Added:
- `qr-code-styling` (for client-side QR generation)

### Packages Removed:
- `jsdom`
- `@types/jsdom`
- `mobstac-awesome-qr` (was attempted but didn't work on Vercel)

---

## How to Revert to QRFY

### Step 1: Restore qrfy.ts

The original QRFY code should be in the git history. Run:

```bash
git log --oneline src/lib/qrfy.ts
```

Find the commit BEFORE "feature/self-hosted-qr" was merged (around commit before the QRFY ban issue).

Or manually restore the original qrfy.ts which looked like:

```typescript
// Original qrfy.ts made API calls to:
// POST https://qrfy.com/api/public/qr/create
// PUT https://qrfy.com/api/public/qr/{id}
// DELETE https://qrfy.com/api/public/qr/{id}
// GET https://qrfy.com/api/public/qr/{id}/download
// POST https://qrfy.com/api/public/qr/static-image

// It used QRFY_API_KEY environment variable
```

### Step 2: Restore create/edit pages

Revert these files to use the API-based preview:

**src/app/dashboard/create/page.tsx:**
- Remove dynamic import of StyledQRPreview
- Restore `fetchPreview` function that calls `/api/qrcodes/preview`
- Restore `previewUrl` state and API-based image display

**src/app/dashboard/edit/[id]/page.tsx:**
- Same changes as create page

### Step 3: Restore preview API route

**src/app/api/qrcodes/preview/route.ts:**
- Should call `createStaticQRImage` from qrfy.ts
- The original version used QRFY API to generate styled QR images

### Step 4: Remove new packages

```bash
npm uninstall qr-code-styling
```

### Step 5: Delete new files

```bash
rm src/components/qr/StyledQRPreview.tsx
rm REVERT-TO-QRFY.md
```

### Step 6: Restore environment variables

Make sure `QRFY_API_KEY` is set in Vercel environment variables.

---

## Git Commands to Find Original Code

```bash
# Find commits before the self-hosted changes
git log --oneline --all | head -50

# Show the original qrfy.ts
git show <commit-hash>:src/lib/qrfy.ts

# Restore a specific file from a commit
git checkout <commit-hash> -- src/lib/qrfy.ts
```

---

## Original QRFY API Endpoints Used

1. **Create QR:** `POST /api/public/qr/create`
2. **Update QR:** `PUT /api/public/qr/{id}`
3. **Delete QR:** `DELETE /api/public/qr/{id}`
4. **Get Image:** `GET /api/public/qr/{id}/download?format=png`
5. **Static Image:** `POST /api/public/qr/static-image`

Base URL: `https://qrfy.com`
Auth Header: `X-API-KEY: {QRFY_API_KEY}`

---

## Why We Changed

QRFY API returned error: `{"error":true,"message":"USER_BANNED","errorCode":"banned"}`

The account was banned, so all QR generation, previews, patterns, frames, corners stopped working.

---

## Current Solution

- All QR generation happens client-side using `qr-code-styling` library
- `StyledQRPreview` component renders QR codes in the browser
- Server-side `qr-generator.ts` is just stubs for API compatibility
- No server-side QR image generation
