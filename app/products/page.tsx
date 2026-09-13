"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, Store, Loader2, ArrowRight, ShoppingCart, Check, Scale, Globe2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchCategories, fetchSiteSettings, formatPrice, getClientAuth } from "@/lib/alfa";
import type { Category, SiteSettings } from "@/lib/types";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
};

type Offer = {
  id: string;
  price: number;
  website_url: string | null;
  seller_name: string;
  seller_phone: string | null;
  source_type: "direct" | "website";
};

type CartItem = {
  id: string; name: string; price: number; image: string | null; seller: string; quantity: number;
};

const CART_KEY = "alfa_kade_cart";
const COMPARE_KEY = "alfa_kade_compare";

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("alfa-kade-cart-updated"));
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [addedOfferId, setAddedOfferId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(getClientAuth().isAdmin);
    setCompareIds(readList<string>(COMPARE_KEY));
    fetchCategories().then(setCategories);
    fetchSiteSettings().then(setSettings);

    async function loadProducts() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const slug = params.get("slug");

      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, description, image_url, category")
        .order("created_at", { ascending: false });

      if (!error && data) setProducts(data as Product[]);

      if (slug) {
        const { data: productData } = await supabase
          .from("products")
          .select("id, name, slug, description, image_url, category")
          .eq("slug", slug)
          .maybeSingle();

        if (productData) {
          const product = productData as Product;
          setSelectedProduct(product);
          await loadOffers(product.id);
        }
      }

      setLoading(false);
    }

    async function loadOffers(productId: string) {
      if (!supabase) return;
      setOffersLoading(true);

      const { data, error } = await supabase
        .from("product_offers")
        .select("id, price, website_url, seller_name, seller_phone, source_type")
        .eq("product_id", productId)
        .eq("is_active", true)
        .order("price", { ascending: true });

      setOffers(!error && data ? (data as Offer[]) : []);
      setOffersLoading(false);
    }

    loadProducts();

    const handlePopState = () => window.location.reload();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  async function openProduct(product: Product) {
    setSelectedProduct(product);
    window.history.pushState({}, "", `/ALFA-KADE/products?slug=${encodeURIComponent(product.slug)}`);

    if (!supabase) return;
    setOffers([]);
    setOffersLoading(true);

    const { data, error } = await supabase
      .from("product_offers")
      .select("id, price, website_url, seller_name, seller_phone, source_type")
      .eq("product_id", product.id)
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (!error && data) setOffers(data as Offer[]);
    setOffersLoading(false);
  }

  function backToProducts() {
    setSelectedProduct(null);
    setOffers([]);
    window.history.pushState({}, "", "/ALFA-KADE/products");
  }

  function addToCart(offer: Offer) {
    if (!selectedProduct) return;
    const cart = readList<CartItem>(CART_KEY);
    const existingIndex = cart.findIndex((item) => item.id === offer.id);

    if (existingIndex >= 0) {
      cart[existingIndex] = { ...cart[existingIndex], quantity: cart[existingIndex].quantity + 1 };
    } else {
      cart.push({
        id: offer.id, name: selectedProduct.name, price: Number(offer.price),
        image: selectedProduct.image_url, seller: offer.seller_name, quantity: 1,
      });
    }

    saveCart(cart);
    setAddedOfferId(offer.id);
    window.setTimeout(() => setAddedOfferId(null), 1500);
  }

  function toggleCompare(productId: string) {
    setCompareIds((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : current.length >= 4
          ? current
          : [...current, productId];

      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase().trim());
    const matchesCategory = !activeCategory || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedProduct) {
    const canSeePhone = isAdmin || settings?.show_seller_phone_public;

    return (
      <main dir="rtl" className="min-h-screen bg-[#070707] px-4 py-8 text-white md:py-12">
        <div className="mx-auto max-w-6xl">
          <button type="button" onClick={backToProducts} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#d8aa4d]">
            <ArrowRight size={18} /> بازگشت به همه محصولات
          </button>

          <section className="overflow-hidden rounded-3xl border border-[#2d2414] bg-[#0c0c0c]">
            <div className="grid gap-8 p-6 md:grid-cols-[280px_1fr] md:p-10">
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-[#2d2414] bg-[#090909] p-5">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="max-h-64 max-w-full rounded-xl object-contain" />
                ) : (
                  <div className="text-center text-gray-600">تصویر محصول موجود نیست</div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <div className="mb-3 text-sm font-bold text-[#d8aa4d]">ALFA KADE</div>
                <h1 className="text-3xl font-black leading-10 md:text-4xl">{selectedProduct.name}</h1>

                {selectedProduct.category && (
                  <div className="mt-4 text-sm text-gray-500">دسته‌بندی: {selectedProduct.category}</div>
                )}

                {selectedProduct.description && (
                  <p className="mt-4 text-sm leading-7 text-gray-500">{selectedProduct.description}</p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-xl border border-[#2d2414] bg-[#11100d] px-4 py-3 text-sm text-gray-300">
                    تعداد فروشندگان:<span className="mr-2 font-bold text-[#d8aa4d]">{offers.length}</span>
                  </div>

                  {offers.length > 0 && (
                    <div className="rounded-xl border border-[#2d2414] bg-[#11100d] px-4 py-3 text-sm text-gray-300">
                      شروع قیمت از:
                      <span className="mr-2 font-bold text-[#d8aa4d]">{formatPrice(Number(offers[0].price))} تومان</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">مقایسه قیمت فروشندگان</h2>
              <Link href="/cart" className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-2 text-sm text-[#d8aa4d] hover:bg-[#181307]">
                <ShoppingCart size={18} /> سبد خرید
              </Link>
            </div>

            {offersLoading ? (
              <div className="flex justify-center py-16 text-[#d8aa4d]"><Loader2 className="animate-spin" size={28} /></div>
            ) : offers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#3a2e18] bg-[#0c0c0c] px-5 py-14 text-center">
                <Store size={40} className="mx-auto mb-4 text-[#d8aa4d]" />
                <h3 className="text-lg font-bold text-gray-200">هنوز فروشنده‌ای ثبت نشده است</h3>
                <Link href="/products/register" className="mt-6 inline-block rounded-xl bg-[#d8aa4d] px-6 py-3 text-sm font-bold text-black">ثبت قیمت محصول</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {offers.map((offer, index) => (
                  <div key={offer.id} className="rounded-2xl border border-[#2d2414] bg-[#0c0c0c] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#17130c] text-[#d8aa4d]">
                          {offer.source_type === "website" ? <Globe2 size={22} /> : <Store size={22} />}
                        </div>
                        <div>
                          <div className="font-bold text-white">{offer.seller_name}</div>
                          <div className="mt-1 text-xs text-gray-500">
                            {index === 0 ? "ارزان‌ترین پیشنهاد" : `پیشنهاد شماره ${index + 1}`}
                            {canSeePhone && offer.seller_phone ? ` · ${offer.seller_phone}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-2xl font-black text-[#d8aa4d]">
                        {formatPrice(Number(offer.price))}<span className="mr-1 text-xs font-normal text-gray-500">تومان</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {offer.website_url && (
                          <a href={offer.website_url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#3a2e18] px-4 py-2.5 text-sm text-gray-300 hover:border-[#d8aa4d] hover:text-[#d8aa4d]">مشاهده سایت</a>
                        )}
                        <button type="button" onClick={() => addToCart(offer)} className="flex items-center gap-2 rounded-xl bg-[#d8aa4d] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#efc766]">
                          {addedOfferId === offer.id ? (<><Check size={17} /> اضافه شد</>) : (<><ShoppingCart size={17} /> افزودن به سبد</>)}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#070707] px-4 py-8 text-white md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">همه محصولات</h1>
            <p className="mt-3 text-gray-500">دسته‌بندی و محصولات موردنظر خود را پیدا کنید.</p>
          </div>

          <div className="flex gap-2">
            {compareIds.length > 0 && (
              <Link href="/compare" className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-3 text-sm text-[#d8aa4d] hover:bg-[#181307]">
                <Scale size={18} /> مقایسه ({compareIds.length})
              </Link>
            )}
            <Link href="/cart" className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-3 text-sm text-[#d8aa4d] hover:bg-[#181307]">
              <ShoppingCart size={19} /> سبد خرید
            </Link>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#2d2414] bg-[#0c0c0c] px-4 py-3">
          <Search size={20} className="text-[#d8aa4d]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجوی محصول..." className="w-full bg-transparent text-white outline-none placeholder:text-gray-600" />
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          <button type="button" onClick={() => setActiveCategory("")} className={`rounded-2xl border px-4 py-2 text-sm font-bold transition ${activeCategory === "" ? "border-[#d8aa4d] text-[#d8aa4d]" : "border-[#2d2414] text-gray-300 hover:border-[#d8aa4d] hover:text-[#d8aa4d]"}`}>
            همه
          </button>
          {categories.map((category) => (
            <button key={category.id} type="button" onClick={() => setActiveCategory(category.name)} className={`rounded-2xl border px-4 py-2 text-sm font-bold transition ${activeCategory === category.name ? "border-[#d8aa4d] text-[#d8aa4d]" : "border-[#2d2414] text-gray-300 hover:border-[#d8aa4d] hover:text-[#d8aa4d]"}`}>
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-[#d8aa4d]"><Loader2 className="animate-spin" size={30} /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#3a2e18] bg-[#0c0c0c] px-5 py-16 text-center">
            <Search size={40} className="mx-auto mb-4 text-[#d8aa4d]" />
            <h2 className="text-xl font-bold">هنوز محصولی پیدا نشد</h2>
            <p className="mt-2 text-sm text-gray-600">می‌توانید اولین محصول را در آلفا کده ثبت کنید.</p>
            <Link href="/products/register" className="mt-6 inline-block rounded-xl bg-[#d8aa4d] px-6 py-3 text-sm font-bold text-black">ثبت محصول</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="overflow-hidden rounded-2xl border border-[#2d2414] bg-[#0c0c0c] transition hover:border-[#d8aa4d]">
                <button type="button" onClick={() => openProduct(product)} className="block w-full text-right">
                  <div className="flex h-48 items-center justify-center bg-[#090909] p-4">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Store className="text-[#80652f]" size={40} />
                    )}
                  </div>
                  <div className="p-4 pb-2">
                    <h3 className="font-bold leading-7">{product.name}</h3>
                    <div className="mt-3 text-xs text-gray-500">مشاهده قیمت فروشندگان</div>
                  </div>
                </button>

                <div className="px-4 pb-4">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-400">
                    <input type="checkbox" checked={compareIds.includes(product.id)} onChange={() => toggleCompare(product.id)} className="accent-[#d8aa4d]" />
                    افزودن به مقایسه
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
  }
