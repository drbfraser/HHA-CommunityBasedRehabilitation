import React, { useContext, useEffect, useState } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext/AuthContext";
import { ScrollView, View } from "react-native";
import Alert from "../../components/Alert/Alert";
import { Button, Dialog, Portal, Snackbar, Subheading, Text, Title } from "react-native-paper";
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

    const [isLogoutConfirmDialogVisible, setLogoutConfirmDialogVisibility] = useState(false);

    return (
        <View style={styles.container}>
            <Portal>
                <Dialog
                    visible={isLogoutConfirmDialogVisible}
                    onDismiss={() => setLogoutConfirmDialogVisibility(false)}
                >
                    {/* TODO: If the user has data made that isn't synced with the server,
                                 tell them about it. */}
                    <Dialog.Content>
                        <Text>Are you sure you want to logout?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setLogoutConfirmDialogVisibility(false)}>
                            Cancel
                        </Button>
                        <Button onPress={authContext.logout}>Logout</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <ScrollView keyboardShouldPersistTaps="always">
                {!user ? (
                    <View style={styles.errorAlertContainer}>
                        <Alert severity="error" text="Something went wrong. Please login again." />
                        <Button
                            style={styles.logoutButton}
                            mode="contained"
                            onPress={() => setLogoutConfirmDialogVisibility(true)}
                        >
                            Logout
                        </Button>
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
                            <Text style={styles.profileInfoText}>{user.username}</Text>

                            <Subheading style={styles.profileInfoHeader}>ID</Subheading>
                            <Text style={styles.profileInfoText}>{user.id}</Text>

                            <Subheading style={styles.profileInfoHeader}>Zone</Subheading>
                            <Text style={styles.profileInfoText}>
                                {zones.get(user.zone) ?? "Unknown"}
                            </Text>

                            <Subheading style={styles.profileInfoHeader}>Phone number</Subheading>
                            <Text style={styles.profileInfoText}>{user.phone_number}</Text>

                            <Button
                                style={styles.changePasswordButton}
                                icon="lock-open"
                                mode="text"
                                onPress={() => {
                                    setPassChangeDialogVisibility(true);
                                }}
                            >
                                Change password
                            </Button>

                            <Button
                                style={styles.logoutButton}
                                mode="contained"
                                onPress={() => setLogoutConfirmDialogVisibility(true)}
                            >
                                Logout
                            </Button>
                        </View>
                    </>
                )}
            </ScrollView>

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
