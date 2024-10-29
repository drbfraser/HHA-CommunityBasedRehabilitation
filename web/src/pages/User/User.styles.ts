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
