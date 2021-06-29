import { Image, View } from "react-native";
import React from "react";
import { ActivityIndicator, useTheme } from "react-native-paper";
import useStyles from "./Loading.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, stackScreenName } from "../../util/screens";
import { Navigation } from "react-native-navigation";

interface LoadingProps {
    navigation: StackNavigationProp<stackParamList, stackScreenName.HOME>;
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
