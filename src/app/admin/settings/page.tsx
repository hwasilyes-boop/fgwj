"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  Palette,
  Type,
  Store,
  Share2,
} from "lucide-react";

type Settings = Record<string, string>;

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await fetch("/api/admin/settings");

      if (!response.ok) {
        throw new Error("Failed to load settings");
      }

      const data = await response.json();
      setSettings(data);
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  function updateSetting(key: string, value: string) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>,
    folder: string,
    settingKey: string
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(settingKey);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch(
        "/api/admin/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed"
        );
      }

      updateSetting(settingKey, data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed"
      );
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  }

  async function handleSave(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save settings"
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Store Settings
        </h1>

        <p className="text-sm text-dark-muted mt-1">
          Control your Wrapy storefront from one place.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6"
      >
        {/* STORE */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <Store className="w-4 h-4 text-brand" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Store
              </h2>

              <p className="text-xs text-dark-muted">
                Basic store information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Store Name
              </label>

              <input
                value={settings.store_name || ""}
                onChange={(e) =>
                  updateSetting(
                    "store_name",
                    e.target.value
                  )
                }
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
                placeholder="WRAPY"
              />
            </div>

            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Currency
              </label>

              <input
                value={settings.store_currency || "DT"}
                onChange={(e) =>
                  updateSetting(
                    "store_currency",
                    e.target.value
                  )
                }
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
                placeholder="DT"
              />
            </div>

            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Shipping Price
              </label>

              <input
                type="number"
                value={
                  settings.shipping_price || "8000"
                }
                onChange={(e) =>
                  updateSetting(
                    "shipping_price",
                    e.target.value
                  )
                }
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
              />

              <p className="text-[11px] text-dark-muted mt-1">
                8000 = 8 DT
              </p>
            </div>

            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Loyalty Points / Dinar
              </label>

              <input
                type="number"
                value={
                  settings.points_per_dinar || "1"
                }
                onChange={(e) =>
                  updateSetting(
                    "points_per_dinar",
                    e.target.value
                  )
                }
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
              />
            </div>
          </div>
        </section>

        {/* HERO */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-brand" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Hero Section
              </h2>

              <p className="text-xs text-dark-muted">
                Main homepage hero
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Hero Image
              </label>

              {settings.hero_image && (
                <div className="mb-3 rounded-xl overflow-hidden border border-dark-border bg-dark">
                  <img
                    src={settings.hero_image}
                    alt="Hero"
                    className="w-full max-h-72 object-cover"
                  />
                </div>
              )}

              <label className="flex items-center justify-center gap-2 border border-dashed border-dark-border rounded-xl p-5 cursor-pointer hover:border-brand/50 transition-colors">
                {uploading === "hero_image" ? (
                  <Loader2 className="w-5 h-5 animate-spin text-brand" />
                ) : (
                  <Upload className="w-5 h-5 text-brand" />
                )}

                <span className="text-sm text-white">
                  {uploading === "hero_image"
                    ? "Uploading..."
                    : "Upload Hero Image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    uploadImage(
                      e,
                      "hero",
                      "hero_image"
                    )
                  }
                />
              </label>

              <p className="text-[11px] text-dark-muted mt-2">
                Stored locally in public/site/hero/
              </p>
            </div>

            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Hero Title
              </label>

              <input
                value={settings.hero_title || ""}
                onChange={(e) =>
                  updateSetting(
                    "hero_title",
                    e.target.value
                  )
                }
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
                placeholder="WRAP YOUR WORLD"
              />
            </div>

            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Hero Subtitle
              </label>

              <textarea
                value={settings.hero_subtitle || ""}
                onChange={(e) =>
                  updateSetting(
                    "hero_subtitle",
                    e.target.value
                  )
                }
                rows={3}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-brand/50"
                placeholder="Premium skins designed for your device."
              />
            </div>

            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Hero Button Text
              </label>

              <input
                value={
                  settings.hero_button_text || ""
                }
                onChange={(e) =>
                  updateSetting(
                    "hero_button_text",
                    e.target.value
                  )
                }
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
                placeholder="Shop Now"
              />
            </div>

            <div>
              <label className="text-xs text-dark-muted block mb-1.5">
                Hero Button Link
              </label>

              <input
                value={
                  settings.hero_button_link || ""
                }
                onChange={(e) =>
                  updateSetting(
                    "hero_button_link",
                    e.target.value
                  )
                }
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
                placeholder="/skins"
              />
            </div>
          </div>
        </section>

        {/* LOGO */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-brand" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Logo
              </h2>

              <p className="text-xs text-dark-muted">
                Main store logo
              </p>
            </div>
          </div>

          {settings.logo_image && (
            <div className="mb-4 w-fit p-5 rounded-xl bg-dark border border-dark-border">
              <img
                src={settings.logo_image}
                alt="Logo"
                className="max-w-[220px] max-h-20 object-contain"
              />
            </div>
          )}

          <label className="flex items-center justify-center gap-2 border border-dashed border-dark-border rounded-xl p-5 cursor-pointer hover:border-brand/50 transition-colors">
            {uploading === "logo_image" ? (
              <Loader2 className="w-5 h-5 animate-spin text-brand" />
            ) : (
              <Upload className="w-5 h-5 text-brand" />
            )}

            <span className="text-sm text-white">
              {uploading === "logo_image"
                ? "Uploading..."
                : "Upload Logo"}
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                uploadImage(
                  e,
                  "logo",
                  "logo_image"
                )
              }
            />
          </label>
        </section>

        {/* COLORS */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <Palette className="w-4 h-4 text-brand" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Brand Colors
              </h2>

              <p className="text-xs text-dark-muted">
                Customize your storefront colors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ColorInput
              label="Primary"
              value={
                settings.primary_color || "#B7FF00"
              }
              onChange={(value) =>
                updateSetting(
                  "primary_color",
                  value
                )
              }
            />

            <ColorInput
              label="Background"
              value={
                settings.background_color ||
                "#050505"
              }
              onChange={(value) =>
                updateSetting(
                  "background_color",
                  value
                )
              }
            />

            <ColorInput
              label="Text"
              value={
                settings.text_color || "#FFFFFF"
              }
              onChange={(value) =>
                updateSetting(
                  "text_color",
                  value
                )
              }
            />
          </div>
        </section>

        {/* TEXT */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <Type className="w-4 h-4 text-brand" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Storefront Text
              </h2>

              <p className="text-xs text-dark-muted">
                Main website messaging
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <TextInput
              label="Announcement"
              value={
                settings.announcement_text || ""
              }
              onChange={(value) =>
                updateSetting(
                  "announcement_text",
                  value
                )
              }
              placeholder="Free delivery on orders over 80 DT"
            />

            <TextInput
              label="Homepage Section Title"
              value={
                settings.featured_title || ""
              }
              onChange={(value) =>
                updateSetting(
                  "featured_title",
                  value
                )
              }
              placeholder="Featured Skins"
            />
          </div>
        </section>

        {/* SOCIAL */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-brand" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Social Media
              </h2>

              <p className="text-xs text-dark-muted">
                Your social links
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <TextInput
              label="Instagram"
              value={
                settings.instagram_url || ""
              }
              onChange={(value) =>
                updateSetting(
                  "instagram_url",
                  value
                )
              }
              placeholder="https://instagram.com/..."
            />

            <TextInput
              label="Facebook"
              value={
                settings.facebook_url || ""
              }
              onChange={(value) =>
                updateSetting(
                  "facebook_url",
                  value
                )
              }
              placeholder="https://facebook.com/..."
            />

            <TextInput
              label="Phone"
              value={settings.phone_number || ""}
              onChange={(value) =>
                updateSetting("phone_number", value)
              }
              placeholder="+216 ..."
            />

            <TextInput
              label="Email"
              value={settings.email_address || ""}
              onChange={(value) =>
                updateSetting("email_address", value)
              }
              placeholder="..."
            />

            <TextInput
              label="TikTok"
              value={settings.tiktok_url || ""}
              onChange={(value) =>
                updateSetting(
                  "tiktok_url",
                  value
                )
              }
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </section>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pb-10">
          {saved && (
            <span className="text-sm text-brand font-medium">
              Settings saved successfully âœ“
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="ml-auto flex items-center gap-2 bg-brand hover:bg-brand-dark text-black font-bold px-8 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
          >
            {saving && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}

            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-dark-muted block mb-1.5">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-dark-muted block mb-1.5">
        {label}
      </label>

      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-12 h-11 rounded-lg bg-dark border border-dark-border cursor-pointer"
        />

        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="flex-1 bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
          placeholder="#B7FF00"
        />
      </div>
    </div>
  );
}

