import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

export const PRICE_IDS: Record<string, string> = {
  starter_monthly: process.env.STRIPE_STARTER_PRICE_ID!,
  starter_yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID!,
  professional_monthly: process.env.STRIPE_PRO_PRICE_ID!,
  professional_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  enterprise_monthly: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
  enterprise_yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID!,
};

export function getPriceId(plan: string, interval: 'monthly' | 'yearly'): string {
  const key = `${plan}_${interval}`;
  return PRICE_IDS[key] || '';
}
