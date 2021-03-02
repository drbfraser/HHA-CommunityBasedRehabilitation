import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./styles";
import { IRouteParams, initialValues, validationSchema, IUser } from "./fields";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Formik } from "formik";
import { handleSubmit } from "./handler";
import { useEffect, useState } from "react";
import { apiFetch, Endpoint } from "util/endpoints";
import { Alert, Skeleton } from "@material-ui/lab";

const AdminView = () => {
    const styles = useStyles();
    const history = useHistory();
    const [loadingError, setLoadingError] = useState(false);
    const [user, setUser] = useState<IUser>();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const handleEdit = () => {
        return history.push("/admin/edit/" + userId);
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                // After we can get the id from the list it could work
                const theUser: IUser = await (await apiFetch(Endpoint.USER, `${"/2"}`)).json();
                setUser(theUser);
            } catch (e) {
                setLoadingError(true);
            }
        };
        getUser();
    }, [userId]);
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    {loadingError ? (
                        <Alert severity="error">
                            Something went wrong. Please go back and try again.
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
                                    <p> {user.zone} </p>
                                    <b>Phone Number</b>
                                    <p> {user.phone_number} </p>
                                    <b>Type</b>
                                    {/* <p> {user.type === "W" ? "Worker" : "Admin"} </p> */}
                                    <b>Status</b>
                                    <p> {user.is_active ? "Active" : "Disable"} </p>
                                </>
                            ) : (
                                <Skeleton variant="text" />
                            )}
                        </>
                    )}
                </div>
            )}
        </Formik>
    );
};

export default AdminView;
