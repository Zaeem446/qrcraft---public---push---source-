import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeKey
  ? new Stripe(stripeKey, {
      typescript: true,
    })
  : (null as unknown as Stripe);

// Helper to calculate subscription end date based on interval
export function getSubscriptionEndDate(interval: string): Date {
  const now = new Date();
  switch (interval) {
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    case 'quarterly':
      return new Date(now.setMonth(now.getMonth() + 3));
    case 'annually':
    case 'yearly':
      return new Date(now.setFullYear(now.getFullYear() + 1));
    default:
      return new Date(now.setMonth(now.getMonth() + 1));
  }
}

export const PRICE_IDS: Record<string, string> = {
  // Single plan with 3 billing intervals
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  quarterly: process.env.STRIPE_QUARTERLY_PRICE_ID || '',
  annually: process.env.STRIPE_ANNUALLY_PRICE_ID || '',

  // Legacy mappings for backward compatibility
  starter_monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  starter_yearly: process.env.STRIPE_ANNUALLY_PRICE_ID || '',
  professional_monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  professional_yearly: process.env.STRIPE_ANNUALLY_PRICE_ID || '',
  enterprise_monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  enterprise_yearly: process.env.STRIPE_ANNUALLY_PRICE_ID || '',
};

export function getPriceId(plan: string, interval: string): string {
  // Try direct interval match first (new system)
  if (PRICE_IDS[interval]) {
    return PRICE_IDS[interval];
  }
  // Fall back to plan_interval key (legacy)
  const key = `${plan}_${interval}`;
  return PRICE_IDS[key] || '';
}
