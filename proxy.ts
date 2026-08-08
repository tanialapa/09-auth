import { NextRequest, NextResponse } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

function copySessionCookies(
  response: NextResponse,
  setCookieHeader?: string | string[],
) {
  if (!setCookieHeader) return;

  const cookieHeaders = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookieHeader of cookieHeaders) {
    const { name, value, ...options } = parseSetCookie(cookieHeader);
    response.cookies.set(name, value ?? "", options);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isPublicRoute = publicRoutes.includes(pathname);
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  let isAuthenticated = Boolean(accessToken);
  let refreshedCookies: string | string[] | undefined;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      isAuthenticated = sessionResponse.data.success;
      refreshedCookies = sessionResponse.headers["set-cookie"];
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isPublicRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  copySessionCookies(response, refreshedCookies);
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
