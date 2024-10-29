import React from "react";
import { Box, Button, Alert, Skeleton  } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { APILoadError } from "@cbr/common/util/endpoints";
import { useZones } from "@cbr/common/util/hooks/zones";
import { useHistory } from "react-router-dom";
import { userStyles } from "./User.styles";

const UserView = () => {
    const history = useHistory();
    const user = useCurrentUser();
    const zones = useZones();

    const handleChangePassword = () => {
        return history.push("/user/password");
    };

    return (
        (<Box sx={userStyles.container}>
            {user === APILoadError ? (
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>
            ) : user ? (
                <>
                    <Box sx={userStyles.header}>
                        <h1>
                            {user.first_name} {user.last_name}
                        </h1>
                        <Button
                            sx={userStyles.changePasswordButton}
                            color="primary"
                            onClick={handleChangePassword}
                        >
                            <LockOpenIcon></LockOpenIcon>Change Password
                        </Button>
                    </Box>
                    <b>Username</b>
                    <p>{user.username}</p>
                    <b>ID</b>
                    <p> {user.id} </p>
                    <b>Zone</b>
                    <p> {zones.get(user.zone) ?? "Unknown"} </p>
                    <b>Phone Number</b>
                    <p> {user.phone_number} </p>
                    <Box sx={userStyles.logOutButton}>
                        <Button
                            onClick={() => history.push("/logout")}
                            color="primary"
                            variant="contained"
                        >
                            Logout
                        </Button>
                    </Box>
                </>
            ) : (
                <Skeleton variant="rectangular" height={400} />
            )}
        </Box>)
    );
};

export default UserView;
