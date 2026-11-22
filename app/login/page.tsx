"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Mode = "masuk" | "daftar" | "reset";

function pesanError(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Email atau password salah.";
  if (m.includes("already registered")) return "Email ini sudah terdaftar. Silakan masuk.";
  if (m.includes("email not confirmed")) return "Email belum dikonfirmasi. Cek kotak masuk kamu.";
  if (m.includes("at least")) return "Password minimal 6 karakter.";
  if (m.includes("rate limit")) return "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.";
  if (m.includes("provider is not enabled")) return "Login Google belum diaktifkan di Supabase.";
  return msg;
}

// Tujuan setelah login (?next=/langganan?...). Hanya path internal yang diizinkan.
function nextPath() {
  if (typeof window === "undefined") return "/buat";
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/buat";
}

function Eye({ off }: { off: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// Ilustrasi sederhana di panel kiri (jendela browser + kursor, senada dengan logo).
function Ilustrasi() {
  return (
    <svg viewBox="0 0 320 210" role="img" aria-label="Ilustrasi halaman usaha">
      <rect x="24" y="18" width="220" height="150" rx="20" fill="#fff" />
      <circle cx="46" cy="40" r="5" fill="#dfe6ee" />
      <circle cx="62" cy="40" r="5" fill="#dfe6ee" />
      <circle cx="78" cy="40" r="5" fill="#dfe6ee" />
      <rect x="44" y="60" width="110" height="12" rx="6" fill="#12274a" />
      <rect x="44" y="82" width="170" height="8" rx="4" fill="#dfe6ee" />
      <rect x="44" y="98" width="140" height="8" rx="4" fill="#dfe6ee" />
      <rect x="44" y="124" width="84" height="26" rx="13" fill="#f0813a" />
      <rect x="196" y="112" width="100" height="76" rx="16" fill="#ffe9d9" />
      <circle cx="224" cy="138" r="12" fill="#6bb8e8" />
      <path d="M218 138l4 4 8-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="212" y="160" width="68" height="8" rx="4" fill="#f0813a" opacity=".6" />
      <path d="M232 52l0 38 10-9 7 15 7-3-7-15 14-1z" fill="#f0813a" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("masuk");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Kalau user datang dari link "lupa password" di email, tampilkan form password baru.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("reset");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  function ganti(m: Mode) {
    setMode(m);
    setError("");
    setInfo("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (mode !== "reset" && (!email.trim() || !password)) return setError("Isi email dan password dulu ya.");
    if (mode !== "masuk" && password.length < 6) return setError("Password minimal 6 karakter.");

    setLoading(true);
    try {
      if (mode === "masuk") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        router.push(nextPath());
        router.refresh();
      } else if (mode === "daftar") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (data.session) {
          router.push(nextPath());
          router.refresh();
        } else {
          ganti("masuk");
          setInfo("Akun dibuat. Cek email kamu untuk konfirmasi, lalu masuk.");
        }
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        router.push(nextPath());
        router.refresh();
      }
    } catch (err: any) {
      setError(pesanError(err?.message ?? "Terjadi kesalahan. Coba lagi."));
    } finally {
      setLoading(false);
    }
  }

  async function lupaPassword() {
    setError("");
    setInfo("");
    if (!email.trim()) return setError("Isi email kamu dulu, lalu klik Lupa password lagi.");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return setError(pesanError(error.message));
    setInfo("Link reset password sudah dikirim. Cek email kamu.");
  }

  async function masukGoogle() {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${nextPath()}` },
    });
    if (error) setError(pesanError(error.message));
  }

  const judul = mode === "masuk" ? "Selamat Datang" : mode === "daftar" ? "Buat Akun Baru" : "Password Baru";
  const sub =
    mode === "masuk"
      ? "Silakan masuk ke akun kamu"
      : mode === "daftar"
        ? "Daftar gratis, langsung bisa bikin halaman usaha"
        : "Masukkan password baru untuk akun kamu";

  return (
    <main className="auth">
      <div className="authcard">
        <aside className="authl">
          <div>
            <h2>Kelola halaman usahamu dengan mudah</h2>
            <p>Masuk untuk membuat dan mengatur landing page UMKM-mu. Teks ditulis otomatis, tinggal bagikan link-nya.</p>
          </div>
          <Ilustrasi />
        </aside>

        <section className="authr">
          <Link className="brand" href="/">
            Insta<b>Laman</b>
          </Link>
          <h1>{judul}</h1>
          <p className="authp">{sub}</p>

          <form onSubmit={submit} noValidate>
            {mode !== "reset" && (
              <input type="email" aria-label="Email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            )}
            <span className="pw">
              <input
                type={show ? "text" : "password"}
                aria-label="Password"
                autoComplete={mode === "masuk" ? "current-password" : "new-password"}
                placeholder={mode === "reset" ? "Password baru" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Sembunyikan password" : "Tampilkan password"}>
                <Eye off={!show} />
              </button>
            </span>

            {mode === "masuk" && (
              <button type="button" className="forgot" onClick={lupaPassword}>
                Lupa password?
              </button>
            )}

            <p className="err" role="alert">{error}</p>
            {info && <p className="authok">{info}</p>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Tunggu sebentar..." : mode === "masuk" ? "Masuk" : mode === "daftar" ? "Daftar" : "Simpan password"}
            </button>
          </form>

          {mode !== "reset" && (
            <>
              <div className="or">atau masuk dengan</div>
              <div className="sosial">
                <button type="button" onClick={masukGoogle}>
                  <GoogleIcon /> Google
                </button>
              </div>
              <p className="authf">
                {mode === "masuk" ? "Belum punya akun? " : "Sudah punya akun? "}
                <button type="button" onClick={() => ganti(mode === "masuk" ? "daftar" : "masuk")}>
                  {mode === "masuk" ? "Daftar di sini" : "Masuk di sini"}
                </button>
              </p>
            </>
          )}
          <Link className="authb" href="/">← Kembali ke beranda</Link>
        </section>
      </div>
    </main>
  );
}
