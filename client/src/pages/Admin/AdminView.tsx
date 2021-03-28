import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./styles";
import { IRouteParams } from "./fields";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Alert, Skeleton } from "@material-ui/lab";
import { apiFetch, Endpoint } from "util/endpoints";
import { IUser, userRoles } from "util/users";
import { useZones } from "util/hooks/zones";

const AdminView = () => {
    const styles = useStyles();
    const history = useHistory();
    const [loadingError, setLoadingError] = useState(false);
    const [user, setUser] = useState<IUser>();
    const zones = useZones();
    const { userId } = useRouteMatch<IRouteParams>().params;

    const handleEdit = () => {
        return history.push("/admin/edit/" + userId);
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const theUser: IUser = (await (
                    await apiFetch(Endpoint.USER, `${userId}`)
                ).json()) as IUser;
                setUser(theUser);
            } catch (e) {
                setLoadingError(true);
            }
        };
        getUser();
    }, [userId]);

    return (
        <div className={styles.container}>
            {loadingError ? (
                <Alert severity="error">
                    Something went wrong trying to load that user. Please go back and try again.
                </Alert>
            ) : user ? (
                <>
                    <h1>
                        {user.first_name} {user.last_name}
                    </h1>
                    <div className={styles.floatRight}>
                        <Button color="primary" onClick={handleEdit}>
                            <EditIcon></EditIcon>Edit
                        </Button>
                    </div>

                    <b>Username</b>
                    <p>{user.username}</p>
                    <b>ID</b>
                    <p> {userId} </p>
                    <b>Zone</b>
                    <p> {zones.get(user.zone) ?? "Unknown"} </p>
                    <b>Phone Number</b>
                    <p> {user.phone_number} </p>
                    <b>Type</b>
                    <p> {userRoles[user.role].name} </p>
                    <b>Status</b>
                    <p> {user.is_active ? "Active" : "Disabled"} </p>
                </>
            ) : (
                <Skeleton variant="rect" height={500} />
            )}
        </div>
    );
};

export default AdminView;
