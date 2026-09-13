"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, PackagePlus, Globe2, Store } from "lucide-react";

const BASE_PATH = "/ALFA-KADE";
const MAX_PRICE = 500_000_000;

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );
}

function normalizePhone(value: string) {
  return normalizeDigits(value).replace(/\D/g, "");
}

export default function RegisterProductPage() {
  const [mode, setMode] = useState<"direct" | "website">("direct");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [website, setWebsite] = useState("");
  const [seller, setSeller] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedPhone = normalizePhone(phone);
    const normalizedNationalId = normalizeDigits(nationalId).replace(
      /\D/g,
      ""
    );
    const numericPrice = Number(
      normalizeDigits(price).replace(/[^\d]/g, "")
    );

    if (!name.trim()) {
      setError("نام و نام خانوادگی را وارد کنید.");
      return;
    }

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }

    if (normalizedNationalId.length !== 10) {
      setError("کد ملی باید ۱۰ رقم باشد.");
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

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("قیمت محصول باید بیشتر از صفر باشد.");
      return;
    }

    if (numericPrice > MAX_PRICE) {
      setError("قیمت محصول نمی‌تواند بیشتر از ۵۰۰ میلیون تومان باشد.");
      return;
    }

    if (!seller.trim()) {
      setError("نام فروشنده یا فروشگاه را وارد کنید.");
      return;
    }

    if (mode === "website") {
      if (!website.trim()) {
        setError("آدرس سایت را وارد کنید.");
        return;
      }

      try {
        const url = new URL(website);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        setError("آدرس سایت معتبر نیست.");
        return;
      }
    }

    const pendingProducts = JSON.parse(
      localStorage.getItem("alfa_kade_pending_products") || "[]"
    );

    pendingProducts.push({
      id: `local-${Date.now()}`,
      name: productName.trim(),
      price: numericPrice,
      seller: seller.trim(),
      website: mode === "website" ? website.trim() : null,
      registrationMode: mode,
      registrant: {
        name: name.trim(),
        phone: normalizedPhone,
        nationalId: normalizedNationalId,
        birthDate,
      },
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem(
      "alfa_kade_pending_products",
      JSON.stringify(pendingProducts)
    );

    setMessage(
      "محصول با موفقیت برای ثبت اولیه ذخیره شد. اتصال به پایگاه داده و بررسی نهایی در مرحله بعد انجام می‌شود."
    );

    setName("");
    setPhone("");
    setNationalId("");
    setBirthDate("");
    setProductName("");
    setPrice("");
    setWebsite("");
    setSeller("");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070707] text-white px-4 py-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href={`${BASE_PATH}/products`}
            className="inline-flex items-center gap-2 rounded-xl border border-[#3f331c] px-4 py-2 text-sm text-gray-300 transition hover:border-[#d8aa4d] hover:text-white"
          >
            بازگشت
            <ArrowRight size={18} />
          </Link>

          <div className="flex items-center gap-3">
            <img
              src={`${BASE_PATH}/alfa-cade.png`}
              alt="ALFA KADE"
              className="h-12 w-12 rounded-xl border border-[#8f6f2d] object-cover"
            />

            <div>
              <h1 className="font-bold text-[#d8aa4d]">
                ثبت محصول
              </h1>
              <p className="text-xs text-gray-500">
                ALFA KADE
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#3d301a] bg-[#0d0d0d] p-5 shadow-2xl sm:p-7">
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-2xl bg-[#17130b] p-3 text-[#d8aa4d]">
              <PackagePlus size={26} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                اطلاعات محصول و ثبت‌کننده
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                اطلاعات را دقیق وارد کنید.
              </p>
            </div>
          </div>

          <div className="mb-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("direct")}
              className={`rounded-2xl border p-4 text-right transition ${
                mode === "direct"
                  ? "border-[#d8aa4d] bg-[#181207]"
                  : "border-[#302a20] bg-black"
              }`}
            >
              <Store
                size={22}
                className="mb-2 text-[#d8aa4d]"
              />
              <div className="font-bold">
                ثبت بدون سایت
              </div>
              <div className="mt-1 text-xs text-gray-500">
                فروش مستقیم
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("website")}
              className={`rounded-2xl border p-4 text-right transition ${
                mode === "website"
                  ? "border-[#d8aa4d] bg-[#181207]"
                  : "border-[#302a20] bg-black"
              }`}
            >
              <Globe2
                size={22}
                className="mb-2 text-[#d8aa4d]"
              />
              <div className="font-bold">
                اتصال به سایت
              </div>
              <div className="mt-1 text-xs text-gray-500">
                ثبت همراه آدرس فروشگاه
              </div>
            </button>
          </div>

          <form
            onSubmit={submitForm}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="نام و نام خانوادگی"
                value={name}
                onChange={setName}
                placeholder="مثلاً نیما حجتی"
              />

              <Field
                label="شماره موبایل"
                value={phone}
                onChange={setPhone}
                placeholder="09123456789"
                inputMode="tel"
              />

              <Field
                label="کد ملی"
                value={nationalId}
                onChange={setNationalId}
                placeholder="۱۰ رقم"
                inputMode="numeric"
                maxLength={10}
              />

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  تاریخ تولد
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) =>
                    setBirthDate(e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-3.5 text-white outline-none transition focus:border-[#d8aa4d]"
                />
              </div>
            </div>

            <div className="border-t border-[#242424] pt-5">
              <h3 className="mb-4 font-bold text-[#d8aa4d]">
                اطلاعات محصول
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="نام محصول"
                  value={productName}
                  onChange={setProductName}
                  placeholder="مثلاً گوشی سامسونگ..."
                />

                <Field
                  label="قیمت به تومان"
                  value={price}
                  onChange={setPrice}
                  placeholder="مثلاً 25000000"
                  inputMode="numeric"
                />

                <Field
                  label="نام فروشنده / فروشگاه"
                  value={seller}
                  onChange={setSeller}
                  placeholder="نام فروشگاه"
                />

                {mode === "website" && (
                  <Field
                    label="آدرس سایت"
                    value={website}
                    onChange={setWebsite}
                    placeholder="https://example.com"
                    inputMode="url"
                    dir="ltr"
                  />
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-[#665122] bg-[#181307] p-4 text-sm leading-7 text-[#e5c46b]">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#d8aa4d] py-4 font-bold text-black transition hover:bg-[#efc766] active:scale-[0.99]"
            >
              ثبت محصول
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-6 text-gray-600">
            سقف قیمت هر محصول: ۵۰۰ میلیون تومان
          </p>
        </div>

        <footer className="py-7 text-center text-xs text-gray-600">
          سازنده این سایت: نیما حجتی
          <br />
          alphakade11@gmail.com
        </footer>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  maxLength,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "tel" | "url";
  maxLength?: number;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">
        {label}
      </label>

      <input
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-[#40331d] bg-black px-4 py-3.5 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d8aa4d]"
      />
    </div>
  );
        }
