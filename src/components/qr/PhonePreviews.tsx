"use client";

import React from "react";
import {
  GlobeAltIcon, UserIcon, BuildingOfficeIcon, DevicePhoneMobileIcon,
  VideoCameraIcon, DocumentIcon, PhotoIcon, MusicalNoteIcon,
  ChevronRightIcon, ArrowRightIcon, CalendarIcon, DocumentTextIcon,
  QrCodeIcon, CurrencyDollarIcon, StarIcon, EllipsisHorizontalIcon,
  HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, Bars3Icon,
} from "@heroicons/react/24/outline";

// ─── Template layouts ────────────────────────────────────────────────────────
// id 0 = Classic  (header + body + button)
// id 1 = Grid     (header + two-col body + button)
// id 2 = Minimal  (no header, body + button)
// id 3 = Compact  (header + two-col body, no button)
// id 4 = Clean    (header + body, no button)

const TEMPLATES = [
  { header: true, body: true, button: true, split: false },
  { header: true, body: true, button: true, split: true },
  { header: false, body: true, button: true, split: false },
  { header: true, body: true, button: false, split: true },
  { header: true, body: true, button: false, split: false },
];

function getLayout(content: Record<string, any>) {
  const idx = content?.template ?? 0;
  return TEMPLATES[idx] || TEMPLATES[0];
}

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

