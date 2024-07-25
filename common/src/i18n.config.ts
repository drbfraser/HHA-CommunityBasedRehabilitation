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
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        returnEmptyString: false,
        debug: true,            // TODO: Remove this line in production!
        compatibilityJSON: "v3",
    });

export default i18n;
