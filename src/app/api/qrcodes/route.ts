import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';
import { createQR, STATIC_TYPES } from '@/lib/qrfy';

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
    const folderId = searchParams.get('folderId') || '';
    const favorite = searchParams.get('favorite');
    const status = searchParams.get('status');

    const where: any = { userId: user.id };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (type) {
      where.type = type;
    }
    // P1: Filter by folder
    if (folderId) {
      where.folderId = folderId === 'none' ? null : folderId;
    }
    // P2: Filter by favorite
    if (favorite === 'true') {
      where.isFavorite = true;
    }
    // P2: Filter by status
    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const [total, qrcodes] = await Promise.all([
      prisma.qRCode.count({ where }),
      prisma.qRCode.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          folder: {
            select: { id: true, name: true, color: true },
          },
        },
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
    const {
      name,
      type,
      content,
      design,
      // P1 Features
      password,           // Plain text password (will be hashed)
      scanLimit,          // null = unlimited, number = limit
      folderId,           // Local folder ID
      googleAnalyticsId,
      facebookPixelId,
      googleTagManagerId,
      // P2 Features
      hostname,
    } = body;

    if (!name || !type || !content) {
      return NextResponse.json({ error: 'Name, type, and content are required' }, { status: 400 });
    }

    // P1: Validate folder exists and belongs to user
    if (folderId) {
      const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId: user.id },
      });
      if (!folder) {
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
      }
    }

    // Generate slug first so we can use it in the QRFY redirect URL
    const slug = nanoid(8);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';

    // P1: Hash password if provided
    let hashedPassword: string | null = null;
    if (password && typeof password === 'string' && password.trim()) {
      hashedPassword = await bcrypt.hash(password.trim(), 10);
    }

    // Create QR on QRFY
    let qrfyId: number | null = null;
    let qrfyError: string | null = null;

    // For dynamic types, override URL to point to our redirect so QRFY encodes the tracking URL
    const qrfyContent = STATIC_TYPES.includes(type)
      ? content
      : { ...content, url: `${baseUrl}/r/${slug}` };

    try {
      const qrfyResult = await createQR({
        type,
        content: qrfyContent,
        design: design || {},
        name,
        // P1 Features
        accessPassword: !!hashedPassword,
        scanLimit: scanLimit ?? undefined,
        googleAnalyticsId: googleAnalyticsId || undefined,
        facebookPixelId: facebookPixelId || undefined,
        googleTagManagerId: googleTagManagerId || undefined,
        // P2/P3 Features
        hostname: hostname || undefined,
      });
      qrfyId = qrfyResult?.id ?? null;
    } catch (err: any) {
      qrfyError = err?.message || String(err);
      console.error('QRFY create error:', qrfyError);
      // Continue without QRFY — QR will be stored locally only
    }

    const qrcode = await prisma.qRCode.create({
      data: {
        userId: user.id,
        name,
        type,
        slug,
        qrfyId,
        content,
        design: design || {},
        // P1 Features
        accessPassword: hashedPassword,
        scanLimit: scanLimit ?? null,
        folderId: folderId || null,
        googleAnalyticsId: googleAnalyticsId || null,
        facebookPixelId: facebookPixelId || null,
        googleTagManagerId: googleTagManagerId || null,
        // P2/P3 Features
        hostname: hostname || null,
      },
      include: {
        folder: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json({
      ...qrcode,
      // Don't expose hashed password
      accessPassword: !!qrcode.accessPassword,
      ...(qrfyError ? { _qrfyError: qrfyError } : {}),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
