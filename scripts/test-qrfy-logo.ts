// Test script to check QRFY logo format
// Run with: npx tsx scripts/test-qrfy-logo.ts

const QRFY_API_URL = process.env.QRFY_API_URL || 'https://qrfy.com';
const QRFY_API_KEY = process.env.QRFY_API_KEY || '';

if (!QRFY_API_KEY) {
  console.error('Error: QRFY_API_KEY environment variable is required');
  process.exit(1);
}

async function testLogo(logoValue: any, description: string): Promise<void> {
  console.log(`\nTesting: ${description}`);
  console.log(`Logo value: ${JSON.stringify(logoValue)}`);

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
    errorCorrectionLevel: 'H',
  };

  // Add logo in different ways to test
  if (logoValue !== null) {
    if (typeof logoValue === 'string') {
      style.image = logoValue;
    } else {
      Object.assign(style, logoValue);
    }
  }

  console.log('Style object:', JSON.stringify(style, null, 2));

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
      console.log(`❌ Failed (${res.status}): ${err}`);
    } else {
      const buffer = await res.arrayBuffer();
      console.log(`✅ Success! Image size: ${buffer.byteLength} bytes`);
    }
  } catch (error) {
    console.log(`❌ Error:`, error);
  }
}

async function main() {
  console.log('Testing QRFY logo formats...\n');

  // Test 1: No logo
  await testLogo(null, 'No logo');

  // Test 2: image as URL string
  await testLogo('https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg', 'image as URL string');

  // Test 3: image as object with url
  await testLogo({ image: { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg' } }, 'image as object with url');

  // Test 4: logo property instead of image
  await testLogo({ logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg' }, 'logo as URL string');

  // Test 5: logo as object
  await testLogo({ logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg' } }, 'logo as object with url');

  // Test 6: centerImage
  await testLogo({ centerImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg' }, 'centerImage as URL');

  console.log('\n--- Done ---');
}

main().catch(console.error);
