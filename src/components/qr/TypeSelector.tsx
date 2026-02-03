"use client";

import { useState } from "react";
import { DYNAMIC_QR_TYPES, STATIC_QR_TYPES } from "@/lib/utils";
import {
  GlobeAltIcon, UserIcon, ClipboardDocumentListIcon, BuildingOfficeIcon,
  DevicePhoneMobileIcon, WifiIcon, VideoCameraIcon, DocumentIcon, PhotoIcon,
  Bars3Icon, MusicalNoteIcon, TicketIcon, ChatBubbleLeftIcon, CameraIcon,
  HandThumbUpIcon, ShareIcon, StarIcon, CalendarIcon, EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon, CurrencyDollarIcon, DocumentTextIcon,
  PhoneIcon, CalendarDaysIcon, ShoppingBagIcon, ClipboardDocumentCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GlobeAltIcon, UserIcon, ClipboardDocumentListIcon, BuildingOfficeIcon,
  DevicePhoneMobileIcon, WifiIcon, VideoCameraIcon, DocumentIcon, PhotoIcon,
  Bars3Icon, MusicalNoteIcon, TicketIcon, ChatBubbleLeftIcon, CameraIcon,
  HandThumbUpIcon, ShareIcon, StarIcon, CalendarIcon, EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon, CurrencyDollarIcon, DocumentTextIcon,
  PhoneIcon, CalendarDaysIcon, ShoppingBagIcon, ClipboardDocumentCheckIcon,
};

// Popular types to highlight
const POPULAR_TYPES = ["website", "vcard", "links", "wifi", "business", "menu"];

interface TypeSelectorProps {
  onSelect: (typeId: string) => void;
  hoveredType: string;
  onHover: (typeId: string) => void;
  selectedType: string;
}

export default function TypeSelector({ onSelect, hoveredType, onHover, selectedType }: TypeSelectorProps) {
  const [tab, setTab] = useState<"dynamic" | "static">("dynamic");
  const types = tab === "dynamic" ? DYNAMIC_QR_TYPES : STATIC_QR_TYPES;

  return (
    <div>
      {/* Tab pills with premium styling */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setTab("dynamic")}
          className={`group relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            tab === "dynamic"
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-violet-200"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            <SparklesIcon className="h-4 w-4" />
            Dynamic
          </span>
          {tab === "dynamic" && (
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur opacity-40" />
          )}
        </button>
        <button
          onClick={() => setTab("static")}
          className={`group relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            tab === "static"
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-violet-200"
          }`}
        >
          <span className="relative z-10">Static</span>
          {tab === "static" && (
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur opacity-40" />
          )}
        </button>
      </div>

      {/* Info banner */}
      <div className={`mb-6 p-4 rounded-xl border ${
        tab === "dynamic"
          ? "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200"
          : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
      }`}>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          {tab === "dynamic" ? (
            <>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-xs font-bold">✓</span>
              <span><strong>Dynamic QR codes</strong> are trackable, editable anytime, and include analytics.</span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">i</span>
              <span><strong>Static QR codes</strong> embed data directly. Not trackable or editable after creation.</span>
            </>
          )}
        </p>
      </div>

      {/* Type grid with premium cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {types.map((type) => {
          const IconComp = ICON_MAP[type.icon];
          const isHovered = hoveredType === type.id;
          const isSelected = selectedType === type.id;
          const isPopular = POPULAR_TYPES.includes(type.id);

          return (
            <button
              key={type.id}
              onMouseEnter={() => onHover(type.id)}
              onMouseLeave={() => onHover("")}
              onClick={() => onSelect(type.id)}
              className={`group relative p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isSelected
                  ? "border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg shadow-violet-500/20"
                  : isHovered
                    ? "border-violet-300 bg-white shadow-lg"
                    : "border-gray-100 bg-white hover:border-violet-200"
              }`}
            >
              {/* Popular badge */}
              {isPopular && tab === "dynamic" && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[9px] font-bold rounded-full shadow-sm">
                  POPULAR
                </div>
              )}

              {/* Icon container with gradient */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30"
                    : isHovered
                      ? "bg-gradient-to-br from-violet-100 to-purple-100"
                      : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-violet-50 group-hover:to-purple-50"
                }`}
              >
                {IconComp && (
                  <IconComp
                    className={`h-6 w-6 transition-all duration-300 ${
                      isSelected
                        ? "text-white"
                        : isHovered
                          ? "text-violet-600"
                          : "text-gray-500 group-hover:text-violet-500"
                    }`}
                  />
                )}
              </div>

              {/* Text content */}
              <p className={`text-sm font-bold mb-1 transition-colors ${
                isSelected ? "text-violet-700" : "text-gray-900"
              }`}>
                {type.name}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {type.description}
              </p>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
