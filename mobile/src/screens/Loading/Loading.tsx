import { Image, View } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native-paper";
import useStyles from "./Loading.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import { useAppTheme } from "@/src/util/theme.styles";

interface LoadingProps {
    navigation: StackNavigationProp<StackParamList, StackScreenName.HOME>;
}

const Loading = (props: LoadingProps) => {
    const theme = useAppTheme();
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
