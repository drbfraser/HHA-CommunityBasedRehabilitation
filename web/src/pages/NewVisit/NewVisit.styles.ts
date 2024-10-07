import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(
    {
        visitLocationContainer: {
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
        },
        visitLocation: {
            flex: "1",
            minWidth: "200px",
            marginRight: "10px",
            marginTop: "10px",
        },
    },
    { index: 1 }
);
