import React, { useContext, useEffect, useState } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext/AuthContext";
import { View } from "react-native";
import Alert from "../../components/Alert/Alert";
import { Button, Dialog, Portal, Subheading, Text, TextInput, Title } from "react-native-paper";
import { useZones } from "@cbr/common";
import { useCurrentUser } from "@cbr/common";
import theme from "../../theme.styles";
import useStyles from "./Profile.styles";
import ChangePasswordDialog from "./ChangePasswordDialog";

const Profile = () => {
    const styles = useStyles();

    const authContext = useContext<IAuthContext>(AuthContext);
    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    const zones = useZones();
    const user =
        authContext.authState.state === "loggedIn" ? authContext.authState.currentUser : null;

    const [isPassChangeDialogVisible, setPassChangeDialogVisibility] = useState<boolean>(false);

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
                            onDismiss={() => {
                                setPassChangeDialogVisibility(false);
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
        </View>
    );
};

export default Profile;
