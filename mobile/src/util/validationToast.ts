import { Platform, ToastAndroid } from "react-native";

export const showValidationErrorToast = () => {
    const msg = "Please check one or more fields.";
    if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
};
