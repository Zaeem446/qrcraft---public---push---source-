"use client";

import { useState } from "react";
import {
  QrCodeIcon, ChevronDownIcon, ArrowPathIcon,
  PhotoIcon as PhotoSolidIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// ─── SVG Pattern Thumbnails ──────────────────────────────────────────────────

// Pattern SVGs matching QRFY's actual "QR code style" renders from screenshot
function PatternSVG({ style }: { style: string }) {
  const s = 48;

  // Simple thumbnail showing the pattern style - matching QRFY's UI thumbnails
  switch (style) {
    case "square": // Solid squares
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="8" height="8" fill="currentColor"/>
          <rect x="14" y="4" width="8" height="8" fill="currentColor"/>
          <rect x="26" y="4" width="8" height="8" fill="currentColor"/>
          <rect x="36" y="4" width="8" height="8" fill="currentColor"/>
          <rect x="4" y="14" width="8" height="8" fill="currentColor"/>
          <rect x="20" y="14" width="8" height="8" fill="currentColor"/>
          <rect x="36" y="14" width="8" height="8" fill="currentColor"/>
          <rect x="4" y="26" width="8" height="8" fill="currentColor"/>
          <rect x="20" y="26" width="8" height="8" fill="currentColor"/>
          <rect x="36" y="26" width="8" height="8" fill="currentColor"/>
          <rect x="4" y="36" width="8" height="8" fill="currentColor"/>
          <rect x="14" y="36" width="8" height="8" fill="currentColor"/>
          <rect x="26" y="36" width="8" height="8" fill="currentColor"/>
          <rect x="36" y="36" width="8" height="8" fill="currentColor"/>
        </svg>
      );
    case "rounded": // Rounded squares
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="14" y="4" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="26" y="4" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="36" y="4" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="4" y="14" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="20" y="14" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="36" y="14" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="4" y="26" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="20" y="26" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="36" y="26" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="4" y="36" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="14" y="36" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="26" y="36" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="36" y="36" width="8" height="8" rx="2" fill="currentColor"/>
        </svg>
      );
    case "dots": // Small dots
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <circle cx="8" cy="8" r="3" fill="currentColor"/>
          <circle cx="18" cy="8" r="3" fill="currentColor"/>
          <circle cx="30" cy="8" r="3" fill="currentColor"/>
          <circle cx="40" cy="8" r="3" fill="currentColor"/>
          <circle cx="8" cy="18" r="3" fill="currentColor"/>
          <circle cx="24" cy="18" r="3" fill="currentColor"/>
          <circle cx="40" cy="18" r="3" fill="currentColor"/>
          <circle cx="8" cy="30" r="3" fill="currentColor"/>
          <circle cx="24" cy="30" r="3" fill="currentColor"/>
          <circle cx="40" cy="30" r="3" fill="currentColor"/>
          <circle cx="8" cy="40" r="3" fill="currentColor"/>
          <circle cx="18" cy="40" r="3" fill="currentColor"/>
          <circle cx="30" cy="40" r="3" fill="currentColor"/>
          <circle cx="40" cy="40" r="3" fill="currentColor"/>
        </svg>
      );
    case "classy": // Offset/classy pattern
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="7" height="9" fill="currentColor"/>
          <rect x="13" y="4" width="7" height="9" fill="currentColor"/>
          <rect x="28" y="4" width="7" height="9" fill="currentColor"/>
          <rect x="37" y="4" width="7" height="9" fill="currentColor"/>
          <rect x="6" y="15" width="7" height="9" fill="currentColor"/>
          <rect x="22" y="15" width="7" height="9" fill="currentColor"/>
          <rect x="35" y="15" width="7" height="9" fill="currentColor"/>
          <rect x="4" y="26" width="7" height="9" fill="currentColor"/>
          <rect x="22" y="26" width="7" height="9" fill="currentColor"/>
          <rect x="37" y="26" width="7" height="9" fill="currentColor"/>
          <rect x="6" y="37" width="7" height="9" fill="currentColor"/>
          <rect x="15" y="37" width="7" height="9" fill="currentColor"/>
          <rect x="26" y="37" width="7" height="9" fill="currentColor"/>
          <rect x="35" y="37" width="7" height="9" fill="currentColor"/>
        </svg>
      );
    case "classy-rounded": // Classy with rounded corners
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="13" y="4" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="28" y="4" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="37" y="4" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="6" y="15" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="22" y="15" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="35" y="15" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="4" y="26" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="22" y="26" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="37" y="26" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="6" y="37" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="15" y="37" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="26" y="37" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="35" y="37" width="7" height="9" rx="2" fill="currentColor"/>
        </svg>
      );
    case "extra-rounded": // Large circles
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <circle cx="8" cy="8" r="5" fill="currentColor"/>
          <circle cx="20" cy="8" r="5" fill="currentColor"/>
          <circle cx="32" cy="8" r="5" fill="currentColor"/>
          <circle cx="8" cy="20" r="5" fill="currentColor"/>
          <circle cx="24" cy="20" r="5" fill="currentColor"/>
          <circle cx="40" cy="20" r="5" fill="currentColor"/>
          <circle cx="8" cy="32" r="5" fill="currentColor"/>
          <circle cx="24" cy="32" r="5" fill="currentColor"/>
          <circle cx="40" cy="32" r="5" fill="currentColor"/>
          <circle cx="16" cy="40" r="5" fill="currentColor"/>
          <circle cx="28" cy="40" r="5" fill="currentColor"/>
          <circle cx="40" cy="40" r="5" fill="currentColor"/>
        </svg>
      );
    case "cross": // Plus/cross pattern
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <path d="M6,4 h4 v4 h-4z M4,6 h4 v4 h-4z" fill="currentColor"/>
          <path d="M18,4 h4 v4 h-4z M16,6 h4 v4 h-4z" fill="currentColor"/>
          <path d="M34,4 h4 v4 h-4z M32,6 h4 v4 h-4z" fill="currentColor"/>
          <path d="M6,18 h4 v4 h-4z M4,20 h4 v4 h-4z" fill="currentColor"/>
          <path d="M22,18 h4 v4 h-4z M20,20 h4 v4 h-4z" fill="currentColor"/>
          <path d="M38,18 h4 v4 h-4z M36,20 h4 v4 h-4z" fill="currentColor"/>
          <path d="M6,34 h4 v4 h-4z M4,36 h4 v4 h-4z" fill="currentColor"/>
          <path d="M22,34 h4 v4 h-4z M20,36 h4 v4 h-4z" fill="currentColor"/>
          <path d="M38,34 h4 v4 h-4z M36,36 h4 v4 h-4z" fill="currentColor"/>
        </svg>
      );
    case "cross-rounded": // Rounded cross
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="6" y="4" width="4" height="8" rx="1" fill="currentColor"/>
          <rect x="4" y="6" width="8" height="4" rx="1" fill="currentColor"/>
          <rect x="22" y="4" width="4" height="8" rx="1" fill="currentColor"/>
          <rect x="20" y="6" width="8" height="4" rx="1" fill="currentColor"/>
          <rect x="38" y="4" width="4" height="8" rx="1" fill="currentColor"/>
          <rect x="36" y="6" width="8" height="4" rx="1" fill="currentColor"/>
          <rect x="6" y="20" width="4" height="8" rx="1" fill="currentColor"/>
          <rect x="4" y="22" width="8" height="4" rx="1" fill="currentColor"/>
          <rect x="22" y="20" width="4" height="8" rx="1" fill="currentColor"/>
          <rect x="20" y="22" width="8" height="4" rx="1" fill="currentColor"/>
          <rect x="38" y="36" width="4" height="8" rx="1" fill="currentColor"/>
          <rect x="36" y="38" width="8" height="4" rx="1" fill="currentColor"/>
        </svg>
      );
    case "diamond": // Diamond shapes
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <polygon points="8,2 14,8 8,14 2,8" fill="currentColor"/>
          <polygon points="24,2 30,8 24,14 18,8" fill="currentColor"/>
          <polygon points="40,2 46,8 40,14 34,8" fill="currentColor"/>
          <polygon points="8,18 14,24 8,30 2,24" fill="currentColor"/>
          <polygon points="24,18 30,24 24,30 18,24" fill="currentColor"/>
          <polygon points="40,18 46,24 40,30 34,24" fill="currentColor"/>
          <polygon points="8,34 14,40 8,46 2,40" fill="currentColor"/>
          <polygon points="24,34 30,40 24,46 18,40" fill="currentColor"/>
          <polygon points="40,34 46,40 40,46 34,40" fill="currentColor"/>
        </svg>
      );
    case "diamond-special": // Diamond with center dot
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <polygon points="8,2 14,8 8,14 2,8" fill="currentColor"/>
          <circle cx="8" cy="8" r="1.5" fill="white"/>
          <polygon points="24,2 30,8 24,14 18,8" fill="currentColor"/>
          <circle cx="24" cy="8" r="1.5" fill="white"/>
          <polygon points="40,2 46,8 40,14 34,8" fill="currentColor"/>
          <circle cx="40" cy="8" r="1.5" fill="white"/>
          <polygon points="8,18 14,24 8,30 2,24" fill="currentColor"/>
          <circle cx="8" cy="24" r="1.5" fill="white"/>
          <polygon points="24,18 30,24 24,30 18,24" fill="currentColor"/>
          <circle cx="24" cy="24" r="1.5" fill="white"/>
          <polygon points="40,34 46,40 40,46 34,40" fill="currentColor"/>
          <circle cx="40" cy="40" r="1.5" fill="white"/>
        </svg>
      );
    case "heart": // Heart shapes
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <path d="M8 14 C8 10 4 8 4 12 C4 15 8 18 8 18 C8 18 12 15 12 12 C12 8 8 10 8 14Z" fill="currentColor"/>
          <path d="M24 14 C24 10 20 8 20 12 C20 15 24 18 24 18 C24 18 28 15 28 12 C28 8 24 10 24 14Z" fill="currentColor"/>
          <path d="M40 14 C40 10 36 8 36 12 C36 15 40 18 40 18 C40 18 44 15 44 12 C44 8 40 10 40 14Z" fill="currentColor"/>
          <path d="M8 30 C8 26 4 24 4 28 C4 31 8 34 8 34 C8 34 12 31 12 28 C12 24 8 26 8 30Z" fill="currentColor"/>
          <path d="M24 30 C24 26 20 24 20 28 C20 31 24 34 24 34 C24 34 28 31 28 28 C28 24 24 26 24 30Z" fill="currentColor"/>
          <path d="M40 30 C40 26 36 24 36 28 C36 31 40 34 40 34 C40 34 44 31 44 28 C44 24 40 26 40 30Z" fill="currentColor"/>
        </svg>
      );
    case "horizontal-rounded": // Horizontal bars
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="2" y="6" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="18" y="6" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="34" y="6" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="2" y="18" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="18" y="18" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="34" y="18" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="2" y="30" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="18" y="30" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="34" y="30" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="2" y="42" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="18" y="42" width="12" height="4" rx="2" fill="currentColor"/>
          <rect x="34" y="42" width="12" height="4" rx="2" fill="currentColor"/>
        </svg>
      );
    case "vertical-rounded": // Vertical bars
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="6" y="2" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="6" y="18" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="6" y="34" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="18" y="2" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="18" y="18" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="18" y="34" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="30" y="2" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="30" y="18" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="30" y="34" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="42" y="2" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="42" y="18" width="4" height="12" rx="2" fill="currentColor"/>
          <rect x="42" y="34" width="4" height="12" rx="2" fill="currentColor"/>
        </svg>
      );
    case "ribbon": // Double lines
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="8" height="3" fill="currentColor"/>
          <rect x="4" y="9" width="8" height="3" fill="currentColor"/>
          <rect x="20" y="4" width="8" height="3" fill="currentColor"/>
          <rect x="20" y="9" width="8" height="3" fill="currentColor"/>
          <rect x="36" y="4" width="8" height="3" fill="currentColor"/>
          <rect x="36" y="9" width="8" height="3" fill="currentColor"/>
          <rect x="4" y="20" width="8" height="3" fill="currentColor"/>
          <rect x="4" y="25" width="8" height="3" fill="currentColor"/>
          <rect x="20" y="20" width="8" height="3" fill="currentColor"/>
          <rect x="20" y="25" width="8" height="3" fill="currentColor"/>
          <rect x="36" y="36" width="8" height="3" fill="currentColor"/>
          <rect x="36" y="41" width="8" height="3" fill="currentColor"/>
        </svg>
      );
    case "shake": // Offset/shaky squares
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="3" y="5" width="7" height="7" fill="currentColor"/>
          <rect x="15" y="3" width="7" height="7" fill="currentColor"/>
          <rect x="29" y="5" width="7" height="7" fill="currentColor"/>
          <rect x="39" y="3" width="7" height="7" fill="currentColor"/>
          <rect x="5" y="17" width="7" height="7" fill="currentColor"/>
          <rect x="21" y="19" width="7" height="7" fill="currentColor"/>
          <rect x="37" y="17" width="7" height="7" fill="currentColor"/>
          <rect x="3" y="31" width="7" height="7" fill="currentColor"/>
          <rect x="21" y="29" width="7" height="7" fill="currentColor"/>
          <rect x="39" y="31" width="7" height="7" fill="currentColor"/>
        </svg>
      );
    case "sparkle": // 4-point stars
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <polygon points="8,2 10,6 14,8 10,10 8,14 6,10 2,8 6,6" fill="currentColor"/>
          <polygon points="24,2 26,6 30,8 26,10 24,14 22,10 18,8 22,6" fill="currentColor"/>
          <polygon points="40,2 42,6 46,8 42,10 40,14 38,10 34,8 38,6" fill="currentColor"/>
          <polygon points="8,18 10,22 14,24 10,26 8,30 6,26 2,24 6,22" fill="currentColor"/>
          <polygon points="24,18 26,22 30,24 26,26 24,30 22,26 18,24 22,22" fill="currentColor"/>
          <polygon points="40,18 42,22 46,24 42,26 40,30 38,26 34,24 38,22" fill="currentColor"/>
          <polygon points="8,34 10,38 14,40 10,42 8,46 6,42 2,40 6,38" fill="currentColor"/>
          <polygon points="24,34 26,38 30,40 26,42 24,46 22,42 18,40 22,38" fill="currentColor"/>
          <polygon points="40,34 42,38 46,40 42,42 40,46 38,42 34,40 38,38" fill="currentColor"/>
        </svg>
      );
    case "star": // 5-point stars
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <polygon points="8,2 9.5,6 14,6.5 10.5,9.5 11.5,14 8,11.5 4.5,14 5.5,9.5 2,6.5 6.5,6" fill="currentColor"/>
          <polygon points="24,2 25.5,6 30,6.5 26.5,9.5 27.5,14 24,11.5 20.5,14 21.5,9.5 18,6.5 22.5,6" fill="currentColor"/>
          <polygon points="40,2 41.5,6 46,6.5 42.5,9.5 43.5,14 40,11.5 36.5,14 37.5,9.5 34,6.5 38.5,6" fill="currentColor"/>
          <polygon points="8,18 9.5,22 14,22.5 10.5,25.5 11.5,30 8,27.5 4.5,30 5.5,25.5 2,22.5 6.5,22" fill="currentColor"/>
          <polygon points="24,18 25.5,22 30,22.5 26.5,25.5 27.5,30 24,27.5 20.5,30 21.5,25.5 18,22.5 22.5,22" fill="currentColor"/>
          <polygon points="40,34 41.5,38 46,38.5 42.5,41.5 43.5,46 40,43.5 36.5,46 37.5,41.5 34,38.5 38.5,38" fill="currentColor"/>
        </svg>
      );
    case "x": // X shapes
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <path d="M4,4 L12,12 M12,4 L4,12" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M20,4 L28,12 M28,4 L20,12" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M36,4 L44,12 M44,4 L36,12" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M4,20 L12,28 M12,20 L4,28" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M20,20 L28,28 M28,20 L20,28" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M36,20 L44,28 M44,20 L36,28" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M4,36 L12,44 M12,36 L4,44" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M20,36 L28,44 M28,36 L20,44" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M36,36 L44,44 M44,36 L36,44" stroke="currentColor" strokeWidth="3" fill="none"/>
        </svg>
      );
    case "x-rounded": // Rounded X shapes
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <path d="M4,4 L12,12 M12,4 L4,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M20,4 L28,12 M28,4 L20,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M36,4 L44,12 M44,4 L36,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M4,20 L12,28 M12,20 L4,28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M20,20 L28,28 M28,20 L20,28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M36,20 L44,28 M44,20 L36,28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M4,36 L12,44 M12,36 L4,44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M20,36 L28,44 M28,36 L20,44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M36,36 L44,44 M44,36 L36,44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="8" height="8" fill="currentColor"/>
          <rect x="20" y="4" width="8" height="8" fill="currentColor"/>
          <rect x="36" y="4" width="8" height="8" fill="currentColor"/>
          <rect x="4" y="20" width="8" height="8" fill="currentColor"/>
          <rect x="20" y="20" width="8" height="8" fill="currentColor"/>
          <rect x="36" y="20" width="8" height="8" fill="currentColor"/>
          <rect x="4" y="36" width="8" height="8" fill="currentColor"/>
          <rect x="20" y="36" width="8" height="8" fill="currentColor"/>
          <rect x="36" y="36" width="8" height="8" fill="currentColor"/>
        </svg>
      );
  }
}

