import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "آلفا کده | مقایسه و خرید هوشمند",
  description:
    "آلفا کده؛ مقایسه قیمت محصولات و پیدا کردن بهترین قیمت از فروشندگان مختلف",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-[#070707] text-white">
        <Header />

        <main className="min-h-[calc(100vh-80px)]">{children}</main>

        <footer className="border-t border-[#2d2414] bg-[#050505]">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 text-xl font-black text-[#d8aa4d]">
                  آلفا کده
                </div>

                <p className="text-sm leading-7 text-gray-500">
                  مقایسه قیمت، پیدا کردن فروشنده و خرید هوشمند.
                </p>
              </div>

              <div>
                <div className="mb-3 font-bold text-white">
                  دسترسی سریع
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <a
                    href="/products"
                    className="transition hover:text-[#d8aa4d]"
                  >
                    همه محصولات
                  </a>

                  <a
                    href="/products/register"
                    className="transition hover:text-[#d8aa4d]"
                  >
                    ثبت محصول
                  </a>

                  <a
                    href="/settings"
                    className="transition hover:text-[#d8aa4d]"
                  >
                    تنظیمات
                  </a>
                </div>
              </div>

              <div>
                <div className="mb-3 font-bold text-white">
                  پشتیبانی و پیشنهادات
                </div>

                <p className="text-sm leading-7 text-gray-500">
                  alphakade11@gmail.com
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-[#17130c] pt-5 text-center text-xs text-gray-600">
              سازنده: نیماحجتی
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
      }
