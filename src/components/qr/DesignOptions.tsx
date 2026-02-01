"use client";

import { useState } from "react";
import {
  QrCodeIcon, ChevronDownIcon, ArrowPathIcon,
  PhotoIcon as PhotoSolidIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// ─── SVG Pattern Thumbnails ──────────────────────────────────────────────────

function PatternSVG({ style }: { style: string }) {
  const s = 48;
  const cells = 5;
  const cs = s / cells;

  const renderCell = (x: number, y: number, key: number) => {
    if ((x + y) % 3 === 2) return null;
    const cx = x * cs + cs / 2;
    const cy = y * cs + cs / 2;
    const r = cs * 0.35;
    const half = cs / 2;

    switch (style) {
      case "square":
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} fill="currentColor" />;
      case "rounded":
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} rx={cs * 0.3} fill="currentColor" />;
      case "dots":
        return <circle key={key} cx={cx} cy={cy} r={r} fill="currentColor" />;
      case "classy":
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} rx={1} fill="currentColor" />;
      case "classy-rounded":
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} rx={cs * 0.4} ry={1} fill="currentColor" />;
      case "extra-rounded":
        return <circle key={key} cx={cx} cy={cy} r={r * 1.1} fill="currentColor" />;
      case "cross":
        return (
          <g key={key}>
            <rect x={cx - r * 0.3} y={cy - r} width={r * 0.6} height={r * 2} fill="currentColor" />
            <rect x={cx - r} y={cy - r * 0.3} width={r * 2} height={r * 0.6} fill="currentColor" />
          </g>
        );
      case "cross-rounded":
        return (
          <g key={key}>
            <rect x={cx - r * 0.3} y={cy - r} width={r * 0.6} height={r * 2} rx={r * 0.15} fill="currentColor" />
            <rect x={cx - r} y={cy - r * 0.3} width={r * 2} height={r * 0.6} rx={r * 0.15} fill="currentColor" />
          </g>
        );
      case "diamond":
        return (
          <polygon key={key} points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} fill="currentColor" />
        );
      case "diamond-special":
        return (
          <g key={key}>
            <polygon points={`${cx},${cy - r * 0.9} ${cx + r * 0.9},${cy} ${cx},${cy + r * 0.9} ${cx - r * 0.9},${cy}`} fill="currentColor" />
            <circle cx={cx} cy={cy} r={r * 0.25} fill="white" />
          </g>
        );
      case "heart":
        return (
          <path key={key} d={`M${cx} ${cy + r * 0.6} C${cx - r * 1.2} ${cy - r * 0.3} ${cx - r * 0.5} ${cy - r} ${cx} ${cy - r * 0.4} C${cx + r * 0.5} ${cy - r} ${cx + r * 1.2} ${cy - r * 0.3} ${cx} ${cy + r * 0.6}Z`} fill="currentColor" />
        );
      case "horizontal-rounded":
        return <rect key={key} x={x * cs} y={cy - r * 0.45} width={cs} height={r * 0.9} rx={r * 0.45} fill="currentColor" />;
      case "vertical-rounded":
        return <rect key={key} x={cx - r * 0.45} y={y * cs} width={r * 0.9} height={cs} rx={r * 0.45} fill="currentColor" />;
      case "ribbon":
        return (
          <g key={key}>
            <rect x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs * 0.4} rx={1} fill="currentColor" />
            <rect x={x * cs + 1} y={y * cs + cs * 0.5} width={cs - 2} height={cs * 0.4} rx={1} fill="currentColor" />
          </g>
        );
      case "shake":
        return <rect key={key} x={x * cs + (key % 2 ? 2 : 0)} y={y * cs + (key % 2 ? 0 : 2)} width={cs - 2} height={cs - 2} fill="currentColor" />;
      case "sparkle": {
        const pts = [];
        for (let i = 0; i < 4; i++) {
          const a1 = (Math.PI / 2) * i - Math.PI / 2;
          const a2 = a1 + Math.PI / 4;
          pts.push(`${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r}`);
          pts.push(`${cx + Math.cos(a2) * r * 0.4},${cy + Math.sin(a2) * r * 0.4}`);
        }
        return <polygon key={key} points={pts.join(" ")} fill="currentColor" />;
      }
      case "star": {
        const pts = [];
        for (let i = 0; i < 5; i++) {
          const a1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
          const a2 = a1 + Math.PI / 5;
          pts.push(`${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r}`);
          pts.push(`${cx + Math.cos(a2) * r * 0.45},${cy + Math.sin(a2) * r * 0.45}`);
        }
        return <polygon key={key} points={pts.join(" ")} fill="currentColor" />;
      }
      case "x":
        return (
          <g key={key}>
            <rect x={cx - r} y={cy - r * 0.2} width={r * 2} height={r * 0.4} transform={`rotate(45 ${cx} ${cy})`} fill="currentColor" />
            <rect x={cx - r} y={cy - r * 0.2} width={r * 2} height={r * 0.4} transform={`rotate(-45 ${cx} ${cy})`} fill="currentColor" />
          </g>
        );
      case "x-rounded":
        return (
          <g key={key}>
            <rect x={cx - r} y={cy - r * 0.2} width={r * 2} height={r * 0.4} rx={r * 0.1} transform={`rotate(45 ${cx} ${cy})`} fill="currentColor" />
            <rect x={cx - r} y={cy - r * 0.2} width={r * 2} height={r * 0.4} rx={r * 0.1} transform={`rotate(-45 ${cx} ${cy})`} fill="currentColor" />
          </g>
        );
      default:
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} fill="currentColor" />;
    }
  };

  const elements: React.ReactNode[] = [];
  let k = 0;
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const el = renderCell(x, y, k++);
      if (el) elements.push(el);
    }
  }

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
      {elements}
    </svg>
  );
}

