import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { slugify, randomSuffix } from "@/lib/slugify";
import { RESERVED_SUBDOMAINS } from "@/lib/site";
import { getUser } from "@/lib/serverAuth";
import { previewToken } from "@/lib/preview";
import { createHash, randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getUser(req); // opsional: kalau sedang login, halaman langsung jadi miliknya
    const {
      name,
      bizType,
      city,
      raw,
      contact,
      tagline,
      about,
      coverUrl,
      products,
    } = body as {
      name: string;
      bizType: string;
      city: string;
      raw: string;
      contact: string;
      tagline: string;
      about: string;
      coverUrl: string | null;
      products: { name: string; price: string; desc: string; imageUrl: string | null }[];
    };

    if (!name) {
      return NextResponse.json({ error: "Nama usaha wajib diisi." }, { status: 400 });
    }

    // Cari slug unik
    const baseSlug = slugify(name) || "usaha";
    let slug = RESERVED_SUBDOMAINS.has(baseSlug) ? `${baseSlug}-${randomSuffix(3)}` : baseSlug;
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("umkm")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${randomSuffix(3)}`;
    }

    const { data: umkmRow, error: umkmError } = await supabaseAdmin
      .from("umkm")
      .insert({
        slug,
        name,
        biz_type: bizType,
        city,
        raw_story: raw,
        contact,
        tagline,
        about,
        cover_url: coverUrl,
        owner_id: user?.id ?? null,
      })
      .select()
      .single();

    if (umkmError) {
      return NextResponse.json({ error: umkmError.message }, { status: 500 });
    }

    if (products?.length) {
      const rows = products.map((p, i) => ({
        umkm_id: umkmRow.id,
        name: p.name,
        price: p.price,
        description: p.desc,
        image_url: p.imageUrl,
        sort_order: i,
      }));
      const { error: productsError } = await supabaseAdmin.from("products").insert(rows);
      if (productsError) {
        return NextResponse.json({ error: productsError.message }, { status: 500 });
      }
    }

    // Kode klaim: dipegang pembuat halaman (disimpan di browser), dipakai saat langganan untuk mengklaim halaman ke akunnya.
    let claimToken: string | null = null;
    if (!user) {
      claimToken = randomBytes(18).toString("base64url");
      await supabaseAdmin.from("umkm_claims").insert({
        umkm_id: umkmRow.id,
        token_hash: createHash("sha256").update(claimToken).digest("hex"),
      });
    }

    return NextResponse.json({ slug, claimToken, pv: previewToken(slug) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Terjadi kesalahan." }, { status: 500 });
  }
}
