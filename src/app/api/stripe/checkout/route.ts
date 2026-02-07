import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import { stripe, getPriceId } from '@/lib/stripe';
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

    const { interval } = await req.json();

    // Validate interval
    if (!['monthly', 'quarterly', 'annually'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid billing interval' }, { status: 400 });
    }

    const priceId = getPriceId('', interval);

    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured for this interval' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { userId: user.id, interval },
      subscription_data: {
        metadata: { userId: user.id, interval },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
