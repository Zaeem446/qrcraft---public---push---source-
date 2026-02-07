// Self-hosted QR Generator using mobstac-awesome-qr
// Replaces QRFY API with local generation

// Dynamic imports to handle Vercel serverless environment
let QRCodeBuilder: any;
let CanvasType: any;
let DataPattern: any;
let EyeBallShape: any;
let EyeFrameShape: any;
let GradientType: any;
let QRCodeFrame: any;
let QRErrorCorrectLevel: any;
let sharp: any;

// Flag to track if mobstac-awesome-qr is available
let mobstacAvailable = false;

async function initMobstac() {
  if (mobstacAvailable) return true;

  try {
    const mobstac = await import('mobstac-awesome-qr');
    const enums = await import('mobstac-awesome-qr/lib/Enums');

    QRCodeBuilder = mobstac.QRCodeBuilder;
    CanvasType = enums.CanvasType;
    DataPattern = enums.DataPattern;
    EyeBallShape = enums.EyeBallShape;
    EyeFrameShape = enums.EyeFrameShape;
    GradientType = enums.GradientType;
    QRCodeFrame = enums.QRCodeFrame;
    QRErrorCorrectLevel = enums.QRErrorCorrectLevel;

    const sharpModule = await import('sharp');
    sharp = sharpModule.default;

    mobstacAvailable = true;
    return true;
  } catch (err) {
    console.warn('[QR Generator] mobstac-awesome-qr not available:', err);
    mobstacAvailable = false;
    return false;
  }
}

// ─── Type Mapping ────────────────────────────────────────────────────────────
// Keep same interface as before for compatibility

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

// ─── Style Mapping: QRFY → mobstac-awesome-qr ─────────────────────────────────

// Use string keys that map to enum property names - resolved at runtime
const SHAPE_TO_PATTERN_NAME: Record<string, string> = {
  square: 'SQUARE',
  dots: 'CIRCLE',
  dot: 'CIRCLE',
  rounded: 'SMOOTH_ROUND',
  'extra-rounded': 'SMOOTH_ROUND',
  classy: 'KITE',
  'classy-rounded': 'KITE',
  cross: 'THIN_SQUARE',
  'cross-rounded': 'THIN_SQUARE',
  diamond: 'LEFT_DIAMOND',
  'diamond-special': 'RIGHT_DIAMOND',
  heart: 'CIRCLE',
  'horizontal-rounded': 'SMOOTH_SHARP',
  ribbon: 'SMOOTH_SHARP',
  shake: 'CIRCLE',
  sparkle: 'CIRCLE',
  star: 'KITE',
  'vertical-rounded': 'SMOOTH_SHARP',
  x: 'THIN_SQUARE',
  'x-rounded': 'THIN_SQUARE',
  'small-square': 'SQUARE',
  'tiny-square': 'THIN_SQUARE',
  'vertical-line': 'SMOOTH_SHARP',
  'horizontal-line': 'SMOOTH_SHARP',
  'random-dot': 'CIRCLE',
  wave: 'SMOOTH_ROUND',
  weave: 'THIN_SQUARE',
  pentagon: 'KITE',
  hexagon: 'KITE',
  'zebra-horizontal': 'SMOOTH_SHARP',
  'zebra-vertical': 'SMOOTH_SHARP',
  'blocks-horizontal': 'THIN_SQUARE',
  'blocks-vertical': 'THIN_SQUARE',
};

const CORNER_SQUARE_TO_FRAME_NAME: Record<string, string> = {
  default: 'SQUARE',
  dot: 'CIRCLE',
  square: 'SQUARE',
  'extra-rounded': 'ROUNDED',
  shape1: 'ROUNDED',
  shape2: 'LEFT_LEAF',
  shape3: 'RIGHT_LEAF',
  shape4: 'CIRCLE',
  shape5: 'ROUNDED',
  shape6: 'LEFT_LEAF',
  shape7: 'RIGHT_LEAF',
  shape8: 'CIRCLE',
  shape9: 'ROUNDED',
  shape10: 'LEFT_LEAF',
  shape11: 'RIGHT_LEAF',
  shape12: 'ROUNDED',
  classy: 'ROUNDED',
  outpoint: 'LEFT_LEAF',
  inpoint: 'RIGHT_LEAF',
  'center-circle': 'CIRCLE',
};

