"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import ColorPicker from "@/components/ui/ColorPicker";
import { QR_TYPES } from "@/lib/utils";
import toast from "react-hot-toast";

const DOT_STYLES = ["square", "dots", "rounded", "extra-rounded", "classy", "classy-rounded"];
const EYE_STYLES = ["square", "dot", "extra-rounded"];

type FormContent = Record<string, any>;

export default function CreateQRPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [qrType, setQrType] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState<FormContent>({});
  const [design, setDesign] = useState({
    dotsColor: "#000000",
    dotsType: "square",
    cornersSquareColor: "#000000",
    cornersSquareType: "square",
    cornersDotColor: "#000000",
    cornersDotType: "square",
    backgroundColor: "#FFFFFF",
    logo: "",
    logoSize: 0.3,
    logoMargin: 5,
    frameStyle: "",
    frameColor: "#000000",
    frameText: "",
    frameTextColor: "#FFFFFF",
  });
  const [saving, setSaving] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const generatePreview = useCallback(async () => {
    if (!qrType || Object.keys(content).length === 0) return;
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      const baseUrl = window.location.origin;
      const previewUrl = baseUrl + "/r/preview";
      const qr = new QRCodeStyling({
        width: 256,
        height: 256,
        data: previewUrl,
        dotsOptions: { color: design.dotsColor, type: design.dotsType as any },
        cornersSquareOptions: { color: design.cornersSquareColor, type: design.cornersSquareType as any },
        cornersDotOptions: { color: design.cornersDotColor, type: design.cornersDotType as any },
        backgroundOptions: { color: design.backgroundColor },
        imageOptions: { crossOrigin: "anonymous", margin: design.logoMargin },
        image: design.logo || undefined,
      });

      const blob = await qr.getRawData("png");
      if (blob) {
        const blobObj = blob instanceof Blob ? blob : new Blob([new Uint8Array(blob as any)], { type: "image/png" });
        const url = URL.createObjectURL(blobObj);
        setQrDataUrl(url);
      }
    } catch (e) {
      console.error("QR preview error:", e);
    }
  }, [qrType, content, design]);

  useEffect(() => {
    if (step >= 3) generatePreview();
  }, [step, design, generatePreview]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for your QR code");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: qrType, content, design }),
      });
      if (res.ok) {
        toast.success("QR code created!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create QR code");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setSaving(false);
  };

  const handleDownload = async (format: "png" | "svg" | "jpeg") => {
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      const baseUrl = window.location.origin;
      const qr = new QRCodeStyling({
        width: 1024,
        height: 1024,
        data: baseUrl + "/r/preview",
        dotsOptions: { color: design.dotsColor, type: design.dotsType as any },
        cornersSquareOptions: { color: design.cornersSquareColor, type: design.cornersSquareType as any },
        cornersDotOptions: { color: design.cornersDotColor, type: design.cornersDotType as any },
        backgroundOptions: { color: design.backgroundColor },
        imageOptions: { crossOrigin: "anonymous", margin: design.logoMargin },
        image: design.logo || undefined,
      });
      qr.download({ name: name || "qrcode", extension: format === "jpeg" ? "jpeg" : format });
    } catch {
      toast.error("Download failed");
    }
  };

  const renderContentForm = () => {
    switch (qrType) {
      case "website":
        return (
          <div className="space-y-4">
            <Input label="Website URL" placeholder="https://example.com" value={content.url || ""} onChange={(e) => setContent({ ...content, url: e.target.value })} />
          </div>
        );
      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={content.firstName || ""} onChange={(e) => setContent({ ...content, firstName: e.target.value })} />
              <Input label="Last Name" value={content.lastName || ""} onChange={(e) => setContent({ ...content, lastName: e.target.value })} />
            </div>
            <Input label="Phone" value={content.phone || ""} onChange={(e) => setContent({ ...content, phone: e.target.value })} />
            <Input label="Email" type="email" value={content.email || ""} onChange={(e) => setContent({ ...content, email: e.target.value })} />
            <Input label="Organization" value={content.org || ""} onChange={(e) => setContent({ ...content, org: e.target.value })} />
            <Input label="Title" value={content.title || ""} onChange={(e) => setContent({ ...content, title: e.target.value })} />
            <Input label="Website" value={content.website || ""} onChange={(e) => setContent({ ...content, website: e.target.value })} />
            <Input label="Address" value={content.address || ""} onChange={(e) => setContent({ ...content, address: e.target.value })} />
          </div>
        );
      case "wifi":
        return (
          <div className="space-y-4">
            <Input label="Network Name (SSID)" value={content.ssid || ""} onChange={(e) => setContent({ ...content, ssid: e.target.value })} />
            <Input label="Password" value={content.password || ""} onChange={(e) => setContent({ ...content, password: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
              <select value={content.encryption || "WPA"} onChange={(e) => setContent({ ...content, encryption: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
          </div>
        );
      case "email":
        return (
          <div className="space-y-4">
            <Input label="Email Address" type="email" value={content.email || ""} onChange={(e) => setContent({ ...content, email: e.target.value })} />
            <Input label="Subject" value={content.subject || ""} onChange={(e) => setContent({ ...content, subject: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea value={content.message || ""} onChange={(e) => setContent({ ...content, message: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} />
            </div>
          </div>
        );
      case "sms":
        return (
          <div className="space-y-4">
            <Input label="Phone Number" value={content.phone || ""} onChange={(e) => setContent({ ...content, phone: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea value={content.message || ""} onChange={(e) => setContent({ ...content, message: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} />
            </div>
          </div>
        );
      case "whatsapp":
        return (
          <div className="space-y-4">
            <Input label="Phone Number (with country code)" placeholder="+1234567890" value={content.phone || ""} onChange={(e) => setContent({ ...content, phone: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pre-filled Message</label>
              <textarea value={content.message || ""} onChange={(e) => setContent({ ...content, message: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
            </div>
          </div>
        );
      case "event":
        return (
          <div className="space-y-4">
            <Input label="Event Name" value={content.title || ""} onChange={(e) => setContent({ ...content, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="datetime-local" value={content.startDate || ""} onChange={(e) => setContent({ ...content, startDate: e.target.value })} />
              <Input label="End Date" type="datetime-local" value={content.endDate || ""} onChange={(e) => setContent({ ...content, endDate: e.target.value })} />
            </div>
            <Input label="Location" value={content.location || ""} onChange={(e) => setContent({ ...content, location: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={content.description || ""} onChange={(e) => setContent({ ...content, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
            </div>
          </div>
        );
      case "coupon":
        return (
          <div className="space-y-4">
            <Input label="Coupon Title" value={content.title || ""} onChange={(e) => setContent({ ...content, title: e.target.value })} />
            <Input label="Discount" placeholder="20% OFF" value={content.discount || ""} onChange={(e) => setContent({ ...content, discount: e.target.value })} />
            <Input label="Coupon Code" value={content.code || ""} onChange={(e) => setContent({ ...content, code: e.target.value })} />
            <Input label="Expiry Date" type="date" value={content.expiryDate || ""} onChange={(e) => setContent({ ...content, expiryDate: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea value={content.terms || ""} onChange={(e) => setContent({ ...content, terms: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <Input label="URL or Content" placeholder="Enter URL or content" value={content.url || ""} onChange={(e) => setContent({ ...content, url: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={content.description || ""} onChange={(e) => setContent({ ...content, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Optional description" />
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create QR Code</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["Type", "Content", "Design", "Download"].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={"flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium " + (step > i + 1 ? "bg-green-100 text-green-700" : step === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500")}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={"ml-2 text-sm hidden sm:inline " + (step === i + 1 ? "text-gray-900 font-medium" : "text-gray-500")}>{label}</span>
            {i < 3 && <div className="w-8 sm:w-16 h-px bg-gray-300 mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Type Selection */}
          {step === 1 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select QR Code Type</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {QR_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setQrType(type.id); setStep(2); }}
                    className={"p-4 rounded-xl border-2 text-center transition-all hover:border-blue-400 hover:shadow-sm " + (qrType === type.id ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                  >
                    <p className="text-sm font-medium text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Step 2: Content */}
          {step === 2 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Content</h2>
              <div className="mb-4">
                <Input label="QR Code Name" placeholder="My QR Code" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              {renderContentForm()}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Next: Design</Button>
              </div>
            </Card>
          )}

          {/* Step 3: Design */}
          {step === 3 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customize Design</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Colors</h3>
                  <div className="space-y-3">
                    <ColorPicker label="Dots Color" value={design.dotsColor} onChange={(c) => setDesign({ ...design, dotsColor: c })} />
                    <ColorPicker label="Background" value={design.backgroundColor} onChange={(c) => setDesign({ ...design, backgroundColor: c })} />
                    <ColorPicker label="Eye Color" value={design.cornersSquareColor} onChange={(c) => setDesign({ ...design, cornersSquareColor: c, cornersDotColor: c })} />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Dot Pattern</h3>
                  <div className="flex flex-wrap gap-2">
                    {DOT_STYLES.map((s) => (
                      <button key={s} onClick={() => setDesign({ ...design, dotsType: s })} className={"px-3 py-1.5 text-sm rounded-lg border transition-all " + (design.dotsType === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Eye Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {EYE_STYLES.map((s) => (
                      <button key={s} onClick={() => setDesign({ ...design, cornersSquareType: s })} className={"px-3 py-1.5 text-sm rounded-lg border transition-all " + (design.cornersSquareType === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Logo</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                      const data = await res.json();
                      if (data.url) setDesign({ ...design, logo: data.url });
                    }}
                    className="text-sm text-gray-600"
                  />
                  {design.logo && <p className="text-xs text-green-600 mt-1">Logo uploaded</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Next: Download</Button>
              </div>
            </Card>
          )}

          {/* Step 4: Download */}
          {step === 4 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Download & Save</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" onClick={() => handleDownload("png")}>Download PNG</Button>
                  <Button variant="outline" onClick={() => handleDownload("svg")}>Download SVG</Button>
                  <Button variant="outline" onClick={() => handleDownload("jpeg")}>Download JPG</Button>
                </div>
                <hr />
                <Button onClick={handleSave} isLoading={saving} className="w-full">
                  Save QR Code
                </Button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              </div>
            </Card>
          )}
        </div>

        {/* Preview panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
            <div ref={qrRef} className="flex justify-center items-center bg-gray-50 rounded-lg p-4 min-h-[280px]">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Preview" className="w-64 h-64" />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                    <p className="text-sm">QR preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
            {name && <p className="text-center text-sm text-gray-600 mt-3">{name}</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}
