"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { authFetch, dropClaim, readClaims } from "@/lib/authFetch";
import { PAY_METHODS, PLANS, isPlanKey, rupiah, type PayMethodKey, type PlanKey } from "@/lib/site";

type Page = { slug: string; name: string; plan: string; plan_until: string | null; active: boolean };

const BENEFITS = ["Halaman tayang online untuk umum", "Bisa ditemukan di Google", "Semua 7 template premium", "Ganti template kapan saja"];

const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "");

export default function LanggananPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState<PlanKey>("yearly");
  const [method, setMethod] = useState<PayMethodKey>("qris");
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [claimSlug, setClaimSlug] = useState("");
  const [claimCode, setClaimCode] = useState("");
  const [claimMsg, setClaimMsg] = useState("");

  async function load(preferSlug?: string) {
    const res = await authFetch("/api/my-umkm");
    if (res.status === 401) return router.replace("/login?next=" + encodeURIComponent("/langganan" + window.location.search));
    const data = await res.json();
    const items: Page[] = data.items || [];
    setPages(items);
    setSlug((cur) => preferSlug || cur || items[0]?.slug || "");
  }

  useEffect(() => {
    (async () => {
      // Langkah 1: wajib login. Belum login -> /login lalu kembali ke sini.
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login?next=" + encodeURIComponent("/langganan" + window.location.search));
        return;
      }
      setEmail(data.session.user.email ?? "");

      const q = new URLSearchParams(window.location.search);
      if (isPlanKey(q.get("paket"))) setPlan(q.get("paket") as PlanKey);

      // Klaim halaman yang dibuat tanpa login di browser ini.
      for (const c of readClaims()) {
        const r = await authFetch("/api/claim", { method: "POST", body: JSON.stringify(c) });
        if (r.status < 500) dropClaim(c.slug);
      }
      await load(q.get("slug") || undefined);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = pages.find((p) => p.slug === slug);
  const price = PLANS[plan].amount;
  const methodInfo = useMemo(() => PAY_METHODS.find((m) => m.key === method)!, [method]);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    setClaimMsg("");
    const r = await authFetch("/api/claim", { method: "POST", body: JSON.stringify({ slug: claimSlug.trim(), token: claimCode.trim() }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return setClaimMsg(d.error || "Gagal mengklaim halaman.");
    setClaimMsg("Berhasil! Halaman sudah ditambahkan ke akunmu.");
    dropClaim(claimSlug.trim());
    await load(claimSlug.trim());
  }

  async function pay() {
    setError("");
    if (!current) return setError("Pilih halaman yang mau dilanggankan dulu.");
    setPaying(true);
    try {
      const r = await authFetch("/api/checkout", { method: "POST", body: JSON.stringify({ slug, plan, method }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Gagal membuat pembayaran.");
      window.location.href = d.redirectUrl; // halaman pembayaran Midtrans
    } catch (e: any) {
      setError(e.message);
      setPaying(false);
    }
  }

  if (!ready) {
    return (
      <div className="tpl grid min-h-screen place-items-center bg-[#fbfaf7] text-sm text-[#5b6b85]">Menyiapkan halaman langganan…</div>
    );
  }

  const card = "rounded-3xl border border-[#dfe6ee] bg-white p-6 shadow-[0_8px_24px_-14px_rgba(18,39,74,.25)]";
  const num = "grid h-8 w-8 flex-none place-items-center rounded-full bg-[#12274a] text-sm font-bold text-white";
  const opt = (on: boolean) =>
    `relative cursor-pointer rounded-2xl border-2 p-4 text-left transition ${on ? "border-[#f0813a] bg-[#fff6ee] shadow-[0_0_0_4px_rgba(240,129,58,.12)]" : "border-[#dfe6ee] bg-white hover:border-[#6bb8e8]"}`;

  return (
    <div className="tpl min-h-screen bg-[#fbfaf7] text-[#12274a]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Link href="/" className="font-display text-[22px] font-bold">Insta<span className="text-[#6bb8e8]">Laman</span></Link>
        <div className="flex items-center gap-3 text-sm text-[#5b6b85]">
          <span className="hidden sm:inline">{email}</span>
          <Link href="/dashboard" className="font-semibold text-[#12274a] hover:text-[#f0813a]">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Terbitkan halamanmu</h1>
        <p className="mt-2 text-[#5b6b85]">Halaman gratis hanya berupa pratinjau. Pilih halaman, pilih paket, lalu bayar. Halamanmu tayang otomatis setelah pembayaran berhasil.</p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-6">
            {/* 1. Halaman */}
            <section className={card}>
              <div className="flex items-center gap-3"><span className={num}>1</span><h2 className="font-display text-xl font-bold">Pilih halaman</h2></div>
              {pages.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {pages.map((p) => (
                    <button key={p.slug} type="button" onClick={() => setSlug(p.slug)} className={opt(slug === p.slug)} aria-pressed={slug === p.slug}>
                      <div className="font-semibold">{p.name}</div>
                      <div className="mt-0.5 truncate text-xs text-[#5b6b85]">/toko/{p.slug}</div>
                      <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${p.active ? "bg-[#e3f6e9] text-[#15803d]" : "bg-[#eef3f8] text-[#5b6b85]"}`}>
                        {p.active ? `Tayang sampai ${fmtDate(p.plan_until)}` : "Belum diterbitkan"}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-[#f3f6fa] p-5 text-sm text-[#33415c]">
                  Belum ada halaman di akun ini. <Link href="/buat" className="font-semibold text-[#f0813a] underline">Bikin halaman dulu</Link>, lalu kembali ke sini.
                </div>
              )}
              <details className="mt-5 text-sm">
                <summary className="cursor-pointer font-semibold text-[#5b6b85]">Halaman dibuat di perangkat lain? Masukkan kode klaim</summary>
                <form onSubmit={claim} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input type="text" value={claimSlug} onChange={(e) => setClaimSlug(e.target.value)} placeholder="Slug, mis. kedai-kopi" />
                  <input type="text" value={claimCode} onChange={(e) => setClaimCode(e.target.value)} placeholder="Kode klaim" />
                  <button className="btn s" type="submit">Klaim</button>
                </form>
                {claimMsg && <p className="mt-2 text-[#5b6b85]">{claimMsg}</p>}
              </details>
            </section>

            {/* 2. Paket */}
            <section className={card}>
              <div className="flex items-center gap-3"><span className={num}>2</span><h2 className="font-display text-xl font-bold">Pilih paket</h2></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(Object.keys(PLANS) as PlanKey[]).map((k) => (
                  <button key={k} type="button" onClick={() => setPlan(k)} className={opt(plan === k)} aria-pressed={plan === k}>
                    {k === "yearly" && <span className="absolute -top-3 left-4 rounded-full bg-[#f0813a] px-3 py-0.5 text-[11px] font-bold text-white">Hemat Rp50.000</span>}
                    <div className="font-semibold">{PLANS[k].label}</div>
                    <div className="mt-1 font-display text-2xl font-bold">{rupiah(PLANS[k].amount)}<span className="text-sm font-medium text-[#5b6b85]"> / {PLANS[k].per}</span></div>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Metode */}
            <section className={card}>
              <div className="flex items-center gap-3"><span className={num}>3</span><h2 className="font-display text-xl font-bold">Metode pembayaran</h2></div>
              <p className="mt-2 text-sm text-[#5b6b85]">Setelah klik Bayar, kode QRIS muncul. Scan dengan aplikasi apa saja, paket aktif otomatis begitu pembayaran masuk.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {PAY_METHODS.map((m) => (
                  <button key={m.key} type="button" onClick={() => setMethod(m.key)} className={opt(method === m.key) + " flex items-center gap-3"} aria-pressed={method === m.key}>
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-[#eef6fd] text-xl">{m.icon}</span>
                    <span><span className="block text-sm font-semibold">{m.label}</span><span className="block text-xs leading-snug text-[#5b6b85]">{m.desc}</span></span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Ringkasan */}
          <aside className={card + " lg:sticky lg:top-6"}>
            <h2 className="font-display text-xl font-bold">Ringkasan</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-[#5b6b85]">Halaman</dt><dd className="truncate text-right font-semibold">{current?.name ?? "-"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#5b6b85]">Paket</dt><dd className="font-semibold">{PLANS[plan].label}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#5b6b85]">Metode</dt><dd className="font-semibold">{methodInfo.label}</dd></div>
              {current?.active && <div className="rounded-xl bg-[#eef6fd] p-3 text-xs text-[#33415c]">Halaman masih tayang, jadi masa tayang baru ditambahkan setelah {fmtDate(current.plan_until)}.</div>}
            </dl>
            <div className="my-5 border-t border-dashed border-[#dfe6ee]" />
            <div className="flex items-end justify-between"><span className="text-sm text-[#5b6b85]">Total</span><span className="font-display text-3xl font-bold">{rupiah(price)}</span></div>
            <p className="mt-3 min-h-[1.25rem] text-sm font-medium text-[#d6322e]" role="alert">{error}</p>
            <button type="button" className="btn mt-1 w-full text-center" onClick={pay} disabled={paying || !current} style={paying || !current ? { opacity: 0.6, cursor: "not-allowed" } : undefined}>
              {paying ? "Mengarahkan ke Midtrans…" : "Bayar sekarang"}
            </button>
            <p className="mt-3 text-center text-xs text-[#5b6b85]">🔒 Pembayaran diproses Midtrans. Kami tidak menyimpan data kartu atau rekeningmu.</p>
            <ul className="mt-5 grid gap-2 border-t border-[#dfe6ee] pt-4 text-sm">
              {BENEFITS.map((b) => (<li key={b} className="flex gap-2"><span className="text-[#6bb8e8]">✓</span>{b}</li>))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
}
