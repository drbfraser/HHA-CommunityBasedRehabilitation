import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EditIcon from "@material-ui/icons/Edit";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Button } from "@material-ui/core";
import { Alert, Skeleton } from "@material-ui/lab";

import { userRoles } from "@cbr/common/util/users";
import { useZones } from "@cbr/common/util/hooks/zones";
import { IRouteParams } from "@cbr/common/forms/Admin/adminFields";
import { useStyles } from "./styles";
import { useUser } from "util/hooks/useUser";

const AdminView = () => {
    const styles = useStyles();
    const history = useHistory();
    const zones = useZones();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user, loadingError] = useUser(userId);
    const { t } = useTranslation();

    const handleEdit = () => history.push(`/admin/edit/${userId}`);
    const handlePasswordEdit = () => history.push(`/admin/password/${userId}`);

    return (
        <div className={styles.container}>
            {loadingError ? (
                <Alert severity="error">
                    {t("alert.loadUserFailure")}
                    {loadingError}
                </Alert>
            ) : user ? (
                <>
                    <div className={styles.header}>
                        <h1>
                            {user.first_name} {user.last_name}
                        </h1>
                        <div className={styles.editButton}>
                            <Button color="primary" onClick={handleEdit}>
                                <EditIcon />
                                {t("general.edit")}
                            </Button>
                            <Button color="primary" onClick={handlePasswordEdit}>
                                <LockOpenIcon />
                                {t("login.changePassword")}
                            </Button>
                        </div>
                    </div>
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
                <Skeleton variant="rect" height={500} />
            )}
        </div>
    );
};

export default AdminView;
