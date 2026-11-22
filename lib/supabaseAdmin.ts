import { createClient } from "@supabase/supabase-js";

// PENTING: file ini hanya boleh diimport dari kode yang jalan di server
// (app/api/*/route.ts atau server component), TIDAK BOLEH diimport ke client component.
// Service role key ini bisa baca/tulis semua data, lewati semua RLS policy.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
