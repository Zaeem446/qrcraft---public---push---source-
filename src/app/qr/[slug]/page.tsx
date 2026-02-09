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

/* ─── Template System ───────────────────────────────────────────────── */
// Template layouts matching phone previews:
// 0 = Classic  (header + body + button)
// 1 = Grid     (header + two-col body + button)
// 2 = Minimal  (no header, body + button)
// 3 = Compact  (header + two-col body, no button)
// 4 = Clean    (header + body, no button)

const TEMPLATES = [
  { header: true, body: true, button: true, split: false },
  { header: true, body: true, button: true, split: true },
  { header: false, body: true, button: true, split: false },
  { header: true, body: true, button: false, split: true },
  { header: true, body: true, button: false, split: false },
];

function getLayout(content: any) {
  const idx = content?.template ?? 0;
  return TEMPLATES[idx] || TEMPLATES[0];
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

  // Set favicon dynamically
  useEffect(() => {
    if (!data) return;
    const favicon = data.content?.favicon || data.content?.logo;
    if (favicon) {
      const faviconUrl = typeof favicon === 'string' ? favicon : (favicon.url || favicon.file || favicon.src);
      if (faviconUrl) {
        // Remove existing favicon links
        const existingLinks = document.querySelectorAll("link[rel*='icon']");
        existingLinks.forEach(link => link.remove());

        // Add new favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = faviconUrl;
        document.head.appendChild(link);
      }
    }
  }, [data]);

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
        {type === "vcard-plus" && <VCardPlusView content={content} theme={theme} />}
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
        {type === "pdf" && <PdfView content={content} theme={theme} />}
        {type === "mp3" && <Mp3View content={content} theme={theme} />}
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
        {!["vcard","vcard-plus","wifi","coupon","event","business","menu","links","social","apps","review","feedback","product","playlist","pdf","mp3","images","video","text","email","sms","whatsapp","phone","calendar","website","instagram","facebook","bitcoin"].includes(type) && (
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
  const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ") || "Contact";
  const initials = (c.firstName?.[0] || "") + (c.lastName?.[0] || "");
  const jobLine = [c.title, c.company].filter(Boolean).join(" at ");
  const address = formatAddress(c);
  const tpl = getLayout(c);
  const cover = c.cover;
  const photo = imgSrc(c.photo);
  const buttonText = c.buttonText || "Save Contact";

  // Contact fields
  const contactFields = [
    { label: "Phone", value: c.phone, href: c.phone ? `tel:${c.phone}` : undefined },
    { label: "Mobile", value: c.mobilePhone, href: c.mobilePhone ? `tel:${c.mobilePhone}` : undefined },
    { label: "Work", value: c.workPhone, href: c.workPhone ? `tel:${c.workPhone}` : undefined },
    { label: "Fax", value: c.fax },
    { label: "Email", value: c.email, href: c.email ? `mailto:${c.email}` : undefined },
    { label: "Website", value: c.website, href: c.website },
    { label: "Address", value: address },
  ].filter(f => f.value);

  return (
    <div>
      {/* Cover/Header Section */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={imgSrc(cover)} alt="" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              {photo ? (
                <img src={photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-4 shadow-lg" style={{ borderColor: theme.secondary }} />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 border-4 shadow-lg" style={{ backgroundColor: theme.primary, borderColor: theme.secondary }}>
                  <span className="text-2xl font-bold" style={{ color: theme.secondary }}>{initials}</span>
                </div>
              )}
              <h1 className="text-xl font-bold text-white">{fullName}</h1>
              {jobLine && <p className="text-white/80 text-sm">{jobLine}</p>}
            </div>
          </div>
        ) : (
          <div className="text-center mb-6 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
            {photo ? (
              <img src={photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 shadow-lg" style={{ borderColor: theme.secondary }} />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 bg-white/20">
                <span className="text-2xl font-bold" style={{ color: theme.secondary }}>{initials}</span>
              </div>
            )}
            <h1 className="text-xl font-bold" style={{ color: theme.secondary }}>{fullName}</h1>
            {jobLine && <p style={{ color: withOpacity(theme.secondary, 0.8) }}>{jobLine}</p>}
          </div>
        )
      )}

      {/* Minimal layout - no header */}
      {!tpl.header && (
        <div className="flex items-center gap-4 mb-6">
          {photo ? (
            <img src={photo} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
              <span className="text-xl font-bold" style={{ color: theme.secondary }}>{initials}</span>
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.primary }}>{fullName}</h1>
            {jobLine && <p className="text-sm" style={{ color: "#6B7280" }}>{jobLine}</p>}
          </div>
        </div>
      )}

      {/* Contact Fields */}
      {tpl.split ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {contactFields.map((f) => (
            <div key={f.label} className="rounded-xl p-3 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>{f.label}</p>
              {f.href ? (
                <a href={f.href} className="text-sm hover:underline" style={{ color: "#374151" }}>{f.value}</a>
              ) : (
                <p className="text-sm" style={{ color: "#374151" }}>{f.value}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {contactFields.map((f) => (
            <div key={f.label} className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>{f.label}</p>
              {f.href ? (
                <a href={f.href} className="text-sm hover:underline" style={{ color: "#374151" }}>{f.value}</a>
              ) : (
                <p className="text-sm" style={{ color: "#374151" }}>{f.value}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {c.note && <p className="text-sm mb-4" style={{ color: "#6B7280" }}>{c.note}</p>}

      {/* Social Links */}
      {Array.isArray(c.socials) && c.socials.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {c.socials.map((s: any, i: number) => (
            s.url && (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-medium capitalize"
                style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                {s.platform || "Link"}
              </a>
            )
          ))}
        </div>
      )}

      {/* Save Contact Button */}
      {tpl.button && (
        <ActionButton href={`data:text/vcard;charset=utf-8,${encodeURIComponent(generateVCard(c))}`} theme={theme}>
          {buttonText}
        </ActionButton>
      )}
    </div>
  );
}

function generateVCard(c: any): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${c.lastName || ""};${c.firstName || ""}`,
    `FN:${[c.firstName, c.lastName].filter(Boolean).join(" ") || "Contact"}`,
  ];
  if (c.company) lines.push(`ORG:${c.company}`);
  if (c.title) lines.push(`TITLE:${c.title}`);
  if (c.phone) lines.push(`TEL;TYPE=CELL:${c.phone}`);
  if (c.mobilePhone) lines.push(`TEL;TYPE=CELL:${c.mobilePhone}`);
  if (c.workPhone) lines.push(`TEL;TYPE=WORK:${c.workPhone}`);
  if (c.fax) lines.push(`TEL;TYPE=FAX:${c.fax}`);
  if (c.email) lines.push(`EMAIL:${c.email}`);
  if (c.website) lines.push(`URL:${c.website}`);
  const addr = formatAddress(c);
  if (addr) lines.push(`ADR:;;${addr}`);
  if (c.note) lines.push(`NOTE:${c.note}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function VCardPlusView({ content: c, theme }: ViewProps) {
  const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ") || "Contact";
  const initials = (c.firstName?.[0] || "") + (c.lastName?.[0] || "");
  const jobLine = [c.title || c.jobTitle, c.company].filter(Boolean).join(" at ");
  const bio = c.description || c.bio;
  const address = formatAddress(c);
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const photo = imgSrc(c.photo);
  const buttonText = c.buttonText || "Save Contact";

  return (
    <div>
      {/* Cover with overlapping profile photo */}
      <div className="relative -mx-8 -mt-8 mb-12">
        {cover ? (
          <img src={cover} alt="" className="w-full h-36 object-cover" />
        ) : (
          <div className="w-full h-36" style={{ backgroundColor: theme.primary }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Profile photo */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          {photo ? (
            <img src={photo} alt="" className="w-24 h-24 rounded-full object-cover border-4 shadow-xl" style={{ borderColor: theme.secondary }} />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-xl" style={{ backgroundColor: theme.primary, borderColor: theme.secondary }}>
              <span className="text-3xl font-bold" style={{ color: theme.secondary }}>{initials}</span>
            </div>
          )}
        </div>
      </div>

      {/* Name and title */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold" style={{ color: theme.primary }}>{fullName}</h1>
        {jobLine && <p className="text-sm" style={{ color: "#6B7280" }}>{jobLine}</p>}
        {bio && <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>{bio}</p>}
      </div>

      {/* Quick action buttons */}
      {tpl.split && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {c.phone && (
            <a href={`tel:${c.phone}`} className="rounded-xl py-3 text-center font-medium text-sm" style={{ backgroundColor: theme.primary, color: theme.secondary }}>
              Call
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} className="rounded-xl py-3 text-center font-medium text-sm border" style={{ borderColor: theme.primary, color: theme.primary }}>
              Email
            </a>
          )}
        </div>
      )}

      {/* Contact Details */}
      <div className="space-y-3 mb-4">
        {c.phone && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Phone</p>
            <a href={`tel:${c.phone}`} className="text-sm hover:underline" style={{ color: "#374151" }}>{c.phone}</a>
          </div>
        )}
        {c.email && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Email</p>
            <a href={`mailto:${c.email}`} className="text-sm hover:underline" style={{ color: "#374151" }}>{c.email}</a>
          </div>
        )}
        {c.website && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Website</p>
            <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: "#374151" }}>{c.website}</a>
          </div>
        )}
        {address && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Address</p>
            <p className="text-sm" style={{ color: "#374151" }}>{address}</p>
          </div>
        )}
      </div>

      {/* Social Links */}
      {Array.isArray(c.socials) && c.socials.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {c.socials.map((s: any, i: number) => (
            s.url && (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase"
                style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                {(s.platform || "").slice(0, 2)}
              </a>
            )
          ))}
        </div>
      )}

      {/* Save Contact Button */}
      {tpl.button && (
        <ActionButton href={`data:text/vcard;charset=utf-8,${encodeURIComponent(generateVCard(c))}`} theme={theme}>
          {buttonText}
        </ActionButton>
      )}
    </div>
  );
}

function WiFiView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const [copied, setCopied] = useState(false);

  const copyPassword = () => {
    if (c.password) {
      navigator.clipboard.writeText(c.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-white/20">
          <span className="text-3xl">📶</span>
        </div>
        <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>WiFi Network</h1>
        <p className="text-sm" style={{ color: withOpacity(theme.secondary, 0.8) }}>Connect to this network</p>
      </div>

      {/* Network Details */}
      <div className="space-y-3">
        <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
          <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Network Name</p>
          <p className="text-lg font-bold" style={{ color: "#111827" }}>{c.ssid || "Network"}</p>
        </div>

        {c.password && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Password</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-lg font-mono font-bold" style={{ color: "#111827" }}>{c.password}</p>
              <button
                onClick={copyPassword}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ backgroundColor: copied ? "#10B981" : theme.primaryLight, color: copied ? "#fff" : theme.primary }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {(c.authType || c.encryption) && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Security</p>
            <p className="text-sm font-medium" style={{ color: "#374151" }}>{c.authType || c.encryption}</p>
          </div>
        )}

        {c.hidden && (
          <div className="flex items-center gap-2 text-sm p-3 rounded-lg" style={{ backgroundColor: theme.tertiary, color: "#6B7280" }}>
            <span>🔒</span> This is a hidden network
          </div>
        )}
      </div>

      <p className="text-xs text-center mt-4" style={{ color: "#9CA3AF" }}>
        Point your camera at the QR code to connect automatically
      </p>
    </div>
  );
}

function CouponView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);
  const discount = c.badge || c.discount || "SPECIAL OFFER";

  return (
    <div>
      {/* Cover/Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              {logo && <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover shadow-lg" />}
            </div>
          </div>
        ) : (
          <div className="-mx-8 -mt-8 mb-6" style={{ backgroundColor: theme.primary }}>
            <div className="px-8 pt-8 pb-6 text-center">
              {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" />}
            </div>
          </div>
        )
      )}

      <div className="text-center">
        <h1 className="text-lg font-bold mb-4" style={{ color: theme.primary }}>{c.title || "Coupon"}</h1>

        {/* Coupon Badge */}
        <div className="relative rounded-2xl p-8 my-4 overflow-hidden" style={{ backgroundColor: theme.primary }}>
          <div className="absolute top-0 left-0 w-6 h-6 bg-white rounded-full -translate-x-3" />
          <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full translate-x-3" />
          <div className="absolute bottom-0 left-0 w-6 h-6 bg-white rounded-full -translate-x-3" />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full translate-x-3" />
          <p className="text-4xl font-black" style={{ color: theme.secondary }}>{discount}</p>
        </div>

        {/* Coupon Code */}
        {c.code && (
          <div className="my-4 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: theme.primary }}>
            <p className="text-xs uppercase mb-1" style={{ color: "#6B7280" }}>Use Code</p>
            <p className="text-xl font-mono font-bold tracking-widest" style={{ color: theme.primary }}>{c.code}</p>
          </div>
        )}

        {c.description && <p className="text-sm mb-3" style={{ color: "#4B5563" }}>{c.description}</p>}

        {c.expiryDate && (
          <p className="text-sm mb-2" style={{ color: "#EF4444" }}>
            ⏰ Expires: {new Date(c.expiryDate).toLocaleDateString()}
          </p>
        )}

        {c.terms && (
          <p className="text-xs mt-4 px-4 py-2 rounded-lg" style={{ backgroundColor: theme.tertiary, color: "#9CA3AF" }}>
            {c.terms}
          </p>
        )}

        {tpl.button && c.buttonUrl && (
          <div className="mt-4">
            <ActionButton href={c.buttonUrl} theme={theme}>{c.buttonText || "Redeem Now"}</ActionButton>
          </div>
        )}
      </div>
    </div>
  );
}

function EventView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);

  // Format dates nicely
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div>
      {/* Cover/Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              {logo && <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mb-2 shadow-lg" />}
              <h1 className="text-xl font-bold text-white">{c.title || "Event"}</h1>
            </div>
          </div>
        ) : (
          <div className="mb-6 -mx-8 -mt-8 px-8 pt-8 pb-6 text-center" style={{ backgroundColor: theme.primary }}>
            {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" />}
            <h1 className="text-xl font-bold" style={{ color: theme.secondary }}>{c.title || "Event"}</h1>
          </div>
        )
      )}

      {!tpl.header && (
        <div className="mb-4">
          <SectionTitle theme={theme}>{c.title || "Event"}</SectionTitle>
        </div>
      )}

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        {c.startDate && (
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.primaryLight }}>
            <span className="text-xl">📅</span>
            <div>
              <p className="text-xs font-medium uppercase" style={{ color: theme.primary }}>When</p>
              <p className="text-sm font-medium" style={{ color: "#374151" }}>{formatEventDate(c.startDate)}</p>
              {c.endDate && <p className="text-xs" style={{ color: "#6B7280" }}>Until {formatEventDate(c.endDate)}</p>}
            </div>
          </div>
        )}

        {c.location && (
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.primaryLight }}>
            <span className="text-xl">📍</span>
            <div>
              <p className="text-xs font-medium uppercase" style={{ color: theme.primary }}>Where</p>
              <p className="text-sm font-medium" style={{ color: "#374151" }}>{c.location}</p>
            </div>
          </div>
        )}

        {c.organizer && (
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.primaryLight }}>
            <span className="text-xl">👤</span>
            <div>
              <p className="text-xs font-medium uppercase" style={{ color: theme.primary }}>Organizer</p>
              <p className="text-sm font-medium" style={{ color: "#374151" }}>{c.organizer}</p>
            </div>
          </div>
        )}
      </div>

      {c.description && (
        <div className="mb-4">
          <p className="text-xs font-medium uppercase mb-2" style={{ color: theme.primary }}>About</p>
          <p className="text-sm" style={{ color: "#4B5563" }}>{c.description}</p>
        </div>
      )}

      {tpl.button && (c.buttonUrl || c.rsvpUrl) && (
        <ActionButton href={c.buttonUrl || c.rsvpUrl} theme={theme}>{c.buttonText || "RSVP Now"}</ActionButton>
      )}
    </div>
  );
}

function BusinessView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const address = formatAddress(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);
  const companyName = c.companyName || c.company || "Business";

  return (
    <div>
      {/* Cover/Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-12">
            <img src={cover} alt="" className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-xl font-bold text-white">{companyName}</h1>
              {c.title && <p className="text-white/80 text-sm">{c.title}</p>}
            </div>
            {logo && (
              <img src={logo} alt="" className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl object-cover border-4 shadow-xl" style={{ borderColor: theme.secondary }} />
            )}
          </div>
        ) : (
          <div className="mb-6 -mx-8 -mt-8 px-8 pt-8 pb-6 text-center" style={{ backgroundColor: theme.primary }}>
            {logo && <img src={logo} alt="" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 shadow-lg" />}
            <h1 className="text-xl font-bold" style={{ color: theme.secondary }}>{companyName}</h1>
            {c.title && <p style={{ color: withOpacity(theme.secondary, 0.8) }}>{c.title}</p>}
          </div>
        )
      )}

      {!tpl.header && (
        <div className="flex items-center gap-4 mb-4">
          {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover" />}
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.primary }}>{companyName}</h1>
            {c.title && <p className="text-sm" style={{ color: "#6B7280" }}>{c.title}</p>}
          </div>
        </div>
      )}

      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}

      {/* Contact Info */}
      {tpl.split ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {c.phone && (
            <a href={`tel:${c.phone}`} className="rounded-xl p-3 border text-center" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Phone</p>
              <p className="text-sm" style={{ color: "#374151" }}>{c.phone}</p>
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} className="rounded-xl p-3 border text-center" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Email</p>
              <p className="text-sm truncate" style={{ color: "#374151" }}>{c.email}</p>
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {c.phone && (
            <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Phone</p>
              <a href={`tel:${c.phone}`} className="text-sm hover:underline" style={{ color: "#374151" }}>{c.phone}</a>
            </div>
          )}
          {c.email && (
            <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Email</p>
              <a href={`mailto:${c.email}`} className="text-sm hover:underline" style={{ color: "#374151" }}>{c.email}</a>
            </div>
          )}
          {c.website && (
            <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Website</p>
              <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: "#374151" }}>{c.website}</a>
            </div>
          )}
          {address && (
            <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Address</p>
              <p className="text-sm" style={{ color: "#374151" }}>{address}</p>
            </div>
          )}
        </div>
      )}

      {/* Business Hours */}
      {Array.isArray(c.schedule) && c.schedule.length > 0 && (
        <div className="mb-4 rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
          <p className="text-xs font-medium uppercase mb-3" style={{ color: theme.primary }}>Business Hours</p>
          <div className="space-y-1.5">
            {c.schedule.map((s: any, i: number) => (
              <div key={i} className="flex justify-between text-sm" style={{ color: "#4B5563" }}>
                <span className="font-medium">{s.day}</span>
                <span>{s.open && s.close ? `${s.open} - ${s.close}` : "Closed"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {Array.isArray(c.socialLinks) && c.socialLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {c.socialLinks.map((s: any, i: number) => (
            s.url && (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-all hover:scale-110"
                style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                {(s.platform || "").slice(0, 2)}
              </a>
            )
          ))}
        </div>
      )}

      {/* CTA Button */}
      {tpl.button && c.buttonUrl && (
        <ActionButton href={c.buttonUrl} theme={theme}>{c.buttonText || "Visit Website"}</ActionButton>
      )}
    </div>
  );
}

function MenuView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);
  const restaurantName = c.restaurantName || c.name || "Menu";

  return (
    <div>
      {/* Cover/Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              {logo && (
                <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mb-2 border-2 shadow-lg" style={{ borderColor: theme.secondary }} />
              )}
              <h1 className="text-xl font-bold text-white">{restaurantName}</h1>
              {c.description && <p className="text-white/80 text-sm">{c.description}</p>}
            </div>
          </div>
        ) : (
          <div className="mb-6 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
            {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" />}
            <h1 className="text-xl font-bold text-center" style={{ color: theme.secondary }}>{restaurantName}</h1>
            {c.description && <p className="text-center text-sm" style={{ color: withOpacity(theme.secondary, 0.8) }}>{c.description}</p>}
          </div>
        )
      )}

      {!tpl.header && (
        <div className="mb-4">
          <SectionTitle theme={theme}>{restaurantName}</SectionTitle>
          {c.description && <p className="text-sm text-center mb-2" style={{ color: "#4B5563" }}>{c.description}</p>}
        </div>
      )}

      {/* Menu Sections */}
      {Array.isArray(c.sections) && c.sections.map((section: any, i: number) => (
        <div key={i} className="mb-6">
          <h3 className="font-bold text-base mb-3 pb-2 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>{section.name}</h3>
          <div className="space-y-3">
            {Array.isArray(section.items) && section.items.map((item: any, j: number) => (
              <div key={j} className="flex justify-between gap-4 py-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium" style={{ color: "#111827" }}>{item.name}</p>
                    {Array.isArray(item.dietary) && item.dietary.length > 0 && (
                      <div className="flex gap-1">
                        {item.dietary.map((d: string, k: number) => (
                          <span key={k} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>{d}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.description && <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>{item.description}</p>}
                </div>
                {item.price && (
                  <span className="text-base font-bold shrink-0" style={{ color: theme.primary }}>{item.price}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Contact info */}
      {(c.phone || c.address) && (
        <div className="mt-6 pt-4 border-t text-center" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
          {c.phone && <p className="text-sm" style={{ color: "#6B7280" }}>📞 {c.phone}</p>}
          {c.address && <p className="text-sm" style={{ color: "#6B7280" }}>📍 {c.address}</p>}
        </div>
      )}
    </div>
  );
}

function LinksView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);
  const buttonStyle = c.buttonStyle || "rounded";
  const btnRadius = buttonStyle === "square" ? "rounded-lg" : "rounded-xl";

  return (
    <div>
      {/* Cover/Header with gradient background */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              {logo && (
                <img src={logo} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-3 shadow-lg" style={{ borderColor: theme.secondary }} />
              )}
              <h1 className="text-lg font-bold text-white">{c.title || "Links"}</h1>
              {c.description && <p className="text-white/80 text-sm px-4">{c.description}</p>}
            </div>
          </div>
        ) : (
          <div className="text-center mb-6 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}>
            {logo ? (
              <img src={logo} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-3 shadow" style={{ borderColor: theme.secondary }} />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-white/20">
                <span className="text-2xl">🔗</span>
              </div>
            )}
            <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{c.title || "Links"}</h1>
            {c.description && <p style={{ color: withOpacity(theme.secondary, 0.8) }}>{c.description}</p>}
          </div>
        )
      )}

      {!tpl.header && (
        <div className="flex items-center gap-4 mb-4">
          {logo && <img src={logo} alt="" className="w-12 h-12 rounded-full object-cover" />}
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.primary }}>{c.title || "Links"}</h1>
            {c.description && <p className="text-sm" style={{ color: "#6B7280" }}>{c.description}</p>}
          </div>
        </div>
      )}

      {/* Links Grid or List */}
      {tpl.split ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.isArray(c.links) && c.links.map((link: any, i: number) => (
            link.url && (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className={`block ${btnRadius} py-3 px-3 text-center font-medium text-sm transition-all hover:shadow-md`}
                style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                {link.text || link.label || "Link"}
              </a>
            )
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {Array.isArray(c.links) && c.links.map((link: any, i: number) => (
            link.url && (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className={`block ${btnRadius} py-3.5 px-4 text-center font-medium transition-all hover:shadow-md border`}
                style={{ borderColor: withOpacity(theme.primary, 0.3), color: theme.primary }}>
                {link.text || link.label || link.url}
              </a>
            )
          ))}
        </div>
      )}

      {/* Social Icons */}
      {Array.isArray(c.socials) && c.socials.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {c.socials.map((s: any, i: number) => (
            s.url && (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-all hover:scale-110"
                style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                {(s.platform || "").slice(0, 2)}
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function SocialView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);

  // Social platform icons/colors (simplified)
  const platformColors: Record<string, string> = {
    facebook: "#1877F2", twitter: "#1DA1F2", instagram: "#E4405F", linkedin: "#0A66C2",
    youtube: "#FF0000", tiktok: "#000000", pinterest: "#E60023", snapchat: "#FFFC00",
  };

  return (
    <div>
      {/* Cover/Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              {logo && (
                <img src={logo} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-3 shadow-lg" style={{ borderColor: theme.secondary }} />
              )}
              <h1 className="text-lg font-bold text-white">{c.title || "Social Media"}</h1>
              {c.description && <p className="text-white/80 text-sm">{c.description}</p>}
            </div>
          </div>
        ) : (
          <div className="text-center mb-6 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}>
            {logo ? (
              <img src={logo} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-white/20">
                <span className="text-2xl">📱</span>
              </div>
            )}
            <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{c.title || "Social Media"}</h1>
            {c.description && <p style={{ color: withOpacity(theme.secondary, 0.8) }}>{c.description}</p>}
          </div>
        )
      )}

      {!tpl.header && (
        <div className="text-center mb-4">
          {logo && <img src={logo} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />}
          <h1 className="text-lg font-bold" style={{ color: theme.primary }}>{c.title || "Social Media"}</h1>
          {c.description && <p className="text-sm" style={{ color: "#6B7280" }}>{c.description}</p>}
        </div>
      )}

      {/* Social Links */}
      {tpl.split ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.isArray(c.platforms) && c.platforms.map((p: any, i: number) => {
            const pColor = platformColors[(p.platform || "").toLowerCase()] || theme.primary;
            return p.url && (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                className="rounded-xl py-3 text-center font-medium text-sm text-white transition-all hover:scale-105"
                style={{ backgroundColor: pColor }}>
                {p.platform || "Link"}
              </a>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {Array.isArray(c.platforms) && c.platforms.map((p: any, i: number) => {
            const pColor = platformColors[(p.platform || "").toLowerCase()] || theme.primary;
            return p.url && (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                className="block rounded-xl py-3.5 px-4 text-center font-medium text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: pColor }}>
                {p.platform || p.url}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AppsView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);

  return (
    <div>
      {/* Cover/Header */}
      {tpl.header && cover && (
        <div className="relative -mx-8 -mt-8 mb-6">
          <img src={cover} alt="" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            {logo && (
              <img src={logo} alt="" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-2 shadow-xl" />
            )}
          </div>
        </div>
      )}

      {!cover && (
        <div className="text-center mb-4">
          {logo && <img src={logo} alt="" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 shadow-lg" />}
        </div>
      )}

      <SectionTitle theme={theme}>{c.appName || c.name || "Download App"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}

      <div className="space-y-3">
        {c.iosUrl && (
          <a href={c.iosUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-medium text-white bg-black hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on App Store
          </a>
        )}
        {c.androidUrl && (
          <a href={c.androidUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-medium text-white transition-colors"
            style={{ backgroundColor: "#34A853" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h15c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5zm9.5-14.5l-6 10h12l-6-10z"/>
            </svg>
            Get on Google Play
          </a>
        )}
        {c.website && <SecondaryButton href={c.website} theme={theme}>Visit Website</SecondaryButton>}
      </div>
    </div>
  );
}

function ReviewView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);

  // Platform colors for review sites
  const platformColors: Record<string, string> = {
    google: "#4285F4", yelp: "#D32323", tripadvisor: "#00AF87", facebook: "#1877F2", trustpilot: "#00B67A",
  };

  return (
    <div>
      {/* Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2 shadow-lg" />}
              <h1 className="text-lg font-bold text-white">{c.title || c.name || "Leave a Review"}</h1>
            </div>
          </div>
        ) : (
          <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
            {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" />}
            <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{c.title || c.name || "Leave a Review"}</h1>
            <div className="flex justify-center gap-1 mt-2">
              {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xl">⭐</span>)}
            </div>
          </div>
        )
      )}

      {!tpl.header && <SectionTitle theme={theme}>{c.title || c.name || "Leave a Review"}</SectionTitle>}

      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}

      <div className="space-y-3">
        {Array.isArray(c.reviewLinks) && c.reviewLinks.map((link: any, i: number) => {
          const pColor = platformColors[(link.platform || "").toLowerCase()] || theme.primary;
          return link.url && (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-medium text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: pColor }}>
              ⭐ Review on {link.platform || "Platform"}
            </a>
          );
        })}
      </div>

      {c.website && (
        <div className="mt-4 text-center">
          <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: theme.primary }}>
            Visit our website →
          </a>
        </div>
      )}
    </div>
  );
}

function FeedbackView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);

  return (
    <div>
      {/* Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2 shadow-lg" />}
              <h1 className="text-lg font-bold text-white">{c.title || "Feedback"}</h1>
            </div>
          </div>
        ) : (
          <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
            {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" />}
            <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{c.title || "Feedback"}</h1>
          </div>
        )
      )}

      {!tpl.header && <SectionTitle theme={theme}>{c.title || "Feedback"}</SectionTitle>}

      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}

      {/* Questions Preview */}
      {Array.isArray(c.questions) && c.questions.length > 0 && (
        <div className="space-y-3 mb-4">
          {c.questions.map((q: any, i: number) => (
            <div key={i} className="p-4 rounded-xl border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
              <p className="text-sm font-medium mb-2" style={{ color: "#111827" }}>{q.text}</p>
              {(q.type === 'rating' || !q.type) && (
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                      {n}
                    </div>
                  ))}
                </div>
              )}
              {q.type === 'text' && (
                <div className="h-16 rounded-lg border" style={{ borderColor: withOpacity(theme.primary, 0.2), backgroundColor: theme.tertiary }} />
              )}
            </div>
          ))}
        </div>
      )}

      {tpl.button && c.url && <ActionButton href={c.url} theme={theme}>Submit Feedback</ActionButton>}
    </div>
  );
}

function ProductView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const images = c.images || [];
  const cover = imgSrc(c.cover) || (images.length > 0 ? imgSrc(images[0]) : null);
  const logo = imgSrc(c.logo);
  const currencySymbol: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", CAD: "C$", AUD: "A$" };
  const priceDisplay = c.price ? `${currencySymbol[c.currency] || c.currency || "$"}${c.price}` : "";
  const galleryImages = cover && images.length > 0 ? images.slice(1) : images;

  return (
    <div>
      {/* Hero Image */}
      {cover && (
        <div className="relative -mx-8 -mt-8 mb-6">
          <img src={cover} alt="" className="w-full h-52 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {logo && (
            <img src={logo} alt="" className="absolute bottom-4 left-4 w-12 h-12 rounded-xl object-cover shadow-lg" />
          )}
        </div>
      )}

      <div className="text-center">
        <h1 className="text-xl font-bold" style={{ color: theme.primary }}>{c.productName || "Product"}</h1>

        {priceDisplay && (
          <div className="my-3">
            <span className="text-3xl font-black" style={{ color: theme.primary }}>{priceDisplay}</span>
            {c.originalPrice && (
              <span className="ml-2 text-lg line-through" style={{ color: "#9CA3AF" }}>${c.originalPrice}</span>
            )}
          </div>
        )}

        {c.description && <p className="text-sm mb-4" style={{ color: "#4B5563" }}>{c.description}</p>}
      </div>

      {/* Product Gallery */}
      {Array.isArray(galleryImages) && galleryImages.length > 0 && (
        <div className={tpl.split ? "grid grid-cols-3 gap-2 mb-4" : "grid grid-cols-2 gap-3 mb-4"}>
          {galleryImages.map((img: any, i: number) => {
            const src = imgSrc(img);
            return src ? <img key={i} src={src} alt="" className="w-full aspect-square object-cover rounded-xl" /> : null;
          })}
        </div>
      )}

      {/* Features */}
      {Array.isArray(c.features) && c.features.length > 0 && (
        <div className="mb-4">
          {c.features.map((f: string, i: number) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <span style={{ color: theme.primary }}>✓</span>
              <span className="text-sm" style={{ color: "#374151" }}>{f}</span>
            </div>
          ))}
        </div>
      )}

      {tpl.button && c.buyUrl && <ActionButton href={c.buyUrl} theme={theme}>{c.buyButtonText || "Buy Now"}</ActionButton>}
    </div>
  );
}

function PlaylistView({ content: c, theme }: ViewProps) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);

  // Platform colors
  const platformColors: Record<string, string> = {
    spotify: "#1DB954", apple: "#FA2D48", youtube: "#FF0000", soundcloud: "#FF5500", amazon: "#FF9900", deezer: "#FEAA2D",
  };

  return (
    <div>
      {/* Cover/Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <h1 className="text-lg font-bold text-white">{c.title || "Playlist"}</h1>
              {c.description && <p className="text-white/80 text-sm">{c.description}</p>}
            </div>
          </div>
        ) : (
          <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}>
            {logo ? (
              <img src={logo} alt="" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 shadow-xl" />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white/20">
                <span className="text-4xl">🎵</span>
              </div>
            )}
            <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{c.title || "Playlist"}</h1>
            {c.description && <p style={{ color: withOpacity(theme.secondary, 0.8) }}>{c.description}</p>}
          </div>
        )
      )}

      {!tpl.header && (
        <div className="text-center mb-4">
          {logo && <img src={logo} alt="" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 shadow-lg" />}
          <SectionTitle theme={theme}>{c.title || "Playlist"}</SectionTitle>
          {c.description && <p className="text-sm" style={{ color: "#4B5563" }}>{c.description}</p>}
        </div>
      )}

      {/* Platform Links */}
      <div className="space-y-3">
        {Array.isArray(c.platformLinks) && c.platformLinks.map((link: any, i: number) => {
          const pName = (link.platform || "").toLowerCase();
          const pColor = platformColors[pName] || theme.primary;
          return link.url && (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-medium text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: pColor }}>
              🎧 Listen on {link.platform || "Platform"}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function PdfView({ content: c, theme }: ViewProps) {
  const files: { url: string; name: string }[] = [];
  if (c.fileUrl) files.push({ url: c.fileUrl, name: c.fileName || "Document" });
  if (Array.isArray(c.pdfs)) {
    for (const p of c.pdfs) {
      const url = p.file || p.fileUrl || p.url;
      if (url) files.push({ url, name: p.name || "Document" });
    }
  }
  const mainUrl = files[0]?.url || c.url;
  const buttonText = c.buttonText || "Download PDF";

  return (
    <div>
      {/* Cover Image */}
      {c.cover && (
        <div className="relative -mx-8 -mt-8 mb-6">
          <img src={imgSrc(c.cover)} alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {c.logo && (
            <img src={imgSrc(c.logo)} alt="" className="absolute bottom-4 left-4 w-14 h-14 rounded-xl object-cover border-2 shadow-lg" style={{ borderColor: theme.secondary }} />
          )}
        </div>
      )}

      <SectionTitle theme={theme}>{c.title || "PDF Document"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}

      {/* Embedded PDF Viewer */}
      {mainUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
          <iframe
            src={`${mainUrl}#toolbar=1&navpanes=0&view=FitH`}
            className="w-full h-96 border-0"
            title="PDF Viewer"
          />
        </div>
      )}

      {/* Download buttons */}
      {files.length > 1 ? (
        <div className="space-y-3">
          {files.map((f, i) => (
            <SecondaryButton key={i} href={f.url} theme={theme}>{f.name}</SecondaryButton>
          ))}
        </div>
      ) : mainUrl ? (
        <ActionButton href={mainUrl} theme={theme}>{buttonText}</ActionButton>
      ) : null}
    </div>
  );
}

function Mp3View({ content: c, theme }: ViewProps) {
  const fileUrl = c.fileUrl || c.url;
  const buttonText = c.buttonText || "Download Audio";

  return (
    <div>
      {/* Cover/Album Art */}
      {c.cover && (
        <div className="relative -mx-8 -mt-8 mb-6">
          <img src={imgSrc(c.cover)} alt="" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <SectionTitle theme={theme}>{c.title || "Audio"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}

      {/* Album Art */}
      {c.cover ? (
        <img src={imgSrc(c.cover)} alt="" className="w-32 h-32 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
      ) : (
        <div className="w-32 h-32 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary }}>
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
          </svg>
        </div>
      )}

      {/* Audio Player */}
      {fileUrl && (
        <div className="mb-4">
          <audio src={fileUrl} controls className="w-full" preload="metadata">
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      {fileUrl && <ActionButton href={fileUrl} theme={theme}>{buttonText}</ActionButton>}
    </div>
  );
}

function ImagesView({ content: c, theme }: ViewProps) {
  const images = c.images || (c.fileUrl ? [c.fileUrl] : []);
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);
  const title = c.title || c.name || "Image Gallery";
  const buttonText = c.buttonText || "Download All";

  // Get first image as hero if no cover
  const heroImage = cover || (images.length > 0 ? imgSrc(images[0]) : null);
  const galleryImages = cover ? images : images.slice(1);

  return (
    <div>
      {/* Cover/Header */}
      {tpl.header && heroImage && (
        <div className="relative -mx-8 -mt-8 mb-6">
          <img src={heroImage} alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            {logo && (
              <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mb-2 border-2 shadow" style={{ borderColor: theme.secondary }} />
            )}
            <h1 className="text-lg font-bold text-white">{title}</h1>
            {c.description && <p className="text-white/80 text-sm">{c.description}</p>}
          </div>
        </div>
      )}

      {/* No cover header */}
      {tpl.header && !heroImage && (
        <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
          {logo && <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" />}
          <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{title}</h1>
          {c.description && <p style={{ color: withOpacity(theme.secondary, 0.8) }}>{c.description}</p>}
        </div>
      )}

      {!tpl.header && (
        <div className="mb-4">
          <SectionTitle theme={theme}>{title}</SectionTitle>
          {c.description && <p className="text-sm text-center mb-2" style={{ color: "#4B5563" }}>{c.description}</p>}
        </div>
      )}

      {/* Image Gallery */}
      {Array.isArray(galleryImages) && galleryImages.length > 0 ? (
        <div className={tpl.split ? "grid grid-cols-3 gap-2" : "grid grid-cols-2 gap-3"}>
          {galleryImages.map((img: any, i: number) => {
            const src = imgSrc(img);
            return src ? (
              <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block">
                <img src={src} alt="" className="w-full aspect-square rounded-xl object-cover shadow-sm hover:shadow-lg transition-shadow" />
              </a>
            ) : null;
          })}
        </div>
      ) : (!cover && images.length === 0) && (
        <div className="text-center py-8 rounded-xl" style={{ backgroundColor: theme.tertiary }}>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>No images available.</p>
        </div>
      )}

      {/* Download button */}
      {tpl.button && images.length > 0 && c.downloadUrl && (
        <div className="mt-4">
          <ActionButton href={c.downloadUrl} theme={theme}>{buttonText}</ActionButton>
        </div>
      )}
    </div>
  );
}

function VideoView({ content: c, theme }: ViewProps) {
  const url = c.url || c.fileUrl || "";
  const buttonText = c.buttonText || "Watch Video";

  // Detect video type
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be');
  const isVimeo = url?.includes('vimeo.com');

  // Extract YouTube video ID
  const getYouTubeId = (videoUrl: string): string | null => {
    const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // Extract Vimeo video ID
  const getVimeoId = (videoUrl: string): string | null => {
    const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const youtubeId = url && isYouTube ? getYouTubeId(url) : null;
  const vimeoId = url && isVimeo ? getVimeoId(url) : null;

  return (
    <div>
      {/* Cover Image */}
      {c.cover && (
        <div className="relative -mx-8 -mt-8 mb-6">
          <img src={imgSrc(c.cover)} alt="" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <SectionTitle theme={theme}>{c.title || "Video"}</SectionTitle>
      {c.description && <p className="text-sm mb-4 text-center" style={{ color: "#4B5563" }}>{c.description}</p>}

      {/* Embedded Video Player */}
      {youtubeId ? (
        <div className="mb-4 rounded-xl overflow-hidden aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video"
          />
        </div>
      ) : vimeoId ? (
        <div className="mb-4 rounded-xl overflow-hidden aspect-video">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Vimeo Video"
          />
        </div>
      ) : url ? (
        <div className="mb-4 rounded-xl overflow-hidden">
          <video src={url} controls className="w-full" preload="metadata" poster={c.cover ? imgSrc(c.cover) : undefined}>
            Your browser does not support video playback.
          </video>
        </div>
      ) : null}

      {url && <ActionButton href={url} theme={theme}>{buttonText}</ActionButton>}
    </div>
  );
}

function TextView({ content: c, theme }: ViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
          <span className="text-2xl">📝</span>
        </div>
        <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>Message</h1>
      </div>

      {/* Text Content */}
      <div className="rounded-xl p-5 border" style={{ borderColor: withOpacity(theme.primary, 0.2), backgroundColor: theme.tertiary }}>
        <p className="whitespace-pre-wrap text-base leading-relaxed" style={{ color: "#374151" }}>{c.text || ""}</p>
      </div>
    </div>
  );
}

function EmailView({ content: c, theme }: ViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
          <span className="text-2xl">✉️</span>
        </div>
        <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>Send Email</h1>
      </div>

      {/* Email Details */}
      <div className="space-y-3 mb-4">
        <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
          <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>To</p>
          <p className="text-base font-medium" style={{ color: "#111827" }}>{c.email}</p>
        </div>
        {c.subject && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Subject</p>
            <p className="text-sm" style={{ color: "#374151" }}>{c.subject}</p>
          </div>
        )}
        {c.message && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Message</p>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "#4B5563" }}>{c.message}</p>
          </div>
        )}
      </div>

      {c.email && (
        <ActionButton href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject || '')}&body=${encodeURIComponent(c.message || '')}`} theme={theme}>
          Compose Email
        </ActionButton>
      )}
    </div>
  );
}

function SMSView({ content: c, theme }: ViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
          <span className="text-2xl">💬</span>
        </div>
        <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>Send SMS</h1>
      </div>

      {/* SMS Details */}
      <div className="space-y-3 mb-4">
        <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
          <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>To</p>
          <p className="text-xl font-bold" style={{ color: "#111827" }}>{c.phone}</p>
        </div>
        {c.message && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2), backgroundColor: theme.tertiary }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: theme.primary }}>Message</p>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "#4B5563" }}>{c.message}</p>
          </div>
        )}
      </div>

      {c.phone && (
        <ActionButton href={`sms:${c.phone}${c.message ? `?body=${encodeURIComponent(c.message)}` : ''}`} theme={theme}>
          Send Text Message
        </ActionButton>
      )}
    </div>
  );
}

function WhatsAppView({ content: c, theme }: ViewProps) {
  const phone = (c.phone || "").replace(/\D/g, "");

  return (
    <div>
      {/* WhatsApp Header */}
      <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: "#25D366" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
          <span className="text-3xl">💬</span>
        </div>
        <h1 className="text-lg font-bold text-white">WhatsApp</h1>
        <p className="text-white/80 text-sm">Start a conversation</p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
          <p className="text-xs font-medium uppercase mb-1" style={{ color: "#25D366" }}>Phone Number</p>
          <p className="text-xl font-bold" style={{ color: "#111827" }}>{c.phone}</p>
        </div>
        {c.message && (
          <div className="rounded-xl p-4 border" style={{ borderColor: withOpacity(theme.primary, 0.2), backgroundColor: "#DCF8C6" }}>
            <p className="text-xs font-medium uppercase mb-1" style={{ color: "#25D366" }}>Pre-filled Message</p>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "#374151" }}>{c.message}</p>
          </div>
        )}
      </div>

      {phone && (
        <a
          href={`https://wa.me/${phone}${c.message ? `?text=${encodeURIComponent(c.message)}` : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3.5 px-4 rounded-xl font-medium text-white transition-colors hover:shadow-lg"
          style={{ backgroundColor: "#25D366" }}
        >
          Open WhatsApp
        </a>
      )}
    </div>
  );
}

function PhoneView({ content: c, theme }: ViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
          <span className="text-3xl">📞</span>
        </div>
        <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{c.name || "Phone Call"}</h1>
      </div>

      {/* Phone Number */}
      <div className="text-center mb-6">
        <p className="text-3xl font-black tracking-wide" style={{ color: theme.primary }}>{c.phone}</p>
      </div>

      {c.phone && <ActionButton href={`tel:${c.phone}`} theme={theme}>Call Now</ActionButton>}
    </div>
  );
}

function CalendarView({ content: c, theme }: ViewProps) {
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
  };

  const start = c.startDate ? formatEventDate(c.startDate) : null;
  const end = c.endDate ? formatEventDate(c.endDate) : null;

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
        <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center mx-auto mb-2 bg-white shadow-lg">
          {start && (
            <>
              <span className="text-xs font-medium" style={{ color: theme.primary }}>{start.date.split(',')[0]}</span>
              <span className="text-xl font-black" style={{ color: "#111827" }}>{new Date(c.startDate).getDate()}</span>
            </>
          )}
        </div>
        <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{c.eventTitle || c.title || "Calendar Event"}</h1>
      </div>

      {/* Event Details */}
      <div className="space-y-3">
        {start && (
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.primaryLight }}>
            <span className="text-xl">📅</span>
            <div>
              <p className="text-xs font-medium uppercase" style={{ color: theme.primary }}>When</p>
              <p className="text-sm font-medium" style={{ color: "#374151" }}>{start.date} at {start.time}</p>
              {end && <p className="text-xs" style={{ color: "#6B7280" }}>Until {end.date} at {end.time}</p>}
            </div>
          </div>
        )}

        {c.location && (
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.primaryLight }}>
            <span className="text-xl">📍</span>
            <div>
              <p className="text-xs font-medium uppercase" style={{ color: theme.primary }}>Where</p>
              <p className="text-sm font-medium" style={{ color: "#374151" }}>{c.location}</p>
            </div>
          </div>
        )}

        {c.organizerName && (
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.primaryLight }}>
            <span className="text-xl">👤</span>
            <div>
              <p className="text-xs font-medium uppercase" style={{ color: theme.primary }}>Organizer</p>
              <p className="text-sm font-medium" style={{ color: "#374151" }}>{c.organizerName}</p>
            </div>
          </div>
        )}

        {c.description && (
          <div className="p-4 rounded-xl border" style={{ borderColor: withOpacity(theme.primary, 0.2) }}>
            <p className="text-xs font-medium uppercase mb-2" style={{ color: theme.primary }}>About</p>
            <p className="text-sm" style={{ color: "#4B5563" }}>{c.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WebsiteView({ content: c, theme, name }: ViewProps & { name?: string }) {
  const tpl = getLayout(c);
  const cover = imgSrc(c.cover);
  const logo = imgSrc(c.logo);
  const url = c.url || "";
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div>
      {/* Header */}
      {tpl.header && (
        cover ? (
          <div className="relative -mx-8 -mt-8 mb-6">
            <img src={cover} alt="" className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              {logo && <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mb-2 shadow-lg" />}
              <h1 className="text-lg font-bold text-white">{name || "Website"}</h1>
            </div>
          </div>
        ) : (
          <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: theme.primary }}>
            {logo ? (
              <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" />
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                <span className="text-2xl">🌐</span>
              </div>
            )}
            <h1 className="text-lg font-bold" style={{ color: theme.secondary }}>{name || "Website"}</h1>
          </div>
        )
      )}

      {!tpl.header && <SectionTitle theme={theme}>{name || "Website"}</SectionTitle>}

      {displayUrl && (
        <p className="text-center text-sm mb-4 truncate" style={{ color: "#6B7280" }}>{displayUrl}</p>
      )}

      {url && <ActionButton href={fullUrl} theme={theme}>Visit Website</ActionButton>}

      {Array.isArray(c.websites) && c.websites.length > 0 && (
        <div className="space-y-3 mt-4">
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
  const isInstagram = type === "instagram";
  const label = isInstagram ? "Instagram" : "Facebook";
  const brandColor = isInstagram ? "#E4405F" : "#1877F2";
  const logo = imgSrc(c.logo);
  const username = c.username || url.split('/').pop() || label;

  return (
    <div>
      {/* Header with brand color */}
      <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ background: isInstagram ? "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80)" : brandColor }}>
        {logo ? (
          <img src={logo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-4 shadow-lg" style={{ borderColor: "#fff" }} />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
            <span className="text-4xl">{isInstagram ? "📸" : "👍"}</span>
          </div>
        )}
        <h1 className="text-xl font-bold text-white">{label}</h1>
        <p className="text-white/80 text-sm">@{username}</p>
      </div>

      {url && (
        <a
          href={url.startsWith("http") ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3.5 px-4 rounded-xl font-medium text-white transition-colors hover:shadow-lg"
          style={{ backgroundColor: brandColor }}
        >
          Follow on {label}
        </a>
      )}
    </div>
  );
}

function BitcoinView({ content: c, theme }: ViewProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (c.address) {
      navigator.clipboard.writeText(c.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-4 -mx-8 -mt-8 px-8 pt-8 pb-6" style={{ backgroundColor: "#F7931A" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
          <span className="text-3xl">₿</span>
        </div>
        <h1 className="text-lg font-bold text-white">Bitcoin</h1>
        <p className="text-white/80 text-sm">Send Bitcoin payment</p>
      </div>

      {/* Wallet Address */}
      {c.address && (
        <div className="rounded-xl p-4 mb-4 border" style={{ borderColor: withOpacity("#F7931A", 0.3) }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase" style={{ color: "#F7931A" }}>Wallet Address</p>
            <button
              onClick={copyAddress}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: copied ? "#10B981" : withOpacity("#F7931A", 0.1), color: copied ? "#fff" : "#F7931A" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-sm font-mono break-all select-all" style={{ color: "#111827" }}>{c.address}</p>
        </div>
      )}

      {c.amount && (
        <div className="text-center mb-4">
          <p className="text-xs uppercase mb-1" style={{ color: "#6B7280" }}>Amount</p>
          <p className="text-2xl font-bold" style={{ color: "#F7931A" }}>{c.amount} BTC</p>
        </div>
      )}

      {c.address && (
        <a
          href={`bitcoin:${c.address}${c.amount ? `?amount=${c.amount}` : ''}`}
          className="block w-full text-center py-3.5 px-4 rounded-xl font-medium text-white transition-colors hover:shadow-lg"
          style={{ backgroundColor: "#F7931A" }}
        >
          Open Wallet App
        </a>
      )}
    </div>
  );
}
