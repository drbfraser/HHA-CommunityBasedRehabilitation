import { SxProps, Theme } from "@mui/material";

export const compressedDataGridWidth = 700;
export const mediaCompressedDataGrid = "@media (max-width: " + compressedDataGridWidth + "px)";

export const dataGridStyles = {
    datagrid: {
        marginTop: "10px",
        border: 0,
        backgroundColor: "white",
        "--DataGrid-containerBackground": "white",
        "--DataGrid-pinnedBackground": "white",
        WebkitFontSmoothing: "auto",
        letterSpacing: "normal",
        "& .MuiDataGrid-menuIcon, & .MuiDataGrid-iconSeparator": {
            display: "none",
        },
        "& .MuiDataGrid-colCell, & .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
            padding: "1px 1px 1px 1px",
        },
        "& .MuiDataGrid-cell": {
            whiteSpace: "normal",
            wordBreak: "break-word",
            hyphens: "auto",
            WebkitHyphens: "auto",
            msHyphens: "auto",
        },
        "& .MuiDataGrid-colCellTitle, & .MuiDataGrid-columnHeaderTitle": {
            userSelect: "none",
            textOverflow: "clip",
            lineHeight: "normal",
            paddingTop: "36px",
            paddingBottom: "36px",
        },
        "& .MuiSvgIcon-root": {
            verticalAlign: "middle",
        },
        "& .MuiIconButton-sizeSmall": {
            padding: "0 0 0 0",
        },
        "& .MuiDataGrid-row	": {
            cursor: "pointer",
        },
        "& .MuiDataGrid-colCell:focus, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus":
            {
            outline: "none",
        },
        "& .MuiDataGrid-colHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
            outline: "none",
        },
        // Hide scrollbars on Windows
        "& .MuiDataGrid-window::-webkit-scrollbar, & .MuiDataGrid-virtualScroller::-webkit-scrollbar":
            {
            display: "none;", // Chrome, Safari, Opera
        },
        "& .MuiDataGrid-window, & .MuiDataGrid-virtualScroller": {
            scrollbarWidth: "none", // Firefox
        },
        // Keep dashboard grids white under the v7 DataGrid class structure.
        "& .MuiDataGrid-main, & .MuiDataGrid-columnHeaders, & .MuiDataGrid-virtualScroller, & .MuiDataGrid-filler, & .MuiDataGrid-overlayWrapper, & .MuiDataGrid-overlay, & .MuiDataGrid-topContainer, & .MuiDataGrid-bottomContainer":
            {
            backgroundColor: "white",
        },
    },
    dashboardTables: {
        height: 500,
    },
    noRows: {
        display: "flex",
        flexDirection: "column",
    },
    noRowsIcon: {
        fontSize: "65px",
    },
} satisfies Record<string, SxProps<Theme>>;
