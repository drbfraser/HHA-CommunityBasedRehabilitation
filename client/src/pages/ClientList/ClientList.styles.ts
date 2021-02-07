import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    root: {
        height: 700,
        padding: "5px 2px 50px 2px",
    },
    inlineBlock: {
        display: "inline-block",
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
    inputRoot: {
        color: "inherit",
    },
    search: {
        float: "right",
        display: "inline-block",
    },
    searchOptions: {
        verticalAlign: "top",
        float: "right",
        display: "inline-block",
        minWidth: 80,
    },
});
