import React from "react";
import { UserRole } from "@cbr/common";
import Todo from "../screens/Todo/Todo";
import ClientList from "../screens/ClientList/ClientList";
import Profile from "../screens/Profile/Profile";
import UserList from "../screens/UserList/UserList";
import Dashboard from "../screens/DashBoard/Dashboard";
import NewClient from "../screens/NewClient/NewClient";
import { TabModal } from "../components/TabModal/TabModal";

export interface IScreen {
    name: string;
    roles?: UserRole[];
    Component: React.ComponentType<any>;
    iconName?: string;
    iconBadge?: boolean;
    disableSync?: boolean;
}

export const screens: IScreen[] = [
    {
        name: "Dashboard",
        Component: Dashboard,
        iconName: "home",
    },
    {
        name: "New Client",
        Component: NewClient,
        iconName: "plus-circle",
    },
    {
        name: "Client List",
        Component: ClientList,
        iconName: "format-list-bulleted",
    },
    {
        name: "Sync",
        Component: TabModal,
        iconName: "sync-alert",
    },
    {
        name: "Profile",
        roles: [UserRole.CLINICIAN, UserRole.WORKER],
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
        Component: UserList,
        iconName: "account-cog",
    },
];

export const defaultPage = screens[0];
