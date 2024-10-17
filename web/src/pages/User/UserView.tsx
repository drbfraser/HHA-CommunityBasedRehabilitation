import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Alert, Skeleton } from "@material-ui/lab";

import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { APILoadError } from "@cbr/common/util/endpoints";
import { useZones } from "@cbr/common/util/hooks/zones";
import { useStyles } from "./styles";

const UserView = () => {
    const { t } = useTranslation();
    const styles = useStyles();
    const history = useHistory();
    const user = useCurrentUser();
    const zones = useZones();

    const handleChangePassword = () => {
        return history.push("/user/password");
    };

    return (
        <div className={styles.container}>
            {user === APILoadError ? (
                <Alert severity="error">{t("alert.generalFailureTryAgain")}</Alert>
            ) : user ? (
                <>
                    <div className={styles.header}>
                        <h1>
                            {user.first_name} {user.last_name}
                        </h1>
                        <Button
                            className={styles.changePasswordButton}
                            color="primary"
                            onClick={handleChangePassword}
                        >
                            <LockOpenIcon />
                            {t("login.changePassword")}
                        </Button>
                    </div>

                    <b>{t("general.username")}</b>
                    <p>{user.username}</p>

                    <b>{t("general.id")}</b>
                    <p> {user.id} </p>

                    <b>{t("general.zone")}</b>
                    <p> {zones.get(user.zone) ?? "Unknown"} </p>

                    <b>{t("general.phoneNumber")}</b>
                    <p> {user.phone_number} </p>

                    <div className={styles.logOutButton}>
                        <Button
                            onClick={() => history.push("/logout")}
                            color="primary"
                            variant="contained"
                        >
                            {t("login.logout")}
                        </Button>
                    </div>
                </>
            ) : (
                <Skeleton variant="rect" height={400} />
            )}
        </div>
    );
};

export default UserView;
