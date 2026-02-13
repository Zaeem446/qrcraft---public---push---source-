import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';
import { removeSubscriberFromMailerLite } from '@/lib/mailerlite';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse(unsubscribePage('Invalid unsubscribe link.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const userId = verifyUnsubscribeToken(token);

  if (!userId) {
    return new NextResponse(unsubscribePage('Invalid or expired unsubscribe link.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, marketingUnsubscribed: true },
    });

    if (!user) {
      return new NextResponse(unsubscribePage('User not found.', false), {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (!user.marketingUnsubscribed) {
      await prisma.user.update({
        where: { id: userId },
        data: { marketingUnsubscribed: true },
      });

      // Remove from MailerLite (non-blocking)
      removeSubscriberFromMailerLite(user.email).catch((err) =>
        console.error('MailerLite unsubscribe error:', err)
      );
    }

    return new NextResponse(unsubscribePage("You've been successfully unsubscribed from marketing emails.", true), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse(unsubscribePage('Something went wrong. Please try again later.', false), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function unsubscribePage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - QRCraft</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb; }
    .card { background: white; border-radius: 16px; padding: 48px; text-align: center; max-width: 440px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 28px; }
    .success { background: #ecfdf5; color: #059669; }
    .error { background: #fef2f2; color: #dc2626; }
    h1 { font-size: 22px; color: #111827; margin: 0 0 12px; }
    p { color: #6b7280; line-height: 1.6; margin: 0; }
    a { display: inline-block; margin-top: 24px; color: #4f46e5; text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon ${success ? 'success' : 'error'}">${success ? '&#10003;' : '&#10007;'}</div>
    <h1>${success ? 'Unsubscribed' : 'Oops'}</h1>
    <p>${message}</p>
    <a href="/">Back to QRCraft</a>
  </div>
</body>
</html>`;
}
