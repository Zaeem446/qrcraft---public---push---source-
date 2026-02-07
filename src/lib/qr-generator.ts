// Self-hosted QR Generator using qr-code-styling
// Replaces QRFY API with local generation
// Works in both browser and Node.js (serverless) environments

// Lazy-loaded modules for server-side rendering
let QRCodeStyling: any = null;
let isInitialized = false;

async function initQRCodeStyling(): Promise<boolean> {
  if (isInitialized) return QRCodeStyling !== null;
  isInitialized = true;

  try {
    // Dynamically import jsdom and set up polyfills
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      pretendToBeVisual: true,
    });
    const { window: jsdomWindow } = dom;

    // Set up global window-like environment
    const globalAny = global as any;
    globalAny.window = jsdomWindow;
    globalAny.document = jsdomWindow.document;
    globalAny.XMLSerializer = jsdomWindow.XMLSerializer;
    globalAny.DOMParser = jsdomWindow.DOMParser;
    globalAny.Image = jsdomWindow.Image;
    globalAny.HTMLCanvasElement = jsdomWindow.HTMLCanvasElement;

    // Now import QRCodeStyling
    const qrModule = await import('qr-code-styling');
    QRCodeStyling = qrModule.default;

    console.log('[QR Generator] qr-code-styling initialized successfully');
    return true;
  } catch (err) {
    console.error('[QR Generator] Failed to initialize qr-code-styling:', err);
    return false;
  }
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
  phone: 'url-static',
  calendar: 'url-static',
  playlist: 'link-list',
  product: 'business',
  feedback: 'feedback',
};

export function mapTypeToQrfy(ourType: string): string {
  return TYPE_MAP[ourType] || 'url';
}

// ─── Style Mapping ───────────────────────────────────────────────────────────

// qr-code-styling dot types
type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';

const DOTS_TYPE_MAP: Record<string, DotType> = {
  square: 'square',
  dots: 'dots',
  dot: 'dots',
  rounded: 'rounded',
  'extra-rounded': 'extra-rounded',
  classy: 'classy',
  'classy-rounded': 'classy-rounded',
  // Map other styles to closest match
  cross: 'square',
  'cross-rounded': 'rounded',
  diamond: 'square',
  'diamond-special': 'square',
  heart: 'dots',
  'horizontal-rounded': 'rounded',
  ribbon: 'classy',
  shake: 'dots',
  sparkle: 'dots',
  star: 'classy',
  'vertical-rounded': 'rounded',
  x: 'square',
  'x-rounded': 'rounded',
  'small-square': 'square',
  'tiny-square': 'square',
  'vertical-line': 'rounded',
  'horizontal-line': 'rounded',
  'random-dot': 'dots',
  wave: 'rounded',
  weave: 'square',
  pentagon: 'classy',
  hexagon: 'classy',
  'zebra-horizontal': 'rounded',
  'zebra-vertical': 'rounded',
  'blocks-horizontal': 'square',
  'blocks-vertical': 'square',
};

// qr-code-styling corner square types
type CornerSquareType = 'square' | 'dot' | 'extra-rounded';

const CORNER_SQUARE_MAP: Record<string, CornerSquareType> = {
  default: 'square',
  dot: 'dot',
  square: 'square',
  'extra-rounded': 'extra-rounded',
  shape1: 'extra-rounded',
  shape2: 'dot',
  shape3: 'dot',
  shape4: 'dot',
  shape5: 'extra-rounded',
  shape6: 'dot',
  shape7: 'dot',
  shape8: 'dot',
  shape9: 'extra-rounded',
  shape10: 'dot',
  shape11: 'dot',
  shape12: 'extra-rounded',
  classy: 'extra-rounded',
  outpoint: 'dot',
  inpoint: 'dot',
  'center-circle': 'dot',
  rounded: 'extra-rounded',
};

// qr-code-styling corner dot types
type CornerDotType = 'square' | 'dot';

const CORNER_DOT_MAP: Record<string, CornerDotType> = {
  default: 'square',
  dot: 'dot',
  square: 'square',
  cross: 'square',
  'cross-rounded': 'dot',
  diamond: 'square',
  dot2: 'dot',
  dot3: 'dot',
  dot4: 'dot',
  heart: 'dot',
  rounded: 'dot',
  square2: 'square',
  square3: 'square',
  star: 'square',
  sun: 'dot',
  x: 'square',
  'x-rounded': 'dot',
  'extra-rounded': 'dot',
  classy: 'dot',
  outpoint: 'square',
  inpoint: 'square',
  pentagon: 'dot',
  hexagon: 'dot',
};

// ─── Design Mapping ──────────────────────────────────────────────────────────

function toAbsoluteUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  const base = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

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
      return content.url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online'}/preview`;
  }
}

// ─── Main QR Image Generation ────────────────────────────────────────────────

