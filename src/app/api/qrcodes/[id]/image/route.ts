import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getQRImage, createStaticQRImage } from '@/lib/qrfy';
import QRCode from 'qrcode';

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
};

// Static types embed data directly in the QR code
const STATIC_TYPES = ['text', 'wifi', 'email', 'sms', 'bitcoin', 'phone', 'calendar'];

// Convert content to a QR-encodable string (last resort fallback)
function contentToString(type: string, content: Record<string, any>): string {
  switch (type) {
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
    case 'phone':
      return `tel:${content.phone || ''}`;
    case 'calendar': {
      const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT'];
      if (content.title) lines.push(`SUMMARY:${content.title}`);
      if (content.startDate) lines.push(`DTSTART:${content.startDate.replace(/[-:]/g, '').replace('.000', '')}`);
      if (content.endDate) lines.push(`DTEND:${content.endDate.replace(/[-:]/g, '').replace('.000', '')}`);
      if (content.location) lines.push(`LOCATION:${content.location}`);
      if (content.description) lines.push(`DESCRIPTION:${content.description}`);
      lines.push('END:VEVENT', 'END:VCALENDAR');
      return lines.join('\n');
    }
    default:
      return content.url || content.text || 'https://example.com';
  }
}

// Get the URL/data to encode in the QR
function getQRDataString(qrcode: { type: string; slug: string | null; content: any }): string {
  const content = qrcode.content as Record<string, any>;
  const type = qrcode.type;

  if (STATIC_TYPES.includes(type)) {
    return contentToString(type, content);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrcraft-public-push-source.vercel.app';
  if (qrcode.slug) {
    return `${baseUrl}/r/${qrcode.slug}`;
  }

  if (type === 'website' && content.url) return content.url;
  if (type === 'video' && content.url) return content.url;
  if (type === 'instagram' && content.url) return content.url;
  if (type === 'facebook' && content.url) return content.url;
  if (type === 'whatsapp') {
    return `https://wa.me/${(content.phone || '').replace(/\D/g, '')}${content.message ? `?text=${encodeURIComponent(content.message)}` : ''}`;
  }

  return contentToString(type, content);
}

// Build content with the actual redirect URL for QRFY static image generation
function getContentForQRFY(qrcode: { type: string; slug: string | null; content: any }): Record<string, any> {
  const content = qrcode.content as Record<string, any>;
  const type = qrcode.type;

  // For static types, use original content as-is
  if (STATIC_TYPES.includes(type)) {
    return content;
  }

  // For dynamic types, override URL with the redirect URL so the QR encodes
  // the tracking redirect, not a placeholder
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrcraft-public-push-source.vercel.app';
  const redirectUrl = qrcode.slug ? `${baseUrl}/r/${qrcode.slug}` : (content.url || `${baseUrl}/preview`);

  return { ...content, url: redirectUrl };
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

    let imageBuffer: Buffer | null = null;
    const content = qrcode.content as Record<string, any>;
    const design = (qrcode.design as Record<string, any>) || {};

    // 1) Try QRFY stored image (if QR was created on QRFY)
    if (qrcode.qrfyId) {
      try {
        imageBuffer = await getQRImage(qrcode.qrfyId, format);
        console.log(`[QR Image] Tier 1 OK: qrfyId=${qrcode.qrfyId}, ${imageBuffer.length} bytes`);
      } catch (err: any) {
        console.error(`[QR Image] Tier 1 failed (qrfyId=${qrcode.qrfyId}):`, err?.message || err);
      }
    }

    // 2) Try QRFY static image generation (applies full design styling)
    if (!imageBuffer) {
      try {
        const qrfyContent = getContentForQRFY(qrcode);
        const staticFormat = format === 'jpeg' ? 'png' : format;
        imageBuffer = await createStaticQRImage(qrcode.type, qrfyContent, design, staticFormat);
        console.log(`[QR Image] Tier 2 OK: type=${qrcode.type}, format=${staticFormat}, ${imageBuffer.length} bytes`);
      } catch (err: any) {
        console.error(`[QR Image] Tier 2 failed (type=${qrcode.type}):`, err?.message || err);
      }
    }

    // 3) Last resort: basic local generation (no custom shapes/frames, only colors)
    if (!imageBuffer) {
      const text = getQRDataString(qrcode);
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
        'Content-Disposition': `inline; filename="${qrcode.name || 'qrcode'}.${format}"`,
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch (error) {
    console.error('Error downloading QR image:', error);
    return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
  }
}
