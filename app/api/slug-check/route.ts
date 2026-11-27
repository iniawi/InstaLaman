import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { slugify, isValidSlug } from "@/lib/slugify";
import { RESERVED_SUBDOMAINS } from "@/lib/site";

// Cek apakah alamat web (subdomain) masih tersedia. Dipakai form /buat saat pelanggan mengetik.
export async function GET(req: NextRequest) {
  const slug = slugify(req.nextUrl.searchParams.get("slug") || "");
  if (!isValidSlug(slug))
    return NextResponse.json({ slug, available: false, reason: "invalid" });
  if (RESERVED_SUBDOMAINS.has(slug))
    return NextResponse.json({ slug, available: false, reason: "reserved" });

  const { data, error } = await supabaseAdmin
    .from("umkm")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "Gagal mengecek alamat." },
      { status: 500 },
    );
  if (data)
    return NextResponse.json({ slug, available: false, reason: "taken" });
  return NextResponse.json({ slug, available: true });
}
