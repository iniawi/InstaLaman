"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Urutan harus sama dengan urutan section di halaman.
const LINKS = [
  { id: "top", label: "Beranda" },
  { id: "cara", label: "Cara kerja" },
  { id: "fitur", label: "Fitur" },
  { id: "template", label: "Template" },
  { id: "harga", label: "Harga" },
  { id: "kontak", label: "Kontak" },
];

const NAV_H = 64; // tinggi navbar, harus sama dengan .nbi di globals.css

export default function Navbar() {
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  // Tandai menu yang sesuai dengan bagian yang sedang tampil di layar.
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean,
    ) as HTMLElement[];
    const onScroll = () => {
      const y = window.scrollY + NAV_H + 80;
      let cur = "top";
      for (const el of els)
        if (el.getBoundingClientRect().top + window.scrollY <= y) cur = el.id;
      // Di dasar halaman, paksa "Kontak" aktif.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4)
        cur = "kontak";
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Status login
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setEmail(s?.user.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;

    let top = 0;
    if (id !== "top") {
      const inner =
        (el.querySelector(":scope > .wrap") as HTMLElement | null) ?? el;
      const innerTop = inner.getBoundingClientRect().top + window.scrollY;
      const avail = window.innerHeight - NAV_H; // tinggi area di bawah navbar
      const h = inner.offsetHeight;
      top =
        h + 48 <= avail
          ? innerTop - NAV_H - (avail - h) / 2 // isi muat di layar -> taruh di tengah
          : innerTop - NAV_H - 24; // isi tinggi -> rata atas, jarak 24px dari navbar
    }

    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    history.replaceState(null, "", id === "top" ? "/" : `#${id}`);
    setActive(id);
  };

  const auth = email ? (
    <>
      <Link className="btn g s" href="/dashboard">
        Halaman saya
      </Link>
      <button className="nbout" onClick={() => supabase.auth.signOut()}>
        Keluar
      </button>
    </>
  ) : (
    <Link className="btn g s" href="/login">
      Masuk
    </Link>
  );

  return (
    <header className="nb">
      <div className="wrap nbi">
        <Link className="brand" href="/" onClick={go("top")}>
          Insta<b>Laman</b>
        </Link>

        <nav className={`nbl${open ? " open" : ""}`} aria-label="Menu utama">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.id === "top" ? "#" : `#${l.id}`}
              onClick={go(l.id)}
              className={active === l.id ? "on" : ""}
              aria-current={active === l.id ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
          <div className="nbm">
            {auth}
            <Link className="btn s" href="/buat">
              Mulai gratis
            </Link>
          </div>
        </nav>

        <div className="nbr">
          {auth}
          <Link className="btn s" href="/buat">
            Mulai gratis
          </Link>
        </div>

        <button
          className="burger"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
