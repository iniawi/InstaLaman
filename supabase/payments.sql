-- Pemilik halaman, kode klaim, dan pesanan pembayaran.
-- Jalankan di Supabase > SQL Editor > New query > Run (setelah schema.sql, subdomain.sql, template.sql)

-- 1) Pemilik halaman (akun yang login)
alter table public.umkm
  add column if not exists owner_id uuid references auth.users(id) on delete set null;
create index if not exists umkm_owner_idx on public.umkm(owner_id);

-- 2) Kode klaim: halaman dibuat tanpa login, jadi pembuat dapat kode rahasia (disimpan di browsernya).
--    Saat langganan, kode itu dipakai untuk "mengklaim" halaman ke akunnya. Yang disimpan hanya HASH-nya.
--    RLS aktif TANPA policy = tidak bisa dibaca dari browser, hanya dari server (service role).
create table if not exists public.umkm_claims (
  umkm_id uuid primary key references public.umkm(id) on delete cascade,
  token_hash text not null,
  created_at timestamptz not null default now()
);
alter table public.umkm_claims enable row level security;

-- 3) Pesanan pembayaran. Hanya server yang boleh menulis; user hanya bisa membaca pesanannya sendiri.
create table if not exists public.orders (
  id text primary key,                       -- order_id yang dikirim ke Midtrans
  umkm_id uuid references public.umkm(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  plan text not null check (plan in ('monthly','yearly')),
  amount integer not null,
  method text,
  status text not null default 'pending' check (status in ('pending','paid','failed','expired')),
  payment_type text,
  snap_token text,
  redirect_url text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table public.orders enable row level security;

drop policy if exists "orders_read_own" on public.orders;
create policy "orders_read_own" on public.orders
  for select to authenticated using (user_id = auth.uid());
