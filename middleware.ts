import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  const session = await checkSession(accessToken ?? undefined, refreshToken ?? undefined);

  const valid = session.valid;
  let setCookie: string | undefined = undefined;

  if (session.setCookie) {
    setCookie = Array.isArray(session.setCookie) ? session.setCookie[0] : session.setCookie;
  }

  const response = NextResponse.next();
  if (setCookie) response.headers.set("set-cookie", setCookie);

  if (isPrivateRoute && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isPublicRoute && valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
