import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, unauthorized } from "@/lib/serverAuth";
import { isPlanActive } from "@/lib/site";
import { isTemplateKey } from "@/lib/templates";

// Ganti template: hanya pemilik halaman DAN paket langganan masih aktif.
export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const { slug, template } = (await req.json().catch(() => ({}))) as { slug?: string; template?: string };
  if (!slug || !isTemplateKey(template)) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

  const { data: u } = await supabaseAdmin.from("umkm").select("id, owner_id, plan, plan_until").eq("slug", slug).maybeSingle();
  if (!u || u.owner_id !== user.id) return NextResponse.json({ error: "Halaman ini bukan milik akun kamu." }, { status: 403 });
  if (template !== "basic" && !isPlanActive(u)) {
    return NextResponse.json({ error: "Template ini khusus paket langganan yang aktif." }, { status: 402 });
  }
  const { error } = await supabaseAdmin.from("umkm").update({ template }).eq("id", u.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
