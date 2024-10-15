import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { adminStyles } from "./Admin.styles";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Alert, Skeleton } from '@mui/material';
import { IUser, userRoles } from "@cbr/common/util/users";
import { useZones } from "@cbr/common/util/hooks/zones";
import { IRouteParams } from "@cbr/common/forms/Admin/adminFields";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";

const AdminView = () => {
    const history = useHistory();
    const [loadingError, setLoadingError] = useState(false);
    const [user, setUser] = useState<IUser>();
    const zones = useZones();
    const { userId } = useRouteMatch<IRouteParams>().params;

    const handleEdit = () => {
        return history.push("/admin/edit/" + userId);
    };

    const handlePasswordEdit = () => {
        return history.push("/admin/password/" + userId);
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
        (<Box sx={adminStyles.container}>
            {loadingError ? (
                <Alert severity="error">
                    Something went wrong trying to load that user. Please go back and try again.
                </Alert>
            ) : user ? (
                <>
                    <Box sx={adminStyles.header}>
                        <h1>
                            {user.first_name} {user.last_name}
                        </h1>
                        <Box sx={adminStyles.editButton}>
                            <Button color="primary" onClick={handleEdit}>
                                <EditIcon></EditIcon>Edit
                            </Button>
                            <Button color="primary" onClick={handlePasswordEdit}>
                                <LockOpenIcon></LockOpenIcon>Change Password
                            </Button>
                        </Box>
                    </Box>
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
                <Skeleton variant="rectangular" height={500} />
            )}
        </Box>)
    );
};

export default AdminView;
