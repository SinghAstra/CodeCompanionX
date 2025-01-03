// middleware.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Authentication required paths
const authRequiredPaths = ["/dashboard", "/settings", "/profile"];
// Authentication pages (sign in, sign up, etc)
const authPages = ["/auth/sign-in", "/auth/sign-up"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log("token is ", token);
  const { pathname } = request.nextUrl;

  // Check if the path is one that requires authentication
  const isAuthRequired = authRequiredPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Check if the current path is an auth page
  const isAuthPage = authPages.some((path) => pathname.startsWith(path));

  // If the path requires authentication and user isn't logged in
  if (isAuthRequired && !token) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is logged in and trying to access auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For all other paths that don't match our known routes
  if (!isAuthRequired && !isAuthPage && pathname !== "/") {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|404).*)",
  ],
};