import React from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";

import { useStyles } from "./ClientForm.styles";

import Button from "@material-ui/core/Button";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";

import { fieldLabels, FormField, initialValues, validationSchema } from "./formFields";

import { riskLevels } from "util/risks";
import { handleSubmit, handleReset } from "./formHandler";
import { genders } from "util/clients";
import { getOtherDisabilityId, useDisabilities } from "util/hooks/disabilities";
import { useZones } from "util/hooks/zones";
import { ProfilePicCard } from "components/PhotoViewUpload/PhotoViewUpload";

const ClientForm = () => {
    const styles = useStyles();
    const zones = useZones();
    const disabilities = useDisabilities();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, isSubmitting, resetForm, touched, setFieldValue }) => (
                <Grid container direction="row" justify="flex-start" spacing={2}>
                    <Grid item md={2} xs={12}>
                        <ProfilePicCard
                            isEditing={true}
                            setFieldValue={setFieldValue}
                            picture={values.picture}
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
                                            {Object.entries(genders).map(([value, name]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        variant="outlined"
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
                                            select
                                            variant="outlined"
                                            required
                                            label={fieldLabels[FormField.zone]}
                                            name={FormField.zone}
                                        >
                                            {Array.from(zones).map(([id, name]) => (
                                                <MenuItem key={id} value={id}>
                                                    {name}
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
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        select
                                        SelectProps={{
                                            multiple: true,
                                        }}
                                        label={fieldLabels[FormField.disability]}
                                        required
                                        name={FormField.disability}
                                        variant="outlined"
                                    >
                                        {Array.from(disabilities).map(([id, name]) => (
                                            <MenuItem key={id} value={id}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    {(values[FormField.disability] as number[]).includes(
                                        getOtherDisabilityId(disabilities)
                                    ) && (
                                        <div>
                                            <br />
                                            <Field
                                                component={TextField}
                                                fullWidth
                                                label={fieldLabels[FormField.otherDisability]}
                                                required
                                                name={FormField.otherDisability}
                                                variant="outlined"
                                            />
                                        </div>
                                    )}
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
                                    <Grid item md={7} xs={12}>
                                        <Accordion
                                            className={styles.caregiverAccordion}
                                            defaultExpanded
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                Caregiver Details:
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container direction="column" spacing={1}>
                                                    <Grid item md={8} xs={12}>
                                                        <Field
                                                            className={styles.caregiverInputField}
                                                            component={TextField}
                                                            name={FormField.caregiverName}
                                                            variant="outlined"
                                                            label={
                                                                fieldLabels[FormField.caregiverName]
                                                            }
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item md={8} xs={12}>
                                                        <Field
                                                            className={`${styles.caregiverInputField} ${styles.disabledTextField}`}
                                                            component={TextField}
                                                            name={FormField.caregiverEmail}
                                                            variant="outlined"
                                                            label={
                                                                fieldLabels[
                                                                    FormField.caregiverEmail
                                                                ]
                                                            }
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item md={8} xs={12}>
                                                        <Field
                                                            className={styles.caregiverInputField}
                                                            component={TextField}
                                                            name={FormField.caregiverPhone}
                                                            variant="outlined"
                                                            label={
                                                                fieldLabels[
                                                                    FormField.caregiverPhone
                                                                ]
                                                            }
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
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
                                            {Object.entries(riskLevels).map(([value, { name }]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
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
                                            {Object.entries(riskLevels).map(([value, { name }]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
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
                                            {Object.entries(riskLevels).map(([value, { name }]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
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
                                <br />
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    className={
                                        !values.interviewConsent && touched.interviewConsent
                                            ? styles.checkboxError
                                            : ""
                                    }
                                >
                                    <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        name={FormField.interviewConsent}
                                        Label={{ label: fieldLabels[FormField.interviewConsent] }}
                                        required
                                    />
                                    <ErrorMessage
                                        component="div"
                                        className={styles.errorMessage}
                                        name={FormField.interviewConsent}
                                    />
                                </Grid>
                            </Grid>
                            <br />
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