export function PdfPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#EF4444";
  const secondary = pd.secondary || "#FFFFFF";
  const title = content?.title || "Company Report";
  const description = content?.description || "PDF Document";
  const buttonText = content?.buttonText || "Download PDF";
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="px-4 py-4 text-center" style={{ backgroundColor: primary }}>
          <div className="w-14 h-14 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center">
            <DocumentIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-white text-sm font-bold truncate">{title}</p>
          <p className="text-white/70 text-[10px] mt-0.5 truncate">{description}</p>
        </div>
      )}
      {!tpl.header && (
        <div className="px-4 pt-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: primary }}>
            <DocumentIcon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{title}</p>
            <p className="text-xs text-gray-500 truncate">{description}</p>
          </div>
        </div>
      )}
      <div className="flex-1 p-4">
        {tpl.split ? (
          <div className="grid grid-cols-2 gap-2 h-full">
            <div className="rounded-lg p-2 space-y-2" style={{ backgroundColor: primary + "10" }}>
              <div className="h-3 bg-gray-200 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-5/6" />
              <div className="h-3 bg-gray-100 rounded-full w-4/5" />
            </div>
            <div className="rounded-lg p-2 space-y-2" style={{ backgroundColor: primary + "10" }}>
              <div className="h-3 bg-gray-200 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-3/4" />
              <div className="h-3 bg-gray-200 rounded-full w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-5/6" />
            <div className="h-3 bg-gray-100 rounded-full w-4/5" />
            <div className="h-3 bg-gray-200 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-3/4" />
          </div>
        )}
      </div>
      {tpl.button && (
        <div className="p-3">
          <div className="rounded-lg py-2.5 text-center" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-semibold">{buttonText}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function LinksPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#4338CA";
  const title = content?.title || "Sarah Johnson";
  const description = content?.description || "Digital Creator & Designer";
  const logo = content?.logo;
  const links = content?.links;
  const linkLabels = links && links.length > 0
    ? links.map((l: any) => l.text || l.label || "Untitled Link")
    : ["Portfolio Website", "Latest Blog Post", "Twitter Profile", "YouTube Channel"];
  const tpl = getLayout(content);
  const btnStyle = content?.buttonStyle || "rounded";
  const btnRadius = btnStyle === "square" ? "rounded-md" : btnStyle === "outline" ? "rounded-xl" : "rounded-xl";
  const btnBorder = btnStyle === "outline" ? "border border-white/40 bg-transparent" : "bg-white/15 backdrop-blur-sm";
  return (
    <div className="h-full p-4 text-center" style={{ background: `linear-gradient(to bottom, ${primary}, ${secondary})` }}>
      {tpl.header && (
        <>
          <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden bg-white/20">
            {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <UserIcon className="h-8 w-8 text-white/70" />}
          </div>
          <p className="text-white text-sm font-bold mb-0.5 truncate">{title}</p>
          <p className="text-white/60 text-[10px] mb-4 truncate">{description}</p>
        </>
      )}
      {!tpl.header && (
        <div className="flex items-center gap-3 mb-4 text-left">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white/20 flex-shrink-0">
            {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <UserIcon className="h-5 w-5 text-white/70" />}
          </div>
          <div className="min-w-0"><p className="text-white text-sm font-bold truncate">{title}</p><p className="text-white/60 text-[10px] truncate">{description}</p></div>
        </div>
      )}
      {tpl.split ? (
        <div className="grid grid-cols-2 gap-2">
          {linkLabels.slice(0, 4).map((l: string, i: number) => (
            <div key={i} className={`${btnBorder} ${btnRadius} px-3 py-3 text-center`}>
              <span className="text-white text-[11px] font-medium truncate block">{l}</span>
            </div>
          ))}
        </div>
      ) : (
        linkLabels.slice(0, 4).map((l: string, i: number) => (
          <div key={i} className={`${btnBorder} ${btnRadius} px-4 py-3 mb-2.5 text-center`}>
            <span className="text-white text-xs font-medium truncate block">{l}</span>
          </div>
        ))
      )}
      {tpl.button && (
        <div className={`mt-3 ${btnRadius} py-2.5 text-center ${btnStyle === "outline" ? "border border-white/40" : "bg-white/20"}`}>
          <span className="text-white text-xs font-semibold">View All Links</span>
        </div>
      )}
    </div>
  );
}

export function VcardPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#14B8A6";
  const secondary = pd.secondary || "#FFFFFF";
  const name = [content?.firstName, content?.lastName].filter(Boolean).join(" ") || "John Smith";
  const jobLine = [content?.title, content?.company].filter(Boolean).join(" at ") || "Software Engineer at TechCo";
  const photo = content?.photo;
  const phone = content?.phone || "+1 (555) 123-4567";
  const email = content?.email || "john@techco.com";
  const website = content?.website || "www.johnsmith.dev";
  const socials: { platform: string; url: string }[] = content?.socials || [];
  const tpl = getLayout(content);
  const fields = [{ label: "Phone", value: phone }, { label: "Email", value: email }, { label: "Website", value: website }];
  return (
    <div className="h-full" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="px-4 pt-8 pb-10 text-center" style={{ backgroundColor: primary }}>
          <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden">
            {photo ? (
              <img src={photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="h-8 w-8 text-white/80" />
            )}
          </div>
          <p className="text-white text-base font-bold truncate">{name}</p>
          <p className="text-white/80 text-xs truncate">{jobLine}</p>
        </div>
      )}
      {!tpl.header && (
        <div className="px-4 pt-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: primary }}>
            {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : <UserIcon className="h-6 w-6 text-white/80" />}
          </div>
          <div><p className="text-sm font-bold text-gray-900 truncate">{name}</p><p className="text-xs text-gray-500 truncate">{jobLine}</p></div>
        </div>
      )}
      <div className={`px-4 py-3 space-y-2 ${tpl.header ? "-mt-5" : "mt-2"}`}>
        {tpl.split ? (
          <div className="grid grid-cols-2 gap-2">
            {fields.map((f) => (
              <div key={f.label} className="rounded-xl shadow-sm border px-3 py-2.5" style={{ backgroundColor: secondary, borderColor: primary + "20" }}>
                <p className="text-[10px] font-medium uppercase" style={{ color: primary }}>{f.label}</p>
                <p className="text-[11px] text-gray-700 mt-0.5 truncate">{f.value}</p>
              </div>
            ))}
          </div>
        ) : (
          fields.map((f) => (
            <div key={f.label} className="rounded-xl shadow-sm border px-4 py-3" style={{ backgroundColor: secondary === "#FFFFFF" ? "#FFFFFF" : secondary, borderColor: primary + "20" }}>
              <p className="text-[10px] font-medium uppercase" style={{ color: primary }}>{f.label}</p>
              <p className="text-xs text-gray-700 mt-0.5 truncate">{f.value}</p>
            </div>
          ))
        )}
        {socials.length > 0 && (
          <div className="flex justify-center gap-2 pt-1">
            {socials.slice(0, 5).map((s, i) => (
              <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: primary + "15" }}>
                <span className="text-[9px] font-bold uppercase" style={{ color: primary }}>{(s.platform || "").slice(0, 2)}</span>
              </div>
            ))}
          </div>
        )}
        {tpl.button && (
          <div className="rounded-xl py-2.5 text-center mt-2" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-semibold">Save Contact</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function BusinessPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#059669";
  const secondary = pd.secondary || "#FFFFFF";
  const companyName = content?.companyName || "Green Valley Co.";
  const headline = content?.title || content?.description || "Organic & Sustainable Products";
  const cover = content?.cover;
  const schedule: { day: string; open: string; close: string }[] = Array.isArray(content?.schedule) ? content.schedule : [];
  const tpl = getLayout(content);
  const sections = ["About Us", "Our Products", "Locations", "Contact"];
  return (
    <div className="h-full" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="px-4 pt-6 pb-8 text-center relative" style={{ backgroundColor: primary }}>
          {cover && (
            <div className="absolute inset-0 overflow-hidden">
              <img src={cover} alt="" className="w-full h-full object-cover opacity-30" />
            </div>
          )}
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl mx-auto mb-2 flex items-center justify-center">
              <BuildingOfficeIcon className="h-7 w-7 text-white/80" />
            </div>
            <p className="text-white text-base font-bold truncate">{companyName}</p>
            <p className="text-white/70 text-xs truncate">{headline}</p>
          </div>
        </div>
      )}
      {!tpl.header && (
        <div className="px-4 pt-5 pb-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primary }}>
            <BuildingOfficeIcon className="h-6 w-6 text-white/80" />
          </div>
          <div><p className="text-sm font-bold text-gray-900 truncate">{companyName}</p><p className="text-xs text-gray-500 truncate">{headline}</p></div>
        </div>
      )}
      <div className={`px-4 py-3 space-y-0.5 ${tpl.header ? "-mt-3" : ""}`}>
        {tpl.split ? (
          <div className="grid grid-cols-2 gap-2">
            {sections.map((s) => (
              <div key={s} className="rounded-lg flex items-center justify-center py-3 border" style={{ borderColor: primary + "30", backgroundColor: secondary }}>
                <span className="text-xs" style={{ color: primary }}>{s}</span>
              </div>
            ))}
          </div>
        ) : (
          sections.map((s) => (
            <div key={s} className="flex items-center justify-between py-3 px-1 border-b" style={{ borderColor: primary + "20" }}>
              <span className="text-sm text-gray-700">{s}</span>
              <ChevronRightIcon className="h-4 w-4" style={{ color: primary }} />
            </div>
          ))
        )}
        {schedule.length > 0 && (
          <div className="mt-2 rounded-xl p-3" style={{ backgroundColor: primary + "08" }}>
            <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: primary }}>Hours</p>
            {schedule.slice(0, 3).map((s, i) => (
              <div key={i} className="flex justify-between text-[10px] text-gray-600 py-0.5">
                <span className="capitalize">{s.day}</span>
                <span>{s.open} – {s.close}</span>
              </div>
            ))}
            {schedule.length > 3 && <p className="text-[9px] text-gray-400 mt-1">+{schedule.length - 3} more days</p>}
          </div>
        )}
      </div>
      {tpl.button && (
        <div className="px-4 pb-3">
          <div className="rounded-xl py-2.5 text-center" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-semibold">{content?.buttonText || "Visit Website"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function VideoPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || pd.color || "#DC2626";
  const secondary = pd.secondary || "#0F172A";
  const title = content?.title || "Product Launch Video";
  const description = content?.description || "1,234 views";
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="px-4 py-3" style={{ backgroundColor: primary }}>
          <p className="text-white text-xs font-bold truncate">{title}</p>
          <p className="text-white/60 text-[10px] truncate">{description}</p>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/50" />
        {tpl.split ? (
          /* Templates 1, 3 — side-by-side play button + info */
          <div className="z-10 flex items-center gap-4 px-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg flex-shrink-0" style={{ backgroundColor: primary }}>
              <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-1" />
            </div>
            <div className="min-w-0">
              {!tpl.header && <p className="text-white text-xs font-semibold truncate">{title}</p>}
              <p className="text-gray-400 text-[10px] truncate">{description}</p>
            </div>
          </div>
        ) : !tpl.header ? (
          /* Template 2 Minimal — compact layout with info row */
          <div className="z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: primary }}>
              <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5" />
            </div>
            <p className="text-white text-xs font-semibold truncate max-w-[80%]">{title}</p>
            <p className="text-gray-400 text-[10px] truncate max-w-[80%]">{description}</p>
          </div>
        ) : !tpl.button ? (
          /* Template 4 Clean — large centered play button with bottom overlay */
          <div className="z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: primary }}>
              <div className="w-0 h-0 border-l-[14px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
            </div>
          </div>
        ) : (
          /* Template 0 Classic — standard centered play button */
          <div className="w-14 h-14 rounded-full flex items-center justify-center z-10 shadow-lg" style={{ backgroundColor: primary }}>
            <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-1" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="h-1 rounded-full mb-3" style={{ backgroundColor: secondary === "#0F172A" ? "#374151" : primary + "30" }}>
          <div className="h-1 rounded-full w-1/3" style={{ backgroundColor: primary }} />
        </div>
        {!tpl.button && tpl.header && <p className="text-white text-xs font-semibold mb-1 truncate">{title}</p>}
        {!tpl.button && tpl.header && <p className="text-gray-500 text-[10px] truncate">{description}</p>}
      </div>
      {tpl.button && (
        <div className="px-4 pb-4">
          <div className="rounded-lg py-2.5 text-center" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-semibold">Watch Now</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ImagesPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || pd.color || "#8B5E3C";
  const secondary = pd.secondary || "#FFFBEB";
  const title = content?.title || "Nature\u2019s Canvas";
  const description = content?.description || "Browse our gallery of nature photos";
  const images: { file: string; name: string }[] = content?.images || [];
  const firstImage = images.length > 0 ? images[0].file : content?.fileUrl;
  const imageCount = images.length || (content?.fileUrl ? 1 : 0);
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="px-4 pt-5 pb-4 text-center" style={{ backgroundColor: primary }}>
          <p className="text-white text-lg font-bold italic truncate">{title}</p>
          <p className="text-white/80 text-xs mt-1 truncate">{description}</p>
        </div>
      )}
      {!tpl.header && (
        <div className="px-4 pt-5 pb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primary }}>
            <PhotoIcon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{title}</p>
            <p className="text-xs text-gray-500 truncate">{description}</p>
          </div>
        </div>
      )}
      <div className="flex-1 px-4 pb-4">
        {tpl.split ? (
          /* Templates 1, 3 — 2x2 image grid */
          <div className="grid grid-cols-2 gap-2 h-full">
            {images.length > 1 ? images.slice(0, 4).map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <img src={img.file} alt="" className="w-full h-full object-cover" />
              </div>
            )) : [0,1,2,3].map(i => (
              <div key={i} className="rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary}40, ${primary}20)` }}>
                <PhotoIcon className="h-6 w-6 text-white/40" />
              </div>
            ))}
          </div>
        ) : !tpl.header ? (
          /* Template 2 Minimal — compact side-by-side */
          <div className="flex gap-3 h-full items-center">
            <div className="w-2/5 h-full rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: firstImage ? undefined : `linear-gradient(135deg, ${primary}60, ${primary}30)` }}>
              {firstImage ? <img src={firstImage} alt="" className="w-full h-full object-cover" /> : <PhotoIcon className="h-10 w-10 text-white/50" />}
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-5/6" />
              <div className="h-3 bg-gray-100 rounded-full w-4/5" />
              <p className="text-[10px] text-gray-400 mt-1">{imageCount > 0 ? `${imageCount} photos` : "Gallery"}</p>
            </div>
          </div>
        ) : !tpl.button ? (
          /* Template 4 Clean — large image with caption overlay */
          <div className="h-full rounded-xl overflow-hidden relative">
            {firstImage ? <img src={firstImage} alt="" className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary}60, ${primary}30)` }}>
                <PhotoIcon className="h-12 w-12 text-white/50" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-white text-xs font-semibold truncate">{title}</p>
              <p className="text-white/70 text-[10px] truncate">{imageCount > 0 ? `${imageCount} photos` : description}</p>
            </div>
          </div>
        ) : (
          /* Template 0 Classic — standard single hero image */
          firstImage ? (
            <div className="h-full rounded-xl overflow-hidden relative">
              <img src={firstImage} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-full rounded-xl overflow-hidden relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary}60, ${primary}30)` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <PhotoIcon className="h-12 w-12 text-white/50 z-10" />
            </div>
          )
        )}
      </div>
      {tpl.button && (
        <div className="px-4 pb-4">
          <div className="rounded-xl py-2.5 text-center" style={{ backgroundColor: primary }}>
            <span className="text-white text-sm font-medium">
              {imageCount > 0 ? `View All (${imageCount})` : "View All"}
            </span>
          </div>
        </div>
      )}
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

