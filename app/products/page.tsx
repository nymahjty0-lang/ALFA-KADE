import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Camera,
  Gamepad2,
  Tv,
  Refrigerator,
  ShoppingBag,
} from "lucide-react";

const categories = [
  { name: "گوشی موبایل", icon: Smartphone },
  { name: "کامپیوتر", icon: Monitor },
  { name: "لپ‌تاپ", icon: Laptop },
  { name: "تبلت", icon: Tablet },
  { name: "ساعت هوشمند", icon: Watch },
  { name: "هدفون و هندزفری", icon: Headphones },
  { name: "اسپیکر", icon: Speaker },
  { name: "دوربین", icon: Camera },
  { name: "کنسول و بازی", icon: Gamepad2 },
  { name: "تلویزیون", icon: Tv },
  { name: "لوازم خانگی", icon: Refrigerator },
  { name: "لوازم جانبی", icon: ShoppingBag },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#070707] px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-block rounded-full border border-[#3a2e18] bg-[#0d0d0d] px-5 py-2 text-sm text-[#d8aa4d]">
            ALFA KADE
          </div>

          <h1 className="text-3xl font-black text-white md:text-5xl">
            همه محصولات
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            دسته‌بندی موردنظر خود را انتخاب کنید و قیمت محصولات را از
            فروشندگان مختلف مقایسه کنید.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-10 max-w-3xl">
          <form action="/search" className="relative">
            <input
              type="search"
              name="q"
              placeholder="نام محصول را جستجو کنید..."
              className="w-full rounded-2xl border border-[#3a2e18] bg-[#101010] px-5 py-4 pr-5 text-right text-white outline-none placeholder:text-gray-600 focus:border-[#d8aa4d]"
            />

            <button
              type="submit"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-xl px-5 py-2.5 text-sm font-bold text-black"
              style={{ background: "#d8aa4d" }}
            >
              جستجو
            </button>
          </form>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="mb-5 text-xl font-bold text-white">
            دسته‌بندی‌ها
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/search?q=${encodeURIComponent(category.name)}`}
                  className="group rounded-2xl border border-[#2d2414] bg-[#0d0d0d] p-5 text-center transition hover:-translate-y-1 hover:border-[#d8aa4d] hover:bg-[#11100d]"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#17130c] text-[#d8aa4d] transition group-hover:bg-[#d8aa4d] group-hover:text-black">
                    <Icon size={24} />
                  </div>

                  <div className="text-sm font-bold text-gray-200 group-hover:text-[#d8aa4d]">
                    {category.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Product area */}
        <section className="rounded-3xl border border-[#2d2414] bg-[#0b0b0b] p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                محصولات آلفا کده
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                محصولات ثبت‌شده در این بخش نمایش داده می‌شوند.
              </p>
            </div>

            <Link
              href="/products/register"
              className="rounded-xl px-5 py-3 text-center text-sm font-bold text-black"
              style={{ background: "#d8aa4d" }}
            >
              + ثبت محصول
            </Link>
          </div>

          <div className="rounded-2xl border border-dashed border-[#3a2e18] bg-[#090909] px-5 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#17130c] text-[#d8aa4d]">
              <ShoppingBag size={30} />
            </div>

            <h3 className="text-lg font-bold text-gray-200">
              هنوز محصولی نمایش داده نشده است
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-600">
              اولین محصول را ثبت کنید تا در آلفا کده قرار بگیرد و
              فروشندگان مختلف بتوانند قیمت آن را اضافه کنند.
            </p>

            <Link
              href="/products/register"
              className="mt-6 inline-block rounded-xl border border-[#d8aa4d] px-6 py-3 text-sm font-bold text-[#d8aa4d] transition hover:bg-[#d8aa4d] hover:text-black"
            >
              ثبت اولین محصول
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
            }
