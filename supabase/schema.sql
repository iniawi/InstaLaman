-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run

-- Tabel utama: satu baris = satu UMKM / satu landing page
create table if not exists umkm (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  biz_type text,
  city text,
  raw_story text,
  contact text,
  tagline text,
  about text,
  cover_url text,
  created_at timestamptz default now()
);

-- Tabel produk, satu UMKM bisa punya banyak produk
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid references umkm(id) on delete cascade,
  name text not null,
  price text,
  description text,
  image_url text,
  sort_order int default 0
);

-- Aktifkan Row Level Security
alter table umkm enable row level security;
alter table products enable row level security;

-- Semua orang boleh BACA (karena landing page bersifat publik)
create policy "Public can read umkm"
  on umkm for select
  using (true);

create policy "Public can read products"
  on products for select
  using (true);

-- Catatan: INSERT/UPDATE/DELETE ke tabel ini sengaja TIDAK dibuka untuk publik.
-- Pembuatan data dilakukan lewat API route (/api/create) yang pakai SERVICE ROLE KEY
-- di server, jadi otomatis lewati RLS ini dengan aman (key tidak pernah sampai ke browser).

-- Policy storage untuk bucket 'umkm-images' (supaya form bisa upload foto dari browser).
-- Bucket-nya sendiri dibuat lewat menu Storage (Public bucket), lalu jalankan ini:
create policy "Public can upload umkm images"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'umkm-images');

create policy "Public can read umkm images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'umkm-images');
