/**
 * Test script to generate QR codes for each QRFY style
 * Run with: npx ts-node scripts/test-qrfy-styles.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QRFY_API_KEY = process.env.QRFY_API_KEY;
const QRFY_API_URL = 'https://api.qrfy.com/api/public/qrcode/generate/url-static';

// All 19 valid QRFY shape style names (from API error message)
const SHAPE_STYLES = [
  'square',
  'rounded',
  'dots',
  'classy',
  'classy-rounded',
  'extra-rounded',
  'horizontal-rounded',
  'vertical-rounded',
  'ribbon',
  'diamond-special',
  'star',
  'diamond',
  'x',
  'x-rounded',
  'cross',
  'cross-rounded',
  'heart',
  'sparkle',
  'shake',
];

// Corner square styles
const CORNER_SQUARE_STYLES = [
  'default',
  'dot',
  'square',
  'extra-rounded',
  'shape1',
  'shape2',
  'shape3',
  'shape4',
  'shape5',
  'shape6',
  'shape7',
  'shape8',
  'shape9',
  'shape10',
  'shape11',
];

// Corner dot styles
const CORNER_DOT_STYLES = [
  'default',
  'dot',
  'rounded',
  'dot2',
  'dot3',
  'dot4',
  'star',
  'diamond',
  'x',
  'cross',
  'sun',
  'square2',
  'square3',
  'cross-rounded',
  'x-rounded',
  'heart',
];

async function generateQR(styleName: string, styleType: 'shape' | 'corner-square' | 'corner-dot', index: number) {
  const payload: any = {
    type: 'url-static',
    style: {
      shape: {
        style: styleType === 'shape' ? styleName : 'square',
        color: '#000000',
        backgroundColor: '#FFFFFF',
      },
      corners: {
        squareStyle: styleType === 'corner-square' ? styleName : 'default',
        dotStyle: styleType === 'corner-dot' ? styleName : 'default',
        squareColor: '#000000',
        dotColor: '#000000',
      },
      errorCorrectionLevel: 'M',
    },
    data: {
      url: 'https://example.com',
    },
  };

  try {
    const response = await fetch(QRFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': QRFY_API_KEY!,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed for ${styleType}/${styleName}: ${response.status} - ${errorText}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error(`Error for ${styleType}/${styleName}:`, error);
    return null;
  }
}

async function main() {
  if (!QRFY_API_KEY) {
    console.error('QRFY_API_KEY environment variable is required');
    console.log('Run with: QRFY_API_KEY=your_key npx ts-node scripts/test-qrfy-styles.ts');
    process.exit(1);
  }

  const outputDir = path.join(__dirname, '../qrfy-style-samples');

  // Create output directories
  fs.mkdirSync(path.join(outputDir, 'shapes'), { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'corner-squares'), { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'corner-dots'), { recursive: true });

  console.log('Generating shape style samples...');
  for (let i = 0; i < SHAPE_STYLES.length; i++) {
    const style = SHAPE_STYLES[i];
    console.log(`  [${i + 1}/${SHAPE_STYLES.length}] ${style}...`);
    const buffer = await generateQR(style, 'shape', i);
    if (buffer) {
      fs.writeFileSync(path.join(outputDir, 'shapes', `${i + 1}-${style}.png`), buffer);
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nGenerating corner square style samples...');
  for (let i = 0; i < CORNER_SQUARE_STYLES.length; i++) {
    const style = CORNER_SQUARE_STYLES[i];
    console.log(`  [${i + 1}/${CORNER_SQUARE_STYLES.length}] ${style}...`);
    const buffer = await generateQR(style, 'corner-square', i);
    if (buffer) {
      fs.writeFileSync(path.join(outputDir, 'corner-squares', `${i + 1}-${style}.png`), buffer);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nGenerating corner dot style samples...');
  for (let i = 0; i < CORNER_DOT_STYLES.length; i++) {
    const style = CORNER_DOT_STYLES[i];
    console.log(`  [${i + 1}/${CORNER_DOT_STYLES.length}] ${style}...`);
    const buffer = await generateQR(style, 'corner-dot', i);
    if (buffer) {
      fs.writeFileSync(path.join(outputDir, 'corner-dots', `${i + 1}-${style}.png`), buffer);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone! Samples saved to: ${outputDir}`);
  console.log('\nNext steps:');
  console.log('1. Open the qrfy-style-samples folder');
  console.log('2. Compare each image to the SVG thumbnails in the UI');
  console.log('3. Tell me which JSON number matches which API style name');
}

main().catch(console.error);
