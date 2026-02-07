"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import QRCodeLib from "qrcode";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CustomSVGQRProps {
  content: Record<string, any>;
  type: string;
  design: Record<string, any>;
  size?: number;
  onReady?: (svgElement: SVGSVGElement | null) => void;
}

// ─── Content to String Conversion ────────────────────────────────────────────

function contentToString(type: string, content: Record<string, any>): string {
  switch (type) {
    case "website":
    case "video":
    case "instagram":
    case "facebook":
      return content?.url || "https://example.com";

    case "vcard": {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${content?.lastName || ""};${content?.firstName || ""}`,
        `FN:${[content?.firstName, content?.lastName].filter(Boolean).join(" ") || "Name"}`,
      ];
      if (content?.company) lines.push(`ORG:${content.company}`);
      if (content?.title) lines.push(`TITLE:${content.title}`);
      if (content?.phone) lines.push(`TEL:${content.phone}`);
      if (content?.email) lines.push(`EMAIL:${content.email}`);
      if (content?.website) lines.push(`URL:${content.website}`);
      if (content?.street || content?.city) {
        lines.push(`ADR:;;${content?.street || ""};${content?.city || ""};${content?.state || ""};${content?.zip || ""};${content?.country || ""}`);
      }
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "wifi":
      return `WIFI:T:${content?.encryption || content?.authType || "WPA"};S:${content?.ssid || ""};P:${content?.password || ""};;`;

    case "email":
      return `mailto:${content?.email || ""}?subject=${encodeURIComponent(content?.subject || "")}&body=${encodeURIComponent(content?.message || content?.body || "")}`;

    case "sms":
      return `sms:${content?.phone || ""}?body=${encodeURIComponent(content?.message || "")}`;

    case "phone":
      return `tel:${(content?.phone || "").replace(/\s/g, "")}`;

    case "text":
      return content?.text || "Sample text";

    case "whatsapp":
      return `https://wa.me/${(content?.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(content?.message || "")}`;

    case "bitcoin":
      return content?.address ? `bitcoin:${content.address}` : "bitcoin:";

    case "calendar": {
      const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT"];
      if (content?.eventTitle) lines.push(`SUMMARY:${content.eventTitle}`);
      if (content?.description) lines.push(`DESCRIPTION:${content.description}`);
      if (content?.location) lines.push(`LOCATION:${content.location}`);
      if (content?.startDate) lines.push(`DTSTART:${content.startDate.replace(/[-:T]/g, "").slice(0, 15)}`);
      if (content?.endDate) lines.push(`DTEND:${content.endDate.replace(/[-:T]/g, "").slice(0, 15)}`);
      lines.push("END:VEVENT", "END:VCALENDAR");
      return lines.join("\r\n");
    }

    default:
      return content?.url || "https://example.com";
  }
}

// ─── Pattern Rendering Functions ─────────────────────────────────────────────
// ALL patterns made LARGE and visually distinct

function renderDotPattern(
  style: string,
  cx: number,
  cy: number,
  cellSize: number,
  color: string,
  key: string
): React.ReactNode {
  // Use full cell size for calculations
  const half = cellSize / 2;
  const x = cx - half;
  const y = cy - half;

  switch (style) {
    case "square":
      // FULL square - fills entire cell
      return <rect key={key} x={x} y={y} width={cellSize} height={cellSize} fill={color} />;

    case "rounded":
      // Large rounded square - 50% corner radius makes it very rounded but still square-ish
      return <rect key={key} x={x + 0.5} y={y + 0.5} width={cellSize - 1} height={cellSize - 1} rx={cellSize * 0.35} ry={cellSize * 0.35} fill={color} />;

    case "dots":
      // Perfect circles - smaller than rounded to show clear gaps between dots
      return <circle key={key} cx={cx} cy={cy} r={cellSize * 0.38} fill={color} />;

    case "classy":
      // Smaller sharp squares - visible gaps between modules
      return <rect key={key} x={x + cellSize * 0.12} y={y + cellSize * 0.12} width={cellSize * 0.76} height={cellSize * 0.76} fill={color} />;

    case "classy-rounded":
      // Smaller with VERY rounded corners - clearly different from classy
      return <rect key={key} x={x + cellSize * 0.1} y={y + cellSize * 0.1} width={cellSize * 0.8} height={cellSize * 0.8} rx={cellSize * 0.35} ry={cellSize * 0.35} fill={color} />;

    case "extra-rounded":
      // Perfect large circles - almost touching, clearly circular
      return <circle key={key} cx={cx} cy={cy} r={cellSize * 0.5} fill={color} />;

    case "cross":
      // THICK cross - sharp corners
      return (
        <g key={key}>
          <rect x={cx - cellSize * 0.22} y={y} width={cellSize * 0.44} height={cellSize} fill={color} />
          <rect x={x} y={cy - cellSize * 0.22} width={cellSize} height={cellSize * 0.44} fill={color} />
        </g>
      );

    case "cross-rounded":
      // THICK cross with VERY rounded ends
      return (
        <g key={key}>
          <rect x={cx - cellSize * 0.22} y={y} width={cellSize * 0.44} height={cellSize} rx={cellSize * 0.22} fill={color} />
          <rect x={x} y={cy - cellSize * 0.22} width={cellSize} height={cellSize * 0.44} rx={cellSize * 0.22} fill={color} />
        </g>
      );

    case "diamond":
      // LARGE diamond - touches cell edges
      return (
        <polygon key={key} points={`${cx},${y} ${x + cellSize},${cy} ${cx},${y + cellSize} ${x},${cy}`} fill={color} />
      );

    case "diamond-special":
      // Large diamond with visible center hole
      return (
        <g key={key}>
          <polygon points={`${cx},${y} ${x + cellSize},${cy} ${cx},${y + cellSize} ${x},${cy}`} fill={color} />
          <circle cx={cx} cy={cy} r={cellSize * 0.18} fill="white" />
        </g>
      );

    case "heart": {
      // BIG heart that fills the cell
      const s = cellSize * 0.52;
      return (
        <path key={key} d={`M${cx} ${cy + s * 0.85} C${cx - s * 1.4} ${cy + s * 0.1} ${cx - s * 0.9} ${cy - s * 0.9} ${cx} ${cy - s * 0.2} C${cx + s * 0.9} ${cy - s * 0.9} ${cx + s * 1.4} ${cy + s * 0.1} ${cx} ${cy + s * 0.85}Z`} fill={color} />
      );
    }

    case "horizontal-rounded":
      // THICK horizontal pill
      return <rect key={key} x={x} y={cy - cellSize * 0.28} width={cellSize} height={cellSize * 0.56} rx={cellSize * 0.28} fill={color} />;

    case "vertical-rounded":
      // THICK vertical pill
      return <rect key={key} x={cx - cellSize * 0.28} y={y} width={cellSize * 0.56} height={cellSize} rx={cellSize * 0.28} fill={color} />;

    case "ribbon":
      // Two THICK horizontal bars
      return (
        <g key={key}>
          <rect x={x} y={y + cellSize * 0.08} width={cellSize} height={cellSize * 0.36} rx={cellSize * 0.08} fill={color} />
          <rect x={x} y={y + cellSize * 0.56} width={cellSize} height={cellSize * 0.36} rx={cellSize * 0.08} fill={color} />
        </g>
      );

    case "shake": {
      // Randomly offset large square
      const offset = Math.random() > 0.5 ? cellSize * 0.12 : -cellSize * 0.12;
      return <rect key={key} x={x + offset} y={y - offset} width={cellSize} height={cellSize} fill={color} />;
    }

    case "sparkle": {
      // LARGE 4-point star sparkle
      const s = cellSize * 0.5;
      const pts = [];
      for (let i = 0; i < 4; i++) {
        const a1 = (Math.PI / 2) * i - Math.PI / 2;
        const a2 = a1 + Math.PI / 4;
        pts.push(`${cx + Math.cos(a1) * s},${cy + Math.sin(a1) * s}`);
        pts.push(`${cx + Math.cos(a2) * s * 0.35},${cy + Math.sin(a2) * s * 0.35}`);
      }
      return <polygon key={key} points={pts.join(" ")} fill={color} />;
    }

    case "star": {
      // LARGE 5-point star
      const s = cellSize * 0.52;
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const a1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        pts.push(`${cx + Math.cos(a1) * s},${cy + Math.sin(a1) * s}`);
        pts.push(`${cx + Math.cos(a2) * s * 0.4},${cy + Math.sin(a2) * s * 0.4}`);
      }
      return <polygon key={key} points={pts.join(" ")} fill={color} />;
    }

    case "x":
      // THICK X with sharp corners
      return (
        <g key={key}>
          <rect x={cx - cellSize * 0.5} y={cy - cellSize * 0.15} width={cellSize} height={cellSize * 0.3} transform={`rotate(45 ${cx} ${cy})`} fill={color} />
          <rect x={cx - cellSize * 0.5} y={cy - cellSize * 0.15} width={cellSize} height={cellSize * 0.3} transform={`rotate(-45 ${cx} ${cy})`} fill={color} />
        </g>
      );

    case "x-rounded":
      // THICK X with VERY rounded ends - clearly different from regular X
      return (
        <g key={key}>
          <rect x={cx - cellSize * 0.5} y={cy - cellSize * 0.15} width={cellSize} height={cellSize * 0.3} rx={cellSize * 0.15} transform={`rotate(45 ${cx} ${cy})`} fill={color} />
          <rect x={cx - cellSize * 0.5} y={cy - cellSize * 0.15} width={cellSize} height={cellSize * 0.3} rx={cellSize * 0.15} transform={`rotate(-45 ${cx} ${cy})`} fill={color} />
        </g>
      );

    default:
      return <rect key={key} x={x} y={y} width={cellSize} height={cellSize} fill={color} />;
  }
}

