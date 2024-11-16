import { IRisk, RiskType } from "@cbr/common";
import { TFunction } from "i18next";

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

/**
 * @returns what items have been checked and what the "other" text is,
 * based on the raw string passed in from the backend
 */
const parseInitialValues = (
    rawText: string,
    canonicalFields: string[]
): [checkedItems: string[], otherText: string] => {
    const items = rawText.split(",\n");

    const checkedItems = items.filter((item) => canonicalFields.includes(item));
    const otherText = items.filter((item) => !canonicalFields.includes(item)).join("\n");
    return [checkedItems, otherText];
};

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

const getModalFormDisplay = (t: TFunction, translationFieldsKey: any, rawText: string) => {
    const translatedItems = Object.entries(
        initializeCheckedItems(
            rawText,
            t(translationFieldsKey, { returnObjects: true, lng: "en" }),
            t(translationFieldsKey, { returnObjects: true })
        )
    );
    const otherText = initializeFreeformText(
        rawText,
        t(translationFieldsKey, { returnObjects: true, lng: "en" })
    );
    return generateFormValue(translatedItems, otherText);
};

/**
 * @Returns what a Modal Form component would display as its value to the user
 * if it is for requirements. E.g., health requirements, social requirements, etc..
 */
export const getModalFormRequirementsDisplay = (t: TFunction, risk: IRisk): string => {
    // can consider extracting this mapping of translated arrays outside of this module
    // so that other code that use the modal form component can use this
    let translatedRequirementsKey;
    switch (risk.risk_type) {
        case RiskType.SOCIAL:
            translatedRequirementsKey = "newVisit.socialRequirements";
            break;
        case RiskType.HEALTH:
            translatedRequirementsKey = "newVisit.healthRequirements";
            break;
        case RiskType.MENTAL:
            translatedRequirementsKey = "newVisit.healthRequirements";
            break;
        case RiskType.NUTRITION:
            translatedRequirementsKey = "newVisit.healthRequirements";
            break;
        case RiskType.EDUCATION:
            translatedRequirementsKey = "newVisit.healthRequirements";
            break;
    }

    return getModalFormDisplay(t, translatedRequirementsKey, risk.requirement);
};

/**
 * @Returns what a Modal Form component would display as its value to the user
 * if it is for goals. E.g., health goals, social goals, etc..
 */
export const getModalFormGoalsDisplay = (t: TFunction, risk: IRisk): string => {
    // can consider extracting this mapping of translated arrays outside of this module
    // so that other code that use the modal form component can use this
    let translatedGoalsKey;
    switch (risk.risk_type) {
        case RiskType.SOCIAL:
            translatedGoalsKey = "newVisit.socialGoals";
            break;
        case RiskType.HEALTH:
            translatedGoalsKey = "newVisit.healthGoals";
            break;
        case RiskType.MENTAL:
            translatedGoalsKey = "newVisit.healthGoals";
            break;
        case RiskType.NUTRITION:
            translatedGoalsKey = "newVisit.healthGoals";
            break;
        case RiskType.EDUCATION:
            translatedGoalsKey = "newVisit.healthGoals";
            break;
    }

    return getModalFormDisplay(t, translatedGoalsKey, risk.goal);
};
