import { Pic, PoweredBy, TplProps, WaButton, orderText, waHref, where } from "./shared";

// Jasa & digital: gelap, aksen ungu, mockup jendela browser.
export default function Jasa({ umkm, products }: TplProps) {
  const wa = waHref(umkm, orderText(umkm));
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1020] font-sans text-[#e8ecff]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#7c5cff]/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-96 h-[24rem] w-[24rem] rounded-full bg-[#22d3ee]/20 blur-[120px]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-display text-lg font-bold"><span className="text-[#7c5cff]">◆</span> {umkm.name}</span>
        <WaButton href={wa} className="rounded-full bg-white/10 px-5 py-2 text-sm ring-1 ring-white/20 hover:bg-white/20">Hubungi</WaButton>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 md:grid-cols-2 md:pt-20">
        <div>
          {where(umkm) && <span className="rounded-full bg-[#7c5cff]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#b8a8ff] ring-1 ring-[#7c5cff]/40">{where(umkm)}</span>}
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] md:text-6xl">
            {umkm.tagline || umkm.name}
          </h1>
          <p className="mt-5 max-w-md text-lg text-[#a7b0d6]">{umkm.name}: kerja rapi, revisi jelas, hasil bisa langsung dipakai.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WaButton href={wa} className="rounded-full bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] px-7 py-3.5 text-white shadow-lg shadow-[#7c5cff]/30">Minta penawaran</WaButton>
            <a href="#layanan" className="rounded-full px-7 py-3.5 font-semibold ring-1 ring-white/25 hover:bg-white/10">Lihat layanan</a>
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/15 backdrop-blur">
          <div className="flex gap-1.5 px-3 py-2"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></div>
          <Pic src={umkm.cover_url} emoji="💼" size="text-[6rem]" bg="bg-gradient-to-br from-[#2a2f66] to-[#0f6f86]" className="aspect-[16/11] rounded-xl" />
        </div>
      </section>

      {products.length > 0 && (
        <section id="layanan" className="relative mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Layanan & paket</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {products.map((p, i) => (
              <article key={p.id ?? i} className="group relative overflow-hidden rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-[#7c5cff]/60">
                <span className="font-display text-sm font-bold text-[#7c5cff]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-xl font-bold">{p.name}</h3>
                {p.description && <p className="mt-2 text-sm text-[#a7b0d6]">{p.description}</p>}
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-[#67e8f9]">{p.price}</span>
                  <a href={waHref(umkm, orderText(umkm, p.name))} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#b8a8ff] group-hover:text-white">Pesan →</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="relative mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[["01", "Ceritakan kebutuhan", "Lewat WhatsApp, singkat saja."], ["02", "Kami kerjakan", "Progres dikabarkan berkala."], ["03", "Revisi & serah terima", "Selesai sampai kamu puas."]].map(([n, t, d]) => (
            <div key={n} className="rounded-2xl border border-white/10 p-6"><div className="font-display text-3xl font-extrabold text-white/20">{n}</div><div className="mt-2 font-semibold">{t}</div><div className="text-sm text-[#a7b0d6]">{d}</div></div>
          ))}
        </div>
      </section>

      {umkm.about && (
        <section className="relative mx-auto max-w-3xl px-5 py-12 text-center">
          <h2 className="font-display text-3xl font-bold">Tentang kami</h2>
          <p className="mt-4 text-lg leading-relaxed text-[#a7b0d6]">{umkm.about}</p>
          <WaButton href={wa} className="mt-8 rounded-full bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] px-8 py-4 text-white">Mulai proyekmu</WaButton>
        </section>
      )}

      <footer className="relative px-5 py-10 text-center text-sm text-[#7d86ab]">
        © {new Date().getFullYear()} {umkm.name}<br /><PoweredBy />
      </footer>
    </main>
  );
}
