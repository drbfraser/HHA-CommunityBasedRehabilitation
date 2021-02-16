import { makeStyles } from "@material-ui/core/styles";
import { mediaCompressedDataGrid } from "styles/DataGrid.styles";

export const useStyles = makeStyles({
    container: {
        height: "calc(100vh - 175px)",
        minHeight: 400,
        padding: "5px 0px 50px 0px",
    },
    icon: {
        padding: "0px 10px 0px 0px",
    },
    wrapper: {
        float: "right",
        display: "flex",
    },
    [mediaCompressedDataGrid]: {
        wrapper: {
            float: "none",
            justifyContent: "center",
        },
    },
});
