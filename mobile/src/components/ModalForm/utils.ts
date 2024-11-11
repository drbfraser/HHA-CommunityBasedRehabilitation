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

export const parseInitialValues = (
    rawText: string,
    canonicalFields: string[]
): [checkedItems: string[], otherText: string] => {
    const items = rawText.split("\n");

    const checkedItems = items.filter((item) => canonicalFields.includes(item));
    const otherText = items.filter((item) => !canonicalFields.includes(item)).join("\n");
    return [checkedItems, otherText];
};
