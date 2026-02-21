"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translations, type Locale as LocaleType } from "@/lib/i18n-config";

interface I18nContextType {
  locale: LocaleType;
  t: (key: string) => string;
  changeLocale: (locale: LocaleType) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: LocaleType;
}

export function I18nProvider({
  children,
  initialLocale = "en",
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<LocaleType>(initialLocale);

  useEffect(() => {
    // 检查localStorage中的语言设置
    const savedLocale = localStorage.getItem("locale") as LocaleType;
    if (savedLocale && ["en", "zh"].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  const changeLocale = (newLocale: LocaleType) => {
    localStorage.setItem("locale", newLocale);
    setLocaleState(newLocale);
    window.location.pathname = `/${newLocale}${window.location.pathname.replace(/^\/[a-z]{2}/, "") || ""}`;
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
