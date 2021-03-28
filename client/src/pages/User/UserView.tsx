import { useStyles } from "./styles";
import { Alert, Skeleton } from "@material-ui/lab";
import { useUser } from "util/hooks/user";
import { APILoadError } from "util/endpoints";
import { useZones } from "util/hooks/zones";

const UserView = () => {
    const styles = useStyles();
    const user = useUser();
    const zones = useZones();

    return (
        <div className={styles.container}>
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
