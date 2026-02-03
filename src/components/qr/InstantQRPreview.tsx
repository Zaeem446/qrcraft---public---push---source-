"use client";

import { QRCodeSVG } from "qrcode.react";
import { useMemo } from "react";

interface InstantQRPreviewProps {
  content: Record<string, any>;
  type: string;
  design: Record<string, any>;
  size?: number;
}

// Convert content to a string for QR encoding
function contentToString(type: string, content: Record<string, any>): string {
  switch (type) {
    case "website":
    case "video":
    case "instagram":
    case "facebook":
      return content?.url || "https://example.com";
    case "vcard":
      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${content?.lastName || ""};${content?.firstName || ""}`,
        `FN:${[content?.firstName, content?.lastName].filter(Boolean).join(" ") || "Name"}`,
        content?.company ? `ORG:${content.company}` : "",
        content?.title ? `TITLE:${content.title}` : "",
        content?.phone ? `TEL:${content.phone}` : "",
        content?.email ? `EMAIL:${content.email}` : "",
        content?.website ? `URL:${content.website}` : "",
        content?.address ? `ADR:;;${content.address}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
      return vcard;
    case "wifi":
      return `WIFI:T:${content?.encryption || "WPA"};S:${content?.ssid || "Network"};P:${content?.password || ""};;`;
    case "email":
      return `mailto:${content?.email || ""}?subject=${encodeURIComponent(content?.subject || "")}&body=${encodeURIComponent(content?.body || "")}`;
    case "sms":
      return `sms:${content?.phone || ""}?body=${encodeURIComponent(content?.message || "")}`;
    case "phone":
      return `tel:${content?.phone || ""}`;
    case "text":
      return content?.text || "Sample text";
    case "whatsapp":
      return `https://wa.me/${(content?.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(content?.message || "")}`;
    case "bitcoin":
      return `bitcoin:${content?.address || ""}?amount=${content?.amount || 0}`;
    default:
      // For dynamic types, use a placeholder URL
      return content?.url || "https://qrcraft.app/qr/preview";
  }
}

export default function InstantQRPreview({ content, type, design, size = 180 }: InstantQRPreviewProps) {
  const qrValue = useMemo(() => contentToString(type, content), [type, content]);

  // Map design options to qrcode.react props
  const fgColor = design?.dotsColor || "#000000";
  const bgColor = design?.bgTransparent ? "transparent" : (design?.backgroundColor || "#FFFFFF");

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{ backgroundColor: bgColor === "transparent" ? "#f9fafb" : bgColor }}
      >
        <QRCodeSVG
          value={qrValue}
          size={size}
          bgColor={bgColor === "transparent" ? "transparent" : bgColor}
          fgColor={fgColor}
          level={design?.errorCorrectionLevel || "M"}
          includeMargin={false}
        />
      </div>
    </div>
  );
}
