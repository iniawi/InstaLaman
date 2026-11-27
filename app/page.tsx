import Link from "next/link";
import Navbar from "@/components/Navbar";
import VisitStats from "@/components/VisitStats";
import { TEMPLATES } from "@/lib/templates";

// Ganti data kontak di bawah ini dengan data asli kamu.
const WA_NUMBER = "6281234567890";
const WA_LABEL = "+62 812-3456-7890";
const EMAIL = "halo@instalaman.id";
const ADDRESS = "Jl. Contoh No. 1, Yogyakarta";

const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

const steps = [
  {
    title: "Isi info usaha",
    desc: "Nama, jenis usaha, kota, dan cerita singkat dengan bahasamu sendiri.",
    icon: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M9 12h6M9 16h6" />
      </>
    ),
  },
  {
    title: "Tambah produk",
    desc: "Masukkan nama, harga, dan foto produk andalan. Bisa lebih dari satu.",
    icon: (
      <>
        <path d="M4 8l8-4 8 4v8l-8 4-8-4z" />
        <path d="M4 8l8 4 8-4M12 12v8" />
      </>
    ),
  },
  {
    title: "Halaman langsung online",
    desc: "AI menulis teksnya, pelanggan bisa langsung chat lewat WhatsApp.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c3.5 3.5 3.5 13.5 0 17M12 3.5c-3.5 3.5-3.5 13.5 0 17" />
      </>
    ),
  },
];

const features = [
  [
    "Teks ditulis otomatis",
    "Cerita usahamu dirapikan jadi kalimat yang enak dibaca dan menjual.",
  ],
  ["Tombol WhatsApp", "Pelanggan tinggal klik untuk memesan atau bertanya."],
  ["Daftar produk dan harga", "Lengkap dengan foto, rapi di HP maupun laptop."],
  [
    "Link sendiri",
    "Tempel di bio Instagram, status WhatsApp, atau Google Maps.",
  ],
];

const businesses = [
  "Kedai kopi",
  "Katering",
  "Toko kue",
  "Laundry",
  "Barbershop",
  "Thrift shop",
  "Jasa fotografi",
  "Kerajinan tangan",
];

