"use client";

import { useEffect, useState, use } from "react";
import Spinner from "@/components/ui/Spinner";

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

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-50"><Spinner size="lg" /></div>;
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

  const { type, content, name } = data;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-12 px-4 pb-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {type === "vcard" && <VCardView content={content} />}
        {type === "wifi" && <WiFiView content={content} />}
        {type === "coupon" && <CouponView content={content} />}
        {type === "event" && <EventView content={content} />}
        {type === "business" && <BusinessView content={content} />}
        {type === "menu" && <MenuView content={content} />}
        {type === "links" && <LinksView content={content} />}
        {type === "social" && <SocialView content={content} />}
        {type === "apps" && <AppsView content={content} />}
        {type === "review" && <ReviewView content={content} />}
        {type === "feedback" && <FeedbackView content={content} />}
        {type === "product" && <ProductView content={content} />}
        {type === "playlist" && <PlaylistView content={content} />}
        {type === "pdf" && <FileView content={content} label="PDF Document" />}
        {type === "mp3" && <FileView content={content} label="Audio File" />}
        {type === "images" && <ImagesView content={content} />}
        {type === "text" && <TextView content={content} />}
        {type === "email" && <EmailView content={content} />}
        {type === "sms" && <SMSView content={content} />}
        {type === "whatsapp" && <WhatsAppView content={content} />}
        {type === "phone" && <PhoneView content={content} />}
        {type === "calendar" && <CalendarView content={content} />}
        {type === "website" && <WebsiteView content={content} name={name} />}
        {type === "video" && <VideoView content={content} />}
        {(type === "instagram" || type === "facebook") && <SocialRedirectView content={content} type={type} />}
        {type === "bitcoin" && <BitcoinView content={content} />}
        {!["vcard","wifi","coupon","event","business","menu","links","social","apps","review","feedback","product","playlist","pdf","mp3","images","text","email","sms","whatsapp","phone","calendar","website","video","instagram","facebook","bitcoin"].includes(type) && (
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-4">{name || "QR Content"}</h1>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap text-left bg-gray-50 p-4 rounded-lg">{JSON.stringify(content, null, 2)}</pre>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Powered by QRCraft</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Components ─────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">{children}</h1>;
}

function InfoRow({ label, value, href }: { label: string; value?: string; href?: string }) {
  if (!value) return null;
  return (
    <p className="text-sm">
      <span className="text-gray-500">{label}:</span>{" "}
      {href ? <a href={href} className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">{value}</a> : <span className="text-gray-900">{value}</span>}
    </p>
  );
}

function ActionButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="block w-full text-center py-3 px-4 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors">
      {children}
    </a>
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

function VCardView({ content: c }: { content: any }) {
  const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ");
  const initials = (c.firstName?.[0] || "") + (c.lastName?.[0] || "");
  const address = formatAddress(c);
  return (
    <div className="text-center">
      {c.photo ? (
        <img src={imgSrc(c.photo)} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
      ) : (
        <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">{initials}</span>
        </div>
      )}
      {fullName && <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>}
      {c.title && <p className="text-gray-500">{c.title}</p>}
      {c.company && <p className="text-gray-500">{c.company}</p>}
      <div className="mt-6 space-y-3 text-left">
        <InfoRow label="Phone" value={c.phone} href={`tel:${c.phone}`} />
        <InfoRow label="Mobile" value={c.mobilePhone} href={`tel:${c.mobilePhone}`} />
        <InfoRow label="Work" value={c.workPhone} href={`tel:${c.workPhone}`} />
        <InfoRow label="Fax" value={c.fax} />
        <InfoRow label="Email" value={c.email} href={`mailto:${c.email}`} />
        <InfoRow label="Website" value={c.website} href={c.website} />
        {address && <InfoRow label="Address" value={address} />}
        {c.note && <p className="text-sm text-gray-500 mt-2">{c.note}</p>}
      </div>
      {Array.isArray(c.socials) && c.socials.length > 0 && (
        <div className="mt-4 space-y-2">
          {c.socials.map((s: any, i: number) => (
            s.url && <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="block text-sm text-violet-600 hover:underline capitalize">{s.platform || "Link"}</a>
          ))}
        </div>
      )}
    </div>
  );
}

function WiFiView({ content: c }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>WiFi Network</SectionTitle>
      <div className="space-y-3 text-left">
        <InfoRow label="Network" value={c.ssid} />
        <InfoRow label="Password" value={c.password} />
        <InfoRow label="Security" value={c.authType || c.encryption} />
        {c.hidden && <p className="text-sm text-gray-500">Hidden network</p>}
      </div>
    </div>
  );
}

function CouponView({ content: c }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>{c.title || "Coupon"}</SectionTitle>
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl p-6 my-4">
        <p className="text-3xl font-bold">{c.badge || c.discount}</p>
      </div>
      {c.code && <p className="text-sm text-gray-500">Code: <span className="font-mono font-bold text-gray-900">{c.code}</span></p>}
      {c.description && <p className="text-sm text-gray-600 mt-3">{c.description}</p>}
      {c.expiryDate && <p className="text-sm text-gray-500 mt-2">Expires: {new Date(c.expiryDate).toLocaleDateString()}</p>}
      {c.terms && <p className="text-xs text-gray-400 mt-4">{c.terms}</p>}
      {c.buttonUrl && (
        <div className="mt-4">
          <ActionButton href={c.buttonUrl}>{c.buttonText || "Redeem Now"}</ActionButton>
        </div>
      )}
    </div>
  );
}

