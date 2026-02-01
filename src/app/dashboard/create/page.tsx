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
  MagnifyingGlassIcon,
  PlusCircleIcon,
  HomeIcon,
  HeartIcon,
  EllipsisHorizontalIcon,
  BellIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Spinner from "@/components/ui/Spinner";

// ─── Icon Map ───────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GlobeAltIcon, UserIcon, ClipboardDocumentListIcon, BuildingOfficeIcon,
  DevicePhoneMobileIcon, WifiIcon, VideoCameraIcon, DocumentIcon, PhotoIcon,
  Bars3Icon, MusicalNoteIcon, TicketIcon, ChatBubbleLeftIcon, CameraIcon,
  HandThumbUpIcon, ShareIcon, StarIcon, CalendarIcon, EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon, CurrencyDollarIcon, DocumentTextIcon,
};

// ─── Phone Preview Components ────────────────────────────────────────────────
function WebsitePreview({ content }: { content: Record<string, any> }) {
  const url = content?.url || "https://qr-generator.ai";
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "") || "qr-generator.ai";
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-blue-500 px-3 py-2.5 flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
          <GlobeAltIcon className="h-2.5 w-2.5 text-white" />
        </div>
        <span className="text-white text-[11px] truncate">{displayUrl}</span>
      </div>
      <div className="flex-1 p-4 space-y-3">
        <div className="h-28 bg-gray-100 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded-full w-3/4" />
          <div className="h-3 bg-gray-100 rounded-full w-full" />
          <div className="h-3 bg-gray-100 rounded-full w-5/6" />
          <div className="h-3 bg-gray-200 rounded-full w-2/3" />
        </div>
      </div>
    </div>
  );
}

function PdfPreview() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-red-500 px-4 py-4 text-center">
        <div className="w-14 h-14 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center">
          <DocumentIcon className="h-8 w-8 text-white" />
        </div>
        <p className="text-white text-sm font-bold">Company Report</p>
        <p className="text-white/70 text-[10px] mt-0.5">PDF Document &bull; 2.4 MB</p>
      </div>
      <div className="flex-1 p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
        <div className="h-3 bg-gray-100 rounded-full w-4/5" />
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
      </div>
      <div className="p-3">
        <div className="bg-red-500 rounded-lg py-2.5 text-center">
          <span className="text-white text-xs font-semibold">Download PDF</span>
        </div>
      </div>
    </div>
  );
}

function LinksPreview() {
  return (
    <div className="h-full bg-gradient-to-b from-purple-600 to-indigo-700 p-4 text-center">
      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
        <UserIcon className="h-8 w-8 text-white/70" />
      </div>
      <p className="text-white text-sm font-bold mb-0.5">Sarah Johnson</p>
      <p className="text-white/60 text-[10px] mb-4">Digital Creator & Designer</p>
      {["Portfolio Website", "Latest Blog Post", "Twitter Profile", "YouTube Channel"].map((l) => (
        <div key={l} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 mb-2.5 text-center">
          <span className="text-white text-xs font-medium">{l}</span>
        </div>
      ))}
    </div>
  );
}

function VcardPreview() {
  return (
    <div className="h-full bg-white">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 pt-8 pb-10 text-center">
        <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-2 flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-white/80" />
        </div>
        <p className="text-white text-base font-bold">John Smith</p>
        <p className="text-white/80 text-xs">Software Engineer at TechCo</p>
      </div>
      <div className="px-4 py-3 space-y-2 -mt-5">
        {[{ label: "Phone", value: "+1 (555) 123-4567" }, { label: "Email", value: "john@techco.com" }, { label: "Website", value: "www.johnsmith.dev" }].map((f) => (
          <div key={f.label} className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 font-medium uppercase">{f.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{f.value}</p>
          </div>
        ))}
        <div className="bg-teal-500 rounded-xl py-2.5 text-center mt-2">
          <span className="text-white text-xs font-semibold">Save Contact</span>
        </div>
      </div>
    </div>
  );
}

