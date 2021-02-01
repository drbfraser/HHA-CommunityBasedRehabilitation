import React, { useState } from "react";
import styles from "./Edit.module.css";
import { useHistory } from "react-router-dom";

const UserEdit = () => {
    const history = useHistory();
    const handleCancel = () => history.push("/user");
    const handleSubmit = () => {
        alert("A name was submitted: " + state.emailAddress + state.location + state.phoneNumber);
    };
    // https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
    function handleChange(evt:any){
        // console.log("new value", evt.target.value);
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    }
    // const handleChange = (event)=> this.setState({value: event.target.value});
    const [state, setState] = React.useState({
        userName: "User Name",
        id: "11111111",
        location: "",
        phoneNumber: "",
        emailAddress: "",
    });
    // handleChange= (event)=> {
    //     setState({value: event.target.value});
    // }
    // let userName = "User Name";
    // let id = "11111111";
    // let location = "British Columbia, Canada";
    // let phoneNumber = "(XXX) XXX-XXXX";
    // let emailAddress = "XXXXXX@XXX.com";
    

    return (
        <div className={styles.container}>
            <p className={styles.p}> {state.userName} </p>
            <form className={styles.form}>
                <label htmlFor="ID">ID</label>
                <p> {state.id} </p>

                <label htmlFor="Location">
                    Location
                    <br></br>
                    <input
                        type="text"
                        id="location"
                        className={styles.box}
                        // value={state.location}
                        onChange={handleChange}
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
                        // value={state.phoneNumber}
                        onChange={handleChange}
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
                        // value={state.emailAddress}
                        // onChange={handleChange}
                    />
                </label>
            </form>

            <div className={styles.edit}>
                {/* <p>Edit</p> */}
                <br></br>
                <button className={styles.btn} type="submit" value="Submit" onClick={handleSubmit}>
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
