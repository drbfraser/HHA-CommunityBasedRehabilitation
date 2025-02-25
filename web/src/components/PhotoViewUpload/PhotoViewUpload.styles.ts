import { SxProps, Theme } from "@mui/material";

export const photoViewUploadStyles: Record<string, SxProps<Theme>> = {
    profileImgContainer: {
        "& .MuiCardContent-root": {
            padding: "16px",
        },
        position: "relative",
        display: "block",
        marginBottom: "15px",
        overflow: "hidden",
        marginLeft: "auto",
        marginRight: "auto",
        cursor: "pointer",
        "@media (max-width: 960px)": {
            width: "13rem",
        },
    },
    profileUploadHover: {
        "&:hover": {
            opacity: 0.5,
            "& #uploadIcon": {
                opacity: 1,
            },
        },
    },
    profilePicture: {
        minWidth: "100%",
        height: "auto",
        width: "50%",
        objectFit: "cover",
        marginLeft: "auto",
        marginRight: "auto",
        display: "block",
    },
    pictureModal: {
        width: "65vw",
        maxWidth: "400px",
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
};
