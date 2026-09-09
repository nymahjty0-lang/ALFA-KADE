import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "آلفا کده | مقایسه قیمت و خرید",
  description:
    "آلفا کده؛ مقایسه قیمت محصولات و پیدا کردن بهترین فروشنده",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Header />

        <main>{children}</main>

        <footer className="border-t border-[#d8aa4d]/20 bg-[#050505] px-4 py-8 text-center">
          <p className="text-sm text-gray-400">
            آلفا کده | مقایسه قیمت و خرید هوشمند
          </p>

          <p className="mt-2 text-xs text-gray-600">
            سازنده: نیماحجتی
          </p>

          <a
            href="mailto:alphakade11@gmail.com"
            className="mt-2 inline-block text-xs text-[#d8aa4d] hover:underline"
          >
            alphakade11@gmail.com
          </a>
        </footer>
      </body>
    </html>
  );
}
