import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { nanoid } from 'nanoid';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { createQR, STATIC_TYPES } from '@/lib/qrfy';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const where: any = { userId: session.user.id };
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, content, design } = body;

    if (!name || !type || !content) {
      return NextResponse.json({ error: 'Name, type, and content are required' }, { status: 400 });
    }

    // Generate slug first so we can use it in the QRFY redirect URL
    const slug = nanoid(8);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrcraft-public-push-source.vercel.app';

    // Create QR on QRFY
    let qrfyId: number | null = null;
    let qrfyError: string | null = null;

    // For dynamic types, override URL to point to our redirect so QRFY encodes the tracking URL
    const qrfyContent = STATIC_TYPES.includes(type)
      ? content
      : { ...content, url: `${baseUrl}/r/${slug}` };

    try {
      const qrfyResult = await createQR({ type, content: qrfyContent, design: design || {}, name });
      qrfyId = qrfyResult?.id ?? null;
    } catch (err: any) {
      qrfyError = err?.message || String(err);
      console.error('QRFY create error:', qrfyError);
      // Continue without QRFY — QR will be stored locally only
    }

    const qrcode = await prisma.qRCode.create({
      data: {
        userId: session.user.id,
        name,
        type,
        slug,
        qrfyId,
        content,
        design: design || {},
      },
    });

    return NextResponse.json({
      ...qrcode,
      ...(qrfyError ? { _qrfyError: qrfyError } : {}),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
