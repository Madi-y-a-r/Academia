import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const isStudentRoute = createRouteMatcher(["/student/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware(async (auth, req) => {
  // Пропускаем обработку для `_next` и статических файлов
  if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.match(/\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/)) {
    return intlMiddleware(req);
  }

  const { sessionClaims } = await auth();
  const userRole =
    (sessionClaims?.publicMetadata as { userType: "student" | "teacher" })?.userType || "student";

  if (isStudentRoute(req)) {
    if (userRole !== "student") {
      const url = new URL("/teacher/courses", req.url);
      return NextResponse.redirect(url);
    }
  }

  if (isTeacherRoute(req)) {
    if (userRole !== "teacher") {
      const url = new URL("/student/courses", req.url);
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/",
    "/(ru|en)/:path*",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
