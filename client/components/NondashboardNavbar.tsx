"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const NonDashboardNavbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const t = useTranslations('NonDashboardNavbar');
  const locale = useLocale();

  const handleGoDashboard = () => {
    router.push(`/${locale}/${userRole}/courses`)
  }
  return (
    <nav className="nondashboard-navbar">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          <Link href="/" className="nondashboard-navbar__brand" scroll={false}>
            AYANA
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link
                href="/search"
                className="nondashboard-navbar__search-input"
                scroll={false}
              >
                <span className="hidden sm:inline">{t("searchCourses")}</span>
                <span className="sm:hidden">{t("search")}</span>
              </Link>
              <BookOpen
                className="nondashboard-navbar__search-icon"
                size={18}
              />
            </div>
          </div>
        </div>
        <div className="nondashboard-navbar__actions">
        <SignedIn>
          <Button onClick={handleGoDashboard} size="lg" className="font-bold bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md;">
              <p>Dashboard</p>
              <LayoutDashboardIcon />
          </Button>
          <LanguageSwitcher />
        </SignedIn>
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>

          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                  userButtonBox: "scale-90 sm:scale-100",
                },
              }}
              showName={true}
              userProfileMode="navigation"
              userProfileUrl={
                userRole === "teacher" ? "/teacher/profile" : "/student/profile"
              }
            />
          </SignedIn>
          <SignedOut>
            <Link
              href="/signin"
              className="nondashboard-navbar__auth-button--login"
              scroll={false}
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              className="nondashboard-navbar__auth-button--signup"
              scroll={false}
            >
              {t("signUp")}
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default NonDashboardNavbar;