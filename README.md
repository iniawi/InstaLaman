# Landing Page UMKM AI

Aplikasi Next.js untuk membuat landing page UMKM otomatis: isi form → AI menulis teksnya →
halaman langsung online dengan link sendiri (`namaproyek.vercel.app/toko/nama-usaha`).

Stack: **Next.js 14** (App Router) + **Supabase** (database + storage foto) + **Gemini API** (generate teks, ada free tier)
+ **Vercel** (hosting).

---

## 0. Yang perlu disiapkan dulu

- Akun [GitHub](https://github.com) (gratis)
- Akun [Supabase](https://supabase.com) (gratis, bisa daftar pakai akun GitHub)
- Akun [Vercel](https://vercel.com) (gratis, bisa daftar pakai akun GitHub)
- API key Gemini dari [aistudio.google.com](https://aistudio.google.com) → **Get API key** → Create API key (gratis, pakai akun Google)
- Node.js versi 18 ke atas — cek dengan `node -v`

---

## 1. Setup Supabase (database + storage foto)

1. Buka [supabase.com](https://supabase.com) → **New Project**. Kasih nama bebas, simpan password database-nya.
2. Buka menu **Storage** → **New bucket**. Nama persis `umkm-images`, centang **Public bucket**, klik **Create bucket**.
3. Buka menu **SQL Editor** → **New query**, copy-paste seluruh isi `supabase/schema.sql` → **Run**.
   File ini membuat tabel `umkm` dan `products`, sekaligus policy agar form bisa upload foto ke bucket tadi.
   (Bucket harus dibuat dulu di langkah 2 sebelum SQL ini dijalankan.)
4. Buka **Project Settings** (ikon gear) → **API**. Catat 3 nilai:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (klik "Reveal") → `SUPABASE_SERVICE_ROLE_KEY` — **jangan disebar / di-commit ke GitHub**

---

## 2. Jalankan di komputer sendiri

```bash
cd umkm-landing
npm install
cp .env.example .env.local     # di Windows CMD: copy .env.example .env.local
```

Isi `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
```

Lalu:
```bash
npm run dev
```

Buka `http://localhost:3000`, isi form, klik tombol. Kalau berhasil kamu diarahkan ke `/toko/nama-usaha`.

---

## 3. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit: Landing Page UMKM AI"
```

Buat repo baru (kosong) di GitHub, lalu:
```bash
git remote add origin https://github.com/USERNAME-KAMU/NAMA-REPO.git
git branch -M main
git push -u origin main
```

`.env.local` tidak ikut ter-push karena ada di `.gitignore`. Itu benar dan aman.

---

## 4. Deploy ke Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import repo GitHub tadi.
2. Di **Environment Variables**, isi 4 variabel yang sama seperti `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
3. Klik **Deploy**, tunggu 1-2 menit.
4. Selesai. Link publik: `nama-proyek.vercel.app`. Tiap UMKM yang isi form dapat halaman di `nama-proyek.vercel.app/toko/nama-usaha`.

Setiap `git push` berikutnya otomatis ter-deploy ulang.

---

## Kalau ada error

| Error | Penyebab & solusi |
|---|---|
| `npm is not recognized` | Node.js belum terinstall, atau terminal perlu dibuka ulang |
| `GEMINI_API_KEY belum diset` | `.env.local` salah nama/lokasi, atau server belum di-restart (Ctrl+C lalu `npm run dev` lagi) |
| `Gagal memanggil Gemini` (404 / model not found) | Nama model usang. Tambahkan `GEMINI_MODEL=` di env dengan model yang tersedia di aistudio.google.com |
| `Gagal memanggil Gemini` (429) | Kena batas free tier, tunggu sebentar lalu coba lagi |
| Upload foto gagal | Bucket `umkm-images` belum dibuat / belum public, atau SQL policy belum dijalankan |
| Halaman `/toko/...` 404 | Schema SQL belum dijalankan |

## Struktur project

```
umkm-landing/
├── app/
│   ├── page.tsx                 → beranda InstaLaman (hero, cara kerja, fitur, harga langganan, kontak)
│   ├── buat/page.tsx            → form pembuatan landing page + pratinjau langsung
│   ├── layout.tsx, globals.css  → desain InstaLaman (CSS biasa, font Poppins)
│   ├── toko/[slug]/page.tsx     → halaman publik per UMKM (warna ikut palet InstaLaman)
│   └── api/
│       ├── generate/route.ts    → panggil Gemini, hasilkan tagline/about/deskripsi produk
│       └── create/route.ts      → simpan ke Supabase (service role key, server-side)
├── public/logo.jpg              → logo yang dipakai di beranda
├── lib/                         → koneksi Supabase (client & admin) + slugify
├── supabase/schema.sql          → tabel + policy, jalankan sekali
└── .env.example
```

Halaman yang tersedia: `/` (beranda), `/buat` (form), `/toko/nama-usaha` (hasil).
Data kontak di footer beranda (WhatsApp, email, alamat) diatur lewat konstanta di bagian atas `app/page.tsx`.

## Catatan keamanan (untuk MVP)

- Upload foto dibuka untuk publik supaya form sederhana. Untuk produk beneran, pindahkan upload lewat API route + validasi ukuran/tipe file.
- `/api/generate` dan `/api/create` belum dibatasi (rate limit). Siapa pun yang tahu URL-nya bisa memakai kuota Gemini kalian. Untuk tugas kuliah aman, tapi sebelum dipromosikan luas tambahkan login atau rate limiting.

## Subdomain untuk paket berbayar

Usaha dengan paket `monthly` / `yearly` yang masih aktif bisa dibuka lewat `namausaha.domainmu`.

1. Jalankan `supabase/subdomain.sql` di Supabase (menambah kolom `plan` dan `plan_until`).
2. Isi `NEXT_PUBLIC_ROOT_DOMAIN` (mis. `instalaman.id`).
3. Di Vercel > Settings > Domains tambahkan `instalaman.id` dan `*.instalaman.id`.
   Wildcard butuh nameserver domain diarahkan ke Vercel (ikuti petunjuk yang muncul di sana).
4. Aktifkan paket usaha lewat SQL (contoh ada di `supabase/subdomain.sql`).

---

## Template (khusus paket langganan)

- 8 template di `components/templates/` (Dasar, Selera/kuliner, Manis/kue, Segar/organik, Butik/fashion, Nusantara/kriya, Rawat/kecantikan, Digital/jasa). Daftar & data contoh ada di `lib/templates.ts`.
- **Gratis** selalu tampil template `basic`. **Langganan aktif** tampil template yang dipilih di kolom `umkm.template`. Kalau langganan habis, otomatis kembali ke `basic` (pilihan tidak hilang).
- Jalankan sekali di Supabase SQL Editor: `supabase/template.sql` (menambah kolom `template`). Cara mengaktifkan paket + memilih template ada di komentar file itu.
- Galeri contoh: `/template` dan `/template/kuliner` (data palsu, bebas dilihat siapa saja).
- Mencoba template di halaman usaha asli tanpa mengubah data: `/toko/slug-usaha?tpl=kuliner`.
- Menambah template baru: buat komponen di `components/templates/`, daftarkan di `index.tsx` dan `lib/templates.ts`, tambahkan key ke constraint di `template.sql`.

---

## Langganan & pembayaran (Midtrans)

Alur: klik **Langganan** → wajib **login** → pilih halaman, paket, **metode bayar** → halaman pembayaran **Midtrans Snap** → webhook mengaktifkan paket → **dashboard** (pilih template).

**Setup sekali:**
1. Supabase SQL Editor, jalankan berurutan: `template.sql` lalu `payments.sql` (kolom `owner_id`, tabel `umkm_claims`, `orders`).
2. Midtrans Dashboard → Settings → Access Keys. Isi di `.env.local` / Vercel:
   `MIDTRANS_SERVER_KEY` (pakai key **Sandbox** dulu) dan `MIDTRANS_IS_PRODUCTION=false`.
3. Midtrans → Settings → Configuration → **Payment Notification URL**: `https://DOMAINMU/api/midtrans/notify`.
4. Tes di sandbox (kartu/VA simulator Midtrans), lalu ganti ke key produksi + `MIDTRANS_IS_PRODUCTION=true`.

**Metode bayar:** hanya QRIS (`PAY_METHODS` di `lib/site.ts`). Uang dicairkan Midtrans ke rekening BCA yang kamu daftarkan di dashboard Midtrans (bukan di kode). Kalau QRIS belum muncul di sandbox/produksi, minta Midtrans mengaktifkan "QRIS" untuk akunmu.

**Catatan keamanan:**
- Harga paket hanya di server (`PLANS` di `lib/site.ts`). Browser tidak mengirim nominal.
- Paket diaktifkan **hanya** oleh webhook yang signature-nya valid dan nominalnya cocok. Notifikasi ganda tidak memperpanjang dua kali.
- Halaman dibuat tanpa login, jadi pembuat dapat **kode klaim** (hash-nya saja di database, kode asli di browser pembuat). Saat langganan, halaman otomatis diklaim ke akun yang login. Kalau beda perangkat, klaim manual dengan slug + kode di halaman `/langganan`.
- Ganti template (`/api/template`) hanya untuk pemilik halaman dengan paket aktif.

---

## SEO (supaya halaman usaha ditemukan Google)

- Alamat utama tiap halaman usaha SELALU `https://DOMAINMU/toko/slug` (tag canonical). Subdomain (kalau dinyalakan) tidak dianggap duplikat.
- Otomatis: `/sitemap.xml` (daftar semua halaman usaha, diperbarui tiap jam), `/robots.txt`, judul + deskripsi, pratinjau link (Open Graph) untuk WhatsApp/Facebook, dan data terstruktur `LocalBusiness`.
- Halaman pribadi (`/dashboard`, `/langganan`, `/login`) dan contoh template (`/template/xxx`) ditandai `noindex`.
- Pastikan `NEXT_PUBLIC_ROOT_DOMAIN` terisi domain produksi (mis. `instalaman.id`), karena canonical dan sitemap memakainya.
- **Langkah manual (wajib dilakukan pemilik):** daftarkan domain di Google Search Console (search.google.com/search-console), lalu Sitemaps → kirim `sitemap.xml`. Tanpa ini Google lambat menemukan situsmu.
- Foto cover usaha dipakai sebagai gambar pratinjau. Kalau belum ada, memakai `public/logo.jpg`.

---

## Model bisnis: gratis = pratinjau, langganan = terbit

- **Gratis:** bisa membuat halaman (tanpa login), teks AI, dan **pratinjau** lewat link rahasia `/toko/slug?pv=...`. Halaman TIDAK tayang untuk umum, tidak masuk Google/sitemap, dan isinya tidak bocor (pengunjung hanya melihat "Halaman belum tayang").
- **Langganan (bulanan/tahunan) per halaman:** halaman **diterbitkan** (publik, masuk Google dan sitemap), semua template terbuka, bisa ganti template kapan saja.
- **Langganan habis:** halaman otomatis kembali offline (jadi pratinjau lagi). Data dan template pilihan tidak hilang. Perpanjang dari dashboard.
- Satu langganan = satu halaman. Tidak ada batas jumlah halaman pratinjau.
- Token pratinjau = HMAC dari slug memakai `SUPABASE_SERVICE_ROLE_KEY` (`lib/preview.ts`), jadi tidak perlu kolom baru. Mengganti service role key akan membuat semua link pratinjau lama tidak berlaku.
- Gerbang penerbitan ada di `app/toko/[slug]/page.tsx` (`isPlanActive` + `validPreview`).
