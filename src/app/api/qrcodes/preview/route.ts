import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import { createStaticQRImage } from '@/lib/qrfy';
import QRCode from 'qrcode';

// Convert content object to a string suitable for QR encoding
function contentToString(type: string, content: Record<string, any>): string {
  switch (type) {
    case 'website':
    case 'instagram':
    case 'facebook':
      return content.url || 'https://example.com';

    case 'video':
      return content.url || content.fileUrl || 'https://example.com';

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
      if (content.organizer) lines.push(`ORGANIZER:${content.organizer}`);
      lines.push('END:VEVENT');
      return lines.join('\n');
    }

    case 'links': {
      const parts = [content.title || 'Links'];
      if (Array.isArray(content.links)) {
        for (const link of content.links) {
          if (link.url) parts.push(`${link.label || ''}: ${link.url}`);
        }
      }
      return parts.join('\n') || 'https://example.com';
    }

    case 'business': {
      const parts = [content.companyName || 'Business'];
      if (content.address) parts.push(content.address);
      if (content.phone) parts.push(content.phone);
      if (content.email) parts.push(content.email);
      if (content.website) parts.push(content.website);
      return parts.join('\n');
    }

    case 'apps':
      return content.iosUrl || content.androidUrl || content.otherUrl || 'https://example.com';

    case 'coupon': {
      const parts = [content.title || 'Coupon'];
      if (content.code) parts.push(`Code: ${content.code}`);
      if (content.discount) parts.push(`Discount: ${content.discount}`);
      if (content.expiryDate) parts.push(`Expires: ${content.expiryDate}`);
      return parts.join('\n');
    }

    case 'review':
      return content.title || content.url || 'Leave a review';

    case 'social': {
      if (Array.isArray(content.platforms)) {
        const urls = content.platforms.map((p: any) => `${p.platform || ''}: ${p.url || ''}`).join('\n');
        return urls || 'https://example.com';
      }
      return content.url || 'https://example.com';
    }

    case 'menu': {
      const parts = [content.restaurantName || 'Menu'];
      if (Array.isArray(content.sections)) {
        for (const section of content.sections) {
          parts.push(section.name || 'Section');
        }
      }
      return parts.join('\n');
    }

    case 'pdf':
    case 'mp3':
    case 'images':
      return content.fileUrl || content.url || 'https://example.com';

    case 'phone':
      return `tel:${(content.phone || '').replace(/\s/g, '')}`;

    case 'playlist': {
      const parts = [content.title || 'Playlist'];
      if (Array.isArray(content.platformLinks)) {
        for (const link of content.platformLinks) {
          if (link.url) parts.push(`${link.platform || ''}: ${link.url}`);
        }
      }
      return parts.join('\n') || 'https://example.com';
    }

    case 'product':
      return content.buyUrl || content.productName || 'https://example.com';

    case 'feedback':
      return content.title || 'Feedback Form';

    case 'calendar': {
      const calLines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT'];
      if (content.eventTitle) calLines.push(`SUMMARY:${content.eventTitle}`);
      if (content.description) calLines.push(`DESCRIPTION:${content.description}`);
      if (content.location) calLines.push(`LOCATION:${content.location}`);
      if (content.startDate) calLines.push(`DTSTART:${content.startDate.replace(/[-:T]/g, '').slice(0, 15)}`);
      if (content.endDate) calLines.push(`DTEND:${content.endDate.replace(/[-:T]/g, '').slice(0, 15)}`);
      calLines.push('END:VEVENT', 'END:VCALENDAR');
      return calLines.join('\n');
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
    width: 600, // Match download size for consistency
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
    const user = await getAuthUser();
    if (!user) {
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
