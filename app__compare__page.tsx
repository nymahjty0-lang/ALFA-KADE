import Link from "next/link";
export default function Compare() {
  return <section className="mx-auto max-w-5xl px-4 py-12">
    <div className="card p-8">
      <h1 className="text-3xl font-black gold-text">مقایسه قیمت</h1>
      <p className="mt-4 leading-8 text-zinc-400">قیمت‌ها برای هر محصول از ارزان به گران مرتب می‌شوند. برای شروع، یک محصول را جستجو کن.</p>
      <Link href="/products" className="mt-7 inline-block gold-gradient rounded-full px-7 py-3 font-bold text-black">رفتن به محصولات</Link>
    </div>
  </section>;
}