import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { validNotificationSignature } from "@/lib/midtrans";
import { PLANS, addMonths, isPlanActive, isPlanKey } from "@/lib/site";

// Webhook Midtrans. Daftarkan di Midtrans Dashboard > Settings > Configuration > Payment Notification URL:
//   https://DOMAINMU/api/midtrans/notify
// Sumber kebenaran pembayaran adalah webhook ini (bukan redirect browser).
export async function POST(req: NextRequest) {
  const n = await req.json().catch(() => null);
  if (!n || !validNotificationSignature(n)) {
    return NextResponse.json({ error: "Signature tidak valid." }, { status: 403 });
  }

  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", n.order_id).maybeSingle();
  if (!order) return NextResponse.json({ ok: true, ignored: "order tidak dikenal" }); // mis. notifikasi tes dari Midtrans

  // Nominal harus sama dengan yang kita simpan.
  if (Math.round(parseFloat(n.gross_amount)) !== order.amount) {
    return NextResponse.json({ error: "Nominal tidak cocok." }, { status: 400 });
  }

  const ts: string = n.transaction_status;
  const paid = ts === "settlement" || (ts === "capture" && n.fraud_status === "accept");
  const next = paid ? "paid" : ts === "expire" ? "expired" : ["deny", "cancel", "failure"].includes(ts) ? "failed" : "pending";

  if (next !== "paid") {
    if (order.status === "pending" && next !== "pending") {
      await supabaseAdmin.from("orders").update({ status: next, payment_type: n.payment_type ?? null }).eq("id", order.id).eq("status", "pending");
    }
    return NextResponse.json({ ok: true });
  }

  // Tandai lunas HANYA sekali (update bersyarat), baru aktifkan paket. Aman kalau Midtrans mengirim notifikasi berulang.
  const { data: marked } = await supabaseAdmin
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), payment_type: n.payment_type ?? null })
    .eq("id", order.id)
    .neq("status", "paid")
    .select("id")
    .maybeSingle();
  if (!marked) return NextResponse.json({ ok: true, already: true });

  try {
    if (!order.umkm_id || !isPlanKey(order.plan)) throw new Error("Pesanan tidak lengkap.");
    const { data: u } = await supabaseAdmin.from("umkm").select("plan, plan_until").eq("id", order.umkm_id).single();
    // Kalau masih aktif, perpanjang dari tanggal berakhir; kalau tidak, mulai dari sekarang.
    const base = u && isPlanActive(u) && u.plan_until ? new Date(u.plan_until) : new Date();
    const { error } = await supabaseAdmin
      .from("umkm")
      .update({ plan: order.plan, plan_until: addMonths(base, PLANS[order.plan].months).toISOString() })
      .eq("id", order.umkm_id);
    if (error) throw error;
  } catch (e: any) {
    // Gagal aktivasi: kembalikan ke pending dan balas 500 supaya Midtrans mengirim ulang.
    await supabaseAdmin.from("orders").update({ status: "pending", paid_at: null }).eq("id", order.id);
    return NextResponse.json({ error: e?.message || "Gagal mengaktifkan paket." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
