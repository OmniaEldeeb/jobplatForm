import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/register-company",
  "/auth/forgot-password",
];

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/applications",
  "/saved-jobs",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isApplyPage = /^\/jobs\/\d+\/apply/.test(pathname);

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/jobs", req.url));
  }

  if (!token && (isProtected || isApplyPage)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};