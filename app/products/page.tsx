"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Store,
  Loader2,
  ArrowRight,
  ShoppingCart,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  category: string | null;
};

type Offer = {
  id: string;
  price: number;
  website_url: string | null;
  seller_name: string;
  seller_phone: string | null;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  seller: string;
  quantity: number;
};

const CART_KEY = "alfa_kade_cart";

const categories = [
  "گوشی موبایل",
  "کامپیوتر",
  "لپ‌تاپ",
  "تبلت",
  "ساعت هوشمند",
  "هدفون و هندزفری",
  "اسپیکر",
  "دوربین",
  "لوازم جانبی",
  "کنسول و بازی",
  "تلویزیون",
  "لوازم خانگی",
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(
    new Event("alfa-kade-cart-updated")
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] =
    useState(false);
  const [search, setSearch] = useState("");
  const [addedOfferId, setAddedOfferId] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(
        window.location.search
      );

      const slug = params.get("slug");

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, image_url, category"
        )
        .order("created_at", {
          ascending: false,
        });

      if (!error && data) {
        setProducts(data as Product[]);
      }

      if (slug) {
        const { data: product } = await supabase
          .from("products")
          .select(
            "id, name, slug, image_url, category"
          )
          .eq("slug", slug)
          .maybeSingle();

        if (product) {
          const selected = product as Product;

          setSelectedProduct(selected);

          await loadOffers(selected.id);
        }
      }

      setLoading(false);
    }

    async function loadOffers(productId: string) {
      if (!supabase) return;

      setOffersLoading(true);

      const { data, error } = await supabase
        .from("product_offers")
        .select(
          "id, price, website_url, seller_name, seller_phone"
        )
        .eq("product_id", productId)
        .order("price", {
          ascending: true,
        });

      if (!error && data) {
        setOffers(data as Offer[]);
      } else {
        setOffers([]);
      }

      setOffersLoading(false);
    }

    void loadProducts();
  }, []);

  async function openProduct(product: Product) {
    setSelectedProduct(product);
    setOffers([]);

    window.history.pushState(
      {},
      "",
      `/ALFA-KADE/products?slug=${encodeURIComponent(
        product.slug
      )}`
    );

    if (!supabase) return;

    setOffersLoading(true);

    const { data, error } = await supabase
      .from("product_offers")
      .select(
        "id, price, website_url, seller_name, seller_phone"
      )
      .eq("product_id", product.id)
      .order("price", {
        ascending: true,
      });

    if (!error && data) {
      setOffers(data as Offer[]);
    }

    setOffersLoading(false);
  }

  function backToProducts() {
    setSelectedProduct(null);
    setOffers([]);

    window.history.pushState(
      {},
      "",
      "/ALFA-KADE/products"
    );
  }

  function addToCart(offer: Offer) {
    if (!selectedProduct) return;

    const cart = readCart();

    const index = cart.findIndex(
      (item) => item.id === offer.id
    );

    if (index >= 0) {
      cart[index] = {
        ...cart[index],
        quantity: cart[index].quantity + 1,
      };
    } else {
      cart.push({
        id: offer.id,
        name: selectedProduct.name,
        price: Number(offer.price),
        image: selectedProduct.image_url,
        seller: offer.seller_name,
        quantity: 1,
      });
    }

    saveCart(cart);

    setAddedOfferId(offer.id);

    window.setTimeout(() => {
      setAddedOfferId(null);
    }, 1500);
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase())
  );

  if (selectedProduct) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#070707] px-4 py-8 text-white"
      >
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={backToProducts}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#d8aa4d]"
          >
            <ArrowRight size={18} />
            بازگشت به محصولات
          </button>

          <section className="rounded-3xl border border-[#2d2414] bg-[#0c0c0c] p-6">
            <div className="grid gap-8 md:grid-cols-[280px_1fr]">
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl bg-[#090909] p-5">
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="max-h-64 max-w-full object-contain"
                  />
                ) : (
                  <Store
                    size={50}
                    className="text-[#80652f]"
                  />
                )}
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-[#d8aa4d]">
                  ALFA KADE
                </span>

                <h1 className="mt-3 text-3xl font-black">
                  {selectedProduct.name}
                </h1>

                {selectedProduct.category && (
                  <p className="mt-3 text-sm text-gray-500">
                    دسته‌بندی:{" "}
                    {selectedProduct.category}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-xl border border-[#2d2414] px-4 py-3 text-sm text-gray-400">
                    فروشندگان:
                    <span className="mr-2 font-bold text-[#d8aa4d]">
                      {offers.length}
                    </span>
                  </div>

                  {offers.length > 0 && (
                    <div className="rounded-xl border border-[#2d2414] px-4 py-3 text-sm text-gray-400">
                      ارزان‌ترین:
                      <span className="mr-2 font-bold text-[#d8aa4d]">
                        {formatPrice(
                          Number(offers[0].price)
                        )}{" "}
                        تومان
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">
                مقایسه قیمت فروشندگان
              </h2>

              <Link
                href="/cart"
                className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-2 text-sm text-[#d8aa4d]"
              >
                <ShoppingCart size={18} />
                سبد خرید
              </Link>
            </div>

            {offersLoading ? (
              <div className="py-16 text-center text-[#d8aa4d]">
                <Loader2
                  className="mx-auto animate-spin"
                  size={30}
                />
              </div>
            ) : offers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#3a2e18] bg-[#0c0c0c] p-14 text-center">
                <Store
                  size={40}
                  className="mx-auto mb-4 text-[#d8aa4d]"
                />

                <h3 className="font-bold">
                  هنوز فروشنده‌ای ثبت نشده است
                </h3>

                <Link
                  href="/products/register"
                  className="mt-5 inline-block rounded-xl bg-[#d8aa4d] px-6 py-3 font-bold text-black"
                >
                  ثبت قیمت
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {offers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="rounded-2xl border border-[#2d2414] bg-[#0c0c0c] p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#17130c] text-[#d8aa4d]">
                          <Store size={22} />
                        </div>

                        <div>
                          <p className="font-bold">
                            {offer.seller_name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {index === 0
                              ? "ارزان‌ترین پیشنهاد"
                              : `پیشنهاد ${index + 1}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-2xl font-black text-[#d8aa4d]">
                        {formatPrice(
                          Number(offer.price)
                        )}
                        <span className="mr-1 text-xs font-normal text-gray-500">
                          تومان
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {offer.website_url && (
                          <a
                            href={offer.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-[#3a2e18] px-4 py-2.5 text-sm text-gray-300 hover:border-[#d8aa4d]"
                          >
                            مشاهده سایت
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            addToCart(offer)
                          }
                          className="flex items-center gap-2 rounded-xl bg-[#d8aa4d] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#efc766]"
                        >
                          {addedOfferId === offer.id ? (
                            <>
                              <Check size={17} />
                              اضافه شد
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={17} />
                              افزودن به سبد
                            </>
                          )}
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
    <main
      dir="rtl"
      className="min-h-screen bg-[#070707] px-4 py-8 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">
              همه محصولات
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              محصولات را پیدا کنید و قیمت فروشندگان را مقایسه
              کنید.
            </p>
          </div>

          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-3 text-sm text-[#d8aa4d]"
          >
            <ShoppingCart size={18} />
            سبد خرید
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-[#2d2414] bg-[#0c0c0c] px-4 py-3">
          <Search
            size={20}
            className="text-[#d8aa4d]"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="جستجوی محصول..."
            className="w-full bg-transparent text-white outline-none placeholder:text-gray-600"
          />
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/search?q=${encodeURIComponent(
                category
              )}`}
              className="rounded-2xl border border-[#2d2414] bg-[#0c0c0c] p-4 text-center text-sm font-bold text-gray-300 hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
            >
              {category}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#d8aa4d]">
            <Loader2
              className="mx-auto animate-spin"
              size={30}
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#3a2e18] bg-[#0c0c0c] p-16 text-center">
            <Search
              size={40}
              className="mx-auto mb-4 text-[#d8aa4d]"
            />

            <h2 className="font-bold">
              محصولی پیدا نشد
            </h2>

            <Link
              href="/products/register"
              className="mt-6 inline-block rounded-xl bg-[#d8aa4d] px-6 py-3 font-bold text-black"
            >
              ثبت محصول
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => void openProduct(product)}
                className="overflow-hidden rounded-2xl border border-[#2d2414] bg-[#0c0c0c] text-right hover:border-[#d8aa4d]"
              >
                <div className="flex h-48 items-center justify-center bg-[#090909] p-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Store
                      size={40}
                      className="text-[#80652f]"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold leading-7">
                    {product.name}
                  </h3>

                  {product.category && (
                    <p className="mt-2 text-xs text-gray-600">
                      {product.category}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-gray-500">
                    مشاهده قیمت فروشندگان
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
          }
