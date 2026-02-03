import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const qrcode = await prisma.qRCode.findUnique({
      where: { slug },
    });

    if (!qrcode || !qrcode.isActive) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    const content = qrcode.content as Record<string, any>;

    return NextResponse.json({
      type: qrcode.type,
      content: qrcode.content,
      name: qrcode.name,
      // Extract pageDesign for easy access by landing page
      pageDesign: content?.pageDesign || null,
    });
  } catch (error) {
    console.error('Error fetching QR by slug:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
