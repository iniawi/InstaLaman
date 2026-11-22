import { createHmac, timingSafeEqual } from "crypto";

// Server-only. Link pratinjau untuk halaman yang BELUM diterbitkan: /toko/slug?pv=<token>.
// Token = HMAC(slug) memakai SUPABASE_SERVICE_ROLE_KEY sebagai rahasia, jadi tidak perlu kolom/tabel baru
// dan tidak bisa ditebak. Siapa pun yang diberi link bisa melihat pratinjau (mis. dosen/teman), tapi
// halamannya tetap tidak tayang untuk umum dan tidak masuk Google.
const secret = () => process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-secret";

export function previewToken(slug: string): string {
  return createHmac("sha256", secret()).update("preview:" + slug).digest("hex").slice(0, 24);
}

export function validPreview(slug: string, token: unknown): boolean {
  if (typeof token !== "string" || !token) return false;
  const a = Buffer.from(previewToken(slug));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const previewPath = (slug: string) => `/toko/${slug}?pv=${previewToken(slug)}`;
