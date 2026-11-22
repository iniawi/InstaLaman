import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, unauthorized } from "@/lib/serverAuth";
import { createSnapTransaction } from "@/lib/midtrans";
import { PAY_METHODS, PLANS, isPlanKey, rootUrl } from "@/lib/site";

// Buat pesanan + transaksi Midtrans Snap. Harga dari server, kepemilikan dicek di server.
export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const { slug, plan, method } = (await req.json().catch(() => ({}))) as { slug?: string; plan?: string; method?: string };
  if (!slug || !isPlanKey(plan)) return NextResponse.json({ error: "Pilih halaman dan paket dulu." }, { status: 400 });
  const pm = PAY_METHODS.find((m) => m.key === method) ?? PAY_METHODS[0];

  const { data: umkm } = await supabaseAdmin.from("umkm").select("id, name, slug, owner_id").eq("slug", slug).maybeSingle();
  if (!umkm || umkm.owner_id !== user.id) {
    return NextResponse.json({ error: "Halaman ini bukan milik akun kamu." }, { status: 403 });
  }

  const p = PLANS[plan];
  const orderId = `IL-${randomBytes(4).toString("hex")}-${Date.now()}`;
  const finish = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ? rootUrl("/langganan/selesai") : `${req.nextUrl.origin}/langganan/selesai`) + `?order_id=${orderId}`;

  try {
    const snap = await createSnapTransaction({
      transaction_details: { order_id: orderId, gross_amount: p.amount },
      item_details: [{ id: plan, name: `InstaLaman ${p.label} - ${umkm.name}`.slice(0, 50), price: p.amount, quantity: 1 }],
      customer_details: { email: user.email },
      ...(pm.enabled ? { enabled_payments: pm.enabled } : {}),
      callbacks: { finish },
    });

    const { error } = await supabaseAdmin.from("orders").insert({
      id: orderId, umkm_id: umkm.id, user_id: user.id, plan, amount: p.amount, method: pm.key,
      snap_token: snap.token, redirect_url: snap.redirect_url,
    });
    if (error) throw new Error(error.message);

    return NextResponse.json({ orderId, redirectUrl: snap.redirect_url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Gagal membuat pembayaran." }, { status: 502 });
  }
}
