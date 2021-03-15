import { useStyles } from "./styles";
import { useEffect, useState } from "react";
import { apiFetch, Endpoint } from "util/endpoints";
import { Alert, Skeleton } from "@material-ui/lab";
import { getZoneMap } from "util/cache";
import { IUser } from "util/users";

const UserView = () => {
    const styles = useStyles();
    const [loadingError, setLoadingError] = useState(false);
    const [user, setUser] = useState<IUser>();
    const [zone, setZone] = useState<string>();

    useEffect(() => {
        const getUser = async () => {
            try {
                const theUser: IUser = await (await apiFetch(Endpoint.USER_CURRENT)).json();
                setUser(theUser);
                const zoneMap = await getZoneMap();
                setZone(zoneMap.get(theUser.zone));
            } catch (e) {
                setLoadingError(true);
            }
        };
        getUser();
    }, []);

    return (
        <div className={styles.container}>
            {loadingError ? (
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>
            ) : (
                <>
                    {user ? (
                        <>
                            <h1>
                                {user.first_name} {user.last_name}
                            </h1>
                            <b>Username</b>
                            <p>{user.username}</p>
                            <b>ID</b>
                            <p> {user.id} </p>
                            <b>Zone</b>
                            <p> {zone} </p>
                            <b>Phone Number</b>
                            <p> {user.phone_number} </p>
                        </>
                    ) : (
                        <Skeleton variant="text" />
                    )}
                </>
            )}
        </div>
    );
};

export default UserView;
