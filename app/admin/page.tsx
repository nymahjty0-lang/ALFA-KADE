"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldCheck, ArrowRight, Package, Users, Settings, Trash2, EyeOff, Eye, Loader2, Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getClientAuth, formatPrice, fetchSiteSettings } from "@/lib/alfa";
import type { SiteSettings } from "@/lib/types";

const BASE_PATH = "/ALFA-KADE";

type ProductRow = {
  id: string;
  name: string;
  category: string | null;
  created_at: string;
  offerCount: number;
};

type OfferRow = {
  id: string;
  product_id: string;
  seller_name: string;
  seller_phone: string | null;
  price: number;
  is_active: boolean;
  registrant_name: string | null;
  registrant_phone: string | null;
  created_at: string;
  productName?: string;
};

export default function AdminPage() {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [tab, setTab] = useState<"products" | "sellers" | "overview">("overview");

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getClientAuth();
    setAllowed(auth.isAdmin);
    setChecked(true);

    if (auth.isAdmin) loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const settingsData = await fetchSiteSettings();
    setSettings(settingsData);

    if (supabase) {
      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, category, created_at")
        .order("created_at", { ascending: false });

      const { data: offersData } = await supabase
        .from("product_offers")
        .select("id, product_id, seller_name, seller_phone, price, is_active, registrant_name, registrant_phone, created_at")
        .order("created_at", { ascending: false });

      const offerCountByProduct: Record<string, number> = {};
      (offersData || []).forEach((o) => {
        offerCountByProduct[o.product_id] = (offerCountByProduct[o.product_id] || 0) + 1;
      });

      const productNameById: Record<string, string> = {};
      (productsData || []).forEach((p) => { productNameById[p.id] = p.name; });

      setProducts(
        (productsData || []).map((p) => ({
          ...p,
          offerCount: offerCountByProduct[p.id] || 0,
        }))
      );

      setOffers(
        (offersData || []).map((o) => ({
          ...o,
          productName: productNameById[o.product_id] || "—",
        }))
      );
    }

    setLoading(false);
  }

  async function deleteProduct(id: string) {
    if (!supabase) return;
    if (!confirm("این محصول و همه پیشنهادهای آن حذف شود؟")) return;

    await supabase.from("products").delete().eq("id", id);
    loadData();
  }

  async function toggleOffer(id: string, isActive: boolean) {
    if (!supabase) return;
    await supabase.from("product_offers").update({ is_active: !isActive }).eq("id", id);
    loadData();
  }

  if (!checked) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#070707] text-[#d8aa4d]">
        در حال بررسی دسترسی...
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#181307] p-3 text-[#d8aa4d]"><ShieldCheck size={25} /></div>
            <div>
              <h1 className="font-bold text-[#d8aa4d]">پنل مدیریت</h1>
              <p className="text-xs text-gray-600">ALFA KADE</p>
            </div>
          </div>
          <Link href={`${BASE_PATH}/settings`} className="flex items-center gap-2 rounded-xl border border-[#40331d] px-4 py-2 text-sm text-gray-300 hover:border-[#d8aa4d]">
            <Settings size={17} /> تنظیمات سایت
          </Link>
        </div>

        <div className="mb-6 flex gap-2 border-b border-[#242424] pb-3">
          <TabButton active={tab === "overview"} onClick={() => setTab("overview")} icon={<Mail size={16} />} label="کلی" />
          <TabButton active={tab === "products"} onClick={() => setTab("products")} icon={<Package size={16} />} label={`محصولات (${products.length})`} />
          <TabButton active={tab === "sellers"} onClick={() => setTab("sellers")} icon={<Users size={16} />} label={`فروشندگان (${offers.length})`} />
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-[#d8aa4d]"><Loader2 className="animate-spin" size={30} /></div>
        ) : tab === "overview" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="تعداد محصولات" value={String(products.length)} />
            <StatCard label="تعداد پیشنهادهای فروشندگان" value={String(offers.length)} />
            <StatCard label="هزینه ثبت محصول" value={settings ? `${formatPrice(settings.new_product_fee)} تومان` : "—"} />
            <StatCard label="هزینه تمدید" value={settings ? `${formatPrice(settings.renewal_fee)} تومان / ${settings.renewal_months} ماه` : "—"} />
            <StatCard label="ایمیل پشتیبانی" value={settings?.support_email || "—"} />
            <StatCard label="ایمیل پیشنهادات" value={settings?.suggestions_email || "—"} />
            <StatCard label="سقف قیمت هر محصول" value={settings ? `${formatPrice(settings.max_product_price)} تومان` : "—"} />
            <StatCard label="نمایش شماره فروشنده به عموم" value={settings?.show_seller_phone_public ? "فعال" : "غیرفعال"} />
          </div>
        ) : tab === "products" ? (
          <div className="overflow-x-auto rounded-3xl border border-[#2d2414] bg-[#0c0c0c]">
            <table className="w-full min-w-[600px] text-right">
              <thead>
                <tr className="border-b border-[#2d2414] text-sm text-gray-400">
                  <th className="p-4">نام محصول</th>
                  <th className="p-4">دسته‌بندی</th>
                  <th className="p-4">تعداد فروشندگان</th>
                  <th className="p-4">تاریخ ثبت</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[#1c1710] last:border-0">
                    <td className="p-4 font-bold">{p.name}</td>
                    <td className="p-4 text-sm text-gray-400">{p.category || "—"}</td>
                    <td className="p-4 text-sm text-gray-300">{p.offerCount}</td>
                    <td className="p-4 text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString("fa-IR")}</td>
                    <td className="p-4">
                      <button type="button" onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-[#2d2414] bg-[#0c0c0c]">
            <table className="w-full min-w-[800px] text-right">
              <thead>
                <tr className="border-b border-[#2d2414] text-sm text-gray-400">
                  <th className="p-4">محصول</th>
                  <th className="p-4">فروشنده</th>
                  <th className="p-4">قیمت</th>
                  <th className="p-4">ثبت‌کننده</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} className="border-b border-[#1c1710] last:border-0">
                    <td className="p-4">{o.productName}</td>
                    <td className="p-4 text-sm text-gray-300">{o.seller_name}{o.seller_phone ? ` · ${o.seller_phone}` : ""}</td>
                    <td className="p-4 font-bold text-[#d8aa4d]">{formatPrice(Number(o.price))}</td>
                    <td className="p-4 text-xs text-gray-500">{o.registrant_name || "—"}{o.registrant_phone ? ` · ${o.registrant_phone}` : ""}</td>
                    <td className="p-4 text-xs">
                      <span className={o.is_active ? "text-green-400" : "text-gray-500"}>{o.is_active ? "فعال" : "غیرفعال"}</span>
                    </td>
                    <td className="p-4">
                      <button type="button" onClick={() => toggleOffer(o.id, o.is_active)} className="text-gray-300 hover:text-[#d8aa4d]">
                        {o.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="py-10 text-center text-xs text-gray-600">
          سازنده این سایت: نیما حجتی
          <br />
          alphakade11@gmail.com
        </footer>
      </div>
    </main>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
        active ? "bg-[#181307] text-[#d8aa4d]" : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#2d2414] bg-[#0c0c0c] p-5">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-2 text-lg font-bold text-[#d8aa4d]">{value}</div>
    </div>
  );
        }
