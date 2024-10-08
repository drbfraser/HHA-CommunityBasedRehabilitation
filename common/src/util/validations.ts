import { getDisabilities, getOtherDisabilityId } from "./hooks/disabilities";
import i18n from "i18next";

// https://regexlib.com/Search.aspx?k=email&c=-1&m=5&ps=20
export const Validation = {
    usernameRegExp: /^[\w.@+-]+$/,
    usernameInvalidMsg: i18n.t("validation.userNameInvalid"),
    phoneRegExp: /([0-9\s\-?]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
    emailRegExp:
        /^([a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,7})$/,
    passwordRegExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    passwordInvalidMsg: i18n.t("validation.passwordStrength"),
    otherDisabilitySelected: async (disabilities: number[]) =>
        disabilities.includes(getOtherDisabilityId(await getDisabilities())),
};

// On language change, recompute arrays of labels
const refreshMessages = () => {
    Validation.usernameInvalidMsg = i18n.t("validation.userNameInvalid");
    Validation.passwordInvalidMsg = i18n.t("validation.passwordStrength");
};
i18n.on("languageChanged", () => {
    refreshMessages();
});
