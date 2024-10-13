import makeStyles from '@mui/styles/makeStyles';
import { mediaCompressedDataGrid } from "styles/DataGrid.styles";
import { mediaMobile } from "theme.styles";

// todo: finish sx migration
export const useStyles = makeStyles(
    {
        container: {
            height: "calc(100vh - 175px)",
            minHeight: 400,
            padding: "5px 0px 25px 0px",
        },
        topContainer: {
            justifyContent: "flex-end",
            display: "flex",
        },
        dataGridWrapper: {
            height: "100%",
            width: "100%",
        },
        icon: {
            padding: "0px 15px 0px 0px",
        },
        // [mediaMobile]: {
        //     container: {
        //         height: "calc(100vh - 150px)",
        //         paddingBottom: "50px",
        //     },
        // },
        // [mediaCompressedDataGrid]: {
        //     container: {
        //         paddingBottom: "71px",
        //     },
        //     topContainer: {
        //         flexGrow: 1,
        //         justifyContent: "center",
        //     },
        //     dataGridWrapper: {
        //         height: "100%",
        //         width: "100%",
        //         marginTop: 0,
        //     },
        // },
    },
    { index: 1 }
);
