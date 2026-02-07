// Debug test for QR generation
import { createStaticQRImage } from './src/lib/qr-generator';
import * as fs from 'fs';

async function test() {
  console.log('Testing createStaticQRImage...\n');

  const design = {
    dotsColor: "#6D28D9",
    dotsType: "rounded",
    cornersSquareColor: "#6D28D9",
    cornersSquareType: "extra-rounded",
    cornersDotColor: "#6D28D9",
    cornersDotType: "dot",
    backgroundColor: "#FFFFFF",
    frameId: 1,
    frameColor: "#6D28D9",
    frameText: "Scan me!",
    frameTextColor: "#FFFFFF",
  };

  try {
    console.log('Design options:', JSON.stringify(design, null, 2));
    console.log('\nGenerating QR...');

    const buffer = await createStaticQRImage(
      'website',
      { url: 'https://example.com' },
      design,
      'png'
    );

    fs.writeFileSync('debug-qr.png', buffer);
    console.log(`\n✓ Generated ${buffer.length} bytes -> debug-qr.png`);
    console.log('Check the file to see if patterns/frames/colors are correct.');
  } catch (err: any) {
    console.error('\n✗ Error:', err.message);
    console.error(err.stack);
  }
}

test();
