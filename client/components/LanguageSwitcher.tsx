"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;

    // Разбиваем путь на части, заменяем первый сегмент на новый язык
    const segments = pathname.split("/");
    segments[1] = newLocale;

    // Формируем новый URL и перенаправляем пользователя
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <select
      value={locale}
      onChange={changeLanguage}
      className="px-2 py-3 rounded-xl bg-customgreys-primarybg text-customgreys-dirtyGrey hover:text-white-50  transition-all duration-300 text-sm sm:text-base "
    >
      <option value="en">English</option>
      <option value="ru">Русский</option>
      <option value="kk">Қазақша</option>
    </select>
  );
};

export default LanguageSwitcher;
