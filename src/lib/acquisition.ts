export type AcquisitionChannel = 'organic' | 'google_ads' | 'facebook_ads' | 'direct' | 'referral' | 'other';

const STORAGE_KEY = 'acquisition_data';

export interface AcquisitionData {
  channel: AcquisitionChannel;
  gclid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  timestamp?: string;
}

export function captureAcquisitionParams(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid');
  const fbclid = params.get('fbclid');
  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_campaign = params.get('utm_campaign');
  const utm_term = params.get('utm_term');
  const utm_content = params.get('utm_content');

  // Only capture if there are ad/tracking params
  const hasParams = gclid || fbclid || utm_source || utm_medium || utm_campaign;
  if (!hasParams) return;

  // Don't overwrite existing data (first touch wins)
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return;

  const channel = detectChannel(gclid, fbclid, utm_source);

  const data: AcquisitionData = {
    channel,
    landing_page: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  if (gclid) data.gclid = gclid;
  if (fbclid) data.fbclid = fbclid;
  if (utm_source) data.utm_source = utm_source;
  if (utm_medium) data.utm_medium = utm_medium;
  if (utm_campaign) data.utm_campaign = utm_campaign;
  if (utm_term) data.utm_term = utm_term;
  if (utm_content) data.utm_content = utm_content;

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function detectChannel(
  gclid: string | null,
  fbclid: string | null,
  utm_source: string | null
): AcquisitionChannel {
  if (gclid) return 'google_ads';
  if (fbclid) return 'facebook_ads';
  if (utm_source) {
    if (utm_source.toLowerCase().includes('google')) return 'google_ads';
    if (utm_source.toLowerCase().includes('facebook') || utm_source.toLowerCase().includes('fb')) return 'facebook_ads';
    return 'referral';
  }
  return 'other';
}

export function getAcquisitionData(): AcquisitionData | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAdChannel(channel: string | null | undefined): boolean {
  return channel === 'google_ads' || channel === 'facebook_ads';
}

export function clearAcquisitionData(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}
