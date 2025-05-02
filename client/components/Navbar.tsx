"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
import { useGetPublishedCoursesQuery } from "@/state/api";
import ChangeRoleButton from "./ChangeRoleButton";

const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
  const router = useRouter();
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const { data: courses, isLoading, isError } = useGetPublishedCoursesQuery({});
  const t = useTranslations("Navbar")
  const locale = useLocale();
  const handleGoHome = () => {
    router.push(`/${locale}/`)
  }
  if(!courses) return undefined
  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">
        <div className="dashboard-navbar__search">
          <div className="md:hidden">
            <SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
          </div>

          <div className="flex items-center gap-4 w-[400px]">
              <SearchInput
                className="md:w-[50%] sm:w-[30%] bg-customgreys-primarybg rounded-md" 
                suggestions={courses} 
              />
          </div>
        </div>

        <div className="dashboard-navbar__actions">
          <Button onClick={handleGoHome} size="lg" className=" font-bold bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-md;">
              <p>{t("Home")}</p>
              <LayoutDashboardIcon />
          </Button>
          <LanguageSwitcher />
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>
          <div className="flex flex-col items-center">
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
            <p>{userRole}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;