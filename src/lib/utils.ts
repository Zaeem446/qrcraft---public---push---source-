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
  { id: 'playlist', name: 'Playlist', icon: 'MusicalNoteIcon', description: 'Share music playlists', qrfyType: 'link-list' },
  { id: 'product', name: 'Product', icon: 'ShoppingBagIcon', description: 'Product landing page', qrfyType: 'business' },
  { id: 'feedback', name: 'Feedback', icon: 'ClipboardDocumentCheckIcon', description: 'Collect feedback & surveys', qrfyType: 'feedback' },
] as const;

// ─── Static QR Types (data embedded directly, not trackable) ────────────────
export const STATIC_QR_TYPES = [
  { id: 'text', name: 'Plain Text', icon: 'DocumentTextIcon', description: 'Display plain text', qrfyType: 'text' },
  { id: 'wifi', name: 'WiFi', icon: 'WifiIcon', description: 'Share WiFi credentials', qrfyType: 'wifi' },
  { id: 'email', name: 'Email', icon: 'EnvelopeIcon', description: 'Pre-composed email', qrfyType: 'email' },
  { id: 'sms', name: 'SMS', icon: 'ChatBubbleBottomCenterTextIcon', description: 'Pre-composed text message', qrfyType: 'sms' },
  { id: 'bitcoin', name: 'Bitcoin', icon: 'CurrencyDollarIcon', description: 'Cryptocurrency payment', qrfyType: 'url-static' },
  { id: 'phone', name: 'Phone Call', icon: 'PhoneIcon', description: 'Initiate a phone call', qrfyType: 'url-static' },
  { id: 'calendar', name: 'Calendar Event', icon: 'CalendarDaysIcon', description: 'Add event to calendar', qrfyType: 'url-static' },
] as const;

// Combined for backward compatibility
export const QR_TYPES = [...DYNAMIC_QR_TYPES, ...STATIC_QR_TYPES] as const;

export type QRType = typeof QR_TYPES[number]['id'];

export const PLAN_FEATURES = [
  'Create unlimited dynamic QR codes',
  'Access a variety of QR types',
  'Unlimited modifications of QR codes',
  'Unlimited scans',
  'Multiple QR code download formats',
  'Unlimited users',
  'Premium customer support',
  'Cancel at anytime',
] as const;

export const PRICING = {
  monthly: {
    price: 49.95,
    perMonth: 49.95,
    interval: 'monthly' as const,
    label: 'Monthly',
    description: 'Invoiced every month',
    discount: 0,
  },
  quarterly: {
    price: 89.85,
    perMonth: 29.95,
    interval: 'quarterly' as const,
    label: 'Quarterly',
    description: 'Invoiced each quarter',
    discount: 40,
  },
  annually: {
    price: 239.40,
    perMonth: 19.95,
    interval: 'annually' as const,
    label: 'Annually',
    description: 'Invoiced every year',
    discount: 60,
  },
} as const;

export type BillingInterval = keyof typeof PRICING;

// Keep backward compatibility with existing code that references PLANS
export const PLANS = {
  starter: {
    name: 'Starter',
    monthlyPrice: 49.95,
    yearlyPrice: 239.40,
    qrLimit: -1,
    scanLimit: -1,
    features: [...PLAN_FEATURES],
  },
  professional: {
    name: 'Professional',
    monthlyPrice: 49.95,
    yearlyPrice: 239.40,
    qrLimit: -1,
    scanLimit: -1,
    features: [...PLAN_FEATURES],
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 49.95,
    yearlyPrice: 239.40,
    qrLimit: -1,
    scanLimit: -1,
    features: [...PLAN_FEATURES],
  },
} as const;

export type PlanType = keyof typeof PLANS;

export const TRIAL_DAYS = 14;
