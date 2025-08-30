import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let valid = false;
  let setCookie: string | undefined;

  if (accessToken || refreshToken) {
    const session = await checkSession(accessToken, refreshToken);
    valid = session.valid;

    if (session.setCookie) {
      setCookie = Array.isArray(session.setCookie) ? session.setCookie[0] : session.setCookie;
    }
  }

  let response = NextResponse.next();

  if (isPrivateRoute && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    response = NextResponse.redirect(url);
  }

  if (isPublicRoute && valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    response = NextResponse.redirect(url);
  }

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
