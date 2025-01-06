import {
    getRiskGoalsTranslationKey,
    getRiskRequirementsTranslationKey,
    IRisk,
    RiskGoalOptions,
    RiskRequirementOptions,
} from "@cbr/common";
import { TFunction } from "i18next";

const DELIMITER = ",\n";

export const generateFormValue = (fields: Array<[string, boolean]>, freeformText: string) => {
    const formValue = fields
        .filter(([_, checked]) => checked)
        .map(([fieldName, _]) => fieldName)
        .join(DELIMITER);

    if (freeformText) {
        return formValue ? formValue.concat(`,\n${freeformText}`) : freeformText;
    }
    return formValue;
};

/**
 * @param {string} rawText - Raw string passed in from the backend.
 *  Assumed to be in the English language.
 *
 * @returns what items have been checked and what the "other" text is.
 */
const parseInitialValues = (
    rawText: string,
    canonicalFields: string[]
): [checkedItems: string[], otherText: string] => {
    const items = rawText.split(DELIMITER);

    const checkedItems = items.filter((item) => canonicalFields.includes(item));
    const otherText = items.filter((item) => !canonicalFields.includes(item)).join("\n");
    return [checkedItems, otherText];
};

/**
 * @param {string} rawText - Raw string passed in from the backend.
 *  Assumed to be in the English language.
 */
export const initializeCheckedItems = (
    rawText: string,
    canonicalFields: string[],
    localizedFields: string[]
): { [key: string]: boolean } => {
    const [canonicalCheckedItems, _] = parseInitialValues(rawText, canonicalFields);

    const localizedCheckedItems = localizedFields.reduce(
        (acc, label, index) => ({
            ...acc,
            // we can use `index` because canonicalFields & localizedFields have a
            // 1-1 relation as an invariant
            [label]: canonicalCheckedItems.includes(canonicalFields[index]),
        }),
        {}
    );
    return localizedCheckedItems;
};

export const initializeFreeformText = (defaultValue: string, canonicalFields: string[]): string => {
    const [_, otherText] = parseInitialValues(defaultValue, canonicalFields);
    return otherText;
};

const getModalFormDisplay = (
    t: TFunction,
    translationFieldsKey: RiskRequirementOptions | RiskGoalOptions,
    rawText: string
) => {
    const translatedItems = Object.entries(
        initializeCheckedItems(
            rawText,
            // todo: this method of converting from JSON object to string[] could be cleaner
            Object.values(t(translationFieldsKey, { returnObjects: true, lng: "en" })), 
            Object.values(t(translationFieldsKey, { returnObjects: true }))
        )
    );
    const otherText = initializeFreeformText(
        rawText,
        // todo: this method of converting from JSON object to string[] could be cleaner
        Object.values(t(translationFieldsKey, { returnObjects: true, lng: "en" }))
    );
    return generateFormValue(translatedItems, otherText);
};

/**
 * @Returns what a Modal Form component would display as its value to the user
 *  for risk **requirements**.
 *
 *  E.g., health requirements, social requirements, etc..
 */
export const getModalFormRequirementsDisplay = (t: TFunction, risk: IRisk): string => {
    const translatedRequirementsKey = getRiskRequirementsTranslationKey(risk.risk_type);
    if (translatedRequirementsKey == "general.unknown") return "";

    return getModalFormDisplay(t, translatedRequirementsKey, risk.requirement);
};

/**
 * @Returns what a Modal Form component would display as its value to the user
 *  for risk **goals**.
 *
 *  E.g., health goals, social goals, etc..
 */
export const getModalFormGoalsDisplay = (t: TFunction, risk: IRisk): string => {
    const translatedGoalsKey = getRiskGoalsTranslationKey(risk.risk_type);
    if (translatedGoalsKey == "general.unknown") return "";

    return getModalFormDisplay(t, translatedGoalsKey, risk.goal);
};