// Border style SVGs matching QRFY's actual "Border style" from screenshot
function CornerSquareSVG({ style }: { style: string }) {
  const s = 48;
  switch (style) {
    case "default": // Sharp square
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" stroke="currentColor" strokeWidth="5" fill="none"/>
          <rect x="16" y="16" width="16" height="16" fill="currentColor"/>
        </svg>
      );
    case "dot": // Circle
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="5" fill="none"/>
          <circle cx="24" cy="24" r="7" fill="currentColor"/>
        </svg>
      );
    case "square": // Small rounded
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="5" fill="none"/>
          <rect x="16" y="16" width="16" height="16" rx="2" fill="currentColor"/>
        </svg>
      );
    case "extra-rounded": // Medium rounded
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" rx="8" stroke="currentColor" strokeWidth="5" fill="none"/>
          <rect x="16" y="16" width="16" height="16" rx="4" fill="currentColor"/>
        </svg>
      );
    case "shape1": // Large rounded
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" rx="14" stroke="currentColor" strokeWidth="5" fill="none"/>
          <rect x="16" y="16" width="16" height="16" rx="6" fill="currentColor"/>
        </svg>
      );
    case "shape2": // Very rounded (almost circle)
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" rx="18" stroke="currentColor" strokeWidth="5" fill="none"/>
          <circle cx="24" cy="24" r="7" fill="currentColor"/>
        </svg>
      );
    case "shape3": // Square with circle inside
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" stroke="currentColor" strokeWidth="4" fill="none"/>
          <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="3" fill="none"/>
          <circle cx="24" cy="24" r="4" fill="currentColor"/>
        </svg>
      );
    case "shape4": // Diamond outer
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <polygon points="24,4 44,24 24,44 4,24" stroke="currentColor" strokeWidth="4" fill="none"/>
          <rect x="17" y="17" width="14" height="14" fill="currentColor"/>
        </svg>
      );
    case "shape5": // Circle with square inside
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="none"/>
          <rect x="16" y="16" width="16" height="16" fill="currentColor"/>
        </svg>
      );
    case "shape6": // Double square
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="4" y="4" width="40" height="40" stroke="currentColor" strokeWidth="3" fill="none"/>
          <rect x="10" y="10" width="28" height="28" stroke="currentColor" strokeWidth="3" fill="none"/>
          <rect x="18" y="18" width="12" height="12" fill="currentColor"/>
        </svg>
      );
    case "shape7": // Double circle
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="none"/>
          <circle cx="24" cy="24" r="13" stroke="currentColor" strokeWidth="3" fill="none"/>
          <circle cx="24" cy="24" r="5" fill="currentColor"/>
        </svg>
      );
    case "shape8": // Square with rounded inner
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" stroke="currentColor" strokeWidth="4" fill="none"/>
          <rect x="14" y="14" width="20" height="20" rx="10" fill="currentColor"/>
        </svg>
      );
    case "shape9": // Rounded with rounded inner
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" rx="6" stroke="currentColor" strokeWidth="4" fill="none"/>
          <rect x="12" y="12" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="18" y="18" width="12" height="12" rx="3" fill="currentColor"/>
        </svg>
      );
    case "shape10": // Pill horizontal
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="4" y="12" width="40" height="24" rx="12" stroke="currentColor" strokeWidth="4" fill="none"/>
          <rect x="18" y="18" width="12" height="12" rx="3" fill="currentColor"/>
        </svg>
      );
    case "shape11": // Corner brackets only
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <path d="M6 16 L6 6 L16 6" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path d="M32 6 L42 6 L42 16" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path d="M42 32 L42 42 L32 42" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path d="M16 42 L6 42 L6 32" stroke="currentColor" strokeWidth="4" fill="none"/>
          <rect x="16" y="16" width="16" height="16" fill="currentColor"/>
        </svg>
      );
    case "shape12": // Dotted square
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" fill="none"/>
          <rect x="16" y="16" width="16" height="16" fill="currentColor"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="6" width="36" height="36" stroke="currentColor" strokeWidth="5" fill="none"/>
          <rect x="16" y="16" width="16" height="16" fill="currentColor"/>
        </svg>
      );
  }
}

