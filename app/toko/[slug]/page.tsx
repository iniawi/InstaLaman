import type { Metadata } from "next";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isPlanActive, rootUrl, siteOrigin } from "@/lib/site";
import { effectiveTemplate, isTemplateKey } from "@/lib/templates";
import { renderTemplate } from "@/components/templates";
import PreviewBar from "@/components/PreviewBar";
import Unpublished from "@/components/Unpublished";
import { validPreview } from "@/lib/preview";

export const revalidate = 0;

const getUmkm = cache(async (slug: string) => {
  const { data: umkm } = await supabase.from("umkm").select("*").eq("slug", slug).maybeSingle();
  if (!umkm) return null;

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("umkm_id", umkm.id)
    .order("sort_order", { ascending: true });

  return { umkm, products: products || [] };
});

const clip = (t: string, n: number) => (t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getUmkm(params.slug);
  if (!data) return { robots: { index: false } };
  const { umkm } = data;

  // Belum terbit = jangan sampai masuk Google, dan jangan bocorkan isinya ke metadata.
  if (!isPlanActive(umkm)) {
    return { title: `${umkm.name} (pratinjau)`, robots: { index: false, follow: false } };
  }

  const place = [umkm.biz_type, umkm.city].filter(Boolean).join(" di ");
  const title = place ? `${umkm.name} – ${place}` : umkm.name;
  const description = clip(umkm.tagline || umkm.about || `Halaman resmi ${umkm.name}. Pesan langsung lewat WhatsApp.`, 160);
  // Alamat utama SELALU /toko/slug di domain utama, supaya subdomain tidak dianggap duplikat.
  const url = `${siteOrigin()}/toko/${umkm.slug}`;
  const image = umkm.cover_url || `${siteOrigin()}/logo.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: "InstaLaman", locale: "id_ID", title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function TokoPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { tpl?: string; pv?: string };
}) {
  const data = await getUmkm(params.slug);
  if (!data) return notFound();

  const { umkm, products } = data;
  const active = isPlanActive(umkm);

  // Subdomain hanya untuk paket berbayar yang masih aktif. Selain itu, arahkan ke link biasa.
  if (headers().get("x-subdomain") && !active) {
    redirect(rootUrl(`/toko/${umkm.slug}`));
  }

  // GERBANG PENERBITAN: halaman hanya tayang untuk umum kalau langganan aktif.
  // Selain itu hanya bisa dilihat lewat link pratinjau (?pv=...), yang dibuat server untuk pemilik.
  const previewOk = validPreview(umkm.slug, searchParams.pv);
  if (!active && !previewOk) return <Unpublished name={umkm.name} />;

  const live = effectiveTemplate(umkm.template, active);

  // ?tpl=kuliner -> mencoba template apa pun tanpa mengubah data.
  const tryTpl = isTemplateKey(searchParams.tpl) && searchParams.tpl !== live ? searchParams.tpl : null;
  const shown = tryTpl ?? live;

  // Data terstruktur hanya untuk halaman yang sudah terbit. "<" di-escape supaya teks pengguna tidak bisa menutup tag script.
  const intl = (umkm.contact || "").replace(/\D/g, "");
  const jsonLd = active
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: umkm.name,
        description: umkm.tagline || umkm.about || undefined,
        url: `${siteOrigin()}/toko/${umkm.slug}`,
        image: umkm.cover_url || undefined,
        telephone: intl ? `+${intl}` : undefined,
        address: umkm.city ? { "@type": "PostalAddress", addressLocality: umkm.city, addressCountry: "ID" } : undefined,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      {renderTemplate(shown, { umkm, products })}
      {!active && <PreviewBar mode="draft" publishHref={`/langganan?paket=monthly&slug=${encodeURIComponent(umkm.slug)}`} />}
      {active && tryTpl && <PreviewBar mode="template" tpl={tryTpl} closeHref={`/toko/${umkm.slug}`} />}
    </>
  );
}
