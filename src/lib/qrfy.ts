// QRFY API Client — Server-side only
// Docs reference: https://qrfy.com API

const QRFY_API_URL = process.env.QRFY_API_URL || 'https://qrfy.com';
const QRFY_API_KEY = process.env.QRFY_API_KEY || '';

async function qrfyFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${QRFY_API_URL}${path}`, {
    ...options,
    headers: {
      'API-KEY': QRFY_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res;
}

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
};

export function mapTypeToQrfy(ourType: string): string {
  return TYPE_MAP[ourType] || 'url';
}

// ─── Style Mapping (simplified — direct passthroughs) ───────────────────────

// Confirmed QRFY shape styles (6)
const SHAPE_STYLE_MAP: Record<string, string> = {
  square: 'square',
  rounded: 'rounded',
  dots: 'dots',
  classy: 'classy',
  'classy-rounded': 'classy-rounded',
  'extra-rounded': 'extra-rounded',
};

// Confirmed QRFY corner square styles (4)
const CORNER_SQUARE_MAP: Record<string, string> = {
  default: 'default',
  square: 'square',
  dot: 'dot',
  'extra-rounded': 'extra-rounded',
};

// Confirmed QRFY corner dot styles (3)
const CORNER_DOT_MAP: Record<string, string> = {
  default: 'default',
  dot: 'dot',
  square: 'square',
};

function makeColorValue(hex: string, useGradient?: boolean, hex2?: string) {
  if (useGradient && hex2) {
    return {
      type: 'linear' as const,
      rotation: 45,
      colorStops: [
        { offset: 0, color: hex },
        { offset: 1, color: hex2 },
      ],
    };
  }
  return hex;
}

export function mapDesignToStyle(design: Record<string, any>) {
  const style: Record<string, any> = {};

  // Logo
  if (design.logo) {
    style.image = design.logo;
  }

  // Shape / pattern
  style.shape = {
    style: SHAPE_STYLE_MAP[design.dotsType] || 'square',
    color: makeColorValue(
      design.dotsColor || '#000000',
      design.patternGradient,
      design.patternColor2
    ),
    backgroundColor: design.bgTransparent
      ? '#FFFFFF'
      : makeColorValue(
          design.backgroundColor || '#FFFFFF',
          design.useGradientBg,
          design.bgColor2
        ),
  };

  // Corners
  style.corners = {
    squareStyle: CORNER_SQUARE_MAP[design.cornersSquareType] || 'default',
    dotStyle: CORNER_DOT_MAP[design.cornersDotType] || 'default',
    squareColor: design.cornersSquareColor || '#000000',
    dotColor: design.cornersDotColor || '#000000',
  };

  // Frame — use numeric frameId directly
  const frameId = typeof design.frameId === 'number' ? design.frameId : 0;
  if (frameId > 0) {
    style.frame = {
      id: frameId,
      color: design.frameColor || '#000000',
      text: (design.frameText || 'Scan me!').slice(0, 30),
      fontSize: design.frameFontSize || 42,
      textColor: design.frameTextColor || '#FFFFFF',
      backgroundColor: design.frameBackgroundColor || design.frameColor || '#000000',
    };
  } else {
    style.frame = { id: 0 };
  }

  // Error correction
  style.errorCorrectionLevel = design.errorCorrectionLevel || (design.logo ? 'H' : 'M');

  return style;
}

// ─── Content Mapping ─────────────────────────────────────────────────────────

export function mapContentToData(ourType: string, content: Record<string, any>) {
  const qrfyType = mapTypeToQrfy(ourType);

  switch (ourType) {
    case 'website':
    case 'instagram':
    case 'facebook':
      return { type: qrfyType, data: { url: content.url || '' } };

    case 'video':
      return { type: qrfyType, data: { url: content.url || content.fileUrl || '' } };

    case 'bitcoin':
      return {
        type: 'url-static',
        data: { url: content.address ? `bitcoin:${content.address}` : content.url || '' },
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
          organization: content.org || '',
          title: content.title || '',
          website: content.website || '',
          address: content.address || '',
        },
      };

    case 'wifi':
      return {
        type: 'wifi',
        data: {
          ssid: content.ssid || '',
          password: content.password || '',
          encryption: content.encryption || 'WPA',
        },
      };

    case 'email':
      return {
        type: 'email',
        data: {
          email: content.email || '',
          subject: content.subject || '',
          body: content.message || '',
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

    case 'links':
      return {
        type: qrfyType,
        data: {
          title: content.title || '',
          links: Array.isArray(content.links) ? content.links : [],
        },
      };

    case 'business':
      return {
        type: qrfyType,
        data: {
          companyName: content.companyName || '',
          address: content.address || '',
          phone: content.phone || '',
          email: content.email || '',
          website: content.website || '',
          description: content.description || '',
          hours: content.hours || '',
          socialLinks: Array.isArray(content.socialLinks) ? content.socialLinks : [],
        },
      };

    case 'apps':
      return {
        type: qrfyType,
        data: {
          appName: content.appName || '',
          iosUrl: content.iosUrl || '',
          androidUrl: content.androidUrl || '',
          otherUrl: content.otherUrl || '',
        },
      };

    case 'coupon':
      return {
        type: qrfyType,
        data: {
          title: content.title || '',
          description: content.description || '',
          discount: content.discount || '',
          code: content.code || '',
          expiryDate: content.expiryDate || '',
          terms: content.terms || '',
        },
      };

    case 'review':
      return {
        type: qrfyType,
        data: {
          title: content.title || '',
          description: content.description || '',
          ratingType: content.ratingType || 'stars',
        },
      };

    case 'social':
      return {
        type: qrfyType,
        data: {
          platforms: Array.isArray(content.platforms) ? content.platforms : [],
        },
      };

    case 'event':
      return {
        type: qrfyType,
        data: {
          title: content.title || '',
          description: content.description || '',
          startDate: content.startDate || '',
          endDate: content.endDate || '',
          location: content.location || '',
          organizer: content.organizer || '',
        },
      };

    case 'menu':
      return {
        type: qrfyType,
        data: {
          restaurantName: content.restaurantName || '',
          sections: Array.isArray(content.sections) ? content.sections : [],
        },
      };

    case 'pdf':
    case 'mp3':
    case 'images':
      return {
        type: qrfyType,
        data: {
          fileUrl: content.fileUrl || content.url || '',
        },
      };

    default:
      // For all other types, pass content through as data
      return { type: qrfyType, data: content };
  }
}

// ─── API Methods ─────────────────────────────────────────────────────────────

export async function createQR(params: {
  type: string;
  content: Record<string, any>;
  design: Record<string, any>;
  name?: string;
}) {
  const { type: qrfyType, data } = mapContentToData(params.type, params.content);
  const style = mapDesignToStyle(params.design);

  const body = {
    type: qrfyType,
    ...data,
    style,
    name: params.name || 'QR Code',
  };

  const res = await qrfyFetch('/api/public/qrs', {
    method: 'POST',
    body: JSON.stringify([body]), // Bulk endpoint expects array
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QRFY create failed (${res.status}): ${err}`);
  }

  const result = await res.json();
  // Bulk create returns array
  return Array.isArray(result) ? result[0] : result;
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
  const body: Record<string, any> = {};

  if (params.type && params.content) {
    const { type: qrfyType, data } = mapContentToData(params.type, params.content);
    body.type = qrfyType;
    Object.assign(body, data);
  }

  if (params.design) {
    body.style = mapDesignToStyle(params.design);
  }

  if (params.name) {
    body.name = params.name;
  }

  const res = await qrfyFetch(`/api/public/qrs/${qrfyId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QRFY update failed (${res.status}): ${err}`);
  }

  return res.json();
}

