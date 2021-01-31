import React, { Component } from "react";
import styles from "./Profile.module.css";
import { useHistory } from "react-router-dom";
import UserEdit from "pages/User/UserEdit";

// User profile Component
const UserProfile = () => {
    const history = useHistory();
    const handleEdit = () => history.push("/UserEdit");
    //
    // state = { :  }
    let userName = "User Name";
    let id = "11111111";
    let location = "British Columbia, Canada";
    let phoneNumber = "(XXX) XXX-XXXX";
    let emailAddress = "XXXXXX@XXX.com";
    // /user
    return (
        <div className={styles.container}>
            <header>
                <h1> {userName} </h1>
                <div className={styles.edit}>
                    {/* <p>Edit</p> */}
                    <button className={styles.btn} onClick={handleEdit}>
                        <i className="fa fa-edit fa-lg"></i>Edit
                    </button>
                </div>
                <label htmlFor="ID">ID</label>
                <p> {id} </p>
                <label htmlFor="Location">Location</label>
                <p> {location} </p>
                <label htmlFor="Phone Number">Phone Number</label>
                <p> {phoneNumber} </p>
                <label htmlFor="Email Address">Email Address</label>
                <p> {emailAddress} </p>
            </header>
        </div>
    );
};

export default UserProfile;
