import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./styles";
import { initialValues } from "./fields";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

const UserView = (props: any) => {
    const styles = useStyles();
    const history = useHistory();
    const handleEdit = () => {
        const path = "/user/edit";
        history.push(path);
    };

    // Read From initialValues field further from Server
    return (
        <div className={styles.container}>
            <h1> {initialValues.userName} </h1>
            <div className={styles.editContainer}>
                <Button color="primary" onClick={handleEdit}>
                    <EditIcon></EditIcon>Edit
                </Button>
            </div>
            <br></br>
            <b>ID</b>
            <p> {initialValues.id} </p>
            <b>Zone</b>
            <p> {initialValues.zoneNumber} </p>
            <b>Phone Number</b>
            <p> {initialValues.phoneNumber} </p>
            <b>Email</b>
            <p> {initialValues.emailAddress} </p>
        </div>
    );
};

export default UserView;
