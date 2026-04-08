/**
 * useTranslation Hook
 * Loads and provides translation functions based on current language
 * Supports dot-notation keys and fallback values
 */

import { useLanguage } from "@/context/LanguageContext";
import { useCallback } from "react";

export const useTranslation = () => {
  const { currentLanguage, translations, isLoading } = useLanguage();

  const t = useCallback(
    (key, options = {}) => {
      const { returnObjects = false, fallback } = options;
      const fallbackValue = fallback !== undefined ? fallback : key;

      if (!key || typeof key !== "string") {
        return fallbackValue;
      }

      const keys = key.split(".");
      let value = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return fallbackValue;
        }
      }

      if (typeof value !== "string") {
        return value !== undefined ? value : fallbackValue;
      }

      // Handle simple parameter substitution
      let result = value;
      Object.entries(options).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{${k}}`, "g"), v);
      });

      return result;
    },
    [translations],
  );

  return {
    t,
    currentLanguage,
    isLoading,
  };
};
