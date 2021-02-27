import React, { useState } from "react";
import { useStyles } from "../NewClient/ClientForm.styles";

import { IZone } from "util/cache";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";

import { fieldLabels, FormField, genderOptions, validationSchema } from "./formFields";

import {
    Button,
    Card,
    CardContent,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControl,
    Grid,
    MenuItem,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import { handleSubmit, handleCancel } from "./formHandler";

const ClientInfo = (props: any) => {
    const styles = useStyles();

    const [isEditing, setIsEditing] = useState<boolean>(false);

    return (
        <Formik
            initialValues={props.clientInfo}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, isSubmitting, resetForm }) => (
                <Grid container direction="row" justify="flex-start">
                    <Grid item md={2} xs={12}>
                        <Card className={styles.profileImgContainer}>
                            <CardContent>
                                {/* TODO: Change image src based on whether the client exists or not */}
                                <img
                                    className={styles.profilePicture}
                                    src="https://res.cloudinary.com/time2hack/image/upload/fa-user.png"
                                    alt="user-icon"
                                />
                                <div className={styles.uploadIcon}>
                                    <CloudUploadIcon />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={10} xs={12}>
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name={FormField.first_name}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        label={fieldLabels[FormField.first_name]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name={FormField.last_name}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        label={fieldLabels[FormField.last_name]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        required
                                        type="date"
                                        disabled={!isEditing}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        label={fieldLabels[FormField.birth_date]}
                                        name={FormField.birth_date}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            fullWidth
                                            select
                                            disabled={!isEditing}
                                            required
                                            variant="outlined"
                                            label={fieldLabels[FormField.gender]}
                                            name={FormField.gender}
                                        >
                                            {genderOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        name={FormField.village}
                                        label={fieldLabels[FormField.village]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            fullWidth
                                            disabled={!isEditing}
                                            select
                                            variant="outlined"
                                            required
                                            label={fieldLabels[FormField.zone]}
                                            name={FormField.zone}
                                        >
                                            {props.zoneOptions.map((option: IZone) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.zone_name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        disabled={!isEditing}
                                        name={FormField.phone_number}
                                        variant="outlined"
                                        label={fieldLabels[FormField.phone_number]}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        disabled={!isEditing}
                                        name={FormField.caregiver_present}
                                        Label={{ label: fieldLabels[FormField.caregiver_present] }}
                                    />
                                </Grid>
                                {values.caregiver_present ? (
                                    <Grid item md={8} xs={12}>
                                        <Accordion
                                            className={styles.caregiverAccordion}
                                            defaultExpanded
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                Caregiver Details:
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Field
                                                    disabled={!isEditing}
                                                    className={styles.caregiverInputField}
                                                    component={TextField}
                                                    name={FormField.caregiver_phone}
                                                    variant="outlined"
                                                    label={fieldLabels[FormField.caregiver_phone]}
                                                    fullWidth
                                                />
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                ) : (
                                    <></>
                                )}
                            </Grid>

                            <br />
                            <Grid justify="flex-end" container spacing={2}>
                                {isEditing ? (
                                    <>
                                        <Grid item>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                Save
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    handleCancel(resetForm, setIsEditing);
                                                }}
                                                type="reset"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </>
                                ) : (
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                setIsEditing(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Form>
                    </Grid>
                </Grid>
            )}
        </Formik>
    );
};

export default ClientInfo;
