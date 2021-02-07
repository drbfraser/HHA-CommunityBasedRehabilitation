import { Chip, ChipProps } from "@material-ui/core";

const RiskChip = (props: ChipProps) => {
    let backgroundColor: string;

    switch (props.label) {
        case "critical":
            backgroundColor = "black";
            break;
        case "high":
            backgroundColor = "crimson";
            break;
        case "medium":
            backgroundColor = "darkorange";
            break;
        case "low":
            backgroundColor = "gray";
            break;
        default:
            throw new Error("Invalid Chip Label");
    }

    return <Chip {...props} color={"primary"} style={{ backgroundColor: backgroundColor }} />;
};

export default RiskChip;
