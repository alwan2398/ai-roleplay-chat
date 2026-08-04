import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for Better Auth session cookie (supports both standard dev HTTP and secure prod HTTPS cookies)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/?showLogin=true", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/explore", "/create"],
};
