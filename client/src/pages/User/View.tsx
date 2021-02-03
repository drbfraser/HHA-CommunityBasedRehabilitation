import React, { useState } from "react";
import styles from "./View.module.css";

// User profile view Component
const Profile = (props: any) => {
    const handleEdit = () => props.setProps(true);
    // Read From Server
    const [state] = useState({
        userName: "User Name",
        id: "11111111",
        location: "British Columbia, Canada",
        phoneNumber: "(XXX) XXX-XXXX",
        emailAddress: "XXXXXX@XXX.com",
    });

    return (
        <div className={styles.container}>
            <header>
                <h1 className={styles.head}> {state.userName} </h1>
                <div className={styles.edit}>
                    <button className={styles.btn} onClick={handleEdit}>
                        <i className="fa fa-edit fa-lg"></i>Edit
                    </button>
                </div>
                <label htmlFor="ID">ID</label>
                <p> {state.id} </p>
                <label htmlFor="Location">Location</label>
                <p> {state.location} </p>
                <label htmlFor="Phone Number">Phone Number</label>
                <p> {state.phoneNumber} </p>
                <label htmlFor="Email Address">Email Address</label>
                <p> {state.emailAddress} </p>
            </header>
        </div>
    );
};

export default Profile;
