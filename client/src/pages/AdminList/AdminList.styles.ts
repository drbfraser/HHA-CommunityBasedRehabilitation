import { makeStyles } from "@material-ui/core/styles";
import { mediaMobile } from "theme.styles";

export const useStyles = makeStyles(
    {
        container: {
            height: "calc(100vh - 175px)",
            minHeight: 400,
            padding: "5px 0px 25px 0px",
        },
        icon: {
            padding: "0px 15px 0px 0px",
        },
        topContainer: {
            float: "right",
            display: "flex",
        },
        dataGridWrapper: {
            height: "100%",
            width: "100%",
            marginTop: "36px",
        },
        [mediaMobile]: {
            container: {
                height: "calc(100vh - 181px)",
                paddingBottom: "40px",
            },
            topContainer: {
                float: "none",
                justifyContent: "center",
            },
            dataGridWrapper: {
                height: "100%",
                width: "100%",
                marginTop: 0,
            },
        },
    },
    { index: 1 }
);
