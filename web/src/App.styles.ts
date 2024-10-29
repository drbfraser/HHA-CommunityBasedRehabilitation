import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from "@mui/material";
import { mediaMobile } from "theme.styles";

export const appStyles: Record<string, SxProps<Theme>> = {
    container: {
        minHeight: "100%",
        display: "flex",
        flexDirection: "row",
        [mediaMobile]: {
            flexDirection: "column-reverse",
            height: "100%",
        },
    },
    pageContainer: {
        width: "100%",
        padding: "20px",
        borderRadius: "50px 0 0 50px",
        boxShadow: "-5px 0px 10px rgba(25, 25, 25, 0.2)",
        backgroundColor: themeColors.blueBgLight,
        [mediaMobile]: {
            height: "100%",
            width: "auto",
            padding: 0,
            overflowX: "auto",
            overflowY: "auto",
            borderRadius: "0 0 30px 30px",
            boxShadow: "0px 5px 10px rgba(25, 25, 25, 0.2)",
        },
    },
    pageContent: {
        marginTop: "20px",
        padding: "20px",
        borderRadius: "30px",
        backgroundColor: "white",
        boxShadow: "0px 0px 10px rgba(25, 25, 25, 0.1)",
        [mediaMobile]: {
            marginTop: "10px",
        },
    },
    pageTitle: {
        marginLeft: "20px",
        fontWeight: "bold",
        [mediaMobile]: {
            marginTop: "10px",
            marginLeft: 0,
            fontSize: "40px",
            textAlign: "center",
        },
    },
};

// todosd: remove unused
// export const useStyles = makeStyles(
//     {
//         container: {
//             minHeight: "100%",
//             display: "flex",
//             flexDirection: "row",
//         },
//         pageContainer: {
//             width: "100%",
//             padding: 20,
//             borderRadius: "50px 0 0 50px",
//             boxShadow: "-5px 0px 10px rgba(25, 25, 25, 0.2)",
//             backgroundColor: themeColors.blueBgLight,
//         },
//         pageContent: {
//             marginTop: 20,
//             padding: 20,
//             borderRadius: 30,
//             backgroundColor: "white",
//             boxShadow: "0px 0px 10px rgba(25, 25, 25, 0.1)",
//         },
//         pageTitle: {
//             marginLeft: 20,
//             fontWeight: "bold",
//         },
//         [mediaMobile]: {
//             container: {
//                 flexDirection: "column-reverse",
//                 height: "100%",
//             },
//             pageContainer: {
//                 height: "100%",
//                 width: "auto",
//                 padding: 0,
//                 overflowX: "auto",
//                 overflowY: "auto",
//                 borderRadius: "0 0 30px 30px",
//                 boxShadow: "0px 5px 10px rgba(25, 25, 25, 0.2)",
//             },
//             pageContent: {
//                 marginTop: 10,
//             },
//             pageTitle: {
//                 marginTop: 10,
//                 marginLeft: 0,
//                 fontSize: "40px",
//                 textAlign: "center",
//             },
//         },
//     },
//     { index: 1 }
// );
