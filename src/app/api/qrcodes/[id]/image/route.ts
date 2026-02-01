import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getQRImage } from '@/lib/qrfy';

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
};

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

    if (!qrcode.qrfyId) {
      return NextResponse.json({ error: 'QR code has no QRFY image (legacy QR)' }, { status: 404 });
    }

    const imageBuffer = await getQRImage(qrcode.qrfyId, format);

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
