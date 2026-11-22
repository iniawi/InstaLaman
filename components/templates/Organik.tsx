import { Pic, PoweredBy, TplProps, WaButton, orderText, waHref, where } from "./shared";

// Referensi: toko grocery/organik: putih bersih, hijau, banner gradien, kartu produk bergaris.
const perks = [
  ["💬", "Pesan mudah", "Langsung lewat WhatsApp"],
  ["🌱", "Pilihan segar", "Dipilih satu per satu"],
  ["🚚", "Antar ke rumah", "Area sekitar kami"],
  ["🤝", "Respon cepat", "Tanya apa saja"],
];

export default function Organik({ umkm, products }: TplProps) {
  const wa = waHref(umkm, orderText(umkm));
  const emojis = ["🥬", "🥕", "🍅", "🍯", "🥭", "🌿"];
  return (
    <main className="min-h-screen bg-white font-sans text-[#14321f]">
      <header className="sticky top-0 z-30 border-b border-[#e3efe6] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <span className="flex items-center gap-2 font-display text-lg font-bold text-[#15803d]"><span className="text-2xl">🌿</span>{umkm.name}</span>
          <WaButton href={wa} className="rounded-lg bg-[#16a34a] px-5 py-2 text-sm text-white hover:bg-[#15803d]">Hubungi kami</WaButton>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#14532d] via-[#15803d] to-[#4ade80] px-8 py-12 text-white md:px-14 md:py-16">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-32 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_.8fr]">
            <div>
              {where(umkm) && <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">{where(umkm)}</span>}
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-5xl">{umkm.tagline || umkm.name}</h1>
              <p className="mt-4 max-w-md text-white/90">{umkm.name}: produk pilihan yang bisa langsung kamu pesan.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <WaButton href={wa} className="rounded-lg bg-white px-7 py-3.5 text-[#15803d] hover:bg-[#e9f7ee]">Pesan sekarang</WaButton>
                <a href="#produk" className="rounded-lg border-2 border-white/70 px-7 py-3 font-semibold hover:bg-white/10">Lihat produk</a>
              </div>
            </div>
            <Pic src={umkm.cover_url} emoji="🥬" size="text-[6rem]" bg="bg-white/15 backdrop-blur"
              className="mx-auto aspect-square w-full max-w-xs rounded-[2rem] border-4 border-white/60 shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-10 md:grid-cols-4">
        {perks.map(([e, t, d]) => (
          <div key={t} className="flex items-center gap-3 rounded-2xl bg-[#f1faf4] p-4">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-white text-xl shadow-sm">{e}</span>
            <div><div className="text-sm font-bold">{t}</div><div className="text-xs text-[#4d6b58]">{d}</div></div>
          </div>
        ))}
      </section>

      {products.length > 0 && (
        <section id="produk" className="mx-auto max-w-6xl px-5 pb-14">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Produk terbaik kami</h2>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="hidden text-sm font-semibold text-[#15803d] hover:underline md:block">Tanya stok →</a>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((p, i) => (
              <article key={p.id ?? i} className="group flex flex-col rounded-2xl border border-[#e3efe6] bg-white p-3 transition hover:border-[#16a34a] hover:shadow-lg">
                <Pic src={p.image_url} emoji={emojis[i % emojis.length]} bg="bg-gradient-to-br from-[#e9f7ee] to-[#c9efd6]" className="aspect-square rounded-xl transition group-hover:scale-[1.02]" />
                <h3 className="mt-3 text-sm font-bold leading-snug">{p.name}</h3>
                {p.description && <p className="mt-1 line-clamp-2 text-xs text-[#5b7566]">{p.description}</p>}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="font-bold text-[#15803d]">{p.price}</span>
                  <a href={waHref(umkm, orderText(umkm, p.name))} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#16a34a] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#15803d]">+ Pesan</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid items-center gap-8 rounded-[2rem] bg-[#f1faf4] p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-[#16a34a]">Tentang kami</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold">Naturally good for you</h2>
            {umkm.about && <p className="mt-4 leading-relaxed text-[#3d5a48]">{umkm.about}</p>}
          </div>
          <div className="rounded-3xl bg-[#14532d] p-8 text-white">
            <div className="text-lg font-bold">Mau pesan atau tanya stok?</div>
            <p className="mt-2 text-sm text-white/80">Kirim pesan, kami balas secepatnya.</p>
            <WaButton href={wa} className="mt-5 rounded-lg bg-[#4ade80] px-6 py-3 text-[#14532d] hover:bg-[#86efac]">Chat WhatsApp</WaButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e3efe6] px-5 py-8 text-center text-sm text-[#5b7566]">
        © {new Date().getFullYear()} {umkm.name}<br /><PoweredBy />
      </footer>
    </main>
  );
}
