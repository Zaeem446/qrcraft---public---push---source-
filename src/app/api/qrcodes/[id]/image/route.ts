import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getQRImage } from '@/lib/qrfy';
import QRCode from 'qrcode';

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
};

// Convert content object to a QR-encodable string
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
    default:
      return content.url || content.text || 'https://example.com';
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get('format') || 'png') as 'png' | 'webp' | 'jpeg';

    if (!CONTENT_TYPES[format]) {
      return NextResponse.json({ error: 'Invalid format. Use png, webp, or jpeg.' }, { status: 400 });
    }

    const qrcode = await prisma.qRCode.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!qrcode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    let imageBuffer: Buffer;

    if (qrcode.qrfyId) {
      // Use QRFY API
      imageBuffer = await getQRImage(qrcode.qrfyId, format);
    } else {
      // Fallback: generate locally
      const content = qrcode.content as Record<string, any>;
      const design = (qrcode.design as Record<string, any>) || {};
      const text = contentToString(qrcode.type, content);
      const errorLevel = design.errorCorrectionLevel || (design.logo ? 'H' : 'M');

      imageBuffer = await QRCode.toBuffer(text, {
        errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
        type: 'png',
        width: 600,
        margin: 2,
        color: {
          dark: design.dotsColor || '#000000',
          light: design.bgTransparent ? '#00000000' : (design.backgroundColor || '#FFFFFF'),
        },
      });
    }

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': CONTENT_TYPES[format],
        'Content-Disposition': `attachment; filename="${qrcode.name || 'qrcode'}.${format}"`,
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch (error) {
    console.error('Error downloading QR image:', error);
    return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
  }
}
