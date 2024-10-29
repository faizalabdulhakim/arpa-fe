import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/",
  "/dashboard",
  "/user",
  "/user/*",
  "/product",
  "/product/*",
  "/order",
  "/order/*",
  "/category",
  "/category/*",
];
const publicRoutes = ["/login"];
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const token = (await cookies()).get("session")?.value;
  let isAuthenticated = false;
  if (token) {
    const response = await fetch(`${apiURL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    isAuthenticated = response.ok;
  }

  console.log("isAuthenticated", isAuthenticated);
  console.log("isProtectedRoute", isProtectedRoute);
  console.log("isPublicRoute", isPublicRoute);

  // 4. Redirect to /login if the user is not authenticated
  // if (isProtectedRoute && !isAuthenticated) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  // 5. Redirect to /dashboard if the user is authenticated
  // if (isPublicRoute && isAuthenticated) {
  //   // redirect to before login route
  //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  // }

  // return NextResponse.next();
}

// Routes Middleware should not run on
