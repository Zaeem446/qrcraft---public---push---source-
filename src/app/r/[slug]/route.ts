import { NextRequest, NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import prisma from '@/lib/db';

async function getGeoData(ip: string) {
  try {
    if (ip === '127.0.0.1' || ip === '::1') return { country: 'Local', city: 'Local' };
    // Use HTTPS for security (ip-api.com supports both)
    const res = await fetch(`https://ip-api.com/json/${ip}?fields=country,city`, { next: { revalidate: 3600 } });
    if (res.ok) return await res.json();
  } catch {}
  return { country: 'Unknown', city: 'Unknown' };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const qrcode = await prisma.qRCode.findUnique({
      where: { slug },
    });
    if (!qrcode || !qrcode.isActive) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // For QRs migrated to QRFY, QRFY handles tracking and redirects.
    // This route only serves as a legacy fallback for old QR codes without qrfyId.

    // Track scans locally for legacy (non-QRFY) QR codes
    // For QRs with qrfyId, QRFY handles tracking
    if (!qrcode.qrfyId) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
      const userAgent = req.headers.get('user-agent') || '';
      const parser = new UAParser(userAgent);
      const referer = req.headers.get('referer') || '';

      // Get geo data and record scan in parallel, then await both
      // This ensures tracking completes before response is sent
      try {
        const [geo] = await Promise.all([
          getGeoData(ip),
          prisma.qRCode.update({
            where: { id: qrcode.id },
            data: { scanCount: { increment: 1 } },
          }),
        ]);

        // Create scan record (don't block redirect on this)
        await prisma.scan.create({
          data: {
            qrCodeId: qrcode.id,
            userId: qrcode.userId,
            ip,
            country: geo.country,
            city: geo.city,
            device: parser.getDevice().type || 'desktop',
            browser: parser.getBrowser().name || 'Unknown',
            os: parser.getOS().name || 'Unknown',
            referer,
          },
        });
      } catch (trackingError) {
        // Log but don't fail the redirect
        console.error('Tracking error:', trackingError);
      }
    }

    const content = qrcode.content as any;
    const type = qrcode.type;

    // Direct redirects for URL-based types
    if (type === 'website' && content.url) {
      return NextResponse.redirect(content.url);
    }
    if (type === 'video' && content.url) {
      return NextResponse.redirect(content.url);
    }
    if (type === 'instagram' && content.url) {
      return NextResponse.redirect(content.url);
    }
    if (type === 'facebook' && content.url) {
      return NextResponse.redirect(content.url);
    }

    // For non-URL types, redirect to a landing page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrcraft-public-push-source.vercel.app';
    return NextResponse.redirect(`${baseUrl}/qr/${slug}`);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
