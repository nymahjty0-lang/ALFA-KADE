"use client";

import { useEffect, useState } from "react";
import { Save, Settings, ShieldCheck, Lock } from "lucide-react";
import { createClient } from "../../lib/supabase";

const ADMIN_NUMBERS = [
  "09936874192",
  "09966920595",
  "09010391546",
];

const ADMIN_PASSWORD = "909174";

type SettingsState = {
  new_product_fee: string;
  renewal_fee: string;
  renewal_months: string;
  max_products: string;
  max_sellers_per_product: string;
  support_email: string;
  suggestions_email: string;
};

const defaultSettings: SettingsState = {
  new_product_fee: "0",
  renewal_fee: "200000",
  renewal_months: "6",
  max_products: "10000000",
  max_sellers_per_product: "1000",
  support_email: "alphakade11@gmail.com",
  suggestions_email: "alphakade11@gmail.com",
};

function normalizePhone(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    )
    .replace(/\D/g, "");
}

export default function AdminPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [settings, setSettings] =
    useState<SettingsState>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("alfa_kade_logged_in") === "true";

    const phone = normalizePhone(
      localStorage.getItem("alfa_kade_phone") || ""
    );

    const adminVerified =
      localStorage.getItem("alfa_kade_admin_verified") === "true";

    const isAuthorized =
      loggedIn &&
      adminVerified &&
      ADMIN_NUMBERS.includes(phone);

    if (!isAuthorized) {
      window.location.href = "/ALFA-KADE/login";
      return;
    }

    setAllowed(true);
    setCheckingAccess(false);
  }, []);

  function login() {
    if (password !== ADMIN_PASSWORD) {
      setPasswordError("رمز مدیریت اشتباه است.");
      return;
    }

    setAuthenticated(true);
    setPasswordError("");
  }

  useEffect(() => {
    if (!authenticated) return;

    loadSettings();
  }, [authenticated]);

  async function loadSettings() {
    try {
      const supabase = createClient();

      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (data) {
        const loaded = { ...defaultSettings };

        for (const item of data) {
          if (item.key in loaded) {
            (loaded as Record<string, string>)[item.key] =
              String(item.value ?? "");
          }
        }

        setSettings(loaded);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function updateSetting(
    key: keyof SettingsState,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();

      if (!supabase) {
        setMessage("اتصال به دیتابیس برقرار نیست.");
        setSaving(false);
        return;
      }

      const rows = Object.entries(settings).map(
        ([key, value]) => ({
          key,
          value,
        })
      );

      const { error } = await supabase
        .from("site_settings")
        .upsert(rows, {
          onConflict: "key",
        });

      if (error) {
        console.error(error);
        setMessage("ذخیره تنظیمات انجام نشد.");
      } else {
        setMessage("تنظیمات با موفقیت ذخیره شد.");
      }
    } catch (error) {
      console.error(error);
      setMessage("خطایی هنگام ذخیره تنظیمات رخ داد.");
    } finally {
      setSaving(false);
    }
  }

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] text-white">
        <p className="text-zinc-400">
          در حال بررسی دسترسی...
        </p>
      </main>
    );
  }

  if (!allowed) {
    return null;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6 sm:p-8">

          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d8aa4d] text-black">
              <Lock size={30} />
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold">
            ورود به پنل مدیریت
          </h1>

          <p className="mt-2 text-center text-sm text-zinc-500">
            رمز مدیریت را وارد کنید.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
            placeholder="رمز مدیریت"
            inputMode="numeric"
            dir="ltr"
            className="mt-6 w-full rounded-xl border border-zinc-700 bg-black px-4 py-4 text-center text-xl tracking-[0.4em] text-white outline-none focus:border-[#d8aa4d]"
          />

          {passwordError && (
            <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/20 p-3 text-center text-sm text-red-400">
              {passwordError}
            </div>
          )}

          <button
            type="button"
            onClick={login}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#b88322] via-[#e5bd58] to-[#a56e13] px-6 py-4 font-bold text-black transition hover:opacity-90"
          >
            ورود به مدیریت
          </button>

          <div className="mt-8 text-center text-sm text-zinc-600">
            سازنده این سایت: نیما حجتی
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070707] px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg text-zinc-400">
            در حال بارگذاری تنظیمات...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 rounded-3xl border border-[#2d2d2d] bg-gradient-to-b from-[#171717] to-[#0d0d0d] p-6 sm:p-8">

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d8aa4d] text-black">
              <Settings size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                پنل مدیریت آلفا کده
              </h1>

              <p className="mt-1 text-sm text-zinc-400">
                مدیریت هزینه‌ها، محدودیت‌ها و اطلاعات سایت
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#3b3020] bg-[#15110a] p-4 text-sm text-[#e8c875]">
            <ShieldCheck size={20} />
            <span>
              تغییرات این قسمت روی تنظیمات سایت اعمال می‌شود.
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <section className="rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6">
            <h2 className="mb-2 text-xl font-bold text-[#e2b957]">
              هزینه ثبت محصول
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              هزینه ثبت اولیه هر محصول به تومان
            </p>
            <input
              type="number"
              min="0"
              value={settings.new_product_fee}
              onChange={(e) =>
                updateSetting("new_product_fee", e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d8aa4d]"
            />
            <p className="mt-3 text-xs text-zinc-500">
              مقدار پیش‌فرض: رایگان
            </p>
          </section>

          <section className="rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6">
            <h2 className="mb-2 text-xl font-bold text-[#e2b957]">
              هزینه تمدید
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              مبلغ تمدید محصول به تومان
            </p>
            <input
              type="number"
              min="0"
              value={settings.renewal_fee}
              onChange={(e) =>
                updateSetting("renewal_fee", e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d8aa4d]"
            />
            <p className="mt-3 text-xs text-zinc-500">
              مقدار پیش‌فرض: ۲۰۰٬۰۰۰ تومان
            </p>
          </section>

          <section className="rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6">
            <h2 className="mb-2 text-xl font-bold text-[#e2b957]">
              مدت تمدید
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              مدت اعتبار محصول بر اساس ماه
            </p>
            <input
              type="number"
              min="1"
              value={settings.renewal_months}
              onChange={(e) =>
                updateSetting("renewal_months", e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d8aa4d]"
            />
            <p className="mt-3 text-xs text-zinc-500">
              مقدار پیش‌فرض: ۶ ماه
            </p>
          </section>

          <section className="rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6">
            <h2 className="mb-2 text-xl font-bold text-[#e2b957]">
              حداکثر تعداد محصولات
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              حداکثر تعداد محصول قابل ثبت در سایت
            </p>
            <input
              type="number"
              min="1"
              value={settings.max_products}
              onChange={(e) =>
                updateSetting("max_products", e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d8aa4d]"
            />
            <p className="mt-3 text-xs text-zinc-500">
              مقدار پیش‌فرض: ۱۰ میلیون محصول
            </p>
          </section>

          <section className="rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6">
            <h2 className="mb-2 text-xl font-bold text-[#e2b957]">
              فروشنده برای هر محصول
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              حداکثر تعداد فروشنده برای یک محصول
            </p>
            <input
              type="number"
              min="1"
              value={settings.max_sellers_per_product}
              onChange={(e) =>
                updateSetting(
                  "max_sellers_per_product",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d8aa4d]"
            />
            <p className="mt-3 text-xs text-zinc-500">
              مقدار پیش‌فرض: ۱۰۰۰ فروشنده
            </p>
          </section>

          <section className="rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6">
            <h2 className="mb-2 text-xl font-bold text-[#e2b957]">
              ایمیل پشتیبانی
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              ایمیل نمایش داده شده برای پشتیبانی
            </p>
            <input
              type="email"
              value={settings.support_email}
              onChange={(e) =>
                updateSetting("support_email", e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d8aa4d]"
              dir="ltr"
            />
          </section>

          <section className="rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6 md:col-span-2">
            <h2 className="mb-2 text-xl font-bold text-[#e2b957]">
              ایمیل پیشنهادات
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              ایمیلی که کاربران برای ارسال پیشنهادات استفاده می‌کنند
            </p>
            <input
              type="email"
              value={settings.suggestions_email}
              onChange={(e) =>
                updateSetting("suggestions_email", e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d8aa4d]"
              dir="ltr"
            />
          </section>
        </div>

        <div className="mt-8 rounded-3xl border border-[#2d2d2d] bg-[#111111] p-6">

          {message && (
            <div className="mb-4 rounded-xl border border-[#4a3b20] bg-[#171208] p-4 text-center text-[#e8c875]">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#b88322] via-[#e5bd58] to-[#a56e13] px-6 py-4 font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={21} />
            {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </button>
        </div>

        <div className="py-8 text-center text-sm text-zinc-600">
          سازنده این سایت: نیما حجتی
        </div>
      </div>
    </main>
  );
      }
