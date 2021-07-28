import HomeScreen from "../screens/HomeScreen/HomeScreen";
import BaseSurvey from "../screens/BaseSurvey/BaseSurvey";
import ClientDetails from "../screens/ClientDetails/ClientDetails";
import { StackScreenName } from "./StackScreenName";
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

export const stackScreenProps: Record<StackScreenName, (any: any) => JSX.Element> = {
    [StackScreenName.HOME]: HomeScreen,
    [StackScreenName.CLIENT]: ClientDetails,
    [StackScreenName.ADMIN_VIEW]: AdminView,
    [StackScreenName.ADMIN_EDIT]: AdminEdit,
    [StackScreenName.ADMIN_NEW]: AdminNew,
    [StackScreenName.VISIT]: NewVisit,
    [StackScreenName.REFERRAL]: NewReferral,
    [StackScreenName.BASE_SURVEY]: BaseSurvey,
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
    StackScreenName,
    TStackNavigationOptions<StackParamList, StackScreenName>
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
};

export type StackParamList = {
    [StackScreenName.HOME]: undefined;
    [StackScreenName.CLIENT]: {
        clientID: number;
    };
    [StackScreenName.VISIT]: {
        clientID: number;
    };
    [StackScreenName.REFERRAL]: {
        clientID: number;
    };
    [StackScreenName.BASE_SURVEY]: {
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
