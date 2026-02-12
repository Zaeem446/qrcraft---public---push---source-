import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import { stripe, getPriceId, CARD_VERIFY_PRICE_ID } from '@/lib/stripe';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
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

    if (user.stripeSubscriptionId) {
      return NextResponse.json({ error: 'User already has a subscription' }, { status: 400 });
    }

    const { interval } = await req.json();

    if (!['monthly', 'quarterly', 'annually'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid billing interval' }, { status: 400 });
    }

    const subscriptionPriceId = getPriceId('', interval);
    if (!subscriptionPriceId) {
      return NextResponse.json({ error: 'Price not configured for this interval' }, { status: 400 });
    }

    if (!CARD_VERIFY_PRICE_ID) {
      return NextResponse.json({ error: 'Card verification price not configured' }, { status: 500 });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Check Stripe directly for existing subscriptions (handles webhook lag)
    const existingSubs = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    if (existingSubs.data.length > 0) {
      const sub = existingSubs.data[0];
      // Map Stripe status to our Prisma enum
      const statusMap: Record<string, string> = {
        active: 'active',
        trialing: 'trialing',
        past_due: 'past_due',
        canceled: 'canceled',
      };
      const mappedStatus = statusMap[sub.status] || 'active';
      // Sync subscription data to DB so future checks don't hit Stripe
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeSubscriptionId: sub.id,
          subscriptionStatus: mappedStatus as any,
          plan: 'professional',
        },
      });
      return NextResponse.json(
        { error: 'Already subscribed', redirect: '/dashboard' },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        { price: CARD_VERIFY_PRICE_ID, quantity: 1 },
        { price: subscriptionPriceId, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: user.id, interval, adTrial: 'true' },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/start-trial?canceled=true`,
      metadata: { userId: user.id, interval, adTrial: 'true' },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Start trial checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
