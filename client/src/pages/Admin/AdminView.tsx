import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./styles";
import { IRouteParams, initialValues, validationSchema } from "./fields";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Formik } from "formik";
import { handleSubmit } from "./handler";

const AdminView = () => {
    const styles = useStyles();
    const history = useHistory();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const handleEdit = () => {
        return history.push("/admin/edit/" + userId);
    };
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <h1>
                        {initialValues.firstName} {initialValues.lastName}
                    </h1>
                    <div className={styles.floatRight}>
                        <Button color="primary" onClick={handleEdit}>
                            <EditIcon></EditIcon>Edit
                        </Button>
                    </div>

                    <b>Username</b>
                    <p>{initialValues.username}</p>
                    <b>ID</b>
                    <p> {userId} </p>
                    <b>Zone</b>
                    <p> {initialValues.zone} </p>
                    <b>Phone Number</b>
                    <p> {initialValues.phoneNumber} </p>
                    <b>Type</b>
                    <p> {initialValues.type === "W" ? "Worker" : "Admin"} </p>
                    <b>Status</b>
                    <p> {initialValues.status} </p>
                </div>
            )}
        </Formik>
    );
};

export default AdminView;
