import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/profile"];
const publicRoutes = ["/login", "/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the current route is protected or public
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Get the JWT token from the session cookie
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If the route is protected and there is no token → redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If the route is public and there is a token → redirect to profile
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // If everything is okay, continue to the requested page
  return NextResponse.next();
}

// Exclude API, static, and image routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
