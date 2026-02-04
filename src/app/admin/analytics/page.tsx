'use client';

import { useEffect, useState } from 'react';
import {
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface AnalyticsData {
  totalScans: number;
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
  scansOverTime: { date: string; count: number }[];
  topCountries: { name: string; value: number }[];
  topCities: { name: string; value: number }[];
  deviceBreakdown: { name: string; value: number }[];
  browserBreakdown: { name: string; value: number }[];
  osBreakdown: { name: string; value: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Scans', value: data.totalScans.toLocaleString(), icon: CursorArrowRaysIcon },
    { name: 'Today', value: data.scansToday.toLocaleString(), icon: CursorArrowRaysIcon },
    { name: 'This Week', value: data.scansThisWeek.toLocaleString(), icon: CursorArrowRaysIcon },
    { name: 'This Month', value: data.scansThisMonth.toLocaleString(), icon: CursorArrowRaysIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Platform Analytics</h2>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scans Over Time Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans Over Time</h3>
        <div className="h-64 flex items-end gap-1">
          {data.scansOverTime.map((day) => {
            const maxCount = Math.max(...data.scansOverTime.map((d) => d.count), 1);
            const height = (day.count / maxCount) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full bg-violet-500 rounded-t transition-all hover:bg-violet-600 min-h-[4px]"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {day.date}: {day.count.toLocaleString()} scans
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{data.scansOverTime[0]?.date}</span>
          <span>{data.scansOverTime[data.scansOverTime.length - 1]?.date}</span>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Devices</h3>
          </div>
          <div className="space-y-3">
            {data.deviceBreakdown.slice(0, 5).map((item) => {
              const total = data.deviceBreakdown.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.name || 'Unknown'}</span>
                    <span className="text-gray-900 font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ComputerDesktopIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Browsers</h3>
          </div>
          <div className="space-y-3">
            {data.browserBreakdown.slice(0, 5).map((item) => {
              const total = data.browserBreakdown.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.name || 'Unknown'}</span>
                    <span className="text-gray-900 font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OS Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ComputerDesktopIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Operating Systems</h3>
          </div>
          <div className="space-y-3">
            {data.osBreakdown.slice(0, 5).map((item) => {
              const total = data.osBreakdown.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.name || 'Unknown'}</span>
                    <span className="text-gray-900 font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Geographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Top Countries</h3>
          </div>
          <div className="space-y-3">
            {data.topCountries.slice(0, 10).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{item.name || 'Unknown'}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Top Cities</h3>
          </div>
          <div className="space-y-3">
            {data.topCities.slice(0, 10).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{item.name || 'Unknown'}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
