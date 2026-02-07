import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';
import type Stripe from 'stripe';
import type { SubscriptionStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Processing Stripe webhook: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId && session.subscription) {
        // Fetch the subscription to get period end
        const subscriptionResponse = await stripe.subscriptions.retrieve(session.subscription as string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = subscriptionResponse as any;
        const periodEnd = new Date((subscription.current_period_end || subscription.items?.data?.[0]?.current_period_end || Math.floor(Date.now() / 1000) + 2592000) * 1000);

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: 'professional',
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: 'active',
            subscriptionEndsAt: periodEnd,
          },
        });
        console.log(`User ${userId} subscribed, ends at ${periodEnd.toISOString()}`);
      }
      break;
    }

    case 'customer.subscription.created': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;
      const periodEnd = new Date((subscription.current_period_end || subscription.items?.data?.[0]?.current_period_end || Math.floor(Date.now() / 1000) + 2592000) * 1000);

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'professional',
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: 'active',
            subscriptionEndsAt: periodEnd,
          },
        });
        console.log(`Subscription created for user ${user.id}, ends at ${periodEnd.toISOString()}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;
      const periodEnd = new Date((subscription.current_period_end || subscription.items?.data?.[0]?.current_period_end || Math.floor(Date.now() / 1000) + 2592000) * 1000);

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        const status: SubscriptionStatus =
          subscription.status === 'active' ? 'active' :
          subscription.status === 'past_due' ? 'past_due' :
          subscription.status === 'canceled' ? 'canceled' :
          subscription.status === 'trialing' ? 'trialing' : user.subscriptionStatus;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: status,
            subscriptionEndsAt: periodEnd,
          },
        });
        console.log(`Subscription updated for user ${user.id}, status: ${status}, ends at ${periodEnd.toISOString()}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          plan: 'free',
          subscriptionStatus: 'expired',
          stripeSubscriptionId: null,
          subscriptionEndsAt: null,
        },
      });
      console.log(`Subscription deleted for customer ${customerId}`);
      break;
    }

    case 'invoice.paid': {
      // Subscription renewed successfully
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any;
      const customerId = invoice.customer as string;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = subscriptionResponse as any;
        const periodEnd = new Date((subscription.current_period_end || subscription.items?.data?.[0]?.current_period_end || Math.floor(Date.now() / 1000) + 2592000) * 1000);

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: 'active',
            subscriptionEndsAt: periodEnd,
          },
        });
        console.log(`Invoice paid for customer ${customerId}, renewed until ${periodEnd.toISOString()}`);
      }
      break;
    }

    case 'invoice.payment_failed': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any;
      const customerId = invoice.customer as string;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { subscriptionStatus: 'past_due' },
      });
      console.log(`Payment failed for customer ${customerId}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
