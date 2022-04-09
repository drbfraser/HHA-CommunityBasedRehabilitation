import { Alert } from "react-native";

export const showGenericAlert = (title: string, subtitle: string) => {
    Alert.alert(
        title,
        subtitle,
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
