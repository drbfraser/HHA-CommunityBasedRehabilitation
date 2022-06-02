import React from "react";
import { Field, Form, Formik } from "formik";
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
import {
    clientFieldLabels,
    ClientField,
    clientInitialValues,
    newClientValidationSchema,
} from "@cbr/common/forms/Client/clientFields";
import { riskLevels } from "@cbr/common/util/risks";
import { genders } from "@cbr/common/util/clients";
import { getOtherDisabilityId, useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { useZones } from "@cbr/common/util/hooks/zones";
import { ProfilePicCard } from "components/PhotoViewUpload/PhotoViewUpload";
import { handleNewWebClientSubmit, handleReset } from "@cbr/common/forms/Client/clientHandler";

const ClientForm = () => {
    const styles = useStyles();
    const zones = useZones();
    const disabilities = useDisabilities();

    return (
        <Formik
            initialValues={clientInitialValues}
            validationSchema={newClientValidationSchema}
            onSubmit={handleNewWebClientSubmit}
        >
            {({ values, isSubmitting, resetForm, touched, setFieldValue }) => (
                <Grid container direction="row" justify="flex-start" spacing={2}>
                    <Grid item md={12} xs={12}>
                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            name={ClientField.interviewConsent}
                            Label={{ label: clientFieldLabels[ClientField.interviewConsent] }}
                        />
                    </Grid>
                    {values.interviewConsent ? (
                        <>
                            <Grid item md={2} xs={12}>
                                <ProfilePicCard
                                    isEditing={true}
                                    onPictureChange={(newPictureURL) => {
                                        setFieldValue(ClientField.picture, newPictureURL);
                                        setFieldValue(ClientField.pictureChanged, true);
                                    }}
                                    picture={values.picture}
                                />
                            </Grid>
                            <Grid item md={10} xs={12}>
                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12}>
                                            <Field
                                                component={TextField}
                                                name={ClientField.firstName}
                                                variant="outlined"
                                                label={clientFieldLabels[ClientField.firstName]}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Field
                                                component={TextField}
                                                name={ClientField.lastName}
                                                variant="outlined"
                                                label={clientFieldLabels[ClientField.lastName]}
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
                                                label={clientFieldLabels[ClientField.birthDate]}
                                                name={ClientField.birthDate}
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
                                                    label={clientFieldLabels[ClientField.gender]}
                                                    name={ClientField.gender}
                                                >
                                                    {Object.entries(genders).map(
                                                        ([value, name]) => (
                                                            <MenuItem key={value} value={value}>
                                                                {name}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Field
                                                component={TextField}
                                                variant="outlined"
                                                name={ClientField.village}
                                                label={clientFieldLabels[ClientField.village]}
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
                                                    label={clientFieldLabels[ClientField.zone]}
                                                    name={ClientField.zone}
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
                                                name={ClientField.phoneNumber}
                                                variant="outlined"
                                                label={clientFieldLabels[ClientField.phoneNumber]}
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
                                                label={clientFieldLabels[ClientField.disability]}
                                                required
                                                name={ClientField.disability}
                                                variant="outlined"
                                            >
                                                {Array.from(disabilities).map(([id, name]) => (
                                                    <MenuItem key={id} value={id}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                            {(values[ClientField.disability] as number[]).includes(
                                                getOtherDisabilityId(disabilities)
                                            ) && (
                                                <div>
                                                    <br />
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.otherDisability
                                                            ]
                                                        }
                                                        required
                                                        name={ClientField.otherDisability}
                                                        variant="outlined"
                                                    />
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Field
                                                component={CheckboxWithLabel}
                                                type="checkbox"
                                                name={ClientField.caregiverPresent}
                                                Label={{
                                                    label: clientFieldLabels[
                                                        ClientField.caregiverPresent
                                                    ],
                                                }}
                                            />
                                        </Grid>
                                        {values.caregiverPresent ? (
                                            <Grid item md={7} xs={12}>
                                                <Accordion
                                                    className={styles.caregiverAccordion}
                                                    defaultExpanded
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                    >
                                                        Caregiver Details:
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Grid
                                                            container
                                                            direction="column"
                                                            spacing={1}
                                                        >
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    className={
                                                                        styles.caregiverInputField
                                                                    }
                                                                    component={TextField}
                                                                    name={ClientField.caregiverName}
                                                                    variant="outlined"
                                                                    label={
                                                                        clientFieldLabels[
                                                                            ClientField
                                                                                .caregiverName
                                                                        ]
                                                                    }
                                                                    fullWidth
                                                                />
                                                            </Grid>
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    className={`${styles.caregiverInputField} ${styles.disabledTextField}`}
                                                                    component={TextField}
                                                                    name={
                                                                        ClientField.caregiverEmail
                                                                    }
                                                                    variant="outlined"
                                                                    label={
                                                                        clientFieldLabels[
                                                                            ClientField
                                                                                .caregiverEmail
                                                                        ]
                                                                    }
                                                                    fullWidth
                                                                />
                                                            </Grid>
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    className={
                                                                        styles.caregiverInputField
                                                                    }
                                                                    component={TextField}
                                                                    name={
                                                                        ClientField.caregiverPhone
                                                                    }
                                                                    variant="outlined"
                                                                    label={
                                                                        clientFieldLabels[
                                                                            ClientField
                                                                                .caregiverPhone
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
                                                    label={
                                                        clientFieldLabels[ClientField.healthRisk]
                                                    }
                                                    name={ClientField.healthRisk}
                                                >
                                                    {Object.entries(riskLevels).map(
                                                        ([value, { name }]) => (
                                                            <MenuItem key={value} value={value}>
                                                                {name}
                                                            </MenuItem>
                                                        )
                                                    )}
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.healthRequirements
                                                    ]
                                                }
                                                name={ClientField.healthRequirements}
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
                                                label={clientFieldLabels[ClientField.healthGoals]}
                                                name={ClientField.healthGoals}
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <FormControl fullWidth variant="outlined">
                                                <Field
                                                    component={TextField}
                                                    select
                                                    required
                                                    variant="outlined"
                                                    label={
                                                        clientFieldLabels[ClientField.educationRisk]
                                                    }
                                                    name={ClientField.educationRisk}
                                                >
                                                    {Object.entries(riskLevels).map(
                                                        ([value, { name }]) => (
                                                            <MenuItem key={value} value={value}>
                                                                {name}
                                                            </MenuItem>
                                                        )
                                                    )}
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.educationRequirements
                                                    ]
                                                }
                                                name={ClientField.educationRequirements}
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
                                                label={
                                                    clientFieldLabels[ClientField.educationGoals]
                                                }
                                                name={ClientField.educationGoals}
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <FormControl fullWidth variant="outlined">
                                                <Field
                                                    component={TextField}
                                                    select
                                                    variant="outlined"
                                                    required
                                                    label={
                                                        clientFieldLabels[ClientField.socialRisk]
                                                    }
                                                    name={ClientField.socialRisk}
                                                >
                                                    {Object.entries(riskLevels).map(
                                                        ([value, { name }]) => (
                                                            <MenuItem key={value} value={value}>
                                                                {name}
                                                            </MenuItem>
                                                        )
                                                    )}
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.socialRequirements
                                                    ]
                                                }
                                                name={ClientField.socialRequirements}
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
                                                label={clientFieldLabels[ClientField.socialGoals]}
                                                name={ClientField.socialGoals}
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <FormControl fullWidth variant="outlined">
                                                <Field
                                                    component={TextField}
                                                    select
                                                    variant="outlined"
                                                    required
                                                    label={
                                                        clientFieldLabels[ClientField.nutritionRisk]
                                                    }
                                                    name={ClientField.nutritionRisk}
                                                >
                                                    {Object.entries(riskLevels).map(
                                                        ([value, { name }]) => (
                                                            <MenuItem key={value} value={value}>
                                                                {name}
                                                            </MenuItem>
                                                        )
                                                    )}
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.nutritionRequirements
                                                    ]
                                                }
                                                name={ClientField.nutritionRequirements}
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
                                                label={
                                                    clientFieldLabels[ClientField.nutritionGoals]
                                                }
                                                name={ClientField.nutritionGoals}
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
                                        ></Grid>
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
                        </>
                    ) : (
                        <></>
                    )}
                </Grid>
            )}
        </Formik>
    );
};

export default ClientForm;
