import { Pic, PoweredBy, TplProps, WaButton, orderText, waHref, where } from "./shared";

// Kecantikan & kesehatan: hijau sage + blush, tenang, daftar produk horizontal.
export default function Kecantikan({ umkm, products }: TplProps) {
  const wa = waHref(umkm, orderText(umkm));
  const emojis = ["🍵", "🌸", "🧴", "🌿", "🫖", "🕯️"];
  return (
    <main className="min-h-screen bg-[#f6f3ee] font-sans text-[#2f4a3f]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-serif text-2xl font-semibold">{umkm.name}</span>
        <WaButton href={wa} className="rounded-full bg-[#2f4a3f] px-5 py-2.5 text-sm text-white hover:bg-[#223a30]">Konsultasi</WaButton>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 md:grid-cols-2">
        <Pic src={umkm.cover_url} emoji="🌿" size="text-[7rem]" bg="bg-gradient-to-b from-[#dbe7d5] to-[#b9cfb3]"
          className="order-2 mx-auto aspect-[4/5] w-full max-w-sm rounded-t-full rounded-b-[2rem] md:order-1" />
        <div className="order-1 md:order-2">
          {where(umkm) && <span className="rounded-full bg-[#f4d9d6] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#a4605b]">{where(umkm)}</span>}
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] md:text-6xl">{umkm.name}</h1>
          {umkm.tagline && <p className="mt-5 max-w-md text-lg text-[#5d7568]">{umkm.tagline}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <WaButton href={wa} className="rounded-full bg-[#d98b86] px-7 py-3.5 text-white hover:bg-[#c97a75]">Konsultasi gratis</WaButton>
            <a href="#produk" className="rounded-full border border-[#2f4a3f]/30 px-7 py-3.5 font-semibold hover:bg-white">Lihat produk</a>
          </div>
        </div>
      </section>

      <section className="bg-[#e9efe4] px-5 py-12">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[["🌱", "Bahan alami", "Dipilih dengan teliti"], ["🤍", "Lembut untuk tubuh", "Nyaman dipakai rutin"], ["💬", "Konsultasi dulu", "Tanya via WhatsApp"]].map(([e, t, d]) => (
            <div key={t} className="flex items-center gap-4 rounded-3xl bg-white/70 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f4d9d6] text-xl">{e}</span>
              <div><div className="font-semibold">{t}</div><div className="text-sm text-[#5d7568]">{d}</div></div>
            </div>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section id="produk" className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-center font-serif text-4xl font-semibold">Perawatan pilihan</h2>
          <div className="mt-10 grid gap-4">
            {products.map((p, i) => (
              <article key={p.id ?? i} className="flex items-center gap-5 rounded-[2rem] bg-white p-3 pr-6 shadow-sm ring-1 ring-[#e3e8dc] transition hover:shadow-lg">
                <Pic src={p.image_url} emoji={emojis[i % emojis.length]} bg="bg-gradient-to-br from-[#e9efe4] to-[#f4d9d6]" className="h-24 w-24 flex-none rounded-[1.5rem] md:h-28 md:w-28" size="text-4xl" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-semibold leading-snug">{p.name}</h3>
                  {p.description && <p className="mt-0.5 line-clamp-2 text-sm text-[#5d7568]">{p.description}</p>}
                  <div className="mt-1 font-semibold text-[#a4605b]">{p.price}</div>
                </div>
                <a href={waHref(umkm, orderText(umkm, p.name))} target="_blank" rel="noopener noreferrer" className="hidden rounded-full bg-[#2f4a3f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#223a30] sm:block">Pesan</a>
              </article>
            ))}
          </div>
        </section>
      )}

      {umkm.about && (
        <section className="mx-auto max-w-3xl px-5 pb-16 text-center">
          <div className="text-3xl">🌸</div>
          <h2 className="mt-2 font-serif text-3xl font-semibold">Tentang kami</h2>
          <p className="mt-4 text-lg leading-relaxed text-[#4a6458]">{umkm.about}</p>
        </section>
      )}

      <footer className="bg-[#2f4a3f] px-5 py-10 text-center text-sm text-white/75">
        © {new Date().getFullYear()} {umkm.name}<br /><PoweredBy />
      </footer>
    </main>
  );
}
