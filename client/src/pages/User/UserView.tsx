import { useStyles } from "./styles";
import { Alert, Skeleton } from "@material-ui/lab";
import { useCurrentUser } from "util/hooks/currentUser";
import { APILoadError } from "util/endpoints";
import { useZones } from "util/hooks/zones";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const UserView = () => {
    const history = useHistory();
    const styles = useStyles();
    const user = useCurrentUser();
    const zones = useZones();

    return (
        <div className={styles.container}>
            <Button
                onClick={() => history.push("/logout")}
                className={styles.floatRight}
                color="primary"
                variant="contained"
            >
                Logout
            </Button>
            {user === APILoadError ? (
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>
            ) : user ? (
                <>
                    <h1>
                        {user.first_name} {user.last_name}
                    </h1>
                    <b>Username</b>
                    <p>{user.username}</p>
                    <b>ID</b>
                    <p> {user.id} </p>
                    <b>Zone</b>
                    <p> {zones.get(user.zone) ?? "Unknown"} </p>
                    <b>Phone Number</b>
                    <p> {user.phone_number} </p>
                </>
            ) : (
                <Skeleton variant="rect" height={400} />
            )}
        </div>
    );
};

export default UserView;
