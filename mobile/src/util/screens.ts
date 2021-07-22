import React from "react";
import { UserRole } from "@cbr/common";
import Todo from "../screens/Todo/Todo";
import ClientList from "../screens/ClientList/ClientList";
import BaseSurvey from "../screens/BaseSurvey/BaseSurvey";
import Profile from "../screens/Profile/Profile";
import Dashboard from "../screens/DashBoard/Dashboard";

export interface IScreen {
    name: string;
    roles?: UserRole[];
    Component: React.ComponentType<any>;
    iconName?: string;
}

export const screens: IScreen[] = [
    {
        name: "Dashboard",
        Component: Dashboard,
        iconName: "home",
    },
    // TODO: Waiting until clients screen is done
    // For test and view, it is supposed to connect with new client screen
    {
        name: "New Client",
        Component: BaseSurvey,
        iconName: "plus-circle",
    },
    {
        name: "Client List",
        Component: ClientList,
        iconName: "format-list-bulleted",
    },
    {
        name: "Profile",
        Component: Profile,
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
    {
        name: "Baseline Survey",
        roles: [UserRole.CLINICIAN],
        Component: BaseSurvey,
    },
];

export const defaultPage = screens[0];
