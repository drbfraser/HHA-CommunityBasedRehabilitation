import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
    {
        timeline: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        timelineEntry: {
            margin: 10,
            marginRight: 0,
            padding: 10,
            border: "1px solid #aaa",
            borderRadius: 5,
            fontSize: "120%",
        },
        visitEntry: {
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#eee",
            },
        },
        timelineDate: {
            alignSelf: "center",
            flex: "none",
            width: 105,
            paddingLeft: 0,
            whiteSpace: "nowrap",
        },
        hidden: {
            visibility: "hidden",
        },
        textCenter: {
            textAlign: "center",
        },
    },
    { index: 1 }
);
