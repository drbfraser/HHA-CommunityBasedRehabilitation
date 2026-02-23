import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    FormControl,
    Grid,
    MenuItem,
    Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
    handleCancel,
    handleUpdateClientSubmit,
    handleArchiveConfirmation,
} from "@cbr/common/forms/Client/clientHandler";
import { genders, HCRType, IClient } from "@cbr/common/util/clients";
import { useZones } from "@cbr/common/util/hooks/zones";
import { getOtherDisabilityId, useDisabilities } from "@cbr/common/util/hooks/disabilities";
import history from "@cbr/common/util/history";
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common/util/endpoints";
import {
    updateClientfieldLabels,
    ClientDetailsFields,
    TClientFormValues,
    webClientDetailsValidationSchema,
} from "@cbr/common/forms/Client/clientFields";
import { IUser } from "@cbr/common/util/users";
import { ProfilePicCard } from "components/PhotoViewUpload/PhotoViewUpload";
import { clientFormStyles } from "../NewClient/ClientForm.styles";

interface IProps {
    clientInfo: IClient;
}

const ClientInfoForm = (props: IProps) => {
    const zones = useZones();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [user, setUser] = useState<IUser>();
    const [loadingError, setLoadingError] = useState<string>();
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);
    useEffect(() => {
        const getInfo = async () => {
            try {
                const user: IUser = (await (await apiFetch(Endpoint.USER_CURRENT)).json()) as IUser;
                setUser(user);
            } catch (e) {
                setLoadingError(
                    e instanceof APIFetchFailError && e.details
                        ? `${e}: ${e.details}`
                        : (e as string),
                );
            }
        };
        getInfo();
    }, []);

    return (
        <Formik
            initialValues={
                {
                    ...props.clientInfo,
                    [ClientDetailsFields.pictureChanged]: false,
                } as TClientFormValues
            }
            validationSchema={webClientDetailsValidationSchema}
            onReset={(values: TClientFormValues, formikHelpers) => {
                formikHelpers.setFieldValue(ClientDetailsFields.pictureChanged, false);
            }}
            onSubmit={(values: TClientFormValues, formikHelpers) => {
                handleUpdateClientSubmit(values, formikHelpers, setIsEditing)
                    .then(() =>
                        formikHelpers.setFieldValue(ClientDetailsFields.pictureChanged, false),
                    )
                    .catch((e) =>
                        alert(
                            `${t("clientFields.errorEditingClient")}: ${
                                e instanceof APIFetchFailError ? JSON.stringify(e.response) : e
                            }`,
                        ),
                    );
            }}
        >
            {({
                isSubmitting,
                resetForm,
                setFieldValue,
                values,
            }: FormikProps<TClientFormValues>) => (
                <Grid container direction="row" justifyContent="flex-start" spacing={2}>
                    <Grid item md={2} xs={12}>
                        <ProfilePicCard
                            clientId={props.clientInfo.id}
                            isEditing={isEditing}
                            onPictureChange={(newPictureURL) => {
                                setFieldValue(ClientDetailsFields.picture, newPictureURL);
                                setFieldValue(ClientDetailsFields.pictureChanged, true);
                            }}
                            picture={values.picture}
                        />
                        <Grid container direction="row" spacing={1}>
                            <Grid sx={clientFormStyles.sideFormButtonWrapper} item md={10} xs={12}>
                                <Button
                                    sx={clientFormStyles.sideFormButton}
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    onClick={() =>
                                        history.push(`/client/${props.clientInfo.id}/visits/new`)
                                    }
                                    disabled={isSubmitting || !values.is_active}
                                >
                                    {t("visitAttr.newVisit")}
                                </Button>
                            </Grid>
                            <Grid sx={clientFormStyles.sideFormButtonWrapper} item md={10} xs={12}>
                                <Button
                                    sx={clientFormStyles.sideFormButton}
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    onClick={() =>
                                        history.push(`/client/${props.clientInfo.id}/referrals/new`)
                                    }
                                    disabled={isSubmitting || !values.is_active}
                                >
                                    {t("referralAttr.newReferral")}
                                </Button>
                            </Grid>
                            <Grid sx={clientFormStyles.sideFormButtonWrapper} item md={10} xs={12}>
                                <Button
                                    sx={clientFormStyles.sideFormButton}
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    onClick={() =>
                                        history.push(`/client/${props.clientInfo.id}/surveys/new`)
                                    }
                                    disabled={isSubmitting || !values.is_active}
                                >
                                    {t("surveyAttr.baselineSurvey")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item md={10} xs={12}>
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        sx={clientFormStyles.disabledTextField}
                                        component={TextField}
                                        name={ClientDetailsFields.first_name}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        label={
                                            updateClientfieldLabels[ClientDetailsFields.first_name]
                                        }
                                        required
                                        fullWidth
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        sx={clientFormStyles.disabledTextField}
                                        name={ClientDetailsFields.last_name}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        label={
                                            updateClientfieldLabels[ClientDetailsFields.last_name]
                                        }
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
                                        sx={clientFormStyles.disabledTextField}
                                        disabled={!isEditing}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        label={
                                            updateClientfieldLabels[ClientDetailsFields.birth_date]
                                        }
                                        name={ClientDetailsFields.birth_date}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl
                                        sx={clientFormStyles.disabledTextField}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        <Field
                                            component={TextField}
                                            fullWidth
                                            select
                                            disabled={!isEditing}
                                            required
                                            variant="outlined"
                                            label={
                                                updateClientfieldLabels[ClientDetailsFields.gender]
                                            }
                                            name={ClientDetailsFields.gender}
                                            autoComplete="off"
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
                                        disabled={!isEditing}
                                        sx={clientFormStyles.disabledTextField}
                                        name={ClientDetailsFields.village}
                                        label={updateClientfieldLabels[ClientDetailsFields.village]}
                                        required
                                        fullWidth
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        sx={clientFormStyles.disabledTextField}
                                    >
                                        <Field
                                            component={TextField}
                                            fullWidth
                                            select
                                            disabled={!isEditing}
                                            required
                                            variant="outlined"
                                            label={
                                                updateClientfieldLabels[
                                                    ClientDetailsFields.hcr_type
                                                ]
                                            }
                                            name={ClientDetailsFields.hcr_type}
                                            autoComplete="off"
                                        >
                                            {/* Show current value if it is 'NA' but don't allow selecting it in the dropdown*/}
                                            {props?.clientInfo[ClientDetailsFields.hcr_type] ===
                                                HCRType.NOT_SET && (
                                                <MenuItem value={HCRType.NOT_SET}>
                                                    {t("clientFields.na")}
                                                </MenuItem>
                                            )}
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
                                            disabled={!isEditing}
                                            select
                                            sx={clientFormStyles.disabledTextField}
                                            variant="outlined"
                                            required
                                            label={
                                                updateClientfieldLabels[ClientDetailsFields.zone]
                                            }
                                            name={ClientDetailsFields.zone}
                                            autoComplete="off"
                                        >
                                            {Array.from(zones)
                                                .sort((a, b) => a[1].localeCompare(b[1]))
                                                .map(([id, name]) => (
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
                                        disabled={!isEditing}
                                        sx={clientFormStyles.disabledTextField}
                                        name={ClientDetailsFields.phone_number}
                                        variant="outlined"
                                        label={
                                            updateClientfieldLabels[
                                                ClientDetailsFields.phone_number
                                            ]
                                        }
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
                                        sx={clientFormStyles.disabledTextField}
                                        disabled={!isEditing}
                                        label={
                                            updateClientfieldLabels[ClientDetailsFields.disability]
                                        }
                                        required
                                        name={ClientDetailsFields.disability}
                                        variant="outlined"
                                        autoComplete="off"
                                    >
                                        {Array.from(disabilities).map(([id, name]) => (
                                            <MenuItem key={id} value={id}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    {(values[ClientDetailsFields.disability] as number[]).includes(
                                        getOtherDisabilityId(disabilities),
                                    ) && (
                                        <div>
                                            <br />
                                            <Field
                                                component={TextField}
                                                sx={clientFormStyles.disabledTextField}
                                                fullWidth
                                                label={
                                                    updateClientfieldLabels[
                                                        ClientDetailsFields.other_disability
                                                    ]
                                                }
                                                disabled={!isEditing}
                                                required
                                                name={ClientDetailsFields.other_disability}
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
                                        disabled={!isEditing}
                                        sx={clientFormStyles.disabledTextField}
                                        name={ClientDetailsFields.caregiver_present}
                                        Label={{
                                            label: updateClientfieldLabels[
                                                ClientDetailsFields.caregiver_present
                                            ],
                                        }}
                                    />
                                </Grid>
                                {values.caregiver_present && (
                                    <Grid item md={7} xs={12}>
                                        <Accordion
                                            sx={clientFormStyles.caregiverAccordion}
                                            defaultExpanded
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                {t("clientFields.caregiverDetails")}:
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container direction="row" spacing={2}>
                                                    <Grid item md={8} xs={12}>
                                                        <Field
                                                            sx={{
                                                                ...clientFormStyles.caregiverInputField,
                                                                ...clientFormStyles.disabledTextField,
                                                            }}
                                                            component={TextField}
                                                            disabled={!isEditing}
                                                            name={
                                                                ClientDetailsFields.caregiver_name
                                                            }
                                                            variant="outlined"
                                                            label={
                                                                updateClientfieldLabels[
                                                                    ClientDetailsFields
                                                                        .caregiver_name
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
                                                                ClientDetailsFields.caregiver_email
                                                            }
                                                            disabled={!isEditing}
                                                            variant="outlined"
                                                            label={
                                                                updateClientfieldLabels[
                                                                    ClientDetailsFields
                                                                        .caregiver_email
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
                                                                ClientDetailsFields.caregiver_phone
                                                            }
                                                            disabled={!isEditing}
                                                            variant="outlined"
                                                            label={
                                                                updateClientfieldLabels[
                                                                    ClientDetailsFields
                                                                        .caregiver_phone
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
                                )}
                                {!values.is_active && (
                                    <Typography color="textSecondary">
                                        {t("clientAttr.archivedClientAccessAlert")}
                                    </Typography>
                                )}
                            </Grid>

                            <br />
                            <Grid justifyContent="flex-end" container spacing={2}>
                                {isEditing ? (
                                    <>
                                        <Grid item>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {t("general.save")}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    handleCancel(resetForm, setIsEditing);
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                {t("general.cancel")}
                                            </Button>
                                        </Grid>
                                    </>
                                ) : (
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                setIsEditing(true);
                                            }}
                                            disabled={!values.is_active}
                                        >
                                            {t("general.edit")}
                                        </Button>
                                    </Grid>
                                )}
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        disabled={isSubmitting}
                                        type="submit"
                                        onClick={() => {
                                            values.is_active = handleArchiveConfirmation(
                                                values,
                                                user!,
                                                loadingError,
                                            );
                                        }}
                                    >
                                        {values.is_active
                                            ? t("general.archive")
                                            : t("general.dearchive")}
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

export default ClientInfoForm;