// Center style SVGs matching QRFY's actual "Center style" from screenshot
function CornerDotSVG({ style }: { style: string }) {
  switch (style) {
    case "default": // Solid square
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="10" y="10" width="28" height="28" fill="currentColor"/>
        </svg>
      );
    case "dot": // Horizontal oval/pill
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="6" y="14" width="36" height="20" rx="10" fill="currentColor"/>
        </svg>
      );
    case "rounded": // Rounded square
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="10" y="10" width="28" height="28" rx="6" fill="currentColor"/>
        </svg>
      );
    case "dot2": // Circle
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="14" fill="currentColor"/>
        </svg>
      );
    case "dot3": // Donut (circle with hole)
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="14" fill="currentColor"/>
          <circle cx="24" cy="24" r="6" fill="white"/>
        </svg>
      );
    case "dot4": // Smaller circle
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="10" fill="currentColor"/>
        </svg>
      );
    case "star": // 5-point star
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <polygon points="24,4 28,18 44,18 31,28 36,44 24,34 12,44 17,28 4,18 20,18" fill="currentColor"/>
        </svg>
      );
    case "diamond": // Diamond
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <polygon points="24,6 42,24 24,42 6,24" fill="currentColor"/>
        </svg>
      );
    case "x": // X shape
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <path d="M8,8 L18,24 L8,40 L14,40 L24,28 L34,40 L40,40 L30,24 L40,8 L34,8 L24,20 L14,8 Z" fill="currentColor"/>
        </svg>
      );
    case "cross": // Plus/cross
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="18" y="6" width="12" height="36" fill="currentColor"/>
          <rect x="6" y="18" width="36" height="12" fill="currentColor"/>
        </svg>
      );
    case "sun": // Sun with rays
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="10" fill="currentColor"/>
          <line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" strokeWidth="3"/>
          <line x1="24" y1="36" x2="24" y2="44" stroke="currentColor" strokeWidth="3"/>
          <line x1="4" y1="24" x2="12" y2="24" stroke="currentColor" strokeWidth="3"/>
          <line x1="36" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="3"/>
          <line x1="10" y1="10" x2="16" y2="16" stroke="currentColor" strokeWidth="3"/>
          <line x1="32" y1="32" x2="38" y2="38" stroke="currentColor" strokeWidth="3"/>
          <line x1="38" y1="10" x2="32" y2="16" stroke="currentColor" strokeWidth="3"/>
          <line x1="16" y1="32" x2="10" y2="38" stroke="currentColor" strokeWidth="3"/>
        </svg>
      );
    case "square2": // 4 dots in corners
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="14" cy="14" r="6" fill="currentColor"/>
          <circle cx="34" cy="14" r="6" fill="currentColor"/>
          <circle cx="14" cy="34" r="6" fill="currentColor"/>
          <circle cx="34" cy="34" r="6" fill="currentColor"/>
        </svg>
      );
    case "square3": // Circle outline only
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="5" fill="none"/>
        </svg>
      );
    case "cross-rounded": // Small dots 3x3 grid
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="12" cy="12" r="4" fill="currentColor"/>
          <circle cx="24" cy="12" r="4" fill="currentColor"/>
          <circle cx="36" cy="12" r="4" fill="currentColor"/>
          <circle cx="12" cy="24" r="4" fill="currentColor"/>
          <circle cx="24" cy="24" r="4" fill="currentColor"/>
          <circle cx="36" cy="24" r="4" fill="currentColor"/>
          <circle cx="12" cy="36" r="4" fill="currentColor"/>
          <circle cx="24" cy="36" r="4" fill="currentColor"/>
          <circle cx="36" cy="36" r="4" fill="currentColor"/>
        </svg>
      );
    case "x-rounded": // 5 dots (4 corners + center)
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <circle cx="24" cy="24" r="7" fill="currentColor"/>
          <circle cx="10" cy="10" r="5" fill="currentColor"/>
          <circle cx="38" cy="10" r="5" fill="currentColor"/>
          <circle cx="10" cy="38" r="5" fill="currentColor"/>
          <circle cx="38" cy="38" r="5" fill="currentColor"/>
        </svg>
      );
    case "heart": // Heart shape
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <path d="M24 42 C14 32 4 24 4 16 C4 8 10 4 16 4 C20 4 24 8 24 12 C24 8 28 4 32 4 C38 4 44 8 44 16 C44 24 34 32 24 42Z" fill="currentColor"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-gray-600">
          <rect x="10" y="10" width="28" height="28" fill="currentColor"/>
        </svg>
      );
  }
}

