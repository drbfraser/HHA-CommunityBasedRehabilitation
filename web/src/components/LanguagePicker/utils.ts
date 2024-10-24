export enum Language {
    EN = "en",
    BARI = "bari",
}

export const LANGUAGE_KEY = "lang";
const DEAFULT_LANGUAGE = Language.EN;

export const getLanguageFromLocalStorage = (): Language => {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage === null || !Object.values(Language).includes(savedLanguage as Language)) {
        console.error(
            savedLanguage === null
                ? "No language was saved in localStorage"
                : `Unknown language fetched from local storage: ${savedLanguage}`
        );
        return DEAFULT_LANGUAGE;
    }

    return savedLanguage as Language;
};
