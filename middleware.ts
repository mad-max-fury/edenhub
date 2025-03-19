import { NextRequest, NextResponse } from "next/server";

import { cookieValues, Roles } from "./constants/data";
import {
  ADMIN_ROUTES,
  AUTHENTICATED_ROUTES,
  AuthRouteConfig,
  STAFF_ROUTES,
  UNAUTHENTICATED_ROUTES,
} from "./constants/routes";

async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (AUTHENTICATED_ROUTES.includes(pathname)) {
    const token = request.cookies.get(cookieValues.token);
    if (!token || !token.value) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  const userRole = request.cookies.get(cookieValues.userType);

  if (ADMIN_ROUTES.includes(pathname) && userRole!.value !== Roles.admin) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (STAFF_ROUTES.includes(pathname) && userRole!.value !== Roles.staff) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  return reRouteIftoken(request);
}

const reRouteIftoken = (request: NextRequest) => {
  const userRole = request.cookies.get(cookieValues.userType);
  const pathname = request.nextUrl.pathname;
  if (userRole && UNAUTHENTICATED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(
      new URL(AuthRouteConfig.ORGANIZATIONAL_SETUP_COMPANIES, request.url),
    );
  }
};

module.exports = { middleware };
