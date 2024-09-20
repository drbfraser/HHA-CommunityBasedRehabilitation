import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import bari from "./locales/bari.json";

console.log("===> i18n.config.ts: Start");
const resources = {
    en: {
        translation: en,
    },
    bari: {
        translation: bari,
    },
};

i18n.use(initReactI18next).init({
    debug: true, // TODO: Remove this line in production!
    compatibilityJSON: "v3",
    resources,
    //language to use if translations in user language are not available
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
    returnEmptyString: false,
});

export default i18n;
console.log("===> i18n.config.ts: End");
