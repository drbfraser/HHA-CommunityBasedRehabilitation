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
        const fieldsInEnglish: Array<[string, boolean]> = Object.entries(checkedItems).map(
            ([_, checked], i) => [canonicalFields[i], checked]
        );
        const translatedFields = Object.entries(checkedItems);

        setCanonicalFormValue(generateFormValue(fieldsInEnglish, freeformText));
        setDisplayText(generateFormValue(translatedFields, freeformText));
    }, [checkedItems, freeformText]);

    return [canonicalFormValue, displayedFormValue];
};

export default useFormValueGenerator;
