import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    datagrid: {
        marginTop: 10,
        border: 0,
        WebkitFontSmoothing: "auto",
        letterSpacing: "normal",
        "& .MuiDataGrid-menuIcon, .MuiDataGrid-iconSeparator": {
            display: "none",
        },
        "& .MuiDataGrid-colCell, .MuiDataGrid-cell": {
            whiteSpace: "normal",
            wordWrap: "break-word",
            padding: "1px 1px 1px 1px",
        },
        "& .MuiDataGrid-colCellTitle": {
            textOverflow: "clip",
        },
        "& .MuiIconButton-sizeSmall": {
            padding: "0 0 0 0",
        },
        "& .MuiDataGrid-row	": {
            cursor: "pointer",
        },
        "& .MuiDataGrid-colCell:focus, .MuiDataGrid-cell:focus": {
            outline: "none",
        },
    },
});
