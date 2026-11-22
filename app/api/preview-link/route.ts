import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, unauthorized } from "@/lib/serverAuth";
import { previewPath } from "@/lib/preview";

// Link pratinjau untuk halaman milik user yang login.
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const { data: u } = await supabaseAdmin.from("umkm").select("owner_id").eq("slug", slug).maybeSingle();
  if (!u || u.owner_id !== user.id) return NextResponse.json({ error: "Halaman ini bukan milik akun kamu." }, { status: 403 });
  return NextResponse.json({ url: previewPath(slug) });
}
