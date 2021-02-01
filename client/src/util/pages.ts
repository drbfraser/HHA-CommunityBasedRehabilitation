import Logout from "pages/Logout/Logout";
import ToDo from "pages/ToDo/ToDo";
import UserProfile from "pages/User/UserProfile";
import UserEdit from "pages/User/UserEdit";

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
        name: "Profile",
        showInNav: true,
        Component: UserProfile,
    },
    {
        path: "/user/edit",
        icon: "user",
        name: "Profile Edit",
        showInNav: false,
        Component: UserEdit,
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
