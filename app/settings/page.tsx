"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Settings, Save, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getClientAuth, normalizePhone, fetchSiteSettings } from "@/lib/alfa";

const BASE_PATH = "/ALFA-KADE";

export default function SettingsPage() {
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newProductFee, setNewProductFee] = useState("0");
  const [renewalFee, setRenewalFee] = useState("200000");
  const [renewalMonths, setRenewalMonths] = useState("6");
  const [maxPrice, setMaxPrice] = useState("500000000");
  const [supportEmail, setSupportEmail] = useState("alphakade11@gmail.com");
  const [suggestionsEmail, setSuggestionsEmail] = useState("alphakade11@gmail.com");
  const [showSellerPhonePublic, setShowSellerPhonePublic] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const auth = getClientAuth();
    setAllowed(auth.isAdmin);
    setChecked(true);

    if (auth.isAdmin) {
      fetchSiteSettings().then((s) => {
        setNewProductFee(String(s.new_product_fee));
        setRenewalFee(String(s.renewal_fee));
        setRenewalMonths(String(s.renewal_months));
        setMaxPrice(String(s.max_product_price));
        setSupportEmail(s.support_email);
        setSuggestionsEmail(s.suggestions_email);
        setShowSellerPhonePublic(s.show_seller_phone_public);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  async function saveSettings() {
    setMessage("");

    const fee = Number(normalizePhone(newProductFee));
    const renewal = Number(normalizePhone(renewalFee));
    const months = Number(normalizePhone(renewalMonths));
    const maximum = Number(normalizePhone(maxPrice));

    if (!Number.isFinite(fee) || fee < 0) return setMessage("هزینه ثبت محصول معتبر نیست.");
    if (!Number.isFinite(renewal) || renewal < 0) return setMessage("هزینه تمدید معتبر نیست.");
    if (!Number.isFinite(months) || months <= 0) return setMessage("مدت تمدید معتبر نیست.");
    if (!Number.isFinite(maximum) || maximum <= 0) return setMessage("حداکثر قیمت معتبر نیست.");
    if (!/^\S+@\S+\.\S+$/.test(supportEmail)) return setMessage("ایمیل پشتیبانی معتبر نیست.");
    if (!/^\S+@\S+\.\S+$/.test(suggestionsEmail)) return setMessage("ایمیل پیشنهادات معتبر نیست.");

    if (!supabase) {
      setMessage("اتصال به پایگاه داده برقرار نیست.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        new_product_fee: fee,
        renewal_fee: renewal,
        renewal_months: months,
        max_product_price: maximum,
        support_email: supportEmail.trim(),
        suggestions_email: suggestionsEmail.trim(),
        show_seller_phone_public: showSellerPhonePublic,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setSaving(false);

    if (error) {
      setMessage("خطا در ذخیره تنظیمات: " + error.message);
    } else {
      setMessage("تنظیمات با موفقیت ذخیره شد.");
    }
  }

  if (!checked || loading) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#070707] text-[#d8aa4d]">
        <Loader2 className="animate-spin" size={26} />
      </main>
    );
  }

  if (!allowed) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#070707] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-900 bg-[#0d0d0d] p-7 text-center">
          <ShieldCheck size={48} className="mx-auto mb-5 text-red-400" />
          <h1 className="text-2xl font-bold">دسترسی غیرمجاز</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400">این بخش فقط برای مدیران مجاز آلفا کده قابل دسترسی است.</p>
          <Link href={`${BASE_PATH}/products`} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#d8aa4d] px-6 py-3 font-bold text-black">
            بازگشت <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#070707] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href={`${BASE_PATH}/admin`} className="inline-flex items-center gap-2 rounded-xl border border-[#40331d] px-4 py-2 text-sm text-gray-300 hover:border-[#d8aa4d]">
            بازگشت <ArrowRight size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#181307] p-3 text-[#d8aa4d]"><Settings size={25} /></div>
            <div>
              <h1 className="font-bold text-[#d8aa4d]">تنظیمات</h1>
              <p className="text-xs text-gray-600">ALFA KADE</p>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-[#40331d] bg-[#0d0d0d] p-6 shadow-2xl">
          <h2 className="mb-6 text-xl font-bold">تنظیمات سایت</h2>

          <div className="space-y-5">
            <NumberField label="هزینه ثبت محصول (تومان)" value={newProductFee} onChange={setNewProductFee} />
            <NumberField label="هزینه تمدید (تومان)" value={renewalFee} onChange={setRenewalFee} />
            <NumberField label="مدت تمدید (ماه)" value={renewalMonths} onChange={setRenewalMonths} />
            <NumberField label="حداکثر قیمت محصول (تومان)" value={maxPrice} onChange={setMaxPrice} />

            <div>
              <label className="mb-2 block text-sm text-gray-300">ایمیل پشتیبانی</label>
              <input dir="ltr" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-4 text-white outline-none focus:border-[#d8aa4d]" />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">ایمیل پیشنهادات</label>
              <input dir="ltr" value={suggestionsEmail} onChange={(e) => setSuggestionsEmail(e.target.value)} className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-4 text-white outline-none focus:border-[#d8aa4d]" />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-[#40331d] bg-black px-4 py-4 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showSellerPhonePublic}
                onChange={(e) => setShowSellerPhonePublic(e.target.checked)}
                className="h-4 w-4 accent-[#d8aa4d]"
              />
              نمایش شماره تماس فروشندگان برای همه کاربران (نه فقط مدیر)
            </label>
          </div>

          {message && (
            <div className="mt-5 rounded-2xl border border-[#665122] bg-[#181307] p-4 text-sm text-[#e5c46b]">{message}</div>
          )}

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d8aa4d] py-4 font-bold text-black transition hover:bg-[#efc766] disabled:opacity-60"
          >
            <Save size={19} /> {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </button>
        </section>

        <footer className="py-8 text-center text-xs text-gray-600">
          سازنده این سایت: نیما حجتی
          <br />
          alphakade11@gmail.com
        </footer>
      </div>
    </main>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">{label}</label>
      <input
        dir="ltr"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(normalizePhone(e.target.value))}
        className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-4 text-white outline-none focus:border-[#d8aa4d]"
      />
    </div>
  );
              }
