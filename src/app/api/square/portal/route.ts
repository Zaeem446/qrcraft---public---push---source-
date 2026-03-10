import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import { squareClient, LOCATION_ID } from '@/lib/square';
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

    if (!user?.squareSubscriptionId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    // Handle cancel action — schedules cancellation at end of billing period
    if (action === 'cancel') {
      const response = await squareClient.subscriptions.cancel({ subscriptionId: user.squareSubscriptionId });
      const subscription = response.subscription;

      if (subscription) {
        // Square schedules a CANCEL action for end-of-period.
        // The subscription is still ACTIVE until then, so keep status as 'active'.
        // The webhook will set 'canceled' + clear plan when the period actually ends.
        return NextResponse.json({
          success: true,
          message: 'Subscription will be canceled at the end of your billing period.',
          canceledDate: subscription.canceledDate,
          effectiveDate: response.actions?.[0]?.effectiveDate,
        });
      }
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }

    // Handle resume action — undo a pending cancellation by deleting the CANCEL action
    if (action === 'resume') {
      // First, get the subscription to find the pending CANCEL action
      const getResponse = await squareClient.subscriptions.get({ subscriptionId: user.squareSubscriptionId, include: "actions" });
      const subscription = getResponse.subscription;

      if (!subscription) {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }

      // Find the pending CANCEL action
      const cancelAction = subscription.actions?.find(
        (a) => a.type === 'CANCEL'
      );

      if (cancelAction?.id) {
        // Delete the scheduled CANCEL action to keep the subscription going
        await squareClient.subscriptions.deleteAction({
          subscriptionId: user.squareSubscriptionId,
          actionId: cancelAction.id,
        });

        return NextResponse.json({
          success: true,
          message: 'Cancellation reversed. Your subscription will continue.',
        });
      }

      // If subscription is PAUSED or DEACTIVATED, use resume()
      if (subscription.status === 'PAUSED' || subscription.status === 'DEACTIVATED') {
        const resumeResponse = await squareClient.subscriptions.resume({ subscriptionId: user.squareSubscriptionId });
        if (resumeResponse.subscription) {
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionStatus: 'active' },
          });
          return NextResponse.json({
            success: true,
            message: 'Subscription resumed.',
          });
        }
        return NextResponse.json({ error: 'Failed to resume subscription' }, { status: 500 });
      }

      return NextResponse.json({ error: 'No pending cancellation to reverse' }, { status: 400 });
    }

    // Default: return subscription info for the billing page to display
    try {
      const response = await squareClient.subscriptions.get({ subscriptionId: user.squareSubscriptionId, include: "actions" });
      const subscription = response.subscription;

      // Check if there's a pending CANCEL action
      const pendingCancel = subscription?.actions?.find(
        (a) => a.type === 'CANCEL'
      );

      return NextResponse.json({
        subscription: {
          id: subscription?.id,
          status: subscription?.status,
          startDate: subscription?.startDate,
          canceledDate: subscription?.canceledDate,
          planVariationId: subscription?.planVariationId,
          pendingCancel: pendingCancel ? {
            effectiveDate: pendingCancel.effectiveDate,
          } : null,
        },
      });
    } catch {
      return NextResponse.json({
        subscription: {
          id: user.squareSubscriptionId,
          status: user.subscriptionStatus,
        },
      });
    }
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
