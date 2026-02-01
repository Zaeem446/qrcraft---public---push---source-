"use client";

import Input from "@/components/ui/Input";
import FileUploadField from "./FileUploadField";
import DynamicListField from "./DynamicListField";
import {
  GlobeAltIcon, UserIcon, WifiIcon, EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon, ChatBubbleLeftIcon, DocumentIcon,
  VideoCameraIcon, MusicalNoteIcon, PhotoIcon, Bars3Icon,
  BuildingOfficeIcon, ClipboardDocumentListIcon, DevicePhoneMobileIcon,
  TicketIcon, StarIcon, ShareIcon, CalendarIcon, CurrencyDollarIcon,
  DocumentTextIcon, CameraIcon, HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { QR_TYPES } from "@/lib/utils";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// ─── Accordion Section ───────────────────────────────────────────────────────
function AccordionSection({ icon, title, subtitle, children, defaultOpen = false }: {
  icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">{icon}</div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

// ─── Social platform options ─────────────────────────────────────────────────
const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "pinterest", label: "Pinterest" },
  { value: "snapchat", label: "Snapchat" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "other", label: "Other" },
];

// ─── ContentForms ────────────────────────────────────────────────────────────

interface ContentFormsProps {
  qrType: string;
  content: Record<string, any>;
  setContent: (c: Record<string, any>) => void;
}

export default function ContentForms({ qrType, content, setContent }: ContentFormsProps) {
  const set = (key: string, val: any) => setContent({ ...content, [key]: val });

  switch (qrType) {
    case "website":
      return (
        <AccordionSection icon={<GlobeAltIcon className="h-5 w-5 text-gray-500" />} title="Website Information" subtitle="Input the URL this QR will redirect to." defaultOpen>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Website URL <span className="text-red-500">*</span></label>
            <input type="url" placeholder="E.g. https://www.mywebsite.com/" value={content.url || ""}
              onChange={e => set("url", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
          </div>
        </AccordionSection>
      );

    case "instagram":
      return (
        <AccordionSection icon={<CameraIcon className="h-5 w-5 text-gray-500" />} title="Instagram" subtitle="Link to an Instagram profile." defaultOpen>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Instagram URL <span className="text-red-500">*</span></label>
            <input type="url" placeholder="E.g. https://instagram.com/yourprofile" value={content.url || ""}
              onChange={e => set("url", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
          </div>
        </AccordionSection>
      );

    case "facebook":
      return (
        <AccordionSection icon={<HandThumbUpIcon className="h-5 w-5 text-gray-500" />} title="Facebook" subtitle="Link to a Facebook page." defaultOpen>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Facebook URL <span className="text-red-500">*</span></label>
            <input type="url" placeholder="E.g. https://facebook.com/yourpage" value={content.url || ""}
              onChange={e => set("url", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
          </div>
        </AccordionSection>
      );

    case "text":
      return (
        <AccordionSection icon={<DocumentTextIcon className="h-5 w-5 text-gray-500" />} title="Plain Text" subtitle="Enter text to encode." defaultOpen>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Text <span className="text-red-500">*</span></label>
            <textarea value={content.text || ""} onChange={e => set("text", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={5} placeholder="Enter your text here..." />
          </div>
        </AccordionSection>
      );

    case "vcard":
      return (
        <AccordionSection icon={<UserIcon className="h-5 w-5 text-gray-500" />} title="Contact Information" subtitle="Fill in your contact details." defaultOpen>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" value={content.firstName || ""} onChange={e => set("firstName", e.target.value)} />
              <Input label="Last Name" value={content.lastName || ""} onChange={e => set("lastName", e.target.value)} />
            </div>
            <Input label="Phone" value={content.phone || ""} onChange={e => set("phone", e.target.value)} />
            <Input label="Email" type="email" value={content.email || ""} onChange={e => set("email", e.target.value)} />
            <Input label="Organization" value={content.org || ""} onChange={e => set("org", e.target.value)} />
            <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} />
            <Input label="Website" value={content.website || ""} onChange={e => set("website", e.target.value)} />
            <Input label="Address" value={content.address || ""} onChange={e => set("address", e.target.value)} />
          </div>
        </AccordionSection>
      );

    case "wifi":
      return (
        <AccordionSection icon={<WifiIcon className="h-5 w-5 text-gray-500" />} title="WiFi Information" subtitle="Enter your network details." defaultOpen>
          <div className="space-y-3">
            <Input label="Network Name (SSID)" value={content.ssid || ""} onChange={e => set("ssid", e.target.value)} />
            <Input label="Password" value={content.password || ""} onChange={e => set("password", e.target.value)} />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Encryption</label>
              <select value={content.encryption || "WPA"} onChange={e => set("encryption", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white">
                <option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">None</option>
              </select>
            </div>
          </div>
        </AccordionSection>
      );

    case "email":
      return (
        <AccordionSection icon={<EnvelopeIcon className="h-5 w-5 text-gray-500" />} title="Email Information" subtitle="Pre-fill an email for your recipients." defaultOpen>
          <div className="space-y-3">
            <Input label="Email Address" type="email" value={content.email || ""} onChange={e => set("email", e.target.value)} placeholder="hello@company.com" />
            <Input label="Subject" value={content.subject || ""} onChange={e => set("subject", e.target.value)} placeholder="E.g. Inquiry about services" />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Message</label>
              <textarea value={content.message || ""} onChange={e => set("message", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={4} placeholder="Your pre-written message..." />
            </div>
          </div>
        </AccordionSection>
      );

    case "sms":
      return (
        <AccordionSection icon={<ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-500" />} title="SMS Information" subtitle="Pre-fill an SMS message." defaultOpen>
          <div className="space-y-3">
            <Input label="Phone Number" value={content.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="+1 555 123 4567" />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Message</label>
              <textarea value={content.message || ""} onChange={e => set("message", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} placeholder="Your pre-written SMS..." />
            </div>
          </div>
        </AccordionSection>
      );

    case "whatsapp":
      return (
        <AccordionSection icon={<ChatBubbleLeftIcon className="h-5 w-5 text-gray-500" />} title="WhatsApp" subtitle="Start a WhatsApp chat." defaultOpen>
          <div className="space-y-3">
            <Input label="Phone Number" value={content.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="+1 555 123 4567" />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Pre-filled Message</label>
              <textarea value={content.message || ""} onChange={e => set("message", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} placeholder="Hi! I'd like to know more..." />
            </div>
          </div>
        </AccordionSection>
      );

    case "pdf":
      return (
        <AccordionSection icon={<DocumentIcon className="h-5 w-5 text-gray-500" />} title="PDF Document" subtitle="Upload a PDF file." defaultOpen>
          <FileUploadField label="Upload PDF" accept=".pdf,application/pdf" value={content.fileUrl || ""} onChange={v => set("fileUrl", v)} />
        </AccordionSection>
      );

    case "video":
      return (
        <AccordionSection icon={<VideoCameraIcon className="h-5 w-5 text-gray-500" />} title="Video" subtitle="Link to a video or upload one." defaultOpen>
          <div className="space-y-3">
            <Input label="Video URL" value={content.url || ""} onChange={e => set("url", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            <div className="flex items-center gap-2 text-xs text-gray-400"><div className="flex-1 h-px bg-gray-200" />or<div className="flex-1 h-px bg-gray-200" /></div>
            <FileUploadField label="Upload Video" accept="video/*" value={content.fileUrl || ""} onChange={v => set("fileUrl", v)} />
          </div>
        </AccordionSection>
      );

    case "mp3":
      return (
        <AccordionSection icon={<MusicalNoteIcon className="h-5 w-5 text-gray-500" />} title="MP3 Audio" subtitle="Link to audio or upload a file." defaultOpen>
          <div className="space-y-3">
            <Input label="Audio URL" value={content.url || ""} onChange={e => set("url", e.target.value)} placeholder="https://example.com/song.mp3" />
            <div className="flex items-center gap-2 text-xs text-gray-400"><div className="flex-1 h-px bg-gray-200" />or<div className="flex-1 h-px bg-gray-200" /></div>
            <FileUploadField label="Upload Audio" accept="audio/*" value={content.fileUrl || ""} onChange={v => set("fileUrl", v)} />
          </div>
        </AccordionSection>
      );

    case "images":
      return (
        <AccordionSection icon={<PhotoIcon className="h-5 w-5 text-gray-500" />} title="Image Gallery" subtitle="Upload images to share." defaultOpen>
          <FileUploadField label="Upload Images" accept="image/*" value={content.fileUrl || ""} onChange={v => set("fileUrl", v)} multiple />
        </AccordionSection>
      );

    case "links":
      return (
        <AccordionSection icon={<Bars3Icon className="h-5 w-5 text-gray-500" />} title="Link List" subtitle="Add multiple links." defaultOpen>
          <div className="space-y-3">
            <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="My Links" />
            <DynamicListField
              label="Links"
              fields={[
                { key: "label", label: "Label", placeholder: "Link name" },
                { key: "url", label: "URL", placeholder: "https://..." },
              ]}
              value={content.links || []}
              onChange={v => set("links", v)}
            />
          </div>
        </AccordionSection>
      );

    case "business":
      return (
        <AccordionSection icon={<BuildingOfficeIcon className="h-5 w-5 text-gray-500" />} title="Business Page" subtitle="Enter your business details." defaultOpen>
          <div className="space-y-3">
            <Input label="Company Name" value={content.companyName || ""} onChange={e => set("companyName", e.target.value)} />
            <Input label="Address" value={content.address || ""} onChange={e => set("address", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Phone" value={content.phone || ""} onChange={e => set("phone", e.target.value)} />
              <Input label="Email" type="email" value={content.email || ""} onChange={e => set("email", e.target.value)} />
            </div>
            <Input label="Website" value={content.website || ""} onChange={e => set("website", e.target.value)} />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
              <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} />
            </div>
            <Input label="Business Hours" value={content.hours || ""} onChange={e => set("hours", e.target.value)} placeholder="Mon-Fri 9AM-5PM" />
            <DynamicListField
              label="Social Links"
              fields={[
                { key: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS },
                { key: "url", label: "URL", placeholder: "https://..." },
              ]}
              value={content.socialLinks || []}
              onChange={v => set("socialLinks", v)}
            />
          </div>
        </AccordionSection>
      );

    case "menu":
      return (
        <AccordionSection icon={<ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />} title="Menu" subtitle="Create your restaurant menu." defaultOpen>
          <div className="space-y-3">
            <Input label="Restaurant Name" value={content.restaurantName || ""} onChange={e => set("restaurantName", e.target.value)} />
            <MenuSections sections={content.sections || []} onChange={v => set("sections", v)} />
          </div>
        </AccordionSection>
      );

    case "apps":
      return (
        <AccordionSection icon={<DevicePhoneMobileIcon className="h-5 w-5 text-gray-500" />} title="App Download" subtitle="Link to your app on the stores." defaultOpen>
          <div className="space-y-3">
            <Input label="App Name" value={content.appName || ""} onChange={e => set("appName", e.target.value)} />
            <Input label="iOS App Store URL" value={content.iosUrl || ""} onChange={e => set("iosUrl", e.target.value)} placeholder="https://apps.apple.com/..." />
            <Input label="Google Play URL" value={content.androidUrl || ""} onChange={e => set("androidUrl", e.target.value)} placeholder="https://play.google.com/..." />
            <Input label="Other URL" value={content.otherUrl || ""} onChange={e => set("otherUrl", e.target.value)} placeholder="https://..." />
          </div>
        </AccordionSection>
      );

    case "coupon":
      return (
        <AccordionSection icon={<TicketIcon className="h-5 w-5 text-gray-500" />} title="Coupon" subtitle="Create a digital coupon." defaultOpen>
          <div className="space-y-3">
            <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Summer Sale!" />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
              <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Discount" value={content.discount || ""} onChange={e => set("discount", e.target.value)} placeholder="20% OFF" />
              <Input label="Coupon Code" value={content.code || ""} onChange={e => set("code", e.target.value)} placeholder="SAVE20" />
            </div>
            <Input label="Expiry Date" type="date" value={content.expiryDate || ""} onChange={e => set("expiryDate", e.target.value)} />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Terms & Conditions</label>
              <textarea value={content.terms || ""} onChange={e => set("terms", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} />
            </div>
          </div>
        </AccordionSection>
      );

    case "review":
      return (
        <AccordionSection icon={<StarIcon className="h-5 w-5 text-gray-500" />} title="Review" subtitle="Collect feedback and reviews." defaultOpen>
          <div className="space-y-3">
            <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Rate our service!" />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
              <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Rating Type</label>
              <select value={content.ratingType || "stars"} onChange={e => set("ratingType", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white">
                <option value="stars">Stars</option>
                <option value="emoji">Emoji</option>
                <option value="thumbs">Thumbs Up/Down</option>
                <option value="scale">1-10 Scale</option>
              </select>
            </div>
          </div>
        </AccordionSection>
      );

    case "social":
      return (
        <AccordionSection icon={<ShareIcon className="h-5 w-5 text-gray-500" />} title="Social Media" subtitle="Add all your social profiles." defaultOpen>
          <DynamicListField
            label="Social Platforms"
            fields={[
              { key: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS },
              { key: "url", label: "URL", placeholder: "https://..." },
            ]}
            value={content.platforms || []}
            onChange={v => set("platforms", v)}
          />
        </AccordionSection>
      );

    case "event":
      return (
        <AccordionSection icon={<CalendarIcon className="h-5 w-5 text-gray-500" />} title="Event" subtitle="Enter event details." defaultOpen>
          <div className="space-y-3">
            <Input label="Event Title" value={content.title || ""} onChange={e => set("title", e.target.value)} />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
              <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Date" type="datetime-local" value={content.startDate || ""} onChange={e => set("startDate", e.target.value)} />
              <Input label="End Date" type="datetime-local" value={content.endDate || ""} onChange={e => set("endDate", e.target.value)} />
            </div>
            <Input label="Location" value={content.location || ""} onChange={e => set("location", e.target.value)} />
            <Input label="Organizer" value={content.organizer || ""} onChange={e => set("organizer", e.target.value)} />
          </div>
        </AccordionSection>
      );

    case "bitcoin":
      return (
        <AccordionSection icon={<CurrencyDollarIcon className="h-5 w-5 text-gray-500" />} title="Bitcoin" subtitle="Enter a Bitcoin address." defaultOpen>
          <Input label="Bitcoin Address" value={content.address || ""} onChange={e => set("address", e.target.value)} placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" />
        </AccordionSection>
      );

    default: {
      const typeMeta = QR_TYPES.find(t => t.id === qrType);
      return (
        <AccordionSection icon={<GlobeAltIcon className="h-5 w-5 text-gray-500" />} title={`${typeMeta?.name || "Content"} Information`} subtitle="Enter the content for your QR code." defaultOpen>
          <div className="space-y-3">
            <Input label="URL or Content" placeholder="Enter URL or content" value={content.url || ""} onChange={e => set("url", e.target.value)} />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
              <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} placeholder="Optional description" />
            </div>
          </div>
        </AccordionSection>
      );
    }
  }
}

// ─── Menu Sections (nested component) ────────────────────────────────────────
function MenuSections({ sections, onChange }: { sections: any[]; onChange: (v: any[]) => void }) {
  const addSection = () => onChange([...sections, { name: "", items: [] }]);
  const removeSection = (idx: number) => onChange(sections.filter((_, i) => i !== idx));
  const updateSection = (idx: number, key: string, val: any) =>
    onChange(sections.map((s, i) => (i === idx ? { ...s, [key]: val } : s)));

  const addItem = (sIdx: number) => {
    const items = [...(sections[sIdx].items || []), { name: "", price: "" }];
    updateSection(sIdx, "items", items);
  };
  const removeItem = (sIdx: number, iIdx: number) => {
    const items = sections[sIdx].items.filter((_: any, i: number) => i !== iIdx);
    updateSection(sIdx, "items", items);
  };
  const updateItem = (sIdx: number, iIdx: number, key: string, val: string) => {
    const items = sections[sIdx].items.map((item: any, i: number) =>
      i === iIdx ? { ...item, [key]: val } : item
    );
    updateSection(sIdx, "items", items);
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-medium text-gray-600 block">Menu Sections</label>
      {sections.map((section: any, sIdx: number) => (
        <div key={sIdx} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Section name (e.g. Appetizers)" value={section.name || ""}
              onChange={e => updateSection(sIdx, "name", e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
            <button onClick={() => removeSection(sIdx)} className="text-xs text-red-500 hover:underline">Remove</button>
          </div>
          {(section.items || []).map((item: any, iIdx: number) => (
            <div key={iIdx} className="flex items-center gap-2 ml-4">
              <input type="text" placeholder="Item name" value={item.name || ""}
                onChange={e => updateItem(sIdx, iIdx, "name", e.target.value)}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
              <input type="text" placeholder="Price" value={item.price || ""}
                onChange={e => updateItem(sIdx, iIdx, "price", e.target.value)}
                className="w-20 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
              <button onClick={() => removeItem(sIdx, iIdx)} className="text-xs text-red-400 hover:text-red-600">x</button>
            </div>
          ))}
          <button onClick={() => addItem(sIdx)} className="text-xs text-violet-600 font-medium ml-4 hover:underline">+ Add item</button>
        </div>
      ))}
      <button onClick={addSection} className="text-xs text-violet-600 font-medium hover:underline">+ Add section</button>
    </div>
  );
}
