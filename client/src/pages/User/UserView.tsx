import { useStyles } from "./styles";
import { IUser } from "./fields";
import React from "react";
import { useEffect, useState } from "react";
import { apiFetch, Endpoint } from "util/endpoints";
import { Alert, Skeleton } from "@material-ui/lab";
// import { useRouteMatch } from "react-router-dom";
// import { IRouteParams } from "pages/Admin/fields";

const UserView = () => {
    const styles = useStyles();
    const [loadingError, setLoadingError] = useState(false);
    const [user, setUser] = useState<IUser>();
    // const { userId } = useRouteMatch<IRouteParams>().params;
    const userId = "/2"
    useEffect(() => {
        const getUser = async () => {
            try {
                const theUser: IUser = await (
                    await apiFetch(Endpoint.USER, `${userId}`)
                ).json();
                setUser(theUser);
            } catch (e) {
                setLoadingError(true);
            }
        };
        getUser();
    },[userId]);

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
                            <p> {user.zone} </p>
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
