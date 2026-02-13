import { createHmac } from 'crypto';

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || 'default-unsubscribe-secret';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';

export function generateUnsubscribeToken(userId: string): string {
  const hmac = createHmac('sha256', UNSUBSCRIBE_SECRET);
  hmac.update(userId);
  return `${userId}.${hmac.digest('hex')}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return null;

  const userId = token.substring(0, dotIndex);
  const signature = token.substring(dotIndex + 1);

  const hmac = createHmac('sha256', UNSUBSCRIBE_SECRET);
  hmac.update(userId);
  const expected = hmac.digest('hex');

  if (signature !== expected) return null;

  return userId;
}

export function getUnsubscribeUrl(userId: string): string {
  const token = generateUnsubscribeToken(userId);
  return `${APP_URL}/api/email/unsubscribe?token=${encodeURIComponent(token)}`;
}
