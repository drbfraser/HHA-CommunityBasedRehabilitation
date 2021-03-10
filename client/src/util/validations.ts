// https://regexlib.com/Search.aspx?k=email&c=-1&m=5&ps=20
export const Validation = {
    phoneRegExp: /([0-9\s\-?]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
    emailRegExp: /^([a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,7})$/,
};