// ─── Frame Thumbnails ────────────────────────────────────────────────────────

// Frame metadata matching QRFY's frame order from their UI
const FRAME_META: { id: number; label: string }[] = [
  { id: -1, label: "None" },
  { id: 0, label: "Video Player" },
  { id: 1, label: "Simple 1" },
  { id: 2, label: "Simple 2" },
  { id: 3, label: "Simple 3" },
  { id: 4, label: "Simple 4" },
  { id: 5, label: "Simple 5" },
  { id: 6, label: "Simple 6" },
  { id: 7, label: "Simple 7" },
  { id: 8, label: "Simple 8" },
  { id: 9, label: "Simple 9" },
  { id: 10, label: "Simple 10" },
  { id: 11, label: "Simple 11" },
  { id: 12, label: "Text Top" },
  { id: 13, label: "Plain" },
  { id: 14, label: "Script" },
  { id: 15, label: "Banner Top" },
  { id: 16, label: "Gift Bow" },
  { id: 17, label: "Polaroid" },
  { id: 18, label: "Simple 18" },
  { id: 19, label: "Ribbons" },
  { id: 20, label: "Minimal" },
  { id: 21, label: "Scooter" },
  { id: 22, label: "Monitor" },
  { id: 23, label: "Folder" },
  { id: 24, label: "Clipboard" },
  { id: 25, label: "Notebook" },
  { id: 26, label: "Drink Cup" },
  { id: 27, label: "Alarm Clock" },
  { id: 28, label: "Plain 28" },
  { id: 29, label: "Plain 29" },
  { id: 30, label: "Plain 30" },
];

