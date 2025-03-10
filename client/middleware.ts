import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const isStudentRoute = createRouteMatcher(["/:locale/(student)/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/:locale/(teacher)/(.*)"]);
const isAdminRoute = createRouteMatcher(["/:locale/(admin)/(.*)"]);



const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware(async (auth, req) => {

  // Пропускаем обработку для `_next` и статических файлов
  // if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.match(/\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/)) {
  //   return intlMiddleware(req);
  // }

  const { sessionClaims } = await auth();
  const publicMetadata = sessionClaims?.publicMetadata as { userType?: "student" | "teacher" |"admin" } | undefined;
  const userRole = publicMetadata?.userType || "student";
  if (isStudentRoute(req) && userRole !== "student") {
    return NextResponse.redirect(new URL("/teacher/courses", req.url));
  }

  if (isTeacherRoute(req) && userRole !== "teacher") {
    return NextResponse.redirect(new URL("/student/courses", req.url));
  }

  if (isAdminRoute(req) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/student/courses", req.url));
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
