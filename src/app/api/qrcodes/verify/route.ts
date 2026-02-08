import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, password } = body;

    if (!slug || !password) {
      return NextResponse.json({ error: 'Slug and password are required' }, { status: 400 });
    }

    const qrcode = await prisma.qRCode.findUnique({
      where: { slug },
      select: {
        accessPassword: true,
        isActive: true,
      },
    });

    if (!qrcode || !qrcode.isActive) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    if (!qrcode.accessPassword) {
      // No password required - this shouldn't happen but handle gracefully
      return NextResponse.json({ success: true });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, qrcode.accessPassword);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Set a session cookie for this QR code (expires in 1 hour)
    const response = NextResponse.json({ success: true });
    response.cookies.set(`qr_access_${slug}`, 'verified', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