// Frame SVGs matching actual QRFY frame renders
function FrameSVG({ id }: { id: number }) {
  const s = 48;

  switch (id) {
    case -1: // None
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-400">
          <line x1="12" y1="12" x2="36" y2="36" stroke="currentColor" strokeWidth="2" />
          <line x1="36" y1="12" x2="12" y2="36" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 0: // Video Player - rectangle with play button
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="4" y="6" width="40" height="30" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="4" y="36" width="40" height="8" rx="1" fill="currentColor" opacity="0.3" />
          <polygon points="20,16 20,26 28,21" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case 1: // Simple 1 - basic rectangle with bottom text area
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="4" width="36" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="6" y="36" width="36" height="8" rx="1" fill="currentColor" opacity="0.25" />
        </svg>
      );
    case 2: // Simple 2 - top text area
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="4" width="36" height="8" rx="1" fill="currentColor" opacity="0.25" />
          <rect x="6" y="12" width="36" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 3: // Simple 3 - both top and bottom
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="2" width="36" height="6" rx="1" fill="currentColor" opacity="0.25" />
          <rect x="6" y="10" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="6" y="40" width="36" height="6" rx="1" fill="currentColor" opacity="0.25" />
        </svg>
      );
    case 4: // Simple 4 - rounded corners bottom
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="4" width="36" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="8" y="36" width="32" height="8" rx="4" fill="currentColor" opacity="0.25" />
        </svg>
      );
    case 5: // Simple 5 - rounded top
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="8" y="4" width="32" height="8" rx="4" fill="currentColor" opacity="0.25" />
          <rect x="6" y="12" width="36" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 6: // Simple 6 - rounded both
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="8" y="2" width="32" height="6" rx="3" fill="currentColor" opacity="0.25" />
          <rect x="6" y="10" width="36" height="28" rx="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="8" y="40" width="32" height="6" rx="3" fill="currentColor" opacity="0.25" />
        </svg>
      );
    case 7: // Simple 7 - pill bottom
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="4" width="36" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="10" y="38" width="28" height="6" rx="3" fill="currentColor" opacity="0.25" />
        </svg>
      );
    case 8: // Simple 8 - pill top and bottom
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="10" y="2" width="28" height="6" rx="3" fill="currentColor" opacity="0.25" />
          <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="10" y="40" width="28" height="6" rx="3" fill="currentColor" opacity="0.25" />
        </svg>
      );
    case 9: // Simple 9 - dashed square
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="4" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          <rect x="10" y="34" width="28" height="6" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 10: // Simple 10 - dashed rounded
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="4" width="36" height="36" rx="8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          <rect x="10" y="34" width="28" height="6" rx="3" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 11: // Simple 11 - dotted
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="4" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />
          <rect x="10" y="34" width="28" height="6" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 12: // Text Top - text banner at top
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="4" y="2" width="40" height="10" rx="2" fill="currentColor" opacity="0.3" />
          <rect x="6" y="14" width="36" height="30" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 13: // Plain - double border
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="4" y="4" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="8" y="8" width="32" height="32" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      );
    case 14: // Script - double rounded
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="4" y="4" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      );
    case 15: // Banner Top - flag/banner shape
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="8" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 8 L12 2 L36 2 L36 8" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 16: // Gift Bow - box with bow
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="14" width="36" height="30" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="24" y1="14" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" />
          <path d="M24 14 C20 14 16 10 18 6 C20 4 24 6 24 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M24 14 C28 14 32 10 30 6 C28 4 24 6 24 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 17: // Polaroid - photo frame
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="2" width="36" height="44" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="10" y="6" width="28" height="28" fill="currentColor" opacity="0.15" />
          <rect x="10" y="38" width="28" height="4" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 18: // Simple 18 - thick border
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="4" y="4" width="40" height="40" rx="3" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>
      );
    case 19: // Ribbons - decorative ribbons
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="8" y="8" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M4 4 L12 12 M36 12 L44 4 M4 44 L12 36 M36 36 L44 44" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 20: // Minimal - corner brackets only
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <path d="M4 14 L4 4 L14 4" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M34 4 L44 4 L44 14" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M44 34 L44 44 L34 44" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M14 44 L4 44 L4 34" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case 21: // Scooter - scooter shape
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="8" y="8" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="14" cy="40" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="34" cy="40" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="8" y1="32" x2="14" y2="35" stroke="currentColor" strokeWidth="1.5" />
          <line x1="36" y1="32" x2="34" y2="35" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 22: // Monitor - computer screen
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="4" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="24" y1="32" x2="24" y2="38" stroke="currentColor" strokeWidth="2" />
          <line x1="14" y1="40" x2="34" y2="40" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 23: // Folder - file folder
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <path d="M4 12 L4 42 L44 42 L44 12 L26 12 L22 6 L4 6 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 24: // Clipboard - clipboard with clip
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="8" y="8" width="32" height="38" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="16" y="4" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 25: // Notebook - spiral notebook
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="10" y="4" width="34" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="10" cy="12" r="2" fill="currentColor" />
          <circle cx="10" cy="20" r="2" fill="currentColor" />
          <circle cx="10" cy="28" r="2" fill="currentColor" />
          <circle cx="10" cy="36" r="2" fill="currentColor" />
        </svg>
      );
    case 26: // Drink Cup - coffee cup
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <path d="M10 12 L14 44 L34 44 L38 12 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M38 18 C44 18 46 24 44 28 C42 32 38 30 38 30" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M16 6 Q18 2 20 6 M24 6 Q26 2 28 6 M32 6 Q34 2 36 6" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      );
    case 27: // Alarm Clock - classic alarm clock shape
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <circle cx="24" cy="26" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="10" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="38" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="35" y1="13" x2="30" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="18" y1="44" x2="14" y2="48" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="44" x2="34" y2="48" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 28: // Plain 28 - simple square
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="6" width="36" height="36" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 29: // Plain 29 - dashed circle
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
        </svg>
      );
    case 30: // Plain 30 - dotted circle
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-600">
          <rect x="6" y="6" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
  }
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

