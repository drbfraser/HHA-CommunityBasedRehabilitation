import { themeColors } from "@cbr/common/util/colors";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
    {
        container: {
            paddingLeft: 20,
        },
        header: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
        },
        editButton: {
            marginBottom: 20,
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
            marginRight: 8,
        },
    },
    { index: 1 }
);
