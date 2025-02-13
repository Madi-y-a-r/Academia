import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const t = useTranslations("Footer");

  const footerLinks = [
    { key: "about", href: "/about" },
    { key: "privacyPolicy", href: "/privacy-policy" },
    { key: "licensing", href: "/licensing" },
    { key: "contact", href: "/contact" },
  ];


  return (
    <div className="footer">
      <p>&copy; 2025 AYANA. {t("allRightsReserved")}</p>
      <div className="footer__links">
      {footerLinks.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="footer__link"
            scroll={false}
          >
            {t(item.key)} {/* Переводим ключ */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;