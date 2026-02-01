"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import ColorPicker from "@/components/ui/ColorPicker";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";

const QRFY_SHAPE_STYLES = [
  "square", "rounded", "dots", "classy", "classy-rounded", "extra-rounded",
  "cross", "cross-rounded", "diamond", "diamond-special", "heart",
  "horizontal-rounded", "ribbon", "shake", "sparkle", "star",
  "vertical-rounded", "x", "x-rounded",
];

const QRFY_CORNER_SQUARE_STYLES = [
  "default", "dot", "square", "extra-rounded",
  "shape1", "shape2", "shape3", "shape4", "shape5", "shape6",
  "shape7", "shape8", "shape9", "shape10", "shape11", "shape12",
];

const QRFY_CORNER_DOT_STYLES = [
  "default", "dot", "square", "cross", "cross-rounded", "diamond",
  "dot2", "dot3", "dot4", "heart", "rounded", "square2", "square3",
  "star", "sun", "x", "x-rounded",
];

export default function EditQRPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState<Record<string, any>>({});
  const [design, setDesign] = useState<any>({});
  const [qrType, setQrType] = useState("");
  const [qrfyId, setQrfyId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/qrcodes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name);
        setContent(data.content);
        setDesign(data.design || {});
        setQrType(data.type);
        setQrfyId(data.qrfyId || null);
      })
      .catch(() => toast.error("Failed to load QR code"))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch preview from QRFY API or from stored image
  const fetchPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      // Try server-side preview with current design
      const res = await fetch("/api/qrcodes/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: qrType, content, design }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      }
    } catch (err) {
      console.error("Preview fetch error:", err);
    }
    setPreviewLoading(false);
  }, [qrType, content, design]);

  // Debounced preview refresh on design/content change
  useEffect(() => {
    if (!loading && qrType) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchPreview(), 600);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }
  }, [loading, design, content, qrType, fetchPreview]);

  // Load initial image from QRFY if available
  useEffect(() => {
    if (!loading && qrfyId) {
      fetch(`/api/qrcodes/${id}/image?format=png`)
        .then(res => {
          if (res.ok) return res.blob();
          return null;
        })
        .then(blob => {
          if (blob) {
            setPreviewUrl(prev => {
              if (prev) URL.revokeObjectURL(prev);
              return URL.createObjectURL(blob);
            });
          }
        })
        .catch(() => {});
    }
  }, [loading, qrfyId, id]);

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

  const handleDownload = async (format: "png" | "webp" | "jpeg") => {
    if (!qrfyId) {
      toast.error("Download not available for legacy QR codes");
      return;
    }
    try {
      const res = await fetch(`/api/qrcodes/${id}/image?format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name || "qrcode"}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        toast.error("Download failed");
      }
    } catch {
      toast.error("Download failed");
    }
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
                  {QRFY_SHAPE_STYLES.map((s) => (
                    <button key={s} onClick={() => setDesign({ ...design, dotsType: s })} className={"px-3 py-1.5 text-sm rounded-lg border " + (design.dotsType === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Corner Square Style</label>
                <div className="flex flex-wrap gap-2">
                  {QRFY_CORNER_SQUARE_STYLES.map((s) => (
                    <button key={s} onClick={() => setDesign({ ...design, cornersSquareType: s })} className={"px-3 py-1.5 text-sm rounded-lg border " + (design.cornersSquareType === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Corner Dot Style</label>
                <div className="flex flex-wrap gap-2">
                  {QRFY_CORNER_DOT_STYLES.map((s) => (
                    <button key={s} onClick={() => setDesign({ ...design, cornersDotType: s })} className={"px-3 py-1.5 text-sm rounded-lg border " + (design.cornersDotType === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Download section */}
          {qrfyId && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Download QR Code</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleDownload("png")} className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">PNG</button>
                <button onClick={() => handleDownload("webp")} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">WEBP</button>
                <button onClick={() => handleDownload("jpeg")} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">JPEG</button>
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 min-h-[280px]">
              {previewLoading ? (
                <Spinner />
              ) : previewUrl ? (
                <img src={previewUrl} alt="QR Preview" className="w-64 h-64" />
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
