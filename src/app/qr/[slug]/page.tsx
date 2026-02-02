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

function VCardView({ content }: { content: any }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white text-2xl font-bold">{(content.firstName?.[0] || "") + (content.lastName?.[0] || "")}</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900">{content.firstName} {content.lastName}</h1>
      {content.title && <p className="text-gray-500">{content.title}</p>}
      {content.org && <p className="text-gray-500">{content.org}</p>}
      <div className="mt-6 space-y-3 text-left">
        <InfoRow label="Phone" value={content.phone} href={`tel:${content.phone}`} />
        <InfoRow label="Email" value={content.email} href={`mailto:${content.email}`} />
        <InfoRow label="Website" value={content.website} href={content.website} />
        <InfoRow label="Address" value={content.address} />
      </div>
    </div>
  );
}

function WiFiView({ content }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>WiFi Network</SectionTitle>
      <div className="space-y-3 text-left">
        <InfoRow label="Network" value={content.ssid} />
        <InfoRow label="Password" value={content.password} />
        <InfoRow label="Security" value={content.encryption} />
      </div>
    </div>
  );
}

function CouponView({ content }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>{content.title || "Coupon"}</SectionTitle>
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl p-6 my-4">
        <p className="text-3xl font-bold">{content.discount}</p>
      </div>
      {content.code && <p className="text-sm text-gray-500">Code: <span className="font-mono font-bold text-gray-900">{content.code}</span></p>}
      {content.description && <p className="text-sm text-gray-600 mt-3">{content.description}</p>}
      {content.expiryDate && <p className="text-sm text-gray-500 mt-2">Expires: {content.expiryDate}</p>}
      {content.terms && <p className="text-xs text-gray-400 mt-4">{content.terms}</p>}
    </div>
  );
}

function EventView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.title || "Event"}</SectionTitle>
      <div className="space-y-2">
        {content.startDate && <InfoRow label="Start" value={new Date(content.startDate).toLocaleString()} />}
        {content.endDate && <InfoRow label="End" value={new Date(content.endDate).toLocaleString()} />}
        <InfoRow label="Location" value={content.location} />
        <InfoRow label="Organizer" value={content.organizer} />
        {content.description && <p className="text-sm text-gray-600 mt-3">{content.description}</p>}
      </div>
    </div>
  );
}

function BusinessView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.companyName || "Business"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4 text-center">{content.description}</p>}
      <div className="space-y-2">
        <InfoRow label="Phone" value={content.phone} href={`tel:${content.phone}`} />
        <InfoRow label="Email" value={content.email} href={`mailto:${content.email}`} />
        <InfoRow label="Website" value={content.website} href={content.website} />
        <InfoRow label="Address" value={content.address} />
      </div>
    </div>
  );
}

