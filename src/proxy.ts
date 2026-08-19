// Lightweight HTTP Basic Auth gate for the internal demo/admin pages. Off
// by default (matches this repo's existing zero-config-required pattern
// for Calendly/Web3Forms) — set both ADMIN_USER and ADMIN_PASSWORD to
// actually lock these routes down. /internal/admin now performs real
// mutations (lead conversion, reward redemption), which is why this exists
// even though /internal/demo alone was fine unauthenticated as a read-only
// view.
//
// Named "proxy" (not "middleware") per this Next.js version's renamed file
// convention — see node_modules/next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/proxy.md.
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/internal/:path*", "/api/admin/:path*"],
};

export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  if (authHeader === expected) return NextResponse.next();

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Internal"' },
  });
}
