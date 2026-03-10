import { SquareClient, SquareEnvironment } from 'square';

const accessToken = process.env.SQUARE_ACCESS_TOKEN;

export const squareClient = accessToken
  ? new SquareClient({
      token: accessToken,
      environment: process.env.SQUARE_ENVIRONMENT === 'sandbox'
        ? SquareEnvironment.Sandbox
        : SquareEnvironment.Production,
    })
  : null;

export const LOCATION_ID = process.env.SQUARE_LOCATION_ID || '';

// Map billing interval to Square catalog variation ID
export function getVariationId(interval: string): string {
  switch (interval) {
    case 'monthly':
      return process.env.SQUARE_MONTHLY_VARIATION_ID || '';
    case 'quarterly':
      return process.env.SQUARE_QUARTERLY_VARIATION_ID || '';
    case 'annually':
    case 'yearly':
      return process.env.SQUARE_ANNUALLY_VARIATION_ID || '';
    default:
      return '';
  }
}

// Price in cents for each interval (must match catalog plan variation prices)
export function getPriceCents(interval: string): number {
  switch (interval) {
    case 'monthly':
      return 4995;
    case 'quarterly':
      return 8985;
    case 'annually':
    case 'yearly':
      return 23940;
    default:
      return 4995;
  }
}

// Label for checkout display
export function getPlanLabel(interval: string): string {
  switch (interval) {
    case 'monthly':
      return 'QRCraft Pro - Monthly';
    case 'quarterly':
      return 'QRCraft Pro - Quarterly';
    case 'annually':
    case 'yearly':
      return 'QRCraft Pro - Annual';
    default:
      return 'QRCraft Pro';
  }
}

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
