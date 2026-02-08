import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';
import { updateQR, deleteQR } from '@/lib/qrfy';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const qrcode = await prisma.qRCode.findFirst({
      where: { id, userId: user.id },
      include: {
        folder: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    if (!qrcode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...qrcode,
      // Return boolean for password (don't expose hash)
      accessPassword: !!qrcode.accessPassword,
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      name,
      content,
      design,
      // P1 Features
      password,           // New password (plain text) or null to remove
      removePassword,     // Explicit flag to remove password
      scanLimit,
      folderId,
      googleAnalyticsId,
      facebookPixelId,
      googleTagManagerId,
      // P2 Features
      isActive,
      isFavorite,
      hostname,
    } = body;

    const existing = await prisma.qRCode.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // P1: Validate folder if changing
    if (folderId !== undefined && folderId !== null) {
      const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId: user.id },
      });
      if (!folder) {
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
      }
    }

    // P1: Handle password changes
    let hashedPassword: string | null | undefined = undefined;
    if (removePassword === true) {
      hashedPassword = null;
    } else if (password && typeof password === 'string' && password.trim()) {
      hashedPassword = await bcrypt.hash(password.trim(), 10);
    }

    // Sync update with QRFY if qrfyId exists
    if (existing.qrfyId) {
      try {
        await updateQR(existing.qrfyId, {
          type: existing.type,
          content,
          design,
          name,
          // P1 Features
          accessPassword: hashedPassword !== undefined ? !!hashedPassword : undefined,
          scanLimit: scanLimit !== undefined ? scanLimit : undefined,
          googleAnalyticsId: googleAnalyticsId !== undefined ? googleAnalyticsId : undefined,
          facebookPixelId: facebookPixelId !== undefined ? facebookPixelId : undefined,
          googleTagManagerId: googleTagManagerId !== undefined ? googleTagManagerId : undefined,
          // P2 Features
          status: isActive !== undefined ? isActive : undefined,
          favorite: isFavorite !== undefined ? isFavorite : undefined,
          hostname: hostname !== undefined ? hostname : undefined,
        });
      } catch (err) {
        console.error('QRFY update error:', err);
        // Continue with local update even if QRFY fails
      }
    }

    // Build update data object
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (content !== undefined) updateData.content = content;
    if (design !== undefined) updateData.design = design;
    // P1 Features
    if (hashedPassword !== undefined) updateData.accessPassword = hashedPassword;
    if (scanLimit !== undefined) updateData.scanLimit = scanLimit;
    if (folderId !== undefined) updateData.folderId = folderId;
    if (googleAnalyticsId !== undefined) updateData.googleAnalyticsId = googleAnalyticsId || null;
    if (facebookPixelId !== undefined) updateData.facebookPixelId = facebookPixelId || null;
    if (googleTagManagerId !== undefined) updateData.googleTagManagerId = googleTagManagerId || null;
    // P2 Features
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (hostname !== undefined) updateData.hostname = hostname || null;

    const qrcode = await prisma.qRCode.update({
      where: { id },
      data: updateData,
      include: {
        folder: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json({
      ...qrcode,
      accessPassword: !!qrcode.accessPassword,
    });
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Delete from QRFY if qrfyId exists
    if (existing.qrfyId) {
      try {
        await deleteQR(existing.qrfyId);
      } catch (err) {
        console.error('QRFY delete error:', err);
        // Continue with local delete even if QRFY fails
      }
    }

    await prisma.qRCode.delete({ where: { id } });

    return NextResponse.json({ message: 'QR code deleted' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
