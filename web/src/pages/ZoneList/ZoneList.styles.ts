import { SxProps, Theme } from "@mui/material";
import { mediaCompressedDataGrid } from "styles/DataGrid.styles";
import { mediaMobile } from "theme.styles";

export const zoneListStyles: Record<string, SxProps<Theme>> = {
    container: {
        height: "calc(100vh - 175px)",
        minHeight: 400,
        padding: "5px 0px 25px 0px",
        [mediaMobile]: {
            height: "calc(100vh - 150px)",
            paddingBottom: "50px",
        },
        [mediaCompressedDataGrid]: {
            paddingBottom: "71px",
        },
    },
    topContainer: {
        justifyContent: "flex-end",
        display: "flex",
        [mediaCompressedDataGrid]: {
            flexGrow: 1,
            justifyContent: "center",
        },
    },
    dataGridWrapper: {
        height: "100%",
        width: "100%",
        [mediaCompressedDataGrid]: {
            height: "100%",
            width: "100%",
            marginTop: 0,
        },
    },
    icon: {
        padding: "0px 15px 0px 0px",
    },
};
