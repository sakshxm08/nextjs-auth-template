import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// export { auth as middleware } from "@/auth";

// middleware.ts
// import NextAuth from "next-auth";
// import { authConfig } from "@/auth";

// const { auth: middleware } = NextAuth(authConfig);

// export default middleware;

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const authRoutes = ["/signin", "/signup", "/verify", "forgot-password"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(path);
  // const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const session = await auth();

  let isUserSignedIn = session?.user?.email;
  if (session?.expires && new Date(session.expires) < new Date()) {
    isUserSignedIn = undefined;
  }

  if (isProtectedRoute && !isUserSignedIn) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isAuthRoute &&
    isUserSignedIn &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
  runtime: "nodejs",
  unstable_allowDynamic: [
    // allows a single file
    "/src/db/lib/dbConnect.js",
    // use a glob to allow anything in the function-bind 3rd party module
    "/node_modules/mongoose/dist/**",
  ],
};
