"use client";

import { useEffect, useState, use } from "react";
import Spinner from "@/components/ui/Spinner";

export default function QRLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/qrcodes/by-slug/${slug}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Spinner size="lg" /></div>;
  if (!data) return <div className="min-h-screen flex justify-center items-center"><p className="text-gray-500">QR code not found.</p></div>;

  const { type, content } = data;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {type === "vcard" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">{(content.firstName?.[0] || "") + (content.lastName?.[0] || "")}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{content.firstName} {content.lastName}</h1>
            {content.title && <p className="text-gray-500">{content.title}</p>}
            {content.org && <p className="text-gray-500">{content.org}</p>}
            <div className="mt-6 space-y-3 text-left">
              {content.phone && <p className="text-sm"><span className="text-gray-500">Phone:</span> <a href={"tel:" + content.phone} className="text-blue-600">{content.phone}</a></p>}
              {content.email && <p className="text-sm"><span className="text-gray-500">Email:</span> <a href={"mailto:" + content.email} className="text-blue-600">{content.email}</a></p>}
              {content.website && <p className="text-sm"><span className="text-gray-500">Web:</span> <a href={content.website} className="text-blue-600" target="_blank" rel="noopener noreferrer">{content.website}</a></p>}
              {content.address && <p className="text-sm"><span className="text-gray-500">Address:</span> {content.address}</p>}
            </div>
          </div>
        )}

        {type === "wifi" && (
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-4">WiFi Network</h1>
            <div className="space-y-3 text-left">
              <p><span className="text-gray-500">Network:</span> {content.ssid}</p>
              <p><span className="text-gray-500">Password:</span> {content.password}</p>
              <p><span className="text-gray-500">Security:</span> {content.encryption}</p>
            </div>
          </div>
        )}

        {type === "coupon" && (
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h1>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 my-4">
              <p className="text-3xl font-bold">{content.discount}</p>
            </div>
            {content.code && <p className="text-sm text-gray-500">Code: <span className="font-mono font-bold text-gray-900">{content.code}</span></p>}
            {content.expiryDate && <p className="text-sm text-gray-500 mt-2">Expires: {content.expiryDate}</p>}
            {content.terms && <p className="text-xs text-gray-400 mt-4">{content.terms}</p>}
          </div>
        )}

        {type === "event" && (
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <div className="space-y-2">
              {content.startDate && <p className="text-sm"><span className="text-gray-500">Start:</span> {new Date(content.startDate).toLocaleString()}</p>}
              {content.endDate && <p className="text-sm"><span className="text-gray-500">End:</span> {new Date(content.endDate).toLocaleString()}</p>}
              {content.location && <p className="text-sm"><span className="text-gray-500">Location:</span> {content.location}</p>}
              {content.description && <p className="text-sm text-gray-600 mt-3">{content.description}</p>}
            </div>
          </div>
        )}

        {!["vcard", "wifi", "coupon", "event"].includes(type) && (
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-4">QR Content</h1>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap text-left bg-gray-50 p-4 rounded-lg">{JSON.stringify(content, null, 2)}</pre>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Powered by QRCraft</p>
        </div>
      </div>
    </div>
  );
}