function CornerSquareSVG({ style }: { style: string }) {
  const s = 48;
  switch (style) {
    case "square":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="0" stroke="currentColor" strokeWidth="6" fill="none" />
          <rect x="16" y="16" width="16" height="16" fill="currentColor" />
        </svg>
      );
    case "dot":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
          <circle cx="24" cy="24" r="8" fill="currentColor" />
        </svg>
      );
    case "extra-rounded":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="12" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="4" fill="currentColor" />
        </svg>
      );
    case "shape1":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="5" fill="none" />
          <circle cx="24" cy="24" r="8" fill="currentColor" />
        </svg>
      );
    case "shape2":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="0" stroke="currentColor" strokeWidth="5" fill="none" />
          <polygon points="24,14 34,24 24,34 14,24" fill="currentColor" />
        </svg>
      );
    case "shape3":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <polygon points="24,4 44,24 24,44 4,24" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="18" y="18" width="12" height="12" fill="currentColor" />
        </svg>
      );
    case "shape4":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="2" fill="currentColor" />
        </svg>
      );
    case "shape5":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="5" fill="none" />
          <polygon points="24,14 34,24 24,34 14,24" fill="currentColor" />
        </svg>
      );
    case "shape6":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="12" y="12" width="24" height="24" rx="12" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="24" cy="24" r="5" fill="currentColor" />
        </svg>
      );
    case "shape7":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="20" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="17" y="17" width="14" height="14" rx="7" fill="currentColor" />
        </svg>
      );
    case "shape8":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="0" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="14" y="14" width="20" height="20" rx="10" fill="currentColor" />
        </svg>
      );
    case "shape9":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="6" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="14" y="14" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>
      );
    case "shape10":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
          <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="24" cy="24" r="4" fill="currentColor" />
        </svg>
      );
    case "shape11":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="8" width="40" height="32" rx="16" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="8" fill="currentColor" />
        </svg>
      );
    case "shape12":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="currentColor" strokeWidth="4" fill="none" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="7" fill="currentColor" />
        </svg>
      );
    default: // "default"
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="2" fill="currentColor" />
        </svg>
      );
  }
}

