import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';
import { getReport, transformQrfyReport } from '@/lib/qrfy';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Try to fetch QRFY report for QRs with qrfyId
    const qrfyQRCodes = await prisma.qRCode.findMany({
      where: { userId: user.id, qrfyId: { not: null } },
      select: { qrfyId: true },
    });
    const qrfyIds = qrfyQRCodes.map(q => q.qrfyId!);

    let qrfyData: {
      totalScans: number;
      uniqueScans: number;
      scansOverTime: { date: string; count: number }[];
      uniqueScansOverTime: { date: string; count: number }[];
      deviceBreakdown: { name: string; value: number }[];
      browserBreakdown: { name: string; value: number }[];
      osBreakdown: { name: string; value: number }[];
      locationBreakdown: { name: string; value: number }[];
      cityBreakdown: { name: string; value: number }[];
    } | null = null;

    if (qrfyIds.length > 0) {
      try {
        const qrfyReport = await getReport({
          qrfyIds,
          startDate: startDate.toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        });
        qrfyData = transformQrfyReport(qrfyReport);
      } catch (err) {
        console.error('QRFY report fetch failed, falling back to local:', err);
      }
    }

    // Legacy scan-based analytics
    const [totalQRCodes, activeQRCodes, totalScans, uniqueScansCount, scansRaw, uniqueScansRaw, devicesRaw, browsersRaw, osRaw, locationsRaw, citiesRaw] = await Promise.all([
      prisma.qRCode.count({ where: { userId: user.id } }),
      prisma.qRCode.count({ where: { userId: user.id, isActive: true } }),
      prisma.scan.count({ where: { userId: user.id, createdAt: { gte: startDate } } }),
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT s.ip)::int as count
        FROM scans s
        WHERE s."userId" = ${user.id} AND s."createdAt" >= ${startDate}
      ` as Promise<{ count: number }[]>,
      prisma.$queryRaw`
        SELECT DATE(s."createdAt") as date, COUNT(*)::int as count
        FROM scans s
        WHERE s."userId" = ${user.id} AND s."createdAt" >= ${startDate}
        GROUP BY DATE(s."createdAt")
        ORDER BY date ASC
      ` as Promise<{ date: Date; count: number }[]>,
      prisma.$queryRaw`
        SELECT DATE(s."createdAt") as date, COUNT(DISTINCT s.ip)::int as count
        FROM scans s
        WHERE s."userId" = ${user.id} AND s."createdAt" >= ${startDate}
        GROUP BY DATE(s."createdAt")
        ORDER BY date ASC
      ` as Promise<{ date: Date; count: number }[]>,
      prisma.$queryRaw`
        SELECT s.device as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."userId" = ${user.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.device
        ORDER BY value DESC
      ` as Promise<{ name: string; value: number }[]>,
      prisma.$queryRaw`
        SELECT s.browser as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."userId" = ${user.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.browser
        ORDER BY value DESC
        LIMIT 10
      ` as Promise<{ name: string; value: number }[]>,
      prisma.$queryRaw`
        SELECT s.os as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."userId" = ${user.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.os
        ORDER BY value DESC
        LIMIT 10
      ` as Promise<{ name: string; value: number }[]>,
      prisma.$queryRaw`
        SELECT s.country as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."userId" = ${user.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.country
        ORDER BY value DESC
        LIMIT 10
      ` as Promise<{ name: string; value: number }[]>,
      prisma.$queryRaw`
        SELECT s.city as name, COUNT(*)::int as value
        FROM scans s
        WHERE s."userId" = ${user.id} AND s."createdAt" >= ${startDate}
        GROUP BY s.city
        ORDER BY value DESC
        LIMIT 10
      ` as Promise<{ name: string; value: number }[]>,
    ]);

    const legacyUniqueScans = uniqueScansCount[0]?.count || 0;
    const legacyScansOverTime = scansRaw.map((s) => ({ date: s.date.toISOString().split('T')[0], count: s.count }));
    const legacyUniqueScansOverTime = uniqueScansRaw.map((s) => ({ date: s.date.toISOString().split('T')[0], count: s.count }));
    const legacyDevices = devicesRaw.map((d) => ({ name: d.name || 'Unknown', value: d.value }));
    const legacyBrowsers = browsersRaw.map((b) => ({ name: b.name || 'Unknown', value: b.value }));
    const legacyOS = osRaw.map((o) => ({ name: o.name || 'Unknown', value: o.value }));
    const legacyLocations = locationsRaw.map((l) => ({ name: l.name || 'Unknown', value: l.value }));
    const legacyCities = citiesRaw.map((c) => ({ name: c.name || 'Unknown', value: c.value }));

    // Merge QRFY data with legacy data if available
    if (qrfyData) {
      const mergeDateSeries = (a: { date: string; count: number }[], b: { date: string; count: number }[]) => {
        const dateMap = new Map<string, number>();
        for (const s of a) dateMap.set(s.date, (dateMap.get(s.date) || 0) + s.count);
        for (const s of b) dateMap.set(s.date, (dateMap.get(s.date) || 0) + s.count);
        return Array.from(dateMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));
      };

      const mergeBreakdowns = (a: { name: string; value: number }[], b: { name: string; value: number }[]) => {
        const map = new Map<string, number>();
        for (const item of a) map.set(item.name, (map.get(item.name) || 0) + item.value);
        for (const item of b) map.set(item.name, (map.get(item.name) || 0) + item.value);
        return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      };

      return NextResponse.json({
        totalQRCodes,
        activeQRCodes,
        totalScans: totalScans + qrfyData.totalScans,
        uniqueScans: legacyUniqueScans + qrfyData.uniqueScans,
        scansOverTime: mergeDateSeries(legacyScansOverTime, qrfyData.scansOverTime),
        uniqueScansOverTime: mergeDateSeries(legacyUniqueScansOverTime, qrfyData.uniqueScansOverTime),
        deviceBreakdown: mergeBreakdowns(legacyDevices, qrfyData.deviceBreakdown),
        browserBreakdown: mergeBreakdowns(legacyBrowsers, qrfyData.browserBreakdown).slice(0, 10),
        osBreakdown: mergeBreakdowns(legacyOS, qrfyData.osBreakdown).slice(0, 10),
        locationBreakdown: mergeBreakdowns(legacyLocations, qrfyData.locationBreakdown).slice(0, 10),
        cityBreakdown: mergeBreakdowns(legacyCities, qrfyData.cityBreakdown).slice(0, 10),
      });
    }

    return NextResponse.json({
      totalQRCodes,
      activeQRCodes,
      totalScans,
      uniqueScans: legacyUniqueScans,
      scansOverTime: legacyScansOverTime,
      uniqueScansOverTime: legacyUniqueScansOverTime,
      deviceBreakdown: legacyDevices,
      browserBreakdown: legacyBrowsers,
      osBreakdown: legacyOS,
      locationBreakdown: legacyLocations,
      cityBreakdown: legacyCities,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
