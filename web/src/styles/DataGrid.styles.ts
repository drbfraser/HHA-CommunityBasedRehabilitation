import { SxProps, Theme } from "@mui/material";

export const compressedDataGridWidth = 700;
export const mediaCompressedDataGrid = "@media (max-width: " + compressedDataGridWidth + "px)";

export const dataGridStyles: Record<string, SxProps<Theme>> = {
    datagrid: {
        marginTop: "10px",
        border: 0,
        WebkitFontSmoothing: "auto",
        letterSpacing: "normal",
        "& .MuiDataGrid-menuIcon, .MuiDataGrid-iconSeparator": {
            display: "none",
        },
        "& .MuiDataGrid-colCell, .MuiDataGrid-cell": {
            padding: "1px 1px 1px 1px",
        },
        "& .MuiDataGrid-cell": {
            whiteSpace: "normal",
            wordBreak: "break-word",
            hyphens: "auto",
            WebkitHyphens: "auto",
            msHyphens: "auto",
        },
        "& .MuiDataGrid-colCellTitle": {
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
        "& .MuiDataGrid-colCell:focus, .MuiDataGrid-cell:focus": {
            outline: "none",
        },
        "& .MuiDataGrid-colHeader:focus, .MuiDataGrid-columnHeader:focus-within": {
            outline: "none",
        },
        // Hide scrollbars on Windows
        "& .MuiDataGrid-window::-webkit-scrollbar": {
            display: "none;", // Chrome, Safari, Opera
        },
        "& .MuiDataGrid-window": {
            scrollbarWidth: "none", // Firefox
        },
        "& .MuiDataGrid-overlay": {
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
};


// todo: remove unused
// export const useDataGridStyles = makeStyles(
//     {
//         datagrid: {
//             marginTop: 10,
//             border: 0,
//             WebkitFontSmoothing: "auto",
//             letterSpacing: "normal",
//             "& .MuiDataGrid-menuIcon, .MuiDataGrid-iconSeparator": {
//                 display: "none",
//             },
//             "& .MuiDataGrid-colCell, .MuiDataGrid-cell": {
//                 padding: "1px 1px 1px 1px",
//             },
//             "& .MuiDataGrid-cell": {
//                 whiteSpace: "normal",
//                 wordBreak: "break-word",
//                 hyphens: "auto",
//                 WebkitHyphens: "auto",
//                 msHyphens: "auto",
//             },
//             "& .MuiDataGrid-colCellTitle": {
//                 userSelect: "none",
//                 textOverflow: "clip",
//                 lineHeight: "normal",
//                 paddingTop: "36px",
//                 paddingBottom: "36px",
//             },
//             "& .MuiSvgIcon-root": {
//                 verticalAlign: "middle",
//             },
//             "& .MuiIconButton-sizeSmall": {
//                 padding: "0 0 0 0",
//             },
//             "& .MuiDataGrid-row	": {
//                 cursor: "pointer",
//             },
//             "& .MuiDataGrid-colCell:focus, .MuiDataGrid-cell:focus": {
//                 outline: "none",
//             },
//             // Hide scrollbars on Windows
//             "& .MuiDataGrid-window::-webkit-scrollbar": {
//                 display: "none;", // Chrome, Safari, Opera
//             },
//             "& .MuiDataGrid-window": {
//                 scrollbarWidth: "none", // Firefox
//             },
//             "& .MuiDataGrid-overlay": {
//                 backgroundColor: "white",
//             },
//         },
//         dashboardTables: {
//             height: 500,
//         },
//         noRows: {
//             display: "flex",
//             flexDirection: "column",
//         },
//         noRowsIcon: {
//             fontSize: "65px",
//         },
//     },
//     { index: 1 }
// );
