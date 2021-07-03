import React, { useContext, useEffect, useState } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext/AuthContext";
import { View } from "react-native";
import Alert from "../../components/Alert/Alert";
import { Button, Portal, Snackbar, Subheading, Text, Title } from "react-native-paper";
import { useZones } from "@cbr/common";
import useStyles from "./Profile.styles";
import ChangePasswordDialog from "./ChangePasswordDialog";

const Profile = () => {
    const styles = useStyles();

    const authContext = useContext<IAuthContext>(AuthContext);
    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    // TODO: add cached data to some logged-in startup init process
    const zones = useZones();
    const user =
        authContext.authState.state === "loggedIn" ? authContext.authState.currentUser : null;

    const [isPassChangeDialogVisible, setPassChangeDialogVisibility] = useState(false);
    const [isPassChangedSnackbarVisible, setPassChangeSnackbarVisibility] = useState(false);

    return (
        <View style={styles.container}>
            {user === null ? (
                <View style={styles.errorAlertContainer}>
                    <Alert severity="error" text="Something went wrong. Please login again." />
                </View>
            ) : (
                <>
                    <Portal>
                        <ChangePasswordDialog
                            visible={isPassChangeDialogVisible}
                            onDismiss={(isSubmitSuccess) => {
                                setPassChangeDialogVisibility(false);
                                if (isSubmitSuccess) {
                                    setPassChangeSnackbarVisibility(true);
                                }
                            }}
                        />
                    </Portal>

                    <View style={styles.profileInfoContainer}>
                        <Title style={styles.userFirstLastNameTitle}>
                            {user.first_name} {user.last_name}
                        </Title>

                        <Subheading style={styles.profileInfoHeader}>Username</Subheading>
                        <Text>{user.username}</Text>

                        <Subheading style={styles.profileInfoHeader}>ID</Subheading>
                        <Text>{user.id}</Text>

                        <Subheading style={styles.profileInfoHeader}>Zone</Subheading>
                        <Text>{zones.get(user.zone) ?? "Unknown"}</Text>

                        <Subheading style={styles.profileInfoHeader}>Phone number</Subheading>
                        <Text>{user.phone_number}</Text>

                        <Button
                            icon="lock-open"
                            mode="text"
                            onPress={() => {
                                setPassChangeDialogVisibility(true);
                            }}
                        >
                            Change password
                        </Button>
                    </View>
                </>
            )}
            <Button style={styles.logoutButton} mode="contained" onPress={authContext.logout}>
                Logout
            </Button>
            <Snackbar
                visible={isPassChangedSnackbarVisible}
                duration={4000}
                onDismiss={() => setPassChangeSnackbarVisibility(false)}
            >
                Password changed successfully.
            </Snackbar>
        </View>
    );
};

export default Profile;
