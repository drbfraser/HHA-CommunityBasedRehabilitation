import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
    {
        container: {
            padding: 30,
            "& h1": {
                marginTop: 0,
            },
        },
        floatRight: {
            float: "right",
        },
    },
    { index: 1 }
);
