import React from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    FormControl,
    Grid,
    MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    clientFieldLabels,
    ClientField,
    clientInitialValues,
    newClientValidationSchema,
} from "@cbr/common/forms/Client/clientFields";
import { riskLevels } from "@cbr/common/util/risks";
import { HCRType, genders } from "@cbr/common/util/clients";
import { getOtherDisabilityId, useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { useZones } from "@cbr/common/util/hooks/zones";
import { ProfilePicCard } from "components/PhotoViewUpload/PhotoViewUpload";
import { handleNewWebClientSubmit, handleReset } from "@cbr/common/forms/Client/clientHandler";
import { clientFormStyles } from "./ClientForm.styles";

const ClientForm = () => {
    const zones = useZones();
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);

    return (
        <Formik
            initialValues={clientInitialValues}
            validationSchema={newClientValidationSchema}
            onSubmit={handleNewWebClientSubmit}
        >
            {({ values, isSubmitting, resetForm, touched, setFieldValue }) => (
                <Grid container direction="row" justifyContent="flex-start" spacing={2}>
                    <Grid item md={12} xs={12}>
                        <Field
                            component={CheckboxWithLabel}
                            color="secondary"
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
                                                autoComplete="off"
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
                                                autoComplete="off"
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
                                                autoComplete="off"
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
                                                    autoComplete="off"
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
                                                autoComplete="off"
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
                                                    label={clientFieldLabels[ClientField.hcrType]}
                                                    name={ClientField.hcrType}
                                                    autoComplete="off"
                                                >
                                                    <MenuItem value={HCRType.HOST_COMMUNITY}>
                                                        {t("clientFields.hostCommunity")}
                                                    </MenuItem>
                                                    <MenuItem value={HCRType.REFUGEE}>
                                                        {t("clientFields.refugee")}
                                                    </MenuItem>
                                                </Field>
                                            </FormControl>
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
                                                    defaultValue=""
                                                    name={ClientField.zone}
                                                    autoComplete="off"
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
                                                autoComplete="off"
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
                                                autoComplete="off"
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
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Field
                                                component={CheckboxWithLabel}
                                                type="checkbox"
                                                color="secondary"
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
                                                    sx={clientFormStyles.caregiverAccordion}
                                                    defaultExpanded
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                    >
                                                        {t("clientFields.caregiverDetails")}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Grid
                                                            container
                                                            direction="column"
                                                            spacing={1}
                                                        >
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    sx={
                                                                        clientFormStyles.caregiverInputField
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
                                                                    autoComplete="off"
                                                                />
                                                            </Grid>
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    sx={{
                                                                        ...clientFormStyles.caregiverInputField,
                                                                        ...clientFormStyles.disabledTextField,
                                                                    }}
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
                                                                    autoComplete="off"
                                                                />
                                                            </Grid>
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    sx={
                                                                        clientFormStyles.caregiverInputField
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
                                                                    autoComplete="off"
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
                                                    autoComplete="off"
                                                >
                                                    {Object.entries(riskLevels)
                                                        .filter(
                                                            ([_, { isDropDownOption }]) =>
                                                                isDropDownOption
                                                        )
                                                        .map(([value, { name }]) => (
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.healthRequirements
                                                    ]
                                                }
                                                name={ClientField.healthRequirements}
                                                autoComplete="off"
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
                                                autoComplete="off"
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
                                                    autoComplete="off"
                                                >
                                                    {Object.entries(riskLevels)
                                                        .filter(
                                                            ([_, { isDropDownOption }]) =>
                                                                isDropDownOption
                                                        )
                                                        .map(([value, { name }]) => (
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.educationRequirements
                                                    ]
                                                }
                                                name={ClientField.educationRequirements}
                                                autoComplete="off"
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
                                                autoComplete="off"
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
                                                    autoComplete="off"
                                                >
                                                    {Object.entries(riskLevels)
                                                        .filter(
                                                            ([_, { isDropDownOption }]) =>
                                                                isDropDownOption
                                                        )
                                                        .map(([value, { name }]) => (
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.socialRequirements
                                                    ]
                                                }
                                                name={ClientField.socialRequirements}
                                                autoComplete="off"
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
                                                autoComplete="off"
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
                                                    autoComplete="off"
                                                >
                                                    {Object.entries(riskLevels)
                                                        .filter(
                                                            ([_, { isDropDownOption }]) =>
                                                                isDropDownOption
                                                        )
                                                        .map(([value, { name }]) => (
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.nutritionRequirements
                                                    ]
                                                }
                                                name={ClientField.nutritionRequirements}
                                                autoComplete="off"
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
                                                autoComplete="off"
                                            />
                                        </Grid>
                                        <br />

                                        <Grid item md={6} xs={12}>
                                            <FormControl fullWidth variant="outlined">
                                                <Field
                                                    component={TextField}
                                                    select
                                                    variant="outlined"
                                                    required
                                                    label={
                                                        clientFieldLabels[ClientField.mentalRisk]
                                                    }
                                                    name={ClientField.mentalRisk}
                                                    autoComplete="off"
                                                >
                                                    {Object.entries(riskLevels)
                                                        .filter(
                                                            ([_, { isDropDownOption }]) =>
                                                                isDropDownOption
                                                        )
                                                        .map(([value, { name }]) => (
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
                                                label={
                                                    clientFieldLabels[
                                                        ClientField.mentalRequirements
                                                    ]
                                                }
                                                name={ClientField.mentalRequirements}
                                                autoComplete="off"
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
                                                label={clientFieldLabels[ClientField.mentalGoals]}
                                                name={ClientField.mentalGoals}
                                                autoComplete="off"
                                            />
                                        </Grid>
                                        <br />
                                        <Grid
                                            // todo: what is the purpose of this?  not displaying anything in either case
                                            item
                                            md={12}
                                            xs={12}
                                            sx={
                                                !values.interviewConsent && touched.interviewConsent
                                                    ? clientFormStyles.checkboxError
                                                    : {}
                                            }
                                        ></Grid>
                                    </Grid>
                                    <br />
                                    <br />
                                    <Grid justifyContent="flex-end" container spacing={2}>
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
