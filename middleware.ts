import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/(auth routes)");
  const isPrivateRoute = pathname.startsWith("/(private routes)");

  const token = req.cookies.get("token")?.value;

  if (isPrivateRoute && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(private routes)/:path*", "/(auth routes)/:path*"],
};
