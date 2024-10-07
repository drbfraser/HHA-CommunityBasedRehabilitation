import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(
    {
        container: {
            paddingLeft: 20,
        },
        header: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
        },
        changePasswordButton: {
            marginBottom: 20,
        },
        logOutButton: {
            display: "flex",
            justifyContent: "flex-end",
        },
    },
    { index: 1 }
);