// ─── Accordion Section ──────────────────────────────────────────────────────
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

// ─── Design Options Constants ────────────────────────────────────────────────

// 19 QR code styles matching QRFY's "QR code style" section
const SHAPE_STYLES = [
  { id: "square", label: "Square" },           // Style 1
  { id: "rounded", label: "Rounded" },         // Style 2
  { id: "dots", label: "Dots" },               // Style 3
  { id: "classy", label: "Classy" },           // Style 4
  { id: "classy-rounded", label: "Classy Rnd" }, // Style 5
  { id: "extra-rounded", label: "Circle" },    // Style 6
  { id: "cross", label: "Cross" },             // Style 7
  { id: "cross-rounded", label: "Cross Rnd" }, // Style 8
  { id: "diamond", label: "Diamond" },         // Style 9
  { id: "diamond-special", label: "Diamond+" }, // Style 10
  { id: "heart", label: "Heart" },             // Style 11
  { id: "horizontal-rounded", label: "H-Lines" }, // Style 12
  { id: "vertical-rounded", label: "V-Lines" }, // Style 13
  { id: "ribbon", label: "Ribbon" },           // Style 14
  { id: "shake", label: "Shake" },             // Style 15
  { id: "sparkle", label: "Sparkle" },         // Style 16
  { id: "star", label: "Star" },               // Style 17
  { id: "x", label: "X" },                     // Style 18
  { id: "x-rounded", label: "X Rounded" },     // Style 19
];

