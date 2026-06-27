import { NextRequest, NextResponse } from "next/server";

import { cookieValues } from "./constants/data";
import { AuthRouteConfig } from "./constants/routes";

// Routes that require a signed-in customer.
const PROTECTED_PREFIXES = [
  AuthRouteConfig.ACCOUNT, // /c/account*
  AuthRouteConfig.CHECKOUT, // /checkout*
];

// Auth pages a signed-in customer shouldn't see.
const AUTH_ONLY_ROUTES = [
  AuthRouteConfig.LOGIN,
  AuthRouteConfig.SIGNUP,
  AuthRouteConfig.FORGOT_PASSWORD,
  AuthRouteConfig.RESET_PASSWORD,
  AuthRouteConfig.VERIFY_OTP,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(cookieValues.token)?.value;

  // Gate protected areas behind authentication.
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !token) {
    const url = new URL(AuthRouteConfig.LOGIN, request.url);
    return NextResponse.redirect(url);
  }

  // Send already-authenticated users away from the auth pages.
  if (AUTH_ONLY_ROUTES.includes(pathname) && token) {
    return NextResponse.redirect(new URL(AuthRouteConfig.ACCOUNT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/c/:path*", "/checkout/:path*"],
};
