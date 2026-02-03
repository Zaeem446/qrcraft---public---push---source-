import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from './db';

export async function getAuthUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Try to find user by clerkId
  let user = await prisma.user.findFirst({
    where: { clerkId: userId },
  });

  // If not found, try to get Clerk user data and create/link the user
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      return null;
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    // Check if user exists with this email (might be migrated from NextAuth)
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
      // Create new user
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name: clerkUser.firstName
            ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
            : 'User',
          image: clerkUser.imageUrl,
          provider: 'credentials',
          emailVerified: true,
          plan: 'free',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          subscriptionStatus: 'trialing',
        },
      });
    }
  }

  return user;
}

export async function requireAuthUser() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
