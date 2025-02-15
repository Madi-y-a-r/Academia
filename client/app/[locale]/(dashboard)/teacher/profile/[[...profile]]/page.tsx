import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useLocale, useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import React from "react";

const UserProfilePage = () => {
  const locale = useLocale();
  const t = useTranslations('ProfilePage');
  const path = `/${locale}/teacher/profile`
  return (
    <div>
      <Header title={t('title')} subtitle={t('subtitle')} />
      <UserProfile
        path={path}
        routing="path"
        appearance={{
          baseTheme: dark,
          elements: {
            scrollBox: "bg-customgreys-darkGrey",
            navbar: {
              "& > div:nth-child(1)": {
                background: "none",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default UserProfilePage;