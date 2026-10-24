import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

// Returns true if the camera may be used, otherwise alerts the user and returns false.
// Checks the current status first and only requests when needed: on Android 16 with
// React Native < 0.81.5, requesting an already-granted permission never resolves until
// the app is backgrounded (https://github.com/expo/expo/issues/39480).
export const ensureCameraPermission = async (): Promise<boolean> => {
    const current = await ImagePicker.getCameraPermissionsAsync();
    if (current.granted) {
        return true;
    }

    const result = current.canAskAgain
        ? await ImagePicker.requestCameraPermissionsAsync()
        : current;
    if (result.granted) {
        return true;
    }

    if (result.canAskAgain) {
        Alert.alert("Permission required", "Camera permission is needed to take a photo.");
    } else {
        Alert.alert(
            "Permission required",
            "Camera access is turned off for this app. To take photos, allow it in Settings.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: () => Linking.openSettings() },
            ]
        );
    }
    return false;
};

export const showImageError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    Alert.alert("Could not get photo", message);
};