function CornerDotSVG({ style }: { style: string }) {
  const s = 48;
  switch (style) {
    case "dot":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="12" fill="currentColor" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="12" y="12" width="24" height="24" fill="currentColor" />
        </svg>
      );
    case "cross":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="20" y="10" width="8" height="28" fill="currentColor" />
          <rect x="10" y="20" width="28" height="8" fill="currentColor" />
        </svg>
      );
    case "cross-rounded":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="20" y="10" width="8" height="28" rx="4" fill="currentColor" />
          <rect x="10" y="20" width="28" height="8" rx="4" fill="currentColor" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <polygon points="24,8 40,24 24,40 8,24" fill="currentColor" />
        </svg>
      );
    case "dot2":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="10" fill="currentColor" />
          <circle cx="24" cy="24" r="4" fill="white" />
        </svg>
      );
    case "dot3":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="4" fill="none" />
          <circle cx="24" cy="24" r="4" fill="currentColor" />
        </svg>
      );
    case "dot4":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="12" fill="currentColor" />
          <circle cx="24" cy="24" r="6" fill="white" />
          <circle cx="24" cy="24" r="3" fill="currentColor" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <path d="M24 38 C12 28 4 20 4 14 C4 8 9 4 14 4 C18 4 22 7 24 10 C26 7 30 4 34 4 C39 4 44 8 44 14 C44 20 36 28 24 38Z" fill="currentColor" />
        </svg>
      );
    case "rounded":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="12" y="12" width="24" height="24" rx="8" fill="currentColor" />
        </svg>
      );
    case "square2":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="10" y="10" width="28" height="28" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      );
    case "square3":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="10" y="10" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="19" y="19" width="10" height="10" rx="2" fill="currentColor" />
        </svg>
      );
    case "star": {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const a1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        pts.push(`${24 + Math.cos(a1) * 14},${24 + Math.sin(a1) * 14}`);
        pts.push(`${24 + Math.cos(a2) * 6},${24 + Math.sin(a2) * 6}`);
      }
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <polygon points={pts.join(" ")} fill="currentColor" />
        </svg>
      );
    }
    case "sun": {
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="8" fill="currentColor" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (Math.PI / 4) * i;
            const x1 = 24 + Math.cos(angle) * 11;
            const y1 = 24 + Math.sin(angle) * 11;
            const x2 = 24 + Math.cos(angle) * 16;
            const y2 = 24 + Math.sin(angle) * 16;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />;
          })}
        </svg>
      );
    }
    case "x":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="10" y="21" width="28" height="6" transform="rotate(45 24 24)" fill="currentColor" />
          <rect x="10" y="21" width="28" height="6" transform="rotate(-45 24 24)" fill="currentColor" />
        </svg>
      );
    case "x-rounded":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="10" y="21" width="28" height="6" rx="3" transform="rotate(45 24 24)" fill="currentColor" />
          <rect x="10" y="21" width="28" height="6" rx="3" transform="rotate(-45 24 24)" fill="currentColor" />
        </svg>
      );
    default: // "default"
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="12" y="12" width="24" height="24" rx="4" fill="currentColor" />
        </svg>
      );
  }
}

// ─── Frame Thumbnails ────────────────────────────────────────────────────────

const FRAME_META: { id: number; label: string }[] = [
  { id: 0, label: "None" },
  { id: 1, label: "Square Bottom" }, { id: 2, label: "Square Top" }, { id: 3, label: "Square Both" },
  { id: 4, label: "Round Bottom" }, { id: 5, label: "Round Top" }, { id: 6, label: "Round Both" },
  { id: 7, label: "Pill Bottom" }, { id: 8, label: "Pill Both" },
  { id: 9, label: "Dash Square" }, { id: 10, label: "Dash Round" },
  { id: 11, label: "Dot Square" }, { id: 12, label: "Dot Round" },
  { id: 13, label: "Double Square" }, { id: 14, label: "Double Round" },
  { id: 15, label: "Square Simple" }, { id: 16, label: "Round Simple" },
  { id: 17, label: "Clipboard" }, { id: 18, label: "Coffee" }, { id: 19, label: "Cloud" }, { id: 20, label: "Gift" },
  { id: 21, label: "Bag" }, { id: 22, label: "Envelope" }, { id: 23, label: "Badge" }, { id: 24, label: "Ticket" },
  { id: 25, label: "Banner" }, { id: 26, label: "Monitor" },
  { id: 27, label: "Frame 27" }, { id: 28, label: "Frame 28" }, { id: 29, label: "Frame 29" }, { id: 30, label: "Frame 30" },
];