// ─── Corner Square Rendering (outer ring only) ───────────────────────────────
// For shapes with double borders (6, 9, 10), don't render inner ring - let corner dot fill that space

function renderCornerSquare(
  style: string,
  cx: number,
  cy: number,
  size: number,
  outerColor: string,
  key: string
): React.ReactNode {
  const strokeWidth = size * 0.14;
  const x = cx - size / 2;
  const y = cy - size / 2;

  switch (style) {
    case "square":
      return (
        <rect key={key} x={x} y={y} width={size} height={size} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "dot":
      return (
        <circle key={key} cx={cx} cy={cy} r={size / 2 - strokeWidth / 2} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "extra-rounded":
      return (
        <rect key={key} x={x} y={y} width={size} height={size} rx={size * 0.25} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "shape1":
      return (
        <rect key={key} x={x} y={y} width={size} height={size} rx={size * 0.05} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "shape2":
      return (
        <rect key={key} x={x} y={y} width={size} height={size} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "shape3": {
      const diamondSize = size / 2;
      return (
        <polygon key={key} points={`${cx},${cy - diamondSize} ${cx + diamondSize},${cy} ${cx},${cy + diamondSize} ${cx - diamondSize},${cy}`} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );
    }

    case "shape4":
      return (
        <circle key={key} cx={cx} cy={cy} r={size / 2 - strokeWidth / 2} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "shape5":
      return (
        <rect key={key} x={x} y={y} width={size} height={size} rx={size * 0.18} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    // shape6, shape9, shape10 - Double border styles with inner ring
    // Inner ring is SMALLER to leave more space for corner dot
    case "shape6":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size * 0.1} stroke={outerColor} strokeWidth={strokeWidth * 0.8} fill="none" />
          <circle cx={cx} cy={cy} r={size * 0.22} stroke={outerColor} strokeWidth={strokeWidth * 0.5} fill="none" />
        </g>
      );

    case "shape7":
      return (
        <rect key={key} x={x} y={y} width={size} height={size} rx={size / 2} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "shape8":
      return (
        <rect key={key} x={x} y={y} width={size} height={size} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "shape9":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size * 0.12} stroke={outerColor} strokeWidth={strokeWidth * 0.8} fill="none" />
          <rect x={cx - size * 0.18} y={cy - size * 0.18} width={size * 0.36} height={size * 0.36} rx={size * 0.05} stroke={outerColor} strokeWidth={strokeWidth * 0.5} fill="none" />
        </g>
      );

    case "shape10":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={size / 2 - strokeWidth / 2} stroke={outerColor} strokeWidth={strokeWidth * 0.8} fill="none" />
          <circle cx={cx} cy={cy} r={size * 0.2} stroke={outerColor} strokeWidth={strokeWidth * 0.5} fill="none" />
        </g>
      );

    case "shape11":
      return (
        <rect key={key} x={x} y={y + size * 0.1} width={size} height={size * 0.8} rx={size * 0.4} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );

    case "shape12": {
      const diamondSize = size / 2;
      return (
        <polygon key={key} points={`${cx},${cy - diamondSize} ${cx + diamondSize},${cy} ${cx},${cy + diamondSize} ${cx - diamondSize},${cy}`} stroke={outerColor} strokeWidth={strokeWidth} fill="none" strokeLinejoin="round" />
      );
    }

    default:
      return (
        <rect key={key} x={x} y={y} width={size} height={size} rx={size * 0.1} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
      );
  }
}

// ─── Corner Dot Rendering ────────────────────────────────────────────────────
// LARGER dots for better visibility

function renderCornerDot(
  style: string,
  cx: number,
  cy: number,
  size: number,
  color: string,
  bgColor: string,
  key: string
): React.ReactNode {
  const r = size / 2;

  switch (style) {
    case "dot":
      return <circle key={key} cx={cx} cy={cy} r={r} fill={color} />;

    case "square":
      return <rect key={key} x={cx - r} y={cy - r} width={size} height={size} fill={color} />;

    case "cross":
      return (
        <g key={key}>
          <rect x={cx - r * 0.3} y={cy - r} width={r * 0.6} height={size} fill={color} />
          <rect x={cx - r} y={cy - r * 0.3} width={size} height={r * 0.6} fill={color} />
        </g>
      );

    case "cross-rounded":
      return (
        <g key={key}>
          <rect x={cx - r * 0.3} y={cy - r} width={r * 0.6} height={size} rx={r * 0.3} fill={color} />
          <rect x={cx - r} y={cy - r * 0.3} width={size} height={r * 0.6} rx={r * 0.3} fill={color} />
        </g>
      );

    case "diamond":
      return <polygon key={key} points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} fill={color} />;

    case "dot2":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r * 0.9} fill={color} />
          <circle cx={cx} cy={cy} r={r * 0.4} fill={bgColor} />
        </g>
      );

    case "dot3":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r * 0.95} stroke={color} strokeWidth={r * 0.35} fill="none" />
          <circle cx={cx} cy={cy} r={r * 0.35} fill={color} />
        </g>
      );

    case "dot4":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r} fill={color} />
          <circle cx={cx} cy={cy} r={r * 0.6} fill={bgColor} />
          <circle cx={cx} cy={cy} r={r * 0.32} fill={color} />
        </g>
      );

    case "heart": {
      const hr = r * 1.1;
      return (
        <path key={key} d={`M${cx} ${cy + hr * 0.7} C${cx - hr * 1.4} ${cy - hr * 0.1} ${cx - hr * 0.7} ${cy - hr} ${cx} ${cy - hr * 0.35} C${cx + hr * 0.7} ${cy - hr} ${cx + hr * 1.4} ${cy - hr * 0.1} ${cx} ${cy + hr * 0.7}Z`} fill={color} />
      );
    }

    case "rounded":
      return <rect key={key} x={cx - r} y={cy - r} width={size} height={size} rx={r * 0.4} fill={color} />;

    case "square2":
      return <rect key={key} x={cx - r * 0.85} y={cy - r * 0.85} width={size * 0.85} height={size * 0.85} stroke={color} strokeWidth={r * 0.35} fill="none" />;

    case "square3":
      return (
        <g key={key}>
          <rect x={cx - r * 0.85} y={cy - r * 0.85} width={size * 0.85} height={size * 0.85} rx={r * 0.15} stroke={color} strokeWidth={r * 0.3} fill="none" />
          <rect x={cx - r * 0.35} y={cy - r * 0.35} width={r * 0.7} height={r * 0.7} rx={r * 0.1} fill={color} />
        </g>
      );

    case "star": {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const a1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        pts.push(`${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r}`);
        pts.push(`${cx + Math.cos(a2) * r * 0.4},${cy + Math.sin(a2) * r * 0.4}`);
      }
      return <polygon key={key} points={pts.join(" ")} fill={color} />;
    }

    case "sun": {
      const rays = [];
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i;
        const x1 = cx + Math.cos(angle) * r * 0.5;
        const y1 = cy + Math.sin(angle) * r * 0.5;
        const x2 = cx + Math.cos(angle) * r * 0.95;
        const y2 = cy + Math.sin(angle) * r * 0.95;
        rays.push(<line key={`ray-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={r * 0.22} strokeLinecap="round" />);
      }
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r * 0.45} fill={color} />
          {rays}
        </g>
      );
    }

    case "x":
      return (
        <g key={key}>
          <rect x={cx - r} y={cy - r * 0.2} width={size} height={r * 0.4} transform={`rotate(45 ${cx} ${cy})`} fill={color} />
          <rect x={cx - r} y={cy - r * 0.2} width={size} height={r * 0.4} transform={`rotate(-45 ${cx} ${cy})`} fill={color} />
        </g>
      );

    case "x-rounded":
      return (
        <g key={key}>
          <rect x={cx - r} y={cy - r * 0.2} width={size} height={r * 0.4} rx={r * 0.2} transform={`rotate(45 ${cx} ${cy})`} fill={color} />
          <rect x={cx - r} y={cy - r * 0.2} width={size} height={r * 0.4} rx={r * 0.2} transform={`rotate(-45 ${cx} ${cy})`} fill={color} />
        </g>
      );

    default:
      return <rect key={key} x={cx - r} y={cy - r} width={size} height={size} rx={r * 0.25} fill={color} />;
  }
}

// ─── Check if position is in finder pattern area ─────────────────────────────

function isFinderPattern(row: number, col: number, size: number): boolean {
  const finderSize = 7;
  if (row < finderSize && col < finderSize) return true;
  if (row < finderSize && col >= size - finderSize) return true;
  if (row >= size - finderSize && col < finderSize) return true;
  return false;
}

// ─── Frame Component ─────────────────────────────────────────────────────────

interface FrameProps {
  frameId: number;
  frameColor: string;
  frameBgColor: string;
  frameText: string;
  frameTextColor: string;
  fontSize: number;
  children: React.ReactNode;
}

function QRFrame({ frameId, frameColor, frameBgColor, frameText, frameTextColor, fontSize, children }: FrameProps) {
  // No frame
  if (frameId < 0) {
    return <div className="p-3 bg-white rounded-xl shadow-sm">{children}</div>;
  }

  // Compute frame text size - scale with fontSize prop
  const textSize = Math.max(10, Math.min(18, fontSize / 3));

  // Frame 0: Video Player style
  if (frameId === 0) {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: frameBgColor }}>
        <div className="p-3 pb-10">{children}</div>
        <div className="absolute bottom-0 left-0 right-0 py-2 px-3 flex items-center gap-2" style={{ backgroundColor: frameColor }}>
          <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
            <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
          </div>
          <span className="text-xs font-medium truncate" style={{ color: frameTextColor }}>{frameText}</span>
        </div>
      </div>
    );
  }

  // Frame styles by ID
  const frameConfig: Record<number, { textPosition: "top" | "bottom" | "both"; borderRadius: string; dashed?: boolean; double?: boolean }> = {
    1: { textPosition: "bottom", borderRadius: "8px" },
    2: { textPosition: "top", borderRadius: "8px" },
    3: { textPosition: "both", borderRadius: "8px" },
    4: { textPosition: "bottom", borderRadius: "16px" },
    5: { textPosition: "top", borderRadius: "16px" },
    6: { textPosition: "both", borderRadius: "16px" },
    7: { textPosition: "bottom", borderRadius: "8px" },
    8: { textPosition: "both", borderRadius: "8px" },
    9: { textPosition: "bottom", borderRadius: "8px", dashed: true },
    10: { textPosition: "bottom", borderRadius: "16px", dashed: true },
    11: { textPosition: "bottom", borderRadius: "8px", dashed: true },
    12: { textPosition: "top", borderRadius: "16px", dashed: true },
    13: { textPosition: "bottom", borderRadius: "8px", double: true },
    14: { textPosition: "bottom", borderRadius: "16px", double: true },
    15: { textPosition: "top", borderRadius: "8px" },
    16: { textPosition: "bottom", borderRadius: "12px" },
    17: { textPosition: "bottom", borderRadius: "8px" },
    18: { textPosition: "bottom", borderRadius: "8px" },
    19: { textPosition: "bottom", borderRadius: "12px" },
    20: { textPosition: "bottom", borderRadius: "8px" },
    21: { textPosition: "bottom", borderRadius: "10px" },
    22: { textPosition: "bottom", borderRadius: "8px" },
    23: { textPosition: "bottom", borderRadius: "8px" },
    24: { textPosition: "bottom", borderRadius: "8px" },
    25: { textPosition: "bottom", borderRadius: "10px" },
    26: { textPosition: "bottom", borderRadius: "12px" },
    27: { textPosition: "bottom", borderRadius: "50%" },
    28: { textPosition: "bottom", borderRadius: "8px" },
    29: { textPosition: "bottom", borderRadius: "8px", dashed: true },
    30: { textPosition: "bottom", borderRadius: "16px" },
  };

  const config = frameConfig[frameId] || { textPosition: "bottom", borderRadius: "8px" };
  const { textPosition, borderRadius, dashed, double } = config;

  const textStyle = {
    backgroundColor: frameBgColor,
    color: frameTextColor,
    fontSize: `${textSize}px`,
    padding: "8px 16px",
    fontWeight: 600,
    textAlign: "center" as const,
  };

  const borderStyle = dashed
    ? `2px dashed ${frameColor}`
    : double
      ? `3px double ${frameColor}`
      : `2px solid ${frameColor}`;

  return (
    <div
      className="overflow-hidden shadow-sm"
      style={{
        borderRadius,
        border: borderStyle,
        backgroundColor: "#FFFFFF",
      }}
    >
      {(textPosition === "top" || textPosition === "both") && (
        <div style={{ ...textStyle, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}>
          {frameText}
        </div>
      )}
      <div className="p-3">{children}</div>
      {(textPosition === "bottom" || textPosition === "both") && (
        <div style={{ ...textStyle, borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius }}>
          {frameText}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CustomSVGQR({
  content,
  type,
  design,
  size = 200,
  onReady,
}: CustomSVGQRProps) {
  const [qrMatrix, setQrMatrix] = useState<boolean[][] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const qrValue = contentToString(type, content);

  // Design options
  const dotsType = design?.dotsType || "square";
  const dotsColor = design?.dotsColor || "#000000";
  const backgroundColor = design?.bgTransparent ? "transparent" : (design?.backgroundColor || "#FFFFFF");
  const cornersSquareType = design?.cornersSquareType || "default";
  const cornersSquareColor = design?.cornersSquareColor || dotsColor;
  const cornersDotType = design?.cornersDotType || "default";
  const cornersDotColor = design?.cornersDotColor || dotsColor;
  const errorCorrectionLevel = design?.errorCorrectionLevel || (design?.logo ? "H" : "M");

  // Frame options
  const frameId = typeof design?.frameId === "number" ? design.frameId : -1;
  const frameColor = design?.frameColor || "#7C3AED";
  const frameBgColor = design?.frameBackgroundColor || frameColor;
  const frameText = (design?.frameText || "Scan me!").slice(0, 30);
  const frameTextColor = design?.frameTextColor || "#FFFFFF";
  const fontSize = design?.frameFontSize || 42;

  // Generate QR matrix
  useEffect(() => {
    setIsLoading(true);

    try {
      const qr = QRCodeLib.create(qrValue, {
        errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
      });

      const modules = qr.modules;
      const matrixSize = modules.size;
      const matrix: boolean[][] = [];

      for (let row = 0; row < matrixSize; row++) {
        const rowData: boolean[] = [];
        for (let col = 0; col < matrixSize; col++) {
          rowData.push(modules.get(row, col) === 1);
        }
        matrix.push(rowData);
      }

      setQrMatrix(matrix);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
      setIsLoading(false);
    }
  }, [qrValue, errorCorrectionLevel]);

  // Notify when ready
  useEffect(() => {
    if (!isLoading && svgRef.current && onReady) {
      onReady(svgRef.current);
    }
  }, [isLoading, onReady]);

  // Render QR code
  const svgContent = useMemo(() => {
    if (!qrMatrix) return null;

    const matrixSize = qrMatrix.length;
    const margin = 4;
    const cellSize = (size - margin * 2) / matrixSize;
    const elements: React.ReactNode[] = [];

    // Render data modules (excluding finder patterns)
    for (let row = 0; row < matrixSize; row++) {
      for (let col = 0; col < matrixSize; col++) {
        if (qrMatrix[row][col] && !isFinderPattern(row, col, matrixSize)) {
          const cx = margin + col * cellSize + cellSize / 2;
          const cy = margin + row * cellSize + cellSize / 2;
          elements.push(
            renderDotPattern(dotsType, cx, cy, cellSize, dotsColor, `dot-${row}-${col}`)
          );
        }
      }
    }

    // Finder pattern positions
    const finderSize = 7 * cellSize;
    const finderCenters = [
      { x: margin + finderSize / 2, y: margin + finderSize / 2 },
      { x: margin + (matrixSize - 3.5) * cellSize, y: margin + finderSize / 2 },
      { x: margin + finderSize / 2, y: margin + (matrixSize - 3.5) * cellSize },
    ];

    // Corner dot size - smaller to fit inside double-border corner squares (shape6, 9, 10)
    // 35% of finder size leaves proper gap for inner rings
    const cornerDotSize = finderSize * 0.35;

    finderCenters.forEach((center, idx) => {
      // Render outer corner square
      elements.push(
        renderCornerSquare(
          cornersSquareType,
          center.x,
          center.y,
          finderSize,
          cornersSquareColor,
          `corner-${idx}`
        )
      );
      // Render inner corner dot
      elements.push(
        renderCornerDot(
          cornersDotType,
          center.x,
          center.y,
          cornerDotSize,
          cornersDotColor,
          backgroundColor,
          `corner-dot-${idx}`
        )
      );
    });

    return elements;
  }, [qrMatrix, size, dotsType, dotsColor, cornersSquareType, cornersSquareColor, cornersDotType, cornersDotColor, backgroundColor]);

  const qrCodeSvg = (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <rect x="0" y="0" width={size} height={size} fill={backgroundColor} />

      {design?.logo && (
        <defs>
          <clipPath id="logo-clip">
            <rect x={size * 0.35} y={size * 0.35} width={size * 0.3} height={size * 0.3} rx={size * 0.02} />
          </clipPath>
        </defs>
      )}

      {svgContent}

      {design?.logo && (
        <g>
          <rect x={size * 0.33} y={size * 0.33} width={size * 0.34} height={size * 0.34} fill={backgroundColor} rx={size * 0.02} />
          <image
            href={design.logo}
            x={size * 0.35}
            y={size * 0.35}
            width={size * 0.3}
            height={size * 0.3}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#logo-clip)"
          />
        </g>
      )}
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center relative">
      <QRFrame
        frameId={frameId}
        frameColor={frameColor}
        frameBgColor={frameBgColor}
        frameText={frameText}
        frameTextColor={frameTextColor}
        fontSize={fontSize}
      >
        {qrCodeSvg}
      </QRFrame>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// ─── Download Function ───────────────────────────────────────────────────────

export async function downloadCustomQR(
  svgElement: SVGSVGElement,
  filename: string = "qrcode",
  format: "png" | "svg" = "png"
): Promise<void> {
  if (format === "svg") {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx?.scale(2, 2);
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${filename}.png`;
            a.click();
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error("Failed to create blob"));
          }
        }, "image/png");
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
    });
  }
}
