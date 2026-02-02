"use client";

import Input from "@/components/ui/Input";
import FileUploadField from "./FileUploadField";
import DynamicListField from "./DynamicListField";
import MultiFileUpload from "./MultiFileUpload";
import PageDesignSection from "./PageDesignSection";
import {
  GlobeAltIcon, UserIcon, WifiIcon, EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon, ChatBubbleLeftIcon, DocumentIcon,
  VideoCameraIcon, MusicalNoteIcon, PhotoIcon, Bars3Icon,
  BuildingOfficeIcon, ClipboardDocumentListIcon, DevicePhoneMobileIcon,
  TicketIcon, StarIcon, ShareIcon, CalendarIcon, CurrencyDollarIcon,
  DocumentTextIcon, CameraIcon, HandThumbUpIcon, PlusIcon, TrashIcon,
  ClockIcon,
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

// ─── Day options for schedule ────────────────────────────────────────────────
const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

// ─── Schedule / Opening Hours ────────────────────────────────────────────────
function ScheduleField({ value, onChange }: {
  value: { day: string; open: string; close: string }[];
  onChange: (v: { day: string; open: string; close: string }[]) => void;
}) {
  const items = Array.isArray(value) ? value : [];

  const add = () => onChange([...items, { day: "monday", open: "09:00", close: "17:00" }]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const update = (idx: number, key: string, val: string) =>
    onChange(items.map((item, i) => (i === idx ? { ...item, [key]: val } : item)));

  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-2 block">Opening Hours</label>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <select
              value={item.day}
              onChange={(e) => update(idx, "day", e.target.value)}
              className="flex-1 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            <input
              type="time"
              value={item.open}
              onChange={(e) => update(idx, "open", e.target.value)}
              className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="time"
              value={item.close}
              onChange={(e) => update(idx, "close", e.target.value)}
              className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700"
            />
            <button onClick={() => remove(idx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 font-medium hover:text-violet-700">
        <PlusIcon className="h-3.5 w-3.5" /> Add hours
      </button>
    </div>
  );
}

// ─── ContentForms ────────────────────────────────────────────────────────────

interface ContentFormsProps {
  qrType: string;
  content: Record<string, any>;
  setContent: (c: Record<string, any>) => void;
}

export default function ContentForms({ qrType, content, setContent }: ContentFormsProps) {
  const set = (key: string, val: any) => setContent({ ...content, [key]: val });

  switch (qrType) {
    // ── Website (multi-website support) ───────────────────────────────────
    case "website": {
      const websites = content.websites || [];
      const addWebsite = () => set("websites", [...websites, { name: "", url: "", description: "" }]);
      const removeWebsite = (idx: number) => set("websites", websites.filter((_: any, i: number) => i !== idx));
      const updateWebsite = (idx: number, key: string, val: string) =>
        set("websites", websites.map((w: any, i: number) => (i === idx ? { ...w, [key]: val } : w)));

      return (
        <>
          <AccordionSection icon={<GlobeAltIcon className="h-5 w-5 text-gray-500" />} title="Website Information" subtitle="Input the URL(s) this QR will redirect to." defaultOpen>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Primary URL <span className="text-red-500">*</span></label>
                <input type="url" placeholder="E.g. https://www.mywebsite.com/" value={content.url || ""}
                  onChange={e => set("url", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
              </div>
              {websites.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-600 block">Additional Websites</label>
                  {websites.map((w: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="text" placeholder="Website name" value={w.name || ""}
                          onChange={e => updateWebsite(idx, "name", e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
                        <button onClick={() => removeWebsite(idx)} className="text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                      <input type="url" placeholder="https://..." value={w.url || ""}
                        onChange={e => updateWebsite(idx, "url", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
                      <input type="text" placeholder="Description (optional)" value={w.description || ""}
                        onChange={e => updateWebsite(idx, "description", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
                    </div>
                  ))}
                </div>
              )}
              <button onClick={addWebsite} className="flex items-center gap-1.5 text-xs text-violet-600 font-medium hover:text-violet-700">
                <PlusIcon className="h-3.5 w-3.5" /> Add website
              </button>
            </div>
          </AccordionSection>
          <AccordionSection icon={<PhotoIcon className="h-5 w-5 text-gray-500" />} title="Badge" subtitle="Upload a badge image for the landing page.">
            <FileUploadField label="Badge Image" accept="image/*" value={content.badge || ""} onChange={v => set("badge", v)} />
          </AccordionSection>
        </>
      );
    }

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

    // ── vCard (enhanced with photo, extra phones, design) ─────────────────
    case "vcard":
      return (
        <>
          <AccordionSection icon={<UserIcon className="h-5 w-5 text-gray-500" />} title="Contact Information" subtitle="Fill in your contact details." defaultOpen>
            <div className="space-y-3">
              <FileUploadField label="Contact Photo" accept="image/*" value={content.photo || ""} onChange={v => set("photo", v)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="First Name" value={content.firstName || ""} onChange={e => set("firstName", e.target.value)} />
                <Input label="Last Name" value={content.lastName || ""} onChange={e => set("lastName", e.target.value)} />
              </div>
              <Input label="Phone" value={content.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="Main phone number" />
              <Input label="Mobile Phone" value={content.mobilePhone || ""} onChange={e => set("mobilePhone", e.target.value)} placeholder="Mobile number" />
              <Input label="Work Phone" value={content.workPhone || ""} onChange={e => set("workPhone", e.target.value)} placeholder="Work number" />
              <Input label="Fax" value={content.fax || ""} onChange={e => set("fax", e.target.value)} placeholder="Fax number" />
              <Input label="Email" type="email" value={content.email || ""} onChange={e => set("email", e.target.value)} />
              <Input label="Company" value={content.company || ""} onChange={e => set("company", e.target.value)} />
              <Input label="Job Title" value={content.title || ""} onChange={e => set("title", e.target.value)} />
              <Input label="Website" value={content.website || ""} onChange={e => set("website", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Street" value={content.street || ""} onChange={e => set("street", e.target.value)} />
                <Input label="City" value={content.city || ""} onChange={e => set("city", e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="State" value={content.state || ""} onChange={e => set("state", e.target.value)} />
                <Input label="ZIP" value={content.zip || ""} onChange={e => set("zip", e.target.value)} />
                <Input label="Country" value={content.country || ""} onChange={e => set("country", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Note</label>
                <textarea value={content.note || ""} onChange={e => set("note", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Optional note..." />
              </div>
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="2color" />
        </>
      );

    case "wifi":
      return (
        <AccordionSection icon={<WifiIcon className="h-5 w-5 text-gray-500" />} title="WiFi Information" subtitle="Enter your network details." defaultOpen>
          <div className="space-y-3">
            <Input label="Network Name (SSID) *" value={content.ssid || ""} onChange={e => set("ssid", e.target.value)} />
            <Input label="Password" value={content.password || ""} onChange={e => set("password", e.target.value)} />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Authentication Type <span className="text-red-500">*</span></label>
              <select value={content.authType || content.encryption || "WPA"} onChange={e => set("authType", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="WPA2-EAP">WPA2-EAP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={content.hidden || false} onChange={e => set("hidden", e.target.checked)}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
              <span className="text-sm text-gray-600">Hidden network</span>
            </label>
          </div>
        </AccordionSection>
      );

    case "email":
      return (
        <AccordionSection icon={<EnvelopeIcon className="h-5 w-5 text-gray-500" />} title="Email Information" subtitle="Pre-fill an email for your recipients." defaultOpen>
          <div className="space-y-3">
            <Input label="Email Address *" type="email" value={content.email || ""} onChange={e => set("email", e.target.value)} placeholder="hello@company.com" />
            <Input label="Subject" value={content.subject || ""} onChange={e => set("subject", e.target.value)} placeholder="E.g. Inquiry about services" />
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Message Body</label>
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

    // ── PDF (fully enhanced) ──────────────────────────────────────────────
    case "pdf":
      return (
        <>
          <PageDesignSection content={content} setContent={setContent} mode="pdf" />
          <AccordionSection icon={<DocumentIcon className="h-5 w-5 text-gray-500" />} title="PDF Documents" subtitle="Upload one or more PDF files." defaultOpen>
            <div className="space-y-3">
              <MultiFileUpload
                label="PDF Files *"
                accept=".pdf,application/pdf"
                value={content.pdfs || (content.fileUrl ? [{ file: content.fileUrl, name: content.fileName || "document.pdf" }] : [])}
                onChange={v => set("pdfs", v)}
              />
            </div>
          </AccordionSection>
          <AccordionSection icon={<DocumentTextIcon className="h-5 w-5 text-gray-500" />} title="PDF Information" subtitle="Add details about your PDF.">
            <div className="space-y-3">
              <Input label="Company" value={content.company || ""} onChange={e => set("company", e.target.value)} placeholder="Company name" />
              <Input label="PDF Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Document title" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Describe this document..." />
              </div>
              <Input label="Website URL" value={content.website || ""} onChange={e => set("website", e.target.value)} placeholder="https://yourcompany.com" />
              <Input label="Button Text" value={content.buttonText || ""} onChange={e => set("buttonText", e.target.value)} placeholder="Download PDF" />
            </div>
          </AccordionSection>
          <AccordionSection icon={<PhotoIcon className="h-5 w-5 text-gray-500" />} title="Welcome Screen" subtitle="Customize the welcome screen shown before the PDF.">
            <div className="space-y-3">
              <FileUploadField label="Welcome Image (500x500)" accept="image/*" value={content.welcomeImage || ""} onChange={v => set("welcomeImage", v)} />
              <FileUploadField label="Favicon" accept="image/*" value={content.favicon || ""} onChange={v => set("favicon", v)} />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Timer (seconds): {content.welcomeTimer ?? 5}
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={content.welcomeTimer ?? 5}
                  onChange={e => set("welcomeTimer", parseInt(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>0s</span>
                  <span>30s</span>
                </div>
              </div>
            </div>
          </AccordionSection>
        </>
      );

    case "video":
      return (
        <>
          <AccordionSection icon={<VideoCameraIcon className="h-5 w-5 text-gray-500" />} title="Video" subtitle="Link to a video or upload one." defaultOpen>
            <div className="space-y-3">
              <Input label="Video URL" value={content.url || ""} onChange={e => set("url", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
              <div className="flex items-center gap-2 text-xs text-gray-400"><div className="flex-1 h-px bg-gray-200" />or<div className="flex-1 h-px bg-gray-200" /></div>
              <FileUploadField label="Upload Video" accept="video/*" value={content.fileUrl || ""} onChange={v => set("fileUrl", v)} />
              <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Video title" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Describe this video..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={content.autoplay || false} onChange={e => set("autoplay", e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                <span className="text-sm text-gray-600">Autoplay video</span>
              </label>
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="1color" />
        </>
      );

    case "mp3":
      return (
        <>
          <AccordionSection icon={<MusicalNoteIcon className="h-5 w-5 text-gray-500" />} title="MP3 Audio" subtitle="Upload audio and customize the page." defaultOpen>
            <div className="space-y-3">
              <Input label="Audio URL" value={content.url || ""} onChange={e => set("url", e.target.value)} placeholder="https://example.com/song.mp3" />
              <div className="flex items-center gap-2 text-xs text-gray-400"><div className="flex-1 h-px bg-gray-200" />or<div className="flex-1 h-px bg-gray-200" /></div>
              <FileUploadField label="Upload Audio *" accept="audio/*" value={content.fileUrl || ""} onChange={v => set("fileUrl", v)} />
              <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Song or audio title" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Artist, album, etc." />
              </div>
              <Input label="Website" value={content.website || ""} onChange={e => set("website", e.target.value)} placeholder="https://yoursite.com" />
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="2color" />
        </>
      );

    case "images":
      return (
        <>
          <AccordionSection icon={<PhotoIcon className="h-5 w-5 text-gray-500" />} title="Image Gallery" subtitle="Upload images to share." defaultOpen>
            <div className="space-y-3">
              <MultiFileUpload
                label="Upload Images *"
                accept="image/*"
                value={content.images || (content.fileUrl ? [{ file: content.fileUrl, name: "image" }] : [])}
                onChange={v => set("images", v)}
              />
              <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Gallery title" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Describe these images..." />
              </div>
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="1color" />
        </>
      );

    // ── Links (enhanced with logo, social links) ──────────────────────────
    case "links":
      return (
        <>
          <AccordionSection icon={<Bars3Icon className="h-5 w-5 text-gray-500" />} title="Link List" subtitle="Add multiple links." defaultOpen>
            <div className="space-y-3">
              <FileUploadField label="Logo" accept="image/*" value={content.logo || ""} onChange={v => set("logo", v)} />
              <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="My Links" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Short description..." />
              </div>
              <DynamicListField
                label="Links"
                fields={[
                  { key: "text", label: "Label", placeholder: "Link name" },
                  { key: "url", label: "URL", placeholder: "https://..." },
                ]}
                value={content.links || []}
                onChange={v => set("links", v)}
              />
            </div>
          </AccordionSection>
          <AccordionSection icon={<ShareIcon className="h-5 w-5 text-gray-500" />} title="Social Links" subtitle="Add social media profiles.">
            <DynamicListField
              label="Social Profiles"
              fields={[
                { key: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS },
                { key: "url", label: "URL", placeholder: "https://..." },
              ]}
              value={content.socials || []}
              onChange={v => set("socials", v)}
            />
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="3color" />
        </>
      );

    // ── Business (enhanced with cover, phone, email, schedule, CTA) ───────
    case "business":
      return (
        <>
          <AccordionSection icon={<BuildingOfficeIcon className="h-5 w-5 text-gray-500" />} title="Business Page" subtitle="Enter your business details." defaultOpen>
            <div className="space-y-3">
              <FileUploadField label="Cover Image" accept="image/*" value={content.cover || ""} onChange={v => set("cover", v)} />
              <Input label="Company Name" value={content.companyName || ""} onChange={e => set("companyName", e.target.value)} />
              <Input label="Title / Headline" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Welcome to our business" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} placeholder="About your business..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Phone" value={content.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="+1 555 123 4567" />
                <Input label="Email" type="email" value={content.email || ""} onChange={e => set("email", e.target.value)} placeholder="info@business.com" />
              </div>
              <p className="text-xs font-medium text-gray-600 mt-2">Address</p>
              <Input label="Street" value={content.street || ""} onChange={e => set("street", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="City" value={content.city || ""} onChange={e => set("city", e.target.value)} />
                <Input label="State" value={content.state || ""} onChange={e => set("state", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="ZIP" value={content.zip || ""} onChange={e => set("zip", e.target.value)} />
                <Input label="Country" value={content.country || ""} onChange={e => set("country", e.target.value)} />
              </div>
              <Input label="Website" value={content.website || ""} onChange={e => set("website", e.target.value)} placeholder="https://yourbusiness.com" />
            </div>
          </AccordionSection>
          <AccordionSection icon={<ClockIcon className="h-5 w-5 text-gray-500" />} title="Opening Hours" subtitle="Set your business schedule.">
            <ScheduleField
              value={content.schedule || []}
              onChange={v => set("schedule", v)}
            />
          </AccordionSection>
          <AccordionSection icon={<GlobeAltIcon className="h-5 w-5 text-gray-500" />} title="Call to Action" subtitle="Add a button to your business page.">
            <div className="space-y-3">
              <Input label="Button Text" value={content.buttonText || ""} onChange={e => set("buttonText", e.target.value)} placeholder="Visit Website" />
              <Input label="Button URL" value={content.buttonUrl || ""} onChange={e => set("buttonUrl", e.target.value)} placeholder="https://yourbusiness.com" />
            </div>
          </AccordionSection>
          <AccordionSection icon={<ShareIcon className="h-5 w-5 text-gray-500" />} title="Social Links" subtitle="Add your social media profiles.">
            <DynamicListField
              label="Social Links"
              fields={[
                { key: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS },
                { key: "url", label: "URL", placeholder: "https://..." },
              ]}
              value={content.socialLinks || []}
              onChange={v => set("socialLinks", v)}
            />
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="2color" />
        </>
      );

    case "menu":
      return (
        <>
          <AccordionSection icon={<ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />} title="Menu" subtitle="Create your restaurant menu." defaultOpen>
            <div className="space-y-3">
              <Input label="Restaurant Name" value={content.restaurantName || ""} onChange={e => set("restaurantName", e.target.value)} />
              <MenuSections sections={content.sections || []} onChange={v => set("sections", v)} />
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="2color" />
        </>
      );

    case "apps":
      return (
        <>
          <AccordionSection icon={<DevicePhoneMobileIcon className="h-5 w-5 text-gray-500" />} title="App Download" subtitle="Link to your app on the stores." defaultOpen>
            <div className="space-y-3">
              <Input label="App Name *" value={content.appName || ""} onChange={e => set("appName", e.target.value)} />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="What does your app do?" />
              </div>
              <Input label="Website *" value={content.website || ""} onChange={e => set("website", e.target.value)} placeholder="https://yourapp.com" />
              <Input label="iOS App Store URL" value={content.iosUrl || ""} onChange={e => set("iosUrl", e.target.value)} placeholder="https://apps.apple.com/..." />
              <Input label="Google Play URL" value={content.androidUrl || ""} onChange={e => set("androidUrl", e.target.value)} placeholder="https://play.google.com/..." />
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="2color" />
        </>
      );

    case "coupon":
      return (
        <>
          <AccordionSection icon={<TicketIcon className="h-5 w-5 text-gray-500" />} title="Coupon" subtitle="Create a digital coupon." defaultOpen>
            <div className="space-y-3">
              <Input label="Title *" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Summer Sale!" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Coupon details..." />
              </div>
              <Input label="Badge / Discount" value={content.badge || content.discount || ""} onChange={e => set("badge", e.target.value)} placeholder="20% OFF" />
              <Input label="Expiry Date *" type="date" value={content.expiryDate || ""} onChange={e => set("expiryDate", e.target.value)} />
              <Input label="Button Text" value={content.buttonText || ""} onChange={e => set("buttonText", e.target.value)} placeholder="Redeem Now" />
              <Input label="Button URL" value={content.buttonUrl || ""} onChange={e => set("buttonUrl", e.target.value)} placeholder="https://yourstore.com/redeem" />
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="2color" />
        </>
      );

    case "review":
      return (
        <>
          <AccordionSection icon={<StarIcon className="h-5 w-5 text-gray-500" />} title="Feedback" subtitle="Collect feedback and reviews." defaultOpen>
            <div className="space-y-3">
              <Input label="Name *" value={content.name || content.title || ""} onChange={e => set("name", e.target.value)} placeholder="Your business name" />
              <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Rate our service!" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Help us improve..." />
              </div>
              <Input label="Website" value={content.website || ""} onChange={e => set("website", e.target.value)} placeholder="https://yourbusiness.com" />
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="1color" />
        </>
      );

    // ── Social (enhanced with logo, PageDesignSection) ────────────────────
    case "social":
      return (
        <>
          <AccordionSection icon={<ShareIcon className="h-5 w-5 text-gray-500" />} title="Social Media" subtitle="Add all your social profiles." defaultOpen>
            <div className="space-y-3">
              <FileUploadField label="Logo" accept="image/*" value={content.logo || ""} onChange={v => set("logo", v)} />
              <Input label="Title" value={content.title || ""} onChange={e => set("title", e.target.value)} placeholder="Follow us" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={2} placeholder="Connect with us on social media" />
              </div>
              <DynamicListField
                label="Social Platforms"
                fields={[
                  { key: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS },
                  { key: "url", label: "URL", placeholder: "https://..." },
                ]}
                value={content.platforms || []}
                onChange={v => set("platforms", v)}
              />
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="3color" />
        </>
      );

    case "event":
      return (
        <>
          <AccordionSection icon={<CalendarIcon className="h-5 w-5 text-gray-500" />} title="Event" subtitle="Enter event details." defaultOpen>
            <div className="space-y-3">
              <Input label="Event Title" value={content.title || ""} onChange={e => set("title", e.target.value)} />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} placeholder="Event details..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Date *" type="datetime-local" value={content.startDate || ""} onChange={e => set("startDate", e.target.value)} />
                <Input label="End Date *" type="datetime-local" value={content.endDate || ""} onChange={e => set("endDate", e.target.value)} />
              </div>
              <Input label="Button Text" value={content.buttonText || ""} onChange={e => set("buttonText", e.target.value)} placeholder="RSVP" />
              <Input label="Button URL" value={content.buttonUrl || ""} onChange={e => set("buttonUrl", e.target.value)} placeholder="https://event.com/register" />
            </div>
          </AccordionSection>
          <PageDesignSection content={content} setContent={setContent} mode="2color" />
        </>
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
