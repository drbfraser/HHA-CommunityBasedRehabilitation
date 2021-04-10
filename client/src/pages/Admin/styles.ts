import { makeStyles } from "@material-ui/core/styles";
import { themeColors } from "theme.styles";

export const useStyles = makeStyles(
    {
        container: {
            paddingLeft: 20,
        },
        topContainer: {
            display: "flex",
        },
        floatRight: {
            float: "right",
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
