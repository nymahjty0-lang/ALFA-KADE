import { supabase } from "@/lib/supabase";
import type { SiteSettings, Category } from "@/lib/types";

export const ADMIN_NUMBERS = ["09936874192", "09966920595", "09010391546"];

export const DEFAULT_SETTINGS: SiteSettings = {
  new_product_fee: 0, renewal_fee: 200000, renewal_months: 6,
  max_product_price: 500000000, max_sellers_per_product: 1000,
  support_email: "alphakade11@gmail.com", suggestions_email: "alphakade11@gmail.com",
  show_seller_phone_public: false, site_title: "ALFA KADE | آلفا کده",
};

export function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function normalizePhone(value: string) {
  return normalizeDigits(value).replace(/\D/g, "");
}

export function isAdminPhone(phone: string) {
  return ADMIN_NUMBERS.includes(normalizePhone(phone));
}

export function getClientAuth() {
  if (typeof window === "undefined") return { loggedIn: false, isAdmin: false, phone: "" };

  const phone = normalizePhone(localStorage.getItem("alfa_kade_phone") || "");
  const loggedIn = localStorage.getItem("alfa_kade_logged_in") === "true";
  const adminVerified = localStorage.getItem("alfa_kade_admin_verified") === "true";

  return { loggedIn, phone, isAdmin: loggedIn && adminVerified && isAdminPhone(phone) };
}

export function slugify(text: string) {
  const trimmed = text.trim().toLowerCase();
  const base = trimmed
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `product-${Date.now()}`;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return DEFAULT_SETTINGS;
  const { data, error } = await supabase
    .from("site_settings")
    .select("new_product_fee, renewal_fee, renewal_months, max_product_price, max_sellers_per_product, support_email, suggestions_email, show_seller_phone_public, site_title")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return data as SiteSettings;
}

export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Category[];
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
    }
