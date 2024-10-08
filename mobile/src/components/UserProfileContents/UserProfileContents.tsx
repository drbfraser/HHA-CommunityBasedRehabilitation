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
import ConflictDialog from "../../components/ConflictDialog/ConflictDialog";
import { dbType } from "../../util/watermelonDatabase";
import { logger, SyncDB } from "../../util/syncHandler";
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation();

    const zones = useZones();

    const [isPassChangeDialogVisible, setPassChangeDialogVisibility] = useState(false);
    const [isPassChangedSnackbarVisible, setPassChangeSnackbarVisibility] = useState(false);

    const [isLogoutConfirmDialogVisible, setLogoutConfirmDialogVisibility] = useState(false);

    const resetDatabase = async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase();
            console.log("database cleared");
        });
    };
    return (
        <View style={styles.container}>
            <ConflictDialog />
            {isSelf ? (
                <Portal>
                    <Dialog
                        visible={isLogoutConfirmDialogVisible}
                        onDismiss={() => setLogoutConfirmDialogVisibility(false)}
                    >
                        {/* TODO: If the user has data made that isn't synced with the server,
                                 tell them about it. */}
                        <Dialog.Content>
                            <Text>{t("alert.logoutNotice")}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setLogoutConfirmDialogVisibility(false)}>
                                {t("general.cancel")}
                            </Button>
                            <Button onPress={authContext.logout}>{t("login.logout")}</Button>
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
                                    ? `${t("alert.generalFailure")} ${t("login.reLoginPrompt")}`
                                    : t("alert.actionFailure", {
                                          action: t("general.display"),
                                          object: t("general.user"),
                                      })
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

                            <Subheading style={styles.profileInfoHeader}>
                                {t("general.username")}
                            </Subheading>
                            <Text style={styles.profileInfoText}>{user.username}</Text>

                            <Subheading style={styles.profileInfoHeader}>
                                {t("general.id")}
                            </Subheading>
                            <Text style={styles.profileInfoText}>{user.id}</Text>

                            <Subheading style={styles.profileInfoHeader}>
                                {t("general.zone")}
                            </Subheading>
                            <Text style={styles.profileInfoText}>
                                {zones.get(user.zone) ?? `Unknown (ID ${user.zone})`}
                            </Text>

                            <Subheading style={styles.profileInfoHeader}>
                                {t("general.phoneNumber")}
                            </Subheading>
                            <Text style={styles.profileInfoText}>{user.phone_number}</Text>

                            <Subheading style={styles.profileInfoHeader}>
                                {t("general.type")}
                            </Subheading>
                            <Text style={styles.profileInfoText}>{userRoles[user.role].name}</Text>

                            <Subheading style={styles.profileInfoHeader}>
                                {t("general.status")}
                            </Subheading>
                            <Text style={styles.profileInfoText}>
                                {user.is_active ? t("general.active") : t("general.disabled")}
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
                                {t("general.edit")}
                            </Button>

                            <Button
                                style={styles.button}
                                icon="lock-open"
                                mode="text"
                                onPress={() => {
                                    setPassChangeDialogVisibility(true);
                                }}
                            >
                                {t("login.changePassword")}
                            </Button>

                            {isSelf ? (
                                <Button
                                    icon="logout"
                                    style={styles.button}
                                    mode="contained"
                                    onPress={() => setLogoutConfirmDialogVisibility(true)}
                                >
                                    {t("login.logout")}
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
                {t("login.passwordChangeConfirmation")}
            </Snackbar>
        </View>
    );
};

export default UserProfileContents;
