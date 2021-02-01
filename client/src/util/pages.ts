import Logout from "pages/Logout/Logout";
import ToDo from "pages/ToDo/ToDo";
import NewClient from "pages/Client/NewClient";

export interface IPage {
    path: string;
    icon: string;
    name: string;
    showInNav: boolean;
    Component: React.ComponentType<any>;
}

export const pages: IPage[] = [
    {
        path: "/dashboard",
        icon: "home",
        name: "Dashboard",
        showInNav: true,
        Component: ToDo,
    },
    {
        path: "/clients/new",
        icon: "plus-circle",
        name: "New Client",
        showInNav: true,
        Component: NewClient,
    },
    {
        path: "/clients",
        icon: "list-ul",
        name: "Client List",
        showInNav: true,
        Component: ToDo,
    },
    {
        path: "/user",
        icon: "user",
        name: "Profile",
        showInNav: true,
        Component: ToDo,
    },
    {
        path: "/admin",
        icon: "cog",
        name: "Admin",
        showInNav: true,
        Component: ToDo,
    },
    {
        path: "/logout",
        icon: "sign-out",
        name: "Log out",
        showInNav: true,
        Component: Logout,
    },
];
