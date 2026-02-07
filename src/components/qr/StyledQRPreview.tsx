"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

interface StyledQRPreviewProps {
  content: Record<string, any>;
  type: string;
  design: Record<string, any>;
  size?: number;
  onReady?: (qrCode: QRCodeStyling) => void;
}

// Convert content to a string for QR encoding
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

// Map dot style names to qr-code-styling types
type DotType = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";

const DOTS_TYPE_MAP: Record<string, DotType> = {
  square: "square",
  dots: "dots",
  dot: "dots",
  rounded: "rounded",
  "extra-rounded": "extra-rounded",
  classy: "classy",
  "classy-rounded": "classy-rounded",
  cross: "square",
  "cross-rounded": "rounded",
  diamond: "square",
  "diamond-special": "square",
  heart: "dots",
  "horizontal-rounded": "rounded",
  ribbon: "classy",
  shake: "dots",
  sparkle: "dots",
  star: "classy",
  "vertical-rounded": "rounded",
  x: "square",
  "x-rounded": "rounded",
};

// Map corner square style names
type CornerSquareType = "square" | "dot" | "extra-rounded";

const CORNER_SQUARE_MAP: Record<string, CornerSquareType> = {
  default: "square",
  dot: "dot",
  square: "square",
  "extra-rounded": "extra-rounded",
  shape1: "extra-rounded",
  shape2: "dot",
  shape3: "dot",
  shape4: "dot",
  shape5: "extra-rounded",
  rounded: "extra-rounded",
  classy: "extra-rounded",
};

// Map corner dot style names
type CornerDotType = "square" | "dot";

const CORNER_DOT_MAP: Record<string, CornerDotType> = {
  default: "square",
  dot: "dot",
  square: "square",
  rounded: "dot",
  "extra-rounded": "dot",
  classy: "dot",
};

export default function StyledQRPreview({
  content,
  type,
  design,
  size = 200,
  onReady,
}: StyledQRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const qrValue = contentToString(type, content);

  // Map design options
  const dotsType = DOTS_TYPE_MAP[design?.dotsType] || "square";
  const cornerSquareType = CORNER_SQUARE_MAP[design?.cornersSquareType] || "square";
  const cornerDotType = CORNER_DOT_MAP[design?.cornersDotType] || "square";

  const dotsColor = design?.dotsColor || "#000000";
  const backgroundColor = design?.bgTransparent ? "transparent" : (design?.backgroundColor || "#FFFFFF");
  const cornersSquareColor = design?.cornersSquareColor || dotsColor;
  const cornersDotColor = design?.cornersDotColor || dotsColor;

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);

    // Create QR code options
    const options: any = {
      width: size,
      height: size,
      margin: 10,
      data: qrValue,
      dotsOptions: {
        type: dotsType,
        color: dotsColor,
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: cornersSquareColor,
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: cornersDotColor,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      qrOptions: {
        errorCorrectionLevel: design?.errorCorrectionLevel || (design?.logo ? "H" : "M"),
      },
    };

    // Add gradient support
    if (design?.patternGradient && design?.patternColor2) {
      options.dotsOptions.gradient = {
        type: "linear",
        rotation: 45,
        colorStops: [
          { offset: 0, color: dotsColor },
          { offset: 1, color: design.patternColor2 },
        ],
      };
    }

    // Add logo if provided
    if (design?.logo) {
      options.image = design.logo;
      options.imageOptions = {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.4,
        hideBackgroundDots: true,
      };
    }

    // Create new QR code instance
    const qrCode = new QRCodeStyling(options);
    qrCodeRef.current = qrCode;

    // Clear container and append new QR code
    containerRef.current.innerHTML = "";
    qrCode.append(containerRef.current);

    setIsLoading(false);

    // Notify parent component
    if (onReady) {
      onReady(qrCode);
    }
  }, [
    qrValue,
    size,
    dotsType,
    dotsColor,
    cornerSquareType,
    cornersSquareColor,
    cornerDotType,
    cornersDotColor,
    backgroundColor,
    design?.patternGradient,
    design?.patternColor2,
    design?.logo,
    design?.errorCorrectionLevel,
    onReady,
  ]);

  // Frame rendering
  const frameId = typeof design?.frameId === "number" ? design.frameId : -1;
  const hasFrame = frameId > 0;
  const frameColor = design?.frameColor || "#7C3AED";
  const frameText = (design?.frameText || "Scan me!").slice(0, 30);
  const frameTextColor = design?.frameTextColor || "#FFFFFF";

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative rounded-xl overflow-hidden shadow-sm"
        style={{
          backgroundColor: backgroundColor === "transparent" ? "#f9fafb" : backgroundColor,
          padding: hasFrame ? "12px 12px 0 12px" : "12px",
        }}
      >
        {/* QR Code Container */}
        <div
          ref={containerRef}
          className="flex items-center justify-center"
          style={{ minWidth: size, minHeight: size }}
        />

        {/* Frame */}
        {hasFrame && (
          <div
            className="mt-3 py-3 px-4 text-center font-bold rounded-b-xl -mx-3 -mb-0"
            style={{
              backgroundColor: frameColor,
              color: frameTextColor,
              marginLeft: "-12px",
              marginRight: "-12px",
              marginBottom: "-0px",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
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

// Export a function to download QR code
export async function downloadQRCode(
  qrCode: QRCodeStyling,
  filename: string = "qrcode",
  format: "png" | "svg" | "jpeg" | "webp" = "png"
): Promise<void> {
  await qrCode.download({
    name: filename,
    extension: format,
  });
}

// Export a function to get QR code as blob
export async function getQRCodeBlob(
  qrCode: QRCodeStyling,
  format: "png" | "svg" | "jpeg" | "webp" = "png"
): Promise<Blob | null> {
  const data = await qrCode.getRawData(format);
  if (data instanceof Blob) return data;
  return null;
}
