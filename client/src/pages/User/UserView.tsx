import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./styles";
import { initialValues } from "./fields";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

const UserView = (props: any) => {
    const styles = useStyles();
    const history = useHistory();
    const handleEdit = () => history.push("/user/edit");
    // Read From initialValues field further from Server
    return (
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
        </div>
    );
};

export default UserView;
