import { NextRequest, NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import prisma from '@/lib/db';

async function getGeoData(ip: string) {
  try {
    if (ip === '127.0.0.1' || ip === '::1') return { country: 'Local', city: 'Local' };
    const res = await fetch(`https://ip-api.com/json/${ip}?fields=country,city`, { next: { revalidate: 3600 } });
    if (res.ok) return await res.json();
  } catch {}
  return { country: 'Unknown', city: 'Unknown' };
}

function isSubscriptionActive(user: {
  plan: string;
  subscriptionStatus: string;
  trialEndsAt: Date | null;
  subscriptionEndsAt: Date | null;
}): boolean {
  // Active subscription
  if (user.subscriptionStatus === 'active') return true;

  // Trial still valid
  if (user.subscriptionStatus === 'trialing' && user.trialEndsAt && new Date(user.trialEndsAt) > new Date()) {
    return true;
  }

  // Past due (grace period — still allow)
  if (user.subscriptionStatus === 'past_due') return true;

  return false;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';

    const qrcode = await prisma.qRCode.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            plan: true,
            subscriptionStatus: true,
            trialEndsAt: true,
            subscriptionEndsAt: true,
          },
        },
      },
    });
    if (!qrcode || !qrcode.isActive) {
      return NextResponse.redirect(`${baseUrl}/qr-expired`);
    }

    // Check if user has active subscription or trial
    if (!isSubscriptionActive(qrcode.user)) {
      return NextResponse.redirect(`${baseUrl}/qr-expired`);
    }

    // P1: Check scan limit
    if (qrcode.scanLimit !== null && qrcode.scanLimit > 0) {
      if (qrcode.scanCount >= qrcode.scanLimit) {
        return NextResponse.redirect(`${baseUrl}/qr-expired?reason=limit`);
      }
    }

    // P1: Check password protection - redirect to verification page
    if (qrcode.accessPassword) {
      // Check for valid session cookie
      const sessionCookie = req.cookies.get(`qr_access_${slug}`)?.value;
      if (sessionCookie !== 'verified') {
        return NextResponse.redirect(`${baseUrl}/qr/${slug}/verify`);
      }
    }

    // Track scans locally for legacy (non-QRFY) QR codes
    if (!qrcode.qrfyId) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
      const userAgent = req.headers.get('user-agent') || '';
      const parser = new UAParser(userAgent);
      const referer = req.headers.get('referer') || '';

      try {
        const [geo] = await Promise.all([
          getGeoData(ip),
          prisma.qRCode.update({
            where: { id: qrcode.id },
            data: { scanCount: { increment: 1 } },
          }),
        ]);

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
    return NextResponse.redirect(`${baseUrl}/qr/${slug}`);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
