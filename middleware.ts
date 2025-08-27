import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function checkAndRefreshSession(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) return { valid: false };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`, {
      method: "GET",
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "x-refresh-token": refreshToken ?? "",
      },
      cache: "no-store",
    });

    if (!res.ok) return { valid: false };

    const data = await res.json();

    const response = NextResponse.next();

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return { valid: !!data?.valid, response };
  } catch (err) {
    console.error("❌ Session check failed:", err);
    return { valid: false };
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const { valid, response } = await checkAndRefreshSession(req);

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

  return response ?? NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
