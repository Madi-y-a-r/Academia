"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ArrowRight, Bell, BookOpen, ChevronRight, LayoutDashboardIcon, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { useGetPublishedCoursesQuery } from "@/state/api";
import SearchInput from "./SearchInput";


const NonDashboardNavbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const t = useTranslations('NonDashboardNavbar');
  const { data: courses, isLoading, isError } = useGetPublishedCoursesQuery({});
  const locale = useLocale();
  if(!courses) return undefined


  const handleGoDashboard = () => {
    router.push(`/${locale}/${userRole}/courses`)
  }
  
  return (
    <nav className="w-full flex justify-center bg-customgreys-primarybg">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          <Link href="/" className="font-bold text-3xl  hover:text-customgreys-dirtyGrey" scroll={false}>
            Studyt
          </Link>
          <div className="flex items-center gap-4 w-[400px]">
            <SearchInput
              className="md:w-[50%] sm:w-[30%] bg-customgreys-secondarybg rounded-md" 
              suggestions={courses} 
            />
          </div>
        </div>
        <div className="nondashboard-navbar__actions">
        <LanguageSwitcher />
        <SignedIn>
          <Button onClick={handleGoDashboard} size="lg" className="font-bold bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-md;">
              <p>{t("Dashboard")}</p>
              <LayoutDashboardIcon />
          </Button>
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