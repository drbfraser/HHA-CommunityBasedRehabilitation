import { themeColors } from "@cbr/common/util/colors";
import { AccordionDetails, DialogContent, styled, SxProps, Theme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";

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
};

export const ReferralDialogContent = styled(DialogContent)({
    display: "flex",
    flexDirection: "column",
    gap: "1em",
});

export const ReferralSummaryContainer = styled("div")({
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
});

export const ResolveAccordion = styled(AccordionDetails)({
    display: "block",
    textAlign: "right",
});

export const CompleteIcon = styled(CheckCircleIcon)({
    color: themeColors.riskGreen,
    verticalAlign: "text-top",
    marginRight: "5px",
});

export const PendingIcon = styled(ScheduleIcon)({
    color: themeColors.riskRed,
    verticalAlign: "text-top",
    marginRight: "5px",
});
