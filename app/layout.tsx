import type { Metadata } from "next";
import "./globals.css";
import { siteOrigin } from "@/lib/site";

const TITLE = "InstaLaman – Landing page UMKM, jadi dalam hitungan menit";
const DESC = "Isi nama usaha, ceritamu, dan produk. InstaLaman menuliskan teksnya dan memasang halaman dengan link sendiri.";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "InstaLaman", locale: "id_ID", title: TITLE, description: DESC, url: "/", images: ["/logo.jpg"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/logo.jpg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
