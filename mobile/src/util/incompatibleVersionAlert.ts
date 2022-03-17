import { Alert } from "react-native";

export const showIncompatibleVersionAlert = () => {
    Alert.alert(
        "Sync Is Not Compatible With Your Current Version Of CBR",
        "Please install the newest update of CBR on the Google Play Store.",
        [
            {
                text: "Ok",
                style: "cancel",
            },
        ],
        {
            cancelable: true,
        }
    );
};
