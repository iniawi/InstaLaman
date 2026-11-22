-- Penghitung kunjungan. Jalankan di Supabase Dashboard > SQL Editor > New query > Run

-- Satu baris berisi angka total (dibaca publik, TIDAK bisa diubah langsung dari browser)
create table if not exists public.site_stats (
  id int primary key default 1 check (id = 1),
  total_visits bigint not null default 0,
  unique_visitors bigint not null default 0
);
insert into public.site_stats (id) values (1) on conflict (id) do nothing;

-- Daftar pengunjung (anonim, hanya berisi ID acak dari browser). Tidak bisa diakses dari browser.
create table if not exists public.site_visitors (
  visitor_id uuid primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  visit_count int not null default 1
);

alter table public.site_stats enable row level security;
alter table public.site_visitors enable row level security;

drop policy if exists "site_stats_read" on public.site_stats;
create policy "site_stats_read" on public.site_stats
  for select to anon, authenticated using (true);
-- site_visitors sengaja tanpa policy: tertutup untuk browser.

-- Fungsi yang dipanggil website tiap ada kunjungan baru (satu kali per sesi browser)
create or replace function public.track_visit(p_visitor uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new boolean;
begin
  insert into public.site_visitors as v (visitor_id)
  values (p_visitor)
  on conflict (visitor_id)
  do update set last_seen = now(), visit_count = v.visit_count + 1
  returning (xmax = 0) into v_new;

  update public.site_stats
  set total_visits = total_visits + 1,
      unique_visitors = unique_visitors + case when v_new then 1 else 0 end
  where id = 1;
end;
$$;

revoke all on function public.track_visit(uuid) from public;
grant execute on function public.track_visit(uuid) to anon, authenticated;

-- Aktifkan realtime supaya angka di website berubah tanpa refresh
do $$
begin
  alter publication supabase_realtime add table public.site_stats;
exception when duplicate_object then null;
end $$;
