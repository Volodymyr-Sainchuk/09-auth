import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function checkSession(accessToken?: string, refreshToken?: string) {
  if (!accessToken && !refreshToken) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`, {
      method: "GET",
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "x-refresh-token": refreshToken ?? "",
      },
      cache: "no-store",
    });

    if (!res.ok) return false;

    const data = await res.json();
    return !!data?.valid;
  } catch (err) {
    console.error("❌ Session check failed:", err);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const sessionValid = await checkSession(accessToken, refreshToken);

  if (isPrivateRoute && !sessionValid) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isPublicRoute && sessionValid) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
