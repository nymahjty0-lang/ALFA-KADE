"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
const MAX=500_000_000;
export default function RegisterProduct(){
 const [mode,setMode]=useState<'website'|'direct'>('website');
 const [form,setForm]=useState({fullName:'',phone:'',nationalId:'',birthDate:'',title:'',description:'',category:'',price:'',sellerName:'',websiteUrl:''});
 const [image,setImage]=useState<File|null>(null); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false);
 const set=(k:keyof typeof form,v:string)=>setForm({...form,[k]:v});
 async function submit(e:React.FormEvent){e.preventDefault();setMsg('');setBusy(true);try{
   const price=Number(form.price.replace(/,/g,''));
   if(!form.fullName||!form.phone||!form.nationalId||!form.birthDate){setMsg('نام، شماره تماس، کد ملی و تاریخ تولد الزامی است.');return;}
   if(!form.title||!price){setMsg('نام محصول و قیمت را وارد کنید.');return;}
   if(price>MAX){setMsg('قیمت محصول نمی‌تواند بیشتر از ۵۰۰ میلیون تومان باشد.');return;}
   if(mode==='website'&&!form.websiteUrl){setMsg('برای اتصال به سایت، آدرس سایت الزامی است.');return;}
   const db=supabase();if(!db){setMsg('فرم آماده است؛ برای ثبت واقعی، Supabase را تنظیم کنید.');return;}
   const {data:user}=await db.auth.getUser();if(!user.user){setMsg('ابتدا وارد حساب شوید.');return;}
   const {error:pe}=await db.from('profiles').upsert({id:user.user.id,full_name:form.fullName,phone:form.phone,national_id:form.nationalId,birth_date:form.birthDate});if(pe)throw pe;
   // اگر محصول قبلاً وجود داشته باشد، فقط قیمت/فروشنده اضافه می‌شود و تصویر دوباره گرفته نمی‌شود.
   const {data:found}=await db.from('products').select('*').ilike('title',form.title.trim()).limit(1).maybeSingle();
   let product=found;
   if(!product){
     if(!image){setMsg('برای اولین ثبت این محصول، آپلود عکس الزامی است.');return;}
     let imageUrl:string|null=null;
     const ext=image.name.split('.').pop()||'jpg'; const path=`${user.user.id}/${Date.now()}.${ext}`;
     const up=await db.storage.from('product-images').upload(path,image,{upsert:false,contentType:image.type});
     if(up.error)throw new Error('آپلود تصویر انجام نشد. ابتدا Storage و bucket به نام product-images را در Supabase بسازید.');
     imageUrl=db.storage.from('product-images').getPublicUrl(path).data.publicUrl;
     const slug=form.title.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06ff]+/gi,'-').replace(/^-|-$/g,'')+'-'+Date.now();
     const ins=await db.from('products').insert({title:form.title.trim(),slug,description:form.description,category:form.category,image_url:imageUrl,created_by:user.user.id}).select().single();
     if(ins.error)throw ins.error; product=ins.data;
   }
   const seller=await db.from('sellers').insert({owner_id:user.user.id,name:form.sellerName||form.fullName,website_url:mode==='website'?form.websiteUrl:null}).select().single();
   if(seller.error)throw seller.error;
   const offer=await db.from('offers').insert({product_id:product.id,seller_id:seller.data.id,price,seller_url:mode==='website'?form.websiteUrl:null,source_type:mode}).select().single();
   if(offer.error)throw offer.error;
   setMsg(found?'قیمت و فروشنده با موفقیت به محصول موجود اضافه شد.':'محصول جدید و قیمت فروشنده با موفقیت ثبت شد.');
 }catch(err:any){setMsg(err?.message||'خطایی رخ داد.')}finally{setBusy(false)}}
 return <section className="mx-auto max-w-3xl px-4 py-10"><h1 className="text-3xl font-black gold-text">ثبت محصول جدید</h1><p className="mt-2 text-zinc-500">هزینه ثبت پیش‌فرض رایگان است و رئیس پروژه می‌تواند آن را از پنل تغییر دهد.</p><form onSubmit={submit} className="card mt-8 space-y-5 p-6">
 <div className="grid grid-cols-2 gap-3"><button type="button" onClick={()=>setMode('website')} className={`rounded-xl border p-4 ${mode==='website'?'border-gold text-gold':'border-zinc-700'}`}>۱. اتصال به سایت</button><button type="button" onClick={()=>setMode('direct')} className={`rounded-xl border p-4 ${mode==='direct'?'border-gold text-gold':'border-zinc-700'}`}>۲. ثبت محصول بدون سایت</button></div>
 <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-7 text-zinc-400">اگر محصول قبلاً در آلفا کده ثبت شده باشد، تصویر دوباره لازم نیست و فقط قیمت و مشخصات فروشنده اضافه می‌شود. اگر محصول جدید باشد، تصویر محصول باید آپلود شود.</div>
 <div className="grid gap-4 md:grid-cols-2">{([['fullName','نام و نام خانوادگی','text'],['phone','شماره تماس','tel'],['nationalId','کد ملی','text'],['birthDate','تاریخ تولد','date']] as const).map(([k,l,t])=><label key={k}><span className="mb-2 block text-sm text-zinc-400">{l}</span><input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} className="input" required/></label>)}</div>
 <div className="grid gap-4 md:grid-cols-2"><label><span className="mb-2 block text-sm text-zinc-400">نام محصول</span><input className="input" value={form.title} onChange={e=>set('title',e.target.value)} required/></label><label><span className="mb-2 block text-sm text-zinc-400">قیمت (تومان)</span><input className="input" inputMode="numeric" value={form.price} onChange={e=>set('price',e.target.value)} required/><small className="text-zinc-500">حداکثر ۵۰۰,۰۰۰,۰۰۰ تومان</small></label></div>
 <label><span className="mb-2 block text-sm text-zinc-400">نام فروشنده</span><input className="input" value={form.sellerName} onChange={e=>set('sellerName',e.target.value)}/></label>
 {mode==='website'&&<label><span className="mb-2 block text-sm text-zinc-400">آدرس سایت فروشنده</span><input className="input" type="url" placeholder="https://example.com" value={form.websiteUrl} onChange={e=>set('websiteUrl',e.target.value)} required/></label>}
 <label><span className="mb-2 block text-sm text-zinc-400">عکس محصول</span><input className="input file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2" type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)}/></label>
 <label><span className="mb-2 block text-sm text-zinc-400">دسته‌بندی</span><input className="input" value={form.category} onChange={e=>set('category',e.target.value)}/></label>
 <label><span className="mb-2 block text-sm text-zinc-400">توضیحات</span><textarea className="input min-h-28" value={form.description} onChange={e=>set('description',e.target.value)}/></label>
 <button disabled={busy} className="w-full rounded-xl gold-gradient p-4 font-bold text-black disabled:opacity-50">{busy?'در حال ثبت...':'ثبت محصول'}</button>{msg&&<div className="rounded-xl border border-zinc-700 p-4 text-gold">{msg}</div>}
 </form></section>}
