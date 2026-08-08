import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  let isAuthenticated = false;

  try {
    isAuthenticated = await checkSession(request.headers.get("cookie") ?? "");
  } catch {
    isAuthenticated = false;
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
