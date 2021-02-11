import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    root: {
        height: "calc(100vh - 175px)",
        minHeight: 400,
        padding: "5px 0px 50px 0px",
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
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            padding: "1px 1px 1px 1px",
        },
        "& .MuiDataGrid-row	": {
            cursor: "pointer",
        },
        "& .MuiDataGrid-colCell:focus, .MuiDataGrid-cell:focus": {
            outline: "none",
        },
    },
    switch: {
        display: "inline-block",
    },
    search: {
        float: "right",
        display: "flex"
    }, 
    searchOptions: {
        verticalAlign: "top",
        float: "right",
        display: "inline-block",
        paddingRight: 2,
        "& .MuiSelect-root": {
            minWidth: 43
        }
    },
    // mobile width
    "@media (max-width: 800px)": {
        root: {
            height: "calc(100vh - 250px)",
        },
    },
    // The width where the DataGrid gets too tight
    "@media (max-width: 700px)": {
        switch: {
            display: "block",
            textAlign: "center",
            paddingBottom: "5px",
        },
        search: {
            float: "none",
            justifyContent: "center"
        }
    }
});