function EventView({ content: c }: { content: any }) {
  return (
    <div>
      <SectionTitle>{c.title || "Event"}</SectionTitle>
      <div className="space-y-2">
        {c.startDate && <InfoRow label="Start" value={new Date(c.startDate).toLocaleString()} />}
        {c.endDate && <InfoRow label="End" value={new Date(c.endDate).toLocaleString()} />}
        <InfoRow label="Location" value={c.location} />
        <InfoRow label="Organizer" value={c.organizer} />
        {c.description && <p className="text-sm text-gray-600 mt-3">{c.description}</p>}
      </div>
      {(c.buttonUrl || c.rsvpUrl) && (
        <div className="mt-4">
          <ActionButton href={c.buttonUrl || c.rsvpUrl}>{c.buttonText || "RSVP"}</ActionButton>
        </div>
      )}
    </div>
  );
}

function BusinessView({ content: c }: { content: any }) {
  const address = formatAddress(c);
  return (
    <div>
      {c.cover && <img src={imgSrc(c.cover)} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />}
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-16 h-16 rounded-full object-cover mx-auto -mt-12 mb-2 border-4 border-white shadow" />}
      <SectionTitle>{c.companyName || c.company || "Business"}</SectionTitle>
      {c.title && <p className="text-sm font-medium text-gray-700 text-center mb-1">{c.title}</p>}
      {c.description && <p className="text-sm text-gray-600 mb-4 text-center">{c.description}</p>}
      <div className="space-y-2">
        <InfoRow label="Phone" value={c.phone} href={`tel:${c.phone}`} />
        <InfoRow label="Email" value={c.email} href={`mailto:${c.email}`} />
        <InfoRow label="Website" value={c.website} href={c.website} />
        {address && <InfoRow label="Address" value={address} />}
      </div>
      {Array.isArray(c.schedule) && c.schedule.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Hours</p>
          {c.schedule.map((s: any, i: number) => (
            <div key={i} className="flex justify-between text-sm text-gray-600 py-0.5">
              <span>{s.day}</span>
              <span>{s.open && s.close ? `${s.open} - ${s.close}` : "Closed"}</span>
            </div>
          ))}
        </div>
      )}
      {Array.isArray(c.socialLinks) && c.socialLinks.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {c.socialLinks.map((s: any, i: number) => (
            s.url && <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-100 capitalize">
              {s.platform || "Link"}
            </a>
          ))}
        </div>
      )}
      {c.buttonUrl && (
        <div className="mt-4">
          <ActionButton href={c.buttonUrl}>{c.buttonText || "Visit Website"}</ActionButton>
        </div>
      )}
    </div>
  );
}

