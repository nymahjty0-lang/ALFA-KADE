import Link from "next/link";
import { Search, Heart, UserRound, ShoppingBag, Menu } from "lucide-react";

export function Header() {
  return <>
    <div className="border-b border-zinc-800 px-4 py-2 text-xs text-zinc-400">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3"><span>پشتیبانی ۲۴/۷</span><span className="hidden sm:block">ضمانت اصالت کالا</span><span className="hidden sm:block">ارسال سریع و رایگان</span><span className="hidden md:block">۷ روز ضمانت بازگشت</span><span className="gold-text font-bold">سازنده: نیماحجتی</span></div>
    </div>
    <header className="sticky top-0 z-50 border-b border-zinc-800/90 bg-[#090909]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2"><img src="/alfa-cade.png" alt="ALFA KADE" className="h-12 w-12 rounded-xl"/><div className="hidden sm:block"><div className="font-black tracking-[0.2em] text-lg">ALFA KADE</div><div className="text-xs text-gold">آلفا کده</div></div></Link>
        <form action="/search" className="mx-auto flex max-w-2xl flex-1 overflow-hidden rounded-full border border-zinc-700 bg-zinc-950"><input name="q" placeholder="جستجو در آلفا کده..." className="min-w-0 flex-1 bg-transparent px-5 py-3 outline-none"/><button className="px-5 text-gold"><Search size={22}/></button></form>
        <nav className="hidden lg:flex items-center gap-5 text-sm text-zinc-300"><Link href="/">صفحه اصلی</Link><Link href="/products">محصولات</Link><Link href="/products/register">ثبت محصول</Link><Link href="/compare">مقایسه قیمت</Link><Link href="/settings">تنظیمات</Link></nav>
        <div className="flex gap-1 text-zinc-300"><button className="lg:hidden rounded-full p-2"><Menu size={21}/></button><button className="hidden sm:block rounded-full p-2"><Heart size={21}/></button><Link href="/login" className="rounded-full p-2"><UserRound size={21}/></Link><button className="hidden sm:block rounded-full p-2"><ShoppingBag size={21}/></button></div>
      </div>
    </header>
  </>;
}
