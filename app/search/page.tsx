"use client";

import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
};

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";

    setQuery(initialQuery);
    searchProducts(initialQuery);
  }, []);

  async function searchProducts(value: string) {
    if (!supabase) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let request = supabase
      .from("products")
      .select("id, title, slug, image_url")
      .order("title", { ascending: true })
      .limit(100);

    if (value.trim()) {
      request = request.ilike("title", `%${value.trim()}%`);
    }

    const { data, error } = await request;

    if (error) {
      console.error(error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    const value = query.trim();

    if (value) {
      window.history.pushState(
        {},
        "",
        `/search?q=${encodeURIComponent(value)}`
      );
    } else {
      window.history.pushState({}, "", "/search");
    }

    searchProducts(value);
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 text-center">
          <div className="mb-3 inline-block rounded-full border border-[#3a2e18] bg-[#0d0d0d] px-5 py-2 text-sm text-[#d8aa4d]">
            ALFA KADE
          </div>

          <h1 className="text-3xl font-black text-white md:text-5xl">
            جستجوی محصولات
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            محصول موردنظر خود را پیدا کنید و قیمت فروشندگان را مقایسه کنید.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mx-auto mb-10 max-w-3xl"
        >
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="مثلاً آیفون، لپ‌تاپ، تلویزیون..."
              className="w-full rounded-2xl border border-[#3a2e18] bg-[#101010] px-5 py-4 pl-28 text-right text-white outline-none placeholder:text-gray-600 focus:border-[#d8aa4d]"
            />

            <button
              type="submit"
              className="absolute left-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-black"
              style={{ background: "#d8aa4d" }}
            >
              <Search size={17} />
              جستجو
            </button>
          </div>
        </form>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {query
              ? `نتایج جستجو برای «${query}»`
              : "همه محصولات"}
          </h2>

          <span className="text-sm text-gray-600">
            {products.length} محصول
          </span>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[#2d2414] bg-[#0c0c0c] py-16 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#d8aa4d] border-t-transparent" />

            <p className="text-sm text-gray-500">
              در حال جستجو...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#3a2e18] bg-[#0c0c0c] px-5 py-16 text-center">
            <ShoppingBag
              size={42}
              className="mx-auto mb-4 text-[#d8aa4d]"
            />

            <h3 className="text-xl font-bold text-gray-200">
              محصولی پیدا نشد
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              نام محصول دیگری را جستجو کنید یا اولین محصول را ثبت کنید.
            </p>

            <Link
              href="/products/register"
              className="mt-6 inline-block rounded-xl px-6 py-3 text-sm font-bold text-black"
              style={{ background: "#d8aa4d" }}
            >
              ثبت محصول
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products?slug=${encodeURIComponent(product.slug)}`}
                className="group overflow-hidden rounded-2xl border border-[#2d2414] bg-[#0c0c0c] transition hover:-translate-y-1 hover:border-[#d8aa4d]"
              >
                <div className="flex h-48 items-center justify-center bg-[#090909] p-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <ShoppingBag
                      size={42}
                      className="text-[#80652f]"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-gray-200 transition group-hover:text-[#d8aa4d]">
                    {product.title}
                  </h3>

                  <div className="mt-3 text-xs text-gray-600">
                    مشاهده قیمت‌ها
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
