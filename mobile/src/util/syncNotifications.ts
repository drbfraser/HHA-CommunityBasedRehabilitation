import { Platform, ToastAndroid } from "react-native";

const showToast = (message: string) => {
    if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        console.log(`[SYNC NOTICE] ${message}`);
    }
};

export const notifyAutoSyncStart = () => showToast("Automatic sync started");
export const notifyAutoSyncSuccess = () => showToast("Automatic sync completed");
export const notifyAutoSyncFailure = () => showToast("Automatic sync failed");
