import { RiskType } from "@cbr/common/util/risks";
import { TFunction } from "i18next";

export const translateRiskEntrySummary = (t: TFunction, riskType: RiskType, isInitial: boolean) => {
    const setOrChanged = isInitial ? "Set" : "Changed";

    switch (riskType) {
        case RiskType.HEALTH:
            return t(`risks.health${setOrChanged}`);
        case RiskType.EDUCATION:
            return t(`risks.education${setOrChanged}`);
        case RiskType.MENTAL:
            return t(`risks.mental${setOrChanged}`);
        case RiskType.NUTRITION:
            return t(`risks.nutrition${setOrChanged}`);
        case RiskType.SOCIAL:
            return t(`risks.social${setOrChanged}`);
    }
};
