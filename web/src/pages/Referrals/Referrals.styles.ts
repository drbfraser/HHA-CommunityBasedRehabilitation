import { themeColors } from "@cbr/common/util/colors";
import styled from "@emotion/styled";
import { SxProps, Theme } from "@mui/material";
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
};

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
