import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./styles";
import { IRouteParams, IUser } from "./fields";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Alert, Skeleton } from "@material-ui/lab";
import { getZoneMap } from "util/cache";
import { apiFetch, Endpoint } from "util/endpoints";

const AdminView = () => {
    const styles = useStyles();
    const history = useHistory();
    const [loadingError, setLoadingError] = useState(false);
    const [user, setUser] = useState<IUser>();
    const [zone, setZone] = useState<string>();
    const { userId } = useRouteMatch<IRouteParams>().params;

    const handleEdit = () => {
        return history.push("/admin/edit/" + userId, user);
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const theUser: IUser = (await (
                    await apiFetch(Endpoint.USER, `${userId}`)
                ).json()) as IUser;
                setUser(theUser);
                const zoneMap = await getZoneMap();
                setZone(zoneMap.get(theUser.zone));
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
                    The user might not exist. Please go back and try again.
                </Alert>
            ) : (
                <>
                    {user ? (
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
                            <p> {zone} </p>
                            <b>Phone Number</b>
                            <p> {user.phone_number} </p>
                            <b>Type</b>
                            <p>{"Worker"}</p>
                            <b>Status</b>
                            <p>{"Active"} </p>
                            {/* <p> {user.is_active ? "Active" : "Disable"} </p> */}
                        </>
                    ) : (
                        <Skeleton variant="text" />
                    )}
                </>
            )}
        </div>
    );
};

export default AdminView;
