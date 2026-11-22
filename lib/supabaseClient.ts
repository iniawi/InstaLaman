import { createClient } from "@supabase/supabase-js";

// Client ini dipakai di komponen sisi browser (client component).
// Hanya pakai ANON KEY di sini — jangan pernah taruh service role key di kode yang jalan di browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
