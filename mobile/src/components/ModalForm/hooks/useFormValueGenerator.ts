import { useEffect, useState } from "react";
import { generateFormValue } from "../utils";

const useFormValueGenerator = (
    checkedItems: { [key: string]: boolean },
    freeformText: string,
    canonicalFields: string[]
) => {
    const [canonicalFormValue, setCanonicalFormValue] = useState("");
    const [displayedFormValue, setDisplayText] = useState("");

    useEffect(() => {
        const fieldsInEnglish: Array<[string, boolean]> = Object.values(checkedItems).map(
            (isChecked, i) => [canonicalFields[i], isChecked]
        );
        const translatedFields = Object.entries(checkedItems);

        setCanonicalFormValue(generateFormValue(fieldsInEnglish, freeformText));
        setDisplayText(generateFormValue(translatedFields, freeformText));
    }, [checkedItems, freeformText]);

    return [canonicalFormValue, displayedFormValue];
};

export default useFormValueGenerator;
