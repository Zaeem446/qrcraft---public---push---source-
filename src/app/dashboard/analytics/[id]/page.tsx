"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

export default function QRAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/analytics/${id}?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, days]);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  if (!data) return <p className="text-gray-500">QR code not found.</p>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm"><ArrowLeftIcon className="h-4 w-4 mr-1" />Back</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.qrcode?.name}</h1>
          <p className="text-sm text-gray-500">{data.qrcode?.type} &middot; {data.totalScans} scans</p>
        </div>
        <select
          value={days}
          onChange={(e) => { setDays(Number(e.target.value)); setLoading(true); }}
          className="ml-auto px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
        </select>
      </div>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.scansOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.deviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data.deviceBreakdown.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
          {data.locationBreakdown.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.locationBreakdown.map((loc: any) => (
                <div key={loc.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{loc.name}</span>
                  <span className="text-sm text-gray-500">{loc.value}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
