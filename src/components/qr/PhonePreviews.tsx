"use client";

import {
  GlobeAltIcon, UserIcon, BuildingOfficeIcon, DevicePhoneMobileIcon,
  VideoCameraIcon, DocumentIcon, PhotoIcon, MusicalNoteIcon,
  ChevronRightIcon, ArrowRightIcon, CalendarIcon, DocumentTextIcon,
  QrCodeIcon, CurrencyDollarIcon, StarIcon, EllipsisHorizontalIcon,
  HomeIcon, MagnifyingGlassIcon, PlusCircleIcon,
} from "@heroicons/react/24/outline";

// ─── Phone Preview Components ────────────────────────────────────────────────

export function WebsitePreview({ content }: { content: Record<string, any> }) {
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

export function PdfPreview() {
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

export function LinksPreview() {
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

export function VcardPreview() {
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

export function BusinessPreview() {
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

export function VideoPreview() {
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

export function ImagesPreview() {
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

export function FacebookPreview() {
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

export function InstagramPreview() {
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

export function SocialPreview() {
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

export function WhatsappPreview() {
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

export function Mp3Preview() {
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

export function MenuPreview() {
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

export function AppsPreview() {
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

export function CouponPreview() {
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

export function WifiPreview() {
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

export function EventPreview() {
  return (
    <div className="h-full bg-white">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-5 text-center">
        <CalendarIcon className="h-8 w-8 text-white/80 mx-auto mb-2" />
        <p className="text-white text-sm font-bold">Tech Conference 2026</p>
        <p className="text-white/80 text-xs">The Future of Innovation</p>
      </div>
      <div className="p-4 space-y-3">
        {[
          { label: "Date & Time", value: "March 15, 2026 \u2022 9:00 AM" },
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

export function EmailPreview() {
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

export function SmsPreview() {
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

export function ReviewPreview() {
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

export function BitcoinPreview() {
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

export function TextPreview() {
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

export function DefaultPhonePreview() {
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

// ─── Preview Router ──────────────────────────────────────────────────────────

export function renderPreviewForType(type: string, dynamicContent?: Record<string, any>) {
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
}
