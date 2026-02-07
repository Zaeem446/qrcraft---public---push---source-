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

function renderDotPattern(
  style: string,
  cx: number,
  cy: number,
  cellSize: number,
  color: string,
  key: string
): React.ReactNode {
  const r = cellSize * 0.4;
  const half = cellSize / 2;
  const x = cx - half;
  const y = cy - half;

  switch (style) {
    case "square":
      return <rect key={key} x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize - 2} fill={color} />;

    case "rounded":
      return <rect key={key} x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize - 2} rx={cellSize * 0.3} fill={color} />;

    case "dots":
      return <circle key={key} cx={cx} cy={cy} r={r} fill={color} />;

    case "classy":
      return <rect key={key} x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize - 2} rx={2} fill={color} />;

    case "classy-rounded":
      return <rect key={key} x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize - 2} rx={cellSize * 0.4} ry={2} fill={color} />;

    case "extra-rounded":
      return <circle key={key} cx={cx} cy={cy} r={r * 1.1} fill={color} />;

    case "cross":
      return (
        <g key={key}>
          <rect x={cx - r * 0.25} y={cy - r} width={r * 0.5} height={r * 2} fill={color} />
          <rect x={cx - r} y={cy - r * 0.25} width={r * 2} height={r * 0.5} fill={color} />
        </g>
      );

    case "cross-rounded":
      return (
        <g key={key}>
          <rect x={cx - r * 0.25} y={cy - r} width={r * 0.5} height={r * 2} rx={r * 0.12} fill={color} />
          <rect x={cx - r} y={cy - r * 0.25} width={r * 2} height={r * 0.5} rx={r * 0.12} fill={color} />
        </g>
      );

    case "diamond":
      return (
        <polygon key={key} points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} fill={color} />
      );

    case "diamond-special":
      return (
        <g key={key}>
          <polygon points={`${cx},${cy - r * 0.9} ${cx + r * 0.9},${cy} ${cx},${cy + r * 0.9} ${cx - r * 0.9},${cy}`} fill={color} />
          <circle cx={cx} cy={cy} r={r * 0.2} fill="white" />
        </g>
      );

    case "heart":
      return (
        <path key={key} d={`M${cx} ${cy + r * 0.5} C${cx - r * 1.1} ${cy - r * 0.2} ${cx - r * 0.5} ${cy - r * 0.9} ${cx} ${cy - r * 0.35} C${cx + r * 0.5} ${cy - r * 0.9} ${cx + r * 1.1} ${cy - r * 0.2} ${cx} ${cy + r * 0.5}Z`} fill={color} />
      );

    case "horizontal-rounded":
      return <rect key={key} x={x} y={cy - r * 0.4} width={cellSize} height={r * 0.8} rx={r * 0.4} fill={color} />;

    case "vertical-rounded":
      return <rect key={key} x={cx - r * 0.4} y={y} width={r * 0.8} height={cellSize} rx={r * 0.4} fill={color} />;

    case "ribbon":
      return (
        <g key={key}>
          <rect x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize * 0.35} rx={1} fill={color} />
          <rect x={x + 1} y={y + cellSize * 0.55} width={cellSize - 2} height={cellSize * 0.35} rx={1} fill={color} />
        </g>
      );

    case "shake": {
      const offset = Math.random() > 0.5 ? 1 : -1;
      return <rect key={key} x={x + 1 + offset} y={y + 1 - offset} width={cellSize - 2} height={cellSize - 2} fill={color} />;
    }

    case "sparkle": {
      const pts = [];
      for (let i = 0; i < 4; i++) {
        const a1 = (Math.PI / 2) * i - Math.PI / 2;
        const a2 = a1 + Math.PI / 4;
        pts.push(`${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r}`);
        pts.push(`${cx + Math.cos(a2) * r * 0.35},${cy + Math.sin(a2) * r * 0.35}`);
      }
      return <polygon key={key} points={pts.join(" ")} fill={color} />;
    }

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

    case "x":
      return (
        <g key={key}>
          <rect x={cx - r} y={cy - r * 0.15} width={r * 2} height={r * 0.3} transform={`rotate(45 ${cx} ${cy})`} fill={color} />
          <rect x={cx - r} y={cy - r * 0.15} width={r * 2} height={r * 0.3} transform={`rotate(-45 ${cx} ${cy})`} fill={color} />
        </g>
      );

    case "x-rounded":
      return (
        <g key={key}>
          <rect x={cx - r} y={cy - r * 0.15} width={r * 2} height={r * 0.3} rx={r * 0.08} transform={`rotate(45 ${cx} ${cy})`} fill={color} />
          <rect x={cx - r} y={cy - r * 0.15} width={r * 2} height={r * 0.3} rx={r * 0.08} transform={`rotate(-45 ${cx} ${cy})`} fill={color} />
        </g>
      );

    default:
      return <rect key={key} x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize - 2} fill={color} />;
  }
}