function FrameSVG({ id }: { id: number }) {
  const s = 48;
  if (id === 0) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-400">
        <line x1="8" y1="8" x2="40" y2="40" stroke="currentColor" strokeWidth="2" />
        <line x1="40" y1="8" x2="8" y2="40" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  // Group frames by visual style
  switch (id) {
    // Square frames with text at bottom/top/both
    case 1:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="2" width="40" height="34" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="4" y="36" width="40" height="10" rx="2" fill="currentColor" opacity="0.3" />
          <rect x="12" y="8" width="24" height="22" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="2" width="40" height="10" rx="2" fill="currentColor" opacity="0.3" />
          <rect x="4" y="12" width="40" height="34" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="12" y="18" width="24" height="22" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="2" width="40" height="8" rx="2" fill="currentColor" opacity="0.3" />
          <rect x="4" y="10" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="4" y="38" width="40" height="8" rx="2" fill="currentColor" opacity="0.3" />
          <rect x="12" y="14" width="24" height="20" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    // Round frames
    case 4:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="2" width="40" height="34" rx="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="4" y="36" width="40" height="10" rx="5" fill="currentColor" opacity="0.3" />
          <rect x="12" y="8" width="24" height="22" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="2" width="40" height="10" rx="5" fill="currentColor" opacity="0.3" />
          <rect x="4" y="12" width="40" height="34" rx="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="12" y="18" width="24" height="22" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 6:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="2" width="40" height="8" rx="4" fill="currentColor" opacity="0.3" />
          <rect x="4" y="10" width="40" height="28" rx="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="4" y="38" width="40" height="8" rx="4" fill="currentColor" opacity="0.3" />
          <rect x="12" y="14" width="24" height="20" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    // Pill frames
    case 7:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="2" width="40" height="34" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="8" y="36" width="32" height="10" rx="5" fill="currentColor" opacity="0.3" />
          <rect x="12" y="8" width="24" height="22" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 8:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="8" y="2" width="32" height="8" rx="4" fill="currentColor" opacity="0.3" />
          <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="8" y="38" width="32" height="8" rx="4" fill="currentColor" opacity="0.3" />
          <rect x="12" y="14" width="24" height="20" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    // Dash/Dot frames
    case 9:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 3" />
          <rect x="12" y="10" width="24" height="20" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="32" width="28" height="8" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 10:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 3" />
          <rect x="12" y="10" width="24" height="20" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="32" width="28" height="8" rx="4" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 11:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2 3" />
          <rect x="12" y="10" width="24" height="20" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="32" width="28" height="8" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 12:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2 3" />
          <rect x="12" y="10" width="24" height="20" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="32" width="28" height="8" rx="4" fill="currentColor" opacity="0.2" />
        </svg>
      );
    // Double frames
    case 13:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="2" y="2" width="44" height="44" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="6" y="6" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="14" y="10" width="20" height="18" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="32" width="28" height="6" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 14:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="2" y="2" width="44" height="44" rx="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="6" y="6" width="36" height="36" rx="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="14" y="10" width="20" height="18" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="32" width="28" height="6" rx="3" fill="currentColor" opacity="0.2" />
        </svg>
      );
    // Simple frames
    case 15:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
          <rect x="12" y="12" width="24" height="24" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 16:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="12" stroke="currentColor" strokeWidth="3" fill="none" />
          <rect x="12" y="12" width="24" height="24" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    // Special shapes
    case 17: // Clipboard
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="8" y="6" width="32" height="38" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="16" y="2" width="16" height="6" rx="2" fill="currentColor" opacity="0.4" />
          <rect x="14" y="14" width="20" height="16" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="12" y="34" width="24" height="6" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 18: // Coffee
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="6" y="12" width="30" height="28" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M36 18 C42 18 44 24 42 28 C40 32 36 32 36 32" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="12" y="16" width="18" height="14" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="34" width="22" height="4" rx="1" fill="currentColor" opacity="0.2" />
          <path d="M14 8 Q16 4 18 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M22 8 Q24 4 26 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 19: // Cloud
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <path d="M10 32 C4 32 2 26 6 22 C4 16 10 12 16 14 C18 8 28 6 32 12 C38 10 44 14 42 22 C46 26 44 32 38 32 Z" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="14" y="16" width="20" height="12" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="34" width="28" height="6" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 20: // Gift
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="6" y="14" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="24" y1="14" x2="24" y2="42" stroke="currentColor" strokeWidth="2" />
          <line x1="6" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="2" />
          <path d="M24 14 C24 8 18 4 14 8 C12 10 14 14 24 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M24 14 C24 8 30 4 34 8 C36 10 34 14 24 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 21: // Bag
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="6" y="16" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M16 16 L16 10 C16 6 20 2 24 2 C28 2 32 6 32 10 L32 16" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="14" y="20" width="20" height="14" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 22: // Envelope
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="10" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <polyline points="4,10 24,26 44,10" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="14" y="20" width="20" height="12" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 23: // Badge
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <circle cx="24" cy="20" r="16" stroke="currentColor" strokeWidth="2" fill="none" />
          <polygon points="14,32 24,46 34,32" fill="currentColor" opacity="0.3" />
          <rect x="16" y="12" width="16" height="14" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 24: // Ticket
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <path d="M4 8 L44 8 L44 20 C40 20 40 28 44 28 L44 40 L4 40 L4 28 C8 28 8 20 4 20 Z" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="12" y="12" width="24" height="16" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="32" width="28" height="4" rx="1" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 25: // Banner
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="34" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          <polygon points="4,38 24,44 44,38 44,46 4,46" fill="currentColor" opacity="0.3" />
          <rect x="12" y="8" width="24" height="22" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case 26: // Monitor
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="30" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="24" y1="34" x2="24" y2="40" stroke="currentColor" strokeWidth="2" />
          <line x1="14" y1="40" x2="34" y2="40" stroke="currentColor" strokeWidth="2" />
          <rect x="12" y="8" width="24" height="22" rx="1" fill="currentColor" opacity="0.15" />
        </svg>
      );
    default: // Frames 27-30 and any unknown
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-10 h-10 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="12" y="8" width="24" height="22" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="10" y="34" width="28" height="6" rx="2" fill="currentColor" opacity="0.2" />
          <text x="24" y="44" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.5">{id}</text>
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

