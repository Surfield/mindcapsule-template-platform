import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for session cookie from the backend
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Redirect authenticated users away from home/sign-in page
  if (request.nextUrl.pathname === "/") {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
