import { makeStyles } from "@material-ui/core/styles";

export const useHideColumnsStyles = makeStyles(
    {
        optionsContainer: {
            padding: "5px",
        },
        optionsButton: {
            padding: "6px",
            float: "right",
            verticalAlign: "middle",
        },
        optionsRow: {
            padding: "2px 0px 2px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
        },
    },
    { index: 1 }
);
