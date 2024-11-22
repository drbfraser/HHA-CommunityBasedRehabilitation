import { styled, SxProps, Theme } from "@mui/material";

export const adminStyles: Record<string, SxProps<Theme>> = {
    fieldIndent: {
        paddingLeft: "9px",
    },
    hipWidth: {
        maxWidth: "160px",
    },
    inches: {
        verticalAlign: "sub",
    },
};

export const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "0.75em",
});

export const FieldIndent = styled("div")({
    paddingLeft: "9px",
});

export const FieldDoubleIndent = styled("div")({
    paddingLeft: "18px",
});
