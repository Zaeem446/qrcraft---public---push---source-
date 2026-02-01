import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { updateQR, deleteQR } from '@/lib/qrfy';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const qrcode = await prisma.qRCode.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!qrcode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json(qrcode);
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, content, design } = body;

    const existing = await prisma.qRCode.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Sync update with QRFY if qrfyId exists
    if (existing.qrfyId) {
      try {
        await updateQR(existing.qrfyId, {
          type: existing.type,
          content,
          design,
          name,
        });
      } catch (err) {
        console.error('QRFY update error:', err);
        // Continue with local update even if QRFY fails
      }
    }

    const qrcode = await prisma.qRCode.update({
      where: { id },
      data: { name, content, design },
    });

    return NextResponse.json(qrcode);
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.qRCode.findFirst({
      where: { id, userId: session.user.id },
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