// ─── Corner Square Rendering ─────────────────────────────────────────────────

function renderCornerSquare(
  style: string,
  cx: number,
  cy: number,
  size: number,
  outerColor: string,
  innerColor: string,
  key: string
): React.ReactNode {
  const outerSize = size;
  const innerSize = size * 0.43;
  const strokeWidth = size * 0.14;
  const x = cx - size / 2;
  const y = cy - size / 2;
  const innerX = cx - innerSize / 2;
  const innerY = cy - innerSize / 2;

  switch (style) {
    case "square":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} fill={innerColor} />
        </g>
      );

    case "dot":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={size / 2 - strokeWidth / 2} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <circle cx={cx} cy={cy} r={innerSize / 2} fill={innerColor} />
        </g>
      );

    case "extra-rounded":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} rx={size * 0.25} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.2} fill={innerColor} />
        </g>
      );

    case "shape1":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} rx={size * 0.05} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <circle cx={cx} cy={cy} r={innerSize / 2} fill={innerColor} />
        </g>
      );

    case "shape2":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <polygon points={`${cx},${cy - innerSize / 2} ${cx + innerSize / 2},${cy} ${cx},${cy + innerSize / 2} ${cx - innerSize / 2},${cy}`} fill={innerColor} />
        </g>
      );

    case "shape3": {
      const diamondSize = size / 2;
      return (
        <g key={key}>
          <polygon points={`${cx},${cy - diamondSize} ${cx + diamondSize},${cy} ${cx},${cy + diamondSize} ${cx - diamondSize},${cy}`} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <rect x={cx - innerSize / 2.5} y={cy - innerSize / 2.5} width={innerSize / 1.25} height={innerSize / 1.25} fill={innerColor} />
        </g>
      );
    }

    case "shape4":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={size / 2 - strokeWidth / 2} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.1} fill={innerColor} />
        </g>
      );

    case "shape5":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} rx={size * 0.18} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <polygon points={`${cx},${cy - innerSize / 2} ${cx + innerSize / 2},${cy} ${cx},${cy + innerSize / 2} ${cx - innerSize / 2},${cy}`} fill={innerColor} />
        </g>
      );

    case "shape6":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} rx={size * 0.1} stroke={outerColor} strokeWidth={strokeWidth * 0.8} fill="none" />
          <circle cx={cx} cy={cy} r={size * 0.28} stroke={outerColor} strokeWidth={strokeWidth * 0.6} fill="none" />
          <circle cx={cx} cy={cy} r={innerSize * 0.35} fill={innerColor} />
        </g>
      );

    case "shape7":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} rx={size / 2} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize / 2} fill={innerColor} />
        </g>
      );

    case "shape8":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <circle cx={cx} cy={cy} r={innerSize / 1.8} fill={innerColor} />
        </g>
      );

    case "shape9":
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} rx={size * 0.12} stroke={outerColor} strokeWidth={strokeWidth * 0.8} fill="none" />
          <rect x={cx - size * 0.25} y={cy - size * 0.25} width={size * 0.5} height={size * 0.5} rx={size * 0.06} stroke={outerColor} strokeWidth={strokeWidth * 0.6} fill="none" />
        </g>
      );

    case "shape10":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={size / 2 - strokeWidth / 2} stroke={outerColor} strokeWidth={strokeWidth * 0.8} fill="none" />
          <circle cx={cx} cy={cy} r={size * 0.25} stroke={outerColor} strokeWidth={strokeWidth * 0.6} fill="none" />
          <circle cx={cx} cy={cy} r={innerSize * 0.3} fill={innerColor} />
        </g>
      );

    case "shape11":
      return (
        <g key={key}>
          <rect x={x} y={y + size * 0.1} width={outerSize} height={outerSize * 0.8} rx={size * 0.4} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize / 2} fill={innerColor} />
        </g>
      );

    case "shape12": {
      const diamondSize = size / 2;
      return (
        <g key={key}>
          <polygon points={`${cx},${cy - diamondSize} ${cx + diamondSize},${cy} ${cx},${cy + diamondSize} ${cx - diamondSize},${cy}`} stroke={outerColor} strokeWidth={strokeWidth} fill="none" strokeLinejoin="round" />
          <circle cx={cx} cy={cy} r={innerSize / 2.5} fill={innerColor} />
        </g>
      );
    }

    default: // "default"
      return (
        <g key={key}>
          <rect x={x} y={y} width={outerSize} height={outerSize} rx={size * 0.1} stroke={outerColor} strokeWidth={strokeWidth} fill="none" />
          <rect x={innerX} y={innerY} width={innerSize} height={innerSize} rx={innerSize * 0.1} fill={innerColor} />
        </g>
      );
  }
}

