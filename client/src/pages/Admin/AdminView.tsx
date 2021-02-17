import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./styles";
import { initialValues, validationSchema } from "./fields";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Form, Formik } from "formik";
import Grid from "@material-ui/core/Grid";
import { handleSubmit } from "pages/Admin/handler";
const AdminView = (props: any) => {
    const styles = useStyles();
    const history = useHistory();
    const handleEdit = () => history.push("/admin/edit");
    const handleCancel = () => history.push("/admin");
    // Read From initialValues field further from Server
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
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
                        <p> {initialValues.id} </p>
                        <b>Zone</b>
                        <p> {initialValues.zone} </p>
                        <b>Phone Number</b>
                        <p> {initialValues.phoneNumber} </p>
                        <b>Type</b>
                        <p> {initialValues.type} </p>
                        <b>Status</b>
                        <p> {initialValues.status} </p>
                    </div>
                    <Form>
                        <div>
                            <Grid container justify="flex-end" spacing={2}>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={handleCancel}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                            <br></br>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default AdminView;
