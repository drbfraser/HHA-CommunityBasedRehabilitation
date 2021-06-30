import React from "react";
import { APILoadError, IUser, TAPILoadError, UserRole } from "@cbr/common";
import Todo from "../screens/Todo/Todo";
import ClientList from "../screens/ClientList/ClientList";
import ClientView from "../screens/Client/Client";
import ClientScreenController from "../screens/Client/ClientScreenController";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import { Props } from "react-native-paper/lib/typescript/components/RadioButton/RadioButton";
import HomeScreenController from "../screens/HomeScreen/HomeScreenController";
import Login from "../screens/Login/Login";
import Loading from "../screens/Loading/Loading";

export interface IScreen {
    name: string;
    roles?: UserRole[];
    Component: React.ComponentType<any>;
    iconName?: string;
}

const screens: IScreen[] = [
    {
        name: "Dashboard",
        Component: Todo,
        iconName: "home",
    },
    {
        name: "New Client",
        Component: Todo,
        iconName: "plus-circle",
    },
    {
        name: "Client List",
        Component: ClientList,
        iconName: "format-list-bulleted",
    },
    {
        name: "Profile",
        Component: Todo,
        iconName: "account",
    },
    {
        name: "Stats",
        roles: [UserRole.ADMIN],
        Component: Todo,
        iconName: "chart-bar",
    },
    {
        name: "Admin",
        roles: [UserRole.ADMIN],
        Component: Todo,
        iconName: "account-cog",
    },
];

export const screensForUser = (user: IUser | TAPILoadError | undefined) => {
    return screens.filter((screen) => {
        if (!screen.roles) {
            return true;
        }

        if (!user || user === APILoadError) {
            return false;
        }

        return screen.roles.includes(user.role);
    });
};

export const defaultPage = screens[0];

//Stack screens coming up from here on

export enum stackScreenName {
    HOME = "Home",
    CLIENT = "ClientDetails",
    LOGIN = "Login"
    LOADING = "Loading"
  }

export const stackScreenProps = {
    [stackScreenName.HOME]: HomeScreenController,
    [stackScreenName.CLIENT]: ClientScreenController,
    [stackScreenName.LOGIN]: Login,
    [stackScreenName.LOADING]: Loading,
}

export type stackParamList = {
    [stackScreenName.HOME]: undefined;
    [stackScreenName.CLIENT]: {
        clientID: number,
    }
    [stackScreenName.LOGIN]: undefined;
    [stackScreenName.LOADING]: undefined;
  };