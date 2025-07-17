import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export { default } from "next-auth/middleware"

// Add protected routes/paths here
export const config = { matcher: ["/player/(.*)", "/owner/(.*)"] } 

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  //console.log(token);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-base-url", req.nextUrl.origin);

  if (!token) {
    // If no token and trying to access a protected route, redirect to login with callback URL
    const callbackUrl = encodeURIComponent(req.nextUrl.href);
    return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, req.url));
  }

  if (token) {
    const userRole = token.role;
    if (pathname.startsWith("/owner") && userRole !== "Owner") {
      return NextResponse.redirect(new URL("/403", req.url));
    } else if (pathname.startsWith("/player") && userRole !== "Player") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}