export function SocialPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#8B5CF6";
  const secondary = pd.secondary || "#EC4899";
  const title = content?.title || "@creativestudio";
  const description = content?.description || "Follow us everywhere";
  const logo = content?.logo;
  const platforms = content?.platforms;
  const platformItems = platforms && platforms.length > 0
    ? platforms.slice(0, 4).map((p: any) => ({ name: p.platform || "Link" }))
    : [
        { name: "Instagram" },
        { name: "Twitter / X" },
        { name: "LinkedIn" },
        { name: "YouTube" },
      ];
  const tpl = getLayout(content);
  return (
    <div className="h-full p-4 text-center" style={{ background: `linear-gradient(to bottom, ${primary}, ${secondary})` }}>
      {tpl.header && (
        <>
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden">
            {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <UserIcon className="h-8 w-8 text-white/70" />}
          </div>
          <p className="text-white text-sm font-bold mb-0.5 truncate">{title}</p>
          <p className="text-white/60 text-[10px] mb-4 truncate">{description}</p>
        </>
      )}
      {!tpl.header && (
        <div className="flex items-center gap-3 mb-4 text-left">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <UserIcon className="h-5 w-5 text-white/70" />}
          </div>
          <div className="min-w-0"><p className="text-white text-sm font-bold truncate">{title}</p><p className="text-white/60 text-[10px] truncate">{description}</p></div>
        </div>
      )}
      {tpl.split ? (
        <div className="grid grid-cols-2 gap-2">
          {platformItems.map((s: any, i: number) => (
            <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5">
              <span className="text-white text-[11px] font-medium capitalize">{s.name}</span>
            </div>
          ))}
        </div>
      ) : (
        platformItems.map((s: any, i: number) => (
          <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 mb-2">
            <span className="text-white text-xs font-medium capitalize">{s.name}</span>
          </div>
        ))
      )}
      {tpl.button && (
        <div className="mt-3 rounded-xl py-2.5 text-center bg-white/25">
          <span className="text-white text-xs font-semibold">Follow All</span>
        </div>
      )}
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