export async function createStaticQRImage(
  type: string,
  content: Record<string, any>,
  design: Record<string, any>,
  format: 'png' | 'webp' | 'jpeg' | 'svg' = 'png'
): Promise<Buffer> {
  // Initialize qr-code-styling
  const initialized = await initQRCodeStyling();
  if (!initialized || !QRCodeStyling) {
    throw new Error('qr-code-styling not available');
  }

  const qrContent = generateQRContent(type, content);

  // Map design to qr-code-styling options
  const dotsType = DOTS_TYPE_MAP[design.dotsType] || 'square';
  const cornerSquareType = CORNER_SQUARE_MAP[design.cornersSquareType] || 'square';
  const cornerDotType = CORNER_DOT_MAP[design.cornersDotType] || 'square';

  const dotsColor = design.dotsColor || '#000000';
  const backgroundColor = design.bgTransparent ? 'transparent' : (design.backgroundColor || '#FFFFFF');
  const cornersSquareColor = design.cornersSquareColor || dotsColor;
  const cornersDotColor = design.cornersDotColor || dotsColor;

  // Error correction level
  const errorCorrectionMap: Record<string, 'L' | 'M' | 'Q' | 'H'> = {
    L: 'L', M: 'M', Q: 'Q', H: 'H'
  };
  const errorCorrectionLevel = errorCorrectionMap[design.errorCorrectionLevel?.toUpperCase()] || (design.logo ? 'H' : 'M');

  // Build QR code options
  const qrOptions: any = {
    width: 1024,
    height: 1024,
    margin: 40,
    data: qrContent,
    dotsOptions: {
      type: dotsType,
      color: dotsColor,
    },
    cornersSquareOptions: {
      type: cornerSquareType,
      color: cornersSquareColor,
    },
    cornersDotOptions: {
      type: cornerDotType,
      color: cornersDotColor,
    },
    backgroundOptions: {
      color: backgroundColor,
    },
    qrOptions: {
      errorCorrectionLevel,
    },
  };

  // Add logo if provided
  if (design.logo) {
    const logoUrl = design.logo.startsWith('data:') ? design.logo : toAbsoluteUrl(design.logo);
    qrOptions.image = logoUrl;
    qrOptions.imageOptions = {
      crossOrigin: 'anonymous',
      margin: 10,
      imageSize: 0.4,
      hideBackgroundDots: true,
    };
  }

  // Add gradient support
  if (design.patternGradient && design.patternColor2) {
    qrOptions.dotsOptions.gradient = {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: dotsColor },
        { offset: 1, color: design.patternColor2 },
      ],
    };
  }

  try {
    const qrCode = new QRCodeStyling(qrOptions);

    // Get SVG data
    const svgData = await qrCode.getRawData('svg');

    if (!svgData) {
      throw new Error('Failed to generate QR code SVG');
    }

    let svgString: string;
    if (svgData instanceof Blob) {
      svgString = await svgData.text();
    } else if (Buffer.isBuffer(svgData)) {
      svgString = svgData.toString('utf-8');
    } else if (typeof svgData === 'string') {
      svgString = svgData;
    } else {
      throw new Error('Unexpected SVG data type');
    }

    // Handle frame if specified
    const frameId = typeof design.frameId === 'number' ? design.frameId : -1;
    if (frameId > 0) {
      svgString = addFrameToSvg(svgString, design);
    }

    // Return SVG directly if requested
    if (format === 'svg') {
      return Buffer.from(svgString, 'utf-8');
    }

    // Convert SVG to PNG using sharp
    const sharp = (await import('sharp')).default;
    const pngBuffer = await sharp(Buffer.from(svgString))
      .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    if (format === 'png') {
      return pngBuffer;
    }

    // Convert to other formats
    if (format === 'jpeg') {
      return await sharp(pngBuffer).jpeg({ quality: 90 }).toBuffer();
    }
    if (format === 'webp') {
      return await sharp(pngBuffer).webp({ quality: 90 }).toBuffer();
    }

    return pngBuffer;
  } catch (error) {
    console.error('[QR Generator] Error:', error);
    throw new Error(`QR generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Frame Support ───────────────────────────────────────────────────────────

function addFrameToSvg(svgString: string, design: Record<string, any>): string {
  const frameColor = design.frameColor || '#7C3AED';
  const frameText = (design.frameText || 'Scan me!').slice(0, 30);
  const frameTextColor = design.frameTextColor || '#FFFFFF';

  // Parse existing SVG dimensions
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  const widthMatch = svgString.match(/width="(\d+)"/);
  const heightMatch = svgString.match(/height="(\d+)"/);

  const originalWidth = widthMatch ? parseInt(widthMatch[1]) : 1024;
  const originalHeight = heightMatch ? parseInt(heightMatch[1]) : 1024;

  // Frame dimensions
  const frameHeight = 100;
  const framePadding = 30;
  const newHeight = originalHeight + frameHeight + framePadding;
  const cornerRadius = 20;

  // Create new SVG with frame
  const framedSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${originalWidth}" height="${newHeight}" viewBox="0 0 ${originalWidth} ${newHeight}">
  <!-- Frame background -->
  <rect x="0" y="${originalHeight + framePadding/2}" width="${originalWidth}" height="${frameHeight}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${frameColor}"/>

  <!-- Original QR code -->
  <g transform="translate(0, 0)">
    ${svgString.replace(/<\?xml[^>]*\?>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
  </g>

  <!-- Frame text -->
  <text x="${originalWidth / 2}" y="${originalHeight + framePadding/2 + frameHeight/2 + 10}"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="36"
        font-weight="bold"
        fill="${frameTextColor}">${frameText}</text>
</svg>`;

  return framedSvg;
}

// ─── API Methods (Compatible Interface) ──────────────────────────────────────

export const STATIC_TYPES = ['text', 'wifi', 'email', 'sms', 'bitcoin', 'phone', 'calendar', 'vcard'];

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
  throw new Error('getQRImage requires stored QR data - use createStaticQRImage instead');
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
