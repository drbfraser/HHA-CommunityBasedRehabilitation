import Logout from "pages/Logout/Logout";
import ToDo from "pages/ToDo/ToDo";
import User from "pages/User/User";

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
        Component: ToDo,
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
        name: "User Profile",
        showInNav: true,
        Component: User,
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
