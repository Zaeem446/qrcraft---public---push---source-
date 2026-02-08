"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import QRCodeLib from "qrcode";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CustomSVGQRProps {
  content: Record<string, any>;
  type: string;
  design: Record<string, any>;
  size?: number;
  slug?: string; // When provided, dynamic types will encode redirect URL for tracking
  onReady?: (svgElement: SVGSVGElement | null) => void;
}

// ─── Static Types (encode raw content directly) ─────────────────────────────
// These types encode their content directly into the QR code (no tracking)
const STATIC_TYPES = new Set([
  "vcard", "wifi", "email", "sms", "phone", "text", "bitcoin", "calendar", "whatsapp"
]);

// ─── Content to String Conversion ────────────────────────────────────────────

function contentToString(type: string, content: Record<string, any>, slug?: string): string {
  // For dynamic types with a slug, use the redirect URL for tracking
  // This allows scans to be recorded before redirecting to the actual content
  if (slug && !STATIC_TYPES.has(type)) {
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL || 'https://qr-craft.online');
    return `${baseUrl}/r/${slug}`;
  }

  switch (type) {
    case "website":
    case "video":
    case "instagram":
    case "facebook":
      // When no slug (preview mode), show content URL or placeholder
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

// ─── Corner Square Rendering ─────────────────────────────────────────────────
// IMPORTANT: QR finder patterns must use FILLED shapes, not strokes
// Pattern: Outer filled square + inner white square = creates the ring effect
// The cornerDot function renders the center separately

function renderCornerSquare(
  style: string,
  cx: number,
  cy: number,
  size: number,
  outerColor: string,
  bgColor: string, // Added: background color for the inner cutout
  key: string
): React.ReactNode {
  const x = cx - size / 2;
  const y = cy - size / 2;
  // Ring thickness is 1/7th of finder size (1 cell out of 7)
  const ringThickness = size / 7;
  const innerSize = size - ringThickness * 2;
  const innerX = x + ringThickness;
  const innerY = y + ringThickness;

  switch (style) {
    case "square":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} fill={bgColor} />
        </g>
      );

    case "dot":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={size / 2} fill={outerColor} />
          <circle cx={cx} cy={cy} r={size / 2 - ringThickness} fill={bgColor} />
        </g>
      );

    case "extra-rounded":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size * 0.25} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.2} fill={bgColor} />
        </g>
      );

    case "shape1":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size * 0.08} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.05} fill={bgColor} />
        </g>
      );

    case "shape2":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} fill={bgColor} />
        </g>
      );

    case "shape3": {
      const outerD = size / 2;
      const innerD = innerSize / 2;
      return (
        <g key={key}>
          <polygon points={`${cx},${cy - outerD} ${cx + outerD},${cy} ${cx},${cy + outerD} ${cx - outerD},${cy}`} fill={outerColor} />
          <polygon points={`${cx},${cy - innerD} ${cx + innerD},${cy} ${cx},${cy + innerD} ${cx - innerD},${cy}`} fill={bgColor} />
        </g>
      );
    }

    case "shape4":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={size / 2} fill={outerColor} />
          <circle cx={cx} cy={cy} r={size / 2 - ringThickness} fill={bgColor} />
        </g>
      );

    case "shape5":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size * 0.18} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.15} fill={bgColor} />
        </g>
      );

    // shape6, shape9, shape10 - Double border styles (outer + middle ring)
    case "shape6": {
      const middleRingSize = size * 0.65;
      const middleX = cx - middleRingSize / 2;
      const middleY = cy - middleRingSize / 2;
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size * 0.1} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.08} fill={bgColor} />
          <circle cx={cx} cy={cy} r={middleRingSize / 2} fill={outerColor} />
          <circle cx={cx} cy={cy} r={middleRingSize / 2 - ringThickness * 0.7} fill={bgColor} />
        </g>
      );
    }

    case "shape7":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size / 2} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize / 2} fill={bgColor} />
        </g>
      );

    case "shape8":
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} fill={bgColor} />
        </g>
      );

    case "shape9": {
      const middleSize = size * 0.55;
      const middleX = cx - middleSize / 2;
      const middleY = cy - middleSize / 2;
      const middleInner = middleSize - ringThickness;
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size * 0.12} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.1} fill={bgColor} />
          <rect x={middleX} y={middleY} width={middleSize} height={middleSize} rx={middleSize * 0.1} fill={outerColor} />
          <rect x={middleX + ringThickness / 2} y={middleY + ringThickness / 2} width={middleInner} height={middleInner} rx={middleInner * 0.08} fill={bgColor} />
        </g>
      );
    }

    case "shape10": {
      const middleR = size * 0.32;
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={size / 2} fill={outerColor} />
          <circle cx={cx} cy={cy} r={size / 2 - ringThickness} fill={bgColor} />
          <circle cx={cx} cy={cy} r={middleR} fill={outerColor} />
          <circle cx={cx} cy={cy} r={middleR - ringThickness * 0.6} fill={bgColor} />
        </g>
      );
    }

    case "shape11":
      return (
        <g key={key}>
          <rect x={x} y={y + size * 0.1} width={size} height={size * 0.8} rx={size * 0.4} fill={outerColor} />
          <rect x={innerX} y={innerY + size * 0.1} width={innerSize} height={innerSize * 0.8 / (size * 0.8) * innerSize} rx={innerSize * 0.35} fill={bgColor} />
        </g>
      );

    case "shape12": {
      const outerD = size / 2;
      const innerD = innerSize / 2;
      return (
        <g key={key}>
          <polygon points={`${cx},${cy - outerD} ${cx + outerD},${cy} ${cx},${cy + outerD} ${cx - outerD},${cy}`} fill={outerColor} />
          <polygon points={`${cx},${cy - innerD} ${cx + innerD},${cy} ${cx},${cy + innerD} ${cx - innerD},${cy}`} fill={bgColor} />
        </g>
      );
    }

    default:
      return (
        <g key={key}>
          <rect x={x} y={y} width={size} height={size} rx={size * 0.1} fill={outerColor} />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.08} fill={bgColor} />
        </g>
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
  // Compute text size from fontSize prop (30-98 range)
  const textSize = Math.max(11, Math.min(16, fontSize / 4));

  // Common text bar style
  const textBarStyle = (position: "top" | "bottom", rounded?: boolean, pill?: boolean) => ({
    backgroundColor: frameBgColor,
    color: frameTextColor,
    fontSize: `${textSize}px`,
    fontWeight: 600,
    textAlign: "center" as const,
    padding: pill ? "6px 20px" : "8px 16px",
    borderRadius: pill
      ? "999px"
      : rounded
        ? position === "top" ? "12px 12px 0 0" : "0 0 12px 12px"
        : position === "top" ? "6px 6px 0 0" : "0 0 6px 6px",
  });

  // No frame
  if (frameId < 0) {
    return <div className="p-3 bg-white rounded-xl shadow-sm">{children}</div>;
  }

  // Frame 0: Video Player
  if (frameId === 0) {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="p-3 pb-12">{children}</div>
        <div className="absolute bottom-0 left-0 right-0 py-2.5 px-4 flex items-center gap-3" style={{ backgroundColor: frameColor }}>
          <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
            <div className="w-0 h-0 border-l-[7px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
          </div>
          <span className="text-sm font-semibold truncate" style={{ color: frameTextColor }}>{frameText}</span>
        </div>
      </div>
    );
  }

  // Frame 1: Square, text bottom
  if (frameId === 1) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-lg" style={{ border: `2px solid ${frameColor}` }}>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom")}>{frameText}</div>
      </div>
    );
  }

  // Frame 2: Square, text top
  if (frameId === 2) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-lg" style={{ border: `2px solid ${frameColor}` }}>
        <div style={textBarStyle("top")}>{frameText}</div>
        <div className="p-3">{children}</div>
      </div>
    );
  }

  // Frame 3: Square, text both
  if (frameId === 3) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-lg" style={{ border: `2px solid ${frameColor}` }}>
        <div style={textBarStyle("top")}>{frameText}</div>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom")}>{frameText}</div>
      </div>
    );
  }

  // Frame 4: Rounded, text bottom
  if (frameId === 4) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-2xl" style={{ border: `2px solid ${frameColor}` }}>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom", true)}>{frameText}</div>
      </div>
    );
  }

  // Frame 5: Rounded, text top
  if (frameId === 5) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-2xl" style={{ border: `2px solid ${frameColor}` }}>
        <div style={textBarStyle("top", true)}>{frameText}</div>
        <div className="p-3">{children}</div>
      </div>
    );
  }

  // Frame 6: Rounded, text both
  if (frameId === 6) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-2xl" style={{ border: `2px solid ${frameColor}` }}>
        <div style={textBarStyle("top", true)}>{frameText}</div>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom", true)}>{frameText}</div>
      </div>
    );
  }

  // Frame 7: Square frame, pill text bottom
  if (frameId === 7) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-lg p-3 pb-0" style={{ border: `2px solid ${frameColor}` }}>
        {children}
        <div className="flex justify-center py-3">
          <div style={{ ...textBarStyle("bottom", false, true), margin: 0 }}>{frameText}</div>
        </div>
      </div>
    );
  }

  // Frame 8: Square frame, pill text both
  if (frameId === 8) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-lg p-3" style={{ border: `2px solid ${frameColor}` }}>
        <div className="flex justify-center pb-3">
          <div style={{ ...textBarStyle("top", false, true), margin: 0 }}>{frameText}</div>
        </div>
        {children}
        <div className="flex justify-center pt-3">
          <div style={{ ...textBarStyle("bottom", false, true), margin: 0 }}>{frameText}</div>
        </div>
      </div>
    );
  }

  // Frame 9: Dashed square
  if (frameId === 9) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-lg" style={{ border: `2px dashed ${frameColor}` }}>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom")}>{frameText}</div>
      </div>
    );
  }

  // Frame 10: Dashed rounded
  if (frameId === 10) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-2xl" style={{ border: `2px dashed ${frameColor}` }}>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom", true)}>{frameText}</div>
      </div>
    );
  }

  // Frame 11: Dotted square
  if (frameId === 11) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-lg" style={{ border: `3px dotted ${frameColor}` }}>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom")}>{frameText}</div>
      </div>
    );
  }

  // Frame 12: Dotted rounded
  if (frameId === 12) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-2xl" style={{ border: `3px dotted ${frameColor}` }}>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom", true)}>{frameText}</div>
      </div>
    );
  }

  // Frame 13: Double border square
  if (frameId === 13) {
    return (
      <div className="shadow-sm bg-white rounded-lg p-1" style={{ border: `2px solid ${frameColor}` }}>
        <div className="rounded overflow-hidden" style={{ border: `2px solid ${frameColor}` }}>
          <div className="p-3">{children}</div>
          <div style={textBarStyle("bottom")}>{frameText}</div>
        </div>
      </div>
    );
  }

  // Frame 14: Double border rounded
  if (frameId === 14) {
    return (
      <div className="shadow-sm bg-white rounded-2xl p-1" style={{ border: `2px solid ${frameColor}` }}>
        <div className="rounded-xl overflow-hidden" style={{ border: `2px solid ${frameColor}` }}>
          <div className="p-3">{children}</div>
          <div style={textBarStyle("bottom", true)}>{frameText}</div>
        </div>
      </div>
    );
  }

  // Frame 15: Thick border square
  if (frameId === 15) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-lg" style={{ border: `4px solid ${frameColor}` }}>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom")}>{frameText}</div>
      </div>
    );
  }

  // Frame 16: Thick border rounded
  if (frameId === 16) {
    return (
      <div className="overflow-hidden shadow-sm bg-white rounded-3xl" style={{ border: `4px solid ${frameColor}` }}>
        <div className="p-3">{children}</div>
        <div style={textBarStyle("bottom", true)}>{frameText}</div>
      </div>
    );
  }

  // Frames 17-30: Various special frames with bottom text
  // Using a consistent style with different border radii
  const specialFrameRadius: Record<number, string> = {
    17: "12px", 18: "16px", 19: "20px", 20: "8px",
    21: "10px", 22: "8px", 23: "12px", 24: "8px",
    25: "14px", 26: "18px", 27: "24px", 28: "6px",
    29: "8px", 30: "20px",
  };

  const isDashedSpecial = frameId === 29;
  const radius = specialFrameRadius[frameId] || "8px";

  return (
    <div
      className="overflow-hidden shadow-sm bg-white"
      style={{
        borderRadius: radius,
        border: isDashedSpecial ? `2px dashed ${frameColor}` : `2px solid ${frameColor}`
      }}
    >
      <div className="p-3">{children}</div>
      <div style={{
        backgroundColor: frameBgColor,
        color: frameTextColor,
        fontSize: `${textSize}px`,
        fontWeight: 600,
        textAlign: "center",
        padding: "8px 16px"
      }}>
        {frameText}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CustomSVGQR({
  content,
  type,
  design,
  size = 200,
  slug,
  onReady,
}: CustomSVGQRProps) {
  const [qrMatrix, setQrMatrix] = useState<boolean[][] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const qrValue = contentToString(type, content, slug);

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

    // Corner dot size - 3/7 of finder size (the center 3x3 cells of a 7x7 finder)
    // This is the standard QR code finder pattern center size
    const cornerDotSize = finderSize * (3 / 7);

    finderCenters.forEach((center, idx) => {
      // Render outer corner square (with background color for inner cutout)
      elements.push(
        renderCornerSquare(
          cornersSquareType,
          center.x,
          center.y,
          finderSize,
          cornersSquareColor,
          backgroundColor,
          `corner-${idx}`
        )
      );
      // Render inner corner dot (center of finder pattern)
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
