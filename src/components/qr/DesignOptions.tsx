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

  // Pre-built pattern thumbnails matching QRFY's visual style
  switch (style) {
    case "square": // Style 1 - solid dense squares
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x =>
            (x + y) % 2 === 0 || (x === 2 && y === 2) ? null :
            <rect key={`${x}-${y}`} x={x*9.6} y={y*9.6} width="8" height="8" fill="currentColor" />
          ))}
        </svg>
      );
    case "rounded": // Style 2 - rounded squares
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x =>
            (x + y) % 2 === 0 || (x === 2 && y === 2) ? null :
            <rect key={`${x}-${y}`} x={x*9.6} y={y*9.6} width="8" height="8" rx="2" fill="currentColor" />
          ))}
        </svg>
      );
    case "dots": // Style 3 - circular dots
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x =>
            (x + y) % 2 === 0 || (x === 2 && y === 2) ? null :
            <circle key={`${x}-${y}`} cx={x*9.6+4} cy={y*9.6+4} r="3.5" fill="currentColor" />
          ))}
        </svg>
      );
    case "classy": // Style 4 - offset/staggered squares
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const offset = y % 2 === 0 ? 1 : -1;
            return <rect key={`${x}-${y}`} x={x*9.6+offset} y={y*9.6} width="7" height="8" fill="currentColor" />;
          }))}
        </svg>
      );
    case "classy-rounded": // Style 5 - offset rounded
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const offset = y % 2 === 0 ? 1 : -1;
            return <rect key={`${x}-${y}`} x={x*9.6+offset} y={y*9.6} width="7" height="8" rx="2" fill="currentColor" />;
          }))}
        </svg>
      );
    case "extra-rounded": // Style 6 - large circles
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x =>
            (x + y) % 2 === 0 || (x === 2 && y === 2) ? null :
            <circle key={`${x}-${y}`} cx={x*9.6+4} cy={y*9.6+4} r="4.5" fill="currentColor" />
          ))}
        </svg>
      );
    case "cross": // Style 7 - plus/cross shapes
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4;
            return <g key={`${x}-${y}`}>
              <rect x={cx-1.5} y={cy-4} width="3" height="8" fill="currentColor" />
              <rect x={cx-4} y={cy-1.5} width="8" height="3" fill="currentColor" />
            </g>;
          }))}
        </svg>
      );
    case "cross-rounded": // Style 8 - rounded plus shapes
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4;
            return <g key={`${x}-${y}`}>
              <rect x={cx-1.5} y={cy-4} width="3" height="8" rx="1" fill="currentColor" />
              <rect x={cx-4} y={cy-1.5} width="8" height="3" rx="1" fill="currentColor" />
            </g>;
          }))}
        </svg>
      );
    case "diamond": // Style 9 - diamond shapes
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4;
            return <polygon key={`${x}-${y}`} points={`${cx},${cy-4} ${cx+4},${cy} ${cx},${cy+4} ${cx-4},${cy}`} fill="currentColor" />;
          }))}
        </svg>
      );
    case "diamond-special": // Style 10 - diamond with dot
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4;
            return <g key={`${x}-${y}`}>
              <polygon points={`${cx},${cy-4} ${cx+4},${cy} ${cx},${cy+4} ${cx-4},${cy}`} fill="currentColor" />
              <circle cx={cx} cy={cy} r="1" fill="white" />
            </g>;
          }))}
        </svg>
      );
    case "heart": // Style 11 - heart shapes
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4;
            return <path key={`${x}-${y}`} d={`M${cx} ${cy+3} C${cx-4} ${cy} ${cx-2} ${cy-3} ${cx} ${cy-1} C${cx+2} ${cy-3} ${cx+4} ${cy} ${cx} ${cy+3}Z`} fill="currentColor" />;
          }))}
        </svg>
      );
    case "horizontal-rounded": // Style 12 - horizontal bars
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x =>
            (x + y) % 2 === 0 ? null :
            <rect key={`${x}-${y}`} x={x*9.6-1} y={y*9.6+2} width="10" height="4" rx="2" fill="currentColor" />
          ))}
        </svg>
      );
    case "vertical-rounded": // Style 13 - vertical bars
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x =>
            (x + y) % 2 === 0 ? null :
            <rect key={`${x}-${y}`} x={x*9.6+2} y={y*9.6-1} width="4" height="10" rx="2" fill="currentColor" />
          ))}
        </svg>
      );
    case "ribbon": // Style 14 - double horizontal lines
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            return <g key={`${x}-${y}`}>
              <rect x={x*9.6} y={y*9.6} width="8" height="3" rx="1" fill="currentColor" />
              <rect x={x*9.6} y={y*9.6+5} width="8" height="3" rx="1" fill="currentColor" />
            </g>;
          }))}
        </svg>
      );
    case "shake": // Style 15 - offset squares
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const offsetX = (x + y) % 4 === 1 ? 1 : -1;
            const offsetY = (x + y) % 4 === 3 ? 1 : -1;
            return <rect key={`${x}-${y}`} x={x*9.6+offsetX} y={y*9.6+offsetY} width="7" height="7" fill="currentColor" />;
          }))}
        </svg>
      );
    case "sparkle": // Style 16 - 4-point star/sparkle
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4;
            return <polygon key={`${x}-${y}`} points={`${cx},${cy-4} ${cx+1.5},${cy-1.5} ${cx+4},${cy} ${cx+1.5},${cy+1.5} ${cx},${cy+4} ${cx-1.5},${cy+1.5} ${cx-4},${cy} ${cx-1.5},${cy-1.5}`} fill="currentColor" />;
          }))}
        </svg>
      );
    case "star": // Style 17 - 5-point stars
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4, r = 4;
            const pts = [];
            for (let i = 0; i < 5; i++) {
              const a1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
              const a2 = a1 + Math.PI / 5;
              pts.push(`${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r}`);
              pts.push(`${cx + Math.cos(a2) * r * 0.4},${cy + Math.sin(a2) * r * 0.4}`);
            }
            return <polygon key={`${x}-${y}`} points={pts.join(" ")} fill="currentColor" />;
          }))}
        </svg>
      );
    case "x": // Style 18 - X shapes
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4;
            return <g key={`${x}-${y}`}>
              <rect x={cx-4} y={cy-1} width="8" height="2" transform={`rotate(45 ${cx} ${cy})`} fill="currentColor" />
              <rect x={cx-4} y={cy-1} width="8" height="2" transform={`rotate(-45 ${cx} ${cy})`} fill="currentColor" />
            </g>;
          }))}
        </svg>
      );
    case "x-rounded": // Style 19 - rounded X shapes
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x => {
            if ((x + y) % 2 === 0) return null;
            const cx = x*9.6+4, cy = y*9.6+4;
            return <g key={`${x}-${y}`}>
              <rect x={cx-4} y={cy-1} width="8" height="2" rx="1" transform={`rotate(45 ${cx} ${cy})`} fill="currentColor" />
              <rect x={cx-4} y={cy-1} width="8" height="2" rx="1" transform={`rotate(-45 ${cx} ${cy})`} fill="currentColor" />
            </g>;
          }))}
        </svg>
      );
    default: // Fallback - square pattern
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          {[0,1,2,3,4].map(y => [0,1,2,3,4].map(x =>
            (x + y) % 2 === 0 ? null :
            <rect key={`${x}-${y}`} x={x*9.6} y={y*9.6} width="8" height="8" fill="currentColor" />
          ))}
        </svg>
      );
  }
}

