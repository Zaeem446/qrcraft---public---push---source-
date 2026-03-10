import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import { squareClient, LOCATION_ID } from '@/lib/square';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userData = await prisma.user.findUnique({
      where: { id: user.id },
      omit: { password: true },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // For ad users who paid but webhook never synced: check Square directly
    if (
      squareClient &&
      userData.requiresCardTrial &&
      userData.squareCustomerId &&
      !userData.squareSubscriptionId
    ) {
      try {
        const searchResponse = await squareClient.subscriptions.search({
          query: {
            filter: {
              customerIds: [userData.squareCustomerId],
              locationIds: [LOCATION_ID],
            },
          },
        });
        const subs = searchResponse.subscriptions || [];
        const activeSub = subs.find(
          (s) => s.status === 'ACTIVE' || s.status === 'PENDING'
        );
        if (activeSub) {
          const statusMap: Record<string, string> = {
            ACTIVE: 'active',
            PENDING: 'trialing',
            CANCELED: 'canceled',
            PAUSED: 'canceled',
          };
          const mappedStatus = statusMap[activeSub.status || ''] || 'active';
          userData = await prisma.user.update({
            where: { id: user.id },
            data: {
              squareSubscriptionId: activeSub.id,
              subscriptionStatus: mappedStatus as any,
              plan: 'professional',
            },
            omit: { password: true },
          });
        }
      } catch (squareErr) {
        console.error('Square sync check failed:', squareErr);
      }
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const userData = await prisma.user.update({
      where: { id: user.id },
      data: { name },
      omit: { password: true },
    });

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
