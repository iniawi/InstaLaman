import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, unauthorized } from "@/lib/serverAuth";
import { isPlanActive } from "@/lib/site";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { data, error } = await supabaseAdmin
    .from("umkm")
    .select("slug, name, plan, plan_until, template, cover_url")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    email: user.email,
    items: (data || []).map((u) => ({ ...u, active: isPlanActive(u) })),
  });
}
