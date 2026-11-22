-- Template per usaha. Jalankan di Supabase > SQL Editor > New query > Run
alter table public.umkm
  add column if not exists template text not null default 'basic';

alter table public.umkm drop constraint if exists umkm_template_check;
alter table public.umkm add constraint umkm_template_check
  check (template in ('basic','kuliner','kue','organik','fashion','kriya','kecantikan','jasa'));

-- Aturan: template selain 'basic' HANYA tampil kalau paket masih aktif.
-- Paket gratis / habis masa aktif otomatis jatuh ke tampilan 'basic' (data template tidak hilang).

-- ===== Cara memilihkan template untuk usaha yang sudah langganan =====
--   update public.umkm set plan = 'monthly', plan_until = now() + interval '1 month', template = 'kuliner'
--   where slug = 'kedai-kopi';
-- Pilihan template: basic | kuliner | kue | organik | fashion | kriya | kecantikan | jasa
-- Coba template apa saja tanpa mengubah data: buka /toko/kedai-kopi?tpl=kuliner