export function Mp3Preview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#22C55E";
  const secondary = pd.secondary || "#1A1A2E";
  const title = content?.title || "Summer Vibes";
  const description = content?.description || "The Audio Band";
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col p-5" style={{ background: `linear-gradient(to bottom, ${secondary}, ${primary}15)` }}>
      {tpl.header && (
        <div className="rounded-xl py-2 mb-3 text-center" style={{ backgroundColor: primary }}>
          <span className="text-white text-xs font-bold">Now Playing</span>
        </div>
      )}
      <div className={`flex-1 flex flex-col items-center ${tpl.header ? "" : "justify-center"}`}>
        {tpl.split ? (
          /* Templates 1, 3 — side-by-side album art + info */
          <div className="flex items-center gap-4 w-full mb-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0" style={{ backgroundColor: primary }}>
              <MusicalNoteIcon className="h-10 w-10 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">{title}</p>
              <p className="text-gray-400 text-[10px] truncate">{description}</p>
            </div>
          </div>
        ) : !tpl.header ? (
          /* Template 2 Minimal — compact inline */
          <div className="flex items-center gap-3 w-full mb-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0" style={{ backgroundColor: primary }}>
              <MusicalNoteIcon className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-bold truncate">{title}</p>
              <p className="text-gray-400 text-[10px] truncate">{description}</p>
            </div>
          </div>
        ) : !tpl.button ? (
          /* Template 4 Clean — large art with text below */
          <>
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center mb-4 shadow-xl" style={{ backgroundColor: primary }}>
              <MusicalNoteIcon className="h-14 w-14 text-white" />
            </div>
            <p className="text-white text-base font-bold mb-0.5 truncate max-w-full">{title}</p>
            <p className="text-gray-400 text-xs mb-5 truncate max-w-full">{description}</p>
          </>
        ) : (
          /* Template 0 Classic — standard centered album art */
          <>
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 shadow-xl" style={{ backgroundColor: primary }}>
              <MusicalNoteIcon className="h-12 w-12 text-white" />
            </div>
            <p className="text-white text-sm font-bold mb-0.5 truncate max-w-full">{title}</p>
            <p className="text-gray-400 text-[10px] mb-5 truncate max-w-full">{description}</p>
          </>
        )}
        <div className="w-full space-y-2">
          <div className="w-full h-1 bg-white/10 rounded-full"><div className="w-2/5 h-1 rounded-full" style={{ backgroundColor: primary }} /></div>
          <div className="flex justify-between text-[9px] text-gray-500"><span>1:24</span><span>3:42</span></div>
        </div>
      </div>
      {tpl.button && (
        <div className="mt-3 rounded-xl py-2.5 text-center" style={{ backgroundColor: primary }}>
          <span className="text-white text-xs font-semibold">Download</span>
        </div>
      )}
    </div>
  );
}

const DIETARY_COLORS: Record<string, string> = {
  vegetarian: "#22C55E", vegan: "#16A34A", "gluten-free": "#EAB308", spicy: "#EF4444", halal: "#3B82F6",
};

