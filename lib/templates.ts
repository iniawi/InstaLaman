// Daftar template landing page. Template selain "basic" hanya aktif untuk paket langganan.

export type TemplateKey =
  | "basic"
  | "kuliner"
  | "kue"
  | "organik"
  | "fashion"
  | "kriya"
  | "kecantikan"
  | "jasa";

export type TemplateMeta = {
  key: TemplateKey;
  name: string;
  category: string; // kategori UMKM
  desc: string;
  premium: boolean;
  emoji: string;
  /** warna untuk kartu pratinjau: [latar, aksen, teks] */
  swatch: [string, string, string];
};

export const TEMPLATES: TemplateMeta[] = [
  { key: "basic", name: "Dasar", category: "Semua usaha", desc: "Tampilan sederhana, otomatis untuk paket gratis.", premium: false, emoji: "🛍️", swatch: ["#e6f3fc", "#f0813a", "#12274a"] },
  { key: "kuliner", name: "Selera", category: "Kuliner & Olahan Pangan", desc: "Hangat dan menggugah selera. Cocok untuk warung, katering, dan kedai.", premium: true, emoji: "🍜", swatch: ["#fff4df", "#f08a24", "#1f5f3a"] },
  { key: "kue", name: "Manis", category: "Kue, Kering & Camilan", desc: "Lembut dan ceria. Cocok untuk toko kue, brownies, dan camilan.", premium: true, emoji: "🍪", swatch: ["#fdeeea", "#e8788a", "#5a2a35"] },
  { key: "organik", name: "Segar", category: "Pertanian & Agrobisnis", desc: "Bersih dan alami. Cocok untuk sayur, tanaman hias, dan produk herbal.", premium: true, emoji: "🥬", swatch: ["#e9f7ee", "#16a34a", "#14532d"] },
  { key: "fashion", name: "Butik", category: "Fashion & Aksesoris", desc: "Editorial dan elegan. Cocok untuk busana, batik, dan tas.", premium: true, emoji: "👗", swatch: ["#f4eee6", "#1c1917", "#1c1917"] },
  { key: "kriya", name: "Nusantara", category: "Kriya & Kerajinan", desc: "Berkarakter dan hangat. Cocok untuk kerajinan kayu, batik, dan dekorasi.", premium: true, emoji: "🪴", swatch: ["#f6ead5", "#b4492a", "#3b1f14"] },
  { key: "kecantikan", name: "Rawat", category: "Kecantikan & Kesehatan", desc: "Tenang dan bersih. Cocok untuk skincare, jamu, dan produk herbal.", premium: true, emoji: "🌿", swatch: ["#eaf0e6", "#d98b86", "#2f4a3f"] },
  { key: "jasa", name: "Digital", category: "Jasa & Produk Digital", desc: "Modern dan tegas. Cocok untuk desain, website, dan kelas privat.", premium: true, emoji: "💼", swatch: ["#0b1020", "#7c5cff", "#e8ecff"] },
];

export const TEMPLATE_MAP = Object.fromEntries(TEMPLATES.map((t) => [t.key, t])) as Record<TemplateKey, TemplateMeta>;

export function isTemplateKey(k: unknown): k is TemplateKey {
  return typeof k === "string" && k in TEMPLATE_MAP;
}

/** Template yang dipakai halaman: premium hanya kalau paket aktif, selain itu selalu "basic". */
export function effectiveTemplate(chosen: string | null | undefined, planActive: boolean): TemplateKey {
  if (!planActive) return "basic";
  return isTemplateKey(chosen) ? chosen : "basic";
}

/* ---------- Data contoh untuk galeri / pratinjau ---------- */

export type DemoData = {
  umkm: { name: string; slug: string; biz_type: string; city: string; tagline: string; about: string; cover_url: null; contact: string };
  products: { id: string; name: string; price: string; description: string; image_url: null }[];
};

const mk = (
  name: string, biz_type: string, city: string, tagline: string, about: string,
  products: [string, string, string][]
): DemoData => ({
  umkm: { name, slug: "contoh", biz_type, city, tagline, about, cover_url: null, contact: "6281234567890" },
  products: products.map(([n, p, d], i) => ({ id: String(i), name: n, price: p, description: d, image_url: null })),
});

