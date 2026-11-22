import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, unauthorized } from "@/lib/serverAuth";

// Klaim halaman yang dibuat tanpa login ke akun yang sedang login, memakai kode klaim.
export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const { slug, token } = (await req.json().catch(() => ({}))) as { slug?: string; token?: string };
  if (!slug || !token) return NextResponse.json({ error: "Slug dan kode klaim wajib diisi." }, { status: 400 });

  const { data: umkm } = await supabaseAdmin.from("umkm").select("id, owner_id").eq("slug", slug).maybeSingle();
  if (!umkm) return NextResponse.json({ error: "Halaman tidak ditemukan." }, { status: 404 });
  if (umkm.owner_id === user.id) return NextResponse.json({ ok: true });
  if (umkm.owner_id) return NextResponse.json({ error: "Halaman ini sudah dimiliki akun lain." }, { status: 409 });

  const { data: claim } = await supabaseAdmin.from("umkm_claims").select("token_hash").eq("umkm_id", umkm.id).maybeSingle();
  const given = createHash("sha256").update(token).digest("hex");
  const ok =
    !!claim && claim.token_hash.length === given.length && timingSafeEqual(Buffer.from(claim.token_hash), Buffer.from(given));
  if (!ok) return NextResponse.json({ error: "Kode klaim tidak cocok." }, { status: 403 });

  // Update bersyarat: hanya jika belum ada pemilik (cegah dua akun mengklaim bersamaan).
  const { data: upd, error } = await supabaseAdmin
    .from("umkm").update({ owner_id: user.id }).eq("id", umkm.id).is("owner_id", null).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!upd) return NextResponse.json({ error: "Halaman ini sudah dimiliki akun lain." }, { status: 409 });

  await supabaseAdmin.from("umkm_claims").delete().eq("umkm_id", umkm.id);
  return NextResponse.json({ ok: true });
}
