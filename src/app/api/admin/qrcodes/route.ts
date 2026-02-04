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
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const userId = searchParams.get('userId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (userId) {
      where.userId = userId;
    }

    const [qrcodes, total] = await Promise.all([
      prisma.qRCode.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              plan: true,
              subscriptionStatus: true,
            },
          },
        },
      }),
      prisma.qRCode.count({ where }),
    ]);

    return NextResponse.json({
      qrcodes,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error: any) {
    console.error('Admin QR codes list error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
