import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from "@mui/material";

export const entryStyles: Record<string, SxProps<Theme>> = {
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
};
