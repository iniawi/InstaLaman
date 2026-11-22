import { Pic, PoweredBy, TplProps, WaButton, orderText, waHref, where } from "./shared";

// Template gratis: sederhana, rapi, satu kolom.
export default function Basic({ umkm, products }: TplProps) {
  const wa = waHref(umkm, orderText(umkm));
  return (
    <main className="min-h-screen bg-[#eef3f8] px-0 py-0 font-sans md:px-4 md:py-10">
      <div className="mx-auto max-w-3xl overflow-hidden bg-white text-[#12274a] shadow-[0_30px_80px_-40px_rgba(18,39,74,.5)] md:rounded-3xl">
        <section
          className="relative px-6 py-16 text-white md:px-10"
          style={
            umkm.cover_url
              ? { backgroundImage: `linear-gradient(180deg, rgba(18,39,74,.35), rgba(18,39,74,.85)), url(${umkm.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: "linear-gradient(135deg,#12274a,#3b8fd6)" }
          }
        >
          {where(umkm) && <div className="text-xs font-bold uppercase tracking-widest text-[#cfe8fa]">{where(umkm)}</div>}
          <h1 className="mt-2 max-w-md font-display text-4xl font-bold leading-tight md:text-5xl">{umkm.name}</h1>
          {umkm.tagline && <p className="mt-3 max-w-md text-white/90">{umkm.tagline}</p>}
          <WaButton href={wa} className="mt-6 rounded-full bg-[#f0813a] px-6 py-3 text-white hover:bg-[#e0722b]">Hubungi via WhatsApp</WaButton>
        </section>

        {umkm.about && (
          <section className="border-t border-[#dfe6ee] px-6 py-9 md:px-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#5b6b85]">Tentang kami</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-[#33415c]">{umkm.about}</p>
          </section>
        )}

        {products.length > 0 && (
          <section className="border-t border-[#dfe6ee] px-6 py-9 md:px-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#5b6b85]">Produk unggulan</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p, i) => (
                <article key={p.id ?? i} className="overflow-hidden rounded-2xl border border-[#dfe6ee] transition hover:shadow-lg">
                  <Pic src={p.image_url} emoji="🛍️" bg="bg-[#e6f3fc]" className="aspect-[4/3]" size="text-3xl" />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold">{p.name}</h3>
                    {p.description && <p className="mt-1 text-xs leading-snug text-[#5b6b85]">{p.description}</p>}
                    {p.price && <div className="mt-2 text-sm font-bold">{p.price}</div>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-[#dfe6ee] bg-[#f3f6fa] px-6 py-9 md:px-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#5b6b85]">Hubungi kami</h2>
          <WaButton href={wa} className="mt-3 rounded-full bg-[#12274a] px-5 py-2.5 text-sm text-white hover:bg-[#1f3d6b]">{umkm.contact}</WaButton>
        </section>

        <footer className="bg-[#12274a] px-6 py-5 text-center text-xs text-white/70">
          © {new Date().getFullYear()} {umkm.name} · <PoweredBy className="inline" />
        </footer>
      </div>
    </main>
  );
}
