import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from "@mui/material";

export const clientFormStyles: Record<string, SxProps<Theme>> = {
    caregiverAccordion: {
        backgroundColor: themeColors.blueBgLight,
    },
    caregiverInputField: {
        backgroundColor: "#ffffff",
    },
    checkboxError: {
        color: themeColors.errorRed,
        "& .MuiCheckbox-root": {
            color: themeColors.errorRed,
        },
    },
    errorMessage: {
        fontSize: "0.75rem",
        color: themeColors.errorRed,
        marginTop: "-4px",
        marginLeft: "14px",
    },
    disabledTextField: {
        "& div": {
            color: "black",
        },
        "& input:disabled": {
            color: "black",
        },
    },
    pictureColumn: {
        flex: 1,
    },
    sideFormButtonWrapper: {
        alignItems: "center",
        minWidth: "100%",
        "@media (max-width: 960px)": {
            flex: 1,
            minWidth: "auto",
        },
    },
    sideFormButton: {
        height: "100%",
    },
};

// todosd: remove
// export const useStyles = makeStyles(
//     {
//         caregiverAccordion: {
//             backgroundColor: themeColors.blueBgLight,
//         },
//         caregiverInputField: {
//             backgroundColor: "#ffffff",
//         },
//         checkboxError: {
//             color: themeColors.errorRed,
//             "& .MuiCheckbox-root": {
//                 color: themeColors.errorRed,
//             },
//         },
//         errorMessage: {
//             fontSize: "0.75rem",
//             color: themeColors.errorRed,
//             marginTop: "-4px",
//             marginLeft: "14px",
//         },
//         disabledTextField: {
//             "& div": {
//                 color: "black",
//             },
//             "& input:disabled": {
//                 color: "black",
//             },
//         },
//         pictureColumn: {
//             flex: 1,
//         },
//         sideFormButtonWrapper: {
//             alignItems: "center",
//             minWidth: "100%",
//         },
//         sideFormButton: {
//             height: "100%",
//         },
//         "@media (max-width: 960px)": {
//             sideFormButtonWrapper: {
//                 flex: 1,
//                 minWidth: "auto",
//             },
//         },
//     },
//     { index: 1 }
// );
