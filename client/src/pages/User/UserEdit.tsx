import React, { Component } from "react";
import styles from "./Edit.module.css";
import { useHistory } from "react-router-dom";

const UserEdit = () => {
    // /user
    const history = useHistory();
    const handleCancel = () => history.push("/UserProfile");
    // const handleChange = (event)=> this.setState({value: event.target.value});
    let userName = "User Name";
    let id = "11111111";
    let location = "British Columbia, Canada";
    let phoneNumber = "(XXX) XXX-XXXX";
    let emailAddress = "XXXXXX@XXX.com";
    // handleChange(event) {
    //     this.setState({value: event.target.value});
    // }
    return (
        <div className={styles.container}>
            <p> {userName} </p>
            <form className={styles.form}>
                <label htmlFor="ID">ID</label>
                <p> {id} </p>

                <label htmlFor="Location">
                    Location
                    <br></br>
                    <input
                        type="text"
                        id="location"
                        className={styles.box}
                        // value={location}
                        // onChange={emailAddress }
                    />
                </label>
                <br></br>
                <label htmlFor="Phone Number">
                    Phone Number
                    <br></br>
                    <input
                        type="tel"
                        id="phoneNumber"
                        className={styles.box}
                        // value={phoneNumber}
                        // onChange={this.handleChange}
                    />
                </label>
                <br></br>

                <label htmlFor="Email Address">
                    Email Address
                    <br></br>
                    <input
                        type="email"
                        id="emailAddress"
                        className={styles.box}
                        // value={emailAddress}
                        // onChange={this.handleChange}
                    />
                </label>
            </form>

            <div className={styles.edit}>
                {/* <p>Edit</p> */}
                <br></br>
                <button className={styles.btn} type="submit" value="Submit">
                    Save
                </button>
                <button className={styles.btn} onClick={handleCancel}>
                    Cancel
                </button>
                
                <br></br>
            </div>
        </div>
    );
};

export default UserEdit;
