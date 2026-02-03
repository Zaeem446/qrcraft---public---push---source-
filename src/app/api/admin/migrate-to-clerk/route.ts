import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// One-time migration script to create Clerk users for existing database users
// Run this once after deploying Clerk integration
// DELETE THIS FILE after migration is complete

export async function POST(req: NextRequest) {
  try {
    // Simple auth check - use a secret key to protect this endpoint
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.MIGRATION_SECRET && secret !== 'migrate-now-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET_KEY) {
      return NextResponse.json({ error: 'CLERK_SECRET_KEY not configured' }, { status: 500 });
    }

    // Get all users without a clerkId
    const users = await prisma.user.findMany({
      where: { clerkId: null },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        provider: true,
        emailVerified: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json({
        message: 'No users to migrate',
        migrated: 0,
        skipped: 0,
        errors: []
      });
    }

    const results = {
      migrated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const user of users) {
      try {
        // Check if user already exists in Clerk by email
        const searchRes = await fetch(
          `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(user.email)}`,
          {
            headers: {
              Authorization: `Bearer ${CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const existingUsers = await searchRes.json();

        let clerkUserId: string;

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
          // User already exists in Clerk, just link them
          clerkUserId = existingUsers[0].id;
          console.log(`User ${user.email} already exists in Clerk, linking...`);
        } else {
          // Create new user in Clerk
          const createRes = await fetch('https://api.clerk.com/v1/users', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email_address: [user.email],
              first_name: user.name?.split(' ')[0] || 'User',
              last_name: user.name?.split(' ').slice(1).join(' ') || '',
              skip_password_requirement: true, // They'll use "Forgot Password" or social login
              skip_password_checks: true,
              public_metadata: {
                migratedFromNextAuth: true,
                originalUserId: user.id,
              },
            }),
          });

          if (!createRes.ok) {
            const error = await createRes.json();
            throw new Error(error.errors?.[0]?.message || 'Failed to create Clerk user');
          }

          const clerkUser = await createRes.json();
          clerkUserId = clerkUser.id;
          console.log(`Created Clerk user for ${user.email}`);
        }

        // Update our database with the Clerk ID
        await prisma.user.update({
          where: { id: user.id },
          data: { clerkId: clerkUserId },
        });

        results.migrated++;
      } catch (error: any) {
        console.error(`Error migrating user ${user.email}:`, error);
        results.errors.push(`${user.email}: ${error.message}`);
        results.skipped++;
      }
    }

    return NextResponse.json({
      message: 'Migration complete',
      total: users.length,
      ...results,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}

// Also allow GET to check status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.MIGRATION_SECRET && secret !== 'migrate-now-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [total, migrated, pending] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { clerkId: { not: null } } }),
    prisma.user.count({ where: { clerkId: null } }),
  ]);

  return NextResponse.json({
    total,
    migrated,
    pending,
    status: pending === 0 ? 'complete' : 'pending',
  });
}
