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
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#3B82F6";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const url = content?.url || "https://example.com";
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "") || "example.com";
  const badge = content?.badge;
  const websites = content?.websites || [];
  const title = content?.title || displayUrl;
  const description = content?.description;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            {badge ? (
              <img src={badge} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
            )}
            <p className="text-white text-xs font-bold truncate">{title}</p>
            {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
          </div>

          {/* Website links */}
          <div className="p-3">
            {/* Primary URL Button */}
            <div className="rounded-lg py-2.5 text-center text-white text-[10px] font-semibold mb-2" style={{ backgroundColor: primary }}>
              🌐 Visit Website
            </div>

            {/* Additional Websites */}
            {websites.length > 0 && (
              <div className="space-y-2">
                {websites.slice(0, 3).map((w: any, idx: number) => (
                  <div key={idx} className="rounded-lg p-2 border flex items-center gap-2" style={{ borderColor: primary + "20" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primary + "15" }}>
                      <GlobeAltIcon className="h-3 w-3" style={{ color: primary }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-semibold text-gray-900 truncate">{w.name || "Website"}</p>
                      <p className="text-[8px] text-gray-500 truncate">{w.description || w.url || ""}</p>
                    </div>
                    <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PdfPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const company = content?.company;
  const title = content?.title || "Document";
  const description = content?.description;
  const buttonText = content?.buttonText || "Download PDF";
  const cover = content?.cover;
  const logo = content?.logo;
  const fileUrl = content?.fileUrl;
  const pdfs: { file: string; name?: string }[] = Array.isArray(content?.pdfs) ? content.pdfs : [];
  const pdfSource = fileUrl || (pdfs.length > 0 ? pdfs[0].file : null);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      {/* Card container matching actual landing page */}
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header */}
          {cover ? (
            <div className="relative h-24">
              <img src={cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                {logo && <img src={logo} alt="" className="w-8 h-8 rounded-lg object-cover mx-auto mb-1 border border-white/50" />}
                <p className="text-white text-xs font-bold truncate px-2">{title}</p>
                {description && <p className="text-white/80 text-[9px] truncate px-2">{description}</p>}
              </div>
            </div>
          ) : (
            <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
              {logo ? (
                <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
              ) : (
                <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center">
                  <DocumentIcon className="h-6 w-6 text-white" />
                </div>
              )}
              {company && <p className="text-white/70 text-[9px] truncate">{company}</p>}
              <p className="text-white text-xs font-bold truncate">{title}</p>
              {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
            </div>
          )}

          {/* PDF Preview Area */}
          <div className="p-3">
            {pdfSource ? (
              <div className="h-32 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`${pdfSource}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="h-24 flex flex-col items-center justify-center rounded-lg" style={{ backgroundColor: tertiary }}>
                <DocumentIcon className="h-8 w-8 mb-1" style={{ color: primary + "60" }} />
                <p className="text-[9px] text-gray-500">PDF preview</p>
              </div>
            )}

            {/* Download button */}
            <div className="rounded-lg py-2 text-center mt-3" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">{buttonText}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LinksPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const title = content?.title || "My Links";
  const description = content?.description || "Check out my links";
  const logo = content?.logo;
  const links = content?.links;
  const linkLabels = links && links.length > 0
    ? links.slice(0, 4).map((l: any) => l.text || l.label || "Link")
    : ["Website", "Twitter", "YouTube", "Instagram"];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      {/* Card container matching actual landing page */}
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden bg-white/20 border-2 border-white/30">
              {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <UserIcon className="h-6 w-6 text-white" />}
            </div>
            <p className="text-white text-xs font-bold truncate">{title}</p>
            {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
          </div>

          {/* Links */}
          <div className="p-3 space-y-2">
            {linkLabels.map((l: string, i: number) => (
              <div key={i} className="rounded-lg py-2.5 text-center border" style={{ borderColor: primary + "30" }}>
                <span className="text-[10px] font-medium" style={{ color: primary }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VcardPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const name = [content?.firstName, content?.lastName].filter(Boolean).join(" ") || "John Smith";
  const jobLine = [content?.title, content?.company].filter(Boolean).join(" at ") || "Software Engineer";
  const photo = content?.photo;
  const initials = (content?.firstName?.[0] || "J") + (content?.lastName?.[0] || "S");
  const phone = content?.phone;
  const email = content?.email;
  const website = content?.website;
  const fields = [
    phone && { label: "Phone", value: phone },
    email && { label: "Email", value: email },
    website && { label: "Website", value: website },
  ].filter(Boolean).slice(0, 3);

  // Default fields if none provided
  const displayFields = fields.length > 0 ? fields : [
    { label: "Phone", value: "+1 (555) 123-4567" },
    { label: "Email", value: "john@example.com" },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      {/* Card container matching actual landing page */}
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with avatar */}
          <div className="px-4 pt-5 pb-4 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden border-2 shadow-lg" style={{ borderColor: secondary, backgroundColor: "rgba(255,255,255,0.2)" }}>
              {photo ? (
                <img src={photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold" style={{ color: secondary }}>{initials}</span>
              )}
            </div>
            <p className="text-sm font-bold truncate" style={{ color: secondary }}>{name}</p>
            {jobLine && <p className="text-[10px] truncate" style={{ color: secondary + "cc" }}>{jobLine}</p>}
          </div>

          {/* Contact fields */}
          <div className="p-3 space-y-2">
            {displayFields.map((f: any) => (
              <div key={f.label} className="rounded-lg border px-3 py-2" style={{ borderColor: primary + "30" }}>
                <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>{f.label}</p>
                <p className="text-[10px] text-gray-700 truncate">{f.value}</p>
              </div>
            ))}

            {/* Save Contact button */}
            <div className="rounded-lg py-2 text-center mt-1" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">Save Contact</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const companyName = content?.companyName || "Company Name";
  const headline = content?.title || content?.description || "Your business tagline";
  const logo = content?.logo;
  const cover = content?.cover;
  const schedule: { day: string; open: string; close: string }[] = Array.isArray(content?.schedule) ? content.schedule : [];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      {/* Card container matching actual landing page */}
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with cover or gradient */}
          {cover ? (
            <div className="relative h-20">
              <img src={cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-white text-xs font-bold truncate px-2">{companyName}</p>
                <p className="text-white/80 text-[9px] truncate px-2">{headline}</p>
              </div>
            </div>
          ) : (
            <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
              {logo ? (
                <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                </div>
              )}
              <p className="text-white text-xs font-bold truncate">{companyName}</p>
              <p className="text-white/80 text-[9px] truncate">{headline}</p>
            </div>
          )}

          {/* Section links */}
          <div className="p-3 space-y-1.5">
            {["About", "Products", "Contact"].map((s) => (
              <div key={s} className="flex items-center justify-between py-2 px-2 rounded-lg border" style={{ borderColor: primary + "20" }}>
                <span className="text-[10px] text-gray-700">{s}</span>
                <ChevronRightIcon className="h-3 w-3" style={{ color: primary }} />
              </div>
            ))}

            {/* Schedule if provided */}
            {schedule.length > 0 && (
              <div className="rounded-lg p-2 mt-1" style={{ backgroundColor: primary + "10" }}>
                <p className="text-[9px] font-semibold uppercase mb-1" style={{ color: primary }}>Hours</p>
                {schedule.slice(0, 2).map((s, i) => (
                  <div key={i} className="flex justify-between text-[9px] text-gray-600">
                    <span className="capitalize">{s.day}</span>
                    <span>{s.open} – {s.close}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Visit button */}
            <div className="rounded-lg py-2 text-center" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">{content?.buttonText || "Visit Website"}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const title = content?.title || "Video";
  const description = content?.description;
  const cover = content?.cover;
  const fileUrl = content?.fileUrl;
  const url = content?.url;
  const videos: string[] = Array.isArray(content?.videos) ? content.videos : [];
  const videoSource = fileUrl || url || (videos.length > 0 ? videos[0] : null);
  const buttonText = content?.buttonText || "Watch Video";

  // Detect video type
  const isYouTube = videoSource?.includes('youtube.com') || videoSource?.includes('youtu.be');
  const isVimeo = videoSource?.includes('vimeo.com');

  const getYouTubeId = (videoUrl: string): string | null => {
    const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const getVimeoId = (videoUrl: string): string | null => {
    const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const youtubeId = videoSource && isYouTube ? getYouTubeId(videoSource) : null;
  const vimeoId = videoSource && isVimeo ? getVimeoId(videoSource) : null;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header */}
          {cover ? (
            <div className="relative h-20">
              <img src={cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-white text-xs font-bold truncate px-2">{title}</p>
                {description && <p className="text-white/80 text-[9px] truncate px-2">{description}</p>}
              </div>
            </div>
          ) : (
            <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
              <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center">
                <VideoCameraIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-white text-xs font-bold truncate">{title}</p>
              {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
            </div>
          )}

          {/* Video Player Area */}
          <div className="p-3">
            <div className="h-28 bg-black rounded-lg overflow-hidden relative">
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Video"
                />
              ) : vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Vimeo Video"
                />
              ) : videoSource ? (
                <video src={videoSource} controls className="w-full h-full object-contain" preload="metadata" poster={cover} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primary }}>
                    <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Watch button */}
            <div className="rounded-lg py-2 text-center mt-3" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">{buttonText}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImagesPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const title = content?.title || "Gallery";
  const description = content?.description;
  const images: { file: string; name: string }[] = content?.images || [];
  const firstImage = images.length > 0 ? images[0].file : content?.fileUrl;
  const imageCount = images.length || (content?.fileUrl ? 1 : 0);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center">
              <PhotoIcon className="h-6 w-6 text-white" />
            </div>
            <p className="text-white text-xs font-bold truncate">{title}</p>
            {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
          </div>

          {/* Image Grid */}
          <div className="p-3">
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {images.length > 0 ? images.slice(0, 4).map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden">
                  <img src={img.file} alt="" className="w-full h-full object-cover" />
                </div>
              )) : firstImage ? (
                <div className="col-span-2 aspect-video rounded-lg overflow-hidden">
                  <img src={firstImage} alt="" className="w-full h-full object-cover" />
                </div>
              ) : [0,1,2,3].map(i => (
                <div key={i} className="aspect-square rounded-lg flex items-center justify-center" style={{ backgroundColor: tertiary }}>
                  <PhotoIcon className="h-5 w-5" style={{ color: primary + "40" }} />
                </div>
              ))}
            </div>

            {/* View All button */}
            <div className="rounded-lg py-2 text-center" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">
                {imageCount > 0 ? `View All (${imageCount})` : "View Gallery"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
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

export function SocialPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#8B5CF6";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const title = content?.title || "@creativestudio";
  const description = content?.description || "Follow us everywhere";
  const logo = content?.logo;
  const platforms = content?.platforms;
  const platformItems = platforms && platforms.length > 0
    ? platforms.slice(0, 5).map((p: any) => ({ name: p.platform || "Link", url: p.url }))
    : [
        { name: "Instagram" },
        { name: "Twitter / X" },
        { name: "LinkedIn" },
        { name: "YouTube" },
      ];

  const platformColors: Record<string, string> = {
    Instagram: "#E4405F", "Twitter / X": "#000000", Twitter: "#000000", X: "#000000",
    LinkedIn: "#0A66C2", YouTube: "#FF0000", Facebook: "#1877F2", TikTok: "#000000",
    Snapchat: "#FFFC00", Pinterest: "#E60023", Reddit: "#FF4500",
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-14 h-14 rounded-full mx-auto mb-2 overflow-hidden bg-white/20 flex items-center justify-center">
              {logo ? (
                <img src={logo} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="h-7 w-7 text-white/80" />
              )}
            </div>
            <p className="text-white text-xs font-bold truncate">{title}</p>
            {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
          </div>

          {/* Social links */}
          <div className="p-3 space-y-2">
            {platformItems.map((s: any, i: number) => {
              const pColor = platformColors[s.name] || primary;
              return (
                <div key={i} className="rounded-lg py-2 px-3 text-center text-white text-[10px] font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: pColor }}>
                  {s.name}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
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
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const title = content?.title || "Audio";
  const description = content?.description;
  const cover = content?.cover || content?.albumArt;
  const fileUrl = content?.fileUrl || content?.url;
  const hasAudio = !!fileUrl;
  const buttonText = content?.buttonText || "Download Audio";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header */}
          {cover ? (
            <div className="relative h-20">
              <img src={cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-white text-xs font-bold truncate px-2">{title}</p>
                {description && <p className="text-white/80 text-[9px] truncate px-2">{description}</p>}
              </div>
            </div>
          ) : (
            <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
              <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center">
                <MusicalNoteIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-white text-xs font-bold truncate">{title}</p>
              {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
            </div>
          )}

          {/* Album Art & Player */}
          <div className="p-3">
            {/* Album art */}
            <div className="flex justify-center mb-3">
              {cover ? (
                <img src={cover} alt="" className="w-20 h-20 rounded-xl object-cover shadow-lg" />
              ) : (
                <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: primary }}>
                  <MusicalNoteIcon className="h-10 w-10 text-white" />
                </div>
              )}
            </div>

            {/* Audio Player */}
            {hasAudio ? (
              <audio src={fileUrl} controls className="w-full h-8" preload="metadata" />
            ) : (
              <div className="space-y-1.5">
                <div className="w-full h-1 rounded-full" style={{ backgroundColor: tertiary }}>
                  <div className="w-1/3 h-1 rounded-full" style={{ backgroundColor: primary }} />
                </div>
                <div className="flex justify-between text-[8px] text-gray-400">
                  <span>0:00</span><span>--:--</span>
                </div>
              </div>
            )}

            {/* Download button */}
            <div className="rounded-lg py-2 text-center mt-3" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">{buttonText}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const DIETARY_COLORS: Record<string, string> = {
  vegetarian: "#22C55E", vegan: "#16A34A", "gluten-free": "#EAB308", spicy: "#EF4444", halal: "#3B82F6",
};

export function MenuPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const restaurantName = content?.restaurantName || "Restaurant";
  const logo = content?.logo;
  const secs = content?.sections;
  const categories = secs && secs.length > 0
    ? secs.map((s: any) => s.name || "Category").slice(0, 4)
    : ["Appetizers", "Main Course", "Desserts"];
  const firstItems = secs && secs.length > 0
    ? secs.flatMap((s: any) => (s.items || []).slice(0, 2)).slice(0, 3)
    : [];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            {logo ? (
              <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
            ) : (
              <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center">
                <Bars3Icon className="h-6 w-6 text-white" />
              </div>
            )}
            <p className="text-white text-xs font-bold truncate">{restaurantName}</p>
            <p className="text-white/80 text-[9px]">Menu</p>
          </div>

          {/* Categories */}
          <div className="p-3 space-y-1.5">
            {categories.map((cat: string, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg border" style={{ borderColor: primary + "20" }}>
                <span className="text-[10px] text-gray-700 truncate">{cat}</span>
                <ChevronRightIcon className="h-3 w-3 flex-shrink-0" style={{ color: primary }} />
              </div>
            ))}

            {/* Sample items */}
            {firstItems.length > 0 && (
              <div className="pt-1 space-y-1">
                {firstItems.slice(0, 2).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-[9px]">
                    <span className="text-gray-600 truncate">{item.name}</span>
                    {item.price && <span className="font-semibold" style={{ color: primary }}>${item.price}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* View button */}
            <div className="rounded-lg py-2 text-center mt-1" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">View Full Menu</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppsPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#EC4899";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const appName = content?.appName || "Get Our App";
  const description = content?.description || "Download now for free";
  const logo = content?.logo;
  const appStoreUrl = content?.appStoreUrl;
  const playStoreUrl = content?.playStoreUrl;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            {logo ? (
              <img src={logo} alt="" className="w-14 h-14 rounded-2xl object-cover mx-auto mb-2 shadow-lg" />
            ) : (
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                <DevicePhoneMobileIcon className="h-7 w-7 text-white" />
              </div>
            )}
            <p className="text-white text-xs font-bold truncate">{appName}</p>
            {description && <p className="text-white/80 text-[9px] truncate mt-0.5">{description}</p>}
          </div>

          {/* App store buttons */}
          <div className="p-3 space-y-2">
            {(appStoreUrl || !playStoreUrl) && (
              <div className="bg-black rounded-lg py-2.5 px-3 flex items-center gap-2">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="text-[7px] text-gray-400 leading-none">Download on the</p>
                  <p className="text-white text-[10px] font-semibold leading-tight">App Store</p>
                </div>
              </div>
            )}
            {(playStoreUrl || !appStoreUrl) && (
              <div className="bg-black rounded-lg py-2.5 px-3 flex items-center gap-2">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <div>
                  <p className="text-[7px] text-gray-400 leading-none">GET IT ON</p>
                  <p className="text-white text-[10px] font-semibold leading-tight">Google Play</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CouponPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#F59E0B";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const company = content?.company;
  const title = content?.title || "Summer Sale!";
  const badge = content?.badge || content?.discount || "20% OFF";
  const description = content?.description || "Your next purchase";
  const buttonText = content?.buttonText || "Redeem Now";
  const code = content?.code || "SAVE20";
  const logo = content?.logo;
  const expiryDate = content?.expiryDate;
  const terms = content?.terms;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            {logo ? (
              <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                <span className="text-xl">🎟️</span>
              </div>
            )}
            {company && <p className="text-white/70 text-[9px] truncate">{company}</p>}
            <p className="text-white text-xs font-bold truncate">{title}</p>
          </div>

          {/* Coupon content */}
          <div className="p-3">
            {/* Discount badge */}
            <div className="text-center py-3 border-2 border-dashed rounded-lg mb-3" style={{ borderColor: primary + "60" }}>
              <p className="text-2xl font-black" style={{ color: primary }}>{badge}</p>
              {description && <p className="text-[10px] text-gray-500 mt-1 truncate">{description}</p>}
            </div>

            {/* Coupon code */}
            <div className="rounded-lg py-2 text-center mb-2" style={{ backgroundColor: primary + "15" }}>
              <p className="text-[9px] text-gray-500 mb-0.5">Use code:</p>
              <p className="text-sm font-mono font-bold tracking-wider" style={{ color: primary }}>{code}</p>
            </div>

            {/* Expiry date */}
            {expiryDate && (
              <p className="text-center text-[9px] text-gray-400 mb-2">Valid until: {expiryDate}</p>
            )}

            {/* Terms */}
            {terms && (
              <p className="text-[8px] text-gray-400 text-center line-clamp-2">{terms}</p>
            )}

            {/* Redeem button */}
            <div className="rounded-lg py-2.5 text-center mt-3" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">{buttonText}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WifiPreview({ content }: { content?: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#EF4444";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const networkName = content?.networkName || content?.ssid || "WiFi Network";
  const encryption = content?.encryption || "WPA/WPA2";
  const logo = content?.logo;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            {logo ? (
              <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 8.5c5.5-5.5 14-5.5 19.5 0" /><path d="M5 12c3.5-3.5 9-3.5 12.5 0" /><path d="M8.5 15.5c2-2 5-2 7 0" /><circle cx="12" cy="19" r="1" fill="currentColor" />
                </svg>
              </div>
            )}
            <p className="text-white text-xs font-bold truncate">{networkName}</p>
            <p className="text-white/70 text-[9px]">WiFi Network</p>
          </div>

          {/* WiFi details */}
          <div className="p-3 space-y-2">
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Network Name</p>
              <p className="text-[11px] text-gray-700 truncate">{networkName}</p>
            </div>
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Security</p>
              <p className="text-[11px] text-gray-700">{encryption}</p>
            </div>

            {/* Connect button */}
            <div className="rounded-lg py-2.5 text-center mt-2" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">📶 Connect to WiFi</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#14B8A6";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const title = content?.title || "Tech Conference 2026";
  const description = content?.description || "The Future of Innovation";
  const buttonText = content?.buttonText || "Add to Calendar";
  const logo = content?.logo;
  const cover = content?.cover;
  const location = content?.location || "Convention Center";
  const organizer = content?.organizer;
  const startDateObj = content?.startDate ? new Date(content.startDate) : null;
  const endDateObj = content?.endDate ? new Date(content.endDate) : null;
  const month = startDateObj ? startDateObj.toLocaleDateString(undefined, { month: "short" }).toUpperCase() : "MAR";
  const day = startDateObj ? startDateObj.getDate() : 15;
  const time = startDateObj
    ? startDateObj.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "10:00 AM";
  const endTime = endDateObj
    ? endDateObj.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with cover or gradient */}
          {cover ? (
            <div className="relative h-20">
              <img src={cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-white text-xs font-bold truncate">{title}</p>
              </div>
            </div>
          ) : (
            <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
              {logo ? (
                <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                  <span className="text-xl">📅</span>
                </div>
              )}
              <p className="text-white text-xs font-bold truncate">{title}</p>
              {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
            </div>
          )}

          {/* Event details */}
          <div className="p-3 space-y-2">
            {/* Date & Time card */}
            <div className="flex items-center gap-2 rounded-lg p-2 border" style={{ borderColor: primary + "20" }}>
              <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0" style={{ backgroundColor: primary }}>
                <span className="text-white text-[8px] font-bold uppercase">{month}</span>
                <span className="text-white text-sm font-black leading-none">{day}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-gray-800 truncate">{title}</p>
                <p className="text-[9px] text-gray-500">{time}{endTime && ` - ${endTime}`}</p>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>📍 Location</p>
              <p className="text-[10px] text-gray-700 truncate">{location}</p>
            </div>

            {/* Organizer */}
            {organizer && (
              <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
                <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>👤 Organizer</p>
                <p className="text-[10px] text-gray-700 truncate">{organizer}</p>
              </div>
            )}

            {/* Add to Calendar button */}
            <div className="rounded-lg py-2.5 text-center mt-2" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">{buttonText}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmailPreview({ content }: { content?: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#3B82F6";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const email = content?.email || "hello@company.com";
  const subject = content?.subject || "Inquiry about your services";
  const body = content?.body || content?.message || "";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
              <span className="text-xl">✉️</span>
            </div>
            <p className="text-white text-xs font-bold">Send Email</p>
            <p className="text-white/70 text-[9px] truncate">{email}</p>
          </div>

          {/* Email details */}
          <div className="p-3 space-y-2">
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>To</p>
              <p className="text-[10px] text-gray-700 truncate">{email}</p>
            </div>
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Subject</p>
              <p className="text-[10px] text-gray-700 truncate">{subject}</p>
            </div>
            {body && (
              <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
                <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Message</p>
                <p className="text-[10px] text-gray-700 line-clamp-2">{body}</p>
              </div>
            )}

            {/* Send button */}
            <div className="rounded-lg py-2.5 text-center mt-2" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">📧 Send Email</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SmsPreview({ content }: { content?: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#22C55E";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const phone = content?.phone || content?.number || "+1 (555) 123-4567";
  const message = content?.message || content?.body || "Hello! This is a pre-written SMS message.";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
              <span className="text-xl">💬</span>
            </div>
            <p className="text-white text-xs font-bold">Send SMS</p>
            <p className="text-white/70 text-[9px] truncate">{phone}</p>
          </div>

          {/* SMS details */}
          <div className="p-3 space-y-2">
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>To</p>
              <p className="text-[10px] text-gray-700 truncate">{phone}</p>
            </div>
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Message</p>
              <p className="text-[10px] text-gray-700 line-clamp-3">{message}</p>
            </div>

            {/* Send button */}
            <div className="rounded-lg py-2.5 text-center mt-2" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">📱 Send SMS</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
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
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const name = content?.name || content?.title || "Rate Us!";
  const description = content?.description || "We value your honest feedback";
  const logo = content?.logo;
  const reviewLinks: { platform: string; url: string }[] = content?.reviewLinks || [];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            {logo ? (
              <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                <span className="text-xl">⭐</span>
              </div>
            )}
            <p className="text-white text-xs font-bold truncate">{name}</p>
            {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
          </div>

          {/* Stars rating display */}
          <div className="p-3">
            <div className="flex justify-center gap-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="h-6 w-6" style={{ color: primary }} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Review platforms */}
            {reviewLinks.length > 0 ? (
              <div className="space-y-2">
                {reviewLinks.slice(0, 4).map((rl, i) => (
                  <div key={i} className="rounded-lg py-2 text-center text-white text-[10px] font-semibold capitalize"
                    style={{ backgroundColor: REVIEW_PLATFORM_COLORS[rl.platform] || primary }}>
                    Review on {rl.platform}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg py-2.5 text-center" style={{ backgroundColor: primary }}>
                <span className="text-white text-[10px] font-semibold">Leave a Review</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BitcoinPreview({ content }: { content?: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#F7931A";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const address = content?.address || "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
  const amount = content?.amount;
  const label = content?.label || "Bitcoin Payment";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
              <span className="text-2xl font-black text-white">₿</span>
            </div>
            <p className="text-white text-xs font-bold">{label}</p>
            <p className="text-white/70 text-[9px]">Send BTC to this address</p>
          </div>

          {/* Bitcoin details */}
          <div className="p-3 space-y-2">
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Wallet Address</p>
              <p className="text-[9px] text-gray-700 font-mono break-all">{address.slice(0, 20)}...</p>
            </div>
            {amount && (
              <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
                <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Amount</p>
                <p className="text-[11px] text-gray-700 font-semibold">{amount} BTC</p>
              </div>
            )}

            {/* Copy button */}
            <div className="rounded-lg py-2.5 text-center mt-2" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">📋 Copy Address</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TextPreview({ content }: { content?: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#6B7280";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const text = content?.text || content?.content || "Your text content will appear here...";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <p className="text-white text-xs font-bold">Text Content</p>
          </div>

          {/* Text content */}
          <div className="p-3">
            <div className="rounded-lg p-3 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[10px] text-gray-700 leading-relaxed line-clamp-6">{text}</p>
            </div>

            {/* Copy button */}
            <div className="rounded-lg py-2.5 text-center mt-3" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">📋 Copy Text</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneCallPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#22C55E";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const name = content?.name || "John Doe";
  const phone = content?.phone || content?.number || "+1 (555) 123-4567";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20">
              <UserIcon className="h-7 w-7 text-white" />
            </div>
            <p className="text-white text-xs font-bold truncate">{name}</p>
            <p className="text-white/70 text-[9px] truncate">{phone}</p>
          </div>

          {/* Phone details */}
          <div className="p-3 space-y-2">
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Name</p>
              <p className="text-[11px] text-gray-700 truncate">{name}</p>
            </div>
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>Phone Number</p>
              <p className="text-[11px] text-gray-700">{phone}</p>
            </div>

            {/* Call button */}
            <div className="rounded-lg py-2.5 text-center mt-2" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">📞 Call Now</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalendarEventPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const eventTitle = content?.eventTitle || content?.title || "Team Meeting";
  const location = content?.location || "Conference Room A";
  const description = content?.description;
  const startDate = content?.startDate ? new Date(content.startDate) : new Date();
  const month = startDate.toLocaleDateString(undefined, { month: "short" }).toUpperCase();
  const day = startDate.getDate();
  const time = content?.startDate
    ? startDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "10:00 AM";
  const endTime = content?.endDate
    ? new Date(content.endDate).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center mx-auto mb-2 bg-white/20">
              <span className="text-white text-[8px] font-bold uppercase">{month}</span>
              <span className="text-white text-lg font-black leading-none">{day}</span>
            </div>
            <p className="text-white text-xs font-bold truncate">{eventTitle}</p>
            <p className="text-white/70 text-[9px]">{time}{endTime && ` - ${endTime}`}</p>
          </div>

          {/* Event details */}
          <div className="p-3 space-y-2">
            <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>📍 Location</p>
              <p className="text-[10px] text-gray-700 truncate">{location}</p>
            </div>
            {description && (
              <div className="rounded-lg p-2.5 border" style={{ borderColor: primary + "20" }}>
                <p className="text-[9px] font-medium uppercase" style={{ color: primary }}>📝 Description</p>
                <p className="text-[10px] text-gray-700 line-clamp-2">{description}</p>
              </div>
            )}

            {/* Add to Calendar button */}
            <div className="rounded-lg py-2.5 text-center mt-2" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">📅 Add to Calendar</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
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
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#1F2937";
  const title = content?.title || "My Playlist";
  const description = content?.description || "Music";
  const logo = content?.logo;
  const cover = content?.cover;
  const platforms = content?.platformLinks;
  const platformItems = platforms && platforms.length > 0
    ? platforms.slice(0, 4).map((p: any) => ({ name: p.platform || "Platform", url: p.url || "" }))
    : [{ name: "Spotify" }, { name: "Apple Music" }, { name: "YouTube Music" }, { name: "SoundCloud" }];

  // Platform colors matching the actual landing page
  const platformColors: Record<string, string> = {
    Spotify: "#1DB954", "Apple Music": "#FA2D48", "YouTube Music": "#FF0000",
    SoundCloud: "#FF5500", Amazon: "#FF9900", Deezer: "#FEAA2D",
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      {/* Card container matching actual landing page */}
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with cover or gradient */}
          {cover ? (
            <div className="relative h-24">
              <img src={cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-white text-xs font-bold truncate px-2">{title}</p>
                {description && <p className="text-white/80 text-[9px] truncate px-2">{description}</p>}
              </div>
            </div>
          ) : (
            <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
              {logo ? (
                <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                  <MusicalNoteIcon className="h-6 w-6 text-white" />
                </div>
              )}
              <p className="text-white text-xs font-bold truncate">{title}</p>
              {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
            </div>
          )}

          {/* Platform buttons */}
          <div className="p-3 space-y-2">
            {platformItems.map((p: any, i: number) => {
              const pColor = platformColors[p.name] || primary;
              return (
                <div key={i} className="rounded-lg py-2 text-center text-white text-[10px] font-semibold" style={{ backgroundColor: pColor }}>
                  🎧 Listen on {p.name}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const productName = content?.productName || content?.name || "Premium Product";
  const description = content?.description || "High quality, beautifully crafted";
  const company = content?.company;
  const price = content?.price ? `${content.currency === "EUR" ? "€" : content.currency === "GBP" ? "£" : "$"}${content.price}` : "$29.99";
  const buyText = content?.buyButtonText || "Buy Now";
  const images: any[] = content?.images || [];
  const heroImage = images.length > 0 ? images[0].file : null;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with image or gradient */}
          {heroImage ? (
            <div className="relative h-24">
              <img src={heroImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-white text-xs font-bold truncate">{productName}</p>
                <p className="text-white/80 text-[10px] font-semibold">{price}</p>
              </div>
            </div>
          ) : (
            <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                <PhotoIcon className="h-6 w-6 text-white" />
              </div>
              {company && <p className="text-white/70 text-[9px] truncate">{company}</p>}
              <p className="text-white text-xs font-bold truncate">{productName}</p>
              <p className="text-white/90 text-sm font-semibold">{price}</p>
            </div>
          )}

          {/* Product details */}
          <div className="p-3">
            {/* Description */}
            {description && (
              <div className="rounded-lg p-2.5 border mb-2" style={{ borderColor: primary + "20" }}>
                <p className="text-[10px] text-gray-600 line-clamp-3">{description}</p>
              </div>
            )}

            {/* Image gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-1 mb-2">
                {images.slice(1, 4).map((img: any, i: number) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden">
                    <img src={img.file} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Buy button */}
            <div className="rounded-lg py-2.5 text-center" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">🛒 {buyText}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedbackPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || pd.color || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const title = content?.title || "Share Your Feedback";
  const description = content?.description || "We value your opinion";
  const company = content?.company;
  const logo = content?.logo;
  const buttonText = content?.buttonText || "Submit Feedback";

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with gradient */}
          <div className="px-3 pt-4 pb-3 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
            {logo ? (
              <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 shadow-lg" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/20">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
            )}
            {company && <p className="text-white/70 text-[9px] truncate">{company}</p>}
            <p className="text-white text-xs font-bold truncate">{title}</p>
            {description && <p className="text-white/80 text-[9px] truncate">{description}</p>}
          </div>

          {/* Feedback form */}
          <div className="p-3">
            {/* Star rating */}
            <div className="text-center mb-3">
              <p className="text-[9px] text-gray-500 mb-1">Rate your experience</p>
              <div className="flex justify-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="h-6 w-6" style={{ color: i <= 4 ? primary : "#D1D5DB" }} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Comment field placeholder */}
            <div className="rounded-lg p-2.5 border mb-3" style={{ borderColor: primary + "20" }}>
              <p className="text-[9px] text-gray-400 mb-1">Leave a comment...</p>
              <div className="h-2.5 bg-gray-100 rounded-full w-full mb-1" />
              <div className="h-2.5 bg-gray-100 rounded-full w-3/4" />
            </div>

            {/* Submit button */}
            <div className="rounded-lg py-2.5 text-center" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">📝 {buttonText}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VcardPlusPreview({ content }: { content: Record<string, any> }) {
  const pd = content?.pageDesign || {};
  const primary = pd.primary || "#1d59f9";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";
  const name = [content?.firstName, content?.lastName].filter(Boolean).join(" ") || "Sarah Johnson";
  const jobLine = [content?.title || content?.jobTitle, content?.company].filter(Boolean).join(" at ") || "Marketing Director at TechCorp";
  const photo = content?.photo;
  const cover = content?.cover;
  const description = content?.description || content?.bio;
  const phone = content?.phone || "+1 (555) 123-4567";
  const email = content?.email || "sarah@techcorp.com";
  const website = content?.website;
  const address = content?.address;
  const socials: { platform: string; url: string }[] = content?.socials || [];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: tertiary }}>
      <div className="flex-1 flex items-start justify-center p-3 pt-4">
        <div className="w-full rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: secondary }}>
          {/* Header with cover or gradient */}
          <div className="relative" style={{ backgroundColor: primary }}>
            {cover ? (
              <div className="h-16">
                <img src={cover} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            ) : (
              <div className="h-16" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }} />
            )}
            {/* Profile photo */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 rounded-full border-2 border-white bg-white shadow-lg flex items-center justify-center overflow-hidden">
                {photo ? (
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-3 pt-8 pb-3">
            <div className="text-center mb-3">
              <p className="text-xs font-bold text-gray-900 truncate">{name}</p>
              <p className="text-[10px] text-gray-500 truncate">{jobLine}</p>
              {description && (
                <p className="text-[9px] text-gray-400 mt-1 line-clamp-2">{description}</p>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-1.5 mb-3">
              <div className="rounded-lg px-2.5 py-1.5 border" style={{ borderColor: primary + "20" }}>
                <p className="text-[8px] font-medium uppercase" style={{ color: primary }}>📞 Phone</p>
                <p className="text-[9px] text-gray-700 truncate">{phone}</p>
              </div>
              <div className="rounded-lg px-2.5 py-1.5 border" style={{ borderColor: primary + "20" }}>
                <p className="text-[8px] font-medium uppercase" style={{ color: primary }}>✉️ Email</p>
                <p className="text-[9px] text-gray-700 truncate">{email}</p>
              </div>
              {website && (
                <div className="rounded-lg px-2.5 py-1.5 border" style={{ borderColor: primary + "20" }}>
                  <p className="text-[8px] font-medium uppercase" style={{ color: primary }}>🌐 Website</p>
                  <p className="text-[9px] text-gray-700 truncate">{website}</p>
                </div>
              )}
            </div>

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="flex justify-center gap-1.5 mb-3">
                {socials.slice(0, 5).map((s, i) => (
                  <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: primary + "15" }}>
                    <span className="text-[7px] font-bold uppercase" style={{ color: primary }}>{(s.platform || "").slice(0, 2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Save Contact button */}
            <div className="rounded-lg py-2 text-center" style={{ backgroundColor: primary }}>
              <span className="text-white text-[10px] font-semibold">💾 Save Contact</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-2 text-center">
            <p className="text-[8px]" style={{ color: primary + "80" }}>Powered by QRCraft</p>
          </div>
        </div>
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

// ─── Memoized dynamic previews ───────────────────────────────────────────────
const MemoPdfPreview = React.memo(PdfPreview);
const MemoLinksPreview = React.memo(LinksPreview);
const MemoVcardPreview = React.memo(VcardPreview);
const MemoVcardPlusPreview = React.memo(VcardPlusPreview);
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
    case "vcard-plus": return <MemoVcardPlusPreview content={dynamicContent || {}} />;
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
    case "wifi": return <WifiPreview content={dynamicContent || {}} />;
    case "event": return <MemoEventPreview content={dynamicContent || {}} />;
    case "email": return <EmailPreview content={dynamicContent || {}} />;
    case "sms": return <SmsPreview content={dynamicContent || {}} />;
    case "review": return <MemoReviewPreview content={dynamicContent || {}} />;
    case "bitcoin": return <BitcoinPreview content={dynamicContent || {}} />;
    case "text": return <TextPreview content={dynamicContent || {}} />;
    case "phone": return <PhoneCallPreview content={dynamicContent || {}} />;
    case "calendar": return <CalendarEventPreview content={dynamicContent || {}} />;
    case "playlist": return <MemoPlaylistPreview content={dynamicContent || {}} />;
    case "product": return <MemoProductPreview content={dynamicContent || {}} />;
    case "feedback": return <MemoFeedbackPreview content={dynamicContent || {}} />;
    default: return <DefaultPhonePreview />;
  }
}