function BusinessPreview() {
  return (
    <div className="h-full bg-white">
      <div className="bg-emerald-600 px-4 pt-6 pb-8 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl mx-auto mb-2 flex items-center justify-center">
          <BuildingOfficeIcon className="h-7 w-7 text-white/80" />
        </div>
        <p className="text-white text-base font-bold">Green Valley Co.</p>
        <p className="text-white/70 text-xs">Organic & Sustainable Products</p>
      </div>
      <div className="px-4 py-3 space-y-0.5 -mt-3">
        {["About Us", "Our Products", "Locations", "Contact"].map((s) => (
          <div key={s} className="bg-white flex items-center justify-between py-3 px-1 border-b border-gray-100">
            <span className="text-sm text-gray-700">{s}</span>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoPreview() {
  return (
    <div className="h-full bg-gray-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/50" />
        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center z-10 shadow-lg">
          <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-1" />
        </div>
      </div>
      <div className="p-4">
        <div className="h-1 bg-gray-700 rounded-full mb-3"><div className="h-1 bg-red-500 rounded-full w-1/3" /></div>
        <p className="text-white text-xs font-semibold mb-1">Product Launch Video</p>
        <p className="text-gray-500 text-[10px]">1,234 views &bull; 2 days ago</p>
      </div>
    </div>
  );
}

function ImagesPreview() {
  return (
    <div className="h-full bg-amber-50 flex flex-col">
      <div className="bg-[#8B5E3C] px-4 pt-5 pb-4 text-center">
        <p className="text-white text-lg font-bold italic">Nature&apos;s Canvas</p>
        <p className="text-white/80 text-xs mt-1">Browse our gallery of nature photos</p>
      </div>
      <div className="px-4 py-3">
        <div className="bg-white rounded-xl py-2.5 text-center mb-3 shadow-sm border border-amber-100">
          <span className="text-sm text-gray-700 font-medium">View All</span>
        </div>
      </div>
      <div className="flex-1 px-4 pb-4">
        <div className="h-full rounded-xl overflow-hidden bg-gradient-to-br from-orange-300 via-red-300 to-amber-400 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function FacebookPreview() {
  return (
    <div className="h-full bg-white">
      <div className="bg-[#1877F2] px-4 py-3 flex items-center gap-2">
        <span className="text-white text-sm font-bold">facebook</span>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Business Page</p>
            <p className="text-[10px] text-gray-500">2h</p>
          </div>
        </div>
        <p className="text-xs text-gray-700 mb-2">Check out our latest updates!</p>
        <div className="h-28 bg-blue-50 rounded-lg mb-2" />
        <div className="flex justify-around py-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-500 font-medium">Like</span>
          <span className="text-[10px] text-gray-500 font-medium">Comment</span>
          <span className="text-[10px] text-gray-500 font-medium">Share</span>
        </div>
      </div>
    </div>
  );
}

function InstagramPreview() {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-gray-900">stunningtravelphotography</span>
        </div>
        <EllipsisHorizontalIcon className="h-4 w-4 text-gray-900" />
      </div>
      <div className="px-3 py-2 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px] flex-shrink-0">
          <div className="w-full h-full rounded-full bg-white p-[1px]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-200 to-purple-200" />
          </div>
        </div>
        <div className="flex gap-5 text-center flex-1">
          <div><p className="text-xs font-bold text-gray-900">879</p><p className="text-[9px] text-gray-500">Posts</p></div>
          <div><p className="text-xs font-bold text-gray-900">113k</p><p className="text-[9px] text-gray-500">Followers</p></div>
          <div><p className="text-xs font-bold text-gray-900">2,160</p><p className="text-[9px] text-gray-500">Following</p></div>
        </div>
      </div>
      <div className="px-3 pb-1">
        <p className="text-[11px] font-bold text-gray-900">Stunning Travel Photography</p>
        <p className="text-[10px] text-gray-500">Travel and Photography Magazine</p>
      </div>
      <div className="px-3 py-1.5 flex gap-1">
        <div className="flex-1 bg-blue-500 rounded-md py-1 text-center"><span className="text-[9px] text-white font-semibold">Follow</span></div>
        <div className="flex-1 bg-gray-100 rounded-md py-1 text-center"><span className="text-[9px] text-gray-900 font-semibold">Message</span></div>
      </div>
      <div className="grid grid-cols-3 gap-[1px] flex-1">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className={`${i%3===0?'bg-sky-200':i%2===0?'bg-amber-100':'bg-emerald-100'}`} />
        ))}
      </div>
      <div className="flex justify-around items-center py-2 border-t border-gray-100">
        <HomeIcon className="h-5 w-5 text-gray-900" />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        <PlusCircleIcon className="h-5 w-5 text-gray-400" />
        <VideoCameraIcon className="h-5 w-5 text-gray-400" />
        <div className="w-5 h-5 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

function SocialPreview() {
  return (
    <div className="h-full bg-gradient-to-b from-violet-500 via-fuchsia-500 to-pink-500 p-4 text-center">
      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
        <UserIcon className="h-8 w-8 text-white/70" />
      </div>
      <p className="text-white text-sm font-bold mb-0.5">@creativestudio</p>
      <p className="text-white/60 text-[10px] mb-4">Follow us everywhere</p>
      {[
        { name: "Instagram", color: "from-pink-500 to-purple-500" },
        { name: "Twitter / X", color: "from-gray-800 to-gray-900" },
        { name: "LinkedIn", color: "from-blue-600 to-blue-700" },
        { name: "YouTube", color: "from-red-500 to-red-600" },
      ].map((s) => (
        <div key={s.name} className={`bg-gradient-to-r ${s.color} rounded-xl px-4 py-2.5 mb-2 shadow-sm`}>
          <span className="text-white text-xs font-medium">{s.name}</span>
        </div>
      ))}
    </div>
  );
}

function WhatsappPreview() {
  return (
    <div className="h-full bg-[#ECE5DD] flex flex-col">
      <div className="bg-[#075E54] px-3 py-2.5 flex items-center gap-2">
        <ChevronRightIcon className="h-4 w-4 text-white rotate-180" />
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <BuildingOfficeIcon className="h-4 w-4 text-white/80" />
        </div>
        <div className="flex-1">
          <p className="text-white text-xs font-semibold">Business Name</p>
          <p className="text-white/60 text-[9px]">online</p>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-2">
        <div className="bg-white rounded-xl rounded-tl-sm p-2.5 max-w-[85%] shadow-sm">
          <p className="text-[10px] text-gray-800">Welcome! How can we help you today?</p>
          <p className="text-[8px] text-gray-400 text-right mt-1">10:30 AM</p>
        </div>
        <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm p-2.5 ml-auto max-w-[80%] shadow-sm">
          <p className="text-[10px] text-gray-800">Hi! I&apos;d like more information please</p>
          <p className="text-[8px] text-gray-400 text-right mt-1">10:31 AM</p>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="bg-white rounded-full px-3 py-2 flex items-center gap-2">
          <span className="text-[10px] text-gray-400 flex-1">Type a message...</span>
          <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center">
            <ArrowRightIcon className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Mp3Preview() {
  return (
    <div className="h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-5">
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
        <MusicalNoteIcon className="h-12 w-12 text-white" />
      </div>
      <p className="text-white text-sm font-bold mb-0.5">Summer Vibes</p>
      <p className="text-gray-400 text-[10px] mb-5">The Audio Band</p>
      <div className="w-full space-y-2">
        <div className="w-full h-1 bg-white/10 rounded-full"><div className="w-2/5 h-1 bg-green-400 rounded-full" /></div>
        <div className="flex justify-between text-[9px] text-gray-500"><span>1:24</span><span>3:42</span></div>
      </div>
    </div>
  );
}

function MenuPreview() {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-teal-50 px-4 pt-5 pb-4 text-center">
        <p className="text-base font-bold text-gray-900">The Cuisine</p>
        <p className="text-xs text-teal-600 mt-0.5">New American Food and Beverage</p>
      </div>
      <div className="flex-1 px-4">
        {["Appetizers", "Beverages", "Main Dishes", "Dessert"].map((cat) => (
          <div key={cat} className="flex items-center justify-between py-3.5 border-b border-gray-100">
            <span className="text-sm text-gray-700">{cat}</span>
            <ArrowRightIcon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AppsPreview() {
  return (
    <div className="h-full bg-gradient-to-b from-pink-500 to-rose-600 flex flex-col items-center justify-center p-5">
      <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-4">
        <DevicePhoneMobileIcon className="h-10 w-10 text-pink-500" />
      </div>
      <p className="text-white text-base font-bold mb-1">Get Our App</p>
      <p className="text-white/70 text-xs mb-6">Download now for free</p>
      <div className="w-full space-y-3">
        <div className="bg-black rounded-xl px-4 py-3 flex items-center gap-3">
          <div><p className="text-[9px] text-gray-400">Download on the</p><p className="text-white text-xs font-semibold">App Store</p></div>
        </div>
        <div className="bg-black rounded-xl px-4 py-3 flex items-center gap-3">
          <div><p className="text-[9px] text-gray-400">GET IT ON</p><p className="text-white text-xs font-semibold">Google Play</p></div>
        </div>
      </div>
    </div>
  );
}

function CouponPreview() {
  return (
    <div className="h-full bg-gradient-to-b from-yellow-50 to-amber-50 flex flex-col items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full border-2 border-dashed border-amber-300 relative">
        <p className="text-center text-3xl font-black text-amber-500">20%</p>
        <p className="text-center text-lg font-bold text-amber-600">OFF</p>
        <p className="text-center text-xs text-gray-500 mt-2">Your next purchase</p>
        <div className="mt-4 bg-gray-100 rounded-lg px-4 py-2 text-center">
          <span className="text-sm font-mono font-bold text-gray-700 tracking-wider">SAVE20</span>
        </div>
      </div>
    </div>
  );
}

function WifiPreview() {
  return (
    <div className="h-full bg-gradient-to-b from-[#F87171] to-[#EF4444] flex flex-col items-center justify-center px-6 py-8">
      <svg className="w-28 h-28 text-white/20 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.5 8.5c5.5-5.5 14-5.5 19.5 0" /><path d="M5 12c3.5-3.5 9-3.5 12.5 0" /><path d="M8.5 15.5c2-2 5-2 7 0" /><circle cx="12" cy="19" r="1" fill="currentColor" />
      </svg>
      <p className="text-white text-base font-semibold mb-0.5 text-center">Join the WiFi</p>
      <p className="text-white/80 text-sm mb-6 text-center">WiFi network</p>
      <button className="w-full bg-[#F87171] border-2 border-white/30 rounded-2xl py-3 text-white font-semibold text-sm mb-3">Connect</button>
      <button className="w-full bg-white/10 rounded-2xl py-3 text-white/80 text-sm">Close</button>
    </div>
  );
}

function EventPreview() {
  return (
    <div className="h-full bg-white">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-5 text-center">
        <CalendarIcon className="h-8 w-8 text-white/80 mx-auto mb-2" />
        <p className="text-white text-sm font-bold">Tech Conference 2026</p>
        <p className="text-white/80 text-xs">The Future of Innovation</p>
      </div>
      <div className="p-4 space-y-3">
        {[
          { label: "Date & Time", value: "March 15, 2026 &bull; 9:00 AM" },
          { label: "Location", value: "Convention Center, San Francisco" },
          { label: "Organizer", value: "TechEvents Inc." },
        ].map(f => (
          <div key={f.label} className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 font-medium uppercase">{f.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{f.value}</p>
          </div>
        ))}
        <div className="bg-teal-500 rounded-xl py-3 text-center mt-3">
          <span className="text-white text-xs font-semibold">Add to Calendar</span>
        </div>
      </div>
    </div>
  );
}

function EmailPreview() {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-blue-500 px-4 py-3 flex items-center justify-between">
        <span className="text-white text-xs font-semibold">New Email</span>
      </div>
      <div className="flex-1 p-4 space-y-3">
        <div className="border-b border-gray-100 pb-3">
          <p className="text-[10px] text-gray-400 font-medium">To:</p>
          <p className="text-xs text-gray-700 mt-0.5">hello@company.com</p>
        </div>
        <div className="border-b border-gray-100 pb-3">
          <p className="text-[10px] text-gray-400 font-medium">Subject:</p>
          <p className="text-xs text-gray-700 mt-0.5">Inquiry about your services</p>
        </div>
      </div>
      <div className="p-3">
        <div className="bg-blue-500 rounded-xl py-2.5 text-center">
          <span className="text-white text-xs font-semibold">Send Email</span>
        </div>
      </div>
    </div>
  );
}

function SmsPreview() {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-gray-50 px-3 py-2.5 border-b border-gray-200 text-center">
        <p className="text-sm font-semibold text-gray-900">Messages</p>
      </div>
      <div className="flex-1 p-3 space-y-3 bg-white">
        <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
          <p className="text-xs text-gray-800">Hey! How are you doing?</p>
        </div>
        <div className="bg-blue-500 rounded-2xl rounded-br-sm p-3 ml-auto max-w-[80%]">
          <p className="text-xs text-white">Hello! This is a pre-written SMS message from QR code.</p>
        </div>
      </div>
    </div>
  );
}

function ReviewPreview() {
  return (
    <div className="h-full bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-5">
      <div className="flex gap-1.5 mb-3">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className="h-8 w-8 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        ))}
      </div>
      <p className="text-lg font-bold text-gray-900">Rate Us!</p>
      <p className="text-xs text-gray-500 mt-1 mb-4">We value your honest feedback</p>
      <div className="bg-amber-500 rounded-xl py-2.5 text-center w-full mt-3">
        <span className="text-white text-xs font-semibold">Submit Review</span>
      </div>
    </div>
  );
}

function BitcoinPreview() {
  return (
    <div className="h-full bg-gradient-to-b from-orange-400 via-amber-500 to-yellow-500 flex flex-col items-center justify-center p-5">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-2xl">
        <span className="text-3xl font-black text-orange-500">&#8383;</span>
      </div>
      <p className="text-white font-bold text-base mb-1">Bitcoin Payment</p>
      <p className="text-white/70 text-xs mb-5">Send BTC to this address</p>
      <div className="bg-white rounded-xl py-2.5 text-center w-full mt-3">
        <span className="text-orange-500 text-xs font-bold">Copy Address</span>
      </div>
    </div>
  );
}

function TextPreview() {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center p-5">
      <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-4" />
      <div className="w-full space-y-2 bg-gray-50 rounded-xl p-4">
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
        <div className="h-3 bg-gray-100 rounded-full w-4/5" />
        <div className="h-3 bg-gray-200 rounded-full w-full" />
      </div>
    </div>
  );
}

function DefaultPhonePreview() {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center p-5">
      <div className="relative w-36 h-36 mb-4">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-violet-400 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-violet-400 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-violet-400 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-violet-400 rounded-br-lg" />
        <div className="absolute inset-0 flex items-center justify-center">
          <QrCodeIcon className="h-20 w-20 text-gray-900" />
        </div>
      </div>
      <div className="bg-violet-500 rounded-2xl px-5 py-3 text-center w-full">
        <p className="text-white text-xs font-medium">Select a type of QR code on the left</p>
      </div>
    </div>
  );
}

// ─── QRFY Design Options ────────────────────────────────────────────────────

const QRFY_SHAPE_STYLES = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Classy Round" },
  { id: "extra-rounded", label: "Extra Round" },
  { id: "cross", label: "Cross" },
  { id: "cross-rounded", label: "Cross Round" },
  { id: "diamond", label: "Diamond" },
  { id: "diamond-special", label: "Diamond Sp." },
  { id: "heart", label: "Heart" },
  { id: "horizontal-rounded", label: "H-Rounded" },
  { id: "ribbon", label: "Ribbon" },
  { id: "shake", label: "Shake" },
  { id: "sparkle", label: "Sparkle" },
  { id: "star", label: "Star" },
  { id: "vertical-rounded", label: "V-Rounded" },
  { id: "x", label: "X" },
  { id: "x-rounded", label: "X Rounded" },
];

const QRFY_CORNER_SQUARE_STYLES = [
  { id: "default", label: "Default" },
  { id: "dot", label: "Dot" },
  { id: "square", label: "Square" },
  { id: "extra-rounded", label: "Rounded" },
  { id: "shape1", label: "Shape 1" },
  { id: "shape2", label: "Shape 2" },
  { id: "shape3", label: "Shape 3" },
  { id: "shape4", label: "Shape 4" },
  { id: "shape5", label: "Shape 5" },
  { id: "shape6", label: "Shape 6" },
  { id: "shape7", label: "Shape 7" },
  { id: "shape8", label: "Shape 8" },
  { id: "shape9", label: "Shape 9" },
  { id: "shape10", label: "Shape 10" },
  { id: "shape11", label: "Shape 11" },
  { id: "shape12", label: "Shape 12" },
];

const QRFY_CORNER_DOT_STYLES = [
  { id: "default", label: "Default" },
  { id: "dot", label: "Dot" },
  { id: "square", label: "Square" },
  { id: "cross", label: "Cross" },
  { id: "cross-rounded", label: "Cross Round" },
  { id: "diamond", label: "Diamond" },
  { id: "dot2", label: "Dot 2" },
  { id: "dot3", label: "Dot 3" },
  { id: "dot4", label: "Dot 4" },
  { id: "heart", label: "Heart" },
  { id: "rounded", label: "Rounded" },
  { id: "square2", label: "Square 2" },
  { id: "square3", label: "Square 3" },
  { id: "star", label: "Star" },
  { id: "sun", label: "Sun" },
  { id: "x", label: "X" },
  { id: "x-rounded", label: "X Rounded" },
];

const QRFY_ERROR_CORRECTION = [
  { id: "L", label: "Low" },
  { id: "M", label: "Medium" },
  { id: "Q", label: "Quartile" },
  { id: "H", label: "High" },
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
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
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

// ─── Inline Color Picker ────────────────────────────────────────────────────
function InlineColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-2 block">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
          <div className="w-full h-full" style={{ backgroundColor: value }} />
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 font-mono" />
      </div>
    </div>
  );
}

// ─── Phone Mockup Component ─────────────────────────────────────────────────
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[260px]">
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-gray-900 rounded-b-2xl z-10" />
        <div className="bg-white rounded-[2rem] overflow-hidden relative">
          <div className="h-7 bg-white flex items-center justify-between px-5 pt-1">
            <span className="text-[9px] font-semibold text-gray-900">9:41</span>
            <div className="flex items-center gap-0.5">
              <div className="flex gap-[1px]">{[1,2,3,4].map(i=><div key={i} className="w-[3px] h-[3px] bg-gray-900 rounded-[0.5px]" style={{height:`${i*2+2}px`}} />)}</div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-900 ml-0.5" />
              <svg className="w-5 h-2.5 text-gray-900 ml-0.5" viewBox="0 0 25 12" fill="currentColor"><rect x="0" y="1" width="20" height="10" rx="2" stroke="currentColor" fill="none" strokeWidth="1"/><rect x="2" y="3" width="14" height="6" rx="1" fill="currentColor"/><rect x="21" y="4" width="3" height="4" rx="1" fill="currentColor" opacity="0.4"/></svg>
            </div>
          </div>
          <div className="h-[400px] overflow-hidden">
            {children}
          </div>
          <div className="h-6 flex items-center justify-center">
            <div className="w-[80px] h-[4px] bg-gray-300 rounded-full" />
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
    cornersSquareType: "default",
    cornersDotColor: "#000000",
    cornersDotType: "default",
    backgroundColor: "#FFFFFF",
    logo: "",
    logoSize: 0.4,
    frameStyle: "none" as string,
    frameId: 0,
    frameColor: "#000000",
    frameText: "Scan me!",
    frameFontSize: 42,
    frameTextColor: "#FFFFFF",
    frameBackgroundColor: "#000000",
    patternGradient: false,
    patternColor2: "#7C3AED",
    bgTransparent: false,
    useGradientBg: false,
    bgColor2: "#7C3AED",
    errorCorrectionLevel: "M",
  });
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const activePreview = hoveredType || qrType || "";

  // Fetch QR preview from QRFY via our API
  const fetchPreview = useCallback(async () => {
    if (!qrType) return;
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/qrcodes/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: qrType, content, design }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      }
    } catch (err) {
      console.error("Preview fetch error:", err);
    }
    setPreviewLoading(false);
  }, [qrType, content, design]);

  // Debounced preview refresh
  useEffect(() => {
    if (step >= 2 && qrType) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchPreview(), 600);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }
  }, [step, design, qrType, content, fetchPreview]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, []);

  // Logo upload via FileReader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { toast.error("Logo must be under 1MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) setDesign(prev => ({ ...prev, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Please enter a name"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: qrType, content, design }),
      });
      if (res.ok) {
        toast.success("QR code created!");
        router.push("/dashboard");
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to create");
      }
    } catch { toast.error("Something went wrong"); }
    setSaving(false);
  };

  // ─── Content Forms ──────────────────────────────────────────────────────
  const renderContentForm = () => {
    switch (qrType) {
      case "website":
        return (
          <AccordionSection icon={<GlobeAltIcon className="h-5 w-5 text-gray-500" />} title="Website Information" subtitle="Input the URL this QR will redirect to." defaultOpen>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Website URL <span className="text-red-500">*</span></label>
              <input type="url" placeholder="E.g. https://www.mywebsite.com/" value={content.url || ""}
                onChange={e => setContent({ ...content, url: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
            </div>
          </AccordionSection>
        );
      case "vcard":
        return (
          <AccordionSection icon={<UserIcon className="h-5 w-5 text-gray-500" />} title="Contact Information" subtitle="Fill in your contact details." defaultOpen>
            <div className="space-y-3">
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
          <AccordionSection icon={<WifiIcon className="h-5 w-5 text-gray-500" />} title="WiFi Information" subtitle="Enter your network details." defaultOpen>
            <div className="space-y-3">
              <Input label="Network Name (SSID)" value={content.ssid || ""} onChange={e => setContent({ ...content, ssid: e.target.value })} />
              <Input label="Password" value={content.password || ""} onChange={e => setContent({ ...content, password: e.target.value })} />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Encryption</label>
                <select value={content.encryption || "WPA"} onChange={e => setContent({ ...content, encryption: e.target.value })}
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
              <Input label="Email Address" type="email" value={content.email || ""} onChange={e => setContent({ ...content, email: e.target.value })} placeholder="hello@company.com" />
              <Input label="Subject" value={content.subject || ""} onChange={e => setContent({ ...content, subject: e.target.value })} placeholder="E.g. Inquiry about services" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Message</label>
                <textarea value={content.message || ""} onChange={e => setContent({ ...content, message: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={4} placeholder="Your pre-written message..." />
              </div>
            </div>
          </AccordionSection>
        );
      case "sms":
        return (
          <AccordionSection icon={<ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-500" />} title="SMS Information" subtitle="Pre-fill an SMS message." defaultOpen>
            <div className="space-y-3">
              <Input label="Phone Number" value={content.phone || ""} onChange={e => setContent({ ...content, phone: e.target.value })} placeholder="+1 555 123 4567" />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Message</label>
                <textarea value={content.message || ""} onChange={e => setContent({ ...content, message: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} placeholder="Your pre-written SMS..." />
              </div>
            </div>
          </AccordionSection>
        );
      default:
        return (
          <AccordionSection icon={<GlobeAltIcon className="h-5 w-5 text-gray-500" />} title={`${QR_TYPES.find(t => t.id === qrType)?.name || "Content"} Information`} subtitle="Enter the content for your QR code." defaultOpen>
            <div className="space-y-3">
              <Input label="URL or Content" placeholder="Enter URL or content" value={content.url || ""} onChange={e => setContent({ ...content, url: e.target.value })} />
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea value={content.description || ""} onChange={e => setContent({ ...content, description: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" rows={3} placeholder="Optional description" />
              </div>
            </div>
          </AccordionSection>
        );
    }
  };

  // ─── Phone Preview Content ──────────────────────────────────────────────
  const renderPhoneContent = () => {
    if (step === 1) {
      if (activePreview) return renderPreviewForType(activePreview);
      return <DefaultPhonePreview />;
    }
    if (previewTab === "qrcode") {
      return (
        <div className="h-full bg-white flex items-center justify-center p-6">
          {previewLoading ? (
            <Spinner />
          ) : previewUrl ? (
            <img src={previewUrl} alt="QR Preview" className="w-full max-w-[200px]" />
          ) : (
            <div className="text-center text-gray-400 text-sm">
              <QrCodeIcon className="h-16 w-16 mx-auto mb-2 text-gray-300" />
              <p>QR preview will appear here</p>
            </div>
          )}
        </div>
      );
    }
    if (qrType) return renderPreviewForType(qrType, content);
    return <DefaultPhonePreview />;
  };

  const renderPreviewForType = (type: string, dynamicContent?: Record<string, any>) => {
    switch (type) {
      case "website": return <WebsitePreview content={dynamicContent || {}} />;
      case "pdf": return <PdfPreview />;
      case "links": return <LinksPreview />;
      case "vcard": return <VcardPreview />;
      case "business": return <BusinessPreview />;
      case "video": return <VideoPreview />;
      case "images": return <ImagesPreview />;
      case "facebook": return <FacebookPreview />;
      case "instagram": return <InstagramPreview />;
      case "social": return <SocialPreview />;
      case "whatsapp": return <WhatsappPreview />;
      case "mp3": return <Mp3Preview />;
      case "menu": return <MenuPreview />;
      case "apps": return <AppsPreview />;
      case "coupon": return <CouponPreview />;
      case "wifi": return <WifiPreview />;
      case "event": return <EventPreview />;
      case "email": return <EmailPreview />;
      case "sms": return <SmsPreview />;
      case "review": return <ReviewPreview />;
      case "bitcoin": return <BitcoinPreview />;
      case "text": return <TextPreview />;
      default: return <DefaultPhonePreview />;
    }
  };

  return (
    <div>
      {/* Top bar with steps */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          {step === 1 && "1. Select a type of QR code"}
          {step === 2 && "2. Add content to your QR code"}
          {step === 3 && "3. Design the QR"}
        </h1>
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

              <AccordionSection icon={<QrCodeIcon className="h-5 w-5 text-gray-500" />} title="Name of the QR Code" subtitle="Give a name to your QR code." defaultOpen>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Name</label>
                  <input type="text" placeholder="E.g. My QR code" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
                </div>
              </AccordionSection>

              <AccordionSection icon={<LockClosedIcon className="h-5 w-5 text-gray-500" />} title="Password" subtitle="Protect your QR code with a password.">
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    <span className="text-sm text-gray-600">Activate password to access the QR code.</span>
                  </label>
                </div>
              </AccordionSection>

              <AccordionSection icon={<FolderIcon className="h-5 w-5 text-gray-500" />} title="Folder" subtitle="Link this QR to an existing or a new folder.">
                <div>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <FolderIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">No Folder</span>
                  </div>
                </div>
              </AccordionSection>

              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={() => { setStep(3); setPreviewTab("qrcode"); }} className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 rounded-lg text-sm text-white font-medium hover:bg-violet-700 transition-colors">
                  Next <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: QR Design (QRFY options) ─────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Shape Pattern */}
              <AccordionSection
                icon={<QrCodeIcon className="h-5 w-5 text-gray-500" />}
                title="QR Code Pattern" subtitle="Choose a shape pattern for your QR code." defaultOpen>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-3 block">Pattern style</label>
                    <div className="flex flex-wrap gap-2">
                      {QRFY_SHAPE_STYLES.map(p => (
                        <button key={p.id} onClick={() => setDesign({ ...design, dotsType: p.id })}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                            design.dotsType === p.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-3 block">Pattern color</label>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-600">Gradient</span>
                        <div className="ml-auto">
                          <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${design.patternGradient ? "bg-violet-500" : "bg-gray-300"}`}
                            onClick={() => setDesign({ ...design, patternGradient: !design.patternGradient })}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${design.patternGradient ? "translate-x-5" : "translate-x-0.5"}`} />
                          </div>
                        </div>
                      </div>
                      <InlineColorPicker label="Color" value={design.dotsColor} onChange={v => setDesign({ ...design, dotsColor: v })} />
                    </div>
                    {design.patternGradient && (
                      <InlineColorPicker label="Color 2" value={design.patternColor2} onChange={v => setDesign({ ...design, patternColor2: v })} />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <ArrowPathIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-3 block">Background color</label>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input type="checkbox" checked={design.bgTransparent} onChange={e => setDesign({ ...design, bgTransparent: e.target.checked })}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                      <span className="text-sm text-gray-600">Transparent background</span>
                    </label>
                    {!design.bgTransparent && (
                      <>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-gray-600">Gradient</span>
                            <div className="ml-auto">
                              <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${design.useGradientBg ? "bg-violet-500" : "bg-gray-300"}`}
                                onClick={() => setDesign({ ...design, useGradientBg: !design.useGradientBg })}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${design.useGradientBg ? "translate-x-5" : "translate-x-0.5"}`} />
                              </div>
                            </div>
                          </div>
                          <InlineColorPicker label="Background" value={design.backgroundColor} onChange={v => setDesign({ ...design, backgroundColor: v })} />
                        </div>
                        {design.useGradientBg && (
                          <InlineColorPicker label="Background color 2" value={design.bgColor2} onChange={v => setDesign({ ...design, bgColor2: v })} />
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <span className="text-amber-700 text-sm">For optimal QR code reading, use high-contrast colors.</span>
                  </div>
                </div>
              </AccordionSection>

              {/* Corners */}
              <AccordionSection
                icon={<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 9V5a2 2 0 012-2h4"/><path d="M15 3h4a2 2 0 012 2v4"/><circle cx="12" cy="12" r="3"/></svg>}
                title="QR Code Corners" subtitle="Select corner square and dot styles.">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Corner square style</label>
                    <div className="flex flex-wrap gap-2">
                      {QRFY_CORNER_SQUARE_STYLES.map(c => (
                        <button key={c.id} onClick={() => setDesign({ ...design, cornersSquareType: c.id })}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${
                            design.cornersSquareType === c.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Corner dot style</label>
                    <div className="flex flex-wrap gap-2">
                      {QRFY_CORNER_DOT_STYLES.map(c => (
                        <button key={c.id} onClick={() => setDesign({ ...design, cornersDotType: c.id })}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${
                            design.cornersDotType === c.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InlineColorPicker label="Corner square color" value={design.cornersSquareColor} onChange={v => setDesign({ ...design, cornersSquareColor: v })} />
                    <InlineColorPicker label="Corner dot color" value={design.cornersDotColor} onChange={v => setDesign({ ...design, cornersDotColor: v })} />
                  </div>
                </div>
              </AccordionSection>

              {/* Frame */}
              <AccordionSection
                icon={<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>}
                title="Frame" subtitle="Add a frame with text around your QR code.">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-3 block">Frame template (0 = none, 1-30)</label>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 31 }, (_, i) => i).map(id => (
                        <button key={id} onClick={() => setDesign({ ...design, frameId: id, frameStyle: id === 0 ? "none" : String(id) })}
                          className={`w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all flex items-center justify-center ${
                            design.frameId === id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}>
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>
                  {design.frameId > 0 && (
                    <>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Frame text (max 30 chars)</label>
                        <input type="text" maxLength={30} value={design.frameText} onChange={e => setDesign({ ...design, frameText: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">Font size: {design.frameFontSize}</label>
                        <input type="range" min="30" max="98" step="1" value={design.frameFontSize}
                          onChange={e => setDesign({ ...design, frameFontSize: parseInt(e.target.value) })}
                          className="w-full accent-violet-500" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <InlineColorPicker label="Frame color" value={design.frameColor} onChange={v => setDesign({ ...design, frameColor: v })} />
                        <InlineColorPicker label="Text color" value={design.frameTextColor} onChange={v => setDesign({ ...design, frameTextColor: v })} />
                      </div>
                      <InlineColorPicker label="Frame background" value={design.frameBackgroundColor} onChange={v => setDesign({ ...design, frameBackgroundColor: v })} />
                    </>
                  )}
                </div>
              </AccordionSection>

              {/* Logo */}
              <AccordionSection
                icon={<PhotoSolidIcon className="h-5 w-5 text-gray-500" />}
                title="Add Logo" subtitle="Make your QR code unique by adding your logo.">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-3 block">Upload your logo (Maximum size: 1 MB)</label>
                  <label className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors">
                    <PhotoSolidIcon className="h-6 w-6 text-gray-400" />
                    <span className="text-[9px] text-gray-400 mt-0.5">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                  {design.logo && (
                    <div className="flex items-center gap-2 mt-3">
                      <img src={design.logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                      <p className="text-xs text-green-600">Logo uploaded</p>
                      <button onClick={() => setDesign({ ...design, logo: "" })} className="text-xs text-red-500 ml-auto hover:underline">Remove</button>
                    </div>
                  )}
                </div>
              </AccordionSection>

              {/* Error Correction */}
              <AccordionSection
                icon={<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                title="Error Correction" subtitle="Higher levels allow more damage but reduce data capacity.">
                <div className="flex gap-2">
                  {QRFY_ERROR_CORRECTION.map(ec => (
                    <button key={ec.id} onClick={() => setDesign({ ...design, errorCorrectionLevel: ec.id })}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                        design.errorCorrectionLevel === ec.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      {ec.id} - {ec.label}
                    </button>
                  ))}
                </div>
              </AccordionSection>

              {/* Bottom buttons */}
              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 rounded-lg text-sm text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50">
                  {saving ? "Creating..." : "Create"} <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Right: Phone Mockup ──────────────────────────────────── */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
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
