import type { ReactNode } from "react";
import { rootUrl } from "@/lib/site";

export type TplUmkm = {
  name: string;
  biz_type?: string | null;
  city?: string | null;
  tagline?: string | null;
  about?: string | null;
  cover_url?: string | null;
  contact?: string | null;
};
export type TplProduct = {
  id?: string;
  name: string;
  price?: string | null;
  description?: string | null;
  image_url?: string | null;
};
export type TplProps = { umkm: TplUmkm; products: TplProduct[] };

export function waHref(umkm: TplUmkm, text?: string) {
  const n = (umkm.contact || "").replace(/\D/g, "");
  if (!n) return "#";
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
export const orderText = (umkm: TplUmkm, product?: string) =>
  `Halo ${umkm.name}, saya mau ${product ? `pesan ${product}` : "tanya-tanya"}.`;

export function where(umkm: TplUmkm) {
  return [umkm.biz_type, umkm.city].filter(Boolean).join(" · ");
}

/** Foto asli kalau ada, kalau tidak: blok warna dengan emoji. */
export function Pic({
  src, emoji, className = "", bg = "bg-black/5", size = "text-5xl",
}: { src?: string | null; emoji: string; className?: string; bg?: string; size?: string }) {
  if (src) {
    return (
      <div
        role="img"
        className={`bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${src})` }}
      />
    );
  }
  return (
    <div aria-hidden className={`grid place-items-center ${bg} ${size} ${className}`}>
      <span className="drop-shadow-sm select-none">{emoji}</span>
    </div>
  );
}

export function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8.5 9.5c.5 2 2 3.8 4 4.5l1.5-1 2 1c-.3 1.2-1.3 1.8-2.5 1.7C10.5 15.3 8 12.5 7.7 10.2c-.1-1.1.5-1.8 1.3-2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WaButton({
  href, children, className = "",
}: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      <WaIcon className="h-[1.1em] w-[1.1em]" />
      {children}
    </a>
  );
}

export function PoweredBy({ className = "" }: { className?: string }) {
  return (
    <a href={rootUrl("/")} className={`text-[11px] opacity-60 hover:opacity-100 ${className}`}>
      Dibuat dengan InstaLaman
    </a>
  );
}
