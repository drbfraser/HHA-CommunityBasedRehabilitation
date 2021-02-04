import React from "react";

import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";

import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";

import {
    fieldLabels,
    FormField,
    initialValues,
    genderOptions,
    zoneOptions,
    riskOptions,
    validationSchema,
} from "./ClientFormFields";
import { handleSubmit } from "./ClientFormHandler";

const test = (e: any) => {
    alert("Test");
};

const ClientForm = () => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, isSubmitting }) => (
                <Grid container direction="row" justify="flex-start">
                    <Grid item md={2} xs={12}>
                        <Avatar
                            style={{ width: "250px", height: "250px" }}
                            alt="Remy Sharp"
                            src={initialValues.profilePicture}
                        />
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
                                        InputLabelProps={{ shrink: "true" }}
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
                                        name={FormField.contact}
                                        variant="outlined"
                                        label={fieldLabels[FormField.contact]}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={12} xs={12} style={{ marginBottom: "-20px" }}>
                                    <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        fullWidth
                                        name={FormField.interviewConsent}
                                        Label={{ label: fieldLabels[FormField.interviewConsent] }}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        fullWidth
                                        name={FormField.hasCaregiver}
                                        Label={{ label: fieldLabels[FormField.hasCaregiver] }}
                                    />
                                </Grid>
                                {values.hasCaregiver ? (
                                    <Grid item md={8} xs={12}>
                                        <Accordion
                                            style={{ background: "#e3e8f4" }}
                                            defaultExpanded
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                Caregiver Details:
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Avatar
                                                    alt="caregiver-image"
                                                    onClick={test.bind("e")}
                                                />
                                                <Field
                                                    style={{ background: "white" }}
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
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        type="reset"
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
