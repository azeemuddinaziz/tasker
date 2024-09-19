import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

declare module "next/server" {
  interface NextRequest {
    user?: {};
  }
}

type DecodedToken = {
  _id: string;
  username: string;
  email: string;
};

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("accessToken")?.value;
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      // User is logged in, redirect to dashboard
      return NextResponse.redirect(`${url.origin}/dashboard`);
    }
  } else if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/")
  ) {
    if (!token) {
      // User is not logged in, redirect to login page
      return NextResponse.redirect(`${url.origin}/login`);
    } else {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const response = NextResponse.next();
        response.headers.set("x-user-data", JSON.stringify(decodedToken));
        return response;
      } catch (error) {
        // Token is invalid, redirect to login page
        return NextResponse.redirect(`${url.origin}/login`);
      }
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/login",
    "/register",
    "/api/users/getTask",
    "/api/users/addTask",
    "/api/users/deleteTask",
    "/api/users/editTask",
    "/dashboard",
  ],
};
