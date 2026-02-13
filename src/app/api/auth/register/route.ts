import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import prisma from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { TRIAL_DAYS } from '@/lib/utils';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

async function getGeoFromIP(ip: string) {
  try {
    if (ip === '127.0.0.1' || ip === '::1') return { country: null, city: null };
    const res = await fetch(`https://ip-api.com/json/${ip}?fields=country,city`);
    if (res.ok) {
      const data = await res.json();
      return { country: data.country || null, city: data.city || null };
    }
  } catch {}
  return { country: null, city: null };
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, acquisitionChannel, acquisitionData, marketingConsent } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Get country from IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    const geo = await getGeoFromIP(ip);

    const hashedPassword = await bcrypt.hash(password, 12);

    const isAdUser = acquisitionChannel === 'google_ads' || acquisitionChannel === 'facebook_ads';

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        provider: 'credentials',
        country: geo.country,
        city: geo.city,
        plan: 'free',
        subscriptionStatus: 'trialing',
        trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
        acquisitionChannel: acquisitionChannel || 'organic',
        acquisitionData: acquisitionData || undefined,
        requiresCardTrial: isAdUser,
        marketingConsent: !!marketingConsent,
      },
    });

    // Sync to MailerLite if user consented (non-blocking)
    if (marketingConsent) {
      import('@/lib/mailerlite').then(({ addSubscriberToMailerLite }) => {
        addSubscriberToMailerLite(email.toLowerCase(), name.split(' ')[0]).catch((err: unknown) =>
          console.error('MailerLite sync error:', err)
        );
      });
    }

    const token = nanoid(32);
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        type: 'email',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    // Auto-login: create session token
    const sessionToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      message: 'Account created successfully',
      requiresCardTrial: isAdUser,
    }, { status: 201 });

    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