export const DEMO: Record<TemplateKey, DemoData> = {
  basic: mk("Kopi Kulo", "Kedai kopi", "Yogyakarta", "Kopi susu enak, harga mahasiswa.", "Berawal dari warung kecil dekat kampus, Kopi Kulo kini punya dua cabang. Kami meracik kopi susu literan dan camilan hangat untuk teman begadang dan ngobrol.", [
    ["Kopi Susu Literan", "Rp65.000", "Cukup untuk berbagi di kantor."], ["Pisang Nugget", "Rp18.000", "Renyah di luar, lembut di dalam."], ["Es Kopi Gula Aren", "Rp20.000", "Manis legit, segar."],
  ]),
  kuliner: mk("Warung Nusantara", "Masakan rumahan", "Bandung", "Cita rasa rumahan yang bikin kangen pulang.", "Kami memasak dengan bumbu segar yang diulek setiap pagi. Pesan untuk makan siang kantor, arisan, atau acara keluarga, diantar hangat sampai tujuan.", [
    ["Nasi Liwet Komplit", "Rp35.000", "Ayam goreng, tahu tempe, lalapan, sambal."], ["Soto Ayam Kampung", "Rp28.000", "Kuah bening gurih, koya renyah."], ["Gurame Bakar", "Rp75.000", "Bumbu kecap pedas manis."], ["Es Cendol Durian", "Rp22.000", "Santan kental, gula merah asli."],
  ]),
  kue: mk("Dapur Manis Bunda", "Kue kering & brownies", "Surabaya", "Manisnya pas, renyahnya bikin nambah.", "Resep keluarga yang dipanggang dalam batch kecil supaya selalu segar. Cocok untuk hampers, hadiah, dan teman ngeteh sore hari.", [
    ["Nastar Keju", "Rp85.000", "Selai nanas homemade, toples 500 ml."], ["Brownies Panggang", "Rp55.000", "Cokelat pekat, tekstur fudgy."], ["Kastengel", "Rp90.000", "Keju edam melimpah."], ["Hampers Mini", "Rp150.000", "Isi 3 toples, kemasan cantik."],
  ]),
  organik: mk("Kebun Segar Lembang", "Sayur & buah organik", "Lembang", "Dari kebun kami, langsung ke dapurmu.", "Dipanen pagi hari tanpa pestisida kimia dan dikirim di hari yang sama. Langganan paket mingguan juga tersedia.", [
    ["Paket Sayur Mingguan", "Rp85.000", "8 jenis sayur pilihan musim ini."], ["Selada Hidroponik", "Rp18.000", "Renyah, bersih, siap santap."], ["Tomat Cherry", "Rp25.000", "Manis, 250 gram."], ["Madu Hutan", "Rp95.000", "Murni, botol 250 ml."],
  ]),
  fashion: mk("Sekar Atelier", "Busana muslim & batik", "Solo", "Batik yang dijahit untuk hari-harimu.", "Kami menjahit batik tulis dan cap dalam potongan modern yang nyaman dipakai seharian. Tersedia custom ukuran dan pre-order.", [
    ["Tunik Batik Parang", "Rp285.000", "Katun primisima, adem."], ["Gamis Linen Sage", "Rp349.000", "Jatuh dan ringan."], ["Kemeja Batik Slim", "Rp265.000", "Potongan modern."], ["Tote Bag Tenun", "Rp145.000", "Tenun asli, lapis dalam."],
  ]),
  kriya: mk("Rumah Anyam Jati", "Kerajinan kayu & anyaman", "Jepara", "Dibuat tangan, dirawat dengan cerita.", "Para perajin kami di Jepara mengolah kayu jati, bambu, dan pandan menjadi perabot dan dekorasi yang awet. Setiap potong punya karakter sendiri.", [
    ["Nampan Kayu Jati", "Rp120.000", "Finishing natural."], ["Keranjang Pandan", "Rp95.000", "Anyaman rapat dan kuat."], ["Lilin Aromaterapi", "Rp65.000", "Tuang tangan, wangi lembut."], ["Hiasan Dinding Rotan", "Rp180.000", "Diameter 40 cm."],
  ]),
  kecantikan: mk("Jamu Ayu Larasati", "Jamu & perawatan herbal", "Yogyakarta", "Rawat dari dalam, cantik dari alam.", "Jamu dan perawatan tubuh dari rempah pilihan, diracik tanpa pewarna buatan. Konsultasi gratis lewat WhatsApp sebelum memesan.", [
    ["Jamu Kunyit Asam", "Rp15.000", "Botol 250 ml, segar."], ["Lulur Rempah", "Rp55.000", "Lembutkan kulit."], ["Serum Minyak Kelapa", "Rp78.000", "Ringan, cepat meresap."], ["Paket Ibu Baru", "Rp160.000", "Jamu, lulur, dan pilis."],
  ]),
  jasa: mk("Pixel Warung", "Desain & website UMKM", "Jakarta", "Desain dan website yang bikin usahamu dipercaya.", "Studio kecil untuk UMKM yang ingin tampil profesional: logo, kemasan, konten media sosial, sampai website. Pengerjaan cepat, revisi jelas.", [
    ["Paket Logo & Brand", "Rp750.000", "3 konsep, 2x revisi."], ["Website 1 Halaman", "Rp1.500.000", "Responsif dan cepat."], ["Kelola Medsos", "Rp1.200.000", "12 konten per bulan."], ["Kelas Privat Canva", "Rp250.000", "2 jam, online."],
  ]),
};
