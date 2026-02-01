"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import ColorPicker from "@/components/ui/ColorPicker";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";

const DOT_STYLES = ["square", "dot", "rounded", "extra-rounded", "classy", "classy-rounded", "diamond", "small-square", "tiny-square", "vertical-line", "horizontal-line", "random-dot", "star", "heart"];
const EYE_STYLES = ["square", "dot", "extra-rounded", "classy", "outpoint", "inpoint"];

export default function EditQRPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState<Record<string, any>>({});
  const [design, setDesign] = useState<any>({});
  const [qrType, setQrType] = useState("");
  const [saving, setSaving] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/qrcodes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name);
        setContent(data.content);
        setDesign(data.design || {});
        setQrType(data.type);
      })
      .catch(() => toast.error("Failed to load QR code"))
      .finally(() => setLoading(false));
  }, [id]);

  const generatePreview = useCallback(async () => {
    try {
      const { QRCodeStyling } = await import("@liquid-js/qr-code-styling");
      const qr = new QRCodeStyling({
        width: 256,
        height: 256,
        data: window.location.origin + "/r/preview",
        shape: (design.shape as "square" | "circle") || "square",
        dotsOptions: { color: design.dotsColor || "#000000", type: (design.dotsType || "square") as any },
        cornersSquareOptions: { color: design.cornersSquareColor || "#000000", type: (design.cornersSquareType || "square") as any },
        cornersDotOptions: { color: design.cornersDotColor || "#000000", type: (design.cornersDotType || "square") as any },
        backgroundOptions: { color: design.backgroundColor || "#FFFFFF" },
        image: design.logo || undefined,
      });
      const svgStr = await qr.serialize();
      if (svgStr) {
        const blob = new Blob([svgStr], { type: "image/svg+xml" });
        setQrDataUrl(URL.createObjectURL(blob));
      }
    } catch {}
  }, [design]);

  useEffect(() => {
    if (!loading) generatePreview();
  }, [loading, design, generatePreview]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/qrcodes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, design }),
      });
      if (res.ok) {
        toast.success("QR code updated!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit QR Code</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <p className="text-sm text-gray-500 mt-2">Type: {qrType}</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
            {qrType === "website" ? (
              <Input label="URL" value={content.url || ""} onChange={(e) => setContent({ ...content, url: e.target.value })} />
            ) : (
              <div className="space-y-3">
                {Object.entries(content).map(([key, value]) => (
                  <Input key={key} label={key} value={String(value || "")} onChange={(e) => setContent({ ...content, [key]: e.target.value })} />
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Design</h2>
            <div className="space-y-4">
              <ColorPicker label="Dots Color" value={design.dotsColor || "#000000"} onChange={(c) => setDesign({ ...design, dotsColor: c })} />
              <ColorPicker label="Background" value={design.backgroundColor || "#FFFFFF"} onChange={(c) => setDesign({ ...design, backgroundColor: c })} />
              <ColorPicker label="Eye Color" value={design.cornersSquareColor || "#000000"} onChange={(c) => setDesign({ ...design, cornersSquareColor: c, cornersDotColor: c })} />
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Dot Pattern</label>
                <div className="flex flex-wrap gap-2">
                  {DOT_STYLES.map((s) => (
                    <button key={s} onClick={() => setDesign({ ...design, dotsType: s })} className={"px-3 py-1.5 text-sm rounded-lg border " + (design.dotsType === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Eye Style</label>
                <div className="flex flex-wrap gap-2">
                  {EYE_STYLES.map((s) => (
                    <button key={s} onClick={() => setDesign({ ...design, cornersSquareType: s })} className={"px-3 py-1.5 text-sm rounded-lg border " + (design.cornersSquareType === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 min-h-[280px]">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Preview" className="w-64 h-64" />
              ) : (
                <Spinner />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
