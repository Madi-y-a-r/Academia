import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const Loading = () => {
  const t = useTranslations()
  return (
    <div className="loading">
      <Loader2 className="loading__spinner" />
      <span className="loading__text">{t("Loading")}</span>
    </div>
  );
};

export default Loading;