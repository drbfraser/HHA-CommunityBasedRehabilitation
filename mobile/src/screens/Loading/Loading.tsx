import { Image, View } from "react-native";
import React, { useContext } from "react";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import useStyles from "./Loading.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../util/stackScreens";
import { Navigation } from "react-native-navigation";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { StackScreenName } from "../../util/StackScreenName";

interface LoadingProps {
    navigation: StackNavigationProp<StackParamList, StackScreenName.HOME>;
}

const Loading = (props: LoadingProps) => {
    const theme = useTheme();
    const styles = useStyles();
    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                resizeMode="contain"
                source={require("../../../assets/hha_logo_white.png")}
            />
            <ActivityIndicator animating color={theme.colors.onPrimary} size={75} />
        </View>
    );
};

export default Loading;
