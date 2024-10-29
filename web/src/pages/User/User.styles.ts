import { SxProps, Theme } from '@mui/material';

export const userStyles: Record<string, SxProps<Theme>> = {
    container: {
        paddingLeft: "20px",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    changePasswordButton: {
        marginBottom: "20px",
    },
    logOutButton: {
        display: "flex",
        justifyContent: "flex-end",
    },
}

// todosd: remove
// export const useStyles = makeStyles(
//     {
//         container: {
//             paddingLeft: 20,
//         },
//         header: {
//             display: "flex",
//             flexDirection: "row",
//             flexWrap: "wrap",
//             justifyContent: "space-between",
//             alignItems: "center",
//         },
//         changePasswordButton: {
//             marginBottom: 20,
//         },
//         logOutButton: {
//             display: "flex",
//             justifyContent: "flex-end",
//         },
//     },
//     { index: 1 }
// );