// Border style SVGs matching QRFY's actual renders from screenshot
function CornerSquareSVG({ style }: { style: string }) {
  const s = 48;
  switch (style) {
    case "default": // Border 1 - solid square
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" stroke="currentColor" strokeWidth="6" fill="none" />
          <rect x="16" y="16" width="16" height="16" fill="currentColor" />
        </svg>
      );
    case "dot": // Border 2 - circle
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
          <circle cx="24" cy="24" r="8" fill="currentColor" />
        </svg>
      );
    case "square": // Border 3 - small rounded square
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="2" fill="currentColor" />
        </svg>
      );
    case "extra-rounded": // Border 4 - medium rounded
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="10" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="4" fill="currentColor" />
        </svg>
      );
    case "shape1": // Border 5 - large rounded (almost pill)
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="16" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="6" fill="currentColor" />
        </svg>
      );
    case "shape2": // Border 6 - pill/capsule horizontal
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="2" y="10" width="44" height="28" rx="14" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="16" y="18" width="16" height="12" rx="6" fill="currentColor" />
        </svg>
      );
    case "shape3": // Border 7 - leaf/pointed rounded
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <path d="M24 4 Q44 4 44 24 Q44 44 24 44 Q4 44 4 24 Q4 4 24 4" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="4" fill="currentColor" />
        </svg>
      );
    case "shape4": // Border 8 - diamond
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <polygon points="24,4 44,24 24,44 4,24" stroke="currentColor" strokeWidth="4" fill="none" />
          <polygon points="24,16 32,24 24,32 16,24" fill="currentColor" />
        </svg>
      );
    case "shape5": // Border 9 - hexagon
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <polygon points="14,4 34,4 44,24 34,44 14,44 4,24" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="2" fill="currentColor" />
        </svg>
      );
    case "shape6": // Border 10 - octagon
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <polygon points="16,4 32,4 44,16 44,32 32,44 16,44 4,32 4,16" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="2" fill="currentColor" />
        </svg>
      );
    case "shape7": // Border 11 - star-like
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="20" stroke="currentColor" strokeWidth="5" fill="none" />
          <circle cx="24" cy="24" r="8" fill="currentColor" />
        </svg>
      );
    case "shape8": // Border 12 - clover/flower
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="0" stroke="currentColor" strokeWidth="5" fill="none" />
          <circle cx="24" cy="24" r="10" fill="currentColor" />
        </svg>
      );
    case "shape9": // Border 13 - double border
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="3" fill="none" />
          <rect x="10" y="10" width="28" height="28" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="18" y="18" width="12" height="12" fill="currentColor" />
        </svg>
      );
    case "shape10": // Border 14 - concentric circles
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="24" cy="24" r="13" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="24" cy="24" r="6" fill="currentColor" />
        </svg>
      );
    case "shape11": // Border 15 - rounded with inner
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="4" fill="none" />
          <rect x="12" y="12" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="18" y="18" width="12" height="12" rx="2" fill="currentColor" />
        </svg>
      );
    case "shape12": // Border 16 - frame style
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="6" fill="none" />
          <rect x="14" y="14" width="20" height="20" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="20" y="20" width="8" height="8" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="16" y="16" width="16" height="16" fill="currentColor" />
        </svg>
      );
  }
}

