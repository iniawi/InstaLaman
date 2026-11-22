import Link from "next/link";

// Ditampilkan ke publik untuk halaman yang belum diterbitkan (belum/tidak lagi berlangganan).
export default function Unpublished({ name }: { name: string }) {
  return (
    <main className="tpl grid min-h-screen place-items-center bg-[#fbfaf7] px-5 font-sans text-[#12274a]">
      <div className="w-full max-w-md rounded-[2rem] border border-[#dfe6ee] bg-white p-9 text-center shadow-[0_30px_60px_-30px_rgba(18,39,74,.35)]">
        <div className="text-5xl" aria-hidden>🚧</div>
        <h1 className="mt-4 font-display text-2xl font-bold">Halaman belum tayang</h1>
        <p className="mt-2 text-[#5b6b85]">
          <b>{name}</b> belum diterbitkan oleh pemiliknya. Silakan kembali lagi nanti.
        </p>
        <Link href="/" className="btn g mt-6 inline-block">Ke InstaLaman</Link>
        <p className="mt-5 text-xs text-[#8b97ad]">
          Pemilik halaman? <Link href="/dashboard" className="font-semibold underline">Buka dashboard</Link> untuk pratinjau dan penerbitan.
        </p>
      </div>
    </main>
  );
}
