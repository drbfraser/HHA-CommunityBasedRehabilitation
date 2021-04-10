import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
    {
        container: {
            paddingLeft: 20,
        },
        topContainer: {
            display: "flex",
            justifyContent: "space-between",
        },
        logOutButton: {
            float: "right",
        },
    },
    { index: 1 }
);
