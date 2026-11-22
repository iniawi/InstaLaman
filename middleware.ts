import { NextResponse, type NextRequest } from "next/server";
import { RESERVED_SUBDOMAINS, rootUrl, subdomainOf } from "@/lib/site";

// kedai-kopi.instalaman.id  ->  halaman /toko/kedai-kopi
export function middleware(req: NextRequest) {
  const sub = subdomainOf(req.headers.get("host"));
  if (!sub || RESERVED_SUBDOMAINS.has(sub)) return NextResponse.next();

  const { pathname, search } = req.nextUrl;

  // Beranda subdomain = halaman toko. Tandai lewat header supaya halaman tahu ini datang dari subdomain.
  if (pathname === "/") {
    const headers = new Headers(req.headers);
    headers.set("x-subdomain", sub);
    const url = req.nextUrl.clone();
    url.pathname = `/toko/${sub}`;
    return NextResponse.rewrite(url, { request: { headers } });
  }

  // Halaman lain (login, buat, dll) hanya ada di domain utama.
  return NextResponse.redirect(rootUrl(pathname + search));
}

export const config = {
  // Lewati file statis, _next, dan api
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
