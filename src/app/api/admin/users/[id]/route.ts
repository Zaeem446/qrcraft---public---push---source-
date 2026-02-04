import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin-auth';
import prisma from '@/lib/db';

// Get single user with full details
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminUser();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        qrcodes: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            type: true,
            scanCount: true,
            isActive: true,
            createdAt: true,
          },
        },
        _count: {
          select: { qrcodes: true, scans: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      qrCodeCount: user._count.qrcodes,
      totalScans: user._count.scans,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

// Update user
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      'name',
      'email',
      'isAdmin',
      'isDisabled',
      'plan',
      'subscriptionStatus',
      'trialEndsAt',
      'subscriptionEndsAt',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Convert date strings to Date objects
    if (updateData.trialEndsAt) {
      updateData.trialEndsAt = new Date(updateData.trialEndsAt);
    }
    if (updateData.subscriptionEndsAt) {
      updateData.subscriptionEndsAt = new Date(updateData.subscriptionEndsAt);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 400 });
  }
}

// Delete user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;

    // Prevent self-deletion
    if (admin.id === id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 400 });
  }
}
