import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO, TEMPLATES, TEMPLATE_MAP, isTemplateKey } from "@/lib/templates";
import { renderTemplate } from "@/components/templates";
import PreviewBar from "@/components/PreviewBar";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ key: t.key }));
}

export function generateMetadata({ params }: { params: { key: string } }): Metadata {
  return isTemplateKey(params.key) ? { title: `Template ${TEMPLATE_MAP[params.key].name} · InstaLaman`, robots: { index: false, follow: true } }
    : {};
}

// Halaman contoh tampilan template dengan data palsu. Bebas dilihat siapa saja.
export default function TemplateDemo({
  params,
  searchParams,
}: {
  params: { key: string };
  searchParams: { bar?: string };
}) {
  if (!isTemplateKey(params.key)) return notFound();
  const d = DEMO[params.key];
  return (
    <>
      {renderTemplate(params.key, { umkm: d.umkm, products: d.products })}
      {searchParams.bar !== "0" && <PreviewBar tpl={params.key} mode="demo" closeHref="/template" />}
    </>
  );
}
