"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/authFetch";

type Order = { id: string; status: "pending" | "paid" | "failed" | "expired"; redirect_url: string | null };

// Midtrans mengarahkan pembeli ke sini setelah bayar. Status asli datang dari webhook, jadi halaman ini menunggu (polling).
export default function Selesai() {
  const [order, setOrder] = useState<Order | null>(null);
  const [err, setErr] = useState("");
  const [tries, setTries] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("order_id");
    if (!id) { setErr("Nomor pesanan tidak ditemukan."); return; }
    let n = 0;
    const tick = async () => {
      const r = await authFetch(`/api/order-status?order_id=${encodeURIComponent(id)}`);
      if (r.status === 401) { window.location.href = "/login?next=" + encodeURIComponent(location.pathname + location.search); return; }
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(d.error || "Gagal memeriksa pesanan."); return; }
      setOrder(d); setTries(++n);
      if (d.status === "pending" && n < 40) timer.current = setTimeout(tick, 3000);
    };
    tick();
    return () => clearTimeout(timer.current);
  }, []);

  const status = order?.status;
  const box = "mx-auto w-full max-w-md rounded-[2rem] border border-[#dfe6ee] bg-white p-8 text-center shadow-[0_30px_60px_-30px_rgba(18,39,74,.35)]";

  return (
    <main className="tpl grid min-h-screen place-items-center bg-[#fbfaf7] px-5 text-[#12274a]">
      <div className={box}>
        {err ? (
          <>
            <div className="text-5xl">⚠️</div>
            <h1 className="mt-4 font-display text-2xl font-bold">Ada masalah</h1>
            <p className="mt-2 text-[#5b6b85]">{err}</p>
            <Link className="btn mt-6" href="/dashboard">Ke dashboard</Link>
          </>
        ) : status === "paid" ? (
          <>
            <div className="text-5xl">🎉</div>
            <h1 className="mt-4 font-display text-2xl font-bold">Pembayaran berhasil</h1>
            <p className="mt-2 text-[#5b6b85]">Halamanmu sudah diterbitkan dan bisa dibuka siapa saja. Sekarang kamu juga bisa memilih template premium.</p>
            <Link className="btn mt-6" href="/dashboard">Pilih template</Link>
          </>
        ) : status === "failed" || status === "expired" ? (
          <>
            <div className="text-5xl">😕</div>
            <h1 className="mt-4 font-display text-2xl font-bold">{status === "expired" ? "Pembayaran kedaluwarsa" : "Pembayaran gagal"}</h1>
            <p className="mt-2 text-[#5b6b85]">Tidak ada dana yang terpotong untuk pesanan ini. Kamu bisa mencoba lagi.</p>
            <Link className="btn mt-6" href="/langganan">Coba lagi</Link>
          </>
        ) : (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#e6f3fc] border-t-[#f0813a]" />
            <h1 className="mt-5 font-display text-2xl font-bold">Menunggu konfirmasi</h1>
            <p className="mt-2 text-[#5b6b85]">
              {tries >= 40 ? "Konfirmasi belum masuk. Kalau kamu sudah membayar, tunggu beberapa menit lalu cek dashboard." : "Kami sedang memastikan pembayaranmu. Jangan tutup halaman ini."}
            </p>
            {order?.redirect_url && <a className="btn g mt-6" href={order.redirect_url}>Lanjutkan pembayaran</a>}
            {tries >= 40 && <Link className="btn mt-3" href="/dashboard">Ke dashboard</Link>}
          </>
        )}
      </div>
    </main>
  );
}
