import { Pic, PoweredBy, TplProps, WaButton, orderText, waHref, where } from "./shared";

// Referensi: toko kue pastel, kartu membulat, kategori berbentuk pil.
export default function Kue({ umkm, products }: TplProps) {
  const wa = waHref(umkm, orderText(umkm));
  const emojis = ["🍪", "🍰", "🧁", "🎁", "🍩", "🥐"];
  return (
    <main className="min-h-screen bg-[#fff7f4] font-sans text-[#4a2530]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-serif text-2xl font-bold text-[#d85d75]">{umkm.name}</span>
        <WaButton href={wa} className="rounded-full bg-[#d85d75] px-5 py-2.5 text-sm text-white shadow-md shadow-[#d85d75]/30 hover:bg-[#c64a63]">Pesan</WaButton>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-6 md:grid-cols-[1.1fr_.9fr] md:pt-12">
        <div>
          {where(umkm) && <span className="rounded-full bg-[#ffe0e6] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#d85d75]">{where(umkm)}</span>}
          <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.05] md:text-6xl">{umkm.name}</h1>
          {umkm.tagline && <p className="mt-5 max-w-md text-lg text-[#7d5560]">{umkm.tagline}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <WaButton href={wa} className="rounded-full bg-[#d85d75] px-7 py-3.5 text-white shadow-lg shadow-[#d85d75]/30 hover:bg-[#c64a63]">Pesan lewat WhatsApp</WaButton>
            <a href="#katalog" className="rounded-full bg-white px-7 py-3.5 font-semibold text-[#d85d75] ring-1 ring-[#f5c7d0] hover:bg-[#ffe0e6]">Lihat katalog</a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-4 rounded-[4rem] bg-[#ffe0e6]" />
          <Pic src={umkm.cover_url} emoji="🍪" size="text-[7rem]" bg="bg-gradient-to-br from-[#ffd6c2] to-[#ffb3c1]"
            className="relative aspect-[4/5] rounded-t-[10rem] rounded-b-[2.5rem] border-8 border-white shadow-xl" />
          <span className="absolute -bottom-3 -left-4 rounded-2xl bg-white px-4 py-2 text-sm font-bold shadow-lg">🎂 Dipanggang segar</span>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-5 py-6 text-sm font-semibold">
        {["Kue kering", "Brownies", "Hampers", "Camilan"].map((c) => (
          <span key={c} className="rounded-full bg-white px-5 py-2 text-[#b8485f] ring-1 ring-[#f5c7d0]">{c}</span>
        ))}
      </div>

      {products.length > 0 && (
        <section id="katalog" className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">Katalog manis kami</h2>
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <article key={p.id ?? i} className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-[#f9dbe1] transition hover:-translate-y-1 hover:shadow-xl">
                <Pic src={p.image_url} emoji={emojis[i % emojis.length]} bg="bg-gradient-to-br from-[#ffe9dd] to-[#ffd0da]" className="aspect-square rounded-[1.5rem]" />
                <div className="px-2 pb-2 pt-4">
                  <h3 className="font-serif text-lg font-bold leading-snug">{p.name}</h3>
                  {p.description && <p className="mt-1 line-clamp-2 text-xs text-[#8a6470]">{p.description}</p>}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-bold text-[#d85d75]">{p.price}</span>
                    <a href={waHref(umkm, orderText(umkm, p.name))} target="_blank" rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-full bg-[#d85d75] text-lg font-bold text-white hover:bg-[#c64a63]" aria-label={`Pesan ${p.name}`}>+</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {umkm.about && (
        <section className="mx-auto max-w-5xl px-5 py-10">
          <div className="rounded-[3rem] bg-[#ffe0e6] px-8 py-12 text-center md:px-16">
            <div className="text-4xl">🧁</div>
            <h2 className="mt-3 font-serif text-3xl font-bold">Cerita kami</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#6b4350]">{umkm.about}</p>
          </div>
        </section>
      )}

      <footer className="px-5 py-12 text-center text-sm text-[#8a6470]">
        <div className="font-serif text-xl font-bold text-[#d85d75]">{umkm.name}</div>
        <div className="mt-1">© {new Date().getFullYear()}</div>
        <PoweredBy className="mt-2 inline-block" />
      </footer>
    </main>
  );
}
