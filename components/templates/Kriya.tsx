import { Pic, PoweredBy, TplProps, WaButton, orderText, waHref, where } from "./shared";

// Kriya: terakota + krem, motif geometris ala batik/tenun dari CSS gradient.
const motif = {
  backgroundImage:
    "linear-gradient(45deg,#00000014 25%,transparent 25%),linear-gradient(-45deg,#00000014 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#00000014 75%),linear-gradient(-45deg,transparent 75%,#00000014 75%)",
  backgroundSize: "28px 28px",
  backgroundPosition: "0 0,0 14px,14px -14px,-14px 0",
} as const;

export default function Kriya({ umkm, products }: TplProps) {
  const wa = waHref(umkm, orderText(umkm));
  const emojis = ["🪵", "🧺", "🕯️", "🪴", "🏺", "🪡"];
  return (
    <main className="min-h-screen bg-[#f7ecd8] font-sans text-[#3b1f14]">
      <div className="h-3 bg-[#b4492a]" style={motif} />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-serif text-xl font-bold text-[#b4492a]">{umkm.name}</span>
        <WaButton href={wa} className="rounded-md bg-[#b4492a] px-5 py-2 text-sm text-[#fdf3e1] hover:bg-[#963a20]">Pesan</WaButton>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-14 pt-6">
        <div className="grid items-center gap-10 rounded-[2rem] border-2 border-[#3b1f14] bg-[#fdf3e1] p-6 shadow-[8px_8px_0_#3b1f14] md:grid-cols-2 md:p-10">
          <div>
            {where(umkm) && <span className="text-xs font-bold uppercase tracking-[.25em] text-[#b4492a]">{where(umkm)}</span>}
            <h1 className="mt-3 font-serif text-5xl font-bold leading-[1.02] md:text-6xl">{umkm.name}</h1>
            {umkm.tagline && <p className="mt-4 max-w-md text-lg text-[#6b4a3a]">{umkm.tagline}</p>}
            <div className="mt-7 flex flex-wrap gap-3">
              <WaButton href={wa} className="rounded-md border-2 border-[#3b1f14] bg-[#e8a33d] px-6 py-3 text-[#3b1f14] shadow-[3px_3px_0_#3b1f14] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">Pesan lewat WhatsApp</WaButton>
              <a href="#karya" className="rounded-md border-2 border-[#3b1f14] px-6 py-3 font-semibold hover:bg-[#3b1f14] hover:text-[#fdf3e1]">Lihat karya</a>
            </div>
          </div>
          <Pic src={umkm.cover_url} emoji="🪴" size="text-[7rem]" bg="bg-gradient-to-br from-[#e8a33d] to-[#b4492a]"
            className="aspect-[4/3] rounded-2xl border-2 border-[#3b1f14]" />
        </div>
      </section>

      {products.length > 0 && (
        <section id="karya" className="mx-auto max-w-6xl px-5 py-12">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[.3em] text-[#b4492a]">✦ Karya pilihan ✦</div>
            <h2 className="mt-2 font-serif text-4xl font-bold">Dibuat dengan tangan</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((p, i) => (
              <article key={p.id ?? i} className="rounded-2xl border-2 border-[#3b1f14] bg-[#fdf3e1] p-2.5 transition hover:-translate-y-1 hover:shadow-[5px_5px_0_#3b1f14]">
                <Pic src={p.image_url} emoji={emojis[i % emojis.length]} bg="bg-gradient-to-br from-[#f1d6a4] to-[#e0a96a]" className="aspect-square rounded-xl" />
                <div className="px-1.5 pb-1.5 pt-3">
                  <h3 className="font-serif text-base font-bold leading-snug">{p.name}</h3>
                  {p.description && <p className="mt-1 line-clamp-2 text-xs text-[#6b4a3a]">{p.description}</p>}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-[#b4492a]">{p.price}</span>
                    <a href={waHref(umkm, orderText(umkm, p.name))} target="_blank" rel="noopener noreferrer" className="text-xs font-bold underline underline-offset-4">Pesan</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {umkm.about && (
        <section className="mt-10 bg-[#3b1f14] px-5 py-16 text-[#fdf3e1]" style={motif}>
          <div className="mx-auto max-w-3xl rounded-3xl bg-[#3b1f14] p-8 text-center ring-1 ring-[#e8a33d]/50">
            <div className="text-xs font-bold uppercase tracking-[.3em] text-[#e8a33d]">Cerita kami</div>
            <p className="mt-4 font-serif text-xl leading-relaxed">{umkm.about}</p>
            <WaButton href={wa} className="mt-6 rounded-md bg-[#e8a33d] px-6 py-3 text-[#3b1f14] hover:bg-[#f0b45a]">Pesan custom</WaButton>
          </div>
        </section>
      )}

      <footer className="bg-[#3b1f14] px-5 pb-10 text-center text-sm text-[#fdf3e1]/70">
        © {new Date().getFullYear()} {umkm.name}<br /><PoweredBy />
      </footer>
    </main>
  );
}
