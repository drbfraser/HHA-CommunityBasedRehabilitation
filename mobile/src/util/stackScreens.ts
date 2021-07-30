import HomeScreen from "../screens/HomeScreen/HomeScreen";
import BaseSurvey from "../screens/BaseSurvey/BaseSurvey";
import ClientDetails from "../screens/ClientDetails/ClientDetails";
import { StackScreenName } from "./StackScreenName";
import { StackNavigationProp } from "@react-navigation/stack";
import AdminView from "../screens/Admin/AdminView";
import AdminEdit from "../screens/Admin/AdminEdit";
import { IUser } from "@cbr/common";
import AdminNew from "../screens/Admin/AdminNew";
import NewReferral from "../screens/NewReferral/NewReferral";
import NewVisit from "../screens/NewVisit/NewVisit";

export const stackScreenProps = {
    [StackScreenName.HOME]: HomeScreen,
    [StackScreenName.CLIENT]: ClientDetails,
    [StackScreenName.ADMIN_VIEW]: AdminView,
    [StackScreenName.ADMIN_EDIT]: AdminEdit,
    [StackScreenName.ADMIN_NEW]: AdminNew,
    [StackScreenName.REFERRAL]: NewReferral,
    [StackScreenName.BASE_SURVEY]: BaseSurvey,
    [StackScreenName.VISIT]: NewVisit,
};

export type StackParamList = {
    [StackScreenName.HOME]: undefined;
    [StackScreenName.CLIENT]: {
        clientID: number;
    };
    [StackScreenName.REFERRAL]: {
        clientID: number;
    };
    [StackScreenName.BASE_SURVEY]: {
        clientID: number;
    };
    [StackScreenName.VISIT]: {
        clientID: number;
    };
    [StackScreenName.ADMIN_VIEW]: {
        userID: number;
        /**
         * For use when returning from the user edit and new user screens to prevent unnecessary
         * network calls
         */
        userInfo?: { isNewUser: boolean; user: IUser };
    };
    [StackScreenName.ADMIN_EDIT]: {
        user: IUser;
    };
    [StackScreenName.ADMIN_NEW]: undefined;
};

export type AppStackNavProp = StackNavigationProp<StackParamList>;
