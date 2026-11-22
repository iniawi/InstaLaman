import Link from "next/link";
import { TEMPLATE_MAP, type TemplateKey } from "@/lib/templates";

type Props =
  | { mode: "demo"; tpl: TemplateKey; closeHref: string }
  | { mode: "template"; tpl: TemplateKey; closeHref: string }
  | { mode: "draft"; publishHref: string };

// Bar kecil di bawah layar:
//  - demo     : galeri contoh template
//  - template : mencoba template lain di halaman yang sudah terbit
//  - draft    : halaman belum terbit, hanya pratinjau
export default function PreviewBar(p: Props) {
  const box = "fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-[#12274a]/95 p-3 pl-4 text-white shadow-2xl ring-1 ring-white/15 backdrop-blur";
  const cta = "flex-none rounded-full bg-[#f0813a] px-4 py-2 text-sm font-semibold hover:bg-[#e0722b]";
  const ghost = "flex-none rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20";

  if (p.mode === "draft") {
    return (
      <div className={box}>
        <div className="min-w-0 flex-1 text-sm leading-tight">
          <div className="truncate font-semibold">Pratinjau · belum diterbitkan</div>
          <div className="truncate text-xs text-white/70">Halaman ini hanya bisa dilihat lewat link pratinjau.</div>
        </div>
        <Link href={p.publishHref} className={cta}>Terbitkan</Link>
      </div>
    );
  }

  const t = TEMPLATE_MAP[p.tpl];
  return (
    <div className={box}>
      <div className="min-w-0 flex-1 text-sm leading-tight">
        <div className="truncate font-semibold">{p.mode === "demo" ? "Contoh tampilan" : "Pratinjau"} · Template {t.name}</div>
        <div className="truncate text-xs text-white/70">{t.premium ? "Template ini terbuka untuk halaman yang diterbitkan." : "Template gratis."}</div>
      </div>
      {t.premium && <Link href="/langganan?paket=monthly" className={cta}>Terbitkan</Link>}
      <Link href={p.closeHref} className={ghost}>{p.mode === "demo" ? "Semua template" : "Tutup"}</Link>
    </div>
  );
}
