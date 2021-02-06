import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./View.styles";
import { initialValues } from "./fields";
import { useHistory } from "react-router-dom";

const View = (props: any) => {
    const styles = useStyles();
    const history = useHistory();
    const handleEdit = () => {
        const path = "/user/edit";
        history.push(path);
    };

    // Read From initialValues field further from Server
    return (
        <div className={styles.container}>
            <header>
                <h1> {initialValues.userName} </h1>
                <div className={styles.edit}>
                    <button className={styles.btn} onClick={handleEdit}>
                        <EditIcon></EditIcon>Edit
                    </button>
                </div>
                <br></br>

                <label className={styles.label}>ID</label>
                <p> {initialValues.id} </p>
                <label htmlFor="Zone" className={styles.label}>
                    Zone
                </label>
                <p> {initialValues.zoneNumber} </p>
                <label htmlFor="Phone Number" className={styles.label}>
                    Phone Number
                </label>
                <p> {initialValues.phoneNumber} </p>
                <label htmlFor="Email Address" className={styles.label}>
                    Email
                </label>
                <p> {initialValues.emailAddress} </p>
            </header>
        </div>
    );
};

export default View;
