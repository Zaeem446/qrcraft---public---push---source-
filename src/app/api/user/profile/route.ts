import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import { stripe } from '@/lib/stripe';
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

    // For ad users who paid but webhook never synced: check Stripe directly
    if (
      stripe &&
      userData.requiresCardTrial &&
      userData.stripeCustomerId &&
      !userData.stripeSubscriptionId
    ) {
      try {
        const subs = await stripe.subscriptions.list({
          customer: userData.stripeCustomerId,
          limit: 1,
        });
        if (subs.data.length > 0) {
          const sub = subs.data[0];
          const statusMap: Record<string, string> = {
            active: 'active',
            trialing: 'trialing',
            past_due: 'past_due',
            canceled: 'canceled',
          };
          const mappedStatus = statusMap[sub.status] || 'active';
          userData = await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeSubscriptionId: sub.id,
              subscriptionStatus: mappedStatus as any,
              plan: 'professional',
            },
            omit: { password: true },
          });
        }
      } catch (stripeErr) {
        console.error('Stripe sync check failed:', stripeErr);
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
