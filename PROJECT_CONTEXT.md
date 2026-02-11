# QRCraft Project Context

## Project Overview
QRCraft is a QR code generator application that uses the QRFY API for generating styled QR codes.

## Current Issue: Corner Dot Style Off-by-One Problem

### The Problem
When selecting corner dot styles in the UI:
- Selecting position 2 shows position 1's preview
- Selecting position 3 shows position 2's preview
- There's an off-by-one mismatch between what the user selects and what the API produces

### Additional Issues
- Position 17 is a duplicate of position 16 (both are hearts) - should be removed
- Position 1 is "default" (standard) and should be preselected
- Position 2 should look "like first but with sharper corners"

## Key Files

### 1. `/src/components/qr/DesignOptions.tsx`
- Contains the UI for selecting QR code design options
- `CORNER_DOT_STYLES` array (currently 17 items, positions 1-17)
- `CornerDotSVG({ num })` function renders SVG thumbnails from `QRFY_CENTER_SVGS[num]`
- Buttons set `design.cornersDotType` to the position number (1-17)

### 2. `/src/lib/qrfy.ts`
- Contains API mapping from UI position numbers to QRFY API style names
- `CORNER_DOT_NUM_TO_NAME` mapping:
  ```
  1: 'default'
  2: 'square'
  3: 'dot'
  4: 'rounded'
  5: 'square2'
  6: 'square3'
  7: 'dot2'
  8: 'dot3'
  9: 'dot4'
  10: 'sun'
  11: 'star'
  12: 'diamond'
  13: 'x'
  14: 'x-rounded'
  15: 'cross'
  16: 'cross-rounded'
  17: 'heart'
  ```
- `getCornerDotStyle(style)` converts position number to API name

### 3. `/src/lib/qrfy-svgs.ts`
- Contains SVG thumbnail data for each style
- `QRFY_CENTER_SVGS` has entries 1-17
- SVGs were extracted from JSON file

### 4. `/src/app/dashboard/create/page.tsx`
- Main create page with design state
- Default design values (currently uses string values like `"dot"` but should use numbers)

### 5. Source JSON File
- `/Users/zaeemaslam853/Downloads/extract-data-2026-02-11.json`
- Contains extracted data from reference site with:
  - `categories.corner_dots[]` - 17 items with `api_id` and `svg_code`

## JSON Corner Dots Data Structure
```json
{
  "categories": {
    "corner_dots": [
      { "display_name": "Center style 1", "api_id": "default", "svg_code": "..." },
      { "display_name": "Center style 2", "api_id": "square", "svg_code": "..." },
      { "display_name": "Center style 3", "api_id": "dot", "svg_code": "..." },
      // ... through 17
    ]
  }
}
```

## The Core Issue
The SVG thumbnails extracted from the reference site don't match what the QRFY API actually produces for each style name. When the user clicks position 3:
1. UI sets `cornersDotType = 3`
2. API mapping sends style name `"dot"` to QRFY
3. QRFY returns a QR that looks like position 2's thumbnail
4. This creates the off-by-one visual mismatch

## Attempted Fixes (All Reverted)
1. Changed default values from strings to numbers - didn't fix preview mismatch
2. Shifted SVG display index - caused other issues
3. Shifted API mapping - caused other issues
4. Created custom SVG for position 2 - still didn't fix core issue

## What Needs to Be Done
1. Figure out the ACTUAL mapping between QRFY API style names and their visual output
2. Either:
   - Remap the SVG thumbnails to match what each API style produces, OR
   - Remap the API style names to match what each SVG thumbnail shows
3. Remove duplicate position 17
4. Ensure position 1 (default) is preselected
5. Position 2 should show "like first but with sharper corners" (per user)

## Test Page
There's a test page at `/admin/style-test/page.tsx` that can generate QR codes for each style to help figure out the correct mapping.

## Current State
Code has been reverted to commit `2f4faba` "Rebuild everything from JSON as single source of truth" - the clean state before attempted fixes.

## Git Repository
https://github.com/Zaeem446/qrcraft---public---push---source-.git
Branch: main