// Urutan tampil: yang disorot (tengah) = Tahunan.
// Model: gratis = coba & pratinjau (tidak tayang online). Langganan = halaman diterbitkan.
const plans = [
  {
    label: "Gratis",
    title: "Coba & pratinjau",
    desc: "Bikin halaman dan lihat hasilnya dulu, tanpa bayar.",
    price: "Rp0",
    per: "",
    note: "Tanpa kartu, tanpa daftar akun",
    items: [
      "Buat halaman usaha",
      "Teks ditulis otomatis (AI)",
      "Pratinjau dengan template Dasar",
      "Coba tampilan semua template",
      "Link pratinjau bisa dibagikan",
      "Belum tayang untuk umum",
    ],
    cta: "Coba gratis",
    href: "/buat",
    hot: false,
    badge: "",
  },
  {
    label: "Tahunan",
    title: "Terbit setahun, paling hemat",
    desc: "Bayar sekali, tayang 12 bulan. Hemat Rp50.000 dibanding bulanan.",
    price: "Rp550.000",
    per: "per tahun",
    note: "Setara bayar 11 bulan, pakai 12 bulan",
    items: [
      "Halaman tayang online untuk umum",
      "Bisa ditemukan di Google",
      "Semua 7 template premium",
      "Ganti template kapan saja",
      "Tombol WhatsApp di tiap produk",
      "Bayar praktis lewat QRIS",
    ],
    cta: "Terbitkan setahun",
    href: "/langganan?paket=yearly",
    hot: true,
    badge: "Paling hemat",
  },
  {
    label: "Bulanan",
    title: "Terbit per bulan",
    desc: "Tayang sebulan penuh, perpanjang kalau masih perlu.",
    price: "Rp50.000",
    per: "per bulan",
    note: "Sekitar Rp1.650 per hari",
    items: [
      "Halaman tayang online untuk umum",
      "Bisa ditemukan di Google",
      "Semua 7 template premium",
      "Ganti template kapan saja",
      "Tombol WhatsApp di tiap produk",
      "Bayar praktis lewat QRIS",
    ],
    cta: "Terbitkan sebulan",
    href: "/langganan?paket=monthly",
    hot: false,
    badge: "",
  },
];

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div id="top">
      <Navbar />
      <div className="hero2">
        <div className="wrap">
          <div className="hg">
            <div className="ht">
              <h1>
                Bikin <em>halaman usahamu sendiri</em> jadi dalam hitungan menit
              </h1>
              <p>
                Isi nama usaha, ceritamu, dan produk. InstaLaman menuliskan
                teksnya dan memasang halaman dengan link sendiri, tanpa belajar
                desain atau coding.
              </p>
              <div className="row">
                <Link className="btn" href="/buat">
                  Bikin landing page
                </Link>
                <a className="btn g" href="#cara">
                  Lihat caranya
                </a>
              </div>
              <div className="proof">
                Dibuat untuk warung, kedai, toko online, dan jasa kecil di
                seluruh Indonesia.
              </div>
            </div>
            <div className="hv">
              <i className="dot d1" />
              <i className="dot d2" />
              <div className="pic">
                <img
                  src="/logo.jpg"
                  alt="Logo InstaLaman: Landing page UMKM, jadi dalam hitungan menit"
                />
              </div>
              <span className="chip c1">Tanpa coding</span>
              <span className="chip c2">Link sendiri</span>
            </div>
          </div>
        </div>
      </div>

      <section id="cara" className="sec">
        <div className="wrap">
          {/* <span className="eb">Cara kerja</span> */}
          <h2 className="st">Tiga langkah, selesai dalam hitungan menit</h2>
          <div className="cards3">
            {steps.map((s, i) => (
              <div className="c3" key={s.title}>
                <span className="no">0{i + 1}</span>
                <span className="ico">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fitur" className="sec alt">
        <div className="wrap feat2">
          <div>
            {/* <span className="eb l">Fitur</span> */}
            <h2 className="st l">
              Semua yang dibutuhkan pelanggan, di satu halaman
            </h2>
            <ul className="list2">
              {features.map(([t, d]) => (
                <li key={t}>
                  <i>
                    <Check />
                  </i>
                  <div>
                    <b>{t}</b>
                    <span>{d}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="pan">
            <i className="dot d3" />
            <i className="dot d4" />
            <h3>Cocok untuk usaha seperti</h3>
            <div className="chips">
              {businesses.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="template" className="sec">
        <div className="wrap feat2 rev">
          <div>
            {/* <span className="eb l">Template</span> */}
            <h2 className="st l">Tampilan khusus untuk jenis usahamu</h2>
            <p className="tdesc">
              Pilih susunan halaman yang pas dengan apa yang kamu jual: kuliner,
              fashion, kriya, kecantikan, pertanian, sampai jasa digital. Paket
              gratis memakai tampilan Dasar, langganan membuka semua template.
            </p>
            <div className="row">
              <Link className="btn" href="/template">
                Lihat semua template
              </Link>
              <Link className="btn g" href="/buat">
                Coba gratis dulu
              </Link>
            </div>
          </div>
          <div className="pan">
            <i className="dot d3" />
            <i className="dot d4" />
            <h3>Template per jenis usaha</h3>
            <span className="bd">Untuk paket langganan</span>
            <div className="tpls">
              {TEMPLATES.filter((t) => t.premium).map((t) => (
                <Link className="tp" key={t.key} href={`/template/${t.key}`}>
                  <span className="tpi" aria-hidden>
                    {t.emoji}
                  </span>
                  <div>
                    <b>{t.name}</b>
                    <small>{t.category}</small>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="harga" className="sec alt">
        <div className="wrap">
          {/* <span className="eb">Harga</span> */}
          <h2 className="st">Coba gratis, terbitkan kalau sudah siap</h2>
          <p className="sub2">
            Gratis untuk membuat dan melihat pratinjau. Langganan untuk
            menayangkan halamanmu online dan membuka semua template.
          </p>
          <div className="price">
            {plans.map((p) => (
              <div className={`pc2${p.hot ? " hot" : ""}`} key={p.label}>
                {p.badge && <span className="pc2-badge">{p.badge}</span>}
                <span className="pc2-label">{p.label}</span>
                <h3 className="pc2-title">{p.title}</h3>
                <p className="pc2-desc">{p.desc}</p>
                <div className="pc2-price">
                  {p.price}
                  {p.per && <small>{p.per}</small>}
                  <span className="pc2-note">{p.note}</span>
                </div>
                <ul className="pc2-list">
                  {p.items.map((i) => (
                    <li key={i}>
                      <Check />
                      {i}
                    </li>
                  ))}
                </ul>
                <Link className="pc2-btn" href={p.href}>
                  {p.cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VisitStats />

      <div id="kontak" className="kon">
        <div className="kon-m">
          <div className="wrap">
            <div className="cta2">
              <h2 className="st">Mulai dari satu form</h2>
              <p>Gratis dicoba. Tidak perlu daftar akun.</p>
              <Link className="btn" href="/buat">
                Bikin landing page sekarang
              </Link>
            </div>
          </div>
        </div>

        <footer className="ft2">
          <Link className="brand" href="/">
            Insta<b>Laman</b>
          </Link>
          <div className="kgrid">
            <a
              className="k"
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>WhatsApp</small>
              <b>{WA_LABEL}</b>
            </a>
            <a className="k" href={`mailto:${EMAIL}`}>
              <small>Email</small>
              <b>{EMAIL}</b>
            </a>
            <div className="k">
              <small>Alamat</small>
              <b>{ADDRESS}</b>
            </div>
          </div>
          <div>
            © {new Date().getFullYear()} InstaLaman · Landing page UMKM, jadi
            dalam hitungan menit
          </div>
        </footer>
      </div>
    </div>
  );
}
