"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  CursorArrowRaysIcon, UsersIcon, QrCodeIcon, SignalIcon, MapPinIcon,
} from "@heroicons/react/24/outline";

const DONUT_COLORS = ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"];

const countryFlags: Record<string, string> = {
  "United States": "\u{1F1FA}\u{1F1F8}", "United Kingdom": "\u{1F1EC}\u{1F1E7}", "Germany": "\u{1F1E9}\u{1F1EA}",
  "France": "\u{1F1EB}\u{1F1F7}", "Canada": "\u{1F1E8}\u{1F1E6}", "Australia": "\u{1F1E6}\u{1F1FA}",
  "India": "\u{1F1EE}\u{1F1F3}", "Brazil": "\u{1F1E7}\u{1F1F7}", "Japan": "\u{1F1EF}\u{1F1F5}",
  "China": "\u{1F1E8}\u{1F1F3}", "Mexico": "\u{1F1F2}\u{1F1FD}", "Spain": "\u{1F1EA}\u{1F1F8}",
  "Italy": "\u{1F1EE}\u{1F1F9}", "Netherlands": "\u{1F1F3}\u{1F1F1}", "South Korea": "\u{1F1F0}\u{1F1F7}",
  "Russia": "\u{1F1F7}\u{1F1FA}", "Turkey": "\u{1F1F9}\u{1F1F7}", "Pakistan": "\u{1F1F5}\u{1F1F0}",
  "Saudi Arabia": "\u{1F1F8}\u{1F1E6}", "Nigeria": "\u{1F1F3}\u{1F1EC}",
};

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-medium text-gray-900 mb-1">{formatDateLabel(label)}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-semibold">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  if (!data) return <p className="text-gray-500">Failed to load analytics.</p>;

  // Merge scans + unique scans into one dataset for dual-line chart
  const chartData = (data.scansOverTime || []).map((s: any) => {
    const uniqueEntry = (data.uniqueScansOverTime || []).find((u: any) => u.date === s.date);
    return { date: s.date, "Total Scans": s.count, "Unique Scans": uniqueEntry?.count || 0 };
  });

  const maxLocation = Math.max(...(data.locationBreakdown || []).map((l: any) => l.value), 1);
  const maxCity = Math.max(...(data.cityBreakdown || []).map((c: any) => c.value), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your QR code performance</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 border border-violet-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CursorArrowRaysIcon} label="Total Scans" value={data.totalScans || 0} color="violet" />
        <StatCard icon={UsersIcon} label="Unique Scans" value={data.uniqueScans || 0} color="purple" />
        <StatCard icon={QrCodeIcon} label="Total QR Codes" value={data.totalQRCodes || 0} color="indigo" />
        <StatCard icon={SignalIcon} label="Active QR Codes" value={data.activeQRCodes || 0} color="fuchsia" />
      </div>

      {/* Scans Over Time */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans Over Time</h3>
        <div className="h-80">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No scan data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" tickFormatter={formatDateLabel} tick={{ fontSize: 12 }} stroke="#D1D5DB" />
                <YAxis tick={{ fontSize: 12 }} stroke="#D1D5DB" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="Total Scans" stroke="#7C3AED" strokeWidth={2} fill="url(#gradTotal)" />
                <Area type="monotone" dataKey="Unique Scans" stroke="#A78BFA" strokeWidth={2} fill="url(#gradUnique)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Devices / Browsers / OS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices Donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
          {(!data.deviceBreakdown || data.deviceBreakdown.length === 0) ? (
            <p className="text-gray-400 text-sm">No device data yet.</p>
          ) : (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.deviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75}>
                      {data.deviceBreakdown.map((_: any, i: number) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {data.deviceBreakdown.map((d: any, i: number) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Browsers Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
          {(!data.browserBreakdown || data.browserBreakdown.length === 0) ? (
            <p className="text-gray-400 text-sm">No browser data yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.browserBreakdown} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#D1D5DB" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#D1D5DB" width={70} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7C3AED" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* OS Donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
          {(!data.osBreakdown || data.osBreakdown.length === 0) ? (
            <p className="text-gray-400 text-sm">No OS data yet.</p>
          ) : (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.osBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75}>
                      {data.osBreakdown.map((_: any, i: number) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {data.osBreakdown.map((o: any, i: number) => (
                  <div key={o.name} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    {o.name} ({o.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Countries</h3>
          {(!data.locationBreakdown || data.locationBreakdown.length === 0) ? (
            <p className="text-gray-400 text-sm">No location data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.locationBreakdown.map((loc: any) => (
                <div key={loc.name} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">{countryFlags[loc.name] || "\u{1F30D}"}</span>
                  <span className="text-sm text-gray-700 w-28 truncate">{loc.name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${(loc.value / maxLocation) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">{loc.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cities</h3>
          {(!data.cityBreakdown || data.cityBreakdown.length === 0) ? (
            <p className="text-gray-400 text-sm">No city data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.cityBreakdown.map((city: any) => (
                <div key={city.name} className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-violet-400 shrink-0" />
                  <span className="text-sm text-gray-700 w-28 truncate">{city.name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${(city.value / maxCity) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">{city.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colorMap: Record<string, { bg: string; icon: string }> = {
    violet: { bg: "bg-violet-100", icon: "text-violet-600" },
    purple: { bg: "bg-purple-100", icon: "text-purple-600" },
    indigo: { bg: "bg-indigo-100", icon: "text-indigo-600" },
    fuchsia: { bg: "bg-fuchsia-100", icon: "text-fuchsia-600" },
  };
  const c = colorMap[color] || colorMap.violet;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`${c.bg} rounded-lg p-3`}>
        <Icon className={`h-6 w-6 ${c.icon}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
