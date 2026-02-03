"use client";

import { useEffect, useState, use, CSSProperties } from "react";
import Spinner from "@/components/ui/Spinner";

/* ─── Theme Utilities ───────────────────────────────────────────────── */

interface PageDesign {
  primary?: string;
  secondary?: string;
  tertiary?: string;
  color?: string;
}

interface Theme {
  primary: string;
  secondary: string;
  tertiary: string;
  primaryLight: string;
  primaryDark: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (c: number) => Math.min(255, Math.max(0, Math.round(c + (c * percent / 100))));
  return `rgb(${adjust(rgb.r)}, ${adjust(rgb.g)}, ${adjust(rgb.b)})`;
}

function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

function getTheme(pageDesign?: PageDesign | null): Theme {
  const primary = pageDesign?.primary || pageDesign?.color || "#7C3AED";
  const secondary = pageDesign?.secondary || "#FFFFFF";
  const tertiary = pageDesign?.tertiary || "#F3F4F6";
  return {
    primary,
    secondary,
    tertiary,
    primaryLight: withOpacity(primary, 0.1),
    primaryDark: adjustBrightness(primary, -15),
  };
}

/* ─── Main Component ────────────────────────────────────────────────── */

export default function QRLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/qrcodes/by-slug/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Not Found</h1>
          <p className="text-gray-500">This QR code may have been deleted or deactivated.</p>
        </div>
      </div>
    );
  }

  const { type, content, name, pageDesign } = data;
  const theme = getTheme(pageDesign || content?.pageDesign);

  const containerStyle: CSSProperties = {
    minHeight: "100vh",
    backgroundColor: theme.tertiary,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "3rem 1rem",
  };

  const cardStyle: CSSProperties = {
    width: "100%",
    maxWidth: "28rem",
    backgroundColor: theme.secondary,
    borderRadius: "1rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: `1px solid ${withOpacity(theme.primary, 0.2)}`,
    padding: "2rem",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {type === "vcard" && <VCardView content={content} theme={theme} />}
        {type === "wifi" && <WiFiView content={content} theme={theme} />}
        {type === "coupon" && <CouponView content={content} theme={theme} />}
        {type === "event" && <EventView content={content} theme={theme} />}
        {type === "business" && <BusinessView content={content} theme={theme} />}
        {type === "menu" && <MenuView content={content} theme={theme} />}
        {type === "links" && <LinksView content={content} theme={theme} />}
        {type === "social" && <SocialView content={content} theme={theme} />}
        {type === "apps" && <AppsView content={content} theme={theme} />}
        {type === "review" && <ReviewView content={content} theme={theme} />}
        {type === "feedback" && <FeedbackView content={content} theme={theme} />}
        {type === "product" && <ProductView content={content} theme={theme} />}
        {type === "playlist" && <PlaylistView content={content} theme={theme} />}
        {type === "pdf" && <FileView content={content} theme={theme} label="PDF Document" />}
        {type === "mp3" && <FileView content={content} theme={theme} label="Audio File" />}
        {type === "images" && <ImagesView content={content} theme={theme} />}
        {type === "video" && <VideoView content={content} theme={theme} />}
        {type === "text" && <TextView content={content} theme={theme} />}
        {type === "email" && <EmailView content={content} theme={theme} />}
        {type === "sms" && <SMSView content={content} theme={theme} />}
        {type === "whatsapp" && <WhatsAppView content={content} theme={theme} />}
        {type === "phone" && <PhoneView content={content} theme={theme} />}
        {type === "calendar" && <CalendarView content={content} theme={theme} />}
        {type === "website" && <WebsiteView content={content} theme={theme} name={name} />}
        {(type === "instagram" || type === "facebook") && <SocialRedirectView content={content} theme={theme} type={type} />}
        {type === "bitcoin" && <BitcoinView content={content} theme={theme} />}
        {!["vcard","wifi","coupon","event","business","menu","links","social","apps","review","feedback","product","playlist","pdf","mp3","images","video","text","email","sms","whatsapp","phone","calendar","website","instagram","facebook","bitcoin"].includes(type) && (
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4" style={{ color: theme.primary }}>{name || "QR Content"}</h1>
            <pre className="text-sm whitespace-pre-wrap text-left p-4 rounded-lg" style={{ backgroundColor: theme.tertiary, color: "#374151" }}>
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: withOpacity(theme.primary, 0.5) }}>Powered by QRCraft</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Components ─────────────────────────────────────────────── */

interface ViewProps {
  content: any;
  theme: Theme;
}

function SectionTitle({ children, theme }: { children: React.ReactNode; theme: Theme }) {
  return (
    <h1 className="text-xl font-bold mb-4 text-center" style={{ color: theme.primary }}>
      {children}
    </h1>
  );
}

function InfoRow({ label, value, href, theme }: { label: string; value?: string; href?: string; theme: Theme }) {
  if (!value) return null;
  return (
    <p className="text-sm">
      <span style={{ color: "#6B7280" }}>{label}:</span>{" "}
      {href ? (
        <a href={href} style={{ color: theme.primary }} className="hover:underline" target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ) : (
        <span style={{ color: "#111827" }}>{value}</span>
      )}
    </p>
  );
}

function ActionButton({ href, children, theme }: { href: string; children: React.ReactNode; theme: Theme }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-center py-3 px-4 rounded-xl font-medium transition-colors"
      style={{
        backgroundColor: hover ? theme.primaryDark : theme.primary,
        color: theme.secondary,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href, children, theme }: { href: string; children: React.ReactNode; theme: Theme }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-center py-3 px-4 rounded-xl font-medium transition-colors border"
      style={{
        backgroundColor: hover ? theme.primaryLight : "transparent",
        color: theme.primary,
        borderColor: withOpacity(theme.primary, 0.3),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </a>
  );
}

function Badge({ children, theme }: { children: React.ReactNode; theme: Theme }) {
  return (
    <span
      className="px-3 py-1 rounded-lg text-sm font-medium"
      style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
    >
      {children}
    </span>
  );
}

// Extract a displayable image src from various stored formats
function imgSrc(img: any): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url || img.file || img.src || "";
}

// Build a full address string from parts
function formatAddress(c: any): string {
  return [c.street, c.city, c.state, c.zip, c.country].filter(Boolean).join(", ");
}

/* ─── Type-Specific Views ───────────────────────────────────────────── */

function VCardView({ content: c, theme }: ViewProps) {
  const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ");
  const initials = (c.firstName?.[0] || "") + (c.lastName?.[0] || "");
  const address = formatAddress(c);

  return (
    <div className="text-center">
      {c.photo ? (
        <img src={imgSrc(c.photo)} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
      ) : (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: theme.primary }}
        >
          <span className="text-2xl font-bold" style={{ color: theme.secondary }}>{initials}</span>
        </div>
      )}
      {fullName && <h1 className="text-xl font-bold" style={{ color: theme.primary }}>{fullName}</h1>}
      {c.title && <p style={{ color: "#6B7280" }}>{c.title}</p>}
      {c.company && <p style={{ color: "#6B7280" }}>{c.company}</p>}
      <div className="mt-6 space-y-3 text-left">
        <InfoRow label="Phone" value={c.phone} href={`tel:${c.phone}`} theme={theme} />
        <InfoRow label="Mobile" value={c.mobilePhone} href={`tel:${c.mobilePhone}`} theme={theme} />
        <InfoRow label="Work" value={c.workPhone} href={`tel:${c.workPhone}`} theme={theme} />
        <InfoRow label="Fax" value={c.fax} theme={theme} />
        <InfoRow label="Email" value={c.email} href={`mailto:${c.email}`} theme={theme} />
        <InfoRow label="Website" value={c.website} href={c.website} theme={theme} />
        {address && <InfoRow label="Address" value={address} theme={theme} />}
        {c.note && <p className="text-sm mt-2" style={{ color: "#6B7280" }}>{c.note}</p>}
      </div>
      {Array.isArray(c.socials) && c.socials.length > 0 && (
        <div className="mt-4 space-y-2">
          {c.socials.map((s: any, i: number) => (
            s.url && (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="block text-sm hover:underline capitalize" style={{ color: theme.primary }}>
                {s.platform || "Link"}
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function WiFiView({ content: c, theme }: ViewProps) {
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>WiFi Network</SectionTitle>
      <div className="space-y-3 text-left">
        <InfoRow label="Network" value={c.ssid} theme={theme} />
        <InfoRow label="Password" value={c.password} theme={theme} />
        <InfoRow label="Security" value={c.authType || c.encryption} theme={theme} />
        {c.hidden && <p className="text-sm" style={{ color: "#6B7280" }}>Hidden network</p>}
      </div>
    </div>
  );
}

function CouponView({ content: c, theme }: ViewProps) {
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>{c.title || "Coupon"}</SectionTitle>
      <div className="rounded-xl p-6 my-4" style={{ backgroundColor: theme.primary }}>
        <p className="text-3xl font-bold" style={{ color: theme.secondary }}>{c.badge || c.discount}</p>
      </div>
      {c.code && (
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Code: <span className="font-mono font-bold" style={{ color: "#111827" }}>{c.code}</span>
        </p>
      )}
      {c.description && <p className="text-sm mt-3" style={{ color: "#4B5563" }}>{c.description}</p>}
      {c.expiryDate && <p className="text-sm mt-2" style={{ color: "#6B7280" }}>Expires: {new Date(c.expiryDate).toLocaleDateString()}</p>}
      {c.terms && <p className="text-xs mt-4" style={{ color: "#9CA3AF" }}>{c.terms}</p>}
      {c.buttonUrl && (
        <div className="mt-4">
          <ActionButton href={c.buttonUrl} theme={theme}>{c.buttonText || "Redeem Now"}</ActionButton>
        </div>
      )}
    </div>
  );
}

function EventView({ content: c, theme }: ViewProps) {
  return (
    <div>
      <SectionTitle theme={theme}>{c.title || "Event"}</SectionTitle>
      <div className="space-y-2">
        {c.startDate && <InfoRow label="Start" value={new Date(c.startDate).toLocaleString()} theme={theme} />}
        {c.endDate && <InfoRow label="End" value={new Date(c.endDate).toLocaleString()} theme={theme} />}
        <InfoRow label="Location" value={c.location} theme={theme} />
        <InfoRow label="Organizer" value={c.organizer} theme={theme} />
        {c.description && <p className="text-sm mt-3" style={{ color: "#4B5563" }}>{c.description}</p>}
      </div>
      {(c.buttonUrl || c.rsvpUrl) && (
        <div className="mt-4">
          <ActionButton href={c.buttonUrl || c.rsvpUrl} theme={theme}>{c.buttonText || "RSVP"}</ActionButton>
        </div>
      )}
    </div>
  );
}

function BusinessView({ content: c, theme }: ViewProps) {
  const address = formatAddress(c);
  return (
    <div>
      {c.cover && <img src={imgSrc(c.cover)} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />}
      {c.logo && (
        <img
          src={imgSrc(c.logo)}
          alt=""
          className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-4 shadow"
          style={{ marginTop: c.cover ? "-3rem" : "0", borderColor: theme.secondary }}
        />
      )}
      <SectionTitle theme={theme}>{c.companyName || c.company || "Business"}</SectionTitle>
      {c.title && <p className="text-sm font-medium text-center mb-1" style={{ color: "#374151" }}>{c.title}</p>}
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}
      <div className="space-y-2">
        <InfoRow label="Phone" value={c.phone} href={`tel:${c.phone}`} theme={theme} />
        <InfoRow label="Email" value={c.email} href={`mailto:${c.email}`} theme={theme} />
        <InfoRow label="Website" value={c.website} href={c.website} theme={theme} />
        {address && <InfoRow label="Address" value={address} theme={theme} />}
      </div>
      {Array.isArray(c.schedule) && c.schedule.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2" style={{ color: "#374151" }}>Hours</p>
          {c.schedule.map((s: any, i: number) => (
            <div key={i} className="flex justify-between text-sm py-0.5" style={{ color: "#4B5563" }}>
              <span>{s.day}</span>
              <span>{s.open && s.close ? `${s.open} - ${s.close}` : "Closed"}</span>
            </div>
          ))}
        </div>
      )}
      {Array.isArray(c.socialLinks) && c.socialLinks.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {c.socialLinks.map((s: any, i: number) => (
            s.url && (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize"
                style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                {s.platform || "Link"}
              </a>
            )
          ))}
        </div>
      )}
      {c.buttonUrl && (
        <div className="mt-4">
          <ActionButton href={c.buttonUrl} theme={theme}>{c.buttonText || "Visit Website"}</ActionButton>
        </div>
      )}
    </div>
  );
}

function MenuView({ content: c, theme }: ViewProps) {
  return (
    <div>
      <SectionTitle theme={theme}>{c.restaurantName || "Menu"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}
      {Array.isArray(c.sections) && c.sections.map((section: any, i: number) => (
        <div key={i} className="mb-4">
          <h3 className="font-semibold mb-2" style={{ color: theme.primary }}>{section.name}</h3>
          {Array.isArray(section.items) && section.items.map((item: any, j: number) => (
            <div key={j} className="flex justify-between py-1.5 border-b last:border-0" style={{ borderColor: theme.primaryLight }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "#111827" }}>{item.name}</p>
                {item.description && <p className="text-xs" style={{ color: "#6B7280" }}>{item.description}</p>}
                {Array.isArray(item.dietary) && item.dietary.length > 0 && (
                  <div className="flex gap-1 mt-0.5">
                    {item.dietary.map((d: string, k: number) => (
                      <span key={k} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>{d}</span>
                    ))}
                  </div>
                )}
              </div>
              {item.price && <span className="text-sm font-medium shrink-0 ml-4" style={{ color: theme.primary }}>{item.price}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function LinksView({ content: c, theme }: ViewProps) {
  return (
    <div>
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />}
      <SectionTitle theme={theme}>{c.title || "Links"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}
      <div className="space-y-3">
        {Array.isArray(c.links) && c.links.map((link: any, i: number) => (
          link.url && <SecondaryButton key={i} href={link.url} theme={theme}>{link.text || link.label || link.url}</SecondaryButton>
        ))}
      </div>
      {Array.isArray(c.socials) && c.socials.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {c.socials.map((s: any, i: number) => (
            s.url && (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize"
                style={{ backgroundColor: theme.tertiary, color: "#374151" }}>
                {s.platform || "Link"}
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function SocialView({ content: c, theme }: ViewProps) {
  return (
    <div>
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />}
      <SectionTitle theme={theme}>{c.title || "Social Media"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}
      <div className="space-y-3">
        {Array.isArray(c.platforms) && c.platforms.map((p: any, i: number) => (
          p.url && <SecondaryButton key={i} href={p.url} theme={theme}>{p.platform || p.url}</SecondaryButton>
        ))}
      </div>
    </div>
  );
}

function AppsView({ content: c, theme }: ViewProps) {
  return (
    <div>
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-20 h-20 rounded-xl object-cover mx-auto mb-4" />}
      <SectionTitle theme={theme}>{c.appName || c.name || "Download App"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}
      <div className="space-y-3">
        {c.iosUrl && <ActionButton href={c.iosUrl} theme={theme}>Download on App Store</ActionButton>}
        {c.androidUrl && <ActionButton href={c.androidUrl} theme={theme}>Get on Google Play</ActionButton>}
        {c.website && <SecondaryButton href={c.website} theme={theme}>Visit Website</SecondaryButton>}
      </div>
    </div>
  );
}

function ReviewView({ content: c, theme }: ViewProps) {
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>{c.title || c.name || "Leave a Review"}</SectionTitle>
      {c.description && <p className="text-sm mb-4" style={{ color: "#4B5563" }}>{c.description}</p>}
      <div className="space-y-3">
        {Array.isArray(c.reviewLinks) && c.reviewLinks.map((link: any, i: number) => (
          link.url && <SecondaryButton key={i} href={link.url} theme={theme}>{link.platform || "Review"}</SecondaryButton>
        ))}
      </div>
      {c.website && (
        <div className="mt-3">
          <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: theme.primary }}>
            Visit website
          </a>
        </div>
      )}
    </div>
  );
}

function FeedbackView({ content: c, theme }: ViewProps) {
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>{c.title || "Feedback"}</SectionTitle>
      {c.description && <p className="text-sm mb-4" style={{ color: "#4B5563" }}>{c.description}</p>}
      {Array.isArray(c.questions) && c.questions.length > 0 && (
        <div className="space-y-4 text-left mb-4">
          {c.questions.map((q: any, i: number) => (
            <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: theme.tertiary }}>
              <p className="text-sm font-medium" style={{ color: "#111827" }}>{q.text}</p>
              <p className="text-xs capitalize" style={{ color: "#6B7280" }}>{q.type || "rating"}</p>
            </div>
          ))}
        </div>
      )}
      {c.url && <ActionButton href={c.url} theme={theme}>Give Feedback</ActionButton>}
    </div>
  );
}

function ProductView({ content: c, theme }: ViewProps) {
  const images = c.images || [];
  const currencySymbol: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", CAD: "C$", AUD: "A$" };
  const priceDisplay = c.price ? `${currencySymbol[c.currency] || c.currency || "$"}${c.price}` : "";
  return (
    <div>
      {Array.isArray(images) && images.length > 0 && (
        <img src={imgSrc(images[0])} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
      )}
      <SectionTitle theme={theme}>{c.productName || "Product"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}
      {priceDisplay && <p className="text-2xl font-bold text-center mb-4" style={{ color: theme.primary }}>{priceDisplay}</p>}
      {Array.isArray(images) && images.length > 1 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {images.slice(1).map((img: any, i: number) => {
            const src = imgSrc(img);
            return src ? <img key={i} src={src} alt="" className="w-full h-20 object-cover rounded-lg" /> : null;
          })}
        </div>
      )}
      {c.buyUrl && <ActionButton href={c.buyUrl} theme={theme}>{c.buyButtonText || "Buy Now"}</ActionButton>}
    </div>
  );
}

function PlaylistView({ content: c, theme }: ViewProps) {
  return (
    <div>
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-20 h-20 rounded-xl object-cover mx-auto mb-4" />}
      <SectionTitle theme={theme}>{c.title || "Playlist"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}
      <div className="space-y-3">
        {Array.isArray(c.platformLinks) && c.platformLinks.map((link: any, i: number) => (
          link.url && <SecondaryButton key={i} href={link.url} theme={theme}>{link.platform || "Listen"}</SecondaryButton>
        ))}
      </div>
    </div>
  );
}

function FileView({ content: c, theme, label }: ViewProps & { label: string }) {
  const files: { url: string; name: string }[] = [];
  if (c.fileUrl) files.push({ url: c.fileUrl, name: c.fileName || label });
  if (Array.isArray(c.pdfs)) {
    for (const p of c.pdfs) {
      const url = p.file || p.fileUrl || p.url;
      if (url) files.push({ url, name: p.name || label });
    }
  }
  const mainUrl = files[0]?.url || c.url;

  return (
    <div className="text-center">
      <SectionTitle theme={theme}>{c.title || label}</SectionTitle>
      {c.description && <p className="text-sm mb-4" style={{ color: "#4B5563" }}>{c.description}</p>}
      {files.length > 1 ? (
        <div className="space-y-3">
          {files.map((f, i) => (
            <ActionButton key={i} href={f.url} theme={theme}>{f.name || `${label} ${i + 1}`}</ActionButton>
          ))}
        </div>
      ) : mainUrl ? (
        <ActionButton href={mainUrl} theme={theme}>Open {label}</ActionButton>
      ) : null}
    </div>
  );
}

function ImagesView({ content: c, theme }: ViewProps) {
  const images = c.images || (c.fileUrl ? [c.fileUrl] : []);
  return (
    <div>
      <SectionTitle theme={theme}>{c.title || c.name || "Images"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}
      <div className="grid grid-cols-2 gap-2">
        {Array.isArray(images) && images.map((img: any, i: number) => {
          const src = imgSrc(img);
          return src ? <img key={i} src={src} alt="" className="w-full rounded-lg object-cover" /> : null;
        })}
      </div>
      {(!Array.isArray(images) || images.length === 0) && (
        <p className="text-sm text-center" style={{ color: "#9CA3AF" }}>No images available.</p>
      )}
    </div>
  );
}

function VideoView({ content: c, theme }: ViewProps) {
  const url = c.url || c.fileUrl || "";
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>{c.title || "Video"}</SectionTitle>
      {c.description && <p className="text-sm mb-4" style={{ color: "#4B5563" }}>{c.description}</p>}
      {url && <ActionButton href={url} theme={theme}>Watch Video</ActionButton>}
    </div>
  );
}

function TextView({ content: c, theme }: ViewProps) {
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>Message</SectionTitle>
      <p className="whitespace-pre-wrap" style={{ color: "#374151" }}>{c.text || ""}</p>
    </div>
  );
}

function EmailView({ content: c, theme }: ViewProps) {
  return (
    <div>
      <SectionTitle theme={theme}>Send Email</SectionTitle>
      <div className="space-y-2">
        <InfoRow label="To" value={c.email} href={`mailto:${c.email}`} theme={theme} />
        <InfoRow label="Subject" value={c.subject} theme={theme} />
        {c.message && <p className="text-sm mt-2" style={{ color: "#4B5563" }}>{c.message}</p>}
      </div>
      {c.email && (
        <div className="mt-4">
          <ActionButton href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject || '')}&body=${encodeURIComponent(c.message || '')}`} theme={theme}>
            Send Email
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function SMSView({ content: c, theme }: ViewProps) {
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>Send SMS</SectionTitle>
      <div className="space-y-2 text-left">
        <InfoRow label="To" value={c.phone} href={`sms:${c.phone}`} theme={theme} />
        {c.message && <p className="text-sm mt-2" style={{ color: "#4B5563" }}>{c.message}</p>}
      </div>
      {c.phone && (
        <div className="mt-4">
          <ActionButton href={`sms:${c.phone}${c.message ? `?body=${encodeURIComponent(c.message)}` : ''}`} theme={theme}>
            Send Message
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function WhatsAppView({ content: c, theme }: ViewProps) {
  const phone = (c.phone || "").replace(/\D/g, "");
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>WhatsApp</SectionTitle>
      <div className="space-y-2 text-left mb-4">
        <InfoRow label="Phone" value={c.phone} theme={theme} />
        {c.message && <p className="text-sm mt-2" style={{ color: "#4B5563" }}>{c.message}</p>}
      </div>
      {phone && (
        <ActionButton href={`https://wa.me/${phone}${c.message ? `?text=${encodeURIComponent(c.message)}` : ''}`} theme={theme}>
          Open WhatsApp
        </ActionButton>
      )}
    </div>
  );
}

function PhoneView({ content: c, theme }: ViewProps) {
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>{c.name || "Phone Call"}</SectionTitle>
      <p className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>{c.phone}</p>
      {c.phone && <ActionButton href={`tel:${c.phone}`} theme={theme}>Call Now</ActionButton>}
    </div>
  );
}

function CalendarView({ content: c, theme }: ViewProps) {
  return (
    <div>
      <SectionTitle theme={theme}>{c.eventTitle || c.title || "Calendar Event"}</SectionTitle>
      <div className="space-y-2">
        {c.startDate && <InfoRow label="Start" value={new Date(c.startDate).toLocaleString()} theme={theme} />}
        {c.endDate && <InfoRow label="End" value={new Date(c.endDate).toLocaleString()} theme={theme} />}
        <InfoRow label="Location" value={c.location} theme={theme} />
        {c.organizerName && <InfoRow label="Organizer" value={c.organizerName} theme={theme} />}
        {c.description && <p className="text-sm mt-3" style={{ color: "#4B5563" }}>{c.description}</p>}
      </div>
    </div>
  );
}

function WebsiteView({ content: c, theme, name }: ViewProps & { name?: string }) {
  const url = c.url || "";
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>{name || "Website"}</SectionTitle>
      {url && <ActionButton href={fullUrl} theme={theme}>Visit Website</ActionButton>}
      {Array.isArray(c.websites) && c.websites.length > 0 && (
        <div className="space-y-3 mt-3">
          {c.websites.map((w: any, i: number) => (
            w.url && <SecondaryButton key={i} href={w.url.startsWith("http") ? w.url : `https://${w.url}`} theme={theme}>{w.name || w.url}</SecondaryButton>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialRedirectView({ content: c, theme, type }: ViewProps & { type: string }) {
  const url = c.url || "";
  const label = type === "instagram" ? "Instagram" : "Facebook";
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>{label}</SectionTitle>
      {url && <ActionButton href={url.startsWith("http") ? url : `https://${url}`} theme={theme}>Open {label}</ActionButton>}
    </div>
  );
}

function BitcoinView({ content: c, theme }: ViewProps) {
  return (
    <div className="text-center">
      <SectionTitle theme={theme}>Bitcoin</SectionTitle>
      {c.address && (
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: theme.tertiary }}>
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>Wallet Address</p>
          <p className="text-sm font-mono break-all" style={{ color: "#111827" }}>{c.address}</p>
        </div>
      )}
      {c.address && <ActionButton href={`bitcoin:${c.address}`} theme={theme}>Open Wallet</ActionButton>}
    </div>
  );
}
