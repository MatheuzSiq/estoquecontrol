// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  console.log("MIDDLEWARE RODANDO");

  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Rotas públicas
  if (pathname === "/login" /*|| pathname === "/register"*/) {
    if (token) {
      return NextResponse.redirect(new URL("/estoque", req.url));
    }
    return NextResponse.next();
  }

  // Protege todas as outras rotas
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
