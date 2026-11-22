import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, unauthorized } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const id = req.nextUrl.searchParams.get("order_id");
  if (!id) return NextResponse.json({ error: "order_id wajib." }, { status: 400 });
  const { data } = await supabaseAdmin
    .from("orders").select("id, status, plan, amount, redirect_url, umkm_id").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  return NextResponse.json(data);
}
