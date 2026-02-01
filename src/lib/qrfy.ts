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

// ─── Style Mapping ───────────────────────────────────────────────────────────

// Map our dot pattern names → QRFY shape.style names
const SHAPE_STYLE_MAP: Record<string, string> = {
  square: 'square',
  dot: 'dots',
  rounded: 'rounded',
  'extra-rounded': 'extra-rounded',
  classy: 'classy',
  'classy-rounded': 'classy-rounded',
  diamond: 'diamond',
  'small-square': 'square',
  'tiny-square': 'square',
  'vertical-line': 'vertical-rounded',
  'horizontal-line': 'horizontal-rounded',
  'random-dot': 'dots',
  star: 'star',
  heart: 'heart',
  wave: 'rounded',
  weave: 'cross',
  pentagon: 'sparkle',
  hexagon: 'sparkle',
  'zebra-horizontal': 'horizontal-rounded',
  'zebra-vertical': 'vertical-rounded',
  'blocks-horizontal': 'horizontal-rounded',
  'blocks-vertical': 'vertical-rounded',
};

// Map our corner square styles → QRFY corners.squareStyle
const CORNER_SQUARE_MAP: Record<string, string> = {
  square: 'square',
  dot: 'dot',
  'extra-rounded': 'extra-rounded',
  classy: 'shape1',
  outpoint: 'shape2',
  inpoint: 'shape3',
  'center-circle': 'shape4',
};

// Map our corner dot styles → QRFY corners.dotStyle
const CORNER_DOT_MAP: Record<string, string> = {
  square: 'square',
  dot: 'dot',
  'extra-rounded': 'rounded',
  classy: 'square2',
  heart: 'heart',
  outpoint: 'diamond',
  inpoint: 'cross',
  star: 'star',
  pentagon: 'dot2',
  hexagon: 'dot3',
  diamond: 'diamond',
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

  // Frame
  if (design.frameStyle && design.frameStyle !== 'none') {
    // Map our frame IDs to QRFY frame IDs (0-30)
    const frameIdMap: Record<string, number> = {
      'sq-bottom': 1, 'sq-top': 2, 'sq-both': 3,
      'rd-bottom': 4, 'rd-top': 5, 'rd-both': 6,
      'pill-bottom': 7, 'pill-both': 8,
      'dash-sq': 9, 'dash-rd': 10,
      'dot-sq': 11, 'dot-rd': 12,
      'dbl-sq': 13, 'dbl-rd': 14,
      'sq-notext': 15, 'rd-notext': 16,
      clipboard: 17, coffee: 18, cloud: 19, gift: 20,
      bag: 21, envelope: 22, badge: 23, ticket: 24,
      banner: 25, monitor: 26,
    };
    style.frame = {
      id: frameIdMap[design.frameStyle] ?? 0,
      color: design.frameColor || '#000000',
      text: (design.frameText || 'Scan me!').slice(0, 30),
      fontSize: 42,
      textColor: design.frameTextColor || '#FFFFFF',
      backgroundColor: design.frameColor || '#000000',
    };
  } else {
    style.frame = { id: 0 };
  }

  // Error correction
  style.errorCorrectionLevel = design.logo ? 'H' : 'M';

  return style;
}

// ─── Content Mapping ─────────────────────────────────────────────────────────

export function mapContentToData(ourType: string, content: Record<string, any>) {
  const qrfyType = mapTypeToQrfy(ourType);

  switch (ourType) {
    case 'website':
    case 'instagram':
    case 'facebook':
    case 'video':
      return { type: qrfyType, data: { url: content.url || '' } };

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

// ─── QRFY Shape/Corner/Frame options for UI ──────────────────────────────────

export const QRFY_SHAPE_STYLES = [
  'square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded',
  'cross', 'cross-rounded', 'diamond', 'diamond-special', 'heart',
  'horizontal-rounded', 'ribbon', 'shake', 'sparkle', 'star',
  'vertical-rounded', 'x', 'x-rounded',
] as const;

export const QRFY_CORNER_SQUARE_STYLES = [
  'default', 'dot', 'square', 'extra-rounded',
  'shape1', 'shape2', 'shape3', 'shape4', 'shape5', 'shape6',
  'shape7', 'shape8', 'shape9', 'shape10', 'shape11', 'shape12',
] as const;

export const QRFY_CORNER_DOT_STYLES = [
  'default', 'dot', 'square', 'cross', 'cross-rounded', 'diamond',
  'dot2', 'dot3', 'dot4', 'heart', 'rounded', 'square2', 'square3',
  'star', 'sun', 'x', 'x-rounded',
] as const;

export const QRFY_FRAME_IDS = Array.from({ length: 31 }, (_, i) => i);

export const QRFY_ERROR_CORRECTION = ['L', 'M', 'Q', 'H'] as const;
