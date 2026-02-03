import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';
import { getReport, transformQrfyReport } from '@/lib/qrfy';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const qrcode = await prisma.qRCode.findFirst({
      where: { id, userId: user.id },
    });
    if (!qrcode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Try QRFY report for QRs with qrfyId
    if (qrcode.qrfyId) {
      try {
        const qrfyReport = await getReport({
          qrfyIds: [qrcode.qrfyId],
          startDate: startDate.toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        });
        const qrfyData = transformQrfyReport(qrfyReport);

        return NextResponse.json({
          qrcode,
          totalScans: qrfyData.totalScans,
          uniqueScans: qrfyData.uniqueScans,
          scansOverTime: qrfyData.scansOverTime,
          uniqueScansOverTime: qrfyData.uniqueScansOverTime,
          deviceBreakdown: qrfyData.deviceBreakdown,
          browserBreakdown: qrfyData.browserBreakdown,
          osBreakdown: qrfyData.osBreakdown,
          locationBreakdown: qrfyData.locationBreakdown,
          cityBreakdown: qrfyData.cityBreakdown,
        });
      } catch (err) {
        console.error('QRFY report failed, using legacy:', err);
      }
    }

    // Legacy scan-based analytics (fallback)
    const [totalScans, uniqueScansCount, scansRaw, uniqueScansRaw, devicesRaw, browsersRaw, osRaw, locationsRaw, citiesRaw] = await Promise.all([
      prisma.scan.count({ where: { qrCodeId: qrcode.id, createdAt: { gte: startDate } } }),
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT s.ip)::int as count
        FROM scans s
        WHERE s."qrCodeId" = ${qrcode.id} AND s."createdAt" >= ${startDate}
      ` as Promise<{ count: number }[]>,
      prisma.$queryRaw`
        SELECT DATE(s."createdAt") as date, COUNT(*)::int as count
        FROM scans s
        WHERE s."qrCodeId" = ${qrcode.id} AND s."createdAt" >= ${startDate}
        GROUP BY DATE(s."createdAt")
        ORDER BY date ASC
      ` as Promise<{ date: Date; count: number }[]>,
      prisma.$queryRaw`
        SELECT DATE(s."createdAt") as date, COUNT(DISTINCT s.ip)::int as count
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
        SELECT s.os as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."qrCodeId" = ${qrcode.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.os
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
      prisma.$queryRaw`
        SELECT s.city as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."qrCodeId" = ${qrcode.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.city
        ORDER BY value DESC
        LIMIT 10
      ` as Promise<{ name: string; value: number }[]>,
    ]);

    return NextResponse.json({
      qrcode,
      totalScans,
      uniqueScans: uniqueScansCount[0]?.count || 0,
      scansOverTime: scansRaw.map((s) => ({ date: s.date.toISOString().split('T')[0], count: s.count })),
      uniqueScansOverTime: uniqueScansRaw.map((s) => ({ date: s.date.toISOString().split('T')[0], count: s.count })),
      deviceBreakdown: devicesRaw.map((d) => ({ name: d.name || 'Unknown', value: d.value })),
      browserBreakdown: browsersRaw.map((b) => ({ name: b.name || 'Unknown', value: b.value })),
      osBreakdown: osRaw.map((o) => ({ name: o.name || 'Unknown', value: o.value })),
      locationBreakdown: locationsRaw.map((l) => ({ name: l.name || 'Unknown', value: l.value })),
      cityBreakdown: citiesRaw.map((c) => ({ name: c.name || 'Unknown', value: c.value })),
    });
  } catch (error) {
    console.error('QR analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
