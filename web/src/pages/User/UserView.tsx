import { useStyles } from "./styles";
import { Button } from "@material-ui/core";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Alert, Skeleton } from "@material-ui/lab";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { APILoadError } from "@cbr/common/util/endpoints";
import { useZones } from "@cbr/common/util/hooks/zones";
import { useHistory } from "react-router-dom";
import React from "react";

const UserView = () => {
    const styles = useStyles();
    const history = useHistory();
    const user = useCurrentUser();
    const zones = useZones();

    const handleChangePassword = () => {
        return history.push("/user/password");
    };

    return (
        <div className={styles.container}>
            {user === APILoadError ? (
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>
            ) : user ? (
                <>
                    <div className={styles.header}>
                        <h1>
                            {user.first_name} {user.last_name}
                        </h1>
                        <Button
                            className={styles.changePasswordButton}
                            color="primary"
                            onClick={handleChangePassword}
                        >
                            <LockOpenIcon></LockOpenIcon>Change Password
                        </Button>
                    </div>
                    <b>Username</b>
                    <p>{user.username}</p>
                    <b>ID</b>
                    <p> {user.id} </p>
                    <b>Zone</b>
                    <p> {zones.get(user.zone) ?? "Unknown"} </p>
                    <b>Phone Number</b>
                    <p> {user.phone_number} </p>
                    <div className={styles.logOutButton}>
                        <Button
                            onClick={() => history.push("/logout")}
                            color="primary"
                            variant="contained"
                        >
                            Logout
                        </Button>
                    </div>
                </>
            ) : (
                <Skeleton variant="rect" height={400} />
            )}
        </div>
    );
};

export default UserView;