function MenuView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.restaurantName || "Menu"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4 text-center">{content.description}</p>}
      {Array.isArray(content.sections) && content.sections.map((section: any, i: number) => (
        <div key={i} className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">{section.name}</h3>
          {Array.isArray(section.items) && section.items.map((item: any, j: number) => (
            <div key={j} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
              </div>
              {item.price && <span className="text-sm font-medium text-gray-900">{item.price}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function LinksView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.title || "Links"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4 text-center">{content.description}</p>}
      <div className="space-y-3">
        {Array.isArray(content.links) && content.links.map((link: any, i: number) => (
          link.url && (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-violet-50 text-violet-700 rounded-xl font-medium hover:bg-violet-100 transition-colors border border-violet-200">
              {link.label || link.url}
            </a>
          )
        ))}
      </div>
    </div>
  );
}

function SocialView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.title || "Social Media"}</SectionTitle>
      <div className="space-y-3">
        {Array.isArray(content.platforms) && content.platforms.map((p: any, i: number) => (
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

function AppsView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.appName || "Download App"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4 text-center">{content.description}</p>}
      <div className="space-y-3">
        {content.iosUrl && <ActionButton href={content.iosUrl}>Download on App Store</ActionButton>}
        {content.androidUrl && <ActionButton href={content.androidUrl}>Get on Google Play</ActionButton>}
        {content.otherUrl && <ActionButton href={content.otherUrl}>Download</ActionButton>}
      </div>
    </div>
  );
}

function ReviewView({ content }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>{content.title || "Leave a Review"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4">{content.description}</p>}
      {content.url && <ActionButton href={content.url}>Write a Review</ActionButton>}
      {Array.isArray(content.platforms) && content.platforms.map((p: any, i: number) => (
        p.url && (
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
            className="block w-full text-center py-3 px-4 mt-3 bg-violet-50 text-violet-700 rounded-xl font-medium hover:bg-violet-100 transition-colors border border-violet-200 capitalize">
            {p.platform || "Review"}
          </a>
        )
      ))}
    </div>
  );
}

function FeedbackView({ content }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>{content.title || "Feedback"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4">{content.description}</p>}
      {content.url && <ActionButton href={content.url}>Give Feedback</ActionButton>}
    </div>
  );
}

function ProductView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.productName || "Product"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4 text-center">{content.description}</p>}
      {content.price && <p className="text-2xl font-bold text-gray-900 text-center mb-4">{content.price}</p>}
      <div className="space-y-2 mb-4">
        {content.features && <p className="text-sm text-gray-600">{content.features}</p>}
      </div>
      {content.buyUrl && <ActionButton href={content.buyUrl}>Buy Now</ActionButton>}
    </div>
  );
}

function PlaylistView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.title || "Playlist"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4 text-center">{content.description}</p>}
      <div className="space-y-3">
        {Array.isArray(content.platformLinks) && content.platformLinks.map((link: any, i: number) => (
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

function FileView({ content, label }: { content: any; label: string }) {
  const url = content.fileUrl || content.url;
  return (
    <div className="text-center">
      <SectionTitle>{content.title || label}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4">{content.description}</p>}
      {url && <ActionButton href={url}>Open {label}</ActionButton>}
    </div>
  );
}

function ImagesView({ content }: { content: any }) {
  const images = content.images || (content.fileUrl ? [content.fileUrl] : []);
  return (
    <div>
      <SectionTitle>{content.title || "Images"}</SectionTitle>
      {content.description && <p className="text-sm text-gray-600 mb-4 text-center">{content.description}</p>}
      <div className="grid grid-cols-2 gap-2">
        {Array.isArray(images) && images.map((img: any, i: number) => {
          const src = typeof img === "string" ? img : img.url;
          return src ? <img key={i} src={src} alt="" className="w-full rounded-lg object-cover" /> : null;
        })}
      </div>
    </div>
  );
}

function TextView({ content }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>Message</SectionTitle>
      <p className="text-gray-700 whitespace-pre-wrap">{content.text || ""}</p>
    </div>
  );
}

function EmailView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>Send Email</SectionTitle>
      <div className="space-y-2">
        <InfoRow label="To" value={content.email} href={`mailto:${content.email}`} />
        <InfoRow label="Subject" value={content.subject} />
        {content.message && <p className="text-sm text-gray-600 mt-2">{content.message}</p>}
      </div>
      {content.email && (
        <div className="mt-4">
          <ActionButton href={`mailto:${content.email}?subject=${encodeURIComponent(content.subject || '')}&body=${encodeURIComponent(content.message || '')}`}>
            Send Email
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function SMSView({ content }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>Send SMS</SectionTitle>
      <div className="space-y-2 text-left">
        <InfoRow label="To" value={content.phone} href={`sms:${content.phone}`} />
        {content.message && <p className="text-sm text-gray-600 mt-2">{content.message}</p>}
      </div>
      {content.phone && (
        <div className="mt-4">
          <ActionButton href={`sms:${content.phone}${content.message ? `?body=${encodeURIComponent(content.message)}` : ''}`}>
            Send Message
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function WhatsAppView({ content }: { content: any }) {
  const phone = (content.phone || '').replace(/\D/g, '');
  return (
    <div className="text-center">
      <SectionTitle>WhatsApp</SectionTitle>
      <div className="space-y-2 text-left mb-4">
        <InfoRow label="Phone" value={content.phone} />
        {content.message && <p className="text-sm text-gray-600 mt-2">{content.message}</p>}
      </div>
      {phone && (
        <ActionButton href={`https://wa.me/${phone}${content.message ? `?text=${encodeURIComponent(content.message)}` : ''}`}>
          Open WhatsApp
        </ActionButton>
      )}
    </div>
  );
}

function PhoneView({ content }: { content: any }) {
  return (
    <div className="text-center">
      <SectionTitle>Phone Call</SectionTitle>
      <p className="text-2xl font-bold text-gray-900 mb-4">{content.phone}</p>
      {content.phone && <ActionButton href={`tel:${content.phone}`}>Call Now</ActionButton>}
    </div>
  );
}

function CalendarView({ content }: { content: any }) {
  return (
    <div>
      <SectionTitle>{content.eventTitle || content.title || "Calendar Event"}</SectionTitle>
      <div className="space-y-2">
        {content.startDate && <InfoRow label="Start" value={new Date(content.startDate).toLocaleString()} />}
        {content.endDate && <InfoRow label="End" value={new Date(content.endDate).toLocaleString()} />}
        <InfoRow label="Location" value={content.location} />
        {content.description && <p className="text-sm text-gray-600 mt-3">{content.description}</p>}
      </div>
    </div>
  );
}
