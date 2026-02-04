import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin-auth';
import prisma from '@/lib/db';

// Get single QR code with full details
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminUser();
    const { id } = await params;

    const qrcode = await prisma.qRCode.findUnique({
      where: { id },
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
    });

    if (!qrcode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Get recent scans
    const recentScans = await prisma.scan.findMany({
      where: { qrCodeId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        ip: true,
        country: true,
        city: true,
        device: true,
        browser: true,
        os: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ...qrcode,
      recentScans,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

// Update QR code (enable/disable, etc.)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const body = await req.json();

    const allowedFields = ['name', 'isActive', 'content', 'design'];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const qrcode = await prisma.qRCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, qrcode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update QR code' }, { status: 400 });
  }
}

// Delete QR code
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminUser();
    const { id } = await params;

    await prisma.qRCode.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete QR code' }, { status: 400 });
  }
}
