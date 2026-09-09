"use client";

import { useEffect, useState } from "react";
import { Save, Settings, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SettingsState = {
  new_product_fee: string;
  renewal_fee: string;
  renewal_months: string;
  max_products: string;
  max_sellers_per_product: string;
  support_email: string;
  suggestions_email: string;
};

const defaults: SettingsState = {
  new_product_fee: "0",
  renewal_fee: "200000",
  renewal_months: "6",
  max_products: "10000000",
  max_sellers_per_product: "1000",
  support_email: "alphakade11@gmail.com",
  suggestions_email: "alphakade11@gmail.com",
};

export default function AdminPage() {
  const [settings, setSettings] = useState<SettingsState>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);

    const { data } = await supabase
      .from("site_settings")
      .select("key,value");

    if (data) {
      const next = { ...defaults };

      for (const item of data) {
        if (item.key in next) {
          (next as Record<string, string>)[item.key] = item.value;
        }
      }

      setSettings(next);
    }

    setLoading(false);
  }

  function updateSetting(key: keyof SettingsState, value: string) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
    }));

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      setMessage("ذخیره تنظیمات انجام نشد.");
    } else {
      setMessage("تنظیمات با موفقیت ذخیره شد.");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070707] px-4 py-12 text-white">
        <div className="mx-auto max-w-4xl text-center text-gray-400">
          در حال بارگذاری تنظیمات...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        {/* عنوان */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8aa4d]/30 bg-[#d8aa4d]/10">
            <Settings className="h-8 w-8 text-[#d8aa4d]" />
          </div>

          <h1 className="text-3xl font-bold text-[#d8aa4d]">
            مدیریت آلفا کده
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            تنظیمات اصلی سایت را بدون تغییر کد مدیریت کنید.
          </p>
        </div>

        {/* هزینه‌ها */}
        <section className="mb-6 rounded-2xl border border-[#d8aa4d]/20 bg-[#101010] p-6">
          <h2 className="mb-5 text-xl font-bold text-[#d8aa4d]">
            هزینه‌ها
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="هزینه ثبت محصول جدید (تومان)"
              value={settings.new_product_fee}
              onChange={(v) => updateSetting("new_product_fee", v)}
              type="number"
            />

            <Field
              label="هزینه تمدید (تومان)"
              value={settings.renewal_fee}
              onChange={(v) => updateSetting("renewal_fee", v)}
              type="number"
            />

            <Field
              label="مدت تمدید (ماه)"
              value={settings.renewal_months}
              onChange={(v) => updateSetting("renewal_months", v)}
              type="number"
            />
          </div>
        </section>

        {/* محدودیت‌ها */}
        <section className="mb-6 rounded-2xl border border-[#d8aa4d]/20 bg-[#101010] p-6">
          <h2 className="mb-5 text-xl font-bold text-[#d8aa4d]">
            محدودیت‌های سایت
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="حداکثر تعداد محصولات"
              value={settings.max_products}
              onChange={(v) => updateSetting("max_products", v)}
              type="number"
            />

            <Field
              label="حداکثر فروشنده برای هر محصول"
              value={settings.max_sellers_per_product}
              onChange={(v) =>
                updateSetting("max_sellers_per_product", v)
              }
              type="number"
            />
          </div>

          <div className="mt-5 rounded-xl border border-[#d8aa4d]/20 bg-black/30 p-4 text-sm leading-7 text-gray-400">
            سقف قیمت هر محصول در سیستم:
            <strong className="mx-1 text-[#d8aa4d]">
              ۵۰۰,۰۰۰,۰۰۰ تومان
            </strong>
          </div>
        </section>

        {/* ارتباط */}
        <section className="mb-6 rounded-2xl border border-[#d8aa4d]/20 bg-[#101010] p-6">
          <h2 className="mb-5 text-xl font-bold text-[#d8aa4d]">
            اطلاعات ارتباطی
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="ایمیل پشتیبانی"
              value={settings.support_email}
              onChange={(v) => updateSetting("support_email", v)}
              type="email"
            />

            <Field
              label="ایمیل پیشنهادات"
              value={settings.suggestions_email}
              onChange={(v) => updateSetting("suggestions_email", v)}
              type="email"
            />
          </div>
        </section>

        {/* امنیت */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#d8aa4d]/20 bg-[#0d0d0d] p-5">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#d8aa4d]" />

          <div>
            <h3 className="font-bold text-white">
              تنظیمات مدیریتی
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-400">
              برای استفاده واقعی از پنل مدیریت، دسترسی مدیر باید در
              Supabase تنظیم شود.
            </p>
          </div>
        </div>

        {/* ذخیره */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d8aa4d] px-6 py-4 font-bold text-black transition hover:bg-[#e8bd65] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-[#d8aa4d]">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={type === "email" ? "ltr" : "rtl"}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#d8aa4d]"
      />
    </div>
  );
        }
