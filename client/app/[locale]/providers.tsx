"use client";

import StoreProvider from "@/state/redux";
import React from "react";
import { NextIntlClientProvider } from "next-intl";

const Providers = ({
  children,
  messages,
  locale
}: {
  children: React.ReactNode;
  messages: any;
  locale: string;
}) => {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <StoreProvider>{children}</StoreProvider>
    </NextIntlClientProvider>
  );
};

export default Providers;