// 16 Border styles matching QRFY's "Border style" in Corners section (screenshot order)
const CORNER_SQUARE_STYLES = [
  { id: "default", label: "Square" },        // Border 1 - solid square
  { id: "dot", label: "Circle" },            // Border 2 - circle
  { id: "square", label: "Sm Round" },       // Border 3 - small rounded
  { id: "extra-rounded", label: "Rounded" }, // Border 4 - medium rounded
  { id: "shape1", label: "Lg Round" },       // Border 5 - large rounded
  { id: "shape2", label: "Pill" },           // Border 6 - pill/capsule
  { id: "shape3", label: "Leaf" },           // Border 7 - leaf shape
  { id: "shape4", label: "Diamond" },        // Border 8 - diamond
  { id: "shape5", label: "Hexagon" },        // Border 9 - hexagon
  { id: "shape6", label: "Octagon" },        // Border 10 - octagon
  { id: "shape7", label: "Star" },           // Border 11 - star
  { id: "shape8", label: "Clover" },         // Border 12 - clover
  { id: "shape9", label: "Shield" },         // Border 13 - shield
  { id: "shape10", label: "Badge" },         // Border 14 - badge
  { id: "shape11", label: "Ticket" },        // Border 15 - ticket
  { id: "shape12", label: "Frame" },         // Border 16 - frame
];

// 16 Center styles matching QRFY's "Center style" in Corners section (screenshot order)
const CORNER_DOT_STYLES = [
  { id: "default", label: "Square" },        // Center style 1 - solid square
  { id: "dot", label: "Oval" },              // Center style 2 - horizontal oval/pill
  { id: "rounded", label: "Rounded" },       // Center style 3 - rounded square
  { id: "dot2", label: "Circle" },           // Center style 4 - circle
  { id: "dot3", label: "Ring" },             // Center style 5 - donut/ring
  { id: "dot4", label: "Small Circle" },     // Center style 6 - smaller circle
  { id: "star", label: "Star" },             // Center style 7 - star shape
  { id: "diamond", label: "Diamond" },       // Center style 8 - diamond
  { id: "x", label: "X" },                   // Center style 9 - X rotated
  { id: "cross", label: "Cross" },           // Center style 10 - plus/cross
  { id: "sun", label: "Sun" },               // Center style 11 - sun/burst
  { id: "square2", label: "Dots" },          // Center style 12 - dots pattern
  { id: "square3", label: "Ring Outline" },  // Center style 13 - ring outline
  { id: "cross-rounded", label: "Sm Dots" }, // Center style 14 - small dots
  { id: "x-rounded", label: "Pattern" },     // Center style 15 - pattern
  { id: "heart", label: "Heart" },           // Center style 16 - heart
];

const ERROR_CORRECTION = [
  { id: "L", label: "Low" },
  { id: "M", label: "Medium" },
  { id: "Q", label: "Quartile" },
  { id: "H", label: "High" },
];

