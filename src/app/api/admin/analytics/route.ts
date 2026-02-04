import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminUser } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get total scans
    const totalScans = await prisma.scan.count();

    // Get scans today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scansToday = await prisma.scan.count({
      where: {
        createdAt: { gte: today },
      },
    });

    // Get scans this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const scansThisWeek = await prisma.scan.count({
      where: {
        createdAt: { gte: weekStart },
      },
    });

    // Get scans this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const scansThisMonth = await prisma.scan.count({
      where: {
        createdAt: { gte: monthStart },
      },
    });

    // Get scans over time for the selected period
    const scansOverTime = await getScansOverTime(startDate, days);

    // Get top countries
    const topCountries = await prisma.scan.groupBy({
      by: ['country'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Get top cities
    const topCities = await prisma.scan.groupBy({
      by: ['city'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Get device breakdown
    const deviceBreakdown = await prisma.scan.groupBy({
      by: ['device'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // Get browser breakdown
    const browserBreakdown = await prisma.scan.groupBy({
      by: ['browser'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // Get OS breakdown
    const osBreakdown = await prisma.scan.groupBy({
      by: ['os'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return NextResponse.json({
      totalScans,
      scansToday,
      scansThisWeek,
      scansThisMonth,
      scansOverTime,
      topCountries: topCountries.map((c) => ({
        name: c.country || 'Unknown',
        value: c._count.id,
      })),
      topCities: topCities.map((c) => ({
        name: c.city || 'Unknown',
        value: c._count.id,
      })),
      deviceBreakdown: deviceBreakdown.map((d) => ({
        name: d.device || 'Unknown',
        value: d._count.id,
      })),
      browserBreakdown: browserBreakdown.map((b) => ({
        name: b.browser || 'Unknown',
        value: b._count.id,
      })),
      osBreakdown: osBreakdown.map((o) => ({
        name: o.os || 'Unknown',
        value: o._count.id,
      })),
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

async function getScansOverTime(startDate: Date, days: number) {
  const result: { date: string; count: number }[] = [];

  // Generate dates for the range
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = await prisma.scan.count({
      where: {
        createdAt: {
          gte: date,
          lt: nextDate,
        },
      },
    });

    result.push({ date: dateStr, count });
  }

  return result;
}