const CORNER_DOT_TO_BALL_NAME: Record<string, string> = {
  default: 'SQUARE',
  dot: 'CIRCLE',
  square: 'SQUARE',
  cross: 'SQUARE',
  'cross-rounded': 'ROUNDED',
  diamond: 'LEFT_DIAMOND',
  dot2: 'CIRCLE',
  dot3: 'CIRCLE',
  dot4: 'CIRCLE',
  heart: 'CIRCLE',
  rounded: 'ROUNDED',
  square2: 'SQUARE',
  square3: 'SQUARE',
  star: 'LEFT_DIAMOND',
  sun: 'RIGHT_DIAMOND',
  x: 'LEFT_DIAMOND',
  'x-rounded': 'RIGHT_DIAMOND',
  'extra-rounded': 'ROUNDED',
  classy: 'ROUNDED',
  outpoint: 'LEFT_DIAMOND',
  inpoint: 'RIGHT_DIAMOND',
  pentagon: 'LEFT_LEAF',
  hexagon: 'RIGHT_LEAF',
};

// Frame ID to frame style name - resolved at runtime
const FRAME_ID_TO_STYLE_NAME: Record<number, string> = {
  0: 'NONE',
  1: 'BOX_BOTTOM',
  2: 'BOX_TOP',
  3: 'BANNER_BOTTOM',
  4: 'BANNER_TOP',
  5: 'BALLOON_BOTTOM',
  6: 'BALLOON_TOP',
  7: 'CIRCULAR',
  8: 'TEXT_ONLY',
  9: 'FOCUS',
  10: 'BOX_BOTTOM',
  11: 'BOX_TOP',
  12: 'BANNER_BOTTOM',
  13: 'BANNER_TOP',
  14: 'BALLOON_BOTTOM',
  15: 'BALLOON_TOP',
  16: 'CIRCULAR',
  17: 'TEXT_ONLY',
  18: 'FOCUS',
  19: 'BOX_BOTTOM',
  20: 'BOX_TOP',
  21: 'BANNER_BOTTOM',
  22: 'BANNER_TOP',
  23: 'BALLOON_BOTTOM',
  24: 'BALLOON_TOP',
  25: 'CIRCULAR',
  26: 'TEXT_ONLY',
  27: 'FOCUS',
  28: 'BOX_BOTTOM',
  29: 'BOX_TOP',
  30: 'BANNER_BOTTOM',
};

// Helper functions to resolve enum values at runtime
function getDataPattern(styleName: string): any {
  if (!DataPattern) return 0;
  const patternName = SHAPE_TO_PATTERN_NAME[styleName] || 'SQUARE';
  return DataPattern[patternName] ?? DataPattern.SQUARE ?? 0;
}

function getEyeFrameShape(styleName: string): any {
  if (!EyeFrameShape) return 0;
  const shapeName = CORNER_SQUARE_TO_FRAME_NAME[styleName] || 'SQUARE';
  return EyeFrameShape[shapeName] ?? EyeFrameShape.SQUARE ?? 0;
}

function getEyeBallShape(styleName: string): any {
  if (!EyeBallShape) return 0;
  const ballName = CORNER_DOT_TO_BALL_NAME[styleName] || 'SQUARE';
  return EyeBallShape[ballName] ?? EyeBallShape.SQUARE ?? 0;
}

function getQRCodeFrame(frameId: number): any {
  if (!QRCodeFrame) return 0;
  const frameName = FRAME_ID_TO_STYLE_NAME[frameId] || 'NONE';
  return QRCodeFrame[frameName] ?? QRCodeFrame.NONE ?? 0;
}

// ─── Design Mapping ──────────────────────────────────────────────────────────

function toAbsoluteUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  const base = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function mapDesignToStyle(design: Record<string, any>) {
  // Keep same interface for compatibility with existing code
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
        },
      };
    }

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

    case 'business': {
      const socials = Array.isArray(content.socialLinks)
        ? content.socialLinks
            .filter((s: any) => s.platform && s.url)
            .map((s: any) => ({ id: s.platform, value: s.url }))
        : [];
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
      return { type: qrfyType, data: content };
  }
}

// ─── QR Content Generation ───────────────────────────────────────────────────

