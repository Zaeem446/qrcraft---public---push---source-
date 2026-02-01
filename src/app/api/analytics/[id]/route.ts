import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const qrcode = await prisma.qRCode.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!qrcode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalScans, scansRaw, devicesRaw, browsersRaw, locationsRaw] = await Promise.all([
      prisma.scan.count({ where: { qrCodeId: qrcode.id, createdAt: { gte: startDate } } }),
      prisma.$queryRaw`
        SELECT DATE(s."createdAt") as date, COUNT(*)::int as count
        FROM scans s
        WHERE s."qrCodeId" = ${qrcode.id} AND s."createdAt" >= ${startDate}
        GROUP BY DATE(s."createdAt")
        ORDER BY date ASC
      ` as Promise<{ date: Date; count: number }[]>,
      prisma.$queryRaw`
        SELECT s.device as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."qrCodeId" = ${qrcode.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.device
      ` as Promise<{ name: string; value: number }[]>,
      prisma.$queryRaw`
        SELECT s.browser as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."qrCodeId" = ${qrcode.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.browser
        ORDER BY value DESC
        LIMIT 10
      ` as Promise<{ name: string; value: number }[]>,
      prisma.$queryRaw`
        SELECT s.country as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."qrCodeId" = ${qrcode.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.country
        ORDER BY value DESC
        LIMIT 10
      ` as Promise<{ name: string; value: number }[]>,
    ]);

    return NextResponse.json({
      qrcode,
      totalScans,
      scansOverTime: scansRaw.map((s) => ({ date: s.date.toISOString().split('T')[0], count: s.count })),
      deviceBreakdown: devicesRaw.map((d) => ({ name: d.name || 'Unknown', value: d.value })),
      browserBreakdown: browsersRaw.map((b) => ({ name: b.name || 'Unknown', value: b.value })),
      locationBreakdown: locationsRaw.map((l) => ({ name: l.name || 'Unknown', value: l.value })),
    });
  } catch (error) {
    console.error('QR analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
