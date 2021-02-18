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
            backgroundColor: themeColors.red,
        },
        activebtn: {
            backgroundColor: themeColors.green,
        },
        btn: {
            marginRight: 8,
        },
    },
    { index: 1 }
);
