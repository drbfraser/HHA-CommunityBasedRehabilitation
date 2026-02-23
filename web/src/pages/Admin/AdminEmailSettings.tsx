import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { Button, Grid, Typography } from "@mui/material";
import * as Yup from "yup";

import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common/util/endpoints";
import { Validation } from "@cbr/common/util/validations";
import { Container, StyledForm } from "./Admin.styles";

type EmailSettingsFormValues = {
    from_email: string;
    to_email: string;
    from_email_password: string;
};

const normalizePassword = (value: string) => value.replace(/\s+/g, "");

const emptyValues: EmailSettingsFormValues = {
    from_email: "",
    to_email: "",
    from_email_password: "",
};

const AdminEmailSettings = () => {
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<EmailSettingsFormValues>(emptyValues);
    const [passwordSet, setPasswordSet] = useState(false);
    const [passwordUpdatedAt, setPasswordUpdatedAt] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(Endpoint.EMAIL_SETTINGS)
            .then((res) => res.json())
            .then((data) => {
                setInitialValues({
                    from_email: data.from_email ?? "",
                    to_email: data.to_email ?? "",
                    from_email_password: "",
                });
                setPasswordSet(Boolean(data.from_email_password_set));
                setPasswordUpdatedAt(
                    typeof data.password_updated_at === "number" && data.password_updated_at > 0
                        ? data.password_updated_at
                        : null
                );
            })
            .catch((e) => {
                const errMsg =
                    e instanceof APIFetchFailError ? e.details ?? e.message : (e as string);
                alert(errMsg);
            })
            .finally(() => setLoading(false));
    }, []);

    const validationSchema = useMemo(() => {
        const requiredMsg = "Required";
        return Yup.object().shape({
            from_email: Yup.string()
                .matches(Validation.emailRegExp, t("clientFields.emailAddressNotValid"))
                .required(requiredMsg),
            to_email: Yup.string()
                .matches(Validation.emailRegExp, t("clientFields.emailAddressNotValid"))
                .required(requiredMsg),
            from_email_password: Yup.string()
                .test("password-required", "App password is required", function (value) {
                    const cleaned = normalizePassword(value ?? "");
                    const fromEmailChanged =
                        (this.parent.from_email ?? "") !== initialValues.from_email;
                    if (!passwordSet || fromEmailChanged) {
                        return cleaned.length > 0;
                    }
                    return true;
                })
                .test("password-length", "App password must be 16 characters", (value) => {
                    const cleaned = normalizePassword(value ?? "");
                    if (!cleaned) {
                        return true;
                    }
                    return cleaned.length === 16;
                }),
        });
    }, [initialValues.from_email, passwordSet, t]);

    return (
        <Container>
            {loading ? (
                <Typography variant="body2">Loading...</Typography>
            ) : (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={(values, helpers) => {
                        const cleanedPassword = normalizePassword(values.from_email_password);
                        const payload: Record<string, string> = {
                            from_email: values.from_email.trim(),
                            to_email: values.to_email.trim(),
                        };
                        if (cleanedPassword) {
                            payload.from_email_password = cleanedPassword;
                        }

                        apiFetch(Endpoint.EMAIL_SETTINGS, "", {
                            method: "PUT",
                            body: JSON.stringify(payload),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                const nextValues = {
                                    from_email: data.from_email ?? payload.from_email,
                                    to_email: data.to_email ?? payload.to_email,
                                    from_email_password: "",
                                };
                                setInitialValues(nextValues);
                                setPasswordSet(Boolean(data.from_email_password_set));
                                setPasswordUpdatedAt(
                                    typeof data.password_updated_at === "number" &&
                                        data.password_updated_at > 0
                                        ? data.password_updated_at
                                        : null
                                );
                                helpers.resetForm({ values: nextValues });
                                alert("Email settings updated.");
                            })
                            .catch((e) => {
                                const errMsg =
                                    e instanceof APIFetchFailError
                                        ? e.details ?? e.message
                                        : (e as string);
                                alert(errMsg);
                            })
                            .finally(() => helpers.setSubmitting(false));
                    }}
                >
                    {({ isSubmitting, values }) => (
                        <StyledForm>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name="from_email"
                                        variant="outlined"
                                        label="From email"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name="to_email"
                                        variant="outlined"
                                        label="Recipient email"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name="from_email_password"
                                        variant="outlined"
                                        label="App password"
                                        type="password"
                                        fullWidth
                                    />
                                    {passwordSet ? (
                                        !values.from_email_password && (
                                            <Typography variant="caption" color="text.secondary">
                                                App password is already set. Leave blank to keep it.
                                            </Typography>
                                        )
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">
                                            App password has not been set yet. Enter one to enable
                                            email sending.
                                        </Typography>
                                    )}

                                    {/* Always show Gmail instructions */}
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        component="div"
                                        sx={{ mt: 0.5 }}
                                    >
                                        To get a Gmail app password:
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        component="ul"
                                        sx={{ margin: "4px 0 0 16px" }}
                                    >
                                        <li>Enable 2-Step Verification on the Gmail account.</li>
                                        <li>Go to Google Account → Security → App passwords.</li>
                                        <li>Create a new app password for “Mail”.</li>
                                        <li>Copy the 16-character password and paste it here.</li>
                                    </Typography>

                                    {passwordUpdatedAt && (
                                        <Typography variant="caption" color="text.secondary">
                                            Password last updated:{" "}
                                            {new Date(passwordUpdatedAt).toLocaleString()}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>

                            <Grid container justifyContent="flex-end">
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
                            </Grid>
                        </StyledForm>
                    )}
                </Formik>
            )}
        </Container>
    );
};

export default AdminEmailSettings;
