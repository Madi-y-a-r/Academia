"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const CompletionPage = () => {
  const t = useTranslations("Payment")
  return (
    <div className="completion">
      <div className="completion__content">
        <div className="completion__icon">
          <Check className="w-16 h-16" />
        </div>
        <h1 className="completion__title">{t("CONGRATULATIONS")}</h1>
        <p className="completion__message">
          🎉 {t("competionMessage")} 🎉
        </p>
      </div>
      <div className="completion__support">
        <p>
          {t("Help")}{" "}
          <Button variant="link" asChild className="p-0 m-0 text-primary-700">
            <a href="mailto:madiyar.galymbek@gamil.com">{t("customer support")}</a>
          </Button>
          .
        </p>
      </div>
      <div className="completion__action">
        <Link href="student/courses" className="font-bold" scroll={false}>
          {t("Go to Courses")}
        </Link>
      </div>
    </div>
  );
};

export default CompletionPage;