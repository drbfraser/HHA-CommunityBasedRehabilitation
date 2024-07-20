import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ne from "./locales/bari.json";
const resources = {
    en: {
        translation: en,
    },
    ne: {
        translation: ne,
    },
};

i18n
    .use(initReactI18next)
    .init({
        debug: true,            // TODO: Remove this line in production!
        compatibilityJSON: "v3",
        resources,
        //language to use if translations in user language are not available
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
