"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Stats = { total: number; unique: number };

// Angka naik pelan-pelan ke nilai baru, jadi perubahan realtime terasa hidup.
function useCountUp(target: number | null) {
  const [val, setVal] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (target === null) return;
    const start = from.current;
    const diff = target - start;
    if (diff === 0) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 700);
      const v = Math.round(start + diff * (1 - Math.pow(1 - p, 3)));
      from.current = v;
      setVal(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return target === null ? null : val;
}

const fmt = (n: number | null) => (n === null ? "–" : n.toLocaleString("id-ID"));

export default function VisitStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [online, setOnline] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;

    // ID acak per browser, disimpan supaya "pengunjung unik" tidak terhitung dobel.
    let vid = "";
    try {
      vid = localStorage.getItem("il_vid") || "";
      if (!vid) {
        vid = crypto.randomUUID();
        localStorage.setItem("il_vid", vid);
      }
    } catch {
      vid = crypto.randomUUID();
    }

    // Satu kunjungan dihitung sekali per sesi browser (refresh tidak menambah angka).
    let alreadyTracked = false;
    try {
      alreadyTracked = sessionStorage.getItem("il_tracked") === "1";
      if (!alreadyTracked) sessionStorage.setItem("il_tracked", "1");
    } catch {}

    const load = async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("total_visits, unique_visitors")
        .eq("id", 1)
        .single();
      if (!alive) return;
      if (error || !data) {
        console.warn("[VisitStats] gagal membaca site_stats:", error?.message);
        setFailed(true);
        return;
      }
      setFailed(false);
      setStats({ total: Number(data.total_visits), unique: Number(data.unique_visitors) });
    };

    (async () => {
      if (!alreadyTracked) {
        const { error } = await supabase.rpc("track_visit", { p_visitor: vid });
        if (error) {
          console.warn("[VisitStats] gagal mencatat kunjungan:", error.message);
          try {
            sessionStorage.removeItem("il_tracked");
          } catch {}
        }
      }
      await load();
    })();

    // Realtime 1: angka total berubah di database -> langsung tampil.
    const statsCh = supabase
      .channel("site-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_stats" }, (payload) => {
        const r: any = payload.new;
        if (r && alive) setStats({ total: Number(r.total_visits), unique: Number(r.unique_visitors) });
      })
      .subscribe();

    // Realtime 2: jumlah orang yang sedang membuka halaman ini (Presence).
    const presence = supabase.channel("site-online", { config: { presence: { key: vid } } });
    presence
      .on("presence", { event: "sync" }, () => {
        if (alive) setOnline(Object.keys(presence.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await presence.track({ at: Date.now() });
      });

    return () => {
      alive = false;
      supabase.removeChannel(statsCh);
      supabase.removeChannel(presence);
    };
  }, []);

  const total = useCountUp(stats ? stats.total : null);
  const unique = useCountUp(stats ? stats.unique : null);
  const now = useCountUp(online);

  return (
    <section id="kunjungan" className="sec">
      <div className="wrap">
        <span className="eb">Statistik langsung</span>
        <h2 className="st">Berapa orang yang sudah berkunjung</h2>
        <p className="sub2">Angka dihitung dari kunjungan sungguhan dan berubah sendiri tanpa perlu refresh.</p>

        <div className="stats">
          <div className="stc">
            <span className="sti">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <small>Total kunjungan</small>
            <div className="stn">{fmt(total)}</div>
            <p>Setiap sesi browser dihitung satu kali</p>
          </div>

          <div className="stc">
            <span className="sti">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </span>
            <small>Pengunjung unik</small>
            <div className="stn">{fmt(unique)}</div>
            <p>Dihitung per perangkat dan browser</p>
          </div>

          <div className="stc">
            <span className="sti">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
                <circle cx="12" cy="19.5" r="1" fill="currentColor" />
              </svg>
            </span>
            <small>
              <i className="pulse" /> Online sekarang
            </small>
            <div className="stn">{fmt(now)}</div>
            <p>Orang yang sedang membuka halaman ini</p>
          </div>
        </div>

        {failed && <p className="stnote">Data kunjungan belum bisa dimuat. Coba muat ulang halaman sebentar lagi.</p>}
      </div>
    </section>
  );
}
