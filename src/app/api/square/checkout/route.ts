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

    const { interval } = await req.json();

    if (!['monthly', 'quarterly', 'annually'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid billing interval' }, { status: 400 });
    }

    const variationId = getVariationId(interval);
    if (!variationId) {
      return NextResponse.json({ error: 'Plan not configured for this interval' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Block ad users from bypassing the start-trial flow
    if (user.requiresCardTrial && !user.squareSubscriptionId) {
      return NextResponse.json(
        { error: 'Please use the trial checkout', redirect: '/start-trial' },
        { status: 403 }
      );
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    // Create a checkout link for subscription.
    // quickPay price must match the plan variation's first phase ($0 trial).
    // The subscription billing follows the plan variation phases automatically.
    const checkoutResponse = await squareClient.checkout.paymentLinks.create({
      idempotencyKey: `checkout-${user.id}-${Date.now()}`,
      quickPay: {
        locationId: LOCATION_ID,
        name: getPlanLabel(interval),
        priceMoney: {
          amount: BigInt(0),
          currency: 'USD',
        },
      },
      checkoutOptions: {
        subscriptionPlanId: variationId,
        redirectUrl: `${appUrl}/dashboard?success=true`,
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
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
