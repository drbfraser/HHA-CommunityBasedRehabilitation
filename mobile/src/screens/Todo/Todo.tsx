import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Text, Title, Button } from "react-native-paper";
import DialogWithRadioBtns from "../../util/DialogWithRadioBtn";
import BaseSurvey from "./BaseSurvey/BaseSurvey";
import useStyles from "./Todo.styles";
type ButtonVisibility = {
    [key: string]: boolean | undefined;
};
const Todo = () => {
    const [visible, setVisible] = React.useState<ButtonVisibility>({});

    const styles = useStyles();
    const navigation = useNavigation();
    const _toggleDialog = (name: string) => () =>
        setVisible({ ...visible, [name]: !visible[name] });
    const _getVisible = (name: string) => !!visible[name];
    return (
        <View style={styles.container}>
            <Button mode="outlined" onPress={_toggleDialog("dialog2")}>
                Radio buttons
            </Button>
            <DialogWithRadioBtns
                visible={_getVisible("dialog2")}
                close={_toggleDialog("dialog2")}
            />
            <Title>This is a placeholder component screen.</Title>
            <Text>Due to be removed, once the app reaches completion!</Text>
        </View>
    );
};

export default Todo;