export function MenuPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#14B8A6";
  const secondary = pd.secondary || "#FFFFFF";
  const restaurantName = content?.restaurantName || "The Cuisine";
  const secs = content?.sections;
  const categories = secs && secs.length > 0
    ? secs.map((s: any) => s.name || "Unnamed").slice(0, 4)
    : ["Appetizers", "Beverages", "Main Dishes", "Dessert"];
  // Get first few items for preview
  const firstItems = secs && secs.length > 0
    ? secs.flatMap((s: any) => (s.items || []).slice(0, 2)).slice(0, 3)
    : [];
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: secondary }}>
      {tpl.header ? (
        <div className="px-4 pt-5 pb-4 text-center" style={{ backgroundColor: primary }}>
          <p className="text-white text-base font-bold truncate">{restaurantName}</p>
          <p className="text-white/80 text-xs mt-0.5">Menu</p>
        </div>
      ) : (
        <div className="px-4 pt-5 pb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primary }}>
            <Bars3Icon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{restaurantName}</p>
            <p className="text-xs" style={{ color: primary }}>Menu</p>
          </div>
        </div>
      )}
      <div className="flex-1 px-4">
        {tpl.split ? (
          <div className="grid grid-cols-2 gap-2 py-2">
            {categories.map((cat: string, i: number) => (
              <div key={i} className="rounded-lg py-3 text-center border" style={{ borderColor: primary + "30", backgroundColor: primary + "0D" }}>
                <span className="text-xs font-medium" style={{ color: primary }}>{cat}</span>
              </div>
            ))}
          </div>
        ) : (
          <>
            {categories.map((cat: string, i: number) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-b" style={{ borderColor: primary + "20" }}>
                <span className="text-sm text-gray-700 truncate">{cat}</span>
                <ArrowRightIcon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: primary }} />
              </div>
            ))}
            {firstItems.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {firstItems.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] text-gray-600 truncate">{item.name}</span>
                      {(item.dietary || []).map((d: string) => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIETARY_COLORS[d] || "#9CA3AF" }} />
                      ))}
                    </div>
                    {item.price && <span className="text-[11px] font-semibold flex-shrink-0 ml-2" style={{ color: primary }}>${item.price}</span>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {tpl.button && (
        <div className="px-4 pb-4">
          <div className="rounded-xl py-2.5 text-center" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-semibold">View Full Menu</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppsPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#EC4899";
  const secondary = pd.secondary || "#BE185D";
  const appName = content?.appName || "Get Our App";
  const description = content?.description || "Download now for free";
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col items-center justify-center p-5" style={{ background: `linear-gradient(to bottom, ${primary}, ${secondary})` }}>
      {tpl.header && (
        <div className="w-full rounded-xl py-2 mb-3 text-center bg-white/20">
          <span className="text-white text-xs font-bold">{appName}</span>
        </div>
      )}
      {tpl.split ? (
        /* Templates 1, 3 — side-by-side icon + info */
        <div className="flex items-center gap-4 w-full mb-6">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center flex-shrink-0">
            <DevicePhoneMobileIcon className="h-8 w-8" style={{ color: primary }} />
          </div>
          <div className="min-w-0">
            {!tpl.header && <p className="text-white text-base font-bold truncate">{appName}</p>}
            <p className="text-white/70 text-xs truncate">{description}</p>
          </div>
        </div>
      ) : !tpl.header ? (
        /* Template 2 Minimal — compact inline */
        <div className="flex items-center gap-3 w-full mb-6">
          <div className="w-12 h-12 bg-white rounded-xl shadow-xl flex items-center justify-center flex-shrink-0">
            <DevicePhoneMobileIcon className="h-6 w-6" style={{ color: primary }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-bold truncate">{appName}</p>
            <p className="text-white/60 text-xs truncate">{description}</p>
          </div>
        </div>
      ) : !tpl.button ? (
        /* Template 4 Clean — large icon with overlay text */
        <>
          <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-4">
            <DevicePhoneMobileIcon className="h-12 w-12" style={{ color: primary }} />
          </div>
          <p className="text-white text-lg font-bold mb-1 truncate max-w-full">{appName}</p>
          <p className="text-white/60 text-sm mb-4 truncate max-w-full">{description}</p>
          <div className="w-full space-y-2">
            <div className="bg-black/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div><p className="text-[9px] text-gray-400">Download on the</p><p className="text-white text-xs font-semibold">App Store</p></div>
            </div>
            <div className="bg-black/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div><p className="text-[9px] text-gray-400">GET IT ON</p><p className="text-white text-xs font-semibold">Google Play</p></div>
            </div>
          </div>
        </>
      ) : (
        /* Template 0 Classic — standard centered icon */
        <>
          <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-4">
            <DevicePhoneMobileIcon className="h-10 w-10" style={{ color: primary }} />
          </div>
          {!tpl.header && <p className="text-white text-base font-bold mb-1 truncate max-w-full">{appName}</p>}
          <p className="text-white/70 text-xs mb-6 truncate max-w-full">{description}</p>
        </>
      )}
      {tpl.button && (
        <div className="w-full space-y-3">
          <div className="bg-black rounded-xl px-4 py-3 flex items-center gap-3">
            <div><p className="text-[9px] text-gray-400">Download on the</p><p className="text-white text-xs font-semibold">App Store</p></div>
          </div>
          <div className="bg-black rounded-xl px-4 py-3 flex items-center gap-3">
            <div><p className="text-[9px] text-gray-400">GET IT ON</p><p className="text-white text-xs font-semibold">Google Play</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CouponPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#F59E0B";
  const secondary = pd.secondary || "#FFFBEB";
  const title = content?.title || "Summer Sale!";
  const badge = content?.badge || content?.discount || "20% OFF";
  const description = content?.description || "Your next purchase";
  const buttonText = content?.buttonText || "Redeem Now";
  const code = content?.code || "SAVE20";
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col items-center justify-center p-5" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="w-full rounded-xl py-2 mb-3 text-center" style={{ backgroundColor: primary }}>
          <span className="text-white text-xs font-bold truncate">{title}</span>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full border-2 border-dashed relative" style={{ borderColor: primary + "80" }}>
        {!tpl.header && <p className="text-center text-xs font-semibold text-gray-500 mb-1 truncate">{title}</p>}
        {tpl.split ? (
          /* Templates 1, 3 — badge + code side by side */
          <div className="flex items-center gap-3">
            <p className="text-2xl font-black flex-shrink-0" style={{ color: primary }}>{badge}</p>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">{description}</p>
              <div className="mt-2 rounded-lg px-3 py-1.5 text-center" style={{ backgroundColor: secondary }}>
                <span className="text-sm font-mono font-bold text-gray-700 tracking-wider">{code}</span>
              </div>
            </div>
          </div>
        ) : !tpl.header ? (
          /* Template 2 Minimal — compact badge with code */
          <>
            <p className="text-center text-2xl font-black" style={{ color: primary }}>{badge}</p>
            <div className="mt-2 rounded-lg px-4 py-1.5 text-center" style={{ backgroundColor: secondary }}>
              <span className="text-xs font-mono font-bold text-gray-700 tracking-wider">{code}</span>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2 truncate">{description}</p>
          </>
        ) : !tpl.button ? (
          /* Template 4 Clean — large badge with expiry */
          <>
            <p className="text-center text-4xl font-black" style={{ color: primary }}>{badge}</p>
            <p className="text-center text-xs text-gray-500 mt-2 truncate">{description}</p>
            <div className="mt-3 rounded-lg px-4 py-2 text-center" style={{ backgroundColor: secondary }}>
              <span className="text-sm font-mono font-bold text-gray-700 tracking-wider">{code}</span>
            </div>
            {content?.expiryDate && (
              <p className="text-center text-[10px] text-gray-400 mt-2">Expires: {content.expiryDate}</p>
            )}
          </>
        ) : (
          /* Template 0 Classic — standard centered badge */
          <>
            <p className="text-center text-3xl font-black" style={{ color: primary }}>{badge}</p>
            <p className="text-center text-xs text-gray-500 mt-2 truncate">{description}</p>
            <div className="mt-3 rounded-lg px-4 py-2 text-center" style={{ backgroundColor: secondary }}>
              <span className="text-sm font-mono font-bold text-gray-700 tracking-wider">{code}</span>
            </div>
          </>
        )}
      </div>
      {tpl.button && (
        <div className="rounded-xl py-2.5 text-center w-full mt-4" style={{ backgroundColor: primary }}>
          <span className="text-white text-xs font-semibold">{buttonText}</span>
        </div>
      )}
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

export function EventPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#14B8A6";
  const secondary = pd.secondary || "#FFFFFF";
  const title = content?.title || "Tech Conference 2026";
  const description = content?.description || "The Future of Innovation";
  const buttonText = content?.buttonText || "Add to Calendar";
  const tpl = getLayout(content);
  const startDateObj = content?.startDate ? new Date(content.startDate) : null;
  const month = startDateObj ? startDateObj.toLocaleDateString(undefined, { month: "short" }).toUpperCase() : "MAR";
  const day = startDateObj ? startDateObj.getDate() : 15;
  const time = startDateObj
    ? startDateObj.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "10:00 AM";
  const fields = [
    { label: "Location", value: content?.location || "Convention Center" },
    { label: "Organizer", value: content?.organizer || "Events Inc." },
  ];
  return (
    <div className="h-full" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="px-4 py-5 text-center" style={{ backgroundColor: primary }}>
          {/* Countdown-style date block */}
          <div className="w-16 h-16 bg-white/20 rounded-xl mx-auto mb-2 flex flex-col items-center justify-center">
            <span className="text-white text-[10px] font-bold uppercase">{month}</span>
            <span className="text-white text-2xl font-black leading-none">{day}</span>
          </div>
          <p className="text-white text-sm font-bold truncate">{title}</p>
          <p className="text-white/80 text-xs truncate">{time}</p>
        </div>
      )}
      {!tpl.header && (
        <div className="px-4 pt-5 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ backgroundColor: primary }}>
            <span className="text-white text-[9px] font-bold uppercase">{month}</span>
            <span className="text-white text-lg font-black leading-none">{day}</span>
          </div>
          <div><p className="text-sm font-bold text-gray-900 truncate">{title}</p><p className="text-xs text-gray-500 truncate">{time} · {description}</p></div>
        </div>
      )}
      <div className="p-4 space-y-3">
        {tpl.split ? (
          <div className="grid grid-cols-2 gap-2">
            {fields.map(f => (
              <div key={f.label} className="rounded-xl p-3" style={{ backgroundColor: primary + "10" }}>
                <p className="text-[10px] font-medium uppercase" style={{ color: primary }}>{f.label}</p>
                <p className="text-[11px] text-gray-700 mt-0.5 truncate">{f.value}</p>
              </div>
            ))}
          </div>
        ) : (
          fields.map(f => (
            <div key={f.label} className="rounded-xl p-3" style={{ backgroundColor: primary + "10" }}>
              <p className="text-[10px] font-medium uppercase" style={{ color: primary }}>{f.label}</p>
              <p className="text-xs text-gray-700 mt-0.5">{f.value}</p>
            </div>
          ))
        )}
        {tpl.button && (
          <div className="rounded-xl py-3 text-center mt-3" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-semibold">{buttonText}</span>
          </div>
        )}
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

const REVIEW_PLATFORM_COLORS: Record<string, string> = {
  google: "#4285F4", yelp: "#FF1A1A", tripadvisor: "#34E0A1", facebook: "#1877F2", trustpilot: "#00B67A",
};

export function ReviewPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || pd.color || "#F59E0B";
  const secondary = pd.secondary || "#FFFBEB";
  const name = content?.name || content?.title || "Rate Us!";
  const description = content?.description || "We value your honest feedback";
  const reviewLinks: { platform: string; url: string }[] = content?.reviewLinks || [];
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col items-center justify-center p-5" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="w-full rounded-xl py-2 mb-4 text-center" style={{ backgroundColor: primary }}>
          <span className="text-white text-sm font-bold">{name}</span>
        </div>
      )}
      {tpl.split ? (
        <div className="flex items-center gap-4 w-full mb-3">
          <div className="flex gap-1">
            {[1,2,3].map(i => (
              <svg key={i} className="h-6 w-6" style={{ color: primary }} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <div className="min-w-0">
            {!tpl.header && <p className="text-sm font-bold text-gray-900 truncate">{name}</p>}
            <p className="text-xs text-gray-500 truncate">{description}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-1.5 mb-3">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="h-8 w-8" style={{ color: primary }} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          {!tpl.header && <p className="text-lg font-bold text-gray-900 truncate max-w-full">{name}</p>}
          <p className="text-xs text-gray-500 mt-1 mb-2 truncate max-w-full">{description}</p>
        </>
      )}
      {reviewLinks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-3 w-full">
          {reviewLinks.slice(0, 5).map((rl, i) => (
            <span key={i} className="px-2 py-1 rounded-full text-[9px] font-bold text-white capitalize"
              style={{ backgroundColor: REVIEW_PLATFORM_COLORS[rl.platform] || primary }}>
              {rl.platform}
            </span>
          ))}
        </div>
      )}
      {tpl.button && (
        <div className="rounded-xl py-2.5 text-center w-full mt-3" style={{ backgroundColor: primary }}>
          <span className="text-white text-xs font-semibold">Submit Review</span>
        </div>
      )}
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

export function PhoneCallPreview({ content }: { content: Record<string, any> }) {
  const name = content?.name || "John Doe";
  const phone = content?.phone || "+1 (555) 123-4567";
  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
        <UserIcon className="h-10 w-10 text-gray-400" />
      </div>
      <p className="text-white text-lg font-semibold mb-1">{name}</p>
      <p className="text-gray-400 text-sm mb-8">{phone}</p>
      <div className="flex items-center gap-10">
        <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
          <svg className="h-6 w-6 text-white rotate-[135deg]" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
        </div>
        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
        </div>
      </div>
    </div>
  );
}

export function CalendarEventPreview({ content }: { content: Record<string, any> }) {
  const eventTitle = content?.eventTitle || "Team Meeting";
  const location = content?.location || "Conference Room A";
  const startDate = content?.startDate ? new Date(content.startDate) : new Date();
  const month = startDate.toLocaleDateString(undefined, { month: "short" }).toUpperCase();
  const day = startDate.getDate();
  const time = content?.startDate
    ? startDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "10:00 AM";
  const endTime = content?.endDate
    ? new Date(content.endDate).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "11:00 AM";
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center p-5">
      <div className="bg-violet-50 rounded-2xl p-4 w-full mb-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-violet-600 rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-[10px] font-bold uppercase">{month}</span>
          <span className="text-white text-2xl font-black leading-none">{day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 truncate">{eventTitle}</p>
          <p className="text-xs text-gray-500 mt-0.5">{time} – {endTime}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{location}</p>
        </div>
      </div>
      {content?.description && (
        <p className="text-xs text-gray-500 mb-4 text-center line-clamp-2">{content.description}</p>
      )}
      <div className="w-full rounded-xl py-2.5 text-center bg-violet-600">
        <span className="text-white text-xs font-semibold">Add to Calendar</span>
      </div>
    </div>
  );
}

const PLATFORM_COLORS: Record<string, string> = {
  Spotify: "#1DB954", "Apple Music": "#FC3C44", "YouTube Music": "#FF0000",
  SoundCloud: "#FF5500", Deezer: "#A238FF", Tidal: "#000000", "Amazon Music": "#00A8E1",
};

export function PlaylistPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#1DB954";
  const secondary = pd.secondary || "#191414";
  const title = content?.title || "Summer Hits 2026";
  const description = content?.description || "The best tracks of the season";
  const logo = content?.logo;
  const platforms = content?.platformLinks;
  const platformItems = platforms && platforms.length > 0
    ? platforms.slice(0, 4).map((p: any) => ({ name: p.platform || "Link", url: p.url || "" }))
    : [{ name: "Spotify" }, { name: "Apple Music" }, { name: "YouTube Music" }];
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="px-4 pt-5 pb-4 text-center" style={{ backgroundColor: primary }}>
          <div className="w-16 h-16 rounded-xl mx-auto mb-2 bg-white/20 flex items-center justify-center overflow-hidden shadow-lg">
            {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <MusicalNoteIcon className="h-8 w-8 text-white/80" />}
          </div>
          <p className="text-white text-sm font-bold truncate">{title}</p>
          <p className="text-white/70 text-[10px] truncate">{description}</p>
        </div>
      )}
      {!tpl.header && (
        <div className="px-4 pt-5 pb-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: primary }}>
            {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <MusicalNoteIcon className="h-6 w-6 text-white/80" />}
          </div>
          <div className="min-w-0"><p className="text-white text-sm font-bold truncate">{title}</p><p className="text-gray-400 text-[10px] truncate">{description}</p></div>
        </div>
      )}
      <div className="flex-1 px-4 py-3">
        {tpl.split ? (
          <div className="grid grid-cols-2 gap-2">
            {platformItems.map((p: any, i: number) => (
              <div key={i} className="rounded-xl py-3 text-center" style={{ backgroundColor: PLATFORM_COLORS[p.name] || primary }}>
                <span className="text-white text-[11px] font-semibold">{p.name}</span>
              </div>
            ))}
          </div>
        ) : !tpl.header ? (
          <div className="space-y-2">
            {platformItems.map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ backgroundColor: (PLATFORM_COLORS[p.name] || primary) + "20" }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PLATFORM_COLORS[p.name] || primary }} />
                <span className="text-white text-xs font-medium">{p.name}</span>
              </div>
            ))}
          </div>
        ) : !tpl.button ? (
          <div className="space-y-2.5">
            {platformItems.map((p: any, i: number) => (
              <div key={i} className="rounded-xl py-3.5 text-center" style={{ backgroundColor: PLATFORM_COLORS[p.name] || primary }}>
                <span className="text-white text-xs font-bold">{p.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {platformItems.map((p: any, i: number) => (
              <div key={i} className="rounded-xl py-2.5 text-center" style={{ backgroundColor: PLATFORM_COLORS[p.name] || primary }}>
                <span className="text-white text-xs font-semibold">{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {tpl.button && (
        <div className="px-4 pb-4">
          <div className="rounded-xl py-2.5 text-center border border-white/20">
            <span className="text-white text-xs font-semibold">Share Playlist</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const productName = content?.productName || "Premium Product";
  const description = content?.description || "High quality, beautifully crafted";
  const price = content?.price ? `${content.currency === "EUR" ? "€" : content.currency === "GBP" ? "£" : "$"}${content.price}` : "$29.99";
  const buyText = content?.buyButtonText || "Buy Now";
  const images: any[] = content?.images || [];
  const heroImage = images.length > 0 ? images[0].file : null;
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="relative" style={{ backgroundColor: primary }}>
          {heroImage ? (
            <div className="h-36 overflow-hidden">
              <img src={heroImage} alt="" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center">
              <PhotoIcon className="h-12 w-12 text-white/30" />
            </div>
          )}
          <div className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg" style={{ backgroundColor: primary }}>
            {price}
          </div>
        </div>
      )}
      {!tpl.header && (
        <div className="px-4 pt-5 pb-3 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primary + "15" }}>
            {heroImage ? <img src={heroImage} alt="" className="w-full h-full object-cover" /> : <PhotoIcon className="h-6 w-6" style={{ color: primary }} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 truncate">{productName}</p>
            <p className="text-sm font-bold" style={{ color: primary }}>{price}</p>
          </div>
        </div>
      )}
      <div className="flex-1 px-4 py-3">
        {tpl.header && <p className="text-base font-bold text-gray-900 mb-1 truncate">{productName}</p>}
        {tpl.split ? (
          <div className="grid grid-cols-2 gap-2">
            {images.length > 1 ? images.slice(0, 4).map((img: any, i: number) => (
              <div key={i} className="rounded-lg overflow-hidden h-16">
                <img src={img.file} alt="" className="w-full h-full object-cover" />
              </div>
            )) : (
              <>
                <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: primary + "08" }}>
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                </div>
                <div className="rounded-lg p-3 flex items-center justify-center" style={{ backgroundColor: primary + "08" }}>
                  <p className="text-lg font-black" style={{ color: primary }}>{price}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500 line-clamp-3">{description}</p>
        )}
      </div>
      {tpl.button && (
        <div className="px-4 pb-4">
          <div className="rounded-xl py-2.5 text-center" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-semibold">{buyText}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function FeedbackPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || pd.color || "#7C3AED";
  const secondary = pd.secondary || "#FAFAFA";
  const title = content?.title || "Share Your Feedback";
  const description = content?.description || "We value your opinion";
  const tpl = getLayout(content);
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: secondary }}>
      {tpl.header && (
        <div className="px-4 py-5 text-center" style={{ backgroundColor: primary }}>
          <StarIcon className="h-8 w-8 text-white/80 mx-auto mb-2" />
          <p className="text-white text-sm font-bold truncate">{title}</p>
          <p className="text-white/70 text-[10px] truncate">{description}</p>
        </div>
      )}
      {!tpl.header && (
        <div className="px-4 pt-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primary }}>
            <StarIcon className="h-6 w-6 text-white/80" />
          </div>
          <div><p className="text-sm font-bold text-gray-900 truncate">{title}</p><p className="text-xs text-gray-500 truncate">{description}</p></div>
        </div>
      )}
      <div className="flex-1 px-4 py-4 space-y-3">
        {tpl.split ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: primary + "10" }}>
              <div className="flex justify-center gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="h-4 w-4" style={{ color: i <= 4 ? primary : "#D1D5DB" }} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-[10px]" style={{ color: primary }}>Rating</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: primary + "10" }}>
              <div className="h-3 bg-gray-200 rounded-full w-full mb-1.5" />
              <div className="h-3 bg-gray-100 rounded-full w-3/4" />
              <p className="text-[10px] mt-1" style={{ color: primary }}>Comment</p>
            </div>
          </div>
        ) : !tpl.header ? (
          <>
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="h-7 w-7" style={{ color: i <= 4 ? primary : "#D1D5DB" }} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <div className="h-3 bg-gray-100 rounded-full w-full mb-1.5" />
              <div className="h-3 bg-gray-100 rounded-full w-2/3" />
            </div>
          </>
        ) : !tpl.button ? (
          <>
            <div className="flex justify-center gap-1.5 mb-2">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="h-8 w-8" style={{ color: i <= 4 ? primary : "#D1D5DB" }} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <p className="text-[10px] text-gray-400 mb-2">Tell us more...</p>
              <div className="h-3 bg-gray-100 rounded-full w-full mb-1.5" />
              <div className="h-3 bg-gray-100 rounded-full w-4/5" />
              <div className="h-3 bg-gray-100 rounded-full w-2/3 mt-1.5" />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="h-7 w-7" style={{ color: i <= 4 ? primary : "#D1D5DB" }} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <div className="h-3 bg-gray-100 rounded-full w-full mb-1.5" />
              <div className="h-3 bg-gray-100 rounded-full w-2/3" />
            </div>
          </>
        )}
      </div>
      {tpl.button && (
        <div className="px-4 pb-4">
          <div className="rounded-xl py-2.5 text-center" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-semibold">Submit Feedback</span>
          </div>
        </div>
      )}
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

// ─── Memoized dynamic previews ───────────────────────────────────────────────
const MemoPdfPreview = React.memo(PdfPreview);
const MemoLinksPreview = React.memo(LinksPreview);
const MemoVcardPreview = React.memo(VcardPreview);
const MemoBusinessPreview = React.memo(BusinessPreview);
const MemoVideoPreview = React.memo(VideoPreview);
const MemoImagesPreview = React.memo(ImagesPreview);
const MemoSocialPreview = React.memo(SocialPreview);
const MemoMp3Preview = React.memo(Mp3Preview);
const MemoMenuPreview = React.memo(MenuPreview);
const MemoAppsPreview = React.memo(AppsPreview);
const MemoCouponPreview = React.memo(CouponPreview);
const MemoEventPreview = React.memo(EventPreview);
const MemoReviewPreview = React.memo(ReviewPreview);
const MemoPlaylistPreview = React.memo(PlaylistPreview);
const MemoProductPreview = React.memo(ProductPreview);
const MemoFeedbackPreview = React.memo(FeedbackPreview);

// ─── Preview Router ──────────────────────────────────────────────────────────

export function renderPreviewForType(type: string, dynamicContent?: Record<string, any>) {
  switch (type) {
    case "website": return <WebsitePreview content={dynamicContent || {}} />;
    case "pdf": return <MemoPdfPreview content={dynamicContent || {}} />;
    case "links": return <MemoLinksPreview content={dynamicContent || {}} />;
    case "vcard": return <MemoVcardPreview content={dynamicContent || {}} />;
    case "business": return <MemoBusinessPreview content={dynamicContent || {}} />;
    case "video": return <MemoVideoPreview content={dynamicContent || {}} />;
    case "images": return <MemoImagesPreview content={dynamicContent || {}} />;
    case "facebook": return <FacebookPreview />;
    case "instagram": return <InstagramPreview />;
    case "social": return <MemoSocialPreview content={dynamicContent || {}} />;
    case "whatsapp": return <WhatsappPreview />;
    case "mp3": return <MemoMp3Preview content={dynamicContent || {}} />;
    case "menu": return <MemoMenuPreview content={dynamicContent || {}} />;
    case "apps": return <MemoAppsPreview content={dynamicContent || {}} />;
    case "coupon": return <MemoCouponPreview content={dynamicContent || {}} />;
    case "wifi": return <WifiPreview />;
    case "event": return <MemoEventPreview content={dynamicContent || {}} />;
    case "email": return <EmailPreview />;
    case "sms": return <SmsPreview />;
    case "review": return <MemoReviewPreview content={dynamicContent || {}} />;
    case "bitcoin": return <BitcoinPreview />;
    case "text": return <TextPreview />;
    case "phone": return <PhoneCallPreview content={dynamicContent || {}} />;
    case "calendar": return <CalendarEventPreview content={dynamicContent || {}} />;
    case "playlist": return <MemoPlaylistPreview content={dynamicContent || {}} />;
    case "product": return <MemoProductPreview content={dynamicContent || {}} />;
    case "feedback": return <MemoFeedbackPreview content={dynamicContent || {}} />;
    default: return <DefaultPhonePreview />;
  }
}
