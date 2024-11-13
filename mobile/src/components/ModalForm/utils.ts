export const generateFormValue = (fields: Array<[string, boolean]>, freeformText: string) => {
    const formValue = fields
        .filter(([_, checked]) => checked)
        .map(([canonicalField, _]) => canonicalField)
        .join(",\n");

    if (freeformText) {
        return formValue ? formValue.concat(`,\n${freeformText}`) : freeformText;
    }
    return formValue;
};

const parseInitialValues = (
    rawText: string,
    canonicalFields: string[]
): [checkedItems: string[], otherText: string] => {
    const items = rawText.split(",\n");

    console.log(items);

    const checkedItems = items.filter((item) => canonicalFields.includes(item));
    const otherText = items.filter((item) => !canonicalFields.includes(item)).join("\n");
    return [checkedItems, otherText];
};

export const initializeCheckedItems = (
    rawText: string,
    canonicalFields: string[],
    localizedFields: string[]
): { [key: string]: boolean } => {
    const [precheckedItems, _] = parseInitialValues(rawText, canonicalFields);
    console.log("prechecked:", precheckedItems);
    console.log("canonical:", canonicalFields);
    console.log("localized:", localizedFields);

    const res = localizedFields.reduce(
        (acc, label, index) => ({
            ...acc,
            [label]: precheckedItems.includes(canonicalFields[index]),
        }),
        {}
    );

    console.log("res:", res);

    return res;
};

export const initializeFreeformText = (defaultValue: string, canonicalFields: string[]): string => {
    const [_, otherText] = parseInitialValues(defaultValue, canonicalFields);
    return otherText;
};
