import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Skeleton,
    Typography,
} from "@mui/material";
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

    const handleReportBug = () => {
        return history.push("/report-bug");
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
                        <Box sx={userStyles.headerActions}>
                            <Button
                                sx={userStyles.changePasswordButton}
                                color="primary"
                                onClick={handleChangePassword}
                            >
                                <LockOpenIcon />
                                {t("login.changePassword")}
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={userStyles.profileRow}>
                        <Box sx={userStyles.profileItem}>
                            <Typography sx={userStyles.profileText}>
                                <strong>{t("general.username")}:</strong> {user.username}
                            </Typography>
                        </Box>
                        <Box sx={userStyles.profileItem}>
                            <Typography sx={userStyles.profileText}>
                                <strong>{t("general.zone")}:</strong>{" "}
                                {zones.get(user.zone) ?? "Unknown"}
                            </Typography>
                        </Box>
                        <Box sx={userStyles.profileItem}>
                            <Typography sx={userStyles.profileText}>
                                <strong>{t("general.phoneNumber")}:</strong> {user.phone_number}
                            </Typography>
                        </Box>
                    </Box>

                    <Card sx={userStyles.bugReportCard}>
                        <CardContent>
                            <Typography variant="h6">Submit a Bug Report or Suggestion</Typography>
                            <Typography variant="body2" sx={userStyles.bugReportDescription}>
                                Report app issues or share improvement ideas with the team.
                            </Typography>
                        </CardContent>
                        <CardActions sx={userStyles.bugReportCardActions}>
                            <Button variant="contained" onClick={handleReportBug}>
                                Open Report Form
                            </Button>
                        </CardActions>
                    </Card>

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
