import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    container: {
        height: 700,
        padding: "5px 2px 100px 2px",
    },
    datagrid: {
        marginTop: 10,
        border: 0,
        WebkitFontSmoothing: "auto",
        letterSpacing: "normal",
        "& .MuiDataGrid-menuIcon, .MuiDataGrid-iconSeparator": {
            display: "none",
        },
        "& .MuiDataGrid-colCell, .MuiDataGrid-cell": {
            padding: "0px 1px",
        },
        "& .MuiDataGrid-row	": {
            cursor: "pointer",
        },
        "& .MuiDataGrid-colCell:focus, .MuiDataGrid-cell:focus": {
            outline: "none",
        },
    },
    wrapper: {
        display: "flex",
        float: "right",
    },
    search: {
        float: "right",
        display: "inline-block",
    },
});