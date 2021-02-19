import { makeStyles } from "@material-ui/core/styles";
import { themeColors } from "theme.styles";

export const useStyles = makeStyles(
    {
        container: {
            padding: 30,
        },
        floatRight: {
            float: "right",
        },
        disablebtn: {
            backgroundColor: themeColors.riskRed,
        },
        activebtn: {
            backgroundColor: themeColors.riskGreen,
        },
        btn: {
            marginRight: 8,
        },
    },
    { index: 1 }
);