const SHAPE_STYLES = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Classy Round" },
  { id: "extra-rounded", label: "Extra Round" },
  { id: "cross", label: "Cross" },
  { id: "cross-rounded", label: "Cross Round" },
  { id: "diamond", label: "Diamond" },
  { id: "diamond-special", label: "Diamond Spc" },
  { id: "heart", label: "Heart" },
  { id: "horizontal-rounded", label: "Horiz Round" },
  { id: "ribbon", label: "Ribbon" },
  { id: "shake", label: "Shake" },
  { id: "sparkle", label: "Sparkle" },
  { id: "star", label: "Star" },
  { id: "vertical-rounded", label: "Vert Round" },
  { id: "x", label: "X" },
  { id: "x-rounded", label: "X Rounded" },
];

const CORNER_SQUARE_STYLES = [
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

const CORNER_DOT_STYLES = [
  { id: "default", label: "Default" },
  { id: "dot", label: "Dot" },
  { id: "square", label: "Square" },
  { id: "cross", label: "Cross" },
  { id: "cross-rounded", label: "Cross Round" },
  { id: "diamond", label: "Diamond" },
  { id: "dot2", label: "Dot Ring" },
  { id: "dot3", label: "Dot Outline" },
  { id: "dot4", label: "Dot Target" },
  { id: "heart", label: "Heart" },
  { id: "rounded", label: "Rounded" },
  { id: "square2", label: "Square Outline" },
  { id: "square3", label: "Square Dot" },
  { id: "star", label: "Star" },
  { id: "sun", label: "Sun" },
  { id: "x", label: "X" },
  { id: "x-rounded", label: "X Rounded" },
];

const ERROR_CORRECTION = [
  { id: "L", label: "Low" },
  { id: "M", label: "Medium" },
  { id: "Q", label: "Quartile" },
  { id: "H", label: "High" },
];

// ─── Main DesignOptions Component ────────────────────────────────────────────

interface DesignOptionsProps {
  design: Record<string, any>;
  setDesign: (d: Record<string, any>) => void;
}

export default function DesignOptions({ design, setDesign }: DesignOptionsProps) {
  const set = (key: string, val: any) => setDesign({ ...design, [key]: val });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { toast.error("Logo must be under 1MB"); return; }
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      set("logo", url);
    } catch {
      toast.error("Failed to upload logo");
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
                <InlineColorPicker label="Frame color" value={design.frameColor || "#000000"} onChange={v => set("frameColor", v)} />
                <InlineColorPicker label="Text color" value={design.frameTextColor || "#FFFFFF"} onChange={v => set("frameTextColor", v)} />
              </div>
              <InlineColorPicker label="Frame background" value={design.frameBackgroundColor || "#000000"} onChange={v => set("frameBackgroundColor", v)} />
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
              <button onClick={() => set("logo", "")} className="text-xs text-red-500 ml-auto hover:underline">Remove</button>
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
