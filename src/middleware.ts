import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const publicPaths = ["/login", "/register"] satisfies string[];

export async function middleware(req: NextRequest) {
    const shouldSkipAuth = publicPaths.includes(req.nextUrl.pathname);

    if (shouldSkipAuth) return NextResponse.next();

    const authCookie = (await cookies()).get("authentication");

    if (!authCookie) return NextResponse.redirect(process.env.BASE_URL + "login");

    const isAuthCookieValid = authCookie.value == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    if (!isAuthCookieValid) return NextResponse.redirect(process.env.BASE_URL + "login");

}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};