// Center style SVGs matching QRFY's actual renders from screenshot
function CornerDotSVG({ style }: { style: string }) {
  const s = 48;
  switch (style) {
    case "default": // Center 1 - solid square
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="12" y="12" width="24" height="24" fill="currentColor" />
        </svg>
      );
    case "dot": // Center 2 - horizontal oval/pill
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="8" y="16" width="32" height="16" rx="8" fill="currentColor" />
        </svg>
      );
    case "rounded": // Center 3 - rounded square
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="12" y="12" width="24" height="24" rx="6" fill="currentColor" />
        </svg>
      );
    case "dot2": // Center 4 - circle
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="12" fill="currentColor" />
        </svg>
      );
    case "dot3": // Center 5 - donut/ring
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="12" fill="currentColor" />
          <circle cx="24" cy="24" r="5" fill="white" />
        </svg>
      );
    case "dot4": // Center 6 - smaller filled circle
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="9" fill="currentColor" />
        </svg>
      );
    case "star": { // Center 7 - 5-point star
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
    case "diamond": // Center 8 - diamond
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <polygon points="24,8 40,24 24,40 8,24" fill="currentColor" />
        </svg>
      );
    case "x": // Center 9 - X rotated
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="10" y="21" width="28" height="6" transform="rotate(45 24 24)" fill="currentColor" />
          <rect x="10" y="21" width="28" height="6" transform="rotate(-45 24 24)" fill="currentColor" />
        </svg>
      );
    case "cross": // Center 10 - plus/cross
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="20" y="8" width="8" height="32" fill="currentColor" />
          <rect x="8" y="20" width="32" height="8" fill="currentColor" />
        </svg>
      );
    case "sun": { // Center 11 - sun/burst with rays
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
    case "square2": // Center 12 - 4 dots pattern
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="16" cy="16" r="5" fill="currentColor" />
          <circle cx="32" cy="16" r="5" fill="currentColor" />
          <circle cx="16" cy="32" r="5" fill="currentColor" />
          <circle cx="32" cy="32" r="5" fill="currentColor" />
        </svg>
      );
    case "square3": // Center 13 - ring outline
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      );
    case "cross-rounded": // Center 14 - small dots grid
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="16" cy="16" r="3" fill="currentColor" />
          <circle cx="24" cy="16" r="3" fill="currentColor" />
          <circle cx="32" cy="16" r="3" fill="currentColor" />
          <circle cx="16" cy="24" r="3" fill="currentColor" />
          <circle cx="24" cy="24" r="3" fill="currentColor" />
          <circle cx="32" cy="24" r="3" fill="currentColor" />
          <circle cx="16" cy="32" r="3" fill="currentColor" />
          <circle cx="24" cy="32" r="3" fill="currentColor" />
          <circle cx="32" cy="32" r="3" fill="currentColor" />
        </svg>
      );
    case "x-rounded": // Center 15 - dots with center
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="6" fill="currentColor" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <circle cx="36" cy="12" r="4" fill="currentColor" />
          <circle cx="12" cy="36" r="4" fill="currentColor" />
          <circle cx="36" cy="36" r="4" fill="currentColor" />
        </svg>
      );
    case "heart": // Center 16 - heart
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <path d="M24 38 C12 28 4 20 4 14 C4 8 9 4 14 4 C18 4 22 7 24 10 C26 7 30 4 34 4 C39 4 44 8 44 14 C44 20 36 28 24 38Z" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="12" y="12" width="24" height="24" fill="currentColor" />
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
