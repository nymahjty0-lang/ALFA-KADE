import "./globals.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: "ALFA KADE | آلفا کده",
  description: "مقایسه قیمت و پیدا کردن ارزان‌ترین فروشنده"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-zinc-800 py-10 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} ALFA KADE — آلفا کده
        </footer>
      </body>
    </html>
  );
}