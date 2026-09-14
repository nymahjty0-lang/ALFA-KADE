"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Scale, Trash2, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/alfa";

const COMPARE_KEY = "alfa_kade_compare";

type Row = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  category: string | null;
  cheapestPrice: number | null;
  cheapestSeller: string | null;
  offerCount: number;
};

export default function ComparePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    let ids: string[] = [];
    try {
      ids = JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
    } catch {
      ids = [];
    }

    if (!supabase || ids.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }

    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, image_url, category")
      .in("id", ids);

    const result: Row[] = [];

    for (const product of products || []) {
      const { data: offers } = await supabase
        .from("product_offers")
        .select("price, seller_name")
        .eq("product_id", product.id)
        .eq("is_active", true)
        .order("price", { ascending: true })
        .limit(1);

      const { count } = await supabase
        .from("product_offers")
        .select("id", { count: "exact", head: true })
        .eq("product_id", product.id)
        .eq("is_active", true);

      result.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image_url: product.image_url,
        category: product.category,
        cheapestPrice: offers && offers.length > 0 ? Number(offers[0].price) : null,
        cheapestSeller: offers && offers.length > 0 ? offers[0].seller_name : null,
        offerCount: count || 0,
      });
    }

    setRows(result);
    setLoading(false);
  }

  function remove(id: string) {
    const next = rows.filter((r) => r.id !== id).map((r) => r.id);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
    setRows((current) => current.filter((r) => r.id !== id));
  }

  function clearAll() {
    localStorage.setItem(COMPARE_KEY, "[]");
    setRows([]);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#070707] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-[#d8aa4d]">
              <Scale size={24} /> مقایسه محصولات
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              قیمت‌ها از ارزان‌ترین فروشنده هر محصول نمایش داده می‌شود.
            </p>
          </div>
          <Link href="/products" className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-2 text-sm text-[#d8aa4d] hover:bg-[#181307]">
            <ArrowRight size={17} /> رفتن به محصولات
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[#2d2414] bg-[#0c0c0c] py-16 text-center text-gray-500">در حال بارگذاری...</div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#3a2e18] bg-[#0c0c0c] px-5 py-16 text-center">
            <Scale size={40} className="mx-auto mb-4 text-[#d8aa4d]" />
            <h2 className="text-xl font-bold">هنوز محصولی برای مقایسه انتخاب نشده</h2>
            <p className="mt-2 text-sm text-gray-600">از صفحه محصولات، گزینه «افزودن به مقایسه» را بزنید.</p>
            <Link href="/products" className="mt-6 inline-block rounded-xl bg-[#d8aa4d] px-6 py-3 text-sm font-bold text-black">رفتن به محصولات</Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-3xl border border-[#2d2414] bg-[#0c0c0c]">
              <table className="w-full min-w-[600px] text-right">
                <thead>
                  <tr className="border-b border-[#2d2414] text-sm text-gray-400">
                    <th className="p-4">محصول</th>
                    <th className="p-4">دسته‌بندی</th>
                    <th className="p-4">ارزان‌ترین قیمت</th>
                    <th className="p-4">فروشنده</th>
                    <th className="p-4">تعداد فروشندگان</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-[#1c1710] last:border-0">
                      <td className="flex items-center gap-3 p-4">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#090909]">
                          {row.image_url ? (
                            <img src={row.image_url} alt={row.name} className="h-full w-full object-contain" />
                          ) : (
                            <Store size={20} className="text-[#80652f]" />
                          )}
                        </div>
                        <Link href={`/products?slug=${encodeURIComponent(row.slug)}`} className="font-bold hover:text-[#d8aa4d]">{row.name}</Link>
                      </td>
                      <td className="p-4 text-sm text-gray-400">{row.category || "—"}</td>
                      <td className="p-4 font-bold text-[#d8aa4d]">
                        {row.cheapestPrice ? `${formatPrice(row.cheapestPrice)} تومان` : "—"}
                      </td>
                      <td className="p-4 text-sm text-gray-300">{row.cheapestSeller || "—"}</td>
                      <td className="p-4 text-sm text-gray-300">{row.offerCount}</td>
                      <td className="p-4">
                        <button type="button" onClick={() => remove(row.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" onClick={clearAll} className="mt-5 rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
              پاک کردن مقایسه
            </button>
          </>
        )}
      </div>
    </main>
  );
  }
