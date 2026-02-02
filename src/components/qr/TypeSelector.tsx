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
} from "@heroicons/react/24/outline";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GlobeAltIcon, UserIcon, ClipboardDocumentListIcon, BuildingOfficeIcon,
  DevicePhoneMobileIcon, WifiIcon, VideoCameraIcon, DocumentIcon, PhotoIcon,
  Bars3Icon, MusicalNoteIcon, TicketIcon, ChatBubbleLeftIcon, CameraIcon,
  HandThumbUpIcon, ShareIcon, StarIcon, CalendarIcon, EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon, CurrencyDollarIcon, DocumentTextIcon,
  PhoneIcon, CalendarDaysIcon, ShoppingBagIcon, ClipboardDocumentCheckIcon,
};

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
      {/* Tab pills */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setTab("dynamic")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            tab === "dynamic"
              ? "bg-violet-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Dynamic
        </button>
        <button
          onClick={() => setTab("static")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            tab === "static"
              ? "bg-violet-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Static
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        {tab === "dynamic"
          ? "Dynamic QR codes are trackable and editable after creation."
          : "Static QR codes embed data directly. They are not trackable or editable."}
      </p>

      {/* Type grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {types.map((type) => {
          const IconComp = ICON_MAP[type.icon];
          const isHovered = hoveredType === type.id;
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              onMouseEnter={() => onHover(type.id)}
              onMouseLeave={() => onHover("")}
              onClick={() => onSelect(type.id)}
              className={`group p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md bg-white ${
                isSelected
                  ? "border-violet-500 shadow-sm ring-1 ring-violet-500"
                  : isHovered
                    ? "border-violet-300 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected || isHovered ? "bg-violet-100" : "bg-gray-100 group-hover:bg-violet-50"
                }`}
              >
                {IconComp && (
                  <IconComp
                    className={`h-5 w-5 transition-colors ${
                      isSelected || isHovered ? "text-violet-600" : "text-gray-500 group-hover:text-violet-500"
                    }`}
                  />
                )}
              </div>
              <p className="text-sm font-semibold text-gray-900">{type.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
