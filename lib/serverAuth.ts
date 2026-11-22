import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/** Ambil user dari header "Authorization: Bearer <access_token Supabase>". Null kalau tidak valid. */
export async function getUser(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  const token = h.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : "";
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export const unauthorized = () =>
  Response.json({ error: "Silakan login dulu." }, { status: 401 });
