"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { TEMPLATES } from "@/lib/templates";
import { authFetch, saveClaim } from "@/lib/authFetch";

type Product = {
  name: string;
  price: string;
  file: File | null;
  previewUrl: string | null;
};

const emptyProduct = (): Product => ({ name: "", price: "", file: null, previewUrl: null });

export default function BuatPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bizType, setBizType] = useState("");
  const [city, setCity] = useState("");
  const [raw, setRaw] = useState("");
  const [contact, setContact] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([emptyProduct()]);

  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateProduct(i: number, field: "name" | "price", value: string) {
    setProducts((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  }

  function updateProductFile(i: number, file: File) {
    const previewUrl = URL.createObjectURL(file);
    setProducts((prev) => prev.map((p, idx) => (idx === i ? { ...p, file, previewUrl } : p)));
  }

  function addProduct() {
    setProducts((prev) => [...prev, emptyProduct()]);
  }

  function removeProduct(i: number) {
    setProducts((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function uploadImage(file: File, pathPrefix: string): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `${pathPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("umkm-images").upload(path, file);
    if (error) {
      console.error(error);
      return null;
    }
    const { data } = supabase.storage.from("umkm-images").getPublicUrl(path);
    return data.publicUrl;
  }

  function validate(): string[] {
    const missing: string[] = [];
    if (!name.trim()) missing.push("nama usaha");
    if (!raw.trim()) missing.push("cerita usaha");
    if (!/^62\d{8,13}$/.test(contact.replace(/\s/g, ""))) missing.push("nomor WhatsApp (format 62…)");
    if (!products.some((p) => p.name.trim())) missing.push("minimal satu produk");
    return missing;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const missing = validate();
    if (missing.length) {
      setIsError(true);
      setStatus(`Lengkapi dulu: ${missing.join(", ")}.`);
      return;
    }
    setLoading(true);
    setIsError(false);

    try {
      // 1) Generate teks lewat AI (Gemini, dipanggil dari server)
      setStatus("Menulis konten dengan AI…");
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bizType,
          city,
          raw,
          productNames: products.map((p) => p.name || "Produk"),
        }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || "Gagal generate konten");

      // 2) Upload gambar (cover + tiap produk) ke Supabase Storage
      setStatus("Mengunggah gambar…");
      let coverUrl: string | null = null;
      if (coverFile) coverUrl = await uploadImage(coverFile, "cover");

      const productPayload = await Promise.all(
        products.map(async (p, i) => {
          let imageUrl: string | null = null;
          if (p.file) imageUrl = await uploadImage(p.file, `product-${i}`);
          return {
            name: p.name || "Produk",
            price: p.price || "",
            desc: genData.products?.[i]?.desc || "",
            imageUrl,
          };
        })
      );

      // 3) Simpan semuanya ke database lewat API (pakai service role di server)
      setStatus("Menyimpan halaman…");
      const createRes = await authFetch("/api/create", {
        method: "POST",
        body: JSON.stringify({
          name,
          bizType,
          city,
          raw,
          contact: contact.replace(/\s/g, ""),
          tagline: genData.tagline || "",
          about: genData.about || "",
          coverUrl,
          products: productPayload,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Gagal menyimpan halaman");

      if (createData.claimToken) saveClaim({ slug: createData.slug, token: createData.claimToken });
      setStatus("Berhasil! Membuka pratinjau halamanmu…");
      router.push(`/toko/${createData.slug}?pv=${createData.pv}`);
    } catch (err: any) {
      setIsError(true);
      setStatus(err.message || "Terjadi kesalahan.");
      setLoading(false);
    }
  }

  const waDigits = contact.replace(/\D/g, "");
  const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(`Halo ${name || "Nama usahamu"}, saya mau pesan.`)}`;

  return (
    <div>
      <div className="wrap">
        <nav>
          <Link className="brand" href="/">
            Insta<b>Laman</b>
          </Link>
        </nav>
        <div className="top">
          <Link className="back" href="/">
            Kembali ke beranda
          </Link>
          <h1>Bikin landing page usahamu</h1>
          <p>
            Isi info usaha dan produk. Tampilan halamanmu langsung terlihat di sebelah kanan saat kamu
            mengetik.
          </p>
        </div>

        <div className="fgrid">
          <form onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Tentang usahamu</legend>
              <label>
                Nama usaha
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Kopi Kulo" />
              </label>
              <div className="two">
                <label>
                  Jenis usaha
                  <input type="text" value={bizType} onChange={(e) => setBizType(e.target.value)} placeholder="Contoh: Kedai kopi & camilan" />
                </label>
                <label>
                  Kota
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Contoh: Yogyakarta" />
                </label>
              </div>
              <label>
                Ceritakan usahamu
                <textarea
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  placeholder="Contoh: Jual kopi susu literan sama camilan kayak pisang nugget. Buka dari mahasiswa tahun 2023, sekarang udah ada 2 cabang deket kampus."
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Kontak dan foto</legend>
              <label>
                Nomor WhatsApp <small>format 62…, tanpa tanda + atau spasi</small>
                <input type="tel" inputMode="numeric" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contoh: 6281234567890" />
              </label>
              <label>
                Foto cover <small>opsional</small>
                <span className="drop">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setCoverFile(f);
                        setCoverPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                  {coverPreview && <img src={coverPreview} alt="" />}
                  <span>{coverPreview ? "Ganti foto cover" : "Pilih foto cover"}</span>
                </span>
              </label>
            </fieldset>

            <fieldset>
              <legend>Produk</legend>
              <div id="pl">
                {products.map((p, i) => (
                  <div className="prod" key={i}>
                    <input type="text" value={p.name} onChange={(e) => updateProduct(i, "name", e.target.value)} placeholder="Contoh: Kopi Susu Literan" />
                    <input type="text" value={p.price} onChange={(e) => updateProduct(i, "price", e.target.value)} placeholder="Contoh: Rp25.000" />
                    <button type="button" className="x" onClick={() => removeProduct(i)}>
                      Hapus
                    </button>
                    <label className="drop">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) updateProductFile(i, f);
                        }}
                      />
                      {p.previewUrl && <img src={p.previewUrl} alt="" />}
                      <span>{p.previewUrl ? "Ganti foto" : "Foto produk (opsional)"}</span>
                    </label>
                  </div>
                ))}
              </div>
              <button type="button" className="add" onClick={addProduct}>
                + Tambah produk
              </button>
            </fieldset>

            <fieldset>
              <legend>Tampilan halaman</legend>
              <div className="tsel">
                {TEMPLATES.map((t) =>
                  t.premium ? (
                    <a key={t.key} href={`/template/${t.key}`} target="_blank" rel="noopener noreferrer">
                      <span className="tsw" style={{ background: t.swatch[0] }}>{t.emoji}</span>
                      <span>
                        <b>{t.name}</b>
                        <small>{t.category}</small>
                      </span>
                      <span className="tlock">🔒 Langganan</span>
                    </a>
                  ) : (
                    <div key={t.key} className="on">
                      <span className="tsw" style={{ background: t.swatch[0] }}>{t.emoji}</span>
                      <span>
                        <b>{t.name}</b>
                        <small>Dipakai di pratinjau</small>
                      </span>
                      <span className="tlock" style={{ color: "var(--or)" }}>✓ Terpilih</span>
                    </div>
                  )
                )}
              </div>
              <p className="tnote">
                Paket gratis untuk mencoba: kamu bisa membuat dan melihat pratinjau. Untuk menayangkannya online dan membuka semua template, berlangganan. <a href="/template">Lihat semua contoh</a>
              </p>
            </fieldset>

            <p className="err" role="alert" style={isError ? undefined : { color: "var(--ink)" }}>
              {status}
            </p>
            <button className="btn" type="submit" disabled={loading} style={loading ? { opacity: 0.6 } : undefined}>
              {loading ? "Memproses…" : "✨ Buat landing page dengan AI"}
            </button>
          </form>

          <aside className="prev">
            <div className="pl">Pratinjau halaman</div>
            <div className="pv">
              <div className="bar">
                <i />
                <i />
                <i />
              </div>
              <div className="cv" style={coverPreview ? { backgroundImage: `url(${coverPreview})` } : undefined} />
              <div className="pb">
                <h3>{name.trim() || "Nama usahamu"}</h3>
                <div className="m">{[bizType.trim(), city.trim()].filter(Boolean).join(" di ")}</div>
                <p>{raw.trim() || "Ceritamu akan tampil di sini."}</p>
                <div>
                  {products
                    .filter((p) => p.name.trim())
                    .map((p, i) => (
                      <div className="pi" key={i}>
                        <div>
                          {p.previewUrl && <img src={p.previewUrl} alt="" />}
                          {p.name}
                        </div>
                        <b>{p.price}</b>
                      </div>
                    ))}
                </div>
                <a className="wa" href={waHref} target="_blank" rel="noopener noreferrer">
                  Pesan lewat WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
