// Test script to generate QR images for all QRFY frame IDs (0-30)
// Run with: npx tsx scripts/test-qrfy-frames.ts

import * as fs from 'fs';
import * as path from 'path';

const QRFY_API_URL = process.env.QRFY_API_URL || 'https://qrfy.com';
const QRFY_API_KEY = process.env.QRFY_API_KEY || '';

if (!QRFY_API_KEY) {
  console.error('Error: QRFY_API_KEY environment variable is required');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '../frame-tests');

async function generateFrameImage(frameId: number): Promise<Buffer | null> {
  const style: Record<string, any> = {
    shape: {
      style: 'square',
      color: '#000000',
      backgroundColor: '#FFFFFF',
    },
    corners: {
      squareStyle: 'default',
      dotStyle: 'default',
      squareColor: '#000000',
      dotColor: '#000000',
    },
    frame: {
      id: frameId,
      color: '#7C3AED',
      text: `Frame ${frameId}`,
      fontSize: 42,
      textColor: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  };

  // Only add backgroundColor for frames > 0
  if (frameId > 0) {
    style.frame.backgroundColor = '#7C3AED';
  }

  const body = {
    type: 'url-static',
    data: { url: 'https://example.com' },
    style,
  };

  try {
    const res = await fetch(`${QRFY_API_URL}/api/public/qrs/png`, {
      method: 'POST',
      headers: {
        'API-KEY': QRFY_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Frame ${frameId} failed (${res.status}): ${err}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Frame ${frameId} error:`, error);
    return null;
  }
}

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Generating QR images for frames 0-30...\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const results: { id: number; success: boolean }[] = [];

  for (let frameId = 0; frameId <= 30; frameId++) {
    process.stdout.write(`Frame ${frameId.toString().padStart(2, '0')}... `);

    const buffer = await generateFrameImage(frameId);

    if (buffer) {
      const filename = `frame-${frameId.toString().padStart(2, '0')}.png`;
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
      console.log(`✓ Saved ${filename}`);
      results.push({ id: frameId, success: true });
    } else {
      console.log(`✗ Failed`);
      results.push({ id: frameId, success: false });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n--- Summary ---');
  const successful = results.filter(r => r.success).length;
  console.log(`Generated: ${successful}/31 frames`);
  console.log(`\nOpen ${OUTPUT_DIR} to view the frame images.`);
}

main().catch(console.error);
