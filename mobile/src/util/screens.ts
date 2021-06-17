import React from "react";
import { APILoadError, IUser, TAPILoadError, UserRole } from "@cbr/common";
import Todo from "../screens/Todo/Todo";
import ClientList from "../screens/ClientList/ClientList";
import ClientView from "../screens/Client/Client";

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
        iconName: "chart-box",
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
