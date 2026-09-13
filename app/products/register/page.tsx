"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, PackagePlus, Globe2, Store, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  normalizeDigits,
  normalizePhone,
  slugify,
  fetchCategories,
  fetchSiteSettings,
} from "@/lib/alfa";
import type { Category, SiteSettings } from "@/lib/types";

const BASE_PATH = "/ALFA-KADE";

export default function RegisterProductPage() {
  const [mode, setMode] = useState<"direct" | "website">("direct");
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [registrantName, setRegistrantName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [price, setPrice] = useState("");
  const [website, setWebsite] = useState("");
  const [seller, setSeller] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchSiteSettings().then(setSettings);
  }, []);

  const maxPrice = settings?.max_product_price ?? 500_000_000;

  function onPickImage(file: File | null) {
    setImageFile(file);
    if (!file) {
      setImagePreview(null);
      return;
    }
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File) {
    if (!supabase) return null;

    const ext = file.name.split(".").pop() || "jpg";
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      throw new Error("آپلود تصویر با خطا مواجه شد: " + uploadError.message);
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("اتصال به پایگاه داده برقرار نیست. متغیرهای NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY را بررسی کنید.");
      return;
    }

    const normalizedPhone = normalizePhone(phone);
    const normalizedNationalId = normalizeDigits(nationalId).replace(/\D/g, "");
    const numericPrice = Number(normalizeDigits(price).replace(/[^\d]/g, ""));

    if (!registrantName.trim()) return setError("نام و نام خانوادگی را وارد کنید.");
    if (!/^09\d{9}$/.test(normalizedPhone)) return setError("شماره موبایل معتبر نیست.");
    if (normalizedNationalId.length !== 10) return setError("کد ملی باید ۱۰ رقم باشد.");
    if (!birthDate) return setError("تاریخ تولد را وارد کنید.");
    if (!productName.trim()) return setError("نام محصول را وارد کنید.");
    if (!categoryId) return setError("دسته‌بندی محصول را انتخاب کنید.");
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return setError("قیمت محصول باید بیشتر از صفر باشد.");
    if (numericPrice > maxPrice) {
      return setError(`قیمت محصول نمی‌تواند بیشتر از ${new Intl.NumberFormat("fa-IR").format(maxPrice)} تومان باشد.`);
    }
    if (!seller.trim()) return setError("نام فروشنده یا فروشگاه را وارد کنید.");

    if (mode === "website") {
      if (!website.trim()) return setError("آدرس سایت را وارد کنید.");
      try {
        const url = new URL(website);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        return setError("آدرس سایت معتبر نیست.");
      }
    }

    setSubmitting(true);

    try {
      const slug = slugify(productName);

      const { data: existingProduct } = await supabase
        .from("products")
        .select("id, image_url")
        .or(`slug.eq.${slug},name.eq.${productName.trim()}`)
        .maybeSingle();

      let productId = existingProduct?.id as string | undefined;

      if (!productId) {
        let imageUrl: string | null = null;
        if (imageFile) imageUrl = await uploadImage(imageFile);

        const category = categories.find((c) => c.id === categoryId);

        const { data: newProduct, error: productError } = await supabase
          .from("products")
          .insert({
            name: productName.trim(),
            slug,
            description: description.trim() || null,
            image_url: imageUrl,
            category: category?.name || null,
            category_id: categoryId,
          })
          .select("id")
          .single();

        if (productError) throw new Error(productError.message);
        productId = newProduct.id;
      }

      const { error: offerError } = await supabase.from("product_offers").insert({
        product_id: productId,
        source_type: mode,
        seller_name: seller.trim(),
        seller_phone: sellerPhone.trim() ? normalizePhone(sellerPhone) : null,
        website_url: mode === "website" ? website.trim() : null,
        price: numericPrice,
        registrant_name: registrantName.trim(),
        registrant_phone: normalizedPhone,
        registrant_national_id: normalizedNationalId,
        registrant_birth_date: birthDate,
      });

      if (offerError) throw new Error(offerError.message);

      setMessage(
        settings && settings.new_product_fee > 0
          ? `محصول با موفقیت ثبت شد. هزینه ثبت (${new Intl.NumberFormat("fa-IR").format(settings.new_product_fee)} تومان) در مرحله اتصال درگاه پرداخت از شما دریافت می‌شود.`
          : "محصول با موفقیت ثبت شد و اکنون در فهرست محصولات قابل مشاهده است."
      );

      setProductName("");
      setDescription("");
      setPrice("");
      setWebsite("");
      setSeller("");
      setSellerPhone("");
      onPickImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته رخ داد.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#070707] text-white px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href={`${BASE_PATH}/products`} className="inline-flex items-center gap-2 rounded-xl border border-[#3f331c] px-4 py-2 text-sm text-gray-300 transition hover:border-[#d8aa4d] hover:text-white">
            بازگشت
            <ArrowRight size={18} />
          </Link>

          <div className="flex items-center gap-3">
            <img src={`${BASE_PATH}/alfa-cade.png`} alt="ALFA KADE" className="h-12 w-12 rounded-xl border border-[#8f6f2d] object-cover" />
            <div>
              <h1 className="font-bold text-[#d8aa4d]">ثبت محصول</h1>
              <p className="text-xs text-gray-500">ALFA KADE</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#3d301a] bg-[#0d0d0d] p-5 shadow-2xl sm:p-7">
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-2xl bg-[#17130b] p-3 text-[#d8aa4d]">
              <PackagePlus size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold">اطلاعات محصول و ثبت‌کننده</h2>
              <p className="mt-1 text-sm text-gray-500">اطلاعات را دقیق وارد کنید.</p>
            </div>
          </div>

          <div className="mb-7 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setMode("direct")} className={`rounded-2xl border p-4 text-right transition ${mode === "direct" ? "border-[#d8aa4d] bg-[#181207]" : "border-[#302a20] bg-black"}`}>
              <Store size={22} className="mb-2 text-[#d8aa4d]" />
              <div className="font-bold">ثبت بدون سایت</div>
              <div className="mt-1 text-xs text-gray-500">فروش مستقیم</div>
            </button>

            <button type="button" onClick={() => setMode("website")} className={`rounded-2xl border p-4 text-right transition ${mode === "website" ? "border-[#d8aa4d] bg-[#181207]" : "border-[#302a20] bg-black"}`}>
              <Globe2 size={22} className="mb-2 text-[#d8aa4d]" />
              <div className="font-bold">اتصال به سایت</div>
              <div className="mt-1 text-xs text-gray-500">ثبت همراه آدرس فروشگاه</div>
            </button>
          </div>

          <form onSubmit={submitForm} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="نام و نام خانوادگی" value={registrantName} onChange={setRegistrantName} placeholder="مثلاً نیما حجتی" />
              <Field label="شماره موبایل" value={phone} onChange={setPhone} placeholder="09123456789" inputMode="tel" />
              <Field label="کد ملی" value={nationalId} onChange={setNationalId} placeholder="۱۰ رقم" inputMode="numeric" maxLength={10} />
              <div>
                <label className="mb-2 block text-sm text-gray-300">تاریخ تولد</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-3.5 text-white outline-none transition focus:border-[#d8aa4d]" />
              </div>
            </div>

            <div className="border-t border-[#242424] pt-5">
              <h3 className="mb-4 font-bold text-[#d8aa4d]">اطلاعات محصول</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="نام محصول" value={productName} onChange={setProductName} placeholder="مثلاً گوشی سامسونگ..." />

                <div>
                  <label className="mb-2 block text-sm text-gray-300">دسته‌بندی</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-3.5 text-white outline-none transition focus:border-[#d8aa4d]">
                    <option value="">انتخاب کنید</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <Field label="قیمت به تومان" value={price} onChange={setPrice} placeholder="مثلاً 25000000" inputMode="numeric" />
                <Field label="نام فروشنده / فروشگاه" value={seller} onChange={setSeller} placeholder="نام فروشگاه" />
                <Field label="شماره تماس فروشنده (اختیاری)" value={sellerPhone} onChange={setSellerPhone} placeholder="09xxxxxxxxx" inputMode="tel" />

                {mode === "website" && (
                  <Field label="آدرس سایت" value={website} onChange={setWebsite} placeholder="https://example.com" inputMode="url" dir="ltr" />
                )}
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm text-gray-300">توضیحات محصول (اختیاری)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-3.5 text-white outline-none transition focus:border-[#d8aa4d]" />
              </div>

              <div className="mt-4">
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <ImagePlus size={16} className="text-[#d8aa4d]" />
                  تصویر محصول (فقط اگر این محصول اولین‌بار ثبت می‌شود لازم است)
                </label>
                <input type="file" accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-3 text-sm text-gray-300 outline-none file:ml-3 file:rounded-lg file:border-0 file:bg-[#d8aa4d] file:px-3 file:py-1.5 file:text-black" />
                {imagePreview && (
                  <img src={imagePreview} alt="پیش‌نمایش" className="mt-3 h-32 w-32 rounded-xl border border-[#3a2e18] object-contain" />
                )}
                <p className="mt-2 text-xs text-gray-600">
                  اگر محصول با همین نام قبلاً ثبت شده باشد، تصویر شما استفاده نمی‌شود و فقط قیمت شما به فهرست فروشندگان اضافه می‌شود.
                </p>
              </div>
            </div>

            {error && <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">{error}</div>}
            {message && <div className="rounded-2xl border border-[#665122] bg-[#181307] p-4 text-sm leading-7 text-[#e5c46b]">{message}</div>}
