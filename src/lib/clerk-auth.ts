import { auth, currentUser } from '@clerk/nextjs/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './db';
import { TRIAL_DAYS } from './utils';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

// Check custom JWT session (for email/password login)
async function getCustomSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session-token')?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch {
    return null;
  }
}

// Check Clerk session (for social login)
async function getClerkUser() {
  try {
    const { userId } = await auth();

    if (!userId) return null;

    // Try to find user by clerkId
    let user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    // If not found, get Clerk user data and create/link
    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
        return null;
      }

      const email = clerkUser.emailAddresses[0].emailAddress;

      // Check if user exists with this email
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Link existing user to Clerk
        user = await prisma.user.update({
          where: { id: user.id },
          data: { clerkId: userId },
        });
      } else {
        // Read acquisition data from cookie
        let acquisitionChannel: string = 'organic';
        let acquisitionData: any = undefined;
        let requiresCardTrial = false;
        let marketingConsent = false;

        try {
          const cookieStore = await cookies();
          const acqCookie = cookieStore.get('acquisition_data')?.value;
          if (acqCookie) {
            const parsed = JSON.parse(decodeURIComponent(acqCookie));
            acquisitionChannel = parsed.channel || 'organic';
            acquisitionData = parsed;
            requiresCardTrial = acquisitionChannel === 'google_ads' || acquisitionChannel === 'facebook_ads';
          }
          const consentCookie = cookieStore.get('marketing_consent')?.value;
          if (consentCookie === '1') {
            marketingConsent = true;
          }
        } catch {}

        // Create new user
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email,
            name: clerkUser.firstName
              ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
              : 'User',
            image: clerkUser.imageUrl,
            provider: 'google', // Social login
            emailVerified: true,
            plan: 'free',
            trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
            subscriptionStatus: 'trialing',
            acquisitionChannel: acquisitionChannel as any,
            acquisitionData: acquisitionData || undefined,
            requiresCardTrial,
            marketingConsent,
          },
        });

        // Sync to MailerLite if user consented (non-blocking)
        if (marketingConsent) {
          import('@/lib/mailerlite').then(({ addSubscriberToMailerLite }) => {
            const firstName = clerkUser.firstName || 'User';
            addSubscriberToMailerLite(email, firstName).catch((err: unknown) =>
              console.error('MailerLite sync error:', err)
            );
          });
        }
      }
    }

    return user;
  } catch {
    return null;
  }
}

// Main function - checks both auth methods
export async function getAuthUser() {
  // First try Clerk (social login)
  const clerkUser = await getClerkUser();
  if (clerkUser) return clerkUser;

  // Then try custom session (email/password)
  const customUser = await getCustomSessionUser();
  if (customUser) return customUser;

  return null;
}

export async function requireAuthUser() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
