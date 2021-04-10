import { useStyles } from "./styles";
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Alert, Skeleton } from "@material-ui/lab";
import { useCurrentUser } from "util/hooks/currentUser";
import { APILoadError } from "util/endpoints";
import { useZones } from "util/hooks/zones";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

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
                    <div className={styles.topContainer}>
                        <h1>
                            {user.first_name} {user.last_name}
                        </h1>
                        <Button color="primary" onClick={handleChangePassword}>
                            <EditIcon></EditIcon>Change Password
                        </Button>
                    </div>
                    <b>Username</b>
                    <p>{user.username}</p>
                    <b>ID</b>
                    <p> {user.id} </p>
                    <b>Zone</b>
                    <p> {zones.get(user.zone) ?? "Unknown"} </p>
                    <b>Phone Number</b>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <p> {user.phone_number} </p>
                        <div>
                            <Button
                                onClick={() => history.push("/logout")}
                                className={styles.logOutButton}
                                color="primary"
                                variant="contained"
                            >
                                Logout
                            </Button>
                        </div>
                    </Grid>
                </>
            ) : (
                <Skeleton variant="rect" height={400} />
            )}
        </div>
    );
};

export default UserView;
