import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'QRCraft <noreply@qr-craft.online>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';

// Shared email wrapper with QRCraft branding
function emailLayout(content: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="padding: 32px 24px 16px; text-align: center; background: linear-gradient(135deg, #3B82F6, #6366F1); border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">QRCraft</h2>
      </div>
      <div style="padding: 32px 24px;">
        ${content}
      </div>
      <div style="padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #9CA3AF; font-size: 12px;">&copy; ${new Date().getFullYear()} QRCraft. All rights reserved.</p>
      </div>
    </div>
  `;
}

function ctaButton(text: string, url: string): string {
  return `<a href="${url}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3B82F6, #6366F1); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 16px 0;">${text}</a>`;
}

// --- Existing transactional emails ---

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your QRCraft email',
    html: emailLayout(`
      <h1 style="color: #111827; font-size: 22px; margin: 0 0 12px;">Welcome to QRCraft!</h1>
      <p style="color: #4B5563; line-height: 1.6; margin: 0 0 24px;">Please verify your email address by clicking the button below:</p>
      <div style="text-align: center;">
        ${ctaButton('Verify Email', verifyUrl)}
      </div>
      <p style="color: #9CA3AF; font-size: 14px; margin: 24px 0 0;">This link expires in 24 hours.</p>
    `),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your QRCraft password',
    html: emailLayout(`
      <h1 style="color: #111827; font-size: 22px; margin: 0 0 12px;">Password Reset</h1>
      <p style="color: #4B5563; line-height: 1.6; margin: 0 0 24px;">Click the button below to reset your password:</p>
      <div style="text-align: center;">
        ${ctaButton('Reset Password', resetUrl)}
      </div>
      <p style="color: #9CA3AF; font-size: 14px; margin: 24px 0 0;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `),
  });
}

// --- Lifecycle emails ---

export async function sendTrialExpiredEmail(
  email: string,
  firstName: string,
  totalQRCodes: number,
  totalScans: number,
  unsubscribeUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your QRCraft trial has ended',
    html: emailLayout(`
      <h1 style="color: #111827; font-size: 22px; margin: 0 0 12px;">Hi ${firstName}, your trial has ended</h1>
      <p style="color: #4B5563; line-height: 1.6; margin: 0 0 16px;">During your trial, here's what you accomplished:</p>
      <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">QR Codes Created</td>
            <td style="padding: 8px 0; color: #111827; font-size: 18px; font-weight: 700; text-align: right;">${totalQRCodes}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Total Scans Received</td>
            <td style="padding: 8px 0; color: #111827; font-size: 18px; font-weight: 700; text-align: right;">${totalScans}</td>
          </tr>
        </table>
      </div>
      <p style="color: #4B5563; line-height: 1.6; margin: 0 0 24px;">Don't lose access to your QR codes and analytics. Subscribe now to keep everything running.</p>
      <div style="text-align: center;">
        ${ctaButton('View Plans & Subscribe', `${APP_URL}/pricing`)}
      </div>
      <p style="color: #9CA3AF; font-size: 12px; margin: 32px 0 0; text-align: center;">
        <a href="${unsubscribeUrl}" style="color: #9CA3AF; text-decoration: underline;">Unsubscribe from marketing emails</a>
      </p>
    `),
  });
}

export async function sendSubscriptionRenewedEmail(
  email: string,
  firstName: string,
  planName: string,
  nextBillingDate: string,
  unsubscribeUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your QRCraft subscription has been renewed',
    html: emailLayout(`
      <h1 style="color: #111827; font-size: 22px; margin: 0 0 12px;">Hi ${firstName}, your subscription is renewed!</h1>
      <p style="color: #4B5563; line-height: 1.6; margin: 0 0 16px;">Your QRCraft ${planName} plan has been successfully renewed.</p>
      <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Plan</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${planName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Next Billing Date</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${nextBillingDate}</td>
          </tr>
        </table>
      </div>
      <div style="text-align: center;">
        ${ctaButton('Go to Dashboard', `${APP_URL}/dashboard`)}
      </div>
      <p style="color: #9CA3AF; font-size: 12px; margin: 32px 0 0; text-align: center;">
        <a href="${unsubscribeUrl}" style="color: #9CA3AF; text-decoration: underline;">Unsubscribe from marketing emails</a>
      </p>
    `),
  });
}
