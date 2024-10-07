import makeStyles from '@mui/styles/makeStyles';
import { themeColors } from "@cbr/common/util/colors";

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
        completeIcon: {
            color: themeColors.riskGreen,
            verticalAlign: "text-top",
        },
        pendingIcon: {
            color: themeColors.riskRed,
            verticalAlign: "text-top",
        },
        resolveAccordion: {
            display: "block",
            textAlign: "right",
        },
        resolveBtn: {
            color: themeColors.riskGreen,
        },
    },
    { index: 1 }
);
