import { supabase } from "@/lib/supabaseClient";

/** fetch ke API kita dengan token login Supabase (untuk dipakai di client component). */
export async function authFetch(url: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

/** Kode klaim halaman yang dibuat tanpa login, disimpan di browser pembuatnya. */
const KEY = "instalaman:claims";
export type Claim = { slug: string; token: string };
export function readClaims(): Claim[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveClaim(c: Claim) {
  try { localStorage.setItem(KEY, JSON.stringify([...readClaims().filter((x) => x.slug !== c.slug), c])); } catch {}
}
export function dropClaim(slug: string) {
  try { localStorage.setItem(KEY, JSON.stringify(readClaims().filter((x) => x.slug !== slug))); } catch {}
}
