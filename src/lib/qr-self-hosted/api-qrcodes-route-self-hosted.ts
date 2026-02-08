import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const where: any = { userId: user.id };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (type) {
      where.type = type;
    }

    const [total, qrcodes] = await Promise.all([
      prisma.qRCode.count({ where }),
      prisma.qRCode.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      qrcodes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, content, design } = body;

    if (!name || !type || !content) {
      return NextResponse.json({ error: 'Name, type, and content are required' }, { status: 400 });
    }

    // Generate unique slug for this QR code
    const slug = nanoid(8);

    // Self-hosted: QR generation happens client-side, we just store the data
    const qrcode = await prisma.qRCode.create({
      data: {
        userId: user.id,
        name,
        type,
        slug,
        // qrfyId is null since we're self-hosted now
        content,
        design: design || {},
      },
    });

    return NextResponse.json(qrcode, { status: 201 });
  } catch (error) {
    console.error('Error creating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
