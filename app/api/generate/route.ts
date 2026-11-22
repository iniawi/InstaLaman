import { NextRequest, NextResponse } from "next/server";

// Route ini jalan di server (bukan browser), jadi API key aman di sini.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, bizType, city, raw, productNames } = body as {
      name: string;
      bizType: string;
      city: string;
      raw: string;
      productNames: string[];
    };

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum diset di environment variables." },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const prompt = `Kamu menulis konten landing page untuk UMKM Indonesia (gaya menjual, ramah, bahasa Indonesia natural, tidak berlebihan).
Data usaha:
- Nama: ${name}
- Jenis usaha: ${bizType || "(tidak disebutkan)"}
- Kota: ${city || "(tidak disebutkan)"}
- Cerita dari pemilik: ${raw || "(tidak ada)"}
Daftar produk: ${productNames.join(", ") || "(belum ada produk)"}

Balas HANYA dalam format JSON valid dengan struktur persis seperti ini:
{
  "tagline": "satu kalimat tagline singkat, maksimal 12 kata",
  "about": "paragraf tentang usaha, 2-3 kalimat, maksimal 55 kata",
  "products": [
    {"desc": "deskripsi singkat produk 1, maksimal 12 kata"}
  ]
}
Jumlah item di "products" harus sama persis dengan jumlah produk di daftar, urut sesuai urutan daftar.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: "Gagal memanggil Gemini: " + errText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawText: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI mengembalikan format yang tidak bisa dibaca." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Terjadi kesalahan." },
      { status: 500 }
    );
  }
}
