// QR Code Generator — Self-hosted (client-side qr-code-styling)
// Server-side is just stubs, actual QR generation happens in browser
// Original QRFY code preserved below for reference/rollback

// ═══════════════════════════════════════════════════════════════════════════════
// SELF-HOSTED IMPLEMENTATION (Active)
// ═══════════════════════════════════════════════════════════════════════════════

export {
  mapTypeToQrfy,
  mapDesignToStyle,
  mapContentToData,
  createQR,
  updateQR,
  deleteQR,
  getQRImage,
  createStaticQRImage,
  getReport,
  transformQrfyReport,
  STATIC_TYPES,
  QRFY_SHAPE_STYLES,
  QRFY_CORNER_SQUARE_STYLES,
  QRFY_CORNER_DOT_STYLES,
  QRFY_FRAME_IDS,
  QRFY_ERROR_CORRECTION,
} from './qr-generator';

// ═══════════════════════════════════════════════════════════════════════════════
// ORIGINAL QRFY API CODE (Preserved for rollback if needed)
// To restore: delete the export block above and uncomment everything below
// ═══════════════════════════════════════════════════════════════════════════════

/*
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
}*/

/*
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

// ─── Style Mapping ──────────────────────────────────────────────────────────

// QRFY shape styles (19 native + backward-compat aliases)
const SHAPE_STYLE_MAP: Record<string, string> = {
  // 19 native QRFY styles (identity)
  square: 'square',
  rounded: 'rounded',
  dots: 'dots',
  classy: 'classy',
  'classy-rounded': 'classy-rounded',
  'extra-rounded': 'extra-rounded',
  cross: 'cross',
  'cross-rounded': 'cross-rounded',
  diamond: 'diamond',
  'diamond-special': 'diamond-special',
  heart: 'heart',
  'horizontal-rounded': 'horizontal-rounded',
  ribbon: 'ribbon',
  shake: 'shake',
  sparkle: 'sparkle',
  star: 'star',
  'vertical-rounded': 'vertical-rounded',
  x: 'x',
  'x-rounded': 'x-rounded',
  // Backward-compat aliases from old UI
  dot: 'dots',
  'small-square': 'square',
  'tiny-square': 'square',
  'vertical-line': 'vertical-rounded',
  'horizontal-line': 'horizontal-rounded',
  'random-dot': 'dots',
  wave: 'rounded',
  weave: 'cross',
  pentagon: 'sparkle',
  hexagon: 'sparkle',
  'zebra-horizontal': 'horizontal-rounded',
  'zebra-vertical': 'vertical-rounded',
  'blocks-horizontal': 'horizontal-rounded',
  'blocks-vertical': 'vertical-rounded',
};

// QRFY corner square styles (16 native + backward-compat aliases)
const CORNER_SQUARE_MAP: Record<string, string> = {
  // 16 native QRFY styles (identity)
  default: 'default',
  dot: 'dot',
  square: 'square',
  'extra-rounded': 'extra-rounded',
  shape1: 'shape1',
  shape2: 'shape2',
  shape3: 'shape3',
  shape4: 'shape4',
  shape5: 'shape5',
  shape6: 'shape6',
  shape7: 'shape7',
  shape8: 'shape8',
  shape9: 'shape9',
  shape10: 'shape10',
  shape11: 'shape11',
  shape12: 'shape12',
  // Backward-compat aliases
  classy: 'shape1',
  outpoint: 'shape2',
  inpoint: 'shape3',
  'center-circle': 'shape4',
};

// QRFY corner dot styles (17 native + backward-compat aliases)
const CORNER_DOT_MAP: Record<string, string> = {
  // 17 native QRFY styles (identity)
  default: 'default',
  dot: 'dot',
  square: 'square',
  cross: 'cross',
  'cross-rounded': 'cross-rounded',
  diamond: 'diamond',
  dot2: 'dot2',
  dot3: 'dot3',
  dot4: 'dot4',
  heart: 'heart',
  rounded: 'rounded',
  square2: 'square2',
  square3: 'square3',
  star: 'star',
  sun: 'sun',
  x: 'x',
  'x-rounded': 'x-rounded',
  // Backward-compat aliases
  'extra-rounded': 'rounded',
  classy: 'square2',
  outpoint: 'diamond',
  inpoint: 'cross',
  pentagon: 'dot2',
  hexagon: 'dot3',
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

  // Logo - must be a publicly accessible URL (not base64)
  // QRFY downloads the image from this URL server-side
  if (design.logo && !design.logo.startsWith('data:')) {
    style.image = toAbsoluteUrl(design.logo);
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

  // Frame — only include if frameId is a valid QRFY frame (0-30)
  // frameId -1 means "None" (no frame)
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

  // Error correction
  style.errorCorrectionLevel = design.errorCorrectionLevel || (design.logo ? 'H' : 'M');

  return style;
}

// ─── Content Mapping ─────────────────────────────────────────────────────────

// Helper: build a full URL for uploaded files (QRFY needs absolute URLs)
function toAbsoluteUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // data: URIs (base64 images, etc.) — return as-is; QRFY may not support them
  // but mangling them with a base URL is worse
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  // Relative paths like /uploads/xxx.pdf → full URL
  const base = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Default landing-page design colors used by dynamic QRFY types
const DEFAULT_DESIGN_2 = { primary: '#7C3AED', secondary: '#FFFFFF' };
const DEFAULT_DESIGN_3 = { primary: '#7C3AED', secondary: '#FFFFFF', tertiary: '#F3F4F6' };
const DEFAULT_DESIGN_COLOR = { color: '#7C3AED' };

export function mapContentToData(ourType: string, content: Record<string, any>) {
  const qrfyType = mapTypeToQrfy(ourType);
  const design2 = content.pageDesign || DEFAULT_DESIGN_2;
  const design3 = content.pageDesign || DEFAULT_DESIGN_3;
  const designC = content.pageDesign || DEFAULT_DESIGN_COLOR;

  switch (ourType) {
    // ── Static / simple URL types ──────────────────────────────────────
    case 'website': {
      // Support multiple websites; send first URL as primary
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

    case 'calendar': {
      const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT'];
      if (content.eventTitle) lines.push(`SUMMARY:${content.eventTitle}`);
      if (content.description) lines.push(`DESCRIPTION:${content.description}`);
      if (content.location) lines.push(`LOCATION:${content.location}`);
      if (content.startDate) lines.push(`DTSTART:${content.startDate.replace(/[-:T]/g, '').slice(0, 15)}`);
      if (content.endDate) lines.push(`DTEND:${content.endDate.replace(/[-:T]/g, '').slice(0, 15)}`);
      if (content.allDay) { lines.push(`X-MICROSOFT-CDO-ALLDAYEVENT:TRUE`); }
      if (content.organizerName && content.organizerEmail) {
        lines.push(`ORGANIZER;CN=${content.organizerName}:mailto:${content.organizerEmail}`);
      }
      if (content.reminder && content.reminder !== 'none') {
        lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Reminder');
        const durMap: Record<string, string> = { '5m': '-PT5M', '15m': '-PT15M', '30m': '-PT30M', '1h': '-PT1H', '1d': '-P1D' };
        lines.push(`TRIGGER:${durMap[content.reminder] || '-PT15M'}`);
        lines.push('END:VALARM');
      }
      lines.push('END:VEVENT', 'END:VCALENDAR');
      return { type: 'url-static', data: { url: `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}` } };
    }

    case 'text':
      return { type: 'text', data: { text: content.text || content.url || '' } };

    // ── vCard ──────────────────────────────────────────────────────────
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
          note: content.note || '',
          ...(content.photo ? { photo: toAbsoluteUrl(content.photo) } : {}),
          ...(content.mobilePhone ? { mobilePhone: content.mobilePhone } : {}),
          ...(content.workPhone ? { workPhone: content.workPhone } : {}),
          ...(content.fax ? { fax: content.fax } : {}),
          ...(content.pageDesign ? { design: { primary: content.pageDesign.primary || '#7C3AED', secondary: content.pageDesign.secondary || '#FFFFFF' } } : {}),
          ...(Array.isArray(content.socials) && content.socials.length ? {
            socials: content.socials.filter((s: any) => s.platform && s.url).map((s: any) => ({ id: s.platform, value: s.url })),
          } : {}),
        },
      };

    // ── WiFi ───────────────────────────────────────────────────────────
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

    // ── Email ──────────────────────────────────────────────────────────
    case 'email':
      return {
        type: 'email',
        data: {
          email: content.email || '',
          subject: content.subject || '',
          body: content.message || content.body || '',
        },
      };

    // ── SMS ────────────────────────────────────────────────────────────
    case 'sms':
      return {
        type: 'sms',
        data: {
          phone: content.phone || '',
          message: content.message || '',
        },
      };

    // ── WhatsApp ───────────────────────────────────────────────────────
    case 'whatsapp':
      return {
        type: 'whatsapp',
        data: {
          phone: content.phone || '',
          message: content.message || '',
        },
      };

    // ── PDF ────────────────────────────────────────────────────────────
    case 'pdf': {
      const pdfs: { file: string; name?: string }[] = [];
      if (content.fileUrl) {
        pdfs.push({ file: toAbsoluteUrl(content.fileUrl), name: content.fileName || 'document.pdf' });
      }
      if (Array.isArray(content.pdfs)) {
        for (const p of content.pdfs) {
          if (p.file || p.fileUrl) pdfs.push({ file: toAbsoluteUrl(p.file || p.fileUrl), name: p.name });
        }
      }
      return {
        type: 'pdf',
        data: {
          design: { primary: design2.primary, secondary: design2.secondary },
          pdfs,
          title: content.title || '',
          description: content.description || '',
          button: content.buttonText || '',
          ...(content.company ? { company: content.company } : {}),
          ...(content.website ? { website: content.website } : {}),
          ...(typeof content.template === 'number' ? { template: content.template } : {}),
          ...(content.headerColor ? { headerColor: content.headerColor } : {}),
          ...(content.titleFont ? { titleFont: content.titleFont } : {}),
          ...(content.textFont ? { textFont: content.textFont } : {}),
          ...((content.welcomeImage || content.favicon || content.welcomeTimer != null) ? {
            welcomeScreen: {
              ...(content.welcomeImage ? { image: toAbsoluteUrl(content.welcomeImage) } : {}),
              ...(content.favicon ? { favicon: toAbsoluteUrl(content.favicon) } : {}),
              ...(content.welcomeTimer != null ? { timer: content.welcomeTimer } : {}),
            },
          } : {}),
        },
      };
    }

    // ── Video ──────────────────────────────────────────────────────────
    case 'video': {
      const videos: string[] = [];
      if (content.fileUrl) videos.push(toAbsoluteUrl(content.fileUrl));
      if (content.url) videos.push(content.url);
      if (Array.isArray(content.videos)) {
        for (const v of content.videos) videos.push(typeof v === 'string' ? v : v.url || v.file || '');
      }
      return {
        type: 'video',
        data: {
          design: { color: designC.color || designC.primary || '#7C3AED' },
          videos: videos.filter(Boolean),
          title: content.title || '',
          description: content.description || '',
          autoplay: content.autoplay ?? false,
        },
      };
    }

    // ── MP3 ────────────────────────────────────────────────────────────
    case 'mp3':
      return {
        type: 'mp3',
        data: {
          design: { primary: design2.primary, secondary: design2.secondary },
          mp3: toAbsoluteUrl(content.fileUrl || content.url || ''),
          website: content.website || '',
          title: content.title || '',
          description: content.description || '',
        },
      };

    // ── Images ─────────────────────────────────────────────────────────
    case 'images': {
      let images: string[] = [];
      if (content.fileUrl) images.push(toAbsoluteUrl(content.fileUrl));
      if (Array.isArray(content.images)) {
        images = content.images.map((img: any) => toAbsoluteUrl(typeof img === 'string' ? img : img.url || img.file || ''));
      }
      return {
        type: 'images',
        data: {
          design: { color: designC.color || designC.primary || '#7C3AED' },
          images: images.filter(Boolean),
          title: content.title || '',
          description: content.description || '',
        },
      };
    }

    // ── Link List ──────────────────────────────────────────────────────
    case 'links': {
      const links = Array.isArray(content.links)
        ? content.links.map((l: any) => ({ url: l.url || '', text: l.text || l.label || '' }))
        : [];
      const linkSocials = Array.isArray(content.socials)
        ? content.socials
            .filter((s: any) => s.platform && s.url)
            .map((s: any) => ({ id: s.platform, value: s.url }))
        : [];
      return {
        type: 'link-list',
        data: {
          design: { primary: design3.primary, secondary: design3.secondary, tertiary: design3.tertiary || '#F3F4F6' },
          links,
          title: content.title || '',
          description: content.description || '',
          ...(content.logo ? { logo: toAbsoluteUrl(content.logo) } : {}),
          ...(linkSocials.length ? { socials: linkSocials } : {}),
        },
      };
    }

    // ── Business ───────────────────────────────────────────────────────
    case 'business': {
      const socials = Array.isArray(content.socialLinks)
        ? content.socialLinks
            .filter((s: any) => s.platform && s.url)
            .map((s: any) => ({ id: s.platform, value: s.url }))
        : [];
      // Use explicit CTA button if provided, otherwise fall back to website
      const buttonText = content.buttonText || (content.website ? 'Visit Website' : '');
      const buttonUrl = content.buttonUrl || content.website || '';
      return {
        type: 'business',
        data: {
          design: { primary: design2.primary, secondary: design2.secondary },
          title: content.title || content.companyName || '',
          company: content.companyName || '',
          address: {
            street: content.street || content.address || '',
            city: content.city || '',
            state: content.state || '',
            zip: content.zip || '',
            country: content.country || '',
          },
          description: content.description || '',
          ...(content.phone ? { phone: content.phone } : {}),
          ...(content.email ? { email: content.email } : {}),
          ...(content.cover ? { cover: toAbsoluteUrl(content.cover) } : {}),
          ...(buttonUrl ? { button: { text: buttonText || 'Visit Website', url: buttonUrl } } : {}),
          ...(socials.length ? { socials } : {}),
          ...(Array.isArray(content.schedule) && content.schedule.length ? { schedule: content.schedule } : {}),
        },
      };
    }

    // ── Menu ───────────────────────────────────────────────────────────
    case 'menu': {
      const sections = Array.isArray(content.sections) ? content.sections : [];
      return {
        type: 'menu',
        data: {
          design: { primary: design2.primary, secondary: design2.secondary },
          sections,
          schedule: content.schedule || {},
          ...(content.restaurantName ? { cover: content.restaurantName } : {}),
        },
      };
    }

    // ── App ────────────────────────────────────────────────────────────
    case 'apps':
      return {
        type: 'app',
        data: {
          design: { primary: design2.primary, secondary: design2.secondary },
          name: content.appName || content.name || '',
          website: content.website || content.otherUrl || '',
          description: content.description || '',
          apps: {
            ...(content.iosUrl ? { apple: content.iosUrl } : {}),
            ...(content.androidUrl ? { google: content.androidUrl } : {}),
          },
          ...(content.logo ? { logo: toAbsoluteUrl(content.logo) } : {}),
        },
      };

    // ── Coupon ─────────────────────────────────────────────────────────
    case 'coupon': {
      let validUntil = 0;
      if (content.expiryDate) {
        validUntil = new Date(content.expiryDate).getTime();
      }
      return {
        type: 'coupon',
        data: {
          design: { primary: design2.primary, secondary: design2.secondary },
          title: content.title || '',
          description: content.description || '',
          validUntil: validUntil || (Date.now() + 30 * 24 * 60 * 60 * 1000),
          badge: content.badge || content.discount || '',
          ...(content.code ? { code: content.code } : {}),
          ...(content.terms ? { terms: content.terms } : {}),
          ...(content.buttonUrl ? { button: { text: content.buttonText || 'Redeem', url: content.buttonUrl } } : {}),
        },
      };
    }

    // ── Review / Feedback ──────────────────────────────────────────────
    case 'review':
      return {
        type: 'feedback',
        data: {
          design: { color: designC.color || designC.primary || '#7C3AED' },
          name: content.title || content.name || 'Feedback',
          categories: Array.isArray(content.categories) ? content.categories : [],
          title: content.title || '',
          description: content.description || '',
          email: '',
          ...(content.website ? { website: content.website } : {}),
          ...(Array.isArray(content.reviewLinks) && content.reviewLinks.length ? {
            reviewLinks: content.reviewLinks.filter((l: any) => l.platform && l.url).map((l: any) => ({ platform: l.platform, url: l.url })),
          } : {}),
        },
      };

    // ── Social ─────────────────────────────────────────────────────────
    case 'social': {
      const socials = Array.isArray(content.platforms)
        ? content.platforms
            .filter((s: any) => s.platform && s.url)
            .map((s: any) => ({ id: s.platform, value: s.url }))
        : [];
      return {
        type: 'social',
        data: {
          design: { primary: design3.primary, secondary: design3.secondary, tertiary: design3.tertiary || '#F3F4F6' },
          title: content.title || '',
          description: content.description || '',
          ...(socials.length ? { socials } : {}),
          ...(content.logo ? { logo: toAbsoluteUrl(content.logo) } : {}),
        },
      };
    }

    // ── Event ──────────────────────────────────────────────────────────
    case 'event': {
      let from = 0, to = 0;
      if (content.startDate) from = new Date(content.startDate).getTime();
      if (content.endDate) to = new Date(content.endDate).getTime();
      return {
        type: 'event',
        data: {
          design: { primary: design2.primary, secondary: design2.secondary },
          title: content.title || '',
          description: content.description || '',
          eventDate: {
            from: from || Date.now(),
            to: to || (Date.now() + 3600000),
          },
          ...(content.location ? { location: content.location } : {}),
          ...(content.organizer ? { organizer: content.organizer } : {}),
          ...(content.buttonUrl ? { button: { text: content.buttonText || 'RSVP', url: content.buttonUrl } } : {}),
        },
      };
    }

    // ── Playlist ────────────────────────────────────────────────────────
    case 'playlist': {
      const platformLinks = Array.isArray(content.platformLinks)
        ? content.platformLinks
            .filter((l: any) => l.platform && l.url)
            .map((l: any) => ({ url: l.url || '', text: l.platform || '' }))
        : [];
      return {
        type: 'link-list',
        data: {
          design: { primary: design3.primary, secondary: design3.secondary, tertiary: design3.tertiary || '#F3F4F6' },
          links: platformLinks,
          title: content.title || '',
          description: content.description || '',
          ...(content.logo ? { logo: toAbsoluteUrl(content.logo) } : {}),
        },
      };
    }

    // ── Product ─────────────────────────────────────────────────────────
    case 'product': {
      const productImages = Array.isArray(content.images)
        ? content.images.filter((img: any) => img.file || img.url).map((img: any) => toAbsoluteUrl(img.file || img.url || ''))
        : [];
      return {
        type: 'business',
        data: {
          design: { primary: design2.primary, secondary: design2.secondary },
          title: content.productName || '',
          company: content.productName || '',
          description: content.description || '',
          ...(productImages.length ? { cover: productImages[0] } : {}),
          ...(content.buyUrl ? { button: { text: content.buyButtonText || 'Buy Now', url: content.buyUrl } } : {}),
        },
      };
    }

    // ── Feedback / Survey ───────────────────────────────────────────────
    case 'feedback': {
      const categories = Array.isArray(content.questions)
        ? content.questions.map((q: any) => ({
            name: q.text || '',
            type: q.type || 'rating',
            ...(q.choices ? { choices: q.choices } : {}),
          }))
        : [];
      return {
        type: 'feedback',
        data: {
          design: { color: designC.color || designC.primary || '#7C3AED' },
          name: content.title || 'Feedback',
          title: content.title || '',
          description: content.description || '',
          categories,
          email: '',
        },
      };
    }

    default:
      // For all other types, pass content through as data
      return { type: qrfyType, data: content };
  }
}

// ─── API Methods ─────────────────────────────────────────────────────────────

// Static types whose content should be mapped directly for QRFY (embed data in QR)
// Exported so other modules use the same list
export const STATIC_TYPES = ['text', 'wifi', 'email', 'sms', 'bitcoin', 'phone', 'calendar', 'vcard'];

export async function createQR(params: {
  type: string;
  content: Record<string, any>;
  design: Record<string, any>;
  name?: string;
}) {
  if (!QRFY_API_KEY) {
    throw new Error('QRFY_API_KEY is not configured');
  }

  const style = mapDesignToStyle(params.design);

  let qrfyType: string;
  let data: Record<string, any>;

  if (STATIC_TYPES.includes(params.type)) {
    // Static types — map full content to QRFY format
    const mapped = mapContentToData(params.type, params.content);
    qrfyType = mapped.type;
    data = mapped.data;
  } else {
    // Dynamic types — create a simple URL QR that points to our redirect
    // Our landing page (/qr/[slug]) handles the actual content display
    // This avoids sending complex data (images, PDFs, etc.) to QRFY
    qrfyType = 'url';
    data = { url: params.content.url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online'}/preview` };
  }

  const qr = {
    type: qrfyType,
    data,
    style,
    name: params.name || 'QR Code',
  };

  console.log('[QRFY createQR] Sending:', JSON.stringify({ type: qrfyType, dataKeys: Object.keys(data || {}), name: qr.name }).slice(0, 500));

  const res = await qrfyFetch('/api/public/qrs', {
    method: 'POST',
    body: JSON.stringify({ qrs: [qr] }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[QRFY createQR] Error response:', res.status, err.slice(0, 1000));
    throw new Error(`QRFY create failed (${res.status}): ${err}`);
  }

  console.log('[QRFY createQR] Success:', res.status);

  const result = await res.json();
  // Bulk create returns { ids: [...] }
  if (result?.ids) return { id: result.ids[0] };
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
  if (!QRFY_API_KEY) {
    throw new Error('QRFY_API_KEY is not configured');
  }

  const body: Record<string, any> = {};

  if (params.type && params.content) {
    if (STATIC_TYPES.includes(params.type)) {
      const { type: qrfyType, data } = mapContentToData(params.type, params.content);
      body.type = qrfyType;
      body.data = data;
    } else {
      // Dynamic types — update with URL type pointing to our redirect
      body.type = 'url';
      body.data = { url: params.content.url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online'}/preview` };
    }
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
  if (!QRFY_API_KEY) {
    throw new Error('QRFY_API_KEY is not configured');
  }

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
    // Static type — map content to QRFY data format
    try {
      const { data } = mapContentToData(type, content);
      body.data = data;
    } catch {
      // If mapping fails, fall back to URL-static with text/url
      body.type = 'url-static';
      body.data = { url: content.url || content.text || 'https://example.com' };
    }
  } else {
    // Dynamic type — encode the redirect URL (or content URL) into the QR
    body.data = { url: content.url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online'}/preview` };
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

  if (report?.scansByDate && typeof report.scansByDate === 'object') {
    for (const [date, count] of Object.entries(report.scansByDate)) {
      scansOverTime.push({ date, count: Number(count) });
    }
  }

  if (report?.uniqueScansByDate && typeof report.uniqueScansByDate === 'object') {
    for (const [date, count] of Object.entries(report.uniqueScansByDate)) {
      uniqueScansOverTime.push({ date, count: Number(count) });
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

  if (Array.isArray(report?.os)) {
    for (const o of report.os) {
      osBreakdown.push({ name: o.name || o.os || 'Unknown', value: Number(o.count || o.value || 0) });
    }
  }

  if (Array.isArray(report?.countries)) {
    for (const l of report.countries) {
      locationBreakdown.push({ name: l.name || l.country || 'Unknown', value: Number(l.count || l.value || 0) });
    }
  }

  if (Array.isArray(report?.cities)) {
    for (const c of report.cities) {
      cityBreakdown.push({ name: c.name || c.city || 'Unknown', value: Number(c.count || c.value || 0) });
    }
  }

  return {
    totalScans, uniqueScans, scansOverTime, uniqueScansOverTime,
    deviceBreakdown, browserBreakdown, osBreakdown, locationBreakdown, cityBreakdown,
  };
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
*/
