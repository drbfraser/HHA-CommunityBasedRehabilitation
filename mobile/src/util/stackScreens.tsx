import React from "react";

import HomeScreen from "../screens/HomeScreen/HomeScreen";
import BaseSurvey from "../screens/BaseSurvey/BaseSurvey";
import ClientDetails from "../screens/ClientDetails/ClientDetails";
import { StackScreenName, NoAuthScreenName } from "./StackScreenName";
import AdminView from "../screens/Admin/AdminView";
import AdminEdit from "../screens/Admin/AdminEdit";
import AdminNew from "../screens/Admin/AdminNew";
import NewReferral from "../screens/NewReferral/NewReferral";
import NewVisit from "../screens/NewVisit/NewVisit";
import DefaultHeader from "../components/DefaultHeader/DefaultHeader";
import Sync from "../screens/Sync/Sync";
import Login from "../screens/Login/Login";
import SwitchServer from "../screens/SwitchServer/SwitchServer";
import AlertInbox from "../screens/AlertInbox/AlertInbox";
import Referrals from "../screens/Referrals/Referrals";

import i18n from "i18next";
import type { RouteProp } from "@react-navigation/native";
import type {
    NativeStackNavigationOptions,
    NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import type { IUser } from "@cbr/common";

/** ---------- Screens map ---------- */
export const stackScreenProps: Record<
    StackScreenName | NoAuthScreenName,
    React.ComponentType<any>
> = {
    [StackScreenName.HOME]: HomeScreen,
    [StackScreenName.CLIENT]: ClientDetails,
    [StackScreenName.REFERRALS]: Referrals,
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

/** ---------- Param list ---------- */
export type StackParamList = {
    [StackScreenName.HOME]: undefined;
    [StackScreenName.CLIENT]: { clientID: string };
    [StackScreenName.VISIT]: { clientID: string };
    [StackScreenName.REFERRAL]: { clientID: string };
    [StackScreenName.BASE_SURVEY]: { clientID: string };
    [StackScreenName.ADMIN_VIEW]: {
        userID: string;
        userInfo?: { isNewUser: boolean; user: IUser };
    };
    [StackScreenName.ADMIN_EDIT]: { user: IUser };
    [StackScreenName.ADMIN_NEW]: undefined;
    [StackScreenName.REFERRALS]: undefined;
    [StackScreenName.SYNC]: undefined;
    [StackScreenName.ALERT_INBOX]: undefined;
    [NoAuthScreenName.LOGIN]: undefined;
    [NoAuthScreenName.SWITCH_SERVER]: undefined;
};

export type TAppRouteProp<ScreenName extends keyof StackParamList> = RouteProp<
    StackParamList,
    ScreenName
>;
export type AppStackNavProp = NativeStackNavigationProp<StackParamList>;

/** ---------- Options typing (non-recursive) ---------- */
// Per-screen options can be a static object or a function of route/navigation
type OptionsFn<RouteName extends keyof StackParamList = any> = (args: {
    route: RouteProp<StackParamList, RouteName>;
    navigation: NativeStackNavigationProp<StackParamList, RouteName>;
}) => NativeStackNavigationOptions;

type OptionsVal = NativeStackNavigationOptions | OptionsFn;

/** ---------- Options object (recomputed on i18n change) ---------- */
export let stackScreenOptions: Partial<Record<StackScreenName | NoAuthScreenName, OptionsVal>> = {};

const refreshArrays = () => {
    stackScreenOptions = {
        [StackScreenName.HOME]: {
            headerShown: false,
        },

        [StackScreenName.CLIENT]: ({ route }) => ({
            headerShown: true,
            header: DefaultHeader(
                i18n.t("clientAttr.viewClient"),
                `${i18n.t("general.client")} ${i18n.t("general.name")}: ${
                    (route as TAppRouteProp<StackScreenName.CLIENT>).params.clientID
                }`
            ),
        }),

        [StackScreenName.ADMIN_VIEW]: {
            headerShown: true,
            header: DefaultHeader(i18n.t("screenNames.viewUser")),
        },

        [StackScreenName.ADMIN_EDIT]: {
            headerShown: true,
            header: DefaultHeader(i18n.t("screenNames.editUser")),
        },

        [StackScreenName.ADMIN_NEW]: {
            headerShown: true,
            header: DefaultHeader(i18n.t("screenNames.newUser")),
        },

        [StackScreenName.VISIT]: ({ route }) => ({
            headerShown: true,
            header: DefaultHeader(
                i18n.t("screenNames.newVisit"),
                `${i18n.t("general.client")} ${i18n.t("general.name")}: ${
                    (route as TAppRouteProp<StackScreenName.VISIT>).params.clientID
                }`
            ),
        }),

        [StackScreenName.REFERRAL]: ({ route }) => ({
            headerShown: true,
            header: DefaultHeader(
                i18n.t("screenNames.newReferral"),
                `${i18n.t("general.client")} ${i18n.t("general.name")}: ${
                    (route as TAppRouteProp<StackScreenName.REFERRAL>).params.clientID
                }`
            ),
        }),

        [StackScreenName.BASE_SURVEY]: ({ route }) => ({
            headerShown: true,
            header: DefaultHeader(
                i18n.t("screenNames.newBaselineSurvey"),
                `${i18n.t("general.client")} ${i18n.t("general.name")}: ${
                    (route as TAppRouteProp<StackScreenName.BASE_SURVEY>).params.clientID
                }`
            ),
        }),

        [StackScreenName.SYNC]: {
            headerShown: true,
            header: DefaultHeader(i18n.t("screenNames.synchronization")),
        },

        [StackScreenName.ALERT_INBOX]: {
            headerShown: true,
            header: DefaultHeader(i18n.t("screenNames.inbox")),
        },

        [NoAuthScreenName.LOGIN]: {
            headerShown: false,
        },

        [NoAuthScreenName.SWITCH_SERVER]: {
            headerShown: true,
            header: DefaultHeader(i18n.t("screenNames.switchTargetServer")),
        },
    };
};

refreshArrays();
i18n.on("languageChanged", refreshArrays);