function MenuView({ content: c }: { content: any }) {
  return (
    <div>
      <SectionTitle>{c.restaurantName || "Menu"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4 text-center">{c.description}</p>}
      {Array.isArray(c.sections) && c.sections.map((section: any, i: number) => (
        <div key={i} className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">{section.name}</h3>
          {Array.isArray(section.items) && section.items.map((item: any, j: number) => (
            <div key={j} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                {Array.isArray(item.dietary) && item.dietary.length > 0 && (
                  <div className="flex gap-1 mt-0.5">
                    {item.dietary.map((d: string, k: number) => (
                      <span key={k} className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{d}</span>
                    ))}
                  </div>
                )}
              </div>
              {item.price && <span className="text-sm font-medium text-gray-900 shrink-0 ml-4">{item.price}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function LinksView({ content: c }: { content: any }) {
  return (
    <div>
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />}
      <SectionTitle>{c.title || "Links"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4 text-center">{c.description}</p>}
      <div className="space-y-3">
        {Array.isArray(c.links) && c.links.map((link: any, i: number) => (
          link.url && (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-violet-50 text-violet-700 rounded-xl font-medium hover:bg-violet-100 transition-colors border border-violet-200">
              {link.text || link.label || link.url}
            </a>
          )
        ))}
      </div>
      {Array.isArray(c.socials) && c.socials.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {c.socials.map((s: any, i: number) => (
            s.url && <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 capitalize">
              {s.platform || "Link"}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialView({ content: c }: { content: any }) {
  return (
    <div>
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />}
      <SectionTitle>{c.title || "Social Media"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4 text-center">{c.description}</p>}
      <div className="space-y-3">
        {Array.isArray(c.platforms) && c.platforms.map((p: any, i: number) => (
          p.url && (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-violet-50 text-violet-700 rounded-xl font-medium hover:bg-violet-100 transition-colors border border-violet-200 capitalize">
              {p.platform || p.url}
            </a>
          )
        ))}
      </div>
    </div>
  );
}

function AppsView({ content: c }: { content: any }) {
  return (
    <div>
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-20 h-20 rounded-xl object-cover mx-auto mb-4" />}
      <SectionTitle>{c.appName || c.name || "Download App"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4 text-center">{c.description}</p>}
      <div className="space-y-3">
        {c.iosUrl && <ActionButton href={c.iosUrl}>Download on App Store</ActionButton>}
        {c.androidUrl && <ActionButton href={c.androidUrl}>Get on Google Play</ActionButton>}
        {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer"
          className="block w-full text-center py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
          Visit Website
        </a>}
      </div>
    </div>
  );
}

function ReviewView({ content: c }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>{c.title || c.name || "Leave a Review"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4">{c.description}</p>}
      <div className="space-y-3">
        {Array.isArray(c.reviewLinks) && c.reviewLinks.map((link: any, i: number) => (
          link.url && (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-violet-50 text-violet-700 rounded-xl font-medium hover:bg-violet-100 transition-colors border border-violet-200 capitalize">
              {link.platform || "Review"}
            </a>
          )
        ))}
      </div>
      {c.website && (
        <div className="mt-3">
          <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-600 hover:underline">Visit website</a>
        </div>
      )}
    </div>
  );
}

function FeedbackView({ content: c }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>{c.title || "Feedback"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4">{c.description}</p>}
      {Array.isArray(c.questions) && c.questions.length > 0 && (
        <div className="space-y-4 text-left mb-4">
          {c.questions.map((q: any, i: number) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{q.text}</p>
              <p className="text-xs text-gray-500 capitalize">{q.type || "rating"}</p>
            </div>
          ))}
        </div>
      )}
      {c.url && <ActionButton href={c.url}>Give Feedback</ActionButton>}
    </div>
  );
}

function ProductView({ content: c }: { content: any }) {
  const images = c.images || [];
  const currencySymbol: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", CAD: "C$", AUD: "A$" };
  const priceDisplay = c.price ? `${currencySymbol[c.currency] || c.currency || "$"}${c.price}` : "";
  return (
    <div>
      {Array.isArray(images) && images.length > 0 && (
        <img src={imgSrc(images[0])} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
      )}
      <SectionTitle>{c.productName || "Product"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4 text-center">{c.description}</p>}
      {priceDisplay && <p className="text-2xl font-bold text-gray-900 text-center mb-4">{priceDisplay}</p>}
      {Array.isArray(images) && images.length > 1 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {images.slice(1).map((img: any, i: number) => {
            const src = imgSrc(img);
            return src ? <img key={i} src={src} alt="" className="w-full h-20 object-cover rounded-lg" /> : null;
          })}
        </div>
      )}
      {c.buyUrl && <ActionButton href={c.buyUrl}>{c.buyButtonText || "Buy Now"}</ActionButton>}
    </div>
  );
}

function PlaylistView({ content: c }: { content: any }) {
  return (
    <div>
      {c.logo && <img src={imgSrc(c.logo)} alt="" className="w-20 h-20 rounded-xl object-cover mx-auto mb-4" />}
      <SectionTitle>{c.title || "Playlist"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4 text-center">{c.description}</p>}
      <div className="space-y-3">
        {Array.isArray(c.platformLinks) && c.platformLinks.map((link: any, i: number) => (
          link.url && (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-violet-50 text-violet-700 rounded-xl font-medium hover:bg-violet-100 transition-colors border border-violet-200 capitalize">
              {link.platform || "Listen"}
            </a>
          )
        ))}
      </div>
    </div>
  );
}

function FileView({ content: c, label }: { content: any; label: string }) {
  // PDFs can be stored as pdfs array [{file, name}] or as single fileUrl
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
      <SectionTitle>{c.title || label}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4">{c.description}</p>}
      {files.length > 1 ? (
        <div className="space-y-3">
          {files.map((f, i) => (
            <ActionButton key={i} href={f.url}>{f.name || `${label} ${i + 1}`}</ActionButton>
          ))}
        </div>
      ) : mainUrl ? (
        <ActionButton href={mainUrl}>Open {label}</ActionButton>
      ) : null}
    </div>
  );
}

function ImagesView({ content: c }: { content: any }) {
  const images = c.images || (c.fileUrl ? [c.fileUrl] : []);
  return (
    <div>
      <SectionTitle>{c.title || c.name || "Images"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4 text-center">{c.description}</p>}
      <div className="grid grid-cols-2 gap-2">
        {Array.isArray(images) && images.map((img: any, i: number) => {
          const src = imgSrc(img);
          return src ? <img key={i} src={src} alt="" className="w-full rounded-lg object-cover" /> : null;
        })}
      </div>
      {(!Array.isArray(images) || images.length === 0) && (
        <p className="text-sm text-gray-400 text-center">No images available.</p>
      )}
    </div>
  );
}

function TextView({ content: c }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>Message</SectionTitle>
      <p className="text-gray-700 whitespace-pre-wrap">{c.text || ""}</p>
    </div>
  );
}

function EmailView({ content: c }: { content: any }) {
  return (
    <div>
      <SectionTitle>Send Email</SectionTitle>
      <div className="space-y-2">
        <InfoRow label="To" value={c.email} href={`mailto:${c.email}`} />
        <InfoRow label="Subject" value={c.subject} />
        {c.message && <p className="text-sm text-gray-600 mt-2">{c.message}</p>}
      </div>
      {c.email && (
        <div className="mt-4">
          <ActionButton href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject || '')}&body=${encodeURIComponent(c.message || '')}`}>
            Send Email
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function SMSView({ content: c }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>Send SMS</SectionTitle>
      <div className="space-y-2 text-left">
        <InfoRow label="To" value={c.phone} href={`sms:${c.phone}`} />
        {c.message && <p className="text-sm text-gray-600 mt-2">{c.message}</p>}
      </div>
      {c.phone && (
        <div className="mt-4">
          <ActionButton href={`sms:${c.phone}${c.message ? `?body=${encodeURIComponent(c.message)}` : ''}`}>
            Send Message
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function WhatsAppView({ content: c }: { content: any }) {
  const phone = (c.phone || '').replace(/\D/g, '');
  return (
    <div className="text-center">
      <SectionTitle>WhatsApp</SectionTitle>
      <div className="space-y-2 text-left mb-4">
        <InfoRow label="Phone" value={c.phone} />
        {c.message && <p className="text-sm text-gray-600 mt-2">{c.message}</p>}
      </div>
      {phone && (
        <ActionButton href={`https://wa.me/${phone}${c.message ? `?text=${encodeURIComponent(c.message)}` : ''}`}>
          Open WhatsApp
        </ActionButton>
      )}
    </div>
  );
}

function PhoneView({ content: c }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>{c.name || "Phone Call"}</SectionTitle>
      <p className="text-2xl font-bold text-gray-900 mb-4">{c.phone}</p>
      {c.phone && <ActionButton href={`tel:${c.phone}`}>Call Now</ActionButton>}
    </div>
  );
}

function CalendarView({ content: c }: { content: any }) {
  return (
    <div>
      <SectionTitle>{c.eventTitle || c.title || "Calendar Event"}</SectionTitle>
      <div className="space-y-2">
        {c.startDate && <InfoRow label="Start" value={new Date(c.startDate).toLocaleString()} />}
        {c.endDate && <InfoRow label="End" value={new Date(c.endDate).toLocaleString()} />}
        <InfoRow label="Location" value={c.location} />
        {c.organizerName && <InfoRow label="Organizer" value={c.organizerName} />}
        {c.description && <p className="text-sm text-gray-600 mt-3">{c.description}</p>}
      </div>
    </div>
  );
}

function WebsiteView({ content: c, name }: { content: any; name?: string }) {
  const url = c.url || "";
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  return (
    <div className="text-center">
      <SectionTitle>{name || "Website"}</SectionTitle>
      {url && <ActionButton href={fullUrl}>Visit Website</ActionButton>}
      {Array.isArray(c.websites) && c.websites.length > 0 && (
        <div className="space-y-3 mt-3">
          {c.websites.map((w: any, i: number) => (
            w.url && (
              <a key={i} href={w.url.startsWith("http") ? w.url : `https://${w.url}`} target="_blank" rel="noopener noreferrer"
                className="block w-full text-center py-3 px-4 bg-violet-50 text-violet-700 rounded-xl font-medium hover:bg-violet-100 transition-colors border border-violet-200">
                {w.name || w.url}
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function VideoView({ content: c }: { content: any }) {
  const url = c.url || c.fileUrl || "";
  return (
    <div className="text-center">
      <SectionTitle>{c.title || "Video"}</SectionTitle>
      {c.description && <p className="text-sm text-gray-600 mb-4">{c.description}</p>}
      {url && <ActionButton href={url}>Watch Video</ActionButton>}
    </div>
  );
}

function SocialRedirectView({ content: c, type }: { content: any; type: string }) {
  const url = c.url || "";
  const label = type === "instagram" ? "Instagram" : "Facebook";
  return (
    <div className="text-center">
      <SectionTitle>{label}</SectionTitle>
      {url && <ActionButton href={url.startsWith("http") ? url : `https://${url}`}>Open {label}</ActionButton>}
    </div>
  );
}

function BitcoinView({ content: c }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>Bitcoin</SectionTitle>
      {c.address && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
          <p className="text-sm font-mono text-gray-900 break-all">{c.address}</p>
        </div>
      )}
      {c.address && <ActionButton href={`bitcoin:${c.address}`}>Open Wallet</ActionButton>}
    </div>
  );
}
