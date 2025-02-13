import SharedNotificationSettings from "@/components/SharedNotificationSettings";
import { useTranslations } from "next-intl";
import React from "react";

const UserSettings = () => {
  const t = useTranslations("StudentSettingsPage")
  return (
    <div className="w-3/5">
      <SharedNotificationSettings
        title={t("title")}
        subtitle={t("subtitle")}
      />
    </div>
  );
};

export default UserSettings;