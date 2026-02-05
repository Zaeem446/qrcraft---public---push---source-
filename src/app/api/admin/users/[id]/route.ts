import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin-auth';
import prisma from '@/lib/db';

// Get single user with full details including QR codes with scan stats
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
            slug: true,
            scanCount: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: { scans: true },
            },
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

    // Get per-QR analytics summary (top 5 scans per QR)
    const qrAnalytics: Record<string, any> = {};
    for (const qr of user.qrcodes) {
      const [deviceBreakdown, recentScans] = await Promise.all([
        prisma.scan.groupBy({
          by: ['device'],
          where: { qrCodeId: qr.id },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 3,
        }),
        prisma.scan.findMany({
          where: { qrCodeId: qr.id },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            country: true,
            city: true,
            device: true,
            browser: true,
            createdAt: true,
          },
        }),
      ]);

      qrAnalytics[qr.id] = {
        devices: deviceBreakdown.map((d) => ({ name: d.device || 'Unknown', count: d._count.id })),
        recentScans,
      };
    }

    // Determine auth method
    let authMethod = 'Email/Password';
    if (user.clerkId) {
      if (user.provider === 'google') authMethod = 'Google (Clerk)';
      else if (user.provider === 'facebook') authMethod = 'Facebook (Clerk)';
      else if (user.provider === 'linkedin') authMethod = 'LinkedIn (Clerk)';
      else authMethod = 'Social Login (Clerk)';
    }

    // Calculate trial info
    const trialEndsAt = user.trialEndsAt;
    const isTrialActive = user.subscriptionStatus === 'trialing' && trialEndsAt && new Date(trialEndsAt) > new Date();
    const trialDaysLeft = trialEndsAt
      ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0;

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      provider: user.provider,
      authMethod,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
      isDisabled: user.isDisabled,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      trialEndsAt: user.trialEndsAt,
      subscriptionEndsAt: user.subscriptionEndsAt,
      isTrialActive,
      trialDaysLeft,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      qrCodeCount: user._count.qrcodes,
      totalScans: user._count.scans,
      qrcodes: user.qrcodes.map((qr) => ({
        ...qr,
        totalScans: qr._count.scans,
        analytics: qrAnalytics[qr.id] || { devices: [], recentScans: [] },
      })),
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
