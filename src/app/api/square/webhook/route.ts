import { NextRequest, NextResponse } from 'next/server';
import { squareClient } from '@/lib/square';
import { getSubscriptionEndDate } from '@/lib/square';
import prisma from '@/lib/db';
import type { SubscriptionStatus } from '@prisma/client';
import type { User } from '@prisma/client';
import crypto from 'crypto';

// Verify Square webhook signature
function verifySignature(body: string, signature: string, signatureKey: string, notificationUrl: string): boolean {
  const combined = notificationUrl + body;
  const expectedSignature = crypto
    .createHmac('sha256', signatureKey)
    .update(combined)
    .digest('base64');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!squareClient) {
    return NextResponse.json({ error: 'Square not configured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('x-square-hmacsha256-signature');
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  if (!signature || !signatureKey) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  // Verify webhook signature
  const notificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/square/webhook`;
  if (!verifySignature(body, signature, signatureKey, notificationUrl)) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventType = event.type;

  console.log(`Processing Square webhook: ${eventType}`);

  switch (eventType) {
    case 'subscription.created': {
      const subscription = event.data?.object?.subscription;
      if (!subscription) break;

      const customerId = subscription.customer_id;
      const isTrialing = subscription.status === 'PENDING';

      const user = await findUserBySquareCustomerId(customerId);

      if (user) {
        // Determine interval from plan variation
        const interval = guessIntervalFromSubscription(subscription);
        const endDate = getSubscriptionEndDate(interval);

        const updateData: any = {
          plan: 'professional',
          squareSubscriptionId: subscription.id,
          subscriptionStatus: isTrialing ? 'trialing' : 'active',
          subscriptionEndsAt: endDate,
        };

        // If trialing, set trial end to 7 days from now
        if (isTrialing) {
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 7);
          updateData.trialEndsAt = trialEnd;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
        console.log(`Subscription created for user ${user.id}, status: ${isTrialing ? 'trialing' : 'active'}`);
      }
      break;
    }

    case 'subscription.updated': {
      const subscription = event.data?.object?.subscription;
      if (!subscription) break;

      const customerId = subscription.customer_id;

      const user = await findUserBySquareCustomerId(customerId);

      if (user) {
        const statusMap: Record<string, SubscriptionStatus> = {
          ACTIVE: 'active',
          PENDING: 'trialing',
          CANCELED: 'canceled',
          PAUSED: 'canceled', // PAUSED = billing paused, treat as canceled
          DEACTIVATED: 'expired',
          COMPLETED: 'expired', // All phases fulfilled, subscription ended naturally
        };

        const status = statusMap[subscription.status] || user.subscriptionStatus;

        const updateData: any = {
          subscriptionStatus: status,
        };

        // If subscription just became active (trial ended or resumed), update end date
        if (subscription.status === 'ACTIVE') {
          const interval = guessIntervalFromSubscription(subscription);
          updateData.subscriptionEndsAt = getSubscriptionEndDate(interval);
        }

        // CANCELED means the subscription has actually ended (end of billing period).
        // DEACTIVATED means Square deactivated it (e.g., max retries exhausted).
        // COMPLETED means all phases fulfilled and subscription ended naturally.
        // In all cases, revoke access.
        if (subscription.status === 'CANCELED' || subscription.status === 'DEACTIVATED' || subscription.status === 'COMPLETED') {
          updateData.plan = 'free';
          updateData.squareSubscriptionId = null;
          updateData.subscriptionEndsAt = null;
        }

        // PAUSED: subscription billing is paused — revoke pro access
        if (subscription.status === 'PAUSED') {
          updateData.plan = 'free';
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
        console.log(`Subscription updated for user ${user.id}, status: ${status}`);
      }
      break;
    }

    case 'invoice.payment_made': {
      const invoice = event.data?.object?.invoice;
      if (!invoice) break;

      // subscription_id may not be in webhook payload — fetch full invoice as fallback
      let subscriptionId = invoice.subscription_id;
      if (!subscriptionId && invoice.id) {
        try {
          const invoiceResponse = await squareClient.invoices.get({ invoiceId: invoice.id });
          subscriptionId = invoiceResponse.invoice?.subscriptionId;
        } catch (err) {
          console.error('Failed to fetch invoice for subscription_id:', err);
        }
      }
      if (!subscriptionId) break;

      // Find user by subscription ID
      const user = await prisma.user.findFirst({
        where: { squareSubscriptionId: subscriptionId },
      });

      if (user) {
        // Retrieve subscription to determine interval
        try {
          const subResponse = await squareClient.subscriptions.get({ subscriptionId });
          const subscription = subResponse.subscription;
          const interval = guessIntervalFromSubscription(subscription);
          const endDate = getSubscriptionEndDate(interval);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'active',
              subscriptionEndsAt: endDate,
            },
          });
          console.log(`Invoice paid for user ${user.id}, renewed until ${endDate.toISOString()}`);

          // Send renewal email if not first payment and user opted in
          if (user.marketingConsent && !user.marketingUnsubscribed) {
            try {
              const { sendSubscriptionRenewedEmail } = await import('@/lib/email');
              const { getUnsubscribeUrl } = await import('@/lib/unsubscribe');

              await sendSubscriptionRenewedEmail(
                user.email,
                user.name.split(' ')[0],
                'Professional',
                endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                getUnsubscribeUrl(user.id)
              );
              console.log(`Subscription renewed email sent to ${user.email}`);
            } catch (emailError) {
              console.error('Failed to send subscription renewed email:', emailError);
            }
          }
        } catch (err) {
          console.error('Failed to retrieve subscription for invoice:', err);
        }
      }
      break;
    }

    case 'invoice.scheduled_charge_failed': {
      const invoice = event.data?.object?.invoice;
      if (!invoice) break;

      // subscription_id may not be in webhook payload — fetch full invoice as fallback
      let subscriptionId = invoice.subscription_id;
      if (!subscriptionId && invoice.id) {
        try {
          const invoiceResponse = await squareClient.invoices.get({ invoiceId: invoice.id });
          subscriptionId = invoiceResponse.invoice?.subscriptionId;
        } catch (err) {
          console.error('Failed to fetch invoice for subscription_id:', err);
        }
      }
      if (!subscriptionId) break;

      await prisma.user.updateMany({
        where: { squareSubscriptionId: subscriptionId },
        data: { subscriptionStatus: 'past_due' },
      });
      console.log(`Payment failed for subscription ${subscriptionId}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

// Find user by Square customer ID, with email-based fallback.
// Payment Links may create a NEW Square customer, so the customer_id on the
// subscription might not match the one we pre-created and stored.
async function findUserBySquareCustomerId(customerId: string): Promise<User | null> {
  // Fast path: direct match
  let user = await prisma.user.findUnique({
    where: { squareCustomerId: customerId },
  });
  if (user) return user;

  // Fallback: fetch customer email from Square, then match by email
  if (!squareClient) return null;
  try {
    const customerResponse = await squareClient.customers.get({ customerId });
    const email = customerResponse.customer?.emailAddress;
    if (!email) return null;

    user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      // Link the new Square customer ID so future lookups are fast
      await prisma.user.update({
        where: { id: user.id },
        data: { squareCustomerId: customerId },
      });
    }
    return user;
  } catch (err) {
    console.error('Failed to look up Square customer by email:', err);
    return null;
  }
}

// Heuristic to determine billing interval from subscription data.
// Handles both raw webhook JSON (snake_case) and SDK response objects (camelCase).
function guessIntervalFromSubscription(subscription: any): string {
  const planVariationId = subscription?.plan_variation_id || subscription?.planVariationId || '';
  const monthlyId = process.env.SQUARE_MONTHLY_VARIATION_ID || '';
  const quarterlyId = process.env.SQUARE_QUARTERLY_VARIATION_ID || '';
  const annuallyId = process.env.SQUARE_ANNUALLY_VARIATION_ID || '';

  if (planVariationId === monthlyId) return 'monthly';
  if (planVariationId === quarterlyId) return 'quarterly';
  if (planVariationId === annuallyId) return 'annually';

  // Fallback: default to monthly
  return 'monthly';
}
