import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Language = "en" | "hi";
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; text: (en: string, hi: string) => string };
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => { const saved = window.localStorage.getItem("portal-language"); if (saved === "hi") { setLanguage("hi"); document.documentElement.lang = "hi"; } }, []);
  const changeLanguage = (next: Language) => { setLanguage(next); window.localStorage.setItem("portal-language", next); document.documentElement.lang = next; };
  const value = useMemo(() => ({ language, setLanguage: changeLanguage, text: (en: string, hi: string) => language === "hi" ? hi : en }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
