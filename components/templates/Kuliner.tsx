import { Pic, PoweredBy, TplProps, WaButton, orderText, waHref, where } from "./shared";

// Referensi: landing page kuliner hangat (krem + oranye + hijau tua), menu bulat, banner promo.
export default function Kuliner({ umkm, products }: TplProps) {
  const wa = waHref(umkm, orderText(umkm));
  const words = umkm.name.trim().split(/\s+/);
  const last = words.pop();
  const head = words.join(" ");

  return (
    <main className="min-h-screen bg-[#fff6e6] font-sans text-[#2b2a1f]">
      <header className="sticky top-0 z-30 border-b border-[#f0dcb8] bg-[#fff6e6]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <span className="font-display text-lg font-bold text-[#1f5f3a]">{umkm.name}</span>
          <nav className="hidden gap-7 text-sm font-medium md:flex">
            <a href="#menu" className="hover:text-[#e8741a]">Menu</a>
            <a href="#tentang" className="hover:text-[#e8741a]">Tentang</a>
            <a href="#pesan" className="hover:text-[#e8741a]">Pesan</a>
          </nav>
          <WaButton href={wa} className="rounded-full bg-[#1f5f3a] px-5 py-2 text-sm text-white hover:bg-[#184a2e]">Pesan</WaButton>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#ffd9a0]/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-24">
          <div>
            {where(umkm) && (
              <span className="inline-block rounded-full bg-[#1f5f3a]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#1f5f3a]">
                {where(umkm)}
              </span>
            )}
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              {head && <>{head} </>}
              <span className="text-[#f08a24]">{last}</span>
            </h1>
            {umkm.tagline && <p className="mt-5 max-w-md text-lg text-[#5b5640]">{umkm.tagline}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <WaButton href={wa} className="rounded-full bg-[#f08a24] px-7 py-3.5 text-white shadow-lg shadow-[#f08a24]/30 hover:bg-[#e07a14]">Pesan sekarang</WaButton>
              <a href="#menu" className="rounded-full border-2 border-[#1f5f3a] px-7 py-3 font-semibold text-[#1f5f3a] hover:bg-[#1f5f3a] hover:text-white">Lihat menu</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 -rotate-6 rounded-[3rem] bg-[#1f5f3a]" />
            <Pic src={umkm.cover_url} emoji="🍜" size="text-[7rem]" bg="bg-gradient-to-br from-[#ffd28a] to-[#f08a24]"
              className="relative aspect-square rounded-[3rem] border-8 border-white shadow-2xl" />
            <span className="absolute -left-3 top-8 rounded-2xl bg-white px-4 py-2 text-sm font-bold shadow-xl">🔥 Favorit pelanggan</span>
            <span className="absolute -right-3 bottom-10 rounded-2xl bg-white px-4 py-2 text-sm font-bold shadow-xl">⚡ Pesan via WhatsApp</span>
          </div>
        </div>
      </section>

      {/* Menu */}
      {products.length > 0 && (
        <section id="menu" className="mx-auto max-w-6xl px-5 py-16">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#f08a24]">Menu kami</span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Pilihan favorit untukmu</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-4">
            {products.map((p, i) => (
              <article key={p.id ?? i} className="group relative rounded-3xl bg-white px-4 pb-5 pt-[5.25rem] text-center shadow-sm ring-1 ring-[#f0dcb8] transition hover:-translate-y-1 hover:shadow-xl">
                <Pic src={p.image_url} emoji={["🍛", "🍲", "🍢", "🥤"][i % 4]} bg="bg-gradient-to-br from-[#ffe2b0] to-[#ffc46b]"
                  className="absolute -top-10 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full border-4 border-white shadow-lg transition group-hover:scale-105" size="text-5xl" />
                <h3 className="font-display text-base font-bold leading-snug">{p.name}</h3>
                {p.description && <p className="mt-1 line-clamp-2 text-xs text-[#6b6650]">{p.description}</p>}
                {p.price && <div className="mt-3 inline-block rounded-full bg-[#1f5f3a] px-4 py-1 text-sm font-bold text-white">{p.price}</div>}
                <a href={waHref(umkm, orderText(umkm, p.name))} target="_blank" rel="noopener noreferrer"
                  className="mt-3 block text-sm font-semibold text-[#e8741a] hover:underline">+ Pesan</a>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Banner */}
      <section id="pesan" className="mx-auto max-w-6xl px-5 pb-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#f08a24] to-[#f5a64a] px-8 py-12 text-white md:px-14">
          <div className="absolute -right-10 -top-10 text-[12rem] opacity-20">🍽️</div>
          <h2 className="relative max-w-lg font-display text-3xl font-extrabold leading-tight md:text-4xl">Lapar? Pesan sekarang, langsung diantar.</h2>
          <p className="relative mt-3 max-w-md text-white/90">Chat kami lewat WhatsApp, sebutkan pesananmu, dan kami siapkan.</p>
          <WaButton href={wa} className="relative mt-6 rounded-full bg-white px-7 py-3.5 text-[#c75d05] hover:bg-[#fff6e6]">Chat WhatsApp</WaButton>
        </div>
      </section>

      {umkm.about && (
        <section id="tentang" className="mx-auto max-w-3xl px-5 pb-20 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#1f5f3a]">Tentang kami</span>
          <p className="mt-4 text-lg leading-relaxed text-[#4a4733]">{umkm.about}</p>
        </section>
      )}

      <footer className="bg-[#1f5f3a] px-5 py-10 text-center text-sm text-white/80">
        <div className="font-display text-lg font-bold text-white">{umkm.name}</div>
        <div className="mt-1">© {new Date().getFullYear()} · {umkm.city}</div>
        <PoweredBy className="mt-3 inline-block" />
      </footer>
    </main>
  );
}
