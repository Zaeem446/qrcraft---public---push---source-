import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

// ─── Dynamic QR Types (trackable, editable after creation) ──────────────────
export const DYNAMIC_QR_TYPES = [
  { id: 'website', name: 'Website URL', icon: 'GlobeAltIcon', description: 'Link to any website or webpage', qrfyType: 'url' },
  { id: 'vcard', name: 'vCard', icon: 'UserIcon', description: 'Share contact information', qrfyType: 'vcard' },
  { id: 'pdf', name: 'PDF', icon: 'DocumentIcon', description: 'Share a PDF document', qrfyType: 'pdf' },
  { id: 'video', name: 'Video', icon: 'VideoCameraIcon', description: 'Link to a video', qrfyType: 'video' },
  { id: 'mp3', name: 'MP3', icon: 'MusicalNoteIcon', description: 'Share audio file', qrfyType: 'mp3' },
  { id: 'images', name: 'Images', icon: 'PhotoIcon', description: 'Share image gallery', qrfyType: 'images' },
  { id: 'links', name: 'Link List', icon: 'Bars3Icon', description: 'Multiple links in one QR', qrfyType: 'link-list' },
  { id: 'menu', name: 'Menu', icon: 'ClipboardDocumentListIcon', description: 'Restaurant or cafe menu', qrfyType: 'menu' },
  { id: 'business', name: 'Business Page', icon: 'BuildingOfficeIcon', description: 'Business landing page', qrfyType: 'business' },
  { id: 'apps', name: 'App Download', icon: 'DevicePhoneMobileIcon', description: 'Link to app stores', qrfyType: 'app' },
  { id: 'coupon', name: 'Coupon', icon: 'TicketIcon', description: 'Digital coupon or discount', qrfyType: 'coupon' },
  { id: 'review', name: 'Review', icon: 'StarIcon', description: 'Collect reviews', qrfyType: 'feedback' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'ChatBubbleLeftIcon', description: 'Start WhatsApp chat', qrfyType: 'whatsapp' },
  { id: 'social', name: 'Social Media', icon: 'ShareIcon', description: 'All social media links', qrfyType: 'social' },
  { id: 'event', name: 'Event', icon: 'CalendarIcon', description: 'Event details and RSVP', qrfyType: 'event' },
  { id: 'instagram', name: 'Instagram', icon: 'CameraIcon', description: 'Link to Instagram profile', qrfyType: 'url' },
  { id: 'facebook', name: 'Facebook', icon: 'HandThumbUpIcon', description: 'Link to Facebook page', qrfyType: 'url' },
] as const;

// ─── Static QR Types (data embedded directly, not trackable) ────────────────
export const STATIC_QR_TYPES = [
  { id: 'text', name: 'Plain Text', icon: 'DocumentTextIcon', description: 'Display plain text', qrfyType: 'text' },
  { id: 'wifi', name: 'WiFi', icon: 'WifiIcon', description: 'Share WiFi credentials', qrfyType: 'wifi' },
  { id: 'email', name: 'Email', icon: 'EnvelopeIcon', description: 'Pre-composed email', qrfyType: 'email' },
  { id: 'sms', name: 'SMS', icon: 'ChatBubbleBottomCenterTextIcon', description: 'Pre-composed text message', qrfyType: 'sms' },
  { id: 'bitcoin', name: 'Bitcoin', icon: 'CurrencyDollarIcon', description: 'Cryptocurrency payment', qrfyType: 'url-static' },
] as const;

// Combined for backward compatibility
export const QR_TYPES = [...DYNAMIC_QR_TYPES, ...STATIC_QR_TYPES] as const;

export type QRType = typeof QR_TYPES[number]['id'];

export const PLANS = {
  starter: {
    name: 'Starter',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    qrLimit: 25,
    scanLimit: 10000,
    features: ['25 Dynamic QR Codes', '10,000 Scans/month', 'Basic Analytics', 'PNG & SVG Download', 'Custom Colors', 'Email Support'],
  },
  professional: {
    name: 'Professional',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    qrLimit: 100,
    scanLimit: 100000,
    features: ['100 Dynamic QR Codes', '100,000 Scans/month', 'Advanced Analytics', 'All Download Formats', 'Custom Logo & Styling', 'Priority Support', 'Bulk Creation'],
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    qrLimit: -1,
    scanLimit: -1,
    features: ['Unlimited QR Codes', 'Unlimited Scans', 'Full Analytics Suite', 'All Download Formats', 'White Label Options', 'API Access', 'Dedicated Support', 'Custom Integrations'],
  },
} as const;

export type PlanType = keyof typeof PLANS;

export const TRIAL_DAYS = 14;
