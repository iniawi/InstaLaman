import type { Metadata } from "next";

// Halaman pribadi: jangan dimasukkan ke hasil pencarian.
export const metadata: Metadata = { title: "Dashboard · InstaLaman", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
