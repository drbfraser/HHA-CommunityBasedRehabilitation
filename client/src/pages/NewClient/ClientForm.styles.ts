import { makeStyles } from "@material-ui/core/styles";
import { themeColors } from "theme.styles";

export const useStyles = makeStyles(
    {
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
        profileImgContainer: {
            position: "relative",
            display: "block",
            marginBottom: 15,
            overflow: "hidden",
            marginLeft: "auto",
            marginRight: "auto",
            cursor: "pointer",
        },
        profileUploadHover: {
            "&:hover": {
                opacity: 0.5,
                "& $uploadIcon": {
                    opacity: 1,
                },
            },
        },
        pictureColumn: {
            flex: 1,
        },
        sideFormButtonWrapper: {
            alignItems: "center",
            minWidth: "100%",
        },
        sideFormButton: {
            height: "100%",
        },
        profilePicture: {
            maxWidth: "100%",
            minHeight: "22vh",
            maxHeight: "22vh",
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
        },
        uploadIcon: {
            color: "white",
            display: "block",
            position: "absolute",
            zIndex: 500,
            left: 0,
            right: 0,
            opacity: 0,
            top: "50%",
            bottom: 0,
            textAlign: "center",
        },
        "@media (max-width: 960px)": {
            profileImgContainer: {
                width: "13rem",
            },
            sideFormButtonWrapper: {
                flex: 1,
                minWidth: "auto",
            },
        },
    },
    { index: 1 }
);
