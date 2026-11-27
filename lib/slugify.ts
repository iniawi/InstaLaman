export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}

export function randomSuffix(length = 4): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/** Rapikan ketikan pelanggan di kolom alamat web: huruf kecil, spasi jadi "-", simbol dibuang. Tanda "-" di ujung boleh ada selagi mengetik. */
export function cleanSlugInput(v: string): string {
  return v
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 40);
}

/** Alamat web yang sah: 3-40 karakter, hanya a-z, 0-9, "-", tidak diawali/diakhiri "-". */
export function isValidSlug(s: string): boolean {
  return (
    s.length >= 3 && s.length <= 40 && /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s)
  );
}
