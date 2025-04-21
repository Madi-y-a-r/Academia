"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ArrowRight, Bell, BookOpen, ChevronRight, LayoutDashboardIcon } from "lucide-react";
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


const NonDashboardNavbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const t = useTranslations('NonDashboardNavbar');
  const { data: courses, isLoading, isError } = useGetPublishedCoursesQuery({});
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  if(!courses) return undefined

  const filteredSuggestions = courses.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
  const handleGoDashboard = () => {
    router.push(`/${locale}/${userRole}/courses`)
  }
  return (
    <nav className="w-full flex justify-center bg-customgreys-primarybg">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          <Link href="/" className="font-bold text-4xl sm:text-xl hover:text-customgreys-dirtyGrey" scroll={false}>
            Studyt
          </Link>
          <div className="flex items-center gap-4 w-[400px] ">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button className="hover:bg-customgreys-secondarybg">
                  <p className=" text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">{t("searchCourses")}</p>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0 shadow-lg rounded-lg border-none items-end">
                <Command className="text-white bg-customgreys-secondarybg border-none">
                  <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search for courses..."
                  />
                  <CommandList>
                    {filteredSuggestions.length === 0 ? (
                      <CommandItem>No results found.</CommandItem>
                    ) : (
                      filteredSuggestions.map((item, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => {
                            router.push(`/search?id=${item.courseId}`, {
                              scroll: false,
                            });
                          }}
                          className="py-3 flex justify-between"
                        >
                          {item.title}
                          <ChevronRight />
                        </CommandItem>
                      ))
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="nondashboard-navbar__actions">
        <LanguageSwitcher />
        <SignedIn>
          <Button onClick={handleGoDashboard} size="lg" className="font-bold bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md;">
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