import { makeStyles } from "@material-ui/core/styles";
import { themeColors } from "theme.styles";

export const useStyles = makeStyles(
    {
        impOutcomeAccordion: {
            "&.MuiAccordion-root": {
                backgroundColor: themeColors.blueBgLight,
            },
            "& .MuiAccordionDetails-root": {
                display: "block",
            },
            "& .MuiCardContent-root": {
                padding: "8px 16px",
            },
        },
    },
    { index: 1 }
);
