// Pengaturan domain & paket. Aman dipakai di middleware (tidak import Supabase).
//
// NEXT_PUBLIC_ROOT_DOMAIN = domain utama kamu, tanpa https://
//   produksi : instalaman.id
//   lokal    : localhost:3000   (tes dengan http://namausaha.localhost:3000)

export const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "").toLowerCase().trim();
export const ROOT_HOST = ROOT_DOMAIN.split(":")[0];
export const PROTO = ROOT_HOST === "localhost" ? "http" : "https";

// Nama yang tidak boleh dipakai sebagai subdomain usaha.
export const RESERVED_SUBDOMAINS = new Set([
  "www", "app", "api", "admin", "dashboard", "login", "daftar", "buat", "toko",
  "mail", "email", "ftp", "blog", "help", "support", "status", "cdn", "static",
  "assets", "dev", "test", "staging", "instalaman",
]);

/** Ambil nama subdomain dari host, mis. "kedai.instalaman.id" -> "kedai". Null kalau bukan subdomain usaha. */
export function subdomainOf(host: string | null | undefined): string | null {
  if (!ROOT_HOST || !host) return null;
  const name = host.split(":")[0].toLowerCase();
  if (name === ROOT_HOST || name === `www.${ROOT_HOST}`) return null;
  if (!name.endsWith(`.${ROOT_HOST}`)) return null;
  const sub = name.slice(0, -(ROOT_HOST.length + 1));
  if (!sub || sub.includes(".")) return null;
  return sub;
}

/** Alamat penuh di domain utama, mis. rootUrl("/toko/kedai"). */
export function rootUrl(path = "/"): string {
  return ROOT_DOMAIN ? `${PROTO}://${ROOT_DOMAIN}${path}` : path;
}

/** Origin situs utama untuk SEO (canonical, sitemap, OG). Contoh: https://instalaman.id */
export function siteOrigin(): string {
  return ROOT_DOMAIN ? `${PROTO}://${ROOT_DOMAIN}` : "http://localhost:3000";
}

/** Alamat subdomain usaha, atau null kalau NEXT_PUBLIC_ROOT_DOMAIN belum diisi. */
export function subdomainUrl(slug: string): string | null {
  return ROOT_DOMAIN ? `${PROTO}://${slug}.${ROOT_DOMAIN}` : null;
}

/** Paket berbayar yang masih aktif (belum lewat tanggal berakhir). */
export function isPlanActive(u: { plan?: string | null; plan_until?: string | null }): boolean {
  if (!u.plan || u.plan === "free") return false;
  if (!u.plan_until) return true;
  return new Date(u.plan_until).getTime() > Date.now();
}

/* ===== Paket & metode pembayaran ===== */
// Harga SELALU diambil dari sini di server. Jangan percaya angka dari browser.
export const PLANS = {
  monthly: { label: "Bulanan", amount: 50000, months: 1, per: "bulan" },
  yearly: { label: "Tahunan", amount: 550000, months: 12, per: "tahun" },
} as const;
export type PlanKey = keyof typeof PLANS;
export const isPlanKey = (k: unknown): k is PlanKey => typeof k === "string" && k in PLANS;

export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

// Daftar metode yang ditawarkan sebelum pindah ke Midtrans. `enabled` = nilai enabled_payments Snap (null = semua).
export const PAY_METHODS = [
  { key: "qris", label: "QRIS", desc: "Scan dari m-BCA, GoPay, OVO, DANA, ShopeePay, atau m-banking apa saja", icon: "📱", enabled: ["other_qris", "gopay"] },
] as const;
export type PayMethodKey = (typeof PAY_METHODS)[number]["key"];

export function addMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}
