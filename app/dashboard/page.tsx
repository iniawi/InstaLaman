"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { authFetch } from "@/lib/authFetch";
import { TEMPLATES, TEMPLATE_MAP, isTemplateKey, type TemplateKey } from "@/lib/templates";

type Page = { slug: string; name: string; plan: string; plan_until: string | null; template: string; active: boolean };

const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "");

export default function Dashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [saving, setSaving] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function load() {
    const r = await authFetch("/api/my-umkm");
    if (r.status === 401) return router.replace("/login?next=/dashboard");
    const d = await r.json();
    setPages(d.items || []);
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.replace("/login?next=/dashboard");
      setEmail(data.session.user.email ?? "");
      await load();
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function preview(slug: string) {
    setMsg(null);
    const r = await authFetch(`/api/preview-link?slug=${encodeURIComponent(slug)}`);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return setMsg({ ok: false, text: d.error || "Gagal membuka pratinjau." });
    window.open(d.url, "_blank", "noopener");
  }

  async function choose(slug: string, template: TemplateKey) {
    setMsg(null);
    setSaving(slug + template);
    const r = await authFetch("/api/template", { method: "POST", body: JSON.stringify({ slug, template }) });
    const d = await r.json().catch(() => ({}));
    setSaving("");
    if (!r.ok) return setMsg({ ok: false, text: d.error || "Gagal menyimpan template." });
    setPages((p) => p.map((x) => (x.slug === slug ? { ...x, template } : x)));
    setMsg({ ok: true, text: `Template ${TEMPLATE_MAP[template].name} dipasang. Cek halamanmu.` });
  }

  if (!ready) return <div className="tpl grid min-h-screen place-items-center bg-[#fbfaf7] text-sm text-[#5b6b85]">Memuat dashboard…</div>;

  return (
    <div className="tpl min-h-screen bg-[#fbfaf7] text-[#12274a]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Link href="/" className="font-display text-[22px] font-bold">Insta<span className="text-[#6bb8e8]">Laman</span></Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-[#5b6b85] sm:inline">{email}</span>
          <button className="font-semibold hover:text-[#f0813a]" onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>Keluar</button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Dashboard</h1>
            <p className="mt-1 text-[#5b6b85]">Pratinjau, terbitkan, dan atur template halaman usahamu.</p>
          </div>
          <Link href="/buat" className="btn g s">+ Halaman baru</Link>
        </div>

        <p role="status" className={`mt-4 min-h-[1.5rem] text-sm font-medium ${msg?.ok ? "text-[#15803d]" : "text-[#d6322e]"}`}>{msg?.text}</p>

        {pages.length === 0 && (
          <div className="mt-4 rounded-3xl border border-dashed border-[#c9d6e4] bg-white p-10 text-center">
            <div className="text-4xl">🌐</div>
            <h2 className="mt-3 font-display text-xl font-bold">Belum ada halaman</h2>
            <p className="mt-1 text-[#5b6b85]">Bikin halaman pertamamu gratis dan lihat pratinjaunya. Kalau sudah pernah bikin tanpa login, klaim lewat halaman terbitkan.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/buat" className="btn">Bikin halaman</Link><Link href="/langganan" className="btn g">Klaim halaman</Link></div>
          </div>
        )}

        <div className="grid gap-6">
          {pages.map((p) => {
            const cur: TemplateKey = isTemplateKey(p.template) ? p.template : "basic";
            const live: TemplateKey = p.active ? cur : "basic";
            return (
              <section key={p.slug} className="rounded-3xl border border-[#dfe6ee] bg-white p-6 shadow-[0_8px_24px_-14px_rgba(18,39,74,.25)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold">{p.name}</h2>
                    {p.active ? <Link href={`/toko/${p.slug}`} className="text-sm text-[#5b6b85] underline-offset-2 hover:underline">/toko/{p.slug}</Link> : <span className="text-sm text-[#5b6b85]">/toko/{p.slug} · belum tayang</span>}
                    <div className="mt-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.active ? "bg-[#e3f6e9] text-[#15803d]" : "bg-[#eef3f8] text-[#5b6b85]"}`}>
                        {p.active ? `Tayang online sampai ${fmtDate(p.plan_until)}` : p.plan !== "free" ? "Offline · langganan berakhir" : "Belum diterbitkan (pratinjau)"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {p.active ? <Link href={`/toko/${p.slug}`} className="btn g s">Lihat halaman</Link> : <button type="button" className="btn g s" onClick={() => preview(p.slug)}>Pratinjau</button>}
                    <Link href={`/langganan?slug=${encodeURIComponent(p.slug)}`} className="btn s">{p.active ? "Perpanjang" : "Terbitkan"}</Link>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#eef3f8] pt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">Template</h3>
                    <span className="text-xs text-[#5b6b85]">Tampil sekarang: <b>{TEMPLATE_MAP[live].name}</b></span>
                  </div>
                  {!p.active && (
                    <p className="mt-2 rounded-xl bg-[#fff6ee] p-3 text-sm text-[#7a4a1c]">
                      🔒 Halaman ini belum tayang online. Terbitkan untuk membuka semua template. <Link href={`/langganan?slug=${encodeURIComponent(p.slug)}`} className="font-bold underline">Terbitkan sekarang</Link>
                    </p>
                  )}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {TEMPLATES.map((t) => {
                      const locked = t.premium && !p.active;
                      const on = cur === t.key && (!t.premium || p.active);
                      return (
                        <button
                          key={t.key}
                          type="button"
                          disabled={locked || !!saving}
                          onClick={() => choose(p.slug, t.key)}
                          aria-pressed={on}
                          className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${on ? "border-[#f0813a] bg-[#fff6ee]" : "border-[#dfe6ee] bg-white"} ${locked ? "cursor-not-allowed opacity-55" : "hover:border-[#6bb8e8]"}`}
                        >
                          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl text-xl" style={{ background: t.swatch[0] }}>{t.emoji}</span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">{t.name} {locked && "🔒"}</span>
                            <span className="block truncate text-xs text-[#5b6b85]">{saving === p.slug + t.key ? "Menyimpan…" : t.category}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-[#5b6b85]">Ingin lihat dulu? <Link className="font-semibold underline" href="/template">Galeri template</Link> atau tambahkan <code>?tpl=kuliner</code> di akhir link halamanmu.</p>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
