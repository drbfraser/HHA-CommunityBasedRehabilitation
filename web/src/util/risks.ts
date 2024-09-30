import { RiskType } from "@cbr/common/util/risks";
import {
    LocalHospital,
    RecordVoiceOver,
    School,
    SvgIconComponent,
    Restaurant,
    Favorite,
} from "@material-ui/icons";
import { TFunction } from "i18next";

export interface IRiskType {
    name: string;
    Icon: SvgIconComponent;
}

export const riskTypes: { [key: string]: IRiskType } = {
    [RiskType.HEALTH]: {
        name: "Health",
        Icon: LocalHospital,
    },
    [RiskType.EDUCATION]: {
        name: "Education",
        Icon: School,
    },
    [RiskType.SOCIAL]: {
        name: "Social",
        Icon: RecordVoiceOver,
    },
    [RiskType.NUTRITION]: {
        name: "Nutrition",
        Icon: Restaurant,
    },
    [RiskType.MENTAL]: {
        name: "Mental",
        Icon: Favorite,
    },
};

export const getTranslatedRiskName = (t: TFunction, riskType: RiskType) => {
    switch (riskType) {
        case RiskType.HEALTH:
            return t("risks.health");
        case RiskType.EDUCATION:
            return t("risks.education");
        case RiskType.SOCIAL:
            return t("risks.social");
        case RiskType.NUTRITION:
            return t("risks.nutrition");
        case RiskType.MENTAL:
            return t("risks.mental");
        default:
            console.error("Unknown risk type.");
            return "";
    }
};

export const getTranslatedRiskChartName = (t: TFunction, riskType: RiskType) => {
    switch (riskType) {
        case RiskType.HEALTH:
            return t("clientFields.healthRisk");
        case RiskType.EDUCATION:
            return t("clientFields.educationRisk");
        case RiskType.SOCIAL:
            return t("clientFields.socialRisk");
        case RiskType.NUTRITION:
            return t("clientFields.nutritionRisk");
        case RiskType.MENTAL:
            return t("clientFields.mentalRisk");
        default:
            console.error("Unknown risk type.");
            return "";
    }
};
