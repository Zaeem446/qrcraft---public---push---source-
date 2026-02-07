// Self-hosted QR Generator - Server-side stub
// All actual QR generation now happens client-side via StyledQRPreview component
// This file only provides type mappings and stub functions for API compatibility

// ─── Type Mapping ────────────────────────────────────────────────────────────

const TYPE_MAP: Record<string, string> = {
  website: 'url',
  vcard: 'vcard',
  wifi: 'wifi',
  email: 'email',
  sms: 'sms',
  text: 'text',
  whatsapp: 'whatsapp',
  pdf: 'pdf',
  video: 'video',
  mp3: 'mp3',
  images: 'images',
  links: 'link-list',
  menu: 'menu',
  business: 'business',
  apps: 'app',
  coupon: 'coupon',
  social: 'social',
  event: 'event',
  review: 'feedback',
  instagram: 'url',
  facebook: 'url',
  bitcoin: 'url-static',
  phone: 'url-static',
  calendar: 'url-static',
  playlist: 'link-list',
  product: 'business',
  feedback: 'feedback',
};

export function mapTypeToQrfy(ourType: string): string {
  return TYPE_MAP[ourType] || 'url';
}

// ─── Helper Functions ────────────────────────────────────────────────────────

function toAbsoluteUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  const base = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

// ─── Design Mapping ──────────────────────────────────────────────────────────

export function mapDesignToStyle(design: Record<string, any>) {
  const style: Record<string, any> = {};

  if (design.logo && !design.logo.startsWith('data:')) {
    style.image = toAbsoluteUrl(design.logo);
  }

  style.shape = {
    style: design.dotsType || 'square',
    color: design.dotsColor || '#000000',
    backgroundColor: design.bgTransparent ? '#FFFFFF' : (design.backgroundColor || '#FFFFFF'),
  };

  style.corners = {
    squareStyle: design.cornersSquareType || 'default',
    dotStyle: design.cornersDotType || 'default',
    squareColor: design.cornersSquareColor || '#000000',
    dotColor: design.cornersDotColor || '#000000',
  };

  const frameId = typeof design.frameId === 'number' ? design.frameId : -1;
  if (frameId >= 0) {
    style.frame = {
      id: frameId,
      color: design.frameColor || '#7C3AED',
      text: (design.frameText || 'Scan me!').slice(0, 30),
      fontSize: design.frameFontSize || 42,
      textColor: design.frameTextColor || '#FFFFFF',
    };
    if (frameId > 0) {
      style.frame.backgroundColor = design.frameBackgroundColor || design.frameColor || '#7C3AED';
    }
  }

  style.errorCorrectionLevel = design.errorCorrectionLevel || (design.logo ? 'H' : 'M');

  return style;
}

// ─── Content Mapping ─────────────────────────────────────────────────────────

const DEFAULT_DESIGN_2 = { primary: '#7C3AED', secondary: '#FFFFFF' };
const DEFAULT_DESIGN_3 = { primary: '#7C3AED', secondary: '#FFFFFF', tertiary: '#F3F4F6' };
const DEFAULT_DESIGN_COLOR = { color: '#7C3AED' };

export function mapContentToData(ourType: string, content: Record<string, any>) {
  const qrfyType = mapTypeToQrfy(ourType);
  const design2 = content.pageDesign || DEFAULT_DESIGN_2;
  const design3 = content.pageDesign || DEFAULT_DESIGN_3;
  const designC = content.pageDesign || DEFAULT_DESIGN_COLOR;

  switch (ourType) {
    case 'website': {
      const websites = Array.isArray(content.websites) ? content.websites : [];
      const data: Record<string, any> = { url: content.url || '' };
      if (websites.length > 0) {
        data.websites = websites.filter((w: any) => w.url).map((w: any) => ({
          name: w.name || '',
          url: w.url || '',
          description: w.description || '',
        }));
      }
      if (content.badge) data.badge = toAbsoluteUrl(content.badge);
      return { type: qrfyType, data };
    }
    case 'instagram':
    case 'facebook':
      return { type: qrfyType, data: { url: content.url || '' } };

    case 'bitcoin':
      return {
        type: 'url-static',
        data: { url: content.address ? `bitcoin:${content.address}` : content.url || '' },
      };

    case 'phone':
      return {
        type: 'url-static',
        data: { url: `tel:${(content.phone || '').replace(/\s/g, '')}` },
      };

    case 'text':
      return { type: 'text', data: { text: content.text || content.url || '' } };

    case 'vcard':
      return {
        type: 'vcard',
        data: {
          firstName: content.firstName || '',
          lastName: content.lastName || '',
          phone: content.phone || '',
          email: content.email || '',
          company: content.company || content.org || '',
          title: content.title || '',
          url: content.website || '',
          street: content.street || '',
          city: content.city || '',
          state: content.state || '',
          zip: content.zip || '',
          country: content.country || '',
        },
      };

    case 'wifi':
      return {
        type: 'wifi',
        data: {
          ssid: content.ssid || '',
          password: content.password || '',
          authType: content.authType || content.encryption || 'WPA',
          hidden: content.hidden || false,
        },
      };

    case 'email':
      return {
        type: 'email',
        data: {
          email: content.email || '',
          subject: content.subject || '',
          body: content.message || content.body || '',
        },
      };

    case 'sms':
      return {
        type: 'sms',
        data: {
          phone: content.phone || '',
          message: content.message || '',
        },
      };

    case 'whatsapp':
      return {
        type: 'whatsapp',
        data: {
          phone: content.phone || '',
          message: content.message || '',
        },
      };

    default:
      return { type: qrfyType, data: content };
  }
}

