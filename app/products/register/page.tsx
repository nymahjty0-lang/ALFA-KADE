"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Globe,
  Store,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const MAX_PRICE = 500_000_000;

export default function RegisterProductPage() {
  const [mode, setMode] = useState<"website" | "direct">("website");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerWebsite, setSellerWebsite] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function cleanPrice(value: string) {
    return value.replace(/[^\d]/g, "");
  }

  function formatPrice(value: string) {
    const number = Number(cleanPrice(value));

    if (!number) return "";

    return new Intl.NumberFormat("fa-IR").format(number);
  }

  function makeSlug(title: string) {
    return (
      title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u0600-\u06FF-]+/g, "") +
      "-" +
      Date.now()
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");

    const numericPrice = Number(cleanPrice(price));

    if (!fullName.trim()) {
      setError("نام و نام خانوادگی را وارد کنید.");
      return;
    }

    if (!phone.trim()) {
      setError("شماره موبایل را وارد کنید.");
      return;
    }

    if (!nationalId.trim()) {
      setError("کد ملی را وارد کنید.");
      return;
    }

    if (!birthDate) {
      setError("تاریخ تولد را وارد کنید.");
      return;
    }

    if (!productName.trim()) {
      setError("نام محصول را وارد کنید.");
      return;
    }

    if (!numericPrice || numericPrice <= 0) {
      setError("قیمت محصول را به‌درستی وارد کنید.");
      return;
    }

    if (numericPrice > MAX_PRICE) {
      setError("قیمت محصول نمی‌تواند بیشتر از ۵۰۰ میلیون تومان باشد.");
      return;
    }

    if (!sellerName.trim()) {
      setError("نام فروشنده یا فروشگاه را وارد کنید.");
      return;
    }

    if (mode === "website" && !sellerWebsite.trim()) {
      setError("آدرس سایت فروشنده را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      // بررسی اینکه محصول از قبل ثبت شده یا نه
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id, title, slug, image_url")
        .ilike("title", productName.trim())
        .maybeSingle();

      let productId = existingProduct?.id;
      let productSlug = existingProduct?.slug;

      // اگر محصول جدید باشد
      if (!existingProduct) {
        if (!image) {
          setError(
            "برای محصول جدید باید تصویر محصول را انتخاب کنید."
          );
          setLoading(false);
          return;
        }

        const slug = makeSlug(productName);

        const fileName = `${Date.now()}-${image.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        )}`;

        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, image);

        if (uploadError) {
          console.error(uploadError);
          setError("آپلود تصویر انجام نشد.");
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        const { data: newProduct, error: productError } =
          await supabase
            .from("products")
            .insert({
              title: productName.trim(),
              slug,
              image_url: publicUrlData.publicUrl,
            })
            .select("id, slug")
            .single();

        if (productError || !newProduct) {
          console.error(productError);
          setError("ثبت محصول انجام نشد.");
          setLoading(false);
          return;
        }

        productId = newProduct.id;
        productSlug = newProduct.slug;
      }

      if (!productId) {
        setError("شناسه محصول پیدا نشد.");
        setLoading(false);
        return;
      }

      // پیدا کردن یا ساخت فروشنده
      let sellerId: string | null = null;

      const { data: existingSeller } = await supabase
        .from("sellers")
        .select("id")
        .eq("name", sellerName.trim())
        .maybeSingle();

      if (existingSeller) {
        sellerId = existingSeller.id;
      } else {
        const { data: newSeller, error: sellerError } =
          await supabase
            .from("sellers")
            .insert({
              name: sellerName.trim(),
              phone: sellerPhone.trim() || null,
              website:
                mode === "website"
                  ? sellerWebsite.trim()
                  : null,
            })
            .select("id")
            .single();

        if (sellerError || !newSeller) {
          console.error(sellerError);
          setError("ثبت اطلاعات فروشنده انجام نشد.");
          setLoading(false);
          return;
        }

        sellerId = newSeller.id;
      }

      // ثبت قیمت
      const { error: offerError } = await supabase
        .from("offers")
        .insert({
          product_id: productId,
          seller_id: sellerId,
          price: numericPrice,
          seller_url:
            mode === "website"
              ? sellerWebsite.trim()
              : null,
          source_type: mode,
        });

      if (offerError) {
        console.error(offerError);
        setError(
          "قیمت ثبت نشد. ممکن است این فروشنده قبلاً برای محصول ثبت شده باشد."
        );
        setLoading(false);
        return;
      }

      setMessage("محصول و قیمت با موفقیت ثبت شد.");

      // پاک کردن فرم
      setProductName("");
      setPrice("");
      setSellerName("");
      setSellerWebsite("");
      setSellerPhone("");
      setImage(null);

      if (productSlug) {
        setTimeout(() => {
          window.location.href = `/products/${productSlug}`;
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError("خطایی رخ داد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#d8aa4d]"
        >
          <ArrowRight size={18} />
          بازگشت به محصولات
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-block rounded-full border border-[#3a2e18] bg-[#0d0d0d] px-5 py-2 text-sm text-[#d8aa4d]">
            ALFA KADE
          </div>

          <h1 className="text-3xl font-black text-white md:text-4xl">
            ثبت محصول و قیمت
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            محصول جدید را ثبت کنید یا قیمت خود را به محصول موجود اضافه کنید.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#2d2414] bg-[#0c0c0c] p-5 md:p-8"
        >

          {/* Personal info */}
          <section>
            <h2 className="mb-5 text-xl font-black text-white">
              اطلاعات ثبت‌کننده
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="نام و نام خانوادگی"
                value={fullName}
                onChange={setFullName}
                placeholder="مثلاً نیما حجتی"
              />

              <Field
                label="شماره موبایل"
                value={phone}
                onChange={setPhone}
                placeholder="مثلاً 09121234567"
                type="tel"
              />

              <Field
                label="کد ملی"
                value={nationalId}
                onChange={setNationalId}
                placeholder="۱۰ رقمی"
              />

              <Field
                label="تاریخ تولد"
                value={birthDate}
                onChange={setBirthDate}
                type="date"
              />
            </div>
          </section>

          <div className="my-8 h-px bg-[#211b10]" />

          {/* Product */}
          <section>
            <h2 className="mb-5 text-xl font-black text-white">
              اطلاعات محصول
            </h2>

            <Field
              label="نام محصول"
              value={productName}
              onChange={setProductName}
              placeholder="مثلاً iPhone 17 Pro Max"
            />

            <div className="mt-4">
              <label className="mb-2 block text-sm font-bold text-gray-300">
                قیمت محصول
              </label>

              <div className="relative">
                <input
                  value={formatPrice(price)}
                  onChange={(e) =>
                    setPrice(cleanPrice(e.target.value))
                  }
                  inputMode="numeric"
                  placeholder="مثلاً ۱۲۵,۰۰۰,۰۰۰"
                  className="w-full rounded-xl border border-[#3a2e18] bg-[#101010] px-4 py-3 pl-16 text-right text-white outline-none placeholder:text-gray-600 focus:border-[#d8aa4d]"
                />

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">
                  تومان
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-600">
                حداکثر قیمت قابل ثبت: ۵۰۰,۰۰۰,۰۰۰ تومان
              </p>
            </div>

            {/* Image */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-bold text-gray-300">
                تصویر محصول
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#3a2e18] bg-[#090909] px-5 py-8 text-center transition hover:border-[#d8aa4d]">
                <Upload size={30} className="mb-3 text-[#d8aa4d]" />

                <span className="text-sm font-bold text-gray-300">
                  {image
                    ? image.name
                    : "برای محصول جدید تصویر انتخاب کنید"}
                </span>

                <span className="mt-2 text-xs text-gray-600">
                  اگر محصول قبلاً ثبت شده باشد، نیازی به آپلود تصویر نیست.
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>
          </section>

          <div className="my-8 h-px bg-[#211b10]" />

          {/* Mode */}
          <section>
            <h2 className="mb-5 text-xl font-black text-white">
              نوع ثبت فروشنده
            </h2>

            <div className="grid gap-3 md:grid-cols-2">

              <button
                type="button"
                onClick={() => setMode("website")}
                className={`rounded-2xl border p-5 text-right transition ${
                  mode === "website"
                    ? "border-[#d8aa4d] bg-[#17130c]"
                    : "border-[#2d2414] bg-[#0b0b0b]"
                }`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <Globe
                    size={22}
                    className={
                      mode === "website"
                        ? "text-[#d8aa4d]"
                        : "text-gray-500"
                    }
                  />

                  <span className="font-bold text-white">
                    اتصال به سایت
                  </span>
                </div>

                <p className="text-xs leading-6 text-gray-500">
                  قیمت محصول همراه با آدرس سایت فروشنده ثبت می‌شود.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("direct")}
                className={`rounded-2xl border p-5 text-right transition ${
                  mode === "direct"
                    ? "border-[#d8aa4d] bg-[#17130c]"
                    : "border-[#2d2414] bg-[#0b0b0b]"
                }`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <Store
                    size={22}
                    className={
                      mode === "direct"
                        ? "text-[#d8aa4d]"
                        : "text-gray-500"
                    }
                  />

                  <span className="font-bold text-white">
                    ثبت محصول بدون سایت
                  </span>
                </div>

                <p className="text-xs leading-6 text-gray-500">
                  بدون نیاز به وارد کردن آدرس سایت فروشنده.
                </p>
              </button>

            </div>
          </section>

          <div className="my-8 h-px bg-[#211b10]" />

          {/* Seller */}
          <section>
            <h2 className="mb-5 text-xl font-black text-white">
              اطلاعات فروشنده
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="نام فروشگاه یا فروشنده"
                value={sellerName}
                onChange={setSellerName}
                placeholder="مثلاً فروشگاه آلفا"
              />

              <Field
                label="شماره تماس فروشنده"
                value={sellerPhone}
                onChange={setSellerPhone}
                placeholder="اختیاری"
                type="tel"
              />
            </div>

            {mode === "website" && (
              <div className="mt-4">
                <Field
                  label="آدرس سایت فروشنده"
                  value={sellerWebsite}
                  onChange={setSellerWebsite}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            )}
          </section>

          {/* Messages */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/20 px-4 py-4 text-sm leading-7 text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#80652f] bg-[#17130c] px-4 py-4 text-sm leading-7 text-[#d8aa4d]">
              <CheckCircle2 size={20} />
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-black text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "#d8aa4d" }}
          >
            {loading ? "در حال ثبت..." : "ثبت محصول و قیمت"}
          </button>

          <p className="mt-4 text-center text-xs leading-6 text-gray-600">
            ثبت محصول در حال حاضر رایگان است.
          </p>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#3a2e18] bg-[#101010] px-4 py-3 text-right text-white outline-none placeholder:text-gray-600 focus:border-[#d8aa4d]"
      />
    </div>
  );
   }
