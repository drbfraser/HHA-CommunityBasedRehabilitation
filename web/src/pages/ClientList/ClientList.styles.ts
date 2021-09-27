import { makeStyles } from "@material-ui/core/styles";
import { mediaCompressedDataGrid } from "styles/DataGrid.styles";
import { mediaMobile } from "theme.styles";

export const useStyles = makeStyles(
    {
        root: {
            height: "calc(100vh - 175px)",
            minHeight: 400,
            padding: "5px 0px 25px 0px",
        },
        switch: {
            float: "left",
            display: "inline-block",
        },
        search: {
            justifyContent: "flex-end",
            display: "flex",
        },
        downloadSVC: {
          position: "relative",
          left: "10px",
          top: "-35px",
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
                float: "none",
                textAlign: "center",
                paddingBottom: "5px",
            },
            search: {
                flexGrow: 1,
                justifyContent: "center",
            },
        },
    },
    { index: 1 }
);
