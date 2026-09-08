 "use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [phone,setPhone]=useState("");
  const [msg,setMsg]=useState("");
  async function send() {
    const db=supabase();
    if(!db){setMsg("برای ورود واقعی ابتدا Supabase را در فایل .env تنظیم کن."); return;}
    // SMS/OTP provider can be enabled later. Supabase phone auth requires an SMS provider.
    setMsg("بخش ورود با شماره آماده است؛ بعد از فعال‌کردن Phone Auth و سرویس پیامک Supabase، کد ارسال می‌شود.");
  }
  return <section className="mx-auto max-w-md px-4 py-16">
    <div className="card p-7">
      <h1 className="text-2xl font-black">ورود به آلفا کده</h1>
      <p className="mt-2 text-sm text-zinc-500">شماره موبایل را وارد کن.</p>
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="09xxxxxxxxx" className="mt-6 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-gold"/>
      <button onClick={send} className="mt-4 w-full rounded-xl gold-gradient p-4 font-bold text-black">دریافت کد پیامکی</button>
      {msg && <p className="mt-4 text-sm text-gold">{msg}</p>}
    </div>
  </section>;
}