import { StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";

const useStyles = () => {
    const theme = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1, 
            marginHorizontal: 5
        }
    });
}

export default useStyles;
