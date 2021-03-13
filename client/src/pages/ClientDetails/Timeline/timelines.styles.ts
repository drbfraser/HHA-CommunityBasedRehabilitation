import { makeStyles } from "@material-ui/core/styles";

export const useTimelineStyles = makeStyles(
    {
        timeline: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        entry: {
            margin: 10,
            marginRight: 0,
            padding: 10,
            border: "1px solid #aaa",
            borderRadius: 5,
            fontSize: "120%",
        },
        clickable: {
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#eee",
            },
        },
        date: {
            alignSelf: "center",
            flex: "none",
            width: 105,
            paddingLeft: 0,
            whiteSpace: "nowrap",
        },
        hidden: {
            visibility: "hidden",
        },
    },
    { index: 1 }
);
