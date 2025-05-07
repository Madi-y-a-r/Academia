import ChangeRoleButton from "@/components/ChangeRoleButton";
import Header from "@/components/Header";
import TeacherBioEditor from "@/components/TeacherBioEditor";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

const UserProfilePage = () => {
  const locale = useLocale();
  const t = useTranslations('ProfilePage');
  const path = `/${locale}/teacher/profile`
  return (
    <div>
      <div className="flex justify-between items-center">
        <Header title={t("title")} subtitle={t("subtitle")} />
        <ChangeRoleButton />
      </div>
      
      {/* Teacher Bio Editor */}
      <TeacherBioEditor />
      
      {/* Clerk User Profile */}
      <div className="mt-6">
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
    </div>
  );
};

export default UserProfilePage;