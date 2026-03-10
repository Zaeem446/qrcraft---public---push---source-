import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import { squareClient, LOCATION_ID, getVariationId, getPlanLabel } from '@/lib/square';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    if (!squareClient) {
      return NextResponse.json({ error: 'Square not configured' }, { status: 500 });
    }

    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.requiresCardTrial) {
      return NextResponse.json({ error: 'This endpoint is only for ad users' }, { status: 403 });
    }

    if (user.squareSubscriptionId) {
      return NextResponse.json({ error: 'User already has a subscription' }, { status: 400 });
    }

    const { interval, successRedirect } = await req.json();

    if (!['monthly', 'quarterly', 'annually'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid billing interval' }, { status: 400 });
    }

    const variationId = getVariationId(interval);
    if (!variationId) {
      return NextResponse.json({ error: 'Plan not configured for this interval' }, { status: 400 });
    }

    // Get or create Square customer
    let customerId = user.squareCustomerId;
    if (!customerId) {
      const customerResponse = await squareClient.customers.create({
        idempotencyKey: `customer-${user.id}`,
        emailAddress: user.email,
        givenName: user.name.split(' ')[0],
        familyName: user.name.split(' ').slice(1).join(' ') || undefined,
        referenceId: user.id,
      });
      customerId = customerResponse.customer?.id || null;
      if (customerId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { squareCustomerId: customerId },
        });
      }
    }

    if (!customerId) {
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }

    // Check Square directly for existing subscriptions (handles webhook lag)
    try {
      const searchResponse = await squareClient.subscriptions.search({
        query: {
          filter: {
            customerIds: [customerId],
            locationIds: [LOCATION_ID],
          },
        },
      });
      const existingSubs = searchResponse.subscriptions || [];
      const activeSub = existingSubs.find(
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
        await prisma.user.update({
          where: { id: user.id },
          data: {
            squareSubscriptionId: activeSub.id,
            subscriptionStatus: mappedStatus as any,
            plan: 'professional',
          },
        });
        return NextResponse.json(
          { error: 'Already subscribed', redirect: '/dashboard' },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error('Square subscription search failed:', err);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    // Create checkout link — trial phase is built into the plan variation
    // No $0.99 card verify needed; Square's $0 auth hold verifies the card
    const checkoutResponse = await squareClient.checkout.paymentLinks.create({
      idempotencyKey: `trial-${user.id}-${Date.now()}`,
      quickPay: {
        locationId: LOCATION_ID,
        name: `${getPlanLabel(interval)} - Free Trial`,
        priceMoney: {
          amount: BigInt(0),
          currency: 'USD',
        },
      },
      checkoutOptions: {
        subscriptionPlanId: variationId,
        redirectUrl: successRedirect
          ? `${appUrl}${successRedirect}`
          : `${appUrl}/dashboard?success=true`,
      },
      prePopulatedData: {
        buyerEmail: user.email,
      },
    });

    const url = checkoutResponse.paymentLink?.url;
    if (!url) {
      return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Start trial checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
