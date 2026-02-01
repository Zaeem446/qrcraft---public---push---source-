"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { QR_TYPES } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  GlobeAltIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  VideoCameraIcon,
  DocumentIcon,
  PhotoIcon,
  Bars3Icon,
  MusicalNoteIcon,
  TicketIcon,
  ChatBubbleLeftIcon,
  CameraIcon,
  HandThumbUpIcon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LockClosedIcon,
  FolderIcon,
  QrCodeIcon,
  PhotoIcon as PhotoSolidIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

// ─── Icon Map ───────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GlobeAltIcon, UserIcon, ClipboardDocumentListIcon, BuildingOfficeIcon,
  DevicePhoneMobileIcon, WifiIcon, VideoCameraIcon, DocumentIcon, PhotoIcon,
  Bars3Icon, MusicalNoteIcon, TicketIcon, ChatBubbleLeftIcon, CameraIcon,
  HandThumbUpIcon, ShareIcon, StarIcon, CalendarIcon, EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon, CurrencyDollarIcon, DocumentTextIcon,
};

// ─── Phone Preview Data ─────────────────────────────────────────────────────
const PHONE_PREVIEWS: Record<string, React.FC> = {
  website: () => (
    <div className="h-full flex flex-col">
      <div className="bg-blue-500 px-4 py-3 flex items-center gap-2">
        <GlobeAltIcon className="h-4 w-4 text-white" />
        <span className="text-white text-xs">https://example.com</span>
      </div>
      <div className="flex-1 bg-white p-4 space-y-3">
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
      </div>
    </div>
  ),
  pdf: () => (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-red-500 px-4 py-3 text-center">
        <DocumentIcon className="h-6 w-6 text-white mx-auto" />
        <p className="text-white text-xs mt-1">PDF Document</p>
      </div>
      <div className="flex-1 p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
        <div className="h-3 bg-gray-100 rounded-full w-4/5" />
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
      </div>
    </div>
  ),
  links: () => (
    <div className="h-full bg-gradient-to-b from-purple-500 to-purple-600 p-4">
      <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2" />
      <p className="text-white text-xs text-center font-semibold mb-3">My Links</p>
      {["Portfolio", "Blog", "Twitter"].map((l) => (
        <div key={l} className="bg-white/20 rounded-lg px-3 py-2 mb-2 text-center">
          <span className="text-white text-xs">{l}</span>
        </div>
      ))}
    </div>
  ),
  vcard: () => (
    <div className="h-full bg-white">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 pt-6 pb-8 text-center">
        <div className="w-14 h-14 bg-white/30 rounded-full mx-auto mb-2" />
        <p className="text-white text-sm font-bold">John Smith</p>
        <p className="text-white/80 text-xs">Software Engineer</p>
      </div>
      <div className="px-4 py-3 space-y-2 -mt-4">
        {["Phone", "Email", "Website"].map((f) => (
          <div key={f} className="bg-white rounded-lg shadow-sm border border-gray-100 px-3 py-2">
            <p className="text-[10px] text-gray-400">{f}</p>
            <p className="text-xs text-gray-700">example@mail.com</p>
          </div>
        ))}
      </div>
    </div>
  ),
  business: () => (
    <div className="h-full bg-white">
      <div className="bg-emerald-500 px-4 pt-5 pb-6 text-center">
        <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto mb-2" />
        <p className="text-white text-sm font-bold">My Business</p>
        <p className="text-white/80 text-xs">New American Food and Beverage</p>
      </div>
      <div className="px-4 py-3 space-y-2">
        {["About", "Services", "Contact"].map((s) => (
          <div key={s} className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-xs text-gray-700">{s}</span>
            <ChevronRightIcon className="h-3 w-3 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  ),
  video: () => (
    <div className="h-full bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
        </div>
      </div>
      <div className="p-3">
        <div className="h-1 bg-gray-600 rounded-full mb-2"><div className="h-1 bg-red-500 rounded-full w-1/3" /></div>
        <div className="h-2 bg-gray-800 rounded w-2/3" />
      </div>
    </div>
  ),
  images: () => (
    <div className="h-full bg-amber-50">
      <div className="bg-amber-600 px-4 py-3 text-center">
        <p className="text-white text-sm font-bold">Nature&apos;s Canvas</p>
        <p className="text-white/80 text-xs">Browse our gallery of nature photos</p>
      </div>
      <div className="p-3">
        <div className="bg-white rounded-lg p-2 text-center mb-2 shadow-sm">
          <span className="text-xs text-gray-600">View All</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-14 rounded-lg ${i%2===0?'bg-amber-200':'bg-emerald-200'}`} />
          ))}
        </div>
      </div>
    </div>
  ),
  facebook: () => (
    <div className="h-full bg-white">
      <div className="bg-blue-600 px-4 py-3 flex items-center gap-2">
        <HandThumbUpIcon className="h-4 w-4 text-white" />
        <span className="text-white text-xs font-semibold">Facebook</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="h-20 bg-blue-50 rounded-lg" />
        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-8 bg-blue-500 rounded-lg" />
          <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  ),
  instagram: () => (
    <div className="h-full bg-white">
      <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1">
        <ChevronDownIcon className="h-3 w-3 text-gray-500 rotate-90" />
        <span className="text-xs font-semibold text-gray-900">travelphotography</span>
      </div>
      <div className="px-3 py-2 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />
        <div className="flex gap-4 text-center">
          <div><p className="text-xs font-bold">879</p><p className="text-[9px] text-gray-500">Posts</p></div>
          <div><p className="text-xs font-bold">113k</p><p className="text-[9px] text-gray-500">Followers</p></div>
          <div><p className="text-xs font-bold">2.1k</p><p className="text-[9px] text-gray-500">Following</p></div>
        </div>
      </div>
      <div className="px-3 py-1">
        <p className="text-[10px] font-semibold text-gray-900">Travel Photography</p>
        <p className="text-[9px] text-gray-500">We provide the best travel photos</p>
      </div>
      <div className="grid grid-cols-3 gap-0.5 mt-1">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className={`h-12 ${i%3===0?'bg-sky-200':i%2===0?'bg-amber-200':'bg-emerald-200'}`} />
        ))}
      </div>
    </div>
  ),
  social: () => (
    <div className="h-full bg-gradient-to-b from-violet-500 to-fuchsia-500 p-4 text-center">
      <div className="w-14 h-14 bg-white/20 rounded-full mx-auto mb-2" />
      <p className="text-white text-sm font-bold mb-1">Social Links</p>
      <p className="text-white/70 text-xs mb-3">Follow me everywhere</p>
      <div className="space-y-2">
        {["Instagram", "Twitter", "LinkedIn", "YouTube"].map((s) => (
          <div key={s} className="bg-white/20 rounded-lg px-3 py-2">
            <span className="text-white text-xs">{s}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  whatsapp: () => (
    <div className="h-full bg-[#075e54]">
      <div className="bg-[#128c7e] px-3 py-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-full" />
        <div>
          <p className="text-white text-xs font-semibold">Business Name</p>
          <p className="text-white/70 text-[9px]">online</p>
        </div>
      </div>
      <div className="p-3">
        <div className="bg-[#dcf8c6] rounded-lg p-2 ml-auto max-w-[80%]">
          <p className="text-[10px] text-gray-800">Hi! How can we help you?</p>
        </div>
      </div>
    </div>
  ),
  mp3: () => (
    <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
        <MusicalNoteIcon className="h-10 w-10 text-green-400" />
      </div>
      <p className="text-white text-xs font-semibold mb-1">Audio Track</p>
      <p className="text-white/60 text-[10px] mb-3">Artist Name</p>
      <div className="w-full h-1 bg-white/20 rounded-full"><div className="w-1/3 h-1 bg-green-400 rounded-full" /></div>
    </div>
  ),
  menu: () => (
    <div className="h-full bg-white">
      <div className="bg-teal-50 px-4 pt-4 pb-3 text-center">
        <div className="w-12 h-12 bg-teal-100 rounded-full mx-auto mb-1.5 flex items-center justify-center">
          <span className="text-[8px] font-bold text-teal-700">CUISINE</span>
        </div>
        <p className="text-sm font-bold text-gray-900">The Cuisine</p>
        <p className="text-xs text-teal-600">New American Food and Beverage</p>
      </div>
      <div className="px-4 py-2 space-y-0">
        {["Appetizers", "Beverages", "Main Dishes", "Dessert"].map((cat) => (
          <div key={cat} className="flex items-center justify-between py-2.5 border-b border-gray-100">
            <span className="text-xs text-gray-700">{cat}</span>
            <ChevronRightIcon className="h-3 w-3 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  ),
  apps: () => (
    <div className="h-full bg-gradient-to-b from-pink-500 to-rose-500 flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3">
        <DevicePhoneMobileIcon className="h-8 w-8 text-pink-500" />
      </div>
      <p className="text-white text-sm font-bold mb-1">Get Our App</p>
      <p className="text-white/80 text-xs mb-4">Download now</p>
      <div className="space-y-2 w-full">
        <div className="bg-black rounded-lg px-3 py-2 text-center"><span className="text-white text-[10px]">App Store</span></div>
        <div className="bg-black rounded-lg px-3 py-2 text-center"><span className="text-white text-[10px]">Google Play</span></div>
      </div>
    </div>
  ),
  coupon: () => (
    <div className="h-full bg-yellow-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-4 w-full border-2 border-dashed border-yellow-400">
        <p className="text-center text-lg font-black text-yellow-600">20% OFF</p>
        <p className="text-center text-xs text-gray-500 mt-1">Your next purchase</p>
        <div className="mt-3 bg-gray-100 rounded-lg px-3 py-1.5 text-center">
          <span className="text-xs font-mono font-bold text-gray-700">SAVE20</span>
        </div>
      </div>
    </div>
  ),
  wifi: () => (
    <div className="h-full bg-gradient-to-b from-red-400 to-red-500 flex flex-col items-center justify-center p-4">
      <WifiIcon className="h-16 w-16 text-white/30 mb-2" />
      <p className="text-white text-sm font-bold mb-1">Join the &ldquo;Hotel Bar&rdquo;</p>
      <p className="text-white/80 text-xs mb-4">WiFi network?</p>
      <button className="w-full bg-red-400 border border-white/30 rounded-xl py-2 text-white text-xs font-semibold mb-2">Connect</button>
      <button className="w-full bg-white/10 rounded-xl py-2 text-white/80 text-xs">Close</button>
    </div>
  ),
  event: () => (
    <div className="h-full bg-white">
      <div className="bg-teal-500 px-4 py-4 text-center">
        <p className="text-white text-sm font-bold">Tech Conference 2026</p>
        <p className="text-white/80 text-xs">March 15, 2026</p>
      </div>
      <div className="p-3 space-y-2">
        {["Date & Time", "Location", "Description"].map(f => (
          <div key={f} className="bg-gray-50 rounded-lg p-2">
            <p className="text-[10px] text-gray-400">{f}</p>
            <div className="h-2 bg-gray-200 rounded-full w-3/4 mt-1" />
          </div>
        ))}
        <div className="bg-teal-500 rounded-lg py-2 text-center mt-2">
          <span className="text-white text-xs font-semibold">Add to Calendar</span>
        </div>
      </div>
    </div>
  ),
  email: () => (
    <div className="h-full bg-white">
      <div className="bg-blue-500 px-4 py-3"><p className="text-white text-xs font-semibold">New Email</p></div>
      <div className="p-3 space-y-2">
        <div className="border-b border-gray-100 pb-2"><p className="text-[10px] text-gray-400">To:</p><div className="h-2 bg-gray-200 rounded w-1/2 mt-1" /></div>
        <div className="border-b border-gray-100 pb-2"><p className="text-[10px] text-gray-400">Subject:</p><div className="h-2 bg-gray-200 rounded w-2/3 mt-1" /></div>
        <div><p className="text-[10px] text-gray-400">Message:</p><div className="h-2 bg-gray-100 rounded w-full mt-1" /><div className="h-2 bg-gray-100 rounded w-4/5 mt-1" /></div>
      </div>
    </div>
  ),
  sms: () => (
    <div className="h-full bg-gray-100">
      <div className="bg-white px-3 py-2 border-b border-gray-200 text-center">
        <p className="text-xs font-semibold text-gray-900">Messages</p>
      </div>
      <div className="p-3 mt-4">
        <div className="bg-blue-500 rounded-2xl rounded-br-sm p-2.5 ml-auto max-w-[80%]">
          <p className="text-[10px] text-white">Hello! This is a pre-written SMS message.</p>
        </div>
      </div>
    </div>
  ),
  review: () => (
    <div className="h-full bg-amber-50 flex flex-col items-center justify-center p-4">
      <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(i => <StarIcon key={i} className="h-6 w-6 text-amber-400" />)}</div>
      <p className="text-sm font-bold text-gray-900">Rate Us!</p>
      <p className="text-xs text-gray-500 mt-1">We value your feedback</p>
      <div className="bg-white rounded-xl shadow-sm p-3 w-full mt-3">
        <div className="h-2 bg-gray-200 rounded-full w-full" />
        <div className="h-2 bg-gray-100 rounded-full w-3/4 mt-1.5" />
      </div>
    </div>
  ),
  bitcoin: () => (
    <div className="h-full bg-gradient-to-b from-orange-400 to-amber-500 flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
        <span className="text-2xl font-bold text-orange-500">₿</span>
      </div>
      <p className="text-white font-bold text-sm">Bitcoin Payment</p>
      <p className="text-white/80 text-xs mt-1">Send BTC to this address</p>
    </div>
  ),
  text: () => (
    <div className="h-full bg-white flex flex-col items-center justify-center p-4">
      <DocumentTextIcon className="h-10 w-10 text-gray-300 mb-3" />
      <div className="w-full space-y-1.5">
        <div className="h-2.5 bg-gray-200 rounded-full w-full" />
        <div className="h-2.5 bg-gray-100 rounded-full w-5/6" />
        <div className="h-2.5 bg-gray-100 rounded-full w-4/5" />
        <div className="h-2.5 bg-gray-200 rounded-full w-full" />
      </div>
    </div>
  ),
};

// Default preview: QR code with "Select a type" prompt
const DefaultPhonePreview = () => (
  <div className="h-full bg-white flex flex-col items-center justify-center p-4">
    <div className="w-32 h-32 border-4 border-dashed border-violet-200 rounded-2xl flex items-center justify-center mb-3 relative">
      <QrCodeIcon className="h-16 w-16 text-violet-300" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-400 rounded text-white text-[8px] flex items-center justify-center">LOGO</span>
    </div>
    <div className="bg-violet-500 rounded-xl px-4 py-2.5 text-center w-full">
      <p className="text-white text-xs font-medium">Select a type of QR code on the left</p>
    </div>
  </div>
);

// ─── Frame Styles ───────────────────────────────────────────────────────────
const FRAME_STYLES = [
  { id: "none", label: "No Frame" },
  { id: "simple", label: "Simple" },
  { id: "rounded", label: "Rounded" },
  { id: "bold", label: "Bold" },
  { id: "shadow", label: "Shadow" },
  { id: "ticket", label: "Ticket" },
  { id: "badge", label: "Badge" },
  { id: "banner", label: "Banner" },
];

const PATTERN_STYLES = [
  { id: "square", label: "Square" },
  { id: "dots", label: "Dots" },
  { id: "rounded", label: "Rounded" },
  { id: "extra-rounded", label: "Extra Round" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Classy Round" },
  { id: "star", label: "Star" },
];

const CORNER_FRAME_STYLES = [
  { id: "square", label: "Square" },
  { id: "dot", label: "Dot" },
  { id: "extra-rounded", label: "Rounded" },
];

const CORNER_DOT_STYLES = [
  { id: "square", label: "Square" },
  { id: "dot", label: "Dot" },
];

// ─── Accordion Section Component ────────────────────────────────────────────
function AccordionSection({ icon, title, subtitle, children, defaultOpen = false }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  );
}

// ─── Inline Color Picker ────────────────────────────────────────────────────
function InlineColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
          <div className="w-full h-full" style={{ backgroundColor: value }} />
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-24 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 font-mono" />
      </div>
    </div>
  );
}

// ─── Phone Mockup Component ─────────────────────────────────────────────────
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[260px]">
      <div className="bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-gray-900 rounded-b-2xl z-10" />
        <div className="bg-white rounded-[2rem] overflow-hidden relative">
          <div className="h-8 bg-white flex items-end justify-center pb-0.5">
            <div className="w-[50px] h-[4px] bg-gray-900 rounded-full" />
          </div>
          <div className="h-[380px] overflow-hidden">
            {children}
          </div>
          <div className="h-6 flex items-center justify-center">
            <div className="w-[80px] h-[3px] bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
type FormContent = Record<string, any>;

export default function CreateQRPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [qrType, setQrType] = useState("");
  const [hoveredType, setHoveredType] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState<FormContent>({});
  const [previewTab, setPreviewTab] = useState<"preview" | "qrcode">("preview");
  const [design, setDesign] = useState({
    dotsColor: "#000000",
    dotsType: "square",
    cornersSquareColor: "#000000",
    cornersSquareType: "square",
    cornersDotColor: "#000000",
    cornersDotType: "square",
    backgroundColor: "#FFFFFF",
    logo: "",
    logoSize: 0.3,
    logoMargin: 5,
    frameStyle: "none",
    frameColor: "#000000",
    frameText: "Scan me!",
    frameTextColor: "#FFFFFF",
    frameBgColor: "#FFFFFF",
    useGradientFrame: false,
    frameColor2: "#7C3AED",
    patternGradient: false,
    patternColor2: "#7C3AED",
    bgTransparent: false,
    frameBgTransparent: false,
  });
  const [saving, setSaving] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const activePreview = hoveredType || qrType || "";

  // Generate QR preview
  const generatePreview = useCallback(async () => {
    if (!qrType) return;
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const qr = new QRCodeStyling({
        width: 256, height: 256,
        data: baseUrl + "/r/preview",
        dotsOptions: { color: design.dotsColor, type: design.dotsType as any },
        cornersSquareOptions: { color: design.cornersSquareColor, type: design.cornersSquareType as any },
        cornersDotOptions: { color: design.cornersDotColor, type: design.cornersDotType as any },
        backgroundOptions: { color: design.bgTransparent ? "transparent" : design.backgroundColor },
        imageOptions: { crossOrigin: "anonymous", margin: design.logoMargin },
        image: design.logo || undefined,
      });
      const blob = await qr.getRawData("png");
      if (blob) {
        const blobObj = blob instanceof Blob ? blob : new Blob([new Uint8Array(blob as any)], { type: "image/png" });
        setQrDataUrl(URL.createObjectURL(blobObj));
      }
    } catch (e) { console.error("QR preview error:", e); }
  }, [qrType, design]);

  useEffect(() => {
    if (step >= 2 && qrType) generatePreview();
  }, [step, design, qrType, generatePreview]);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Please enter a name"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: qrType, content, design }),
      });
      if (res.ok) { toast.success("QR code created!"); router.push("/dashboard"); }
      else { const d = await res.json(); toast.error(d.error || "Failed to create"); }
    } catch { toast.error("Something went wrong"); }
    setSaving(false);
  };

  const handleDownload = async (format: "png" | "svg" | "jpeg") => {
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      const baseUrl = window.location.origin;
      const qr = new QRCodeStyling({
        width: 1024, height: 1024, data: baseUrl + "/r/preview",
        dotsOptions: { color: design.dotsColor, type: design.dotsType as any },
        cornersSquareOptions: { color: design.cornersSquareColor, type: design.cornersSquareType as any },
        cornersDotOptions: { color: design.cornersDotColor, type: design.cornersDotType as any },
        backgroundOptions: { color: design.bgTransparent ? "transparent" : design.backgroundColor },
        imageOptions: { crossOrigin: "anonymous", margin: design.logoMargin },
        image: design.logo || undefined,
      });
      qr.download({ name: name || "qrcode", extension: format === "jpeg" ? "jpeg" : format });
    } catch { toast.error("Download failed"); }
  };

  // ─── Content Forms ──────────────────────────────────────────────────────
  const renderContentForm = () => {
    switch (qrType) {
      case "website":
        return (
          <AccordionSection icon={<GlobeAltIcon className="h-4 w-4 text-gray-500" />} title="Website Information" subtitle="Input the URL this QR will redirect to." defaultOpen>
            <div className="pt-4">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Website URL <span className="text-red-500">*</span></label>
              <input type="url" placeholder="E.g. https://www.mywebsite.com/" value={content.url || ""}
                onChange={e => setContent({ ...content, url: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
            </div>
          </AccordionSection>
        );
      case "vcard":
        return (
          <AccordionSection icon={<UserIcon className="h-4 w-4 text-gray-500" />} title="Contact Information" subtitle="Fill in your contact details." defaultOpen>
            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input label="First Name" value={content.firstName || ""} onChange={e => setContent({ ...content, firstName: e.target.value })} />
                <Input label="Last Name" value={content.lastName || ""} onChange={e => setContent({ ...content, lastName: e.target.value })} />
              </div>
              <Input label="Phone" value={content.phone || ""} onChange={e => setContent({ ...content, phone: e.target.value })} />
              <Input label="Email" type="email" value={content.email || ""} onChange={e => setContent({ ...content, email: e.target.value })} />
              <Input label="Organization" value={content.org || ""} onChange={e => setContent({ ...content, org: e.target.value })} />
              <Input label="Title" value={content.title || ""} onChange={e => setContent({ ...content, title: e.target.value })} />
              <Input label="Website" value={content.website || ""} onChange={e => setContent({ ...content, website: e.target.value })} />
              <Input label="Address" value={content.address || ""} onChange={e => setContent({ ...content, address: e.target.value })} />
            </div>
          </AccordionSection>
        );
      case "wifi":
        return (
          <AccordionSection icon={<WifiIcon className="h-4 w-4 text-gray-500" />} title="WiFi Information" subtitle="Enter your network details." defaultOpen>
            <div className="pt-4 space-y-3">
              <Input label="Network Name (SSID)" value={content.ssid || ""} onChange={e => setContent({ ...content, ssid: e.target.value })} />
              <Input label="Password" value={content.password || ""} onChange={e => setContent({ ...content, password: e.target.value })} />
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Encryption</label>
                <select value={content.encryption || "WPA"} onChange={e => setContent({ ...content, encryption: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white">
                  <option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">None</option>
                </select>
              </div>
            </div>
          </AccordionSection>
        );
      default:
        return (
          <AccordionSection icon={<GlobeAltIcon className="h-4 w-4 text-gray-500" />} title={`${QR_TYPES.find(t => t.id === qrType)?.name || "Content"} Information`} subtitle="Enter the content for your QR code." defaultOpen>
            <div className="pt-4 space-y-3">
              <Input label="URL or Content" placeholder="Enter URL or content" value={content.url || ""} onChange={e => setContent({ ...content, url: e.target.value })} />
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => setContent({ ...content, description: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900" rows={3} placeholder="Optional description" />
              </div>
            </div>
          </AccordionSection>
        );
    }
  };

  // ─── Phone Preview Content ──────────────────────────────────────────────
  const renderPhoneContent = () => {
    if (step === 1) {
      if (activePreview && PHONE_PREVIEWS[activePreview]) {
        const Preview = PHONE_PREVIEWS[activePreview];
        return <Preview />;
      }
      return <DefaultPhonePreview />;
    }
    // Steps 2-3: Show preview or QR code based on tab
    if (previewTab === "qrcode" && qrDataUrl) {
      return (
        <div className="h-full bg-white flex items-center justify-center p-4">
          <img src={qrDataUrl} alt="QR" className="w-48 h-48" />
        </div>
      );
    }
    // Preview tab: show type-specific preview
    if (qrType && PHONE_PREVIEWS[qrType]) {
      const Preview = PHONE_PREVIEWS[qrType];
      return <Preview />;
    }
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-4">
        <div className="h-24 w-full bg-gray-100 rounded-lg mb-3" />
        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-full mt-2" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6 mt-2" />
      </div>
    );
  };

  return (
    <div>
      {/* Top nav bar with steps */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {step === 1 && "1. Select a type of QR code"}
            {step === 2 && "2. Add content to your QR code"}
            {step === 3 && "3. Design the QR"}
          </h1>
        </div>
        {/* Step progress in header */}
        <div className="hidden sm:flex items-center gap-2">
          {[
            { num: 1, label: "Type of QR code" },
            { num: 2, label: "Content" },
            { num: 3, label: "QR design" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              {step > s.num ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  step === s.num ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>{s.num}</span>
              )}
              <span className={`text-xs ${step === s.num ? "text-gray-900 font-medium" : "text-gray-500"}`}>{s.label}</span>
              {i < 2 && <div className="w-8 h-px bg-gray-300 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left content area */}
        <div className="lg:col-span-2">
          {/* ─── Step 1: Type Selection ──────────────────────────────── */}
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {QR_TYPES.map((type) => {
                const IconComp = ICON_MAP[type.icon];
                const isHovered = hoveredType === type.id;
                return (
                  <button key={type.id}
                    onMouseEnter={() => setHoveredType(type.id)}
                    onMouseLeave={() => setHoveredType("")}
                    onClick={() => { setQrType(type.id); setStep(2); }}
                    className={`group p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md bg-white ${
                      isHovered ? "border-violet-300 shadow-sm" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 transition-colors ${
                      isHovered ? "bg-violet-100" : "bg-gray-100 group-hover:bg-violet-50"
                    }`}>
                      {IconComp && <IconComp className={`h-5 w-5 transition-colors ${
                        isHovered ? "text-violet-600" : "text-gray-500 group-hover:text-violet-500"
                      }`} />}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── Step 2: Content ─────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              {renderContentForm()}

              <AccordionSection icon={<QrCodeIcon className="h-4 w-4 text-gray-500" />} title="Name of the QR Code" subtitle="Give a name to your QR code." defaultOpen>
                <div className="pt-4">
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="E.g. My QR code" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
                </div>
              </AccordionSection>

              <AccordionSection icon={<LockClosedIcon className="h-4 w-4 text-gray-500" />} title="Password" subtitle="Protect your QR code with a password.">
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    <span className="text-sm text-gray-600">Activate password to access the QR code.</span>
                  </label>
                </div>
              </AccordionSection>

              <AccordionSection icon={<FolderIcon className="h-4 w-4 text-gray-500" />} title="Folder" subtitle="Link this QR to an existing or a new folder.">
                <div className="pt-4">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <FolderIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">No Folder</span>
                  </div>
                </div>
              </AccordionSection>

              {/* Bottom buttons */}
              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 rounded-lg text-sm text-white font-medium hover:bg-violet-700 transition-colors">
                  Next <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: QR Design ───────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Frame */}
              <AccordionSection
                icon={<svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>}
                title="Frame" subtitle="Frames make your QR Code stand out from the crowd." defaultOpen>
                <div className="pt-4 space-y-5">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">Frame style</label>
                    <div className="flex flex-wrap gap-2">
                      {FRAME_STYLES.map(f => (
                        <button key={f.id} onClick={() => setDesign({ ...design, frameStyle: f.id })}
                          className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                            design.frameStyle === f.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}>{f.label}</button>
                      ))}
                    </div>
                  </div>
                  {design.frameStyle !== "none" && (
                    <>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Frame text</label>
                        <input type="text" value={design.frameText} onChange={e => setDesign({ ...design, frameText: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <InlineColorPicker label="Frame color" value={design.frameColor} onChange={v => setDesign({ ...design, frameColor: v })} />
                        <InlineColorPicker label="Frame background" value={design.frameBgColor} onChange={v => setDesign({ ...design, frameBgColor: v })} />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`relative w-10 h-5 rounded-full transition-colors ${design.useGradientFrame ? "bg-violet-500" : "bg-gray-300"}`}
                          onClick={() => setDesign({ ...design, useGradientFrame: !design.useGradientFrame })}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${design.useGradientFrame ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <span className="text-sm text-gray-600">Use a gradient frame color</span>
                      </label>
                      {design.useGradientFrame && (
                        <InlineColorPicker label="Frame color 2" value={design.frameColor2} onChange={v => setDesign({ ...design, frameColor2: v })} />
                      )}
                    </>
                  )}
                </div>
              </AccordionSection>

              {/* QR Code Pattern */}
              <AccordionSection
                icon={<QrCodeIcon className="h-4 w-4 text-gray-500" />}
                title="QR Code Pattern" subtitle="Choose a pattern for your QR code and select colors.">
                <div className="pt-4 space-y-5">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">Pattern style</label>
                    <div className="flex flex-wrap gap-2">
                      {PATTERN_STYLES.map(p => (
                        <button key={p.id} onClick={() => setDesign({ ...design, dotsType: p.id })}
                          className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                            design.dotsType === p.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}>{p.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InlineColorPicker label="Pattern color" value={design.dotsColor} onChange={v => setDesign({ ...design, dotsColor: v })} />
                    <InlineColorPicker label="Background color" value={design.backgroundColor} onChange={v => setDesign({ ...design, backgroundColor: v })} />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={design.bgTransparent} onChange={e => setDesign({ ...design, bgTransparent: e.target.checked })}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    <span className="text-sm text-gray-600">Transparent background</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${design.patternGradient ? "bg-violet-500" : "bg-gray-300"}`}
                      onClick={() => setDesign({ ...design, patternGradient: !design.patternGradient })}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${design.patternGradient ? "translate-x-5" : "translate-x-0.5"}`} />
                    </div>
                    <span className="text-sm text-gray-600">Use a gradient pattern color</span>
                  </label>
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <span className="text-amber-600 text-xs">Remember! For optimal QR code reading results, we recommend using high-contrast colors.</span>
                  </div>
                </div>
              </AccordionSection>

              {/* QR Code Corners */}
              <AccordionSection
                icon={<svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9V5a2 2 0 012-2h4"/><path d="M15 3h4a2 2 0 012 2v4"/><circle cx="12" cy="12" r="3"/></svg>}
                title="QR Code Corners" subtitle="Select your QR code's corner style.">
                <div className="pt-4 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-2 block">Frame around corner dots style</label>
                      <div className="flex flex-wrap gap-2">
                        {CORNER_FRAME_STYLES.map(c => (
                          <button key={c.id} onClick={() => setDesign({ ...design, cornersSquareType: c.id })}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              design.cornersSquareType === c.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}>{c.label}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-2 block">Corner dots type</label>
                      <div className="flex flex-wrap gap-2">
                        {CORNER_DOT_STYLES.map(c => (
                          <button key={c.id} onClick={() => setDesign({ ...design, cornersDotType: c.id })}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              design.cornersDotType === c.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}>{c.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InlineColorPicker label="Corner frame color" value={design.cornersSquareColor} onChange={v => setDesign({ ...design, cornersSquareColor: v })} />
                    <InlineColorPicker label="Corner dots color" value={design.cornersDotColor} onChange={v => setDesign({ ...design, cornersDotColor: v })} />
                  </div>
                </div>
              </AccordionSection>

              {/* Add Logo */}
              <AccordionSection
                icon={<PhotoSolidIcon className="h-4 w-4 text-gray-500" />}
                title="Add Logo" subtitle="Make your QR code unique by adding your logo or an image.">
                <div className="pt-4">
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Upload your logo (Maximum size: 1 MB)</label>
                  <label className="flex flex-col items-center justify-center w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors">
                    <PhotoSolidIcon className="h-6 w-6 text-gray-400" />
                    <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 1024 * 1024) { toast.error("Logo must be under 1MB"); return; }
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                        const data = await res.json();
                        if (data.url) setDesign({ ...design, logo: data.url });
                      }} />
                  </label>
                  {design.logo && <p className="text-xs text-green-600 mt-2">Logo uploaded successfully</p>}
                </div>
              </AccordionSection>

              {/* Bottom buttons */}
              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <div className="flex gap-3">
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      Download
                    </button>
                    <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-10">
                      <button onClick={() => handleDownload("png")} className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">PNG</button>
                      <button onClick={() => handleDownload("svg")} className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">SVG</button>
                      <button onClick={() => handleDownload("jpeg")} className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">JPG</button>
                    </div>
                  </div>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 rounded-lg text-sm text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50">
                    {saving ? "Creating..." : "Create"} <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Right: Phone Mockup ──────────────────────────────────── */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            {/* Preview/QR code toggle (steps 2-3) */}
            {step >= 2 && (
              <div className="flex justify-center mb-4">
                <div className="flex bg-gray-100 rounded-full p-0.5">
                  <button onClick={() => setPreviewTab("preview")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                      previewTab === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}>Preview</button>
                  <button onClick={() => setPreviewTab("qrcode")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                      previewTab === "qrcode" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}>QR code</button>
                </div>
              </div>
            )}
            <PhoneMockup>{renderPhoneContent()}</PhoneMockup>
            {step === 1 && (
              <p className="text-center text-xs text-gray-400 mt-4">Hover over a type to preview</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