// ─── Stub Functions (QR generation now happens client-side) ──────────────────

export const STATIC_TYPES = ['text', 'wifi', 'email', 'sms', 'bitcoin', 'phone', 'calendar', 'vcard'];

// This function is no longer used - QR preview is generated client-side
export async function createStaticQRImage(
  type: string,
  content: Record<string, any>,
  design: Record<string, any>,
  format: 'png' | 'webp' | 'jpeg' | 'svg' = 'png'
): Promise<Buffer> {
  // QR generation now happens entirely client-side
  // This stub exists only for backward compatibility
  throw new Error('Server-side QR generation disabled - use client-side StyledQRPreview component');
}

export async function createQR(params: {
  type: string;
  content: Record<string, any>;
  design: Record<string, any>;
  name?: string;
}) {
  const mockId = Date.now();
  console.log('[QR Generator] createQR called - using self-hosted generation');
  return { id: mockId };
}

export async function updateQR(
  qrfyId: number,
  params: {
    type?: string;
    content?: Record<string, any>;
    design?: Record<string, any>;
    name?: string;
  }
) {
  console.log('[QR Generator] updateQR called - self-hosted, no external update needed');
  return { success: true };
}

export async function deleteQR(qrfyId: number) {
  console.log('[QR Generator] deleteQR called - self-hosted, no external delete needed');
  return { success: true };
}

export async function getQRImage(
  qrfyId: number,
  format: 'png' | 'webp' | 'jpeg' = 'png'
): Promise<Buffer> {
  throw new Error('getQRImage not available - use client-side generation');
}

export async function getReport(params: {
  qrfyIds?: number[];
  startDate?: string;
  endDate?: string;
  format?: 'json' | 'csv' | 'xlsx';
}) {
  console.log('[QR Generator] getReport called - use local analytics instead');
  return {
    scans: 0,
    uniqueScans: 0,
    scansByDate: {},
    devices: [],
    browsers: [],
    os: [],
    countries: [],
    cities: [],
  };
}

export function transformQrfyReport(report: any) {
  const scansOverTime: { date: string; count: number }[] = [];
  const uniqueScansOverTime: { date: string; count: number }[] = [];
  const deviceBreakdown: { name: string; value: number }[] = [];
  const browserBreakdown: { name: string; value: number }[] = [];
  const osBreakdown: { name: string; value: number }[] = [];
  const locationBreakdown: { name: string; value: number }[] = [];
  const cityBreakdown: { name: string; value: number }[] = [];
  let totalScans = 0;
  let uniqueScans = 0;

  if (report?.scans) {
    totalScans = typeof report.scans === 'number' ? report.scans : 0;
  }

  if (report?.uniqueScans) {
    uniqueScans = typeof report.uniqueScans === 'number' ? report.uniqueScans : 0;
  }

  return {
    totalScans, uniqueScans, scansOverTime, uniqueScansOverTime,
    deviceBreakdown, browserBreakdown, osBreakdown, locationBreakdown, cityBreakdown,
  };
}

// ─── Style Options for UI ────────────────────────────────────────────────────

export const QRFY_SHAPE_STYLES = [
  'square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded',
] as const;

export const QRFY_CORNER_SQUARE_STYLES = [
  'default', 'dot', 'square', 'extra-rounded',
] as const;

export const QRFY_CORNER_DOT_STYLES = [
  'default', 'dot', 'square',
] as const;

export const QRFY_FRAME_IDS = Array.from({ length: 31 }, (_, i) => i);

export const QRFY_ERROR_CORRECTION = ['L', 'M', 'Q', 'H'] as const;
