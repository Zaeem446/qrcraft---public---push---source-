import { NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin-auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    await requireAdminUser();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersThisMonth,
      totalQRCodes,
      activeQRCodes,
      totalScans,
      scansThisMonth,
      activeSubscriptions,
      trialingUsers,
      expiredUsers,
      usersByPlan,
      recentUsers,
      topQRCodes,
      scansLast7Days,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.qRCode.count(),
      prisma.qRCode.count({ where: { isActive: true } }),
      prisma.scan.count(),
      prisma.scan.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { subscriptionStatus: 'active' } }),
      prisma.user.count({ where: { subscriptionStatus: 'trialing' } }),
      prisma.user.count({ where: { subscriptionStatus: 'expired' } }),
      prisma.user.groupBy({
        by: ['plan'],
        _count: { plan: true },
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          subscriptionStatus: true,
          createdAt: true,
          _count: { select: { qrcodes: true } },
        },
      }),
      prisma.qRCode.findMany({
        take: 10,
        orderBy: { scanCount: 'desc' },
        select: {
          id: true,
          name: true,
          type: true,
          scanCount: true,
          isActive: true,
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.$queryRaw`
        SELECT DATE(s."createdAt") as date, COUNT(*)::int as count
        FROM scans s
        WHERE s."createdAt" >= ${sevenDaysAgo}
        GROUP BY DATE(s."createdAt")
        ORDER BY date ASC
      ` as Promise<{ date: Date; count: number }[]>,
    ]);

    return NextResponse.json({
      overview: {
        totalUsers,
        newUsersThisMonth,
        totalQRCodes,
        activeQRCodes,
        inactiveQRCodes: totalQRCodes - activeQRCodes,
        totalScans,
        scansThisMonth,
      },
      subscriptions: {
        active: activeSubscriptions,
        trialing: trialingUsers,
        expired: expiredUsers,
      },
      usersByPlan: usersByPlan.map((p) => ({
        plan: p.plan,
        count: p._count.plan,
      })),
      recentUsers: recentUsers.map((u) => ({
        ...u,
        qrCodeCount: u._count.qrcodes,
      })),
      topQRCodes,
      scansChart: scansLast7Days.map((s) => ({
        date: s.date.toISOString().split('T')[0],
        count: s.count,
      })),
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
