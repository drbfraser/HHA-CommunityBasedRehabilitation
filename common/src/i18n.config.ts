import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import bari from "./locales/bari.json";

const resources = {
    en: {
        translation: en,
    },
    bari: {
        translation: bari,
    },
};

// This will only be called in /Common
export const initI18n = () => {
    console.log("===> COMMON: i18n.config.ts: Start");
    i18n.use(initReactI18next).init({
        debug: true, // TODO: Remove this line in production!
        compatibilityJSON: "v3",
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        returnEmptyString: false,
    });
    console.log("===> COMMON: i18n.config.ts: End");
};

// ensures that web, mobile, and common all reference the same instance of i18n
export const getI18nInstance = (): typeof i18n => {
    return i18n;
};
