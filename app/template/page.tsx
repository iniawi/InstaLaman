import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Template · InstaLaman",
  description: "Pilih tampilan landing page sesuai jenis usahamu. Template aktif untuk paket langganan.",
};

function Lock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export default function TemplateGallery() {
  return (
    <div>
      <div className="wrap">
        <nav>
          <Link className="brand" href="/">Insta<b>Laman</b></Link>
          <Link className="btn s" href="/buat">Mulai gratis</Link>
        </nav>
      </div>

      <section className="tg-head">
        <div className="wrap">
          <span className="eb">Template</span>
          <h1 className="st">Tampilan yang pas untuk jenis usahamu</h1>
          <p className="sub2">
            Paket gratis memakai template Dasar. Langganan membuka semua template di bawah. Klik kartu untuk melihat contoh tampilannya.
          </p>
        </div>
      </section>

      <section className="wrap tg-grid">
        {TEMPLATES.map((t) => (
          <Link key={t.key} href={`/template/${t.key}`} className="tg-card" style={{ ["--a" as string]: t.swatch[1] }}>
            <div className="tg-shot" style={{ background: t.swatch[0] }}>
              <iframe
                src={`/template/${t.key}?bar=0`}
                title={`Contoh template ${t.name}`}
                loading="lazy"
                tabIndex={-1}
                aria-hidden
              />
              <span className={`tg-tag${t.premium ? " p" : ""}`}>
                {t.premium && <Lock />} {t.premium ? "Langganan" : "Gratis"}
              </span>
            </div>
            <div className="tg-body">
              <div className="tg-cat">{t.category}</div>
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
              <span className="tg-go">Lihat contoh →</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
