import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "./middleware/rate-limit";

/**
 * Root Middleware
 * Coordinates rate limiting, security headers, and future auth checks.
 */
export async function middleware(request: NextRequest) {
  // 1. Apply Rate Limiting
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Subdomain & Custom Domain Detection (White Label)
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  
  // Define main domain (env var or hardcoded default)
  const currentHost = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "flowboard.com";
  // Check if it's a custom domain or subdomain
  const isCustomDomain = hostname !== currentHost && hostname !== `www.${currentHost}` && !hostname.includes("localhost");
  
  const response = NextResponse.next();

  if (isCustomDomain) {
    // Extract subdomain (e.g. acme.flowboard.com -> acme)
    const subdomain = hostname.replace(`.${currentHost}`, "");
    response.headers.set("x-flowboard-hostname", hostname);
    response.headers.set("x-flowboard-subdomain", subdomain);
  }

  // 3. Apply Security Headers
  // response.headers.set("X-Frame-Options", "DENY"); // Disabled for custom domain iframe support if needed later
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pay.google.com; frame-src 'self' https://pay.google.com; connect-src 'self' https://google.com https://pay.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https:;"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
