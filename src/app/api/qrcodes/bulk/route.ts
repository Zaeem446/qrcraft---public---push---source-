import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';
import { deleteQR, updateQR } from '@/lib/qrfy';

// POST /api/qrcodes/bulk - Bulk operations on QR codes
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, ids, data } = body;

    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Action and IDs are required' }, { status: 400 });
    }

    // Verify all QR codes belong to user
    const qrcodes = await prisma.qRCode.findMany({
      where: { id: { in: ids }, userId: user.id },
    });

    if (qrcodes.length !== ids.length) {
      return NextResponse.json({ error: 'Some QR codes not found or not authorized' }, { status: 404 });
    }

    switch (action) {
      case 'delete': {
        // Delete from QRFY first
        const qrfyIds = qrcodes.filter(q => q.qrfyId).map(q => q.qrfyId!);
        if (qrfyIds.length > 0) {
          try {
            // QRFY batch delete
            await Promise.all(qrfyIds.map(id => deleteQR(id).catch(err => console.error('QRFY delete error:', err))));
          } catch (err) {
            console.error('QRFY bulk delete error:', err);
          }
        }

        // Delete locally
        await prisma.qRCode.deleteMany({
          where: { id: { in: ids }, userId: user.id },
        });

        return NextResponse.json({ success: true, deleted: ids.length });
      }

      case 'move-to-folder': {
        const { folderId } = data || {};

        // Validate folder if provided
        if (folderId) {
          const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId: user.id },
          });
          if (!folder) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
          }
        }

        await prisma.qRCode.updateMany({
          where: { id: { in: ids }, userId: user.id },
          data: { folderId: folderId || null },
        });

        return NextResponse.json({ success: true, updated: ids.length });
      }

      case 'toggle-active': {
        const { isActive } = data || {};
        if (typeof isActive !== 'boolean') {
          return NextResponse.json({ error: 'isActive boolean is required' }, { status: 400 });
        }

        // Update QRFY
        for (const qr of qrcodes) {
          if (qr.qrfyId) {
            try {
              await updateQR(qr.qrfyId, { status: isActive });
            } catch (err) {
              console.error('QRFY status update error:', err);
            }
          }
        }

        await prisma.qRCode.updateMany({
          where: { id: { in: ids }, userId: user.id },
          data: { isActive },
        });

        return NextResponse.json({ success: true, updated: ids.length });
      }

      case 'toggle-favorite': {
        const { isFavorite } = data || {};
        if (typeof isFavorite !== 'boolean') {
          return NextResponse.json({ error: 'isFavorite boolean is required' }, { status: 400 });
        }

        // Update QRFY
        for (const qr of qrcodes) {
          if (qr.qrfyId) {
            try {
              await updateQR(qr.qrfyId, { favorite: isFavorite });
            } catch (err) {
              console.error('QRFY favorite update error:', err);
            }
          }
        }

        await prisma.qRCode.updateMany({
          where: { id: { in: ids }, userId: user.id },
          data: { isFavorite },
        });

        return NextResponse.json({ success: true, updated: ids.length });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Bulk operation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
