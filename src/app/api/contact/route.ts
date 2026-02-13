import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createZendeskTicket } from '@/lib/zendesk';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.enum(['general', 'billing', 'technical', 'feature-request', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().optional(),
});

// Simple in-memory rate limiter: 3 submissions per 15 min per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT) return true;

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

const SUBJECT_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  billing: 'Billing Question',
  technical: 'Technical Support',
  'feature-request': 'Feature Request',
  other: 'Other',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { name, email, subject, message, honeypot } = result.data;

    // Honeypot check: if filled, silently succeed without creating ticket
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // Rate limit check
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const subjectLabel = SUBJECT_LABELS[subject] || subject;

    await createZendeskTicket(name, email, `[${subjectLabel}] ${name}`, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit your message. Please try again.' },
      { status: 500 }
    );
  }
}