// ─── Corner Dot Rendering ────────────────────────────────────────────────────

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
          <rect x={cx - r * 0.25} y={cy - r} width={r * 0.5} height={size} fill={color} />
          <rect x={cx - r} y={cy - r * 0.25} width={size} height={r * 0.5} fill={color} />
        </g>
      );

    case "cross-rounded":
      return (
        <g key={key}>
          <rect x={cx - r * 0.25} y={cy - r} width={r * 0.5} height={size} rx={r * 0.25} fill={color} />
          <rect x={cx - r} y={cy - r * 0.25} width={size} height={r * 0.5} rx={r * 0.25} fill={color} />
        </g>
      );

    case "diamond":
      return <polygon key={key} points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} fill={color} />;

    case "dot2":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r * 0.85} fill={color} />
          <circle cx={cx} cy={cy} r={r * 0.35} fill={bgColor} />
        </g>
      );

    case "dot3":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={r * 0.35} fill="none" />
          <circle cx={cx} cy={cy} r={r * 0.3} fill={color} />
        </g>
      );

    case "dot4":
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r} fill={color} />
          <circle cx={cx} cy={cy} r={r * 0.55} fill={bgColor} />
          <circle cx={cx} cy={cy} r={r * 0.28} fill={color} />
        </g>
      );

    case "heart":
      return (
        <path key={key} d={`M${cx} ${cy + r * 0.7} C${cx - r * 1.5} ${cy - r * 0.2} ${cx - r * 0.7} ${cy - r} ${cx} ${cy - r * 0.4} C${cx + r * 0.7} ${cy - r} ${cx + r * 1.5} ${cy - r * 0.2} ${cx} ${cy + r * 0.7}Z`} fill={color} />
      );

    case "rounded":
      return <rect key={key} x={cx - r} y={cy - r} width={size} height={size} rx={r * 0.4} fill={color} />;

    case "square2":
      return <rect key={key} x={cx - r * 0.85} y={cy - r * 0.85} width={size * 0.85} height={size * 0.85} stroke={color} strokeWidth={r * 0.3} fill="none" />;

    case "square3":
      return (
        <g key={key}>
          <rect x={cx - r * 0.85} y={cy - r * 0.85} width={size * 0.85} height={size * 0.85} rx={r * 0.15} stroke={color} strokeWidth={r * 0.25} fill="none" />
          <rect x={cx - r * 0.3} y={cy - r * 0.3} width={r * 0.6} height={r * 0.6} rx={r * 0.1} fill={color} />
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
        const x1 = cx + Math.cos(angle) * r * 0.55;
        const y1 = cy + Math.sin(angle) * r * 0.55;
        const x2 = cx + Math.cos(angle) * r * 0.9;
        const y2 = cy + Math.sin(angle) * r * 0.9;
        rays.push(<line key={`ray-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={r * 0.2} strokeLinecap="round" />);
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
          <rect x={cx - r} y={cy - r * 0.15} width={size} height={r * 0.3} transform={`rotate(45 ${cx} ${cy})`} fill={color} />
          <rect x={cx - r} y={cy - r * 0.15} width={size} height={r * 0.3} transform={`rotate(-45 ${cx} ${cy})`} fill={color} />
        </g>
      );

    case "x-rounded":
      return (
        <g key={key}>
          <rect x={cx - r} y={cy - r * 0.15} width={size} height={r * 0.3} rx={r * 0.15} transform={`rotate(45 ${cx} ${cy})`} fill={color} />
          <rect x={cx - r} y={cy - r * 0.15} width={size} height={r * 0.3} rx={r * 0.15} transform={`rotate(-45 ${cx} ${cy})`} fill={color} />
        </g>
      );

    default: // "default"
      return <rect key={key} x={cx - r} y={cy - r} width={size} height={size} rx={r * 0.2} fill={color} />;
  }
}

// ─── Check if position is in finder pattern area ─────────────────────────────

function isFinderPattern(row: number, col: number, size: number): boolean {
  const finderSize = 7;
  // Top-left
  if (row < finderSize && col < finderSize) return true;
  // Top-right
  if (row < finderSize && col >= size - finderSize) return true;
  // Bottom-left
  if (row >= size - finderSize && col < finderSize) return true;
  return false;
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
      { x: margin + finderSize / 2, y: margin + finderSize / 2 }, // Top-left
      { x: margin + (matrixSize - 3.5) * cellSize, y: margin + finderSize / 2 }, // Top-right
      { x: margin + finderSize / 2, y: margin + (matrixSize - 3.5) * cellSize }, // Bottom-left
    ];

    // Render finder patterns (corner squares)
    finderCenters.forEach((center, idx) => {
      elements.push(
        renderCornerSquare(
          cornersSquareType,
          center.x,
          center.y,
          finderSize,
          cornersSquareColor,
          cornersDotColor,
          `corner-${idx}`
        )
      );
    });

    return elements;
  }, [qrMatrix, size, dotsType, dotsColor, cornersSquareType, cornersSquareColor, cornersDotColor]);

  // Frame rendering
  const frameId = typeof design?.frameId === "number" ? design.frameId : -1;
  const hasFrame = frameId >= 0;
  const frameColor = design?.frameColor || "#7C3AED";
  const frameBgColor = design?.frameBackgroundColor || frameColor;
  const frameText = (design?.frameText || "Scan me!").slice(0, 30);
  const frameTextColor = design?.frameTextColor || "#FFFFFF";
  const fontSize = design?.frameFontSize || 14;

  // Frame style determination
  const getFrameStyle = (id: number) => {
    const textTop = [2, 5, 12, 15].includes(id);
    const textBoth = [3, 6, 8].includes(id);
    const isRounded = [4, 5, 6, 7, 10, 12, 14, 16, 30].includes(id);
    const isDashed = [9, 10, 11, 12, 29].includes(id);
    const isPill = [7, 8].includes(id);
    return { textTop, textBoth, isRounded, isDashed, isPill };
  };

  const frameStyle = getFrameStyle(frameId);
  const getBorderRadius = () => {
    if (frameStyle.isRounded) return "16px";
    if (frameStyle.isPill) return "24px";
    return "8px";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative overflow-hidden shadow-sm"
        style={{
          backgroundColor: backgroundColor === "transparent" ? "#f9fafb" : backgroundColor,
          padding: hasFrame ? "12px 12px 0 12px" : "12px",
          borderRadius: hasFrame ? getBorderRadius() : "12px",
          border: hasFrame && frameStyle.isDashed ? `2px dashed ${frameColor}` : "none",
        }}
      >
        {/* Top frame */}
        {hasFrame && frameStyle.textTop && (
          <div
            className="py-2 px-4 text-center font-bold -mx-3 -mt-3 mb-3"
            style={{
              backgroundColor: frameBgColor,
              color: frameTextColor,
              marginLeft: "-12px",
              marginRight: "-12px",
              marginTop: "-12px",
              borderTopLeftRadius: getBorderRadius(),
              borderTopRightRadius: getBorderRadius(),
              fontSize: `${Math.max(10, fontSize / 3)}px`,
            }}
          >
            {frameText}
          </div>
        )}

        {/* QR Code SVG */}
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ display: "block" }}
        >
          {/* Background */}
          <rect x="0" y="0" width={size} height={size} fill={backgroundColor} />

          {/* Logo support */}
          {design?.logo && (
            <defs>
              <clipPath id="logo-clip">
                <rect x={size * 0.35} y={size * 0.35} width={size * 0.3} height={size * 0.3} rx={size * 0.02} />
              </clipPath>
            </defs>
          )}

          {/* QR modules */}
          {svgContent}

          {/* Logo */}
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

        {/* Video player frame (frame 0) */}
        {frameId === 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 py-2 px-3 flex items-center gap-2"
            style={{ backgroundColor: `${frameColor}dd`, borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}
          >
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
              <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
            </div>
            <span className="text-xs font-medium truncate" style={{ color: frameTextColor }}>{frameText}</span>
          </div>
        )}

        {/* Bottom frame */}
        {hasFrame && frameId !== 0 && !frameStyle.textTop && (
          <div
            className="mt-3 py-2.5 px-4 text-center font-bold"
            style={{
              backgroundColor: frameBgColor,
              color: frameTextColor,
              marginLeft: "-12px",
              marginRight: "-12px",
              marginBottom: "0",
              borderBottomLeftRadius: getBorderRadius(),
              borderBottomRightRadius: getBorderRadius(),
              fontSize: `${Math.max(10, fontSize / 3)}px`,
            }}
          >
            {frameText}
          </div>
        )}

        {/* Both top and bottom */}
        {hasFrame && frameStyle.textBoth && (
          <div
            className="mt-3 py-2 px-4 text-center font-medium"
            style={{
              backgroundColor: frameBgColor,
              color: frameTextColor,
              marginLeft: "-12px",
              marginRight: "-12px",
              marginBottom: "0",
              borderBottomLeftRadius: getBorderRadius(),
              borderBottomRightRadius: getBorderRadius(),
              fontSize: `${Math.max(9, fontSize / 4)}px`,
            }}
          >
            {frameText}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
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
    // Convert SVG to PNG using canvas
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width * 2; // 2x for better quality
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
