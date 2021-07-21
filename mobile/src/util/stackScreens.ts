import HomeScreen from "../screens/HomeScreen/HomeScreen";
import BaseSurvey from "../screens/BaseSurvey/BaseSurvey";
import ClientDetails from "../screens/ClientDetails/ClientDetails";
import { StackScreenName } from "./StackScreenName";
import { StackNavigationProp } from "@react-navigation/stack";
import AdminView from "../screens/Admin/AdminView";

export const stackScreenProps = {
    [StackScreenName.HOME]: HomeScreen,
    [StackScreenName.CLIENT]: ClientDetails,
    [StackScreenName.BASELINE]: BaseSurvey,
    [StackScreenName.ADMIN_VIEW]: AdminView,
};

export type StackParamList = {
    [StackScreenName.HOME]: undefined;
    [StackScreenName.CLIENT]: {
        clientID: number;
    };
    [StackScreenName.ADMIN_VIEW]: {
        userID: number;
    };
};

export type AppStackNavProp = StackNavigationProp<StackParamList>;
