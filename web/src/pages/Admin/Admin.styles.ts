import { themeColors } from "@cbr/common/util/colors";
import { Box, styled, SxProps, Theme } from "@mui/material";
import { Form } from "formik";

export const adminStyles: Record<string, SxProps<Theme>> = {
    container: {
        paddingLeft: "20px",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    editButton: {
        marginBottom: "20px",
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
        marginRight: "8px",
    },
};

export const Container = styled(Box)({
    padding: "1rem",
});

export const StyledForm = styled(Form)({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
});