export async function deleteQR(qrfyId: number) {
  const res = await qrfyFetch('/api/public/qrs/batch-delete', {
    method: 'POST',
    body: JSON.stringify({ ids: [qrfyId] }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QRFY delete failed (${res.status}): ${err}`);
  }
}

export async function getQRImage(
  qrfyId: number,
  format: 'png' | 'webp' | 'jpeg' = 'png'
): Promise<Buffer> {
  const res = await qrfyFetch(`/api/public/qrs/${qrfyId}/${format}`, {
    method: 'GET',
    headers: { 'API-KEY': QRFY_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`QRFY image download failed (${res.status})`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function createStaticQRImage(
  type: string,
  content: Record<string, any>,
  design: Record<string, any>,
  format: 'png' | 'webp' | 'jpeg' = 'png'
): Promise<Buffer> {
  const { data } = mapContentToData(type, content);
  const style = mapDesignToStyle(design);

  // For preview, use url-static with a placeholder if type isn't natively static
  const staticTypes = ['url-static', 'text', 'wifi', 'email', 'sms', 'vcard'];
  const qrfyType = mapTypeToQrfy(type);
  const useType = staticTypes.includes(qrfyType) ? qrfyType : 'url-static';

  const body: Record<string, any> = {
    type: useType,
    style,
  };

  if (useType === qrfyType) {
    Object.assign(body, data);
  } else {
    // Use a placeholder URL for preview of dynamic types
    body.data = { url: content.url || 'https://qrcraft.com/preview' };
  }

  const res = await qrfyFetch(`/api/public/qrs/${format}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QRFY static image failed (${res.status}): ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function getReport(params: {
  qrfyIds?: number[];
  startDate?: string;
  endDate?: string;
  format?: 'json' | 'csv' | 'xlsx';
}) {
  const searchParams = new URLSearchParams();
  if (params.qrfyIds?.length) {
    searchParams.set('ids', params.qrfyIds.join(','));
  }
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  searchParams.set('format', params.format || 'json');

  const res = await qrfyFetch(`/api/public/qrs/report?${searchParams}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QRFY report failed (${res.status}): ${err}`);
  }

  return res.json();
}

// ─── Analytics Transform ─────────────────────────────────────────────────────

export function transformQrfyReport(report: any) {
  // Transform QRFY report response into our frontend analytics format
  const scansOverTime: { date: string; count: number }[] = [];
  const deviceBreakdown: { name: string; value: number }[] = [];
  const browserBreakdown: { name: string; value: number }[] = [];
  const locationBreakdown: { name: string; value: number }[] = [];
  let totalScans = 0;

  if (report?.scans) {
    totalScans = typeof report.scans === 'number' ? report.scans : 0;
  }

  if (report?.scansByDate && typeof report.scansByDate === 'object') {
    for (const [date, count] of Object.entries(report.scansByDate)) {
      scansOverTime.push({ date, count: Number(count) });
    }
  }

  if (Array.isArray(report?.devices)) {
    for (const d of report.devices) {
      deviceBreakdown.push({ name: d.name || d.device || 'Unknown', value: Number(d.count || d.value || 0) });
    }
  }

  if (Array.isArray(report?.browsers)) {
    for (const b of report.browsers) {
      browserBreakdown.push({ name: b.name || b.browser || 'Unknown', value: Number(b.count || b.value || 0) });
    }
  }

  if (Array.isArray(report?.countries)) {
    for (const l of report.countries) {
      locationBreakdown.push({ name: l.name || l.country || 'Unknown', value: Number(l.count || l.value || 0) });
    }
  }

  return { totalScans, scansOverTime, deviceBreakdown, browserBreakdown, locationBreakdown };
}

// ─── QRFY Shape/Corner/Frame options for UI ──────────────────────────────────

export const QRFY_SHAPE_STYLES = [
  'square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded',
] as const;

export const QRFY_CORNER_SQUARE_STYLES = [
  'default', 'square', 'dot', 'extra-rounded',
] as const;

export const QRFY_CORNER_DOT_STYLES = [
  'default', 'dot', 'square',
] as const;

export const QRFY_FRAME_IDS = Array.from({ length: 31 }, (_, i) => i);

export const QRFY_ERROR_CORRECTION = ['L', 'M', 'Q', 'H'] as const;
