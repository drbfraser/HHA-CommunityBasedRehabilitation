import HomeScreen from "../screens/HomeScreen/HomeScreen";
import BaseSurvey from "../screens/BaseSurvey/BaseSurvey";
import ClientDetails from "../screens/ClientDetails/ClientDetails";
import { StackScreenName, NoAuthScreenName } from "./StackScreenName";
import { StackNavigationOptions, StackNavigationProp } from "@react-navigation/stack";
import AdminView from "../screens/Admin/AdminView";
import AdminEdit from "../screens/Admin/AdminEdit";
import { IUser } from "@cbr/common";
import AdminNew from "../screens/Admin/AdminNew";
import NewReferral from "../screens/NewReferral/NewReferral";
import { RouteProp } from "@react-navigation/core/lib/typescript/src/types";
import { ParamListBase } from "@react-navigation/routers";
import React from "react";
import NewVisit from "../screens/NewVisit/NewVisit";
import DefaultHeader from "../components/DefaultHeader/DefaultHeader";
import Sync from "../screens/Sync/Sync";
import Login from "../screens/Login/Login";
import SwitchServer from "../screens/SwitchServer/SwitchServer";
import AlertInbox from "../screens/AlertInbox/AlertInbox";

export const stackScreenProps: Record<
    StackScreenName | NoAuthScreenName,
    (any: any) => JSX.Element
> = {
    [StackScreenName.HOME]: HomeScreen,
    [StackScreenName.CLIENT]: ClientDetails,
    [StackScreenName.ADMIN_VIEW]: AdminView,
    [StackScreenName.ADMIN_EDIT]: AdminEdit,
    [StackScreenName.ADMIN_NEW]: AdminNew,
    [StackScreenName.VISIT]: NewVisit,
    [StackScreenName.REFERRAL]: NewReferral,
    [StackScreenName.BASE_SURVEY]: BaseSurvey,
    [StackScreenName.SYNC]: Sync,
    [StackScreenName.ALERT_INBOX]: AlertInbox,
    [NoAuthScreenName.LOGIN]: Login,
    [NoAuthScreenName.SWITCH_SERVER]: SwitchServer,
};

type TStackNavigationOptions<ParamList extends ParamListBase, RouteName extends keyof ParamList> =
    | StackNavigationOptions
    | ((props: {
          route: RouteProp<ParamList, RouteName>;
          navigation: any;
      }) => StackNavigationOptions);

export type TAppRouteProp<ScreenName extends StackScreenName> = RouteProp<
    StackParamList,
    ScreenName
>;

export const stackScreenOptions: Record<
    StackScreenName | NoAuthScreenName,
    TStackNavigationOptions<StackParamList, StackScreenName | NoAuthScreenName>
> = {
    [StackScreenName.HOME]: {
        headerShown: false,
    },
    [StackScreenName.CLIENT]: ({ route, navigation }) => ({
        headerShown: true,
        header: DefaultHeader(
            "View client",
            `Client ID: ${(route as TAppRouteProp<StackScreenName.CLIENT>).params.clientID}`
        ),
    }),
    [StackScreenName.ADMIN_VIEW]: {
        headerShown: true,
        header: DefaultHeader("View user"),
    },
    [StackScreenName.ADMIN_EDIT]: {
        headerShown: true,
        header: DefaultHeader("Edit user"),
    },
    [StackScreenName.ADMIN_NEW]: {
        headerShown: true,
        header: DefaultHeader("New user"),
    },
    [StackScreenName.VISIT]: ({ route, navigation }) => ({
        headerShown: true,
        header: DefaultHeader(
            "New visit",
            `Client ID: ${(route as TAppRouteProp<StackScreenName.VISIT>).params.clientID}`
        ),
    }),
    [StackScreenName.REFERRAL]: ({ route, navigation }) => ({
        headerShown: true,
        header: DefaultHeader(
            "New referral",
            `Client ID: ${(route as TAppRouteProp<StackScreenName.REFERRAL>).params.clientID}`
        ),
    }),
    [StackScreenName.BASE_SURVEY]: ({ route, navigation }) => ({
        headerShown: true,
        header: DefaultHeader(
            "New baseline survey",
            `Client ID: ${(route as TAppRouteProp<StackScreenName.BASE_SURVEY>).params.clientID}`
        ),
    }),
    [StackScreenName.SYNC]: {
        headerShown: true,
        header: DefaultHeader("Synchronization"),
    },
    [StackScreenName.ALERT_INBOX]: {
        headerShown: true,
        header: DefaultHeader("Inbox"),
    },
    [NoAuthScreenName.LOGIN]: {
        headerShown: false,
    },
    [NoAuthScreenName.SWITCH_SERVER]: {
        headerShown: true,
        header: DefaultHeader("Switch Target Server"),
    },
};

export type StackParamList = {
    [StackScreenName.HOME]: undefined;
    [StackScreenName.CLIENT]: {
        clientID: string;
    };
    [StackScreenName.VISIT]: {
        clientID: string;
    };
    [StackScreenName.REFERRAL]: {
        clientID: string;
    };
    [StackScreenName.BASE_SURVEY]: {
        clientID: string;
    };
    [StackScreenName.ADMIN_VIEW]: {
        userID: string;
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
    [StackScreenName.SYNC]: undefined;
    [NoAuthScreenName.LOGIN]: undefined;
    [NoAuthScreenName.SWITCH_SERVER]: undefined;
};

export type AppStackNavProp = StackNavigationProp<StackParamList>;
