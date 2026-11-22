-- Paket & masa aktif per usaha. Jalankan di Supabase > SQL Editor > New query > Run
alter table public.umkm
  add column if not exists plan text not null default 'free',
  add column if not exists plan_until timestamptz;

alter table public.umkm drop constraint if exists umkm_plan_check;
alter table public.umkm add constraint umkm_plan_check check (plan in ('free', 'monthly', 'yearly'));

-- ===== Cara mengaktifkan paket untuk satu usaha (ganti 'kedai-kopi' dengan slug-nya) =====
-- Bulanan:
--   update public.umkm set plan = 'monthly', plan_until = now() + interval '1 month' where slug = 'kedai-kopi';
-- Tahunan:
--   update public.umkm set plan = 'yearly',  plan_until = now() + interval '1 year'  where slug = 'kedai-kopi';
-- Kembali ke gratis:
--   update public.umkm set plan = 'free', plan_until = null where slug = 'kedai-kopi';
