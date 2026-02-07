'use client';

import { useState } from 'react';
import {
  Cog6ToothIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Email Settings
    supportEmail: 'support@qr-craft.online',
    notifyOnNewUser: true,
    notifyOnNewSubscription: true,
    notifyOnCancellation: true,

    // Security Settings
    requireEmailVerification: true,
    allowSocialLogin: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,

    // QR Code Settings
    defaultQRExpiry: 365,
    gracePeriodDays: 7,
    autoDeactivateOnExpiry: true,

    // Subscription Settings
    trialDays: 7,
    reminderDaysBeforeExpiry: 7,
    sendExpiryReminders: true,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Platform Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Configure admin email alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifyOnNewUser}
                  onChange={(e) => setSettings({ ...settings, notifyOnNewUser: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Notify on new user registration</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifyOnNewSubscription}
                  onChange={(e) => setSettings({ ...settings, notifyOnNewSubscription: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Notify on new subscription</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifyOnCancellation}
                  onChange={(e) => setSettings({ ...settings, notifyOnCancellation: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Notify on subscription cancellation</span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Security Settings</h3>
              <p className="text-sm text-gray-500">Authentication and security options</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Require email verification</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.allowSocialLogin}
                  onChange={(e) => setSettings({ ...settings, allowSocialLogin: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Allow social login (Google, Facebook)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (days)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Cog6ToothIcon className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">QR Code Settings</h3>
              <p className="text-sm text-gray-500">Default QR code behavior</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Expiry (days)
                </label>
                <input
                  type="number"
                  value={settings.defaultQRExpiry}
                  onChange={(e) => setSettings({ ...settings, defaultQRExpiry: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grace Period (days)
                </label>
                <input
                  type="number"
                  value={settings.gracePeriodDays}
                  onChange={(e) => setSettings({ ...settings, gracePeriodDays: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.autoDeactivateOnExpiry}
                onChange={(e) => setSettings({ ...settings, autoDeactivateOnExpiry: e.target.checked })}
                className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
              />
              <span className="text-sm text-gray-700">Auto-deactivate QR codes on subscription expiry</span>
            </label>
          </div>
        </div>

        {/* Subscription Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <KeyIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Subscription Settings</h3>
              <p className="text-sm text-gray-500">Trial and billing options</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trial Period (days)
                </label>
                <input
                  type="number"
                  value={settings.trialDays}
                  onChange={(e) => setSettings({ ...settings, trialDays: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Reminder (days before)
                </label>
                <input
                  type="number"
                  value={settings.reminderDaysBeforeExpiry}
                  onChange={(e) => setSettings({ ...settings, reminderDaysBeforeExpiry: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.sendExpiryReminders}
                onChange={(e) => setSettings({ ...settings, sendExpiryReminders: e.target.checked })}
                className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
              />
              <span className="text-sm text-gray-700">Send subscription expiry reminders</span>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <ShieldCheckIcon className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-500">Irreversible actions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Clear All Analytics Data</p>
              <p className="text-sm text-gray-500">Delete all scan events and analytics data</p>
            </div>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => toast.error('This action is disabled for safety')}
            >
              Clear Data
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Deactivate All Expired Subscriptions</p>
              <p className="text-sm text-gray-500">Deactivate QR codes for all expired subscriptions</p>
            </div>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => toast.error('This action is disabled for safety')}
            >
              Deactivate All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
