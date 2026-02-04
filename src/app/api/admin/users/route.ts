import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin-auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await requireAdminUser();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (plan && plan !== 'all') {
      where.plan = plan;
    }

    if (status && status !== 'all') {
      where.subscriptionStatus = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          provider: true,
          isAdmin: true,
          isDisabled: true,
          plan: true,
          subscriptionStatus: true,
          trialEndsAt: true,
          subscriptionEndsAt: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          createdAt: true,
          _count: {
            select: { qrcodes: true, scans: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users: users.map((u) => ({
        ...u,
        qrCodeCount: u._count.qrcodes,
        scanCount: u._count.scans,
      })),
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error: any) {
    console.error('Admin users list error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
