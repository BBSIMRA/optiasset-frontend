import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  // Public route
  if (pathname === "/") {
    return NextResponse.next();
  }

  // No login
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // HR only routes
  const hrRoutes = [
    "/dashboard",
    "/employees",
    "/departments",
    "/assets",
    "/assignments",
    "/maintenance"
  ];

  if (hrRoutes.includes(pathname) && role !== "HR") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Employee only routes
  const employeeRoutes = [
    "/my-assets",
    "/profile"
  ];

  if (employeeRoutes.includes(pathname) && role !== "EMPLOYEE") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/employees",
    "/departments",
    "/assets",
    "/assignments",
    "/maintenance",
    "/my-assets",
    "/profile"
  ]
};