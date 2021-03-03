import { useStyles } from "./styles";
import { IUser } from "./fields";
import React from "react";
import { useEffect, useState } from "react";
import { apiFetch, Endpoint } from "util/endpoints";
import { Alert, Skeleton } from "@material-ui/lab";
import { getZoneMap } from "util/cache";

const UserView = () => {
    const styles = useStyles();
    const [loadingError, setLoadingError] = useState(false);
    const [user, setUser] = useState<IUser>();
    const [zone, setZone] = useState<string>();
    // Get the userId after the backend support
    const userId = "/5";
    useEffect(() => {
        const getUser = async () => {
            try {
                // After we can get the user id from the list it could work
                const theUser: IUser = await (await apiFetch(Endpoint.USER, `${userId}`)).json();
                setUser(theUser);
                const zoneMap = await getZoneMap();
                setZone(zoneMap.get(theUser.id - 1));
            } catch (e) {
                setLoadingError(true);
            }
        };
        getUser();
    }, [userId]);

    // Read From initialValues field further from Server
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
