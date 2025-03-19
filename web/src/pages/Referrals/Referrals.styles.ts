import { themeColors } from "@cbr/common/util/colors";
import styled from "@emotion/styled";
import { SxProps, Theme, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";

export const referralsStyles: Record<string, SxProps<Theme>> = {
    filterContainer: {
        display: "flex",
        gap: "1rem",
        marginBottom: 1,
    },

    statusFilter: {
        minWidth: "150px",
    },

    typeFilter: {
        flexGrow: 1,
    },

    tooltipText: {
        whiteSpace: "pre-line",
        fontSize: "large",
        padding: "8px",
    },

    hoverDetails: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "16px",
    },
};

export const RenderTextTypography = styled(Typography)({
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    width: "100%",
});

export const CompleteIcon = styled(CheckCircleIcon)({
    color: themeColors.riskGreen,
    verticalAlign: "text-top",
    marginLeft: "5px",
});

export const PendingIcon = styled(ScheduleIcon)({
    color: themeColors.riskRed,
    verticalAlign: "text-top",
    marginLeft: "5px",
});
