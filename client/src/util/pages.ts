import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import HomeIcon from "@material-ui/icons/Home";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Logout from "pages/Logout/Logout";
import ToDo from "pages/ToDo/ToDo";
import User from "pages/User/User";
import ClientForm from "pages/Client/ClientForm";
import NotFound from "pages/NotFound/NotFound";

export interface IPage {
    path: string;
    exact?: boolean;
    name: string;
    Component: React.ComponentType<any>;
    showInNav: boolean;
    Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export const pages: IPage[] = [
    {
        path: "/dashboard",
        name: "Dashboard",
        Component: ToDo,
        showInNav: true,
        Icon: HomeIcon,
    },
    {
        path: "/clients/new",
        name: "New Client",
        showInNav: true,
        Component: ClientForm,
        Icon: AddCircleIcon,
    },
    {
        path: "/clients",
        name: "Client List",
        Component: ToDo,
        showInNav: true,
        Icon: FormatListBulletedIcon,
    },
    {
        path: "/user",
        name: "Profile",
        Component: User,
        showInNav: true,
        Icon: PersonIcon,
    },
    {
        path: "/admin",
        name: "Admin",
        Component: ToDo,
        showInNav: true,
        Icon: SettingsIcon,
    },
    {
        path: "/logout",
        name: "Log out",
        Component: Logout,
        showInNav: true,
        Icon: ExitToAppIcon,
    },
    // must be at the bottom
    {
        path: "/",
        exact: false,
        name: "Not Found",
        Component: NotFound,
        showInNav: false,
    },
];
