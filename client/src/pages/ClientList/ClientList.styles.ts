import { makeStyles } from "@material-ui/core/styles";
import { mediaCompressedDataGrid } from "styles/DataGrid.styles";
import { mediaMobile } from "theme.styles";

export const useStyles = makeStyles({
    root: {
        height: "calc(100vh - 175px)",
        minHeight: 400,
        padding: "5px 0px 25px 0px",
    },
    switch: {
        display: "inline-block",
    },
    search: {
        float: "right",
        display: "flex",
    },
    searchOptions: {
        verticalAlign: "top",
        float: "right",
        display: "inline-block",
        paddingRight: 2,
        "& .MuiSelect-root": {
            minWidth: 43,
        },
    },
    optionsContainer: {
        padding: "5px",
    },
    optionsButton: {
        padding: "6px",
        float: "right",
        verticalAlign: "middle",
    },
    optionsRow: {
        padding: "2px 0px 2px 0px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    zoneOptions: {
        minWidth: 60,
    },
    // mobile width
    [mediaMobile]: {
        root: {
            height: "calc(100vh - 181px)",
            paddingBottom: "31px",
        },
    },
    // The width where the DataGrid gets too tight
    [mediaCompressedDataGrid]: {
        root: {
            paddingBottom: "71px",
        },
        switch: {
            display: "block",
            textAlign: "center",
            paddingBottom: "5px",
        },
        search: {
            float: "none",
            justifyContent: "center",
        },
    },
});
