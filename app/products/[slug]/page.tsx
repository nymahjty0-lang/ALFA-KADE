"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Store, Globe, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
};

type Offer = {
  id: string;
  price: number;
  seller_url: string | null;
  source_type: string | null;
  seller: {
    name: string;
    phone: string | null;
    website: string | null;
  } | null;
};

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const slug = window.location.pathname.split("/").filter(Boolean).pop();

        if (!slug) {
          setError("محصول پیدا نشد.");
          setLoading(false);
          return;
        }

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("id, title, slug, image_url")
          .eq("slug", slug)
          .single();

        if (productError || !productData) {
          setError("این محصول پیدا نشد.");
          setLoading(false);
          return;
        }

        setProduct(productData);

        const { data: offerData, error: offerError } = await supabase
          .from("offers")
          .select(`
            id,
            price,
            seller_url,
            source_type,
            seller:sellers (
              name,
              phone,
              website
            )
          `)
          .eq("product_id", productData.id)
          .order("price", { ascending: true });

        if (offerError) {
          console.error(offerError);
          setOffers([]);
        } else {
          setOffers((offerData || []) as unknown as Offer[]);
        }
      } catch (err) {
        console.error(err);
        setError("خطایی در دریافت اطلاعات محصول رخ داد.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, []);

  function formatPrice(price: number) {
    return new Intl.NumberFormat("fa-IR").format(price);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707]">
        <div className="flex items-center gap-3 text-[#d8aa4d]">
          <Loader2 className="animate-spin" size={24} />
          <span>در حال دریافت اطلاعات محصول...</span>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#070707] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#2d2414] bg-[#0c0c0c] p-10 text-center">
          <h1 className="text-2xl font-black text-white">
            محصول پیدا نشد
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {error || "اطلاعات این محصول در دسترس نیست."}
          </p>

          <Link
            href="/products"
            className="mt-7 inline-block rounded-xl px-6 py-3 text-sm font-bold text-black"
            style={{ background: "#d8aa4d" }}
          >
            بازگشت به همه محصولات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#d8aa4d]"
        >
          <ArrowRight size={18} />
          بازگشت به محصولات
        </Link>

        {/* Product information */}
        <section className="overflow-hidden rounded-3xl border border-[#2d2414] bg-[#0c0c0c]">
          <div className="grid gap-8 p-6 md:grid-cols-[280px_1fr] md:p-10">

            {/* Image */}
            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-[#2d2414] bg-[#090909] p-5">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="max-h-64 max-w-full rounded-xl object-contain"
                />
              ) : (
                <div className="text-center text-gray-600">
                  تصویر محصول موجود نیست
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <div className="mb-3 text-sm font-bold text-[#d8aa4d]">
                ALFA KADE
              </div>

              <h1 className="text-3xl font-black leading-10 text-white md:text-4xl">
                {product.title}
              </h1>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                قیمت این محصول را از فروشندگان مختلف مقایسه کنید و بهترین
                پیشنهاد را انتخاب کنید.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-xl border border-[#2d2414] bg-[#11100d] px-4 py-3 text-sm text-gray-300">
                  تعداد فروشندگان:{" "}
                  <span className="font-bold text-[#d8aa4d]">
                    {offers.length}
                  </span>
                </div>

                {offers.length > 0 && (
                  <div className="rounded-xl border border-[#2d2414] bg-[#11100d] px-4 py-3 text-sm text-gray-300">
                    شروع قیمت از:{" "}
                    <span className="font-bold text-[#d8aa4d]">
                      {formatPrice(offers[0].price)} تومان
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Offers */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">
              مقایسه قیمت فروشندگان
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              قیمت‌ها از ارزان‌ترین تا گران‌ترین مرتب شده‌اند.
            </p>
          </div>

          {offers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#3a2e18] bg-[#0c0c0c] px-5 py-14 text-center">
              <Store
                size={40}
                className="mx-auto mb-4 text-[#d8aa4d]"
              />

              <h3 className="text-lg font-bold text-gray-200">
                هنوز فروشنده‌ای برای این محصول ثبت نشده است
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                اولین فروشنده باشید و قیمت محصول را ثبت کنید.
              </p>

              <Link
                href="/products/register"
                className="mt-6 inline-block rounded-xl px-6 py-3 text-sm font-bold text-black"
                style={{ background: "#d8aa4d" }}
              >
                ثبت قیمت محصول
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {offers.map((offer, index) => (
                <div
                  key={offer.id}
                  className="rounded-2xl border border-[#2d2414] bg-[#0c0c0c] p-5 transition hover:border-[#80652f]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    {/* Seller */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#17130c] text-[#d8aa4d]">
                        <Store size={22} />
                      </div>

                      <div>
                        <div className="font-bold text-white">
                          {offer.seller?.name || "فروشنده"}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {index === 0
                            ? "ارزان‌ترین پیشنهاد"
                            : `پیشنهاد شماره ${index + 1}`}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right md:text-center">
                      <div className="text-xs text-gray-500">
                        قیمت
                      </div>

                      <div className="mt-1 text-2xl font-black text-[#d8aa4d]">
                        {formatPrice(offer.price)}
                        <span className="mr-1 text-xs font-normal text-gray-500">
                          تومان
                        </span>
                      </div>
                    </div>

                    {/* Contact / Website */}
                    <div className="flex flex-wrap gap-2">
                      {offer.seller_url && (
                        <a
                          href={offer.seller_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
                        >
                          <Globe size={16} />
                          مشاهده سایت
                        </a>
                      )}

                      {!offer.seller_url && offer.seller?.website && (
                        <a
                          href={offer.seller.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
                        >
                          <Globe size={16} />
                          سایت فروشنده
                        </a>
                      )}

                      {offer.seller?.phone && (
                        <a
                          href={`tel:${offer.seller.phone}`}
                          className="flex items-center gap-2 rounded-xl border border-[#3a2e18] px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#d8aa4d] hover:text-[#d8aa4d]"
                        >
                          <Phone size={16} />
                          تماس
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <div className="mt-10 rounded-3xl border border-[#2d2414] bg-[#0c0c0c] p-6 text-center">
          <h3 className="text-lg font-bold text-white">
            قیمت این محصول را دارید؟
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            شما هم می‌توانید قیمت و اطلاعات فروشگاه خود را ثبت کنید.
          </p>

          <Link
            href="/products/register"
            className="mt-5 inline-block rounded-xl px-6 py-3 text-sm font-bold text-black"
            style={{ background: "#d8aa4d" }}
          >
            ثبت قیمت و فروشگاه
          </Link>
        </div>

      </div>
    </main>
  );
          }
