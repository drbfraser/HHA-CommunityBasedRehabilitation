import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    timelineEntry: {
        margin: 10,
        padding: 10,
        border: "1px solid #aaa",
        borderRadius: 5,
        fontSize: "120%",
    },
    riskEntry: {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#eee",
        },
    },
    timelineDate: {
        alignSelf: "center",
        flex: 0,
    },
    hidden: {
        visibility: "hidden",
    },
});
