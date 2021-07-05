import { RiskType } from "@cbr/common/util/risks";
import { LocalHospital, RecordVoiceOver, School, SvgIconComponent } from "@material-ui/icons";
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
};
