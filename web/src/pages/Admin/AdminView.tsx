import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Alert, Box, Button, Skeleton } from "@mui/material";

import { userRoles } from "@cbr/common/util/users";
import { useZones } from "@cbr/common/util/hooks/zones";
import { IRouteParams } from "@cbr/common/forms/Admin/adminFields";
import { useUser } from "util/hooks/useUser";
import { adminStyles } from "./Admin.styles";

const AdminView = () => {
    const history = useHistory();
    const zones = useZones();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user, loadingError] = useUser(userId);
    const { t } = useTranslation();

    const handleEdit = () => history.push(`/admin/edit/${userId}`);
    const handlePasswordEdit = () => history.push(`/admin/password/${userId}`);

    return (
        <Box sx={adminStyles.container}>
            {loadingError ? (
                <Alert severity="error">
                    {t("alert.loadUserFailure")}
                    {loadingError}
                </Alert>
            ) : user ? (
                <>
                    <Box sx={adminStyles.header}>
                        <h1>
                            {user.first_name} {user.last_name}
                        </h1>
                        <Box sx={adminStyles.editButton}>
                            <Button color="primary" onClick={handleEdit}>
                                <EditIcon />
                                {t("general.edit")}
                            </Button>
                            <Button color="primary" onClick={handlePasswordEdit}>
                                <LockOpenIcon />
                                {t("login.changePassword")}
                            </Button>
                        </Box>
                    </Box>
                    <b>{t("admin.username")}</b>
                    <p>{user.username}</p>

                    <b>{t("general.id")}</b>
                    <p> {userId} </p>

                    <b>{t("admin.zone")}</b>
                    <p> {zones.get(user.zone) ?? "Unknown"} </p>

                    <b>{t("general.phoneNumber")}</b>
                    <p> {user.phone_number} </p>

                    <b>{t("general.type")}</b>
                    <p> {userRoles[user.role].name} </p>

                    <b>{t("admin.status")}</b>
                    <p> {user.is_active ? t("general.active") : t("general.disabled")} </p>
                </>
            ) : (
                <Skeleton variant="rectangular" height={500} />
            )}
        </Box>
    );
};

export default AdminView;
