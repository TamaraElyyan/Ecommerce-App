import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { defaultLanguage, messages, supportedLanguages } from "../i18n/translations";

const STORAGE_KEY = "book-bazaar-lang";

const LanguageContext = createContext(null);

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && supportedLanguages.includes(stored)) return stored;
    } catch {
      /* ignore */
    }
    return defaultLanguage;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (supportedLanguages.includes(lang)) setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key) => {
      const value = getNested(messages[language], key);
      if (typeof value === "string" && value.length) return value;
      const fallback = getNested(messages.en, key);
      if (typeof fallback === "string" && fallback.length) return fallback;
      return key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, isRTL: language === "ar" }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};
