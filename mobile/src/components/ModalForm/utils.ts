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
