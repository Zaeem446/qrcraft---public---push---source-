"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [changingPassword, setChangingPassword] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) toast.success("Profile updated");
      else toast.error("Failed to update profile");
    } catch {
      toast.error("Something went wrong");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setChangingPassword(false);
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Unable to open billing portal");
    } catch {
      toast.error("Something went wrong");
    }
    setPortalLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Profile */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" value={profile?.email || ""} disabled />
          <Button type="submit" isLoading={saving}>Save Changes</Button>
        </form>
      </Card>

      {/* Password */}
      {profile?.provider === "credentials" && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required />
            <Input label="New Password" type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} required />
            <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
            <Button type="submit" isLoading={changingPassword}>Change Password</Button>
          </form>
        </Card>
      )}

      {/* Subscription */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Plan</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{profile?.plan || "Free"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{profile?.subscriptionStatus || "N/A"}</span>
          </div>
          {profile?.trialEndsAt && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Trial Ends</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(profile.trialEndsAt)}</span>
            </div>
          )}
          <div className="pt-3">
            {profile?.stripeCustomerId ? (
              <Button onClick={handleManageSubscription} isLoading={portalLoading} variant="outline">
                Manage Subscription
              </Button>
            ) : (
              <a href="/pricing">
                <Button variant="primary">Upgrade Plan</Button>
              </a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
