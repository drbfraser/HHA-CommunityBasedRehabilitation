import React, { useState } from "react";
import { useStyles } from "./Edit.styles";
// import { Field, Form, Formik } from "formik";
// import { TextField } from "formik-material-ui";
// import Grid from "@material-ui/core/Grid";
// import { fieldLabels, FormField, initialValues, validationSchema } from "./fields";
// import Button from "@material-ui/core/Button";

const Edit = (props: any) => {
    const styles = useStyles();

    const [state, setState] = useState({
        userName: "User Name",
        id: "11111111",
        location: "British Columbia, Canada",
        phoneNumber: "(XXX) XXX-XXXX",
        emailAddress: "XXXXXX@XXX.com",
    });

    const handleCancel = () => props.setProps(false);
    // https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
    function handleChange(evt: any) {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.id]: value,
        });
    }

    // Todo: Submit using alter right now, after connecting with database,
    // change it use post to update the database.
    const handleSubmit = () => {
        alert(
            "As submitted: location:" +
                state.location +
                " emailAddress: " +
                state.emailAddress +
                " phoneNumber: " +
                state.phoneNumber
        );
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.head}> {state.userName} </h1>
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
                        placeholder={state.location}
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
                        placeholder={state.phoneNumber}
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
                        placeholder={state.emailAddress}
                        onChange={handleChange}
                    />
                </label>
            </form>
            <div>
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

export default Edit;

{
    // Forms from Ethan's form example
    /* <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
    >
        <div className={styles.container}>
            <h1 className={styles.head}> {state.userName} </h1>
            <br></br>
            <label htmlFor="ID">ID</label>
                <p> {state.id} </p>
            <br></br>  
            
            <Form className={styles.form}>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Field
                            component={TextField}
                            fullWidth
                            required
                            variant="outlined"
                            label={fieldLabels[FormField.addressInput]}
                            name={FormField.addressInput}
                        />
                    </Grid>
                </Grid>   
            </Form>

            <br></br>
            <Form className={styles.form}>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Field
                            component={TextField}
                            fullWidth
                            required
                            variant="outlined"
                            label={fieldLabels[FormField.telephoneInput]}
                            name={FormField.telephoneInput}
                        />
                    </Grid>
                </Grid>   
            </Form>
            <br></br>
            <Form className={styles.form}>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Field
                            component={TextField}
                            fullWidth
                            required
                            variant="outlined"
                            label={fieldLabels[FormField.emailInput]}
                            name={FormField.emailInput}
                        />
                    </Grid>
                </Grid>   
</Form></Formik>} */
}
