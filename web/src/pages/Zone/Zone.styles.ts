import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from "@mui/material";

export const zoneStyles: Record<string, SxProps<Theme>> = {
    container: {
        paddingLeft: "20px",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    editButton: {
        marginBottom: "20px",
    },
    disableBtn: {
        backgroundColor: themeColors.riskRed,
        color: "white",
    },
    activeBtn: {
        backgroundColor: themeColors.riskGreen,
        color: "white",
    },
    btn: {
        marginRight: "8px",
    },
};
