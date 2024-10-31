import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Alert, Skeleton } from "@material-ui/lab";
import { FormControl, MenuItem } from "@material-ui/core";

import { handleUserEditSubmit } from "@cbr/common/forms/Admin/adminFormsHandler";
import { APIFetchFailError } from "@cbr/common/util/endpoints";
import { userRoles } from "@cbr/common/util/users";
import { useZones } from "@cbr/common/util/hooks/zones";
import {
    AdminField,
    editUserValidationSchema,
    adminUserFieldLabels,
    IRouteParams,
} from "@cbr/common/forms/Admin/adminFields";
import history from "@cbr/common/util/history";
import { useUser } from "util/hooks/useUser";
import { adminStyles } from "./Admin.styles";

const AdminEdit = () => {
    const { t } = useTranslation();
    const zones = useZones();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user, loadingError] = useUser(userId);

    if (loadingError) {
        return (
            <Alert severity="error">
                {t("alert.loadUserFailure")} {loadingError}
            </Alert>
        );
    }

    return user && zones.size ? (
        <Formik
            initialValues={user}
            validationSchema={editUserValidationSchema}
            onSubmit={(values, formikHelpers) => {
                handleUserEditSubmit(values, formikHelpers)
                    .then(() => history.goBack())
                    .catch((e) => {
                        const errMsg =
                            e instanceof APIFetchFailError
                                ? e.buildFormError(adminUserFieldLabels)
                                : (e as string) ?? t("alert.editUserFailure");
                        alert(errMsg);
                    });
            }}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <Box sx={adminStyles.container}>
                    <b>{t("general.id")}</b>
                    <p>{userId}</p>
                    <b>{t("admin.username")}</b>
                    <p>{user.username}</p>

                    <Form>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.first_name}
                                    variant="outlined"
                                    label={adminUserFieldLabels[AdminField.first_name]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.last_name}
                                    variant="outlined"
                                    label={adminUserFieldLabels[AdminField.last_name]}
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
                                        label={adminUserFieldLabels[AdminField.zone]}
                                        name={AdminField.zone}
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
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={adminUserFieldLabels[AdminField.phone_number]}
                                    name={AdminField.phone_number}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <Field
                                        component={TextField}
                                        select
                                        required
                                        variant="outlined"
                                        label={adminUserFieldLabels[AdminField.role]}
                                        name={AdminField.role}
                                    >
                                        {Object.entries(userRoles).map(([value, { name }]) => (
                                            <MenuItem key={value} value={value}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />

                        <b>{t("admin.status")}</b>
                        <p>{values.is_active ? t("general.active") : t("general.disabled")}</p>
                        <br />

                        <Grid
                            container
                            direction="row"
                            spacing={2}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    ...(values.is_active
                                        ? adminStyles.disableBtn
                                        : adminStyles.activeBtn),
                                }}
                                disabled={isSubmitting}
                                onClick={() =>
                                    setFieldValue(AdminField.is_active, !values.is_active)
                                }
                            >
                                {values.is_active ? t("general.disable") : t("general.activate")}
                            </Button>
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    sx={adminStyles.btn}
                                >
                                    {t("general.save")}
                                </Button>

                                <Button color="primary" variant="outlined" onClick={history.goBack}>
                                    {t("general.cancel")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                </Box>
            )}
        </Formik>
    ) : (
        <Skeleton variant="rectangular" height={500} />
    );
};

export default AdminEdit;
