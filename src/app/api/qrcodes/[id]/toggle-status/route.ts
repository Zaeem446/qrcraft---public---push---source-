import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';
import { updateQR } from '@/lib/qrfy';

// POST /api/qrcodes/[id]/toggle-status - Toggle active/inactive status
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

    const newStatus = !existing.isActive;

    // Sync with QRFY if applicable
    if (existing.qrfyId) {
      try {
        await updateQR(existing.qrfyId, { status: newStatus });
      } catch (err) {
        console.error('QRFY status update error:', err);
      }
    }

    const qrcode = await prisma.qRCode.update({
      where: { id },
      data: { isActive: newStatus },
    });

    return NextResponse.json({ isActive: qrcode.isActive });
  } catch (error) {
    console.error('Error toggling status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
