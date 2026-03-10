/**
 * Setup Square Subscription Plans
 *
 * Run once to create the subscription catalog items with proper trial phases.
 * Outputs the 3 variation IDs to add as environment variables.
 *
 * Architecture (per Square docs):
 *   1. Create a SUBSCRIPTION_PLAN (parent container)
 *   2. Create SUBSCRIPTION_PLAN_VARIATION objects (with phases) under that plan
 *
 * Usage:
 *   npx tsx scripts/setup-square-plans.ts
 *
 * Required env vars:
 *   SQUARE_ACCESS_TOKEN
 *   SQUARE_LOCATION_ID
 *   SQUARE_ENVIRONMENT (production or sandbox)
 */

import 'dotenv/config';
import { SquareClient, SquareEnvironment } from 'square';

const accessToken = process.env.SQUARE_ACCESS_TOKEN;
const locationId = process.env.SQUARE_LOCATION_ID;

if (!accessToken || !locationId) {
  console.error('Missing SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID in environment');
  process.exit(1);
}

const client = new SquareClient({
  token: accessToken,
  environment: process.env.SQUARE_ENVIRONMENT === 'sandbox'
    ? SquareEnvironment.Sandbox
    : SquareEnvironment.Production,
});

interface VariationConfig {
  name: string;
  interval: string;
  cadence: string;
  priceCents: number;
}

// Prices must match PRICING in src/lib/utils.ts
const variations: VariationConfig[] = [
  { name: 'Monthly',   interval: 'monthly',   cadence: 'MONTHLY',            priceCents: 4995 },
  { name: 'Quarterly', interval: 'quarterly',  cadence: 'QUARTERLY',          priceCents: 8985 },
  { name: 'Annually',  interval: 'annually',   cadence: 'ANNUAL',             priceCents: 23940 },
];

async function main() {
  console.log('Creating Square subscription plan + variations...\n');

  // Step 1: Create the parent subscription plan
  console.log('Step 1: Creating subscription plan...');
  const planResponse = await client.catalog.object.upsert({
    idempotencyKey: `qrcraft-plan-${Date.now()}`,
    object: {
      type: 'SUBSCRIPTION_PLAN',
      id: '#qrcraft-pro-plan',
      subscriptionPlanData: {
        name: 'QRCraft Pro',
        allItems: true,
      },
    },
  });

  const planId = planResponse.catalogObject?.id;
  if (!planId) {
    console.error('Failed to create subscription plan');
    process.exit(1);
  }
  console.log(`  Plan created: ${planId}\n`);

  // Step 2: Create variations with trial + paid phases
  const results: Record<string, string> = {};

  for (const variation of variations) {
    console.log(`Step 2: Creating variation "${variation.name}"...`);
    try {
      const varResponse = await client.catalog.object.upsert({
        idempotencyKey: `qrcraft-variation-${variation.interval}-${Date.now()}`,
        object: {
          type: 'SUBSCRIPTION_PLAN_VARIATION',
          id: `#variation-${variation.interval}`,
          subscriptionPlanVariationData: {
            name: `QRCraft Pro - ${variation.name}`,
            subscriptionPlanId: planId,
            phases: [
              {
                cadence: 'WEEKLY' as any,
                periods: 1,
                ordinal: BigInt(0),
                pricing: {
                  type: 'STATIC',
                  priceMoney: {
                    amount: BigInt(0),
                    currency: 'USD',
                  },
                },
              },
              {
                cadence: variation.cadence as any,
                ordinal: BigInt(1),
                pricing: {
                  type: 'STATIC',
                  priceMoney: {
                    amount: BigInt(variation.priceCents),
                    currency: 'USD',
                  },
                },
              },
            ],
          },
        },
      });

      const variationId = varResponse.catalogObject?.id;
      if (!variationId) {
        console.error(`  Failed: no catalog object returned`);
        continue;
      }

      results[variation.interval] = variationId;
      console.log(`  Variation ID: ${variationId}`);
    } catch (error: any) {
      console.error(`  Failed: ${error?.message || error}`);
    }
  }

  console.log('\n--- Add these to your .env.local and Vercel ---\n');
  console.log(`SQUARE_MONTHLY_VARIATION_ID=${results.monthly || 'FAILED'}`);
  console.log(`SQUARE_QUARTERLY_VARIATION_ID=${results.quarterly || 'FAILED'}`);
  console.log(`SQUARE_ANNUALLY_VARIATION_ID=${results.annually || 'FAILED'}`);
}

main().catch(console.error);
