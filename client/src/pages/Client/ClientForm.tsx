import React from "react";

import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";

import { useStyles } from "./ClientForm.styles";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import {
    fieldLabels,
    FormField,
    initialValues,
    genderOptions,
    zoneOptions,
    riskOptions,
    validationSchema,
} from "./formFields";
import { handleSubmit, handleReset } from "./formHandler";

const ClientForm = () => {
    const styles = useStyles();

    return (
        <Formik
            initialValues={initialValues}
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
                                        name={FormField.firstName}
                                        variant="outlined"
                                        label={fieldLabels[FormField.firstName]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name={FormField.lastName}
                                        variant="outlined"
                                        label={fieldLabels[FormField.lastName]}
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
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        label={fieldLabels[FormField.birthDate]}
                                        name={FormField.birthDate}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            fullWidth
                                            select
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
                                        type="number"
                                        variant="outlined"
                                        name={FormField.villageNo}
                                        label={fieldLabels[FormField.villageNo]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            fullWidth
                                            select
                                            variant="outlined"
                                            required
                                            label={fieldLabels[FormField.zone]}
                                            name={FormField.zone}
                                        >
                                            {zoneOptions.map((option) => (
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
                                        name={FormField.phoneNumber}
                                        variant="outlined"
                                        label={fieldLabels[FormField.phoneNumber]}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={12} xs={12} style={{ marginBottom: "-20px" }}>
                                    <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        name={FormField.interviewConsent}
                                        Label={{ label: fieldLabels[FormField.interviewConsent] }}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        name={FormField.caregiverPresent}
                                        Label={{ label: fieldLabels[FormField.caregiverPresent] }}
                                    />
                                </Grid>
                                {values.caregiverPresent ? (
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
                                                    className={styles.caregiverInputField}
                                                    component={TextField}
                                                    name={FormField.caregiverContact}
                                                    variant="outlined"
                                                    label={fieldLabels[FormField.caregiverContact]}
                                                    fullWidth
                                                />
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                ) : (
                                    <></>
                                )}

                                <Grid item md={12} xs={12}>
                                    <hr />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            select
                                            required
                                            variant="outlined"
                                            label={fieldLabels[FormField.healthRisk]}
                                            name={FormField.healthRisk}
                                        >
                                            {riskOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.healthRequirements]}
                                        name={FormField.healthRequirements}
                                    />
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        required
                                        variant="outlined"
                                        label={fieldLabels[FormField.healthGoals]}
                                        name={FormField.healthGoals}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            select
                                            required
                                            variant="outlined"
                                            label={fieldLabels[FormField.educationRisk]}
                                            name={FormField.educationRisk}
                                        >
                                            {riskOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        required
                                        variant="outlined"
                                        label={fieldLabels[FormField.educationRequirements]}
                                        name={FormField.educationRequirements}
                                    />
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.educationGoals]}
                                        name={FormField.educationGoals}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            select
                                            variant="outlined"
                                            required
                                            label={fieldLabels[FormField.socialRisk]}
                                            name={FormField.socialRisk}
                                        >
                                            {riskOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.socialRequirements]}
                                        name={FormField.socialRequirements}
                                    />
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.socialGoals]}
                                        name={FormField.socialGoals}
                                    />
                                </Grid>
                            </Grid>

                            <br />
                            <Grid justify="flex-end" container spacing={2}>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Create
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleReset(resetForm)}
                                        disabled={isSubmitting}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    </Grid>
                </Grid>
            )}
        </Formik>
    );
};

export default ClientForm;
