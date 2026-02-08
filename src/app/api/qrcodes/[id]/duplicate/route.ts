import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';
import { createQR, STATIC_TYPES } from '@/lib/qrfy';
import { Prisma } from '@prisma/client';

// POST /api/qrcodes/[id]/duplicate - Duplicate a QR code
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.qRCode.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Generate new slug
    const slug = nanoid(8);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';

    // Create on QRFY
    let qrfyId: number | null = null;
    const content = existing.content as Record<string, any>;
    const design = existing.design as Record<string, any>;

    // For dynamic types, update URL to new slug
    const qrfyContent = STATIC_TYPES.includes(existing.type)
      ? content
      : { ...content, url: `${baseUrl}/r/${slug}` };

    try {
      const qrfyResult = await createQR({
        type: existing.type,
        content: qrfyContent,
        design,
        name: `${existing.name} (Copy)`,
      });
      qrfyId = qrfyResult?.id ?? null;
    } catch (err) {
      console.error('QRFY duplicate error:', err);
    }

    // Create local copy
    const duplicated = await prisma.qRCode.create({
      data: {
        userId: user.id,
        name: `${existing.name} (Copy)`,
        type: existing.type,
        slug,
        qrfyId,
        content: existing.content as Prisma.InputJsonValue,
        design: existing.design as Prisma.InputJsonValue,
        folderId: existing.folderId,
        // Don't copy: accessPassword, scanLimit, scanCount, analytics IDs
      },
      include: {
        folder: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    console.error('Error duplicating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
