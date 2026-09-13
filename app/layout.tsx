import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "آلفا کده | ALFA KADE",
  description:
    "مقایسه قیمت محصولات از فروشندگان مختلف در آلفا کده",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-[#070707] text-white antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
