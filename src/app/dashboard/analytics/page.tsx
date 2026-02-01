"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444", "#06B6D4"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  if (!data) return <p className="text-gray-500">Failed to load analytics.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select
          value={days}
          onChange={(e) => { setDays(Number(e.target.value)); setLoading(true); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-sm text-gray-500">Total Scans</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalScans}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Total QR Codes</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalQRCodes}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Active QR Codes</p>
          <p className="text-2xl font-bold text-gray-900">{data.activeQRCodes}</p>
        </Card>
      </div>

      {/* Scans Over Time */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans Over Time</h3>
        <div className="h-72">
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

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Device Breakdown */}
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

        {/* Browser Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.browserBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Location */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
        {data.locationBreakdown.length === 0 ? (
          <p className="text-gray-500 text-sm">No location data yet.</p>
        ) : (
          <div className="space-y-3">
            {data.locationBreakdown.map((loc: any) => (
              <div key={loc.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{loc.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(loc.value / Math.max(...data.locationBreakdown.map((l: any) => l.value))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">{loc.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
