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
            height: "15rem",
            width: "15rem",
            marginLeft: "auto",
            marginRight: "auto",
            cursor: "pointer",
            "&:hover": {
                opacity: 0.5,
                "& $uploadIcon": {
                    opacity: 1,
                },
            },
        },
        profilePicture: {
            maxWidth: "100%",
            maxHeight: "100%",
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
            top: "30%",
            bottom: 0,
            textAlign: "center",
        },
        "@media (max-width: 1600px)": {
            profileImgContainer: {
                width: "13rem",
                height: "13rem",
            },
        },
        "@media (max-width: 1400px)": {
            profileImgContainer: {
                width: "10rem",
                height: "10rem",
            },
            uploadIcon: {
                top: "20%",
            },
        },
        "@media (max-width: 1100px)": {
            profileImgContainer: {
                width: "7rem",
                height: "7rem",
            },
            uploadIcon: {
                top: "7%",
            },
        },
    },
    { index: 1 }
);
