import React, { useContext, useState } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext/AuthContext";
import { ScrollView, View } from "react-native";
import Alert from "../Alert/Alert";
import { Button, Dialog, Portal, Snackbar, Subheading, Text, Title } from "react-native-paper";
import { IUser, userRoles, useZones } from "@cbr/common";
import useStyles from "./UserProfileContents.styles";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useNavigation } from "@react-navigation/core";
import { AppStackNavProp } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import { dbType } from "../../util/watermelonDatabase";

export interface Props {
    user: IUser | null;
    /**
     * Whether the view should be for viewing the logged-in user's current profile. Logout button
     * will be visible and other properties only visible through admin view will be hidden.
     */
    isSelf: boolean;
    database: dbType;
}

const UserProfileContents = ({ user, isSelf, database }: Props) => {
    const styles = useStyles();
    const navigation = useNavigation<AppStackNavProp>();

    const authContext = useContext<IAuthContext>(AuthContext);

    const zones = useZones();

    const [isPassChangeDialogVisible, setPassChangeDialogVisibility] = useState(false);
    const [isPassChangedSnackbarVisible, setPassChangeSnackbarVisibility] = useState(false);

    const [isLogoutConfirmDialogVisible, setLogoutConfirmDialogVisibility] = useState(false);
    return (
        <View style={styles.container}>
            {isSelf ? (
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
            ) : null}

            <ScrollView keyboardShouldPersistTaps="always">
                {!user ? (
                    <View style={styles.loadingContainer}>
                        <Alert
                            severity="error"
                            text={
                                isSelf
                                    ? "Something went wrong. Please login again."
                                    : "Something went wrong trying to display this user."
                            }
                        />
                        {isSelf ? (
                            <Button
                                style={styles.button}
                                mode="contained"
                                onPress={() => setLogoutConfirmDialogVisibility(true)}
                            >
                                Logout
                            </Button>
                        ) : null}
                    </View>
                ) : (
                    <>
                        <Portal>
                            <ChangePasswordDialog
                                user={user}
                                isSelf={isSelf}
                                database={database}
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
                                {zones.get(user.zone) ?? `Unknown (ID ${user.zone})`}
                            </Text>

                            <Subheading style={styles.profileInfoHeader}>Phone number</Subheading>
                            <Text style={styles.profileInfoText}>{user.phone_number}</Text>

                            <Subheading style={styles.profileInfoHeader}>Type</Subheading>
                            <Text style={styles.profileInfoText}>{userRoles[user.role].name}</Text>

                            <Subheading style={styles.profileInfoHeader}>Status</Subheading>
                            <Text style={styles.profileInfoText}>
                                {user.is_active ? "Active" : "Disabled"}
                            </Text>

                            <Button
                                style={styles.button}
                                icon="account-edit"
                                mode="text"
                                onPress={() => {
                                    navigation.navigate(StackScreenName.ADMIN_EDIT, {
                                        user: user,
                                    });
                                }}
                            >
                                Edit
                            </Button>

                            <Button
                                style={styles.button}
                                icon="lock-open"
                                mode="text"
                                onPress={() => {
                                    setPassChangeDialogVisibility(true);
                                }}
                            >
                                Change password
                            </Button>

                            {isSelf ? (
                                <Button
                                    icon="logout"
                                    style={styles.button}
                                    mode="contained"
                                    onPress={() => setLogoutConfirmDialogVisibility(true)}
                                >
                                    Logout
                                </Button>
                            ) : null}
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

export default UserProfileContents;
