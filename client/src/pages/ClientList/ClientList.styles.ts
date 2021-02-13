import { makeStyles } from "@material-ui/core/styles";
import { mediaCompressedDataGrid } from "styles/DataGrid.styles";
import { mediaMobile } from "theme.styles";

export const useStyles = makeStyles({
    root: {
        height: "calc(100vh - 175px)",
        minHeight: 400,
        padding: "5px 0px 50px 0px",
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
    // mobile width
    [mediaMobile]: {
        root: {
            height: "calc(100vh - 250px)",
        },
    },
    // The width where the DataGrid gets too tight
    [mediaCompressedDataGrid]: {
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
