import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        width: 100,
    },
    icon: {
        margin: "10px auto",
        height: 55,
        width: 55,
        borderRadius: 20,
        textAlign: "center",
        fontSize: 42,
        cursor: "pointer",
        color: "white",
        "&:hover": {
            backgroundColor: "#eeeeee44",
        },
    },
    active: {
        "&, &:hover": {
            backgroundColor: "rgb(255, 199, 120)",
        },
    },
    tooltip: {
        fontSize: 14,
        "&, & .MuiTooltip-arrow:before": {
            backgroundColor: "black",
        },
    },
    hhaIcon: {
        margin: "10px auto 30px auto",
        borderRadius: 20,
        height: 55,
        width: 55,
        padding: 10,
        backgroundColor: "#ffffff11",
    },
    "@media (max-width: 800px)": {
        container: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
        },
        hhaIcon: {
            display: "none",
        },
    },
});
