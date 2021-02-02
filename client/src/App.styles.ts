import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    container: {
        minHeight: "100%",
        display: "flex",
        flexDirection: "row",
    },
    pageContainer: {
        width: "100%",
        padding: 20,
        borderRadius: "50px 0 0 50px",
        boxShadow: "-5px 0px 10px #33333344",
        backgroundColor: "#e3e8f4",
    },
    pageContent: {
        marginTop: 20,
        padding: 20,
        borderRadius: 30,
        backgroundColor: "white",
        boxShadow: "0px 0px 10px #33333311",
    },
    "@media (max-width: 800px)": {
        container: {
            flexDirection: "column-reverse",
            height: "100%",
        },
        pageContainer: {
            height: "100%",
            width: "auto",
            overflowX: "auto",
            overflowY: "auto",
            borderRadius: "0 0 30px 30px",
            boxShadow: "0px 5px 10px #33333344",
        },
    },
});