function generateQRContent(type: string, content: Record<string, any>): string {
  switch (type) {
    case 'website':
    case 'instagram':
    case 'facebook':
    case 'video':
      return content.url || 'https://example.com';

    case 'bitcoin':
      return content.address ? `bitcoin:${content.address}` : (content.url || 'bitcoin:');

    case 'phone':
      return `tel:${(content.phone || '').replace(/\s/g, '')}`;

    case 'text':
      return content.text || content.url || 'Sample text';

    case 'vcard': {
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${content.lastName || ''};${content.firstName || ''}`,
        `FN:${[content.firstName, content.lastName].filter(Boolean).join(' ') || 'Name'}`,
      ];
      if (content.company) lines.push(`ORG:${content.company}`);
      if (content.title) lines.push(`TITLE:${content.title}`);
      if (content.phone) lines.push(`TEL:${content.phone}`);
      if (content.email) lines.push(`EMAIL:${content.email}`);
      if (content.website) lines.push(`URL:${content.website}`);
      if (content.street || content.city) {
        lines.push(`ADR:;;${content.street || ''};${content.city || ''};${content.state || ''};${content.zip || ''};${content.country || ''}`);
      }
      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'wifi':
      return `WIFI:T:${content.authType || content.encryption || 'WPA'};S:${content.ssid || ''};P:${content.password || ''};;`;

    case 'email':
      return `mailto:${content.email || ''}?subject=${encodeURIComponent(content.subject || '')}&body=${encodeURIComponent(content.message || content.body || '')}`;

    case 'sms':
      return `sms:${content.phone || ''}?body=${encodeURIComponent(content.message || '')}`;

    case 'whatsapp':
      return `https://wa.me/${(content.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(content.message || '')}`;

    case 'calendar': {
      const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT'];
      if (content.eventTitle) lines.push(`SUMMARY:${content.eventTitle}`);
      if (content.description) lines.push(`DESCRIPTION:${content.description}`);
      if (content.location) lines.push(`LOCATION:${content.location}`);
      if (content.startDate) lines.push(`DTSTART:${content.startDate.replace(/[-:T]/g, '').slice(0, 15)}`);
      if (content.endDate) lines.push(`DTEND:${content.endDate.replace(/[-:T]/g, '').slice(0, 15)}`);
      lines.push('END:VEVENT', 'END:VCALENDAR');
      return lines.join('\r\n');
    }

    default:
      // For dynamic types, use the redirect URL
      return content.url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online'}/preview`;
  }
}

// ─── Error Correction Mapping ────────────────────────────────────────────────

function mapErrorCorrectionValue(level: string): number {
  switch (level?.toUpperCase()) {
    case 'L': return 1;
    case 'M': return 0;
    case 'Q': return 3;
    case 'H': return 2;
    default: return 0;
  }
}

// ─── Main QR Image Generation ────────────────────────────────────────────────

export async function createStaticQRImage(
  type: string,
  content: Record<string, any>,
  design: Record<string, any>,
  format: 'png' | 'webp' | 'jpeg' | 'svg' = 'png'
): Promise<Buffer> {
  // Try to initialize mobstac-awesome-qr
  const available = await initMobstac();

  if (!available) {
    console.warn('[QR Generator] mobstac not available, throwing to use fallback');
    throw new Error('mobstac-awesome-qr not available in this environment');
  }

  const qrContent = generateQRContent(type, content);

  // Map design settings to mobstac-awesome-qr config using runtime resolution
  const dataPattern = getDataPattern(design.dotsType || 'square');
  const eyeFrameShape = getEyeFrameShape(design.cornersSquareType || 'default');
  const eyeBallShape = getEyeBallShape(design.cornersDotType || 'default');

  const frameId = typeof design.frameId === 'number' ? design.frameId : -1;
  const frameStyle = frameId >= 0 ? getQRCodeFrame(frameId) : (QRCodeFrame?.NONE ?? 0);

  // Determine gradient type - resolve at runtime
  let gradientType = GradientType?.NONE ?? 0;
  if (design.patternGradient && design.patternColor2) {
    gradientType = GradientType?.LINEAR ?? 1;
  }

  const config: Record<string, any> = {
    text: qrContent,
    size: 1024,
    margin: 80,

    // Colors
    colorDark: design.dotsColor || '#000000',
    colorLight: design.patternColor2 || design.dotsColor || '#000000',
    backgroundColor: design.bgTransparent ? 'transparent' : (design.backgroundColor || '#FFFFFF'),

    // Patterns
    dataPattern,
    eyeFrameShape,
    eyeBallShape,
    eyeFrameColor: design.cornersSquareColor || design.dotsColor || '#000000',
    eyeBallColor: design.cornersDotColor || design.dotsColor || '#000000',

    // Frame
    frameStyle,
    frameColor: design.frameColor || '#7C3AED',
    frameText: (design.frameText || 'Scan me!').slice(0, 30),
    frameTextColor: design.frameTextColor || '#FFFFFF',

    // Gradient
    gradientType,

    // Error correction
    correctLevel: mapErrorCorrectionValue(design.errorCorrectionLevel || (design.logo ? 'H' : 'M')),

    // Logo
    logoBackground: true,
    logoScale: 0.25,
    logoMargin: 10,
    dotScale: 1,
    maskedDots: false,
    isVCard: type === 'vcard',
  };

  // Add logo if provided and not a data URL
  if (design.logo && !design.logo.startsWith('data:')) {
    config.logoImage = toAbsoluteUrl(design.logo);
  }

  try {
    const builder = new QRCodeBuilder(config);
    // Always build as SVG first - the library returns SVG by default
    const qrCode = await builder.build(CanvasType.SVG);

    // Get the SVG string from the result
    let svgString: string | undefined;

    if (qrCode && typeof qrCode === 'object' && 'svg' in qrCode) {
      svgString = (qrCode as any).svg;
    } else if (typeof qrCode === 'string') {
      svgString = qrCode;
    }

    if (!svgString || typeof svgString !== 'string') {
      console.error('[QR Generator] No SVG output from builder');
      throw new Error('No SVG output from QR builder');
    }

    // For SVG format, return directly
    if (format === 'svg') {
      return Buffer.from(svgString, 'utf-8');
    }

    // Convert SVG to PNG/JPEG using Sharp
    const svgBuffer = Buffer.from(svgString, 'utf-8');

    let sharpInstance = sharp(svgBuffer, { density: 300 });

    switch (format) {
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: 90 });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: 90 });
        break;
      case 'png':
      default:
        sharpInstance = sharpInstance.png();
        break;
    }

    const outputBuffer = await sharpInstance.toBuffer();
    return outputBuffer;
  } catch (error) {
    console.error('[QR Generator] Error generating QR:', error);
    throw new Error(`QR generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── API Methods (Compatible Interface) ──────────────────────────────────────

export const STATIC_TYPES = ['text', 'wifi', 'email', 'sms', 'bitcoin', 'phone', 'calendar', 'vcard'];

export async function createQR(params: {
  type: string;
  content: Record<string, any>;
  design: Record<string, any>;
  name?: string;
}) {
  // Self-hosted version: QR codes are generated on-the-fly
  // Return a mock ID that can be used for tracking
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
  // Self-hosted version: no external API to update
  console.log('[QR Generator] updateQR called - self-hosted, no external update needed');
  return { success: true };
}

export async function deleteQR(qrfyId: number) {
  // Self-hosted version: no external API to delete
  console.log('[QR Generator] deleteQR called - self-hosted, no external delete needed');
  return { success: true };
}

export async function getQRImage(
  qrfyId: number,
  format: 'png' | 'webp' | 'jpeg' = 'png'
): Promise<Buffer> {
  // Self-hosted version: this requires stored data to regenerate
  // Return a placeholder for now - actual implementation would need to
  // fetch stored QR data and regenerate
  throw new Error('getQRImage requires stored QR data - use createStaticQRImage instead');
}

export async function getReport(params: {
  qrfyIds?: number[];
  startDate?: string;
  endDate?: string;
  format?: 'json' | 'csv' | 'xlsx';
}) {
  // Self-hosted version: analytics are tracked locally
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

// ─── Style Options for UI ────────────────────────────────────────────────────

// Keep the same arrays for UI compatibility
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

// New: Expose mobstac-awesome-qr options for advanced usage
// These are functions because enums are loaded dynamically
export function getMobstacDataPatterns() {
  return DataPattern ? Object.values(DataPattern) : [];
}
export function getMobstacEyeFrameShapes() {
  return EyeFrameShape ? Object.values(EyeFrameShape) : [];
}
export function getMobstacEyeBallShapes() {
  return EyeBallShape ? Object.values(EyeBallShape) : [];
}
export function getMobstacFrameStyles() {
  return QRCodeFrame ? Object.values(QRCodeFrame) : [];
}
export function getMobstacGradientTypes() {
  return GradientType ? Object.values(GradientType) : [];
}