// Preset logo URLs (external sources - QRFY can't fetch from its own domain)
const PRESET_LOGOS = [
  { id: "", label: "None", url: "" },
  { id: "whatsapp", label: "WhatsApp", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" },
  { id: "facebook", label: "Facebook", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/120px-Facebook_Logo_%282019%29.png" },
  { id: "instagram", label: "Instagram", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/120px-Instagram_logo_2016.svg.png" },
  { id: "twitter", label: "X/Twitter", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/120px-X_logo_2023.svg.png" },
  { id: "youtube", label: "YouTube", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/120px-YouTube_full-color_icon_%282017%29.svg.png" },
  { id: "linkedin", label: "LinkedIn", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/120px-LinkedIn_logo_initials.png" },
  { id: "tiktok", label: "TikTok", url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/120px-TikTok_logo.svg.png" },
  { id: "telegram", label: "Telegram", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/120px-Telegram_logo.svg.png" },
  { id: "paypal", label: "PayPal", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/120px-PayPal.svg.png" },
  { id: "bitcoin", label: "Bitcoin", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/120px-Bitcoin.svg.png" },
];


// ─── Main DesignOptions Component ────────────────────────────────────────────

interface DesignOptionsProps {
  design: Record<string, any>;
  setDesign: (d: Record<string, any>) => void;
}

export default function DesignOptions({ design, setDesign }: DesignOptionsProps) {
  const set = (key: string, val: any) => setDesign({ ...design, [key]: val });
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      set("logo", data.url);
      toast.success("Logo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Shape Pattern */}
      <AccordionSection
        icon={<QrCodeIcon className="h-5 w-5 text-gray-500" />}
        title="QR Code Pattern" subtitle="Choose a shape pattern for your QR code." defaultOpen>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-3 block">Pattern style</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2">
              {SHAPE_STYLES.map(p => (
                <button key={p.id} onClick={() => set("dotsType", p.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.dotsType === p.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <PatternSVG style={p.id} />
                  <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">{p.label}</span>
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
                    onClick={() => set("patternGradient", !design.patternGradient)}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${design.patternGradient ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              </div>
              <InlineColorPicker label="Color" value={design.dotsColor || "#000000"} onChange={v => set("dotsColor", v)} />
            </div>
            {design.patternGradient && (
              <InlineColorPicker label="Color 2" value={design.patternColor2 || "#7C3AED"} onChange={v => set("patternColor2", v)} />
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
              <input type="checkbox" checked={design.bgTransparent || false} onChange={e => set("bgTransparent", e.target.checked)}
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
                        onClick={() => set("useGradientBg", !design.useGradientBg)}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${design.useGradientBg ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                  </div>
                  <InlineColorPicker label="Background" value={design.backgroundColor || "#FFFFFF"} onChange={v => set("backgroundColor", v)} />
                </div>
                {design.useGradientBg && (
                  <InlineColorPicker label="Background color 2" value={design.bgColor2 || "#7C3AED"} onChange={v => set("bgColor2", v)} />
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
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {CORNER_SQUARE_STYLES.map(c => (
                <button key={c.id} onClick={() => set("cornersSquareType", c.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.cornersSquareType === c.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <CornerSquareSVG style={c.id} />
                  <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Corner dot style</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2">
              {CORNER_DOT_STYLES.map(c => (
                <button key={c.id} onClick={() => set("cornersDotType", c.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.cornersDotType === c.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <CornerDotSVG style={c.id} />
                  <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <InlineColorPicker label="Corner square color" value={design.cornersSquareColor || "#000000"} onChange={v => set("cornersSquareColor", v)} />
            <InlineColorPicker label="Corner dot color" value={design.cornersDotColor || "#000000"} onChange={v => set("cornersDotColor", v)} />
          </div>
        </div>
      </AccordionSection>

      {/* Frame */}
      <AccordionSection
        icon={<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>}
        title="Frame" subtitle="Add a frame with text around your QR code.">
        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-3 block">Frame template</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {FRAME_META.map(f => (
                <button key={f.id} onClick={() => setDesign({ ...design, frameId: f.id, frameStyle: f.id === 0 ? "none" : String(f.id) })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    design.frameId === f.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}>
                  <FrameSVG id={f.id} />
                  <span className="text-[9px] font-medium leading-tight text-center">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
          {(design.frameId || 0) > 0 && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Frame text (max 30 chars)</label>
                <input type="text" maxLength={30} value={design.frameText || "Scan me!"} onChange={e => set("frameText", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Font size: {design.frameFontSize || 42}</label>
                <input type="range" min="30" max="98" step="1" value={design.frameFontSize || 42}
                  onChange={e => set("frameFontSize", parseInt(e.target.value))}
                  className="w-full accent-violet-500" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <InlineColorPicker label="Frame color" value={design.frameColor || "#7C3AED"} onChange={v => set("frameColor", v)} />
                <InlineColorPicker label="Text color" value={design.frameTextColor || "#FFFFFF"} onChange={v => set("frameTextColor", v)} />
              </div>
              <InlineColorPicker label="Frame background" value={design.frameBackgroundColor || "#7C3AED"} onChange={v => set("frameBackgroundColor", v)} />
            </>
          )}
        </div>
      </AccordionSection>

      {/* Logo */}
      <AccordionSection
        icon={<PhotoSolidIcon className="h-5 w-5 text-gray-500" />}
        title="Add Logo" subtitle="Add a central logo to your QR code.">
        <div className="space-y-4">
          {/* Preset Logos */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-3 block">Select a logo</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_LOGOS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => set("logo", preset.url)}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                    design.logo === preset.url
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  title={preset.label}
                >
                  {preset.url ? (
                    <img src={preset.url} alt={preset.label} className="w-7 h-7 object-contain" />
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4" y1="4" x2="20" y2="20" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Upload */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Or upload your own</label>
            <label className={`flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              uploading ? "border-violet-400 bg-violet-50" : "border-gray-300 hover:border-violet-400 hover:bg-gray-50"
            }`}>
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-violet-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm text-violet-600">Uploading...</span>
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload logo (PNG, JPG - max 2MB)</span>
                </>
              )}
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
            </label>
          </div>

          {/* Show selected logo */}
          {design.logo && (
            <div className="flex items-center gap-3 p-3 bg-violet-50 border border-violet-200 rounded-lg">
              <img src={design.logo} alt="Logo" className="w-10 h-10 object-contain" />
              <div className="flex-1">
                <p className="text-sm font-medium text-violet-700">Logo selected</p>
                <p className="text-xs text-violet-600">Will appear in the center of the QR code</p>
              </div>
              <button
                onClick={() => set("logo", "")}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Error Correction */}
      <AccordionSection
        icon={<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
        title="Error Correction" subtitle="Higher levels allow more damage but reduce data capacity.">
        <div className="flex gap-2">
          {ERROR_CORRECTION.map(ec => (
            <button key={ec.id} onClick={() => set("errorCorrectionLevel", ec.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                design.errorCorrectionLevel === ec.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}>
              {ec.id} - {ec.label}
            </button>
          ))}
        </div>
      </AccordionSection>
    </div>
  );
}
