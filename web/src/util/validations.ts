import { getDisabilities, getOtherDisabilityId } from "./hooks/disabilities";

// https://regexlib.com/Search.aspx?k=email&c=-1&m=5&ps=20
export const Validation = {
    phoneRegExp: /([0-9\s\-?]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
    emailRegExp:
        /^([a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,7})$/,
    passwordRegExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    passwordInvalidMsg:
        "Your password must be at least 8 characters long and must contain at least: one lowercase letter, one uppercase letter and one number.",
    otherDisabilitySelected: async (disabilities: number[]) =>
        disabilities.includes(getOtherDisabilityId(await getDisabilities())),
};
