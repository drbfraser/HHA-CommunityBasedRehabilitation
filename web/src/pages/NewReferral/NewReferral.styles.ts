import { styled, SxProps, Theme } from "@mui/material";

export const newReferralStyles: Record<string, SxProps<Theme>> = {
    hipWidth: {
        maxWidth: "160px",
    },
    inches: {
        verticalAlign: "sub",
    },
};

export const FieldIndent = styled("div")({
    paddingLeft: "9px",
});
