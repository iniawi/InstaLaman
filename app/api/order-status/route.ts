import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, unauthorized } from "@/lib/serverAuth";
import { PLANS, addMonths, isPlanActive, isPlanKey } from "@/lib/site";

const IS_PROD = process.env.MIDTRANS_IS_PRODUCTION === "true";
const API = IS_PROD
  ? "https://api.midtrans.com"
  : "https://api.sandbox.midtrans.com";

// Tanya status langsung ke Midtrans (dipakai kalau webhook belum masuk).
async function midtransStatus(orderId: string) {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) return null;
  const res = await fetch(`${API}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: {
      Accept: "application/json",
      Authorization: "Basic " + Buffer.from(key + ":").toString("base64"),
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

// Tandai lunas hanya sekali, lalu aktifkan paket. Sama persis dengan logika webhook.
async function markPaidAndActivate(order: any, paymentType: string | null) {
  const { data: marked } = await supabaseAdmin
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      payment_type: paymentType,
    })
    .eq("id", order.id)
    .neq("status", "paid")
    .select("id")
    .maybeSingle();
  if (!marked) return;

  try {
    if (!order.umkm_id || !isPlanKey(order.plan))
      throw new Error("Pesanan tidak lengkap.");
    const { data: u } = await supabaseAdmin
      .from("umkm")
      .select("plan, plan_until")
      .eq("id", order.umkm_id)
      .single();
    const base =
      u && isPlanActive(u) && u.plan_until
        ? new Date(u.plan_until)
        : new Date();
    const { error } = await supabaseAdmin
      .from("umkm")
      .update({
        plan: order.plan,
        plan_until: addMonths(base, PLANS[order.plan].months).toISOString(),
      })
      .eq("id", order.umkm_id);
    if (error) throw error;
  } catch {
    await supabaseAdmin
      .from("orders")
      .update({ status: "pending", paid_at: null })
      .eq("id", order.id);
  }
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const id = req.nextUrl.searchParams.get("order_id");
  if (!id)
    return NextResponse.json({ error: "order_id wajib." }, { status: 400 });

  const load = () =>
    supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

  let { data: order } = await load();
  if (!order)
    return NextResponse.json(
      { error: "Pesanan tidak ditemukan." },
      { status: 404 },
    );

  if (order.status === "pending") {
    const s = await midtransStatus(order.id);
    if (s && Math.round(parseFloat(s.gross_amount)) === order.amount) {
      const ts: string = s.transaction_status;
      const paid =
        ts === "settlement" ||
        (ts === "capture" && s.fraud_status === "accept");
      if (paid) {
        await markPaidAndActivate(order, s.payment_type ?? null);
      } else if (ts === "expire") {
        await supabaseAdmin
          .from("orders")
          .update({ status: "expired" })
          .eq("id", order.id)
          .eq("status", "pending");
      } else if (["deny", "cancel", "failure"].includes(ts)) {
        await supabaseAdmin
          .from("orders")
          .update({ status: "failed" })
          .eq("id", order.id)
          .eq("status", "pending");
      }
      ({ data: order } = await load());
    }
  }

  const { id: oid, status, plan, amount, redirect_url, umkm_id } = order!;
  return NextResponse.json({
    id: oid,
    status,
    plan,
    amount,
    redirect_url,
    umkm_id,
  });
}
