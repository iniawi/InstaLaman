import { Pic, PoweredBy, TplProps, WaButton, orderText, waHref, where } from "./shared";

// Editorial: krem hangat, hitam tegas, huruf serif besar.
export default function Fashion({ umkm, products }: TplProps) {
  const wa = waHref(umkm, orderText(umkm));
  const emojis = ["👗", "🧕", "👔", "👜", "👠", "🧣"];
  return (
    <main className="min-h-screen bg-[#f5efe6] font-sans text-[#1c1917]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <span className="font-serif text-xl font-bold tracking-wide">{umkm.name.toUpperCase()}</span>
        <WaButton href={wa} className="border border-[#1c1917] px-5 py-2 text-xs uppercase tracking-[.2em] hover:bg-[#1c1917] hover:text-[#f5efe6]">Pesan</WaButton>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          {where(umkm) && <div className="text-xs uppercase tracking-[.3em] text-[#78716c]">{where(umkm)}</div>}
          <h1 className="mt-4 font-serif text-6xl font-semibold leading-[.95] tracking-tight md:text-8xl">{umkm.name}</h1>
          {umkm.tagline && <p className="mt-6 max-w-md font-serif text-xl italic text-[#57534e]">{umkm.tagline}</p>}
          <WaButton href={wa} className="mt-8 bg-[#1c1917] px-8 py-4 text-xs uppercase tracking-[.2em] text-[#f5efe6] hover:bg-[#44403c]">Konsultasi & pesan</WaButton>
        </div>
        <Pic src={umkm.cover_url} emoji="👗" size="text-[8rem]" bg="bg-gradient-to-b from-[#e7d9c6] to-[#c9b399]"
          className="aspect-[3/4] md:col-span-5" />
      </section>

      <div className="overflow-hidden border-y border-[#1c1917] py-3 text-xs uppercase tracking-[.4em]">
        <div className="mx-auto flex max-w-6xl justify-between gap-6 whitespace-nowrap px-5">
          {["Dijahit dengan teliti", "Bahan pilihan", "Custom ukuran", "Pre-order terbuka"].map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>

      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-4xl font-semibold">Koleksi</h2>
            <span className="text-xs uppercase tracking-[.3em] text-[#78716c]">{products.length} item</span>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
            {products.map((p, i) => (
              <a key={p.id ?? i} href={waHref(umkm, orderText(umkm, p.name))} target="_blank" rel="noopener noreferrer" className="group">
                <Pic src={p.image_url} emoji={emojis[i % emojis.length]} bg="bg-gradient-to-b from-[#ebdfce] to-[#d4c1a8]" className="aspect-[3/4] transition duration-500 group-hover:opacity-90" />
                <h3 className="mt-4 font-serif text-lg leading-snug">{p.name}</h3>
                {p.description && <p className="mt-0.5 line-clamp-1 text-xs text-[#78716c]">{p.description}</p>}
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-semibold">{p.price}</span>
                  <span className="text-xs uppercase tracking-widest opacity-0 transition group-hover:opacity-100">Pesan →</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {umkm.about && (
        <section className="bg-[#1c1917] px-5 py-20 text-[#f5efe6]">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-12">
            <h2 className="font-serif text-4xl font-semibold md:col-span-5">Tentang<br />{umkm.name}</h2>
            <p className="font-serif text-xl leading-relaxed text-[#d6cfc4] md:col-span-7">{umkm.about}</p>
          </div>
        </section>
      )}

      <footer className="px-5 py-10 text-center text-xs uppercase tracking-[.3em] text-[#78716c]">
        © {new Date().getFullYear()} {umkm.name}<br /><PoweredBy className="mt-2 inline-block normal-case tracking-normal" />
      </footer>
    </main>
  );
}
