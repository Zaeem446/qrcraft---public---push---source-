import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createStaticQRImage } from '@/lib/qrfy';
import QRCode from 'qrcode';

// Convert content object to a string suitable for QR encoding
function contentToString(type: string, content: Record<string, any>): string {
  switch (type) {
    case 'website':
    case 'instagram':
    case 'facebook':
    case 'video':
      return content.url || 'https://example.com';

    case 'bitcoin':
      return content.address ? `bitcoin:${content.address}` : content.url || 'bitcoin:';

    case 'text':
      return content.text || content.url || 'Hello';

    case 'vcard': {
      const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
      if (content.firstName || content.lastName) lines.push(`FN:${content.firstName || ''} ${content.lastName || ''}`.trim());
      if (content.phone) lines.push(`TEL:${content.phone}`);
      if (content.email) lines.push(`EMAIL:${content.email}`);
      if (content.org) lines.push(`ORG:${content.org}`);
      if (content.title) lines.push(`TITLE:${content.title}`);
      if (content.website) lines.push(`URL:${content.website}`);
      if (content.address) lines.push(`ADR:;;${content.address};;;;`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'wifi':
      return `WIFI:T:${content.encryption || 'WPA'};S:${content.ssid || ''};P:${content.password || ''};;`;

    case 'email':
      return `mailto:${content.email || ''}?subject=${encodeURIComponent(content.subject || '')}&body=${encodeURIComponent(content.message || '')}`;

    case 'sms':
      return `sms:${content.phone || ''}${content.message ? `?body=${encodeURIComponent(content.message)}` : ''}`;

    case 'whatsapp':
      return `https://wa.me/${(content.phone || '').replace(/\D/g, '')}${content.message ? `?text=${encodeURIComponent(content.message)}` : ''}`;

    case 'event': {
      const lines = ['BEGIN:VEVENT'];
      if (content.title) lines.push(`SUMMARY:${content.title}`);
      if (content.location) lines.push(`LOCATION:${content.location}`);
      if (content.description) lines.push(`DESCRIPTION:${content.description}`);
      if (content.startDate) lines.push(`DTSTART:${content.startDate.replace(/[-:]/g, '')}`);
      if (content.endDate) lines.push(`DTEND:${content.endDate.replace(/[-:]/g, '')}`);
      lines.push('END:VEVENT');
      return lines.join('\n');
    }

    default:
      return content.url || content.text || 'https://example.com';
  }
}

// Fallback: generate QR with node `qrcode` package
async function generateFallbackQR(type: string, content: Record<string, any>, design: Record<string, any>): Promise<Buffer> {
  const text = contentToString(type, content);
  const errorLevel = design.errorCorrectionLevel || (design.logo ? 'H' : 'M');

  const buffer = await QRCode.toBuffer(text, {
    errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
    type: 'png',
    width: 400,
    margin: 2,
    color: {
      dark: design.dotsColor || '#000000',
      light: design.bgTransparent ? '#00000000' : (design.backgroundColor || '#FFFFFF'),
    },
  });

  return buffer;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, content, design } = body;

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }

    let imageBuffer: Buffer;

    // Try QRFY first, fall back to local generation
    try {
      imageBuffer = await createStaticQRImage(
        type,
        content || {},
        design || {},
        'png'
      );
    } catch (err) {
      console.warn('QRFY preview failed, using fallback:', err);
      imageBuffer = await generateFallbackQR(type, content || {}, design || {});
    }

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60, s-maxage=120',
      },
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
  }
}
