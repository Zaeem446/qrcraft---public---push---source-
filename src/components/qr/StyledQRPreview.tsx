"use client";

import { useEffect, useRef, useState } from "react";

// QRCodeStyling type - we import the actual module dynamically
type QRCodeStylingType = import("qr-code-styling").default;

interface StyledQRPreviewProps {
  content: Record<string, any>;
  type: string;
  design: Record<string, any>;
  size?: number;
  onReady?: (qrCode: QRCodeStylingType) => void;
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
// qr-code-styling supports: "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded"
type DotType = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";

// Comprehensive mapping for all 19 UI patterns to the 6 available library options
const DOTS_TYPE_MAP: Record<string, DotType> = {
  // Direct mappings (these exist in qr-code-styling)
  square: "square",
  dots: "dots",
  rounded: "rounded",
  "extra-rounded": "extra-rounded",
  classy: "classy",
  "classy-rounded": "classy-rounded",
  // Approximate mappings for styles that don't exist
  cross: "square",           // Cross pattern -> square (angular)
  "cross-rounded": "rounded", // Rounded cross -> rounded
  diamond: "classy",         // Diamond -> classy (sharp edges)
  "diamond-special": "classy-rounded", // Diamond special -> classy-rounded
  heart: "dots",             // Heart -> dots (rounded)
  "horizontal-rounded": "extra-rounded", // Horizontal rounded -> extra-rounded
  "vertical-rounded": "extra-rounded",   // Vertical rounded -> extra-rounded
  ribbon: "classy",          // Ribbon -> classy (decorative)
  shake: "square",           // Shake (offset squares) -> square
  sparkle: "dots",           // Sparkle (star-like points) -> dots
  star: "classy-rounded",    // Star (5-point) -> classy-rounded
  x: "square",               // X pattern -> square (angular)
  "x-rounded": "rounded",    // X rounded -> rounded
  // Fallback
  dot: "dots",
};

// Map corner square style names
// qr-code-styling supports: "square" | "dot" | "extra-rounded"
type CornerSquareType = "square" | "dot" | "extra-rounded";

// Comprehensive mapping for all 16 UI corner square styles to the 3 available options
const CORNER_SQUARE_MAP: Record<string, CornerSquareType> = {
  // Direct mappings
  default: "square",
  square: "square",
  dot: "dot",
  "extra-rounded": "extra-rounded",
  // Shape mappings based on visual appearance
  shape1: "extra-rounded",   // Rounded outer with circle dot
  shape2: "square",          // Square outer with diamond inner
  shape3: "dot",             // Diamond outer with square inner
  shape4: "dot",             // Circle outer with rounded inner
  shape5: "extra-rounded",   // Rounded outer with diamond inner
  shape6: "extra-rounded",   // Square + circle + dot concentric
  shape7: "dot",             // Full circle (pill shape)
  shape8: "square",          // Square outer with circle inner
  shape9: "extra-rounded",   // Rounded double border
  shape10: "dot",            // Double circle concentric
  shape11: "extra-rounded",  // Pill/capsule shape
  shape12: "dot",            // Diamond outer with circle inner
  // Extra
  rounded: "extra-rounded",
  classy: "extra-rounded",
};

// Map corner dot style names
// qr-code-styling supports: "square" | "dot"
type CornerDotType = "square" | "dot";

// Comprehensive mapping for all 17 UI corner dot styles to the 2 available options
const CORNER_DOT_MAP: Record<string, CornerDotType> = {
  // Direct mappings
  default: "square",
  square: "square",
  dot: "dot",
  // Shape mappings based on visual appearance (round vs angular)
  cross: "square",           // Cross -> square (angular)
  "cross-rounded": "dot",    // Rounded cross -> dot (rounded)
  diamond: "square",         // Diamond -> square (angular)
  dot2: "dot",               // Dot with ring -> dot
  dot3: "dot",               // Dot outline -> dot
  dot4: "dot",               // Dot target (concentric) -> dot
  heart: "dot",              // Heart -> dot (rounded)
  rounded: "dot",            // Rounded square -> dot
  square2: "square",         // Square outline -> square
  square3: "square",         // Square with dot -> square
  star: "square",            // Star (5-point) -> square (angular points)
  sun: "dot",                // Sun (circle with rays) -> dot
  x: "square",               // X -> square (angular)
  "x-rounded": "dot",        // X rounded -> dot
  // Fallback
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
  const qrCodeRef = useRef<QRCodeStylingType | null>(null);
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

    let mounted = true;
    setIsLoading(true);

    // Dynamically import qr-code-styling
    import("qr-code-styling").then((module) => {
      if (!mounted || !containerRef.current) return;

      const QRCodeStyling = module.default;

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
      containerRef.current!.innerHTML = "";
      qrCode.append(containerRef.current!);

      setIsLoading(false);

      // Notify parent component
      if (onReady) {
        onReady(qrCode);
      }
    }).catch(err => {
      console.error("Failed to load qr-code-styling:", err);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
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
  const hasFrame = frameId >= 0; // frameId 0 is video player frame, -1 is no frame
  const frameColor = design?.frameColor || "#7C3AED";
  const frameBgColor = design?.frameBackgroundColor || frameColor;
  const frameText = (design?.frameText || "Scan me!").slice(0, 30);
  const frameTextColor = design?.frameTextColor || "#FFFFFF";
  const fontSize = design?.frameFontSize || 14;

  // Determine frame style based on frameId
  const getFrameStyle = (id: number) => {
    // Group frames by visual characteristics
    // Text position: bottom (1,4,7), top (2,5), both (3,6,8)
    // Shape: square (1-3,9,11,13,15), rounded (4-6,10,12,14,16), special shapes (17-30)
    // Border: solid, dashed (9-12), double (13-14)

    const textTop = [2, 5, 12, 15].includes(id);
    const textBoth = [3, 6, 8].includes(id);
    const isRounded = [4, 5, 6, 7, 10, 12, 14, 16, 30].includes(id);
    const isDashed = [9, 10, 11, 12, 29].includes(id);
    const isPill = [7, 8].includes(id);

    return { textTop, textBoth, isRounded, isDashed, isPill };
  };

  const frameStyle = getFrameStyle(frameId);

  // Compute border radius based on frame style
  const getBorderRadius = () => {
    if (frameStyle.isRounded) return "16px";
    if (frameStyle.isPill) return "24px";
    return "8px";
  };

  // Render frame wrapper with appropriate styling
  const renderFrame = () => {
    if (!hasFrame) return null;

    const borderRadius = getBorderRadius();
    const borderStyle = frameStyle.isDashed ? "dashed" : "solid";

    // For frame 0 (video player), show a play button overlay style
    if (frameId === 0) {
      return (
        <div
          className="absolute bottom-0 left-0 right-0 py-2 px-3 flex items-center gap-2"
          style={{ backgroundColor: `${frameColor}dd` }}
        >
          <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
          </div>
          <span className="text-xs font-medium" style={{ color: frameTextColor }}>{frameText}</span>
        </div>
      );
    }

    // Text at top only
    if (frameStyle.textTop) {
      return (
        <>
          <div
            className="py-2 px-4 text-center font-bold"
            style={{
              backgroundColor: frameBgColor,
              color: frameTextColor,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              fontSize: `${Math.max(10, fontSize / 3)}px`,
              borderStyle,
              borderWidth: frameStyle.isDashed ? "2px" : "0",
              borderColor: frameColor,
              borderBottom: "none",
            }}
          >
            {frameText}
          </div>
        </>
      );
    }

    // Text at both top and bottom
    if (frameStyle.textBoth) {
      return (
        <>
          <div
            className="py-1.5 px-4 text-center font-medium text-xs"
            style={{
              backgroundColor: frameBgColor,
              color: frameTextColor,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            }}
          >
            {frameText}
          </div>
        </>
      );
    }

    // Default: text at bottom (most common)
    return null;
  };

  // Bottom frame text (for most frame types)
  const renderBottomFrame = () => {
    if (!hasFrame || frameId === 0) return null;
    if (frameStyle.textTop && !frameStyle.textBoth) return null;

    const borderRadius = getBorderRadius();

    return (
      <div
        className="py-2.5 px-4 text-center font-bold"
        style={{
          backgroundColor: frameBgColor,
          color: frameTextColor,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
          fontSize: `${Math.max(10, fontSize / 3)}px`,
          marginLeft: "-12px",
          marginRight: "-12px",
          marginBottom: "0",
        }}
      >
        {frameText}
      </div>
    );
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
        {/* Top frame element */}
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

        {/* QR Code Container */}
        <div
          ref={containerRef}
          className="flex items-center justify-center"
          style={{ minWidth: size, minHeight: size }}
        />

        {/* Video player frame overlay (frame 0) */}
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

        {/* Bottom frame text */}
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

        {/* Both top and bottom (for frames 3, 6, 8) */}
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

// Export a function to download QR code
export async function downloadQRCode(
  qrCode: QRCodeStylingType,
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
  qrCode: QRCodeStylingType,
  format: "png" | "svg" | "jpeg" | "webp" = "png"
): Promise<Blob | null> {
  const data = await qrCode.getRawData(format);
  if (data instanceof Blob) return data;
  return null;
}
