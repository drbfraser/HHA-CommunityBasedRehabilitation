import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button, Alert, Skeleton } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { APILoadError } from "@cbr/common/util/endpoints";
import { useZones } from "@cbr/common/util/hooks/zones";
import { userStyles } from "./User.styles";

const UserView = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const user = useCurrentUser();
    const zones = useZones();

    const handleChangePassword = () => {
        return history.push("/user/password");
    };

    return (
        <Box sx={userStyles.container}>
            {user === APILoadError ? (
                <Alert severity="error">{t("alert.generalFailureTryAgain")}</Alert>
            ) : user ? (
                <>
                    <Box sx={userStyles.header}>
                        <h1>
                            {user.first_name} {user.last_name}
                        </h1>
                        <Button
                            sx={userStyles.changePasswordButton}
                            color="primary"
                            onClick={handleChangePassword}
                        >
                            <LockOpenIcon />
                            {t("login.changePassword")}
                        </Button>
                    </Box>

                    <b>{t("general.username")}</b>
                    <p>{user.username}</p>

                    <b>{t("general.zone")}</b>
                    <p> {zones.get(user.zone) ?? "Unknown"} </p>

                    <b>{t("general.phoneNumber")}</b>
                    <p> {user.phone_number} </p>
                    <Box sx={userStyles.logOutButton}>
                        <Button
                            onClick={() => history.push("/logout")}
                            color="primary"
                            variant="contained"
                        >
                            {t("login.logout")}
                        </Button>
                    </Box>
                </>
            ) : (
                <Skeleton variant="rectangular" height={400} />
            )}
        </Box>
    );
};

export default UserView;
