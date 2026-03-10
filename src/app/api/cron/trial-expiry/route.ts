import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendTrialExpiredEmail } from '@/lib/email';
import { getUnsubscribeUrl } from '@/lib/unsubscribe';

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find users whose trial expired in the last 24 hours
    const expiredUsers = await prisma.user.findMany({
      where: {
        subscriptionStatus: 'trialing',
        trialEndsAt: {
          gte: twentyFourHoursAgo,
          lte: now,
        },
        marketingConsent: true,
        marketingUnsubscribed: false,
        squareSubscriptionId: null, // No active subscription
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            qrcodes: true,
          },
        },
      },
    });

    let sent = 0;
    let errors = 0;

    for (const user of expiredUsers) {
      try {
        // Get total scans for this user
        const scanResult = await prisma.scan.aggregate({
          where: { userId: user.id },
          _count: true,
        });

        const totalScans = scanResult._count;
        const totalQRCodes = user._count.qrcodes;

        await sendTrialExpiredEmail(
          user.email,
          user.name.split(' ')[0],
          totalQRCodes,
          totalScans,
          getUnsubscribeUrl(user.id)
        );

        // Update status to expired
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: 'expired' },
        });

        sent++;
      } catch (err) {
        console.error(`Failed to process trial expiry for user ${user.id}:`, err);
        errors++;
      }
    }

    console.log(`Trial expiry cron: ${expiredUsers.length} found, ${sent} emails sent, ${errors} errors`);

    return NextResponse.json({
      processed: expiredUsers.length,
      sent,
      errors,
    });
  } catch (error) {
    console.error('Trial expiry cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
