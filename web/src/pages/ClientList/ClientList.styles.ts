import { SxProps, Theme } from "@mui/material";
import { mediaCompressedDataGrid } from "styles/DataGrid.styles";
import { mediaMobile } from "theme.styles";

export const clientListStyles: Record<string, SxProps<Theme>> = {
    root: {
        height: "calc(100vh - 175px)",
        minHeight: "400px",
        padding: "5px 0px 25px 0px",
        // mobile width
        [mediaMobile]: {
            height: "calc(100vh - 181px)",
            paddingBottom: "31px",
        },
        // The width where the DataGrid gets too tight
        [mediaCompressedDataGrid]: {
            paddingBottom: "71px",
        },
    },
    switch: {
        position: "absolute",
        float: "left",
        display: "inline-block",
        [mediaCompressedDataGrid]: {
            display: "block",
            float: "none",
            textAlign: "center",
            paddingBottom: "5px",
        },
    },
    checkbox: {
        position: "absolute",
        marginTop: "20px",
    },
    search: {
        justifyContent: "flex-end",
        display: "flex",
        [mediaCompressedDataGrid]: {
            flexGrow: 1,
            justifyContent: "center",
        },
    },
    downloadSVC: {
        position: "relative",
        left: "0px",
        top: "-41px",
        width: "fit-content",
    },
    downloadSVCLink: {
        textDecoration: "none",
    },
};
