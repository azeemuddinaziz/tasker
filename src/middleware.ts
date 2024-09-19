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
  if (!token) {
    return NextResponse.redirect("/login");
  }

  const decodedToken: DecodedToken = jwtDecode(token);

  const response = NextResponse.next();
  response.headers.set("x-user-data", JSON.stringify(decodedToken));
  return response;
};

export const config = {
  matcher: [
    "/api/users/getTask",
    "/api/users/addTask",
    "/api/users/deleteTask",
    "/api/users/editTask",
  ],
};
