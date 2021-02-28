import { useStyles } from "./styles";
import { initialValues } from "./fields";
import React from "react";

const UserView = (props: any) => {
    const styles = useStyles();

    // Read From initialValues field further from Server
    return (
        <div className={styles.container}>
            <h1>
                {initialValues.firstName} {initialValues.lastName}
            </h1>
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
