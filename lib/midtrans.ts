import { createHash, timingSafeEqual } from "crypto";

// Server-only. Isi MIDTRANS_SERVER_KEY di environment (sandbox dulu, produksi kalau sudah siap).
const IS_PROD = process.env.MIDTRANS_IS_PRODUCTION === "true";
const SNAP_URL = IS_PROD
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export type SnapPayload = Record<string, unknown>;

export async function createSnapTransaction(payload: SnapPayload): Promise<{ token: string; redirect_url: string }> {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) throw new Error("MIDTRANS_SERVER_KEY belum diset di environment variables.");
  const res = await fetch(SNAP_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(key + ":").toString("base64"),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    const msg = data?.error_messages?.join?.(", ") || data?.status_message || `Midtrans error ${res.status}`;
    throw new Error(msg);
  }
  return { token: data.token, redirect_url: data.redirect_url };
}

/** signature_key = SHA512(order_id + status_code + gross_amount + ServerKey) */
export function validNotificationSignature(n: any): boolean {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key || !n?.order_id || !n?.status_code || !n?.gross_amount || !n?.signature_key) return false;
  const expected = createHash("sha512").update(`${n.order_id}${n.status_code}${n.gross_amount}${key}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(n.signature_key));
  return a.length === b.length && timingSafeEqual(a, b);
}
