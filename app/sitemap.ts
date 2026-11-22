import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabaseClient";
import { isPlanActive, siteOrigin } from "@/lib/site";

export const revalidate = 3600; // perbarui tiap jam

// Daftar halaman usaha YANG SUDAH TERBIT supaya Google menemukan halaman baru tanpa menunggu.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/template`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/buat`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const { data } = await supabase.from("umkm").select("slug, created_at, plan, plan_until").order("created_at", { ascending: false }).limit(5000);
    for (const u of data || []) {
      if (!isPlanActive(u)) continue; // halaman belum terbit tidak masuk sitemap
      pages.push({ url: `${origin}/toko/${u.slug}`, lastModified: u.created_at ? new Date(u.created_at) : now, changeFrequency: "weekly", priority: 0.8 });
    }
  } catch {
    // Kalau database tidak terjangkau, tetap kirim halaman statis.
  }
  return pages;
